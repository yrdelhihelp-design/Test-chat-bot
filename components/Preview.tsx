
import React from 'react';
import ChatbotWidget from './ChatbotWidget';
import type { ChatbotConfig } from '../types';

interface PreviewProps {
  config: ChatbotConfig;
}

const Preview: React.FC<PreviewProps> = ({ config }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-4xl h-full max-h-[700px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col">
        {/* Fake browser chrome */}
        <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-700 rounded-t-xl border-b border-gray-200 dark:border-gray-600 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        {/* Fake website content */}
        <div className="flex-grow bg-cover bg-center relative p-8" style={{backgroundImage: 'url(https://picsum.photos/1200/800)'}}>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative">
                <h1 className="text-4xl font-bold text-white">Welcome to Our Website</h1>
                <p className="text-xl text-white/90 mt-2">This is a preview of how your chatbot will look.</p>
            </div>
            
            <div className="absolute bottom-6 right-6">
                <ChatbotWidget config={config} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
