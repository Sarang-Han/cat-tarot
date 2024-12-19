import { keyframes } from 'styled-components';

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