import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import catProfile from './assets/cat.png'; // 고양이 프로필 이미지
import userProfile from './assets/user-profile.png'; // 유저 프로필 이미지
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(125deg, #2a1e2a 0%, #2a3845 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 95vh;
  margin: 0 auto;
  padding: 15px; // 20px에서 15px로 축소
  display: flex;
  flex-direction: column;
  background: rgba(233, 211, 229, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(233, 211, 229, 0.08);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px; // 16px에서 12px로 축소
  overflow-y: auto;
  padding: 15px; // 20px에서 15px로 축소
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px; // 10px에서 8px로 축소
  ${props => props.isUser && 'flex-direction: row-reverse;'}
  animation: ${fadeInUp} 0.3s ease-out;
  opacity: 0;
  animation-fill-mode: forwards;
  animation-delay: ${props => props.delay || '0s'};
`;

const Profile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Bubble = styled.div`
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #af8ba8 0%, #77a1c5 100%)'
    : 'rgba(233, 211, 229, 0.05)'};
  padding: 8px 12px; // 상하 8px, 좌우 12px로 조정
  border-radius: 9px;
  max-width: 85%;
  color: ${props => props.isUser ? 'white' : '#e9d3e5'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(233, 211, 229, 0.08);
  white-space: pre-wrap;
  font-family: inherit;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(233, 211, 229, 0.05);
  border-radius: 12px;
  animation: ${bounce} 1s infinite ease-in-out;
  color: #e9d3e5;
  font-size: 14px;
`;

const MessageInput = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SendButton = styled.button`
  border: none;
  background: none;
  color: white;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

function App() {
  const [messages, setMessages] = useState([
    { text: "안냥! 고양이 타로 상담사 네로다냥 🐈‍⬛", isUser: false },
    { text: "궁금한 것을 말해주면 타로 카드를 통해 조언을 해주겠다냥~", isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://127.0.0.1:5000/chat'; // Flask 서버

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { 
      text: inputText, 
      isUser: true 
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        message: inputText
      });

      const botMessage = {
        text: response.data.response,
        isUser: false
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: '죄송해요, 일시적인 오류가 발생했어요 😿',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <AppContainer>
      <ChatContainer>
        <ChatArea>
          {messages.map((message, index) => (
            <Message 
              key={index} 
              isUser={message.isUser}
              delay={`${index * 0.1}s`}
            >
              <Profile src={message.isUser ? userProfile : catProfile} />
              <Bubble isUser={message.isUser}>{message.text}</Bubble>
            </Message>
          ))}
          {isLoading && (
            <Message isUser={false}>
              <Profile src={catProfile} alt="profile" />
              <LoadingMessage>
                네로가 타로 카드를 읽고 있어요... 🔮
              </LoadingMessage>
            </Message>
          )}
        </ChatArea>
        <MessageInput>
          <Input
            type="text"
            placeholder="타로점으로 궁금한 것을 말씀해주세요..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <SendButton onClick={handleSendMessage} disabled={isLoading}>
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
          </SendButton>
        </MessageInput>
      </ChatContainer>
    </AppContainer>
  );
}

export default App;