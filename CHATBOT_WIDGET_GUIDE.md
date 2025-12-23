# 💬 Floating Chatbot Widget Guide

## Overview

The Expense Tracker now includes a **floating AI-powered chatbot widget** that appears on the right side of your screen on all authenticated pages. This widget allows you to ask questions about your spending, get personalized recommendations, and receive spending predictions - all in real-time!

## Features

### 🎯 Core Capabilities

1. **Ask Anything About Your Expenses**
   - Get instant analysis of spending patterns
   - Ask about specific categories
   - Inquire about budget status
   - Ask for saving recommendations

2. **Spending Predictions**
   - Forecast next month's spending based on trends
   - Understand seasonal patterns
   - Plan better budgets with AI predictions

3. **Real-Time Conversation**
   - Natural language Q&A with your AI financial advisor
   - Multi-turn conversations with context awareness
   - Message history for continuity

4. **Quick Ask Buttons**
   - Pre-configured quick questions for faster access
   - "Spending trends" - Understand your trend direction
   - "Save money tips" - Get personalized recommendations
   - "Budget status" - Check your current budget position
   - "Future prediction" - See predicted spending for next month

5. **Dark Mode Support**
   - Seamlessly matches your app's theme
   - Beautiful UI in both light and dark modes

## How to Use

### Opening the Widget

1. Look for the **💬 chat bubble icon** on the bottom-right corner of your screen
2. Click the icon to open the chat window
3. The widget will expand showing the conversation interface

### Asking Questions

1. **Type your question** in the input field at the bottom
2. **Press "Send"** or hit Enter
3. The AI will analyze your expense data and respond with insights

### Using Quick Ask Buttons

At the bottom of the chat window, you'll find 4 quick ask buttons:

- **Spending trends** - "What are my spending trends?"
- **Save money tips** - "Where can I save money?"
- **Budget status** - "What is my budget status?"
- **Future prediction** - "Predict my next month spending"

Simply click any button and the AI will respond immediately!

### Closing the Widget

1. Click the **✕** (close icon) on the top-right of the chat bubble
2. The widget collapses back to the floating icon
3. Your message history is preserved when you reopen it

## Example Questions You Can Ask

### Spending Analysis
- "What are my spending trends?"
- "Where am I spending the most?"
- "How does this month compare to last month?"
- "Which categories are eating up my budget?"

### Budget Management
- "What is my budget status?"
- "Am I over budget in any categories?"
- "How much have I spent this month?"
- "Do I have budget remaining?"

### Saving Tips
- "Where can I save money?"
- "How can I reduce my spending?"
- "What's my biggest expense category?"
- "What are money-saving recommendations?"

### Predictions & Planning
- "Predict my next month spending"
- "What should I budget for next month?"
- "Will my spending increase or decrease?"
- "What's my spending projection for Q2?"

### Anomalies
- "Do I have any unusual expenses?"
- "What are my anomalies?"
- "Are there any strange transactions?"
- "Which expenses stand out?"

## AI Providers

The chatbot widget uses **Google Gemini API** as the primary AI engine with intelligent fallback:

### Gemini API (Free & Fast)
- **Status**: ✅ Configured and active
- **API Key**: Located in backend `.env`
- **Model**: gemini-pro (latest)
- **Cost**: Free tier with generous limits

### OpenAI (Fallback)
- **Status**: Available as fallback
- **API Key**: Optional in backend `.env`
- **Model**: gpt-3.5-turbo
- **Cost**: Paid service

### Rule-Based Fallback
- **Status**: Always available as last resort
- **Provides**: Context-aware intelligent responses
- **No API Required**: Doesn't count towards API usage

## Technical Details

### Frontend Components

- **ChatWidget.js** (`frontend/src/components/ChatWidget.js`)
  - Main floating widget component
  - Handles UI rendering and user interactions
  - Manages message history state
  - Supports dark mode

### Backend Routes

- **POST /api/insights/chat**
  - Accepts user messages
  - Analyzes spending context
  - Returns AI-powered responses
  - Fallback to rule-based insights if AI unavailable

### API Integration

- **analyticsAPI.chatWithAI(message)**
  - Frontend method to send messages
  - Located in `frontend/src/services/api.js`
  - Includes JWT authentication
  - Automatic error handling

## Widget Behavior

### Message Display
- **User messages** appear on the right in blue
- **AI responses** appear on the left in gray
- **Timestamps** shown for each message
- **Timestamps** update in local timezone

### Loading State
- Animated loading dots appear while AI processes
- Input field disabled during processing
- Send button disabled until response arrives

### Context Awareness
The AI has access to:
- Last 6 months of spending data
- Category breakdown
- Monthly trends
- Budget information
- Spending anomalies

## Customization

### Change Widget Position

Edit `ChatWidget.js` to change:
```javascript
// Current: bottom-right
className={`fixed bottom-6 right-6 ...`}

// To move to different corners:
// Bottom-left: bottom-6 left-6
// Top-right: top-6 right-6
// Top-left: top-6 left-6
```

### Change Widget Icon
```javascript
// Current icons:
{isOpen ? '✕' : '💬'}

// Try other emoji:
{isOpen ? '❌' : '🤖'}  // Robot icon
{isOpen ? '🔙' : '💡'}  // Light bulb
{isOpen ? '✖️' : '📞'}  // Phone icon
```

### Adjust Widget Size
Edit the chat window dimensions:
```javascript
className={`fixed bottom-24 right-6 w-96 h-[600px] ...`}
// w-96 = width (96 * 0.25rem = 24rem)
// h-[600px] = height
```

## Troubleshooting

### Widget Not Appearing
- **Check**: Are you logged in? Widget only shows on authenticated pages
- **Check**: Is JavaScript enabled in your browser?
- **Check**: Check browser console for errors (F12 → Console)

### AI Not Responding
- **Check**: Is your Gemini API key valid?
- **Check**: Do you have expenses logged? (Widget needs data to analyze)
- **Check**: Check backend logs for API errors
- **Fallback**: Rule-based responses will activate automatically

### Messages Not Sending
- **Check**: Is your internet connection stable?
- **Check**: Are you still authenticated? (Re-login if token expired)
- **Check**: Try refreshing the page
- **Check**: Clear browser cache and retry

### Dark Mode Issues
- **Check**: Verify dark mode is enabled in the app
- **Check**: Close and reopen the widget to refresh styling
- **Check**: Clear browser cache if styling persists

## Best Practices

1. **Be Specific**: Ask detailed questions for better responses
2. **Use Context**: Reference specific months or categories
3. **Ask Follow-ups**: Build on previous answers in conversation
4. **Review Predictions**: Use AI insights for budgeting decisions
5. **Regular Checks**: Chat with AI to monitor spending regularly

## Performance Tips

- **Light Conversations**: Keep message count under 50 to avoid slowdown
- **Clear History**: Close and reopen widget to start fresh if needed
- **API Limits**: Gemini has generous free tier, but monitor usage
- **Offline Mode**: Widget requires internet for AI responses

## Future Enhancements

Planned features for the chatbot widget:

- [ ] Export chat history as PDF
- [ ] Save favorite questions
- [ ] Multi-language support
- [ ] Voice input integration
- [ ] Chart generation based on questions
- [ ] Reminder notifications
- [ ] Budget alerts via chat
- [ ] Receipt OCR integration

## Security & Privacy

- **Authentication**: All messages require valid JWT token
- **Data Privacy**: Only your expense data is analyzed
- **API Keys**: Stored securely in backend `.env`
- **No History Storage**: Messages not permanently saved (only in session)

## Support & Issues

For issues or questions:

1. Check this guide first
2. Review API keys configuration
3. Check backend logs for errors
4. Verify internet connectivity
5. Clear browser cache and retry

---

**Enjoy chatting with your Financial AI Assistant! 🎉**
