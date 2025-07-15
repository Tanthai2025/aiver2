
import React, { useState } from 'react';
import { Chatbot } from './components/Chatbot';
import { ChatBubbleIcon } from './components/icons';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div className="font-sans w-full h-full">
      {isChatOpen ? (
        <Chatbot onClose={toggleChat} />
      ) : (
        <button
          onClick={toggleChat}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 bg-teal-700 text-white w-[25vmin] h-[25vmin] max-w-40 max-h-40 rounded-full shadow-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition-transform transform hover:scale-110 pointer-events-auto flex items-center justify-center"
          aria-label="Open chat"
        >
          <ChatBubbleIcon className="w-[12.5vmin] h-[12.5vmin] max-w-20 max-h-20" />
        </button>
      )}
    </div>
  );
};

export default App;
