import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader, MessageCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ChatTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
`;

const ChatSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-top: none;
  border-bottom: none;
`;

const Message = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  align-items: flex-start;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.isUser 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})`
    : props.theme.colors.surface};
  color: ${props => props.isUser ? 'white' : props.theme.colors.text};
  box-shadow: ${props => props.theme.colors.cardShadow};
  word-wrap: break-word;
  margin-left: ${props => props.isUser ? 'auto' : '0'};
  margin-right: ${props => props.isUser ? '0' : 'auto'};
`;

const MessageIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.isUser 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})`
    : props.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isUser ? 'white' : props.theme.colors.primary};
  flex-shrink: 0;
  order: ${props => props.isUser ? '2' : '0'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
`;

const MessageInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: ${props => props.theme.spacing.md};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SuggestionChip = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ChatFloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px ${props => props.theme.colors.primary}40;
  z-index: 1000;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FloatingChatWindow = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 400px;
  height: 500px;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    height: 70vh;
    right: 20px;
    bottom: 20px;
  }
`;

const FloatingChatHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Chatbot = ({ isFloating = false, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your weather assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState([
    "What's the weather like today?",
    "Show me weather analytics",
    "Tell me about climate trends",
    "Which cities have the best weather?"
  ]);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: messageText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText.trim() }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();

      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Chatbot error:', error);
      
      let errorMessage;
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
        toast.error('Request timed out. Please try again.');
      } else if (error.message.includes('fetch')) {
        errorMessage = "Unable to connect to the chatbot service. Please ensure the backend is running on port 5000.";
        toast.error('Unable to connect to chatbot service.');
      } else {
        errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";
        toast.error('Sorry, I\'m having trouble connecting. Please try again later.');
      }
      
      setTimeout(() => {
        const botErrorMessage = {
          id: Date.now() + 1,
          text: errorMessage,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botErrorMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const ChatContent = () => (
    <>
      <MessagesContainer>
        {!isFloating && (
          <SuggestionChips>
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </SuggestionChip>
            ))}
          </SuggestionChips>
        )}
        
        {messages.map((message) => (
          <Message
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageIcon isUser={message.isUser}>
              {message.isUser ? <User size={20} /> : <Bot size={20} />}
            </MessageIcon>
            <MessageBubble isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          </Message>
        ))}
        
        {isLoading && (
          <TypingIndicator
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MessageIcon isUser={false}>
              <Bot size={20} />
            </MessageIcon>
            <span>Assistant is typing</span>
            <TypingDots>
              <span></span>
              <span></span>
              <span></span>
            </TypingDots>
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <MessageInput
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <SendButton
          onClick={() => sendMessage()}
          disabled={isLoading || !inputMessage.trim()}
        >
          {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
        </SendButton>
      </InputContainer>
    </>
  );

  if (isFloating) {
    return (
      <>
        <ChatFloatingButton
          onClick={() => setShowFloatingChat(!showFloatingChat)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle size={24} />
        </ChatFloatingButton>

        <AnimatePresence>
          {showFloatingChat && (
            <FloatingChatWindow
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FloatingChatHeader>
                <div>
                  <strong>Weather Assistant</strong>
                  <div style={{ fontSize: '0.8em', opacity: 0.9 }}>
                    Ask me about weather!
                  </div>
                </div>
                <CloseButton onClick={() => setShowFloatingChat(false)}>
                  <X size={20} />
                </CloseButton>
              </FloatingChatHeader>
              <ChatContent />
            </FloatingChatWindow>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <Bot size={32} />
        <div>
          <ChatTitle>Weather Assistant</ChatTitle>
          <ChatSubtitle>Ask me anything about weather data and analytics</ChatSubtitle>
        </div>
      </ChatHeader>
      <ChatContent />
    </ChatContainer>
  );
};

export default Chatbot;