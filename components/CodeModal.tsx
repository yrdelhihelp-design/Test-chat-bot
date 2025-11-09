import React, { useState, useCallback } from 'react';
import type { ChatbotConfig } from '../types';
import { CopyIcon, CheckIcon } from './icons';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChatbotConfig;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const generateCodeSnippet = () => {
    // Sanitize config for embedding. Data URLs for logos can be very large,
    // so we replace them with a placeholder and instruct the user to use a hosted URL.
    const embedConfig = { ...config };
    if (embedConfig.logoUrl && embedConfig.logoUrl.startsWith('data:')) {
      embedConfig.logoUrl = 'YOUR_HOSTED_LOGO_URL.png';
    }
    const configString = JSON.stringify(embedConfig, null, 2);

    // This is a self-contained vanilla JS script that recreates the chatbot widget.
    const widgetScript = `
(() => {
  const config = window.pollinationsChatbotConfig;
  if (!config) {
    console.error('Chatbot: Configuration object not found.');
    return;
  }
  
  const styles = \`
    .pollinations-widget-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: sans-serif; }
    .pollinations-widget-button { background-color: \${config.primaryColor}; color: white; width: 64px; height: 64px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s; }
    .pollinations-widget-button:hover { transform: scale(1.1); }
    .pollinations-widget-window { width: 320px; height: 384px; background-color: white; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: none; flex-direction: column; border: 1px solid #e5e7eb; }
    .pollinations-widget-window.dark { background-color: #1f2937; border-color: #4b5563; }
    .pollinations-widget-header { background-color: \${config.primaryColor}; color: white; padding: 12px; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; align-items: center; justify-content: space-between; }
    .pollinations-widget-header-content { display: flex; align-items: center; gap: 8px; font-weight: bold; }
    .pollinations-widget-logo { width: 32px; height: 32px; border-radius: 50%; }
    .pollinations-widget-close-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; line-height: 1; opacity: 0.8; }
    .pollinations-widget-close-btn:hover { opacity: 1; }
    .pollinations-widget-messages { flex-grow: 1; padding: 12px; overflow-y: auto; background-color: #f9fafb; }
    .pollinations-widget-window.dark .pollinations-widget-messages { background-color: #374151; }
    .pollinations-widget-message-wrapper { display: flex; margin-bottom: 8px; opacity: 0; }
    .pollinations-widget-message { max-width: 80%; padding: 8px; border-radius: 8px; word-wrap: break-word; line-height: 1.5; }
    .pollinations-widget-message-wrapper.user { justify-content: flex-end; }
    .pollinations-widget-message-wrapper.bot { justify-content: flex-start; }
    .pollinations-widget-message.user { background-color: #dbeafe; color: #1e3a8a; }
    .pollinations-widget-window.dark .pollinations-widget-message.user { background-color: #1e40af; color: #dbeafe; }
    .pollinations-widget-message.bot { background-color: #e5e7eb; color: #1f2937; }
    .pollinations-widget-window.dark .pollinations-widget-message.bot { background-color: #4b5563; color: #e5e7eb; }
    .pollinations-widget-typing { color: #6b7280; font-style: italic; }
    .pollinations-widget-input-area { padding: 8px; border-top: 1px solid #e5e7eb; display: flex; }
    .pollinations-widget-window.dark .pollinations-widget-input-area { border-color: #4b5563; }
    .pollinations-widget-input { flex-grow: 1; border: 1px solid #d1d5db; border-radius: 6px 0 0 6px; padding: 8px; font-size: 14px; }
    .pollinations-widget-window.dark .pollinations-widget-input { background-color: #1f2937; border-color: #4b5563; color: #f9fafb; }
    .pollinations-widget-input:focus { outline: 2px solid #3b82f6; border-color: #3b82f6; }
    .pollinations-widget-send-btn { background-color: \${config.primaryColor}; border: none; color: white; padding: 8px; border-radius: 0 6px 6px 0; cursor: pointer; display:flex; align-items:center; justify-content:center; }
    .pollinations-widget-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .pollinations-animation-fade-in-up { animation: p-fadeInUp 0.5s ease-out forwards; }
    .pollinations-animation-slide-in-left { animation: p-slideInLeft 0.5s ease-out forwards; }
    .pollinations-animation-zoom-in { animation: p-zoomIn 0.5s ease-out forwards; }
    @keyframes p-fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes p-slideInLeft { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes p-zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
  \`;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  const container = document.getElementById('pollinations-chatbot-container');
  container.classList.add('pollinations-widget-container');
  container.innerHTML = \`
    <button class="pollinations-widget-button" id="pollinations-chat-open-btn">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
    </button>
    <div class="pollinations-widget-window" id="pollinations-chat-window">
      <div class="pollinations-widget-header">
        <div class="pollinations-widget-header-content">
          \${config.logoUrl ? \`<img src="\${config.logoUrl}" alt="Logo" class="pollinations-widget-logo" />\` : ''}
          <span>Chat Assistant</span>
        </div>
        <button id="pollinations-chat-close-btn" class="pollinations-widget-close-btn">&times;</button>
      </div>
      <div class="pollinations-widget-messages" id="pollinations-chat-messages"></div>
      <div class="pollinations-widget-input-area">
        <input type="text" id="pollinations-chat-input" class="pollinations-widget-input" placeholder="Type a message..." />
        <button id="pollinations-chat-send-btn" class="pollinations-widget-send-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </div>
    </div>
  \`;

  const openBtn = document.getElementById('pollinations-chat-open-btn');
  const closeBtn = document.getElementById('pollinations-chat-close-btn');
  const windowEl = document.getElementById('pollinations-chat-window');
  const messagesEl = document.getElementById('pollinations-chat-messages');
  const inputEl = document.getElementById('pollinations-chat-input');
  const sendBtn = document.getElementById('pollinations-chat-send-btn');
  
  if (document.documentElement.classList.contains('dark')) {
    windowEl.classList.add('dark');
  }

  let isLoading = false;

  const getAnimationClass = () => {
    const styleMap = { 'Fade In Up': 'pollinations-animation-fade-in-up', 'Slide In Left': 'pollinations-animation-slide-in-left', 'Zoom In': 'pollinations-animation-zoom-in' };
    return styleMap[config.animationStyle] || '';
  }

  const addMessage = (text, sender) => {
    const wrapper = document.createElement('div');
    wrapper.className = \`pollinations-widget-message-wrapper \${sender}\`;
    const messageDiv = document.createElement('div');
    messageDiv.className = \`pollinations-widget-message \${sender} \${getAnimationClass()}\`;
    messageDiv.textContent = text;
    wrapper.appendChild(messageDiv);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const toggleLoading = (state) => {
    isLoading = state;
    inputEl.disabled = isLoading;
    sendBtn.disabled = isLoading;
    const typingIndicator = document.getElementById('pollinations-typing-indicator');
    if (isLoading && !typingIndicator) {
      const wrapper = document.createElement('div');
      wrapper.id = 'pollinations-typing-indicator';
      wrapper.className = 'pollinations-widget-message-wrapper bot';
      wrapper.innerHTML = \`<div class="pollinations-widget-message bot pollinations-widget-typing">Typing...</div>\`;
      messagesEl.appendChild(wrapper);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } else if (!isLoading && typingIndicator) {
      typingIndicator.remove();
    }
  };
  
  const handleSendMessage = async () => {
    const userInput = inputEl.value.trim();
    if (userInput === '' || isLoading) return;
    
    addMessage(userInput, 'user');
    inputEl.value = '';
    toggleLoading(true);

    try {
      const fullPrompt = 'System instruction: ' + config.systemPrompt +
                         '\\nWebsite Information: ' + config.websiteInfo +
                         '\\nTone: ' + config.tone +
                         '\\nUser query: ' + userInput +
                         '\\nResponse:';
      const response = await fetch(\`https://text.pollinations.ai/\${encodeURIComponent(fullPrompt)}\`);
      if (!response.ok) throw new Error('API request failed');
      const botText = await response.text();
      toggleLoading(false);
      addMessage(botText, 'bot');
    } catch(error) {
      console.error("Chatbot Error:", error);
      toggleLoading(false);
      addMessage("Sorry, I'm having trouble right now.", 'bot');
    }
  };
  
  openBtn.addEventListener('click', () => {
    windowEl.style.display = 'flex';
    openBtn.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    windowEl.style.display = 'none';
    openBtn.style.display = 'block';
  });

  sendBtn.addEventListener('click', handleSendMessage);
  inputEl.addEventListener('keypress', (e) => e.key === 'Enter' && handleSendMessage());

  addMessage("Hello! How can I help you today?", 'bot');
})();
    `;
    return `<!-- Chatbot Widget Builder - Start -->
<!-- 1. Add this div to the bottom of your <body> tag. -->
<div id="pollinations-chatbot-container"></div>

<!-- 2. Configure your chatbot below. -->
<script>
  window.pollinationsChatbotConfig = ${configString};
</script>

<!-- 3. This script contains the chatbot logic. -->
<script>
${widgetScript}
</script>
<!-- Chatbot Widget Builder - End -->`;
  };
  
  const code = generateCodeSnippet();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold">Embed Your Chatbot</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Copy and paste this snippet into your website's HTML, just before the closing <strong>&lt;/body&gt;</strong> tag.
            </p>
            <div className="relative bg-gray-100 dark:bg-gray-900 rounded-md">
                <pre className="p-4 text-sm text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                    <code>{code}</code>
                </pre>
                <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
         <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right flex-shrink-0">
             <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Close</button>
         </div>
      </div>
    </div>
  );
};

export default CodeModal;