import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatbotConfig, ChatMessage } from '../types';
import { AnimationStyle } from '../types';
import { SendIcon } from './icons';

interface ChatbotWidgetProps {
  config: ChatbotConfig;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset conversation when config changes
  useEffect(() => {
     setMessages([{ id: 1, text: "Hello! I'm reconfigured. How can I help?", sender: 'bot' }]);
  }, [config.systemPrompt, config.websiteInfo, config.tone]);

  
  const getAnimationClasses = (style: AnimationStyle) => {
    switch (style) {
      case AnimationStyle.FADE_IN_UP:
        return 'animate-fade-in-up';
      case AnimationStyle.SLIDE_IN_LEFT:
        return 'animate-slide-in-left';
      case AnimationStyle.ZOOM_IN:
        return 'animate-zoom-in';
      default:
        return '';
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (userInput.trim() === '' || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const fullPrompt = `
            System instruction: ${config.systemPrompt}
            Website Information: ${config.websiteInfo}
            Tone: ${config.tone}
            User query: ${userInput}
            Response:
        `;
        
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const botText = await response.text();
        
        const botMessage: ChatMessage = {
            id: Date.now() + 1,
            text: botText,
            sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);

    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: ChatMessage = {
            id: Date.now() + 1,
            text: "Sorry, I'm having some trouble right now. Please try again later.",
            sender: 'bot'
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [userInput, isLoading, config]);

  const animationClasses = getAnimationClasses(config.animationStyle);
  
  return (
    <>
      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in-left { animation: slideInLeft 0.5s ease-out forwards; }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-zoom-in { animation: zoomIn 0.5s ease-out forwards; }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      <div className={`transition-all duration-300 ${isOpen ? 'w-80 h-96' : 'w-16 h-16'} `}>
        {isOpen ? (
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div style={{ backgroundColor: config.primaryColor }} className="flex items-center justify-between p-3 rounded-t-lg text-white">
              <div className="flex items-center gap-2">
                {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="w-8 h-8 rounded-full" />}
                <span className="font-bold">Chat Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-80 text-2xl leading-none">&times;</button>
            </div>
            {/* Messages */}
            <div className="flex-grow p-3 overflow-y-auto bg-gray-50 dark:bg-gray-700/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900/70 text-gray-800 dark:text-gray-200' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'} ${animationClasses} opacity-0`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && <div className="flex justify-start mb-2"><div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-500">Typing...</div></div>}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  disabled={isLoading}
                />
                <button
                  style={{ backgroundColor: config.primaryColor }}
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="p-2 text-white rounded-r-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center h-[40px] w-[40px]"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button style={{ backgroundColor: config.primaryColor }} onClick={() => setIsOpen(true)} className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </button>
        )}
      </div>
    </>
  );
};

export default ChatbotWidget;