
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import CodeModal from './components/CodeModal';
import { DEFAULT_CONFIG } from './constants';
import type { ChatbotConfig } from './types';
import { GithubIcon } from './components/icons';

const App: React.FC = () => {
  const [config, setConfig] = useState<ChatbotConfig>(DEFAULT_CONFIG);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfigChange = useCallback((newConfig: Partial<ChatbotConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  }, []);
  
  const handleGenerateCode = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z"></path></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Chatbot Widget Builder</h1>
        </div>
         <a
          href="https://github.com/google/labs-prototypes/tree/main/user-gen-ui/gemini-widget-builder"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <GithubIcon className="w-6 h-6" />
        </a>
      </header>
      
      <div className="flex flex-grow overflow-hidden">
        <div className="w-full lg:w-1/3 xl:w-1/4 h-full overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar config={config} onConfigChange={handleConfigChange} onGenerateCode={handleGenerateCode} />
        </div>
        
        <main className="flex-grow h-full bg-gray-200 dark:bg-gray-950/50">
          <Preview config={config} />
        </main>
      </div>

      <CodeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        config={config} 
      />
    </div>
  );
};

export default App;