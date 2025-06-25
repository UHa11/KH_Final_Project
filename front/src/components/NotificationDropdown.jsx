// NotificationDropdown.jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import defaultProfile from '../assets/profileImg/img_간병인.png';

// 임시 배열 생성해서 값 넣어둠
const notifications = [...Array(15).keys()].map((_, i) => ({
  id: i + 1,
  sender: `user${i + 1}`,
  message: `알림 메시지 예시입니다1232121321321. ${i + 1}`,
  time: `${i + 1}시간 전`,
  image: defaultProfile,
}));

const NotificationDropdown = ({ onClose }) => {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      // dropdownRef.current.contains(e.target)은 클릭한 요소가 드롭다운 내부인지 여부를 판별
      //내부가 아니면, 즉 밖을 클릭한 경우 → onClose() 실행 → 드롭다운 닫힘.
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    // 언마운트시 이벤트 제거
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <Container ref={dropdownRef}>
      <TitleWrap>
        <Title>알림</Title>
      </TitleWrap>
      <List>
        {notifications.map((noti) => (
          <Item key={noti.id}>
            <Left>
              <img src={noti.image} alt="profile" />
            </Left>
            <Center>
              <Sender>{noti.sender}</Sender>님이 댓글을 남겼습니다.
              <Message>{noti.message}</Message>
            </Center>
            <Right>{noti.time}</Right>
          </Item>
        ))}
      </List>
    </Container>
  );
};

export default NotificationDropdown;

const Container = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  width: 400px;
  max-height: 400px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.base};
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const Title = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const Left = styled.div`
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: ${({ theme }) => theme.spacing[3]};
  }
`;

const Center = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.black3};
`;

const Sender = styled.strong`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.black2};
`;

const Message = styled.p`
  margin: ${({ theme }) => theme.spacing[1]} 0 0;
  color: ${({ theme }) => theme.colors.gray[2]};
`;

const Right = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[3]};
  white-space: nowrap;
`;
