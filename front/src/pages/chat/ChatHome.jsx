import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getMyChatRooms } from '../../api/chatApi';
import Draggable from 'react-draggable';
import ChatRoom from './ChatRoom';
import useUserStore from '../../store/userStore';

const Container = styled.div`
  width: 400px;
  height: 600px;
  margin: 0;

  background: #fdfdff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
`;

// 상단---------------------------------------
const Header = styled.div`
  margin-top: 10px;
  padding: calc(2rem - 10px) 2rem;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: move;
  height: 100px;
`;

const Logo = styled.img`
  height: 50px;
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: left;
  width: 65%;
`;

const Close = styled.img`
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

//메인-----------------------------------------
const Main = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 600px;
  width: 100%;
  gap: 10px;
  padding: 10px 1rem;
  overflow-y: auto;
`;

const Card = styled.div`
  height: 100px;
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 2rem 1rem;
  cursor: pointer;
  border: 0.5px solid ${({ theme }) => theme.colors.gray[5]};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 8px rgba(239, 122, 70, 1);
    z-index: 1;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 85%;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  width: 100%;
`;

const Name = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const RecentContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[4]};
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;

  border: 2px solid white;
  transition: transform 0.2s;
`;

const Circle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
`;
// -----------------------------------------------

const ChatHome = ({ onClose }) => {
  const [chatList, setChatList] = useState([]);
  // 현재 선택된 채팅방 ID를 관리. null이면 목록, 값이 있으면 해당 채팅방을 표시
  const [currentRoomId, setCurrentRoomId] = useState(null);

  const nodeRef = useRef(null);

  useEffect(() => {
    fetchMyChats();
  }, []);

  const fetchMyChats = async () => {
    try {
      const data = await getMyChatRooms();
      setChatList(data);
    } catch (error) {
      console.error('내 채팅 목록 로드 실패:', error);
      setChatList([]);
    }
  };

  const handleEnterChatRoom = (roomId) => {
    setCurrentRoomId(roomId);
  };

  const handleBackToList = () => {
    setCurrentRoomId(null);
  };

  return (
    <Draggable handle=".draggable-header" nodeRef={nodeRef} bounds="body">
      <Container ref={nodeRef}>
        <Header className="draggable-header">
          <Logo src="/public/logo.png" alt="로고" />
          <Title>채팅</Title>
          <Close src="/public/Union.png" alt="닫기" onClick={onClose} />
        </Header>

        {currentRoomId ? (
          // ChatRoom 컴포넌트에 필요한 정보를 props로 전달
          <ChatRoom roomId={currentRoomId} onBack={handleBackToList} />
        ) : (
          <Main>
            {/* 더미데이터 */}
            <Card onClick={() => handleEnterChatRoom(1)}>
              <Left>
                <ProfileImg src="/src/assets/profileImg/img_환자소.png" />
                <Center>
                  <Name>백승환</Name>
                  <RecentContent>결투를 신청합니다.</RecentContent>
                </Center>
              </Left>
              <Circle>3</Circle>
            </Card>

            {/* 변수는 임의 */}
            {chatList.length > 0 ? (
              chatList.map((chat) => (
                <Card key={chat.roomId} onClick={() => handleEnterChatRoom(chat.roomId)}>
                  <Left>
                    <ProfileImg src={chat.participant.profileImageUrl} />
                    <Center>
                      <Name>{chat.roomName}</Name>
                      <RecentContent>{chat.message}</RecentContent>
                    </Center>
                  </Left>
                  <Circle>{chat.unReadCount}</Circle>
                </Card>
              ))
            ) : (
              <p>채팅 목록이 없습니다.</p>
            )}
          </Main>
        )}
      </Container>
    </Draggable>
  );
};

export default ChatHome;
