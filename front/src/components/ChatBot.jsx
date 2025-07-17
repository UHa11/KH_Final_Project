// ChatBot.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { SITE_CONFIG } from '../config/site';
import { TbMessageChatbot } from 'react-icons/tb';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const askRag = async (e) => {
    e.preventDefault(); // form 제출시 페이지 리로드 방지
    if (!question.trim()) {
      alert('질문을 입력해주세요.');
      return;
    }
    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const res = await fetch('http://localhost:8555/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAnswer(data.answer);
      } else {
        setError(data.error || '응답 실패');
      }
    } catch (e) {
      setError('네트워크 오류: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      askRag(e);
    }
  };
  return (
    <>
      <ToggleButton onClick={() => setIsOpen(true)}>
        <IconWrap>
          <ChatBotIcon />
          돌보미 가이드
        </IconWrap>
      </ToggleButton>

      <ChatBotContainer isOpen={isOpen}>
        <ChatMain>
          <HeadDiv>
            <LogDiv>
              <LogoImg src="/logo.png" alt="로고" />
              <p>{SITE_CONFIG.name}</p>
            </LogDiv>

            <button onClick={() => setIsOpen(false)}>
              <img src="/public/Union.png" alt="" />
            </button>
          </HeadDiv>

          <MessageBox>
            <Content>
              {/* 답변과 에러 메시지 표시 */}
              {answer && <ResultBox dangerouslySetInnerHTML={{ __html: answer }} />}
              {error && <ErrorBox>{error}</ErrorBox>}
            </Content>

            <InputContainer onSubmit={askRag}>
              <ChatInput
                placeholder="메시지를 입력하세요"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SendButton type="submit">{loading ? '전송중...' : '전송'}</SendButton>
            </InputContainer>
          </MessageBox>
        </ChatMain>
      </ChatBotContainer>
    </>
  );
};

export default ChatBot;

// --- styled components ---

const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 40px;
  right: 30px;
  z-index: 9999;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 10000;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const ChatMain = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 100%;
  max-width: 400px;
  gap: 10px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(239, 122, 70, 0.6);
  margin: 60px 10px;
  border-radius: 10px;
`;

const MessageBox = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
  background-color: ${({ theme }) => theme.colors.gray[6]};
`;

const Wrap = styled.div`
  overflow-y: auto;
`;
const Content = styled.div`
  overflow-y: auto;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ChatInput = styled.input.attrs({ type: 'text' })`
  flex-grow: 1;
  padding: 12px 15px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  width: 100px;
  border-radius: 6px;
  cursor: pointer;

  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const HeadDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LogDiv = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  p {
    margin-left: 10px;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const LogoImg = styled.img`
  width: 40px;
`;

const ResultBox = styled.div`
  color: #212529;
  background: #f0f8ff;
  padding: 12px;
  border-radius: 8px;

  white-space: pre-line;
  overflow-wrap: break-word;
  word-break: break-all;
  text-align: justify;
`;

const ErrorBox = styled.div`
  margin-top: 20px;
  color: #dc3545;
  background: #f8d7da;
  padding: 12px;
  border-radius: 8px;
`;

const ChatBotIcon = styled(TbMessageChatbot)`
  width: 25px;
  height: 25px;
`;

const IconWrap = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;
