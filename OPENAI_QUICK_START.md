# 🚀 OpenAI Setup - Quick Reference

## 30-Second Setup

### 1. Get API Key
- Visit: https://platform.openai.com/api-keys
- Sign up / Log in
- Click "Create new secret key"
- Copy the key (starts with `sk-proj-`)

### 2. Add to .env
Open `backend/.env` and add:
```
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

### 3. Install Package
```bash
cd backend
npm install openai
```

### 4. Restart Server
```bash
node server.js
```

You should see: ✅ OpenAI API initialized successfully

## Testing

Visit **Insights** page in the app:
- Without API key → Shows rule-based insights
- With API key → Shows AI-powered insights

## Cost
~$0.001-0.002 per insight request
~$1-3/month for moderate usage

## Files Changed
- ✅ `backend/.env` - Added OPENAI_API_KEY variable
- ✅ `backend/routes/insights.js` - Updated to use OpenAI with fallback
- ✅ Automatic fallback if AI fails (no service interruption)

## Features

### AI-Powered (with key)
- Natural language insights
- Personalized recommendations
- Context-aware analysis
- Human-like explanations

### Fallback (without key)
- Statistical analysis
- Pattern detection
- Category breakdown
- Savings estimates

Both provide valuable insights - AI just makes them more personalized!

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "API key not configured" | Add to .env and restart |
| "Invalid API key" | Check OpenAI dashboard, regenerate key |
| "Rate limited" | Wait 1 minute, upgrade plan if frequent |
| "Library not installed" | `npm install openai` |

## Security Checklist
- [ ] API key in `.env` (not in code)
- [ ] `.env` added to `.gitignore`
- [ ] Never share API key
- [ ] Set spending limit on OpenAI
- [ ] Rotate key monthly

## Links
- Get Key: https://platform.openai.com/api-keys
- Billing: https://platform.openai.com/account/billing/overview
- Docs: https://platform.openai.com/docs/
- Status: https://status.openai.com/

---

**That's it! Your app now has AI-powered insights! 🎉**
