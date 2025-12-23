const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Initialize AI client - try Gemini first, then OpenAI
let aiClient = null;
let aiProvider = null;

// Try to initialize Google Gemini
if (process.env.GEMINI_API_KEY) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    aiProvider = 'gemini';
    console.log('✅ Google Gemini API initialized successfully');
  } catch (error) {
    console.warn('⚠️ Google Generative AI library not installed. Install with: npm install @google/generative-ai');
    aiClient = null;
  }
}

// Fall back to OpenAI if Gemini not available
if (!aiClient && process.env.OPENAI_API_KEY) {
  try {
    const { OpenAI } = require('openai');
    aiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    aiProvider = 'openai';
    console.log('✅ OpenAI API initialized successfully');
  } catch (error) {
    console.warn('⚠️ OpenAI library not installed. Install with: npm install openai');
    aiClient = null;
  }
}

// Helper function to analyze spending data
const analyzeSpendingData = async (userId) => {
  try {
    // Get last 6 months of expenses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const expenses = await Expense.find({
      userId,
      date: { $gte: sixMonthsAgo }
    }).sort({ date: -1 });

    if (expenses.length === 0) {
      return null;
    }

    // Calculate spending metrics
    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgMonthlySpending = totalSpending / 6;
    const categorySpending = {};
    const monthlySpending = {};

    expenses.forEach(exp => {
      // Category breakdown
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;

      // Monthly breakdown
      const monthKey = new Date(exp.date).toISOString().slice(0, 7);
      monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + exp.amount;
    });

    // Calculate spending trends
    const sortedMonths = Object.entries(monthlySpending).sort();
    const currentMonth = sortedMonths[sortedMonths.length - 1];
    const previousMonth = sortedMonths[sortedMonths.length - 2];

    const monthlyTrend = previousMonth
      ? ((currentMonth[1] - previousMonth[1]) / previousMonth[1]) * 100
      : 0;

    // Get top categories
    const topCategories = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Identify anomalies (expenses significantly higher than average in category)
    const anomalies = [];
    const categoryAverages = {};

    Object.entries(categorySpending).forEach(([category, total]) => {
      const categoryExpenses = expenses.filter(exp => exp.category === category);
      categoryAverages[category] = total / categoryExpenses.length;
    });

    expenses.slice(0, 20).forEach(exp => {
      const categoryAvg = categoryAverages[exp.category] || 0;
      if (exp.amount > categoryAvg * 1.5) {
        anomalies.push({
          date: exp.date,
          category: exp.category,
          amount: exp.amount,
          description: exp.description,
          difference: exp.amount - categoryAvg
        });
      }
    });

    // Get budgets for comparison
    const budgets = await Budget.find({ userId, isActive: true });

    return {
      totalSpending: totalSpending.toFixed(2),
      avgMonthlySpending: avgMonthlySpending.toFixed(2),
      monthlyTrend: monthlyTrend.toFixed(2),
      expenseCount: expenses.length,
      categorySpending,
      topCategories: Object.fromEntries(topCategories),
      anomalies: anomalies.slice(0, 3),
      budgets: budgets.map(b => ({ category: b.category, limit: b.limit })),
      currentMonthSpending: currentMonth ? currentMonth[1].toFixed(2) : '0.00',
      currency: 'USD'
    };
  } catch (error) {
    console.error('Error analyzing spending:', error);
    return null;
  }
};

// Helper function to format insights prompt with detailed context
const createInsightsPrompt = (spendingData) => {
  if (!spendingData) {
    return 'The user has no expense data available. Encourage them to start logging expenses.';
  }

  return `You are a financial advisor AI. Analyze this ACTUAL spending data and provide insights based on REAL numbers.

USER'S ACTUAL SPENDING DATA (6 MONTHS):
- Total Spending: $${spendingData.totalSpending}
- Average Monthly: $${spendingData.avgMonthlySpending}
- Current Month Spending: $${spendingData.currentMonthSpending}
- Monthly Trend: ${spendingData.monthlyTrend}% (${spendingData.monthlyTrend > 0 ? 'INCREASING' : 'DECREASING'})
- Total Transactions: ${spendingData.expenseCount}

CATEGORY BREAKDOWN (sorted by amount):
${Object.entries(spendingData.topCategories)
  .map(([cat, amt], idx) => {
    const percent = ((amt / parseFloat(spendingData.totalSpending)) * 100).toFixed(1);
    const monthly = (amt / 6).toFixed(2);
    return `${idx + 1}. ${cat}: $${amt.toFixed(2)} (${percent}% of total, ~$${monthly}/month)`;
  })
  .join('\n')}

UNUSUAL EXPENSES (ANOMALIES):
${spendingData.anomalies && spendingData.anomalies.length > 0
  ? spendingData.anomalies.slice(0, 5)
    .map(a => `- ${a.category}: $${a.amount} on ${new Date(a.date).toLocaleDateString()} (${a.description}) - $${a.difference.toFixed(2)} above category average`)
    .join('\n')
  : '- None detected. Spending is consistent.'}

BUDGET INFORMATION:
${spendingData.budgets.length > 0
  ? spendingData.budgets.map(b => {
    const spent = spendingData.topCategories[b.category] || 0;
    const percent = ((spent / b.limit) * 100).toFixed(0);
    const status = percent > 100 ? '⚠️ OVER' : '✅ OK';
    return `- ${b.category}: $${spent.toFixed(2)} spent / $${b.limit} limit (${percent}%) ${status}`;
  }).join('\n')
  : '- No budgets set'}

INSTRUCTIONS:
1. Provide SPECIFIC numbers from this data, not generic advice
2. Reference actual amounts, percentages, and dates
3. Give 4 actionable insights based on THIS USER'S data
4. Format response as valid JSON with keys: anomalies, trends, recommendations, savings

Example good response:
{
  "anomalies": "You have a $250 restaurant expense on Dec 15, which is $120 above your food category average. This is your highest anomaly.",
  "trends": "Your spending increased 5.2% this month to $900 vs your $833 average. Food ($250) and Transport ($150) are driving this increase.",
  "recommendations": "1) Reduce food by $100/month to reach budget. 2) Use public transport instead of taxi. 3) Set alerts at 80% of category limits.",
  "savings": "Reducing food to average would save $120/month ($1,440/year). Combining all categories could save $250/month ($3,000/year)."
}

Now provide YOUR insights based on THIS USER'S data:`;
};

// Helper function to generate rule-based insights when AI is not available
const generateFallbackInsights = (spendingData) => {
  if (!spendingData) {
    return {
      anomalies: 'No data available',
      trends: 'Start logging expenses to see trends',
      recommendations: 'Log your daily expenses to get personalized recommendations',
      savings: 'N/A'
    };
  }

  const topCategory = Object.entries(spendingData.topCategories)[0];
  const topCategoryName = topCategory ? topCategory[0] : 'Unknown';
  const topCategoryAmount = topCategory ? topCategory[1] : 0;
  const savingsAmount = topCategoryAmount * 0.1;
  const totalTopCategories = Object.values(spendingData.topCategories).reduce((a, b) => a + b, 0);
  const percentageOfTotal = ((totalTopCategories / parseFloat(spendingData.totalSpending)) * 100).toFixed(0);

  return {
    anomalies: spendingData.anomalies.length > 0
      ? `Found ${spendingData.anomalies.length} unusual expense(s): ${spendingData.anomalies.map(a => `${a.category} ($${a.amount.toFixed(2)})`).join(', ')}. These are ${spendingData.anomalies[0] ? Math.round((spendingData.anomalies[0].difference / parseFloat(spendingData.avgMonthlySpending)) * 100) : 0}% higher than your category average.`
      : 'No significant spending anomalies detected. Your expenses are following normal patterns.',
    trends: `Your spending is ${spendingData.monthlyTrend > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(spendingData.monthlyTrend).toFixed(1)}% month-over-month. You're averaging $${spendingData.avgMonthlySpending}/month over the last 6 months, with current month at $${spendingData.currentMonthSpending}.`,
    recommendations: `1) Focus on ${topCategoryName} (your highest category at $${topCategoryAmount.toFixed(2)}). 2) Your top 5 categories account for ${percentageOfTotal}% of spending - review these for savings opportunities. 3) Set up budget alerts to control spending in ${topCategoryName}. 4) Consider meal planning or cashback strategies based on your spending pattern.`,
    savings: `Reducing ${topCategoryName} by 10% could save ~$${savingsAmount.toFixed(2)}/month (~$${(savingsAmount * 12).toFixed(2)}/year). If implemented across top categories, potential annual savings: $${(savingsAmount * 12 * 2.5).toFixed(2)}.`
  };
};

// Helper function to parse insights from natural language text
const parseInsightsFromText = (text) => {
  // Try to extract key sections from the response
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    anomalies: lines[0] || 'No anomalies detected',
    trends: lines[1] || 'Spending is stable',
    recommendations: lines[2] || 'Review your spending categories',
    savings: lines[3] || 'Potential savings available'
  };
};

// GET /insights - Get AI-powered spending insights
router.get('/', auth, async (req, res) => {
  try {
    const spendingData = await analyzeSpendingData(req.userId);

    if (!spendingData) {
      return res.json({
        message: 'No expense data available. Start logging expenses to get insights.',
        insights: null,
        rawData: null,
        aiPowered: false,
        provider: null
      });
    }

    // Try to use AI if available
    if (aiClient && aiProvider) {
      try {
        const prompt = createInsightsPrompt(spendingData);
        let insights = {};

        if (aiProvider === 'gemini') {
          // Use Google Gemini
          const model = aiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });
          const result = await model.generateContent(prompt);
          const response = result.response;
          const insightsText = response.text();

          try {
            // Try to extract JSON from response
            const jsonMatch = insightsText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              insights = JSON.parse(jsonMatch[0]);
            } else {
              insights = parseInsightsFromText(insightsText);
            }
          } catch (parseError) {
            console.log('Could not parse Gemini response as JSON, using fallback');
            insights = generateFallbackInsights(spendingData);
          }

          return res.json({
            message: 'AI-powered insights generated by Gemini',
            insights,
            rawData: spendingData,
            aiPowered: true,
            provider: 'gemini'
          });

        } else if (aiProvider === 'openai') {
          // Use OpenAI
          const response = await aiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
              role: 'system',
              content: 'You are a helpful financial advisor. Provide specific, actionable insights about spending habits. Always respond in valid JSON format with keys: anomalies, trends, recommendations, savings.'
            }, {
              role: 'user',
              content: prompt
            }],
            temperature: 0.7,
            max_tokens: 500
          });

          const insightsText = response.choices[0].message.content;

          try {
            insights = JSON.parse(insightsText);
          } catch (parseError) {
            console.log('Could not parse OpenAI response as JSON, using fallback');
            insights = generateFallbackInsights(spendingData);
          }

          return res.json({
            message: 'AI-powered insights generated by OpenAI',
            insights,
            rawData: spendingData,
            aiPowered: true,
            provider: 'openai'
          });
        }

      } catch (aiError) {
        console.error('AI API error:', aiError);
        // Fall back to rule-based insights if AI fails
        const fallbackInsights = generateFallbackInsights(spendingData);
        return res.json({
          message: 'AI insights unavailable, showing analytical insights',
          insights: fallbackInsights,
          rawData: spendingData,
          aiPowered: false,
          provider: null,
          note: 'AI request failed, using fallback analysis'
        });
      }
    }

    // Use rule-based insights if no AI is configured
    const fallbackInsights = generateFallbackInsights(spendingData);
    return res.json({
      message: 'Analysis complete',
      insights: fallbackInsights,
      rawData: spendingData,
      aiPowered: false,
      provider: null,
      note: 'No AI API key configured. Add GEMINI_API_KEY or OPENAI_API_KEY in .env to enable AI insights.'
    });

  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// GET /insights/categories - Category-specific insights
router.get('/categories/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const categoryExpenses = await Expense.find({
      userId: req.userId,
      category,
      date: { $gte: threeMonthsAgo }
    }).sort({ date: -1 });

    if (categoryExpenses.length === 0) {
      return res.json({ message: 'No expenses in this category' });
    }

    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avg = total / categoryExpenses.length;
    const max = Math.max(...categoryExpenses.map(e => e.amount));
    const min = Math.min(...categoryExpenses.map(e => e.amount));

    // Get budget for this category
    const budget = await Budget.findOne({
      userId: req.userId,
      category
    });

    res.json({
      category,
      total: total.toFixed(2),
      average: avg.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2),
      count: categoryExpenses.length,
      budget: budget ? {
        limit: budget.limit,
        spent: total,
        remaining: budget.limit - total,
        percentage: ((total / budget.limit) * 100).toFixed(2)
      } : null,
      recentExpenses: categoryExpenses.slice(0, 5)
    });

  } catch (error) {
    console.error('Category insights error:', error);
    res.status(500).json({ error: 'Failed to get category insights' });
  }
});

// GET /insights/anomalies - Detect spending anomalies
router.get('/anomalies', auth, async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: threeMonthsAgo }
    });

    if (expenses.length === 0) {
      return res.json({ anomalies: [] });
    }

    // Calculate category averages
    const categoryStats = {};
    expenses.forEach(exp => {
      if (!categoryStats[exp.category]) {
        categoryStats[exp.category] = [];
      }
      categoryStats[exp.category].push(exp.amount);
    });

    // Calculate standard deviation and find anomalies
    const anomalies = [];
    Object.entries(categoryStats).forEach(([category, amounts]) => {
      const avg = amounts.reduce((a, b) => a + b) / amounts.length;
      const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
      const stdDev = Math.sqrt(variance);
      const threshold = avg + (stdDev * 1.5);

      expenses.forEach(exp => {
        if (exp.category === category && exp.amount > threshold) {
          anomalies.push({
            date: exp.date,
            category: exp.category,
            amount: exp.amount,
            description: exp.description,
            avgForCategory: avg.toFixed(2),
            excessAmount: (exp.amount - avg).toFixed(2),
            severity: exp.amount > avg + stdDev * 2 ? 'high' : 'medium'
          });
        }
      });
    });

    res.json({
      anomalies: anomalies.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
    });

  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({ error: 'Failed to detect anomalies' });
  }
});

// POST /insights/chat - Chat with AI about expenses
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const spendingData = await analyzeSpendingData(req.userId);

    // Create DETAILED context about the user's spending for the AI
    let contextPrompt = `You are a financial advisor AI. Answer the user's question using ONLY their actual spending data below. Provide specific numbers and percentages from their data, not generic advice.

USER'S ACTUAL SPENDING DATA (Last 6 Months):
- Total Spending: $${spendingData ? spendingData.totalSpending : '0.00'}
- Average Monthly: $${spendingData ? spendingData.avgMonthlySpending : '0.00'}
- Current Month: $${spendingData ? spendingData.currentMonthSpending : '0.00'}
- Monthly Trend: ${spendingData ? (spendingData.monthlyTrend > 0 ? '+' : '') + spendingData.monthlyTrend + '%' : 'N/A'} (${spendingData && spendingData.monthlyTrend > 0 ? 'INCREASING' : 'DECREASING'})
- Transaction Count: ${spendingData ? spendingData.expenseCount : '0'}

SPENDING BY CATEGORY (Ranked):
${spendingData && Object.keys(spendingData.topCategories).length > 0 
  ? Object.entries(spendingData.topCategories)
    .map(([cat, amt], idx) => {
      const percent = spendingData ? ((amt / parseFloat(spendingData.totalSpending)) * 100).toFixed(1) : '0';
      const monthly = (amt / 6).toFixed(2);
      return `${idx + 1}. ${cat}: $${amt.toFixed(2)} (${percent}%, ~$${monthly}/month)`;
    })
    .join('\n')
  : 'No category data'}

UNUSUAL EXPENSES:
${spendingData && spendingData.anomalies && spendingData.anomalies.length > 0 
  ? spendingData.anomalies.slice(0, 3)
    .map(a => `- ${a.category}: $${a.amount} (${a.description}) - $${a.difference.toFixed(2)} above avg`)
    .join('\n')
  : 'None detected'}

BUDGETS:
${spendingData && spendingData.budgets && spendingData.budgets.length > 0
  ? spendingData.budgets.map(b => {
    const spent = spendingData.topCategories[b.category] || 0;
    const percent = ((spent / b.limit) * 100).toFixed(0);
    return `${b.category}: $${spent.toFixed(2)} / $${b.limit} (${percent}%)`;
  }).join('\n')
  : 'No budgets configured'}

User Question: "${message}"

IMPORTANT: 
1. Answer based ONLY on their actual data above
2. Use specific dollar amounts and percentages from their data
3. Be conversational but data-backed (2-3 sentences max)
4. If they ask about something not in the data, say you need more information
5. Make personalized recommendations based on their unique situation`;

    // Try to use AI if available
    let response = '';

    if (aiClient && aiProvider === 'gemini') {
      try {
        const model = aiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(contextPrompt);
        response = result.response.text();
      } catch (aiError) {
        console.error('Gemini error:', aiError);
        response = null;
      }
    } else if (aiClient && aiProvider === 'openai') {
      try {
        const openaiResponse = await aiClient.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: 'You are a financial advisor. Answer ONLY based on the user\'s actual spending data provided. Always cite specific dollar amounts, percentages, and category names. Be concise (2-3 sentences). Make personalized recommendations based on their real numbers, not generic advice.'
          }, {
            role: 'user',
            content: contextPrompt
          }],
          temperature: 0.7,
          max_tokens: 400
        });
        response = openaiResponse.choices[0].message.content;
      } catch (aiError) {
        console.error('OpenAI error:', aiError);
        response = null;
      }
    }

    // If AI fails or not configured, use intelligent fallback
    if (!response) {
      response = generateChatFallback(message, spendingData);
    }

    res.json({
      response,
      aiPowered: !!response && response !== generateChatFallback(message, spendingData),
      provider: aiProvider
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Helper function for fallback chat responses - Data-Driven & Personalized
const generateChatFallback = (question, spendingData) => {
  const questionLower = question.toLowerCase();

  if (spendingData && spendingData.totalSpending) {
    // ===== SPENDING TRENDS =====
    if (questionLower.includes('trend') || questionLower.includes('pattern') || questionLower.includes('how is my')) {
      const trend = parseFloat(spendingData.monthlyTrend);
      const trendDirection = trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable';
      const trendMagnitude = Math.abs(trend).toFixed(1);
      const currentMonth = parseFloat(spendingData.currentMonthSpending);
      const avgMonthly = parseFloat(spendingData.avgMonthlySpending);
      const difference = (currentMonth - avgMonthly).toFixed(2);
      
      let trendAnalysis = `Your spending is ${trendDirection} by ${trendMagnitude}% month-over-month. `;
      
      if (currentMonth > avgMonthly) {
        trendAnalysis += `Your current month ($${currentMonth.toFixed(2)}) is $${difference} higher than your 6-month average ($${avgMonthly}). `;
      } else {
        trendAnalysis += `Your current month ($${currentMonth.toFixed(2)}) is $${Math.abs(difference)} lower than your 6-month average ($${avgMonthly}). `;
      }
      
      const topCategory = Object.entries(spendingData.topCategories)[0];
      const topCategoryPercent = ((topCategory[1] / parseFloat(spendingData.totalSpending)) * 100).toFixed(1);
      trendAnalysis += `${topCategory[0]} is your biggest category at $${topCategory[1].toFixed(2)} (${topCategoryPercent}% of total spending). This ${trend > 0 ? 'upward' : 'stable'} trend is important to monitor.`;
      
      return trendAnalysis;
    }

    // ===== BUDGET STATUS =====
    if (questionLower.includes('budget') || questionLower.includes('status') || questionLower.includes('how much spent')) {
      const total = parseFloat(spendingData.totalSpending);
      const avg = parseFloat(spendingData.avgMonthlySpending);
      const current = parseFloat(spendingData.currentMonthSpending);
      const expenseCount = spendingData.expenseCount;
      
      let topCategoryInfo = '';
      const topCategories = Object.entries(spendingData.topCategories).slice(0, 3);
      
      if (topCategories.length > 0) {
        topCategoryInfo = `Your top 3 categories: ${topCategories.map(([cat, amt], idx) => `${idx+1}. ${cat} ($${amt.toFixed(2)})`).join(', ')}. `;
      }

      if (spendingData.budgets && spendingData.budgets.length > 0) {
        let budgetStatus = 'Budget Status: ';
        spendingData.budgets.forEach(budget => {
          const categorySpent = spendingData.topCategories[budget.category] || 0;
          const percent = ((categorySpent / budget.limit) * 100).toFixed(0);
          if (percent > 100) {
            budgetStatus += `${budget.category}: OVER BUDGET by $${(categorySpent - budget.limit).toFixed(2)} (${percent}%), `;
          } else {
            budgetStatus += `${budget.category}: ${percent}% of $${budget.limit}, `;
          }
        });
        return `Total spent (6 months): $${total.toFixed(2)} across ${expenseCount} transactions. Average monthly: $${avg}. Current month: $${current.toFixed(2)}. ${topCategoryInfo}${budgetStatus}`;
      }

      return `Total spent (6 months): $${total.toFixed(2)} across ${expenseCount} transactions. Average monthly: $${avg}. Current month: $${current.toFixed(2)}. ${topCategoryInfo}You're tracking your money well!`;
    }

    // ===== SAVINGS OPPORTUNITIES =====
    if (questionLower.includes('save') || questionLower.includes('reduce') || questionLower.includes('cut') || questionLower.includes('save money')) {
      const topCategories = Object.entries(spendingData.topCategories).slice(0, 3);
      let savingsTips = '';
      
      topCategories.forEach((item, idx) => {
        const [category, amount] = item;
        const percent = idx === 0 ? 15 : idx === 1 ? 10 : 8;
        const savingsAmount = (amount * (percent / 100)).toFixed(2);
        const annualSavings = (savingsAmount * 12).toFixed(2);
        
        savingsTips += `${idx + 1}. ${category}: Reduce by ${percent}% could save $${savingsAmount}/month ($${annualSavings}/year). `;
      });
      
      const totalPotentialSavings = topCategories.reduce((sum, [_, amt]) => {
        return sum + (amt * 0.1); // 10% average reduction
      }, 0).toFixed(2);
      
      const annomalies = spendingData.anomalies || [];
      if (annomalies.length > 0) {
        savingsTips += `Also, you have ${annomalies.length} unusual expenses that could be avoided. `;
      }
      
      savingsTips += `Total potential savings: ~$${totalPotentialSavings}/month or $${(totalPotentialSavings * 12).toFixed(2)}/year.`;
      return savingsTips;
    }

    // ===== CATEGORY BREAKDOWN =====
    if (questionLower.includes('categor') || questionLower.includes('where') || questionLower.includes('breakdown') || questionLower.includes('spending by')) {
      const topFive = Object.entries(spendingData.topCategories);
      const total = parseFloat(spendingData.totalSpending);
      
      let breakdown = 'Your spending breakdown (6 months): ';
      topFive.forEach(([category, amount], idx) => {
        const percent = ((amount / total) * 100).toFixed(1);
        const monthly = (amount / 6).toFixed(2);
        breakdown += `${idx + 1}. ${category}: $${amount.toFixed(2)} (${percent}%, ~$${monthly}/month), `;
      });
      
      breakdown += `These ${topFive.length} categories represent your complete spending pattern.`;
      return breakdown;
    }

    // ===== FUTURE PREDICTIONS =====
    if (questionLower.includes('predict') || questionLower.includes('next month') || questionLower.includes('forecast') || questionLower.includes('will spend')) {
      const avgMonthly = parseFloat(spendingData.avgMonthlySpending);
      const trend = parseFloat(spendingData.monthlyTrend);
      const trendFactor = (100 + trend) / 100;
      const predicted = (avgMonthly * trendFactor).toFixed(2);
      
      const lowEstimate = (avgMonthly * 0.9).toFixed(2);
      const highEstimate = (predicted * 1.1).toFixed(2);
      
      const current = parseFloat(spendingData.currentMonthSpending);
      const topCategory = Object.entries(spendingData.topCategories)[0];
      const topCatPredicted = (topCategory[1] * trendFactor).toFixed(2);
      
      let prediction = `Based on your ${trend > 0 ? 'increasing' : 'stable'} trend (${trend > 0 ? '+' : ''}${trend.toFixed(1)}%): `;
      prediction += `Next month prediction: $${predicted} (range: $${lowEstimate}-$${highEstimate}). `;
      prediction += `Your ${topCategory[0]} category may reach ~$${topCatPredicted}. `;
      
      if (trend > 5) {
        prediction += `⚠️ At this rate, you're on track to spend ~$${(avgMonthly * trendFactor * 12).toFixed(0)} annually, which is ${trend.toFixed(1)}% more than current pace.`;
      } else if (trend < -5) {
        prediction += `✅ Good news! Your spending is decreasing. Continue this trend to save significantly.`;
      } else {
        prediction += `Your spending appears to be stabilizing around $${avgMonthly}/month.`;
      }
      
      return prediction;
    }

    // ===== ANOMALIES & UNUSUAL EXPENSES =====
    if (questionLower.includes('anomal') || questionLower.includes('unusual') || questionLower.includes('strange') || questionLower.includes('outlier')) {
      const anomalies = spendingData.anomalies || [];
      
      if (anomalies.length === 0) {
        return '✅ No unusual spending detected. Your expenses are following consistent patterns with no significant outliers.';
      }
      
      let anomalyReport = `Found ${anomalies.length} unusual expense(s): `;
      anomalies.slice(0, 3).forEach((anomaly, idx) => {
        const percent = ((anomaly.difference / (parseFloat(spendingData.avgMonthlySpending) / 6)) * 100).toFixed(0);
        anomalyReport += `${idx + 1}. ${anomaly.category}: $${anomaly.amount} (${anomaly.description}) - ${percent}% above category average. `;
      });
      
      const totalAnomalyAmount = anomalies.reduce((sum, a) => sum + a.difference, 0).toFixed(2);
      anomalyReport += `Total excess from anomalies: $${totalAnomalyAmount}. Review and potentially avoid these types of purchases.`;
      
      return anomalyReport;
    }

    // ===== SPECIFIC CATEGORY QUESTIONS =====
    const categoryRegex = /\b(food|groceries|shopping|transport|entertainment|utilities|bills|rent|dining|restaurant|gas|electric|internet|subscription|clothing|health|gym)\b/i;
    const categoryMatch = question.match(categoryRegex);
    
    if (categoryMatch) {
      const queriedCategory = categoryMatch[1].toUpperCase();
      const categoryData = spendingData.topCategories[queriedCategory] || 
                          Object.entries(spendingData.topCategories).find(([key]) => 
                            key.toLowerCase().includes(queriedCategory.toLowerCase())
                          );
      
      if (categoryData) {
        const [category, amount] = Array.isArray(categoryData) ? categoryData : [queriedCategory, 0];
        const monthlyAvg = (amount / 6).toFixed(2);
        const percent = ((amount / parseFloat(spendingData.totalSpending)) * 100).toFixed(1);
        
        return `Your ${category} spending: $${amount.toFixed(2)} total (${percent}% of budget), averaging $${monthlyAvg}/month. This is a key category to monitor for potential savings.`;
      }
    }

    // ===== TOTAL SPENDING COMPARISON =====
    if (questionLower.includes('total') || questionLower.includes('how much') || questionLower.includes('overall')) {
      const total = parseFloat(spendingData.totalSpending);
      const avg = parseFloat(spendingData.avgMonthlySpending);
      const monthlyIncome = (avg * 1.5).toFixed(2); // Estimated - could be customized
      
      return `Total spending (6 months): $${total.toFixed(2)}. Monthly average: $${avg}. Current month: $${spendingData.currentMonthSpending}. You've logged ${spendingData.expenseCount} transactions. Based on your pattern, ensure your income is at least $${monthlyIncome} to maintain a healthy budget.`;
    }
  }

  // ===== DEFAULT/GREETING RESPONSES =====
  if (questionLower.includes('hello') || questionLower.includes('hi') || questionLower.includes('hey')) {
    return 'Hello! 👋 I\'m your Financial AI Assistant. I analyze your spending to help you make better financial decisions. Ask me about: spending trends, budget status, savings tips, future predictions, or any specific expense category!';
  }

  if (questionLower.includes('help') || questionLower.includes('what can') || questionLower.includes('capabilities')) {
    return 'I can help with: 📊 Spending Trends (analyze patterns), 💰 Budget Status (see breakdown), 💡 Savings Tips (reduce expenses), 🔮 Predictions (future spending), 🎯 Anomalies (unusual expenses), and 📈 Category Analysis (specific categories). What would you like to know?';
  }

  // ===== GENERIC FALLBACK =====
  return 'I can analyze your spending data to answer questions about trends, budget status, savings opportunities, and future predictions. Try asking: "What are my spending trends?" or "Where can I save money?" 📊';
};

module.exports = router;
