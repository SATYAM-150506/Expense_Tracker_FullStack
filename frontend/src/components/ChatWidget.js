import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { analyticsAPI } from '../services/api';

const ChatWidget = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! 👋 I\'m your Financial AI Assistant. Ask me anything about your expenses, budgets, spending patterns, or future predictions!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Send to backend for AI response
      const response = await analyticsAPI.chatWithAI(inputValue);
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-40 flex items-center justify-center hover:scale-110 ${
          isDarkMode
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
            : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
        } text-white font-bold text-xl hover:shadow-xl`}
        title="Chat with AI"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Widget Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 w-96 h-[600px] rounded-lg shadow-2xl flex flex-col z-40 overflow-hidden transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          {/* Header */}
          <div
            className={`${
              isDarkMode
                ? 'bg-gradient-to-r from-primary-600 to-primary-700'
                : 'bg-gradient-to-r from-primary-500 to-primary-600'
            } text-white p-4 flex items-center justify-between`}
          >
            <div>
              <h3 className="font-bold text-lg">💡 Financial AI</h3>
              <p className="text-xs opacity-90">Ask about expenses & predictions</p>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? isDarkMode
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-primary-500 text-white rounded-br-none'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'user'
                        ? 'text-primary-100'
                        : isDarkMode
                        ? 'text-gray-500'
                        : 'text-gray-600'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className={`px-4 py-2 rounded-lg rounded-bl-none ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: '100ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: '200ms' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className={`border-t ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            } p-4`}
          >
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your expenses..."
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-600'
                } disabled:opacity-50`}
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDarkMode
                    ? 'bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50'
                    : 'bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50'
                }`}
              >
                Send
              </button>
            </form>
          </div>

          {/* Quick Questions */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-3`}>
            <p
              className={`text-xs font-semibold mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              💡 Quick asks:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setInputValue('What are my spending trends?');
                  handleSendMessage({ preventDefault: () => {} });
                }}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Spending trends
              </button>
              <button
                onClick={() => {
                  setInputValue('Where can I save money?');
                  handleSendMessage({ preventDefault: () => {} });
                }}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Save money tips
              </button>
              <button
                onClick={() => {
                  setInputValue('What is my budget status?');
                  handleSendMessage({ preventDefault: () => {} });
                }}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Budget status
              </button>
              <button
                onClick={() => {
                  setInputValue('Predict my next month spending');
                  handleSendMessage({ preventDefault: () => {} });
                }}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Future prediction
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
