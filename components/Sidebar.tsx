
import React, { useCallback } from 'react';
import type { ChatbotConfig } from '../types';
import { Tone, AnimationStyle } from '../types';
import { CodeIcon, ColorPaletteIcon, FileUploadIcon, InfoIcon, SparklesIcon, ToneIcon } from './icons';

interface SidebarProps {
  config: ChatbotConfig;
  onConfigChange: (newConfig: Partial<ChatbotConfig>) => void;
  onGenerateCode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, onConfigChange, onGenerateCode }) => {

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onConfigChange({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [onConfigChange]);

  const InputWrapper: React.FC<{ children: React.ReactNode; title: string; icon: React.ReactNode; description: string }> = ({ children, title, icon, description }) => (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
                {icon}
                <span className="font-semibold">{title}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </label>
        {children}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
        <div className="flex-grow">
            <InputWrapper 
              title="Website Information" 
              icon={<InfoIcon className="w-5 h-5" />} 
              description="Provide context about your website for the chatbot.">
                <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 h-32 p-2 resize-none"
                    value={config.websiteInfo}
                    onChange={(e) => onConfigChange({ websiteInfo: e.target.value })}
                />
            </InputWrapper>

            <InputWrapper 
              title="System Prompt" 
              icon={<SparklesIcon className="w-5 h-5" />}
              description="Define the chatbot's personality and core instructions."
            >
                <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 h-24 p-2 resize-none"
                    value={config.systemPrompt}
                    onChange={(e) => onConfigChange({ systemPrompt: e.target.value })}
                />
            </InputWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <InputWrapper 
                  title="Bot Tone" 
                  icon={<ToneIcon className="w-5 h-5" />}
                  description="Choose the conversational tone."
                >
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 p-2"
                        value={config.tone}
                        onChange={(e) => onConfigChange({ tone: e.target.value as Tone })}
                    >
                        {Object.values(Tone).map((tone) => <option key={tone} value={tone}>{tone}</option>)}
                    </select>
                </InputWrapper>

                <InputWrapper 
                  title="Primary Color" 
                  icon={<ColorPaletteIcon className="w-5 h-5" />}
                  description="Set the widget's main color."
                  >
                    <div className="relative mt-1">
                        <input
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                            className="p-1 h-10 w-full block bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                    </div>
                </InputWrapper>
            </div>

            <InputWrapper 
              title="Upload Logo" 
              icon={<FileUploadIcon className="w-5 h-5" />}
              description="Use a transparent .png for best results."
              >
                <div className="mt-1 flex items-center gap-4">
                    <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    <label htmlFor="logo-upload" className="cursor-pointer bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 px-4 rounded-md">
                        Choose File
                    </label>
                    {config.logoUrl && <img src={config.logoUrl} alt="Logo Preview" className="h-10 w-10 rounded-full object-cover bg-gray-200" />}
                </div>
            </InputWrapper>

             <InputWrapper 
              title="Message Animation" 
              icon={<SparklesIcon className="w-5 h-5" />}
              description="How new messages appear."
            >
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 p-2"
                    value={config.animationStyle}
                    onChange={(e) => onConfigChange({ animationStyle: e.target.value as AnimationStyle })}
                >
                    {Object.values(AnimationStyle).map((style) => <option key={style} value={style}>{style}</option>)}
                </select>
            </InputWrapper>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
                onClick={onGenerateCode}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
                <CodeIcon className="w-5 h-5" />
                Generate Embed Code
            </button>
        </div>
    </div>
  );
};

export default Sidebar;
