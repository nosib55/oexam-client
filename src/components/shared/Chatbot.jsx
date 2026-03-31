"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Initial greeting
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Hello! I am your AI assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Hello how can i help you!",
        "Dashboard user guide is available in the documentation section.",
        "I can help with navigating the dashboard or updating settings.",
        "Could you clarify the question?",
        "Any problem on Course registration ?",
        "What classes do you want to register for?",
        "You can find the course registration instructions in the help section."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500); // 1.5 second simulated typing delay
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 h-[30rem] bg-base-100 rounded-2xl shadow-2xl border border-base-300 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-content p-4 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaRobot className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Support Assistant</h3>
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleChat}
                className="btn btn-ghost btn-circle btn-sm hover:bg-white/20"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto bg-base-200/50 space-y-4"
            >
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className="mt-auto mb-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${msg.role === 'user' ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content'}`}>
                        {msg.role === 'user' ? <FaUser /> : <FaRobot />}
                      </div>
                    </div>
                    
                    {/* Message Bubble */}
                    <div className="flex flex-col gap-1">
                      <div className={`px-4 py-2 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-content rounded-br-sm shadow-md' 
                          : 'bg-base-100 border border-base-300 shadow-sm rounded-bl-sm text-base-content'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </div>
                      <span className={`text-[10px] opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="mt-auto mb-1">
                      <div className="w-8 h-8 rounded-full bg-base-300 text-base-content flex items-center justify-center text-xs">
                        <FaRobot />
                      </div>
                    </div>
                    <div className="bg-base-100 border border-base-300 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      <motion.div className="w-1.5 h-1.5 bg-base-content/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-base-content/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-base-content/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-base-100 border-t border-base-300">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="input input-bordered flex-1 focus:outline-none focus:border-primary rounded-full px-5 bg-base-200/50"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isTyping}
                />
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim() || isTyping}
                  className="btn btn-primary btn-circle group"
                >
                  <FaPaperPlane className={`group-hover:scale-110 transition-transform ${!inputMessage.trim() || isTyping ? 'opacity-50' : ''}`} />
                </button>
              </form>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="btn btn-primary h-14 w-14 rounded-full shadow-xl flex items-center justify-center text-2xl z-50 fixed bottom-6 right-6 border-4 border-base-100"
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <FaTimes />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <FaCommentDots />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
