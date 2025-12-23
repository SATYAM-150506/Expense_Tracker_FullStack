# 🤖 OpenAI Integration Setup Guide

## Overview
Your Expense Tracker now supports OpenAI-powered AI insights! This guide shows you how to set it up.

## Prerequisites
- Node.js 16+ (already installed)
- OpenAI Account
- API Key from OpenAI

## Step-by-Step Setup

### Step 1: Get OpenAI API Key

1. Go to **[OpenAI Platform](https://platform.openai.com/)**
2. Sign up or log in to your account
3. Navigate to **API Keys** section (https://platform.openai.com/api-keys)
4. Click **Create new secret key**
5. Copy the API key (you'll only see it once, so save it securely)
6. Click **Create**

**⚠️ Security Tips:**
- Never commit API keys to git
- Use environment variables (.env)
- Rotate keys regularly
- Set usage limits on OpenAI dashboard

### Step 2: Install OpenAI Package

```bash
cd backend
npm install openai
```

### Step 3: Add API Key to .env

Open `backend/.env` and add your API key:

```dotenv
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

Replace `sk-proj-xxxxxxxxxxxxxxxxxxxxx` with your actual API key.

### Step 4: Verify Setup

Restart your backend server:

```bash
cd backend
node server.js
```

You should see this message in console:
```
✅ OpenAI API initialized successfully
```

If you see a warning instead, check that:
- API key is correctly added to `.env`
- `npm install openai` was successful
- Backend was restarted after adding the key

### Step 5: Test AI Insights

1. Open the app and log in
2. Navigate to **Insights** page
3. You should see AI-powered insights with:
   - 🤖 OpenAI-generated recommendations
   - Personalized financial advice
   - Specific, actionable insights

## What You Get

### With OpenAI Enabled ✅
- **AI-Generated Insights**: GPT-3.5-turbo analyzes your spending
- **Personalized Recommendations**: Smart suggestions based on your data
- **Natural Language**: Human-like financial advice
- **Context Understanding**: AI understands nuances in spending patterns
- **Response**: "AI-powered insights generated"

### Without OpenAI (Fallback) 📊
- **Rule-Based Analysis**: Statistical insights
- **Pattern Detection**: Anomalies and trends
- **Category Analysis**: Top spending categories
- **Savings Estimates**: Calculated potential savings
- **Response**: "Analysis complete"

## API Key Management

### View Your Keys
1. Go to [API Keys page](https://platform.openai.com/api-keys)
2. See all your keys with last usage date
3. Revoke old keys anytime

### Set Usage Limits
1. Go to [Billing Settings](https://platform.openai.com/account/billing/overview)
2. Set monthly usage limit
3. Set soft limit for alerts

### Costs

**OpenAI Pricing (as of latest update):**
- GPT-3.5-turbo: ~$0.001 per 1K input tokens
- Average insights request: 500-1000 tokens = ~$0.001-0.002 per request

**Estimate:**
- 1 user, 1 request/day: ~$0.06-0.12/month
- 100 users, 1 request/day: ~$6-12/month
- Can add spending limits to control costs

## Troubleshooting

### Error: "OpenAI library not installed"
```bash
npm install openai
node server.js
```

### Error: "Invalid API key"
- Check API key is copied correctly (no extra spaces)
- Verify key starts with `sk-proj-`
- Ensure key is in `backend/.env` (not in quotes)
- Restart backend server after changing .env

### Error: "Rate limit exceeded"
- Wait a few minutes and retry
- Check OpenAI usage dashboard
- Consider upgrading your OpenAI plan

### Error: "401 Unauthorized"
- API key is invalid or expired
- Generate a new key from OpenAI platform
- Update .env and restart

### Insights show "Note: OpenAI API key not configured"
- API key not added to .env
- Backend not restarted after adding key
- Check `.env` file has correct key

## Testing API Key

To test if your API key works, run this in `backend` directory:

```bash
node -e "
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
(async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10
    });
    console.log('✅ API Key is valid!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ API Key error:', error.message);
  }
})();
"
```

## AI Insights Features

### What the AI Analyzes:
1. **Spending Patterns**: Historical trends over 6 months
2. **Categories**: Top spending categories
3. **Anomalies**: Unusual expenses detected
4. **Budgets**: Comparison with set budgets
5. **Trends**: Month-over-month changes

### What the AI Provides:
```json
{
  "anomalies": "Human-readable analysis of unusual spending",
  "trends": "Interpretation of spending patterns",
  "recommendations": "Specific, actionable advice",
  "savings": "Estimated potential monthly/annual savings"
}
```

## Best Practices

1. **Security**
   - Never share your API key
   - Use environment variables only
   - Rotate keys monthly
   - Set usage limits

2. **Cost Management**
   - Monitor usage on OpenAI dashboard
   - Set monthly spending limit
   - Use GPT-3.5-turbo (cheaper than GPT-4)
   - Cache frequent requests

3. **Performance**
   - AI requests may take 2-3 seconds
   - Frontend shows loading state
   - Falls back to rule-based if AI fails
   - Works offline without API key

## Fallback Mechanism

If OpenAI request fails:
1. Automatically uses rule-based insights
2. No service interruption
3. User still gets helpful analysis
4. Error is logged for debugging

## Environment Variables Reference

```dotenv
# Required for base functionality
MONGODB_URI=mongodb://localhost:27017/expense_tracker_2
JWT_SECRET=your_jwt_secret

# Optional - for AI features
OPENAI_API_KEY=sk-proj-your-key-here

# Optional - customization
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

## Advanced Configuration

### Custom System Prompt
Edit `backend/routes/insights.js` to customize AI behavior:

```javascript
{
  role: 'system',
  content: 'Your custom system prompt here'
}
```

### Custom Model
Change model in `backend/routes/insights.js`:

```javascript
model: 'gpt-3.5-turbo'  // Change to gpt-4, gpt-4-turbo, etc.
```

### Adjust Temperature
```javascript
temperature: 0.7  // Range: 0 (precise) to 1 (creative)
```

## Support

- **OpenAI Status**: https://status.openai.com/
- **OpenAI Docs**: https://platform.openai.com/docs/
- **OpenAI Community**: https://community.openai.com/

## Summary

✅ API key added to `.env`
✅ OpenAI package installed
✅ Backend initialized AI client
✅ Frontend ready to use AI insights
✅ Fallback mechanism in place
✅ Security best practices documented

Your app now has enterprise-grade AI insights! 🚀
