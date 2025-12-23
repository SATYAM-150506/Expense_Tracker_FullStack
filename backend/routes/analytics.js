const express = require('express');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Helper function to get previous months
const getPreviousMonths = (count = 12) => {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);
  }
  return months;
};

// @desc    Get monthly analytics for current month
// @route   GET /api/analytics/monthly
// @access  Private
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month = getCurrentMonth() } = req.query;

    // Parse month string
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, parseInt(monthNum) - 1, 1);
    const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

    // Get expenses for the month
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Get budgets for the month
    const budgets = await Budget.find({
      user: req.user.id,
      month,
      isActive: true
    });

    // Calculate category-wise spending
    const categorySpending = {};
    expenses.forEach(expense => {
      if (!categorySpending[expense.category]) {
        categorySpending[expense.category] = 0;
      }
      categorySpending[expense.category] += expense.amount;
    });

    // Calculate totals
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averagePerDay = expenses.length > 0 ? totalSpent / startDate.getDate() : 0;
    const daysInMonth = endDate.getDate();
    const daysElapsed = endDate.getDate();

    // Budget comparison
    const budgetComparison = budgets.map(budget => {
      const spent = categorySpending[budget.category] || 0;
      const remaining = budget.limit - spent;
      const percentageUsed = (spent / budget.limit) * 100;

      return {
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining,
        percentageUsed: Math.round(percentageUsed),
        isExceeded: spent > budget.limit,
        alertTriggered: percentageUsed >= budget.alert_threshold
      };
    });

    res.status(200).json({
      success: true,
      month,
      summary: {
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalBudget: budgets.reduce((sum, b) => sum + b.limit, 0),
        averagePerDay: Math.round(averagePerDay * 100) / 100,
        totalExpenses: expenses.length,
        daysElapsed,
        daysInMonth,
        projectForMonth: Math.round((totalSpent / daysElapsed) * daysInMonth * 100) / 100
      },
      categorySpending,
      budgetComparison,
      topCategories: Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly analytics'
    });
  }
});

// @desc    Get spending trends over last 12 months
// @route   GET /api/analytics/trends
// @access  Private
router.get('/trends', auth, async (req, res) => {
  try {
    const months = getPreviousMonths(12);
    const trends = [];

    for (const month of months) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, parseInt(monthNum) - 1, 1);
      const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

      const expenses = await Expense.find({
        user: req.user.id,
        date: { $gte: startDate, $lte: endDate }
      });

      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      trends.push({
        month,
        total: Math.round(total * 100) / 100,
        count: expenses.length,
        average: expenses.length > 0 ? Math.round((total / expenses.length) * 100) / 100 : 0
      });
    }

    res.status(200).json({
      success: true,
      trends
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch spending trends'
    });
  }
});

// @desc    Get category breakdown for specified period
// @route   GET /api/analytics/categories
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const { month = getCurrentMonth() } = req.query;

    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, parseInt(monthNum) - 1, 1);
    const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ category: 1 });

    const categoryBreakdown = {};
    expenses.forEach(expense => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = {
          total: 0,
          count: 0,
          expenses: []
        };
      }
      categoryBreakdown[expense.category].total += expense.amount;
      categoryBreakdown[expense.category].count += 1;
      categoryBreakdown[expense.category].expenses.push({
        id: expense._id,
        title: expense.title,
        amount: expense.amount,
        date: expense.date
      });
    });

    const totalSpent = Object.values(categoryBreakdown).reduce((sum, cat) => sum + cat.total, 0);

    const categoryData = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
      percentage: totalSpent > 0 ? Math.round((data.total / totalSpent) * 100) : 0,
      average: Math.round((data.total / data.count) * 100) / 100,
      topExpense: data.expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max)
    }));

    res.status(200).json({
      success: true,
      month,
      totalSpent: Math.round(totalSpent * 100) / 100,
      categoryData: categoryData.sort((a, b) => b.total - a.total)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category breakdown'
    });
  }
});

// @desc    Get comparison between current month and previous month
// @route   GET /api/analytics/comparison
// @access  Private
router.get('/comparison', auth, async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    let prevYear = now.getFullYear();
    let prevMonth = now.getMonth();
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear--;
    }
    const previousMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

    // Get current month expenses
    const [currYear, currMonthNum] = currentMonth.split('-');
    const currStartDate = new Date(currYear, parseInt(currMonthNum) - 1, 1);
    const currEndDate = new Date(currYear, parseInt(currMonthNum), 0, 23, 59, 59);

    const currentExpenses = await Expense.find({
      user: req.user.id,
      date: { $gte: currStartDate, $lte: currEndDate }
    });

    // Get previous month expenses
    const [prevYearStr, prevMonthNum] = previousMonth.split('-');
    const prevStartDate = new Date(prevYearStr, parseInt(prevMonthNum) - 1, 1);
    const prevEndDate = new Date(prevYearStr, parseInt(prevMonthNum), 0, 23, 59, 59);

    const previousExpenses = await Expense.find({
      user: req.user.id,
      date: { $gte: prevStartDate, $lte: prevEndDate }
    });

    const currentTotal = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const previousTotal = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const difference = currentTotal - previousTotal;
    const percentageChange = previousTotal > 0 ? (difference / previousTotal) * 100 : 0;

    res.status(200).json({
      success: true,
      currentMonth: {
        month: currentMonth,
        total: Math.round(currentTotal * 100) / 100,
        count: currentExpenses.length,
        average: currentExpenses.length > 0 ? Math.round((currentTotal / currentExpenses.length) * 100) / 100 : 0
      },
      previousMonth: {
        month: previousMonth,
        total: Math.round(previousTotal * 100) / 100,
        count: previousExpenses.length,
        average: previousExpenses.length > 0 ? Math.round((previousTotal / previousExpenses.length) * 100) / 100 : 0
      },
      comparison: {
        difference: Math.round(difference * 100) / 100,
        percentageChange: Math.round(percentageChange * 100) / 100,
        trend: difference > 0 ? 'increased' : difference < 0 ? 'decreased' : 'same'
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comparison analytics'
    });
  }
});

// @desc    Get spending forecast based on current month trends
// @route   GET /api/analytics/forecast
// @access  Private
router.get('/forecast', auth, async (req, res) => {
  try {
    const { month = getCurrentMonth() } = req.query;

    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, parseInt(monthNum) - 1, 1);
    const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });

    const currentTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const daysElapsed = endDate.getDate();
    const daysInMonth = endDate.getDate();
    const avgPerDay = currentTotal / daysElapsed;
    const projectedTotal = avgPerDay * daysInMonth;
    const remainingDays = daysInMonth - daysElapsed;
    const projectedRemaining = avgPerDay * remainingDays;

    // Get category-wise forecast
    const categoryForecast = {};
    expenses.forEach(expense => {
      if (!categoryForecast[expense.category]) {
        categoryForecast[expense.category] = 0;
      }
      categoryForecast[expense.category] += expense.amount;
    });

    const categoryProjection = Object.entries(categoryForecast).map(([category, amount]) => ({
      category,
      currentSpent: Math.round(amount * 100) / 100,
      projectedTotal: Math.round((amount / daysElapsed) * daysInMonth * 100) / 100
    }));

    res.status(200).json({
      success: true,
      month,
      current: {
        spent: Math.round(currentTotal * 100) / 100,
        daysElapsed,
        avgPerDay: Math.round(avgPerDay * 100) / 100
      },
      forecast: {
        projectedTotal: Math.round(projectedTotal * 100) / 100,
        remainingDays,
        projectedRemaining: Math.round(projectedRemaining * 100) / 100
      },
      categoryProjection
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch forecast'
    });
  }
});

module.exports = router;
