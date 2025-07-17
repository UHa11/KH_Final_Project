// NotificationDropdown.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import defaultProfile from '../assets/profileImg/img_간병인.png';
import { notificationService } from '../api/notification';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
// 임시 배열 생성해서 값 넣어둠
// const notifications = [...Array(15).keys()].map((_, i) => ({
//   id: i + 1,
//   sender: `user${i + 1}`,
//   message: `알림 메시지 예시입니다1232121321321. ${i + 1}`,
//   time: `${i + 1}시간 전`,
//   image: defaultProfile,
// }));

// 상대시간 표시 함수
const formatRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
};

const NotificationDropdown = ({ userNo, onClose }) => {
  const dropdownRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userNo) return;

    const fetchNotificationsAndMarkRead = async () => {
      try {
        // 알림 리스트 받아오기
        const notifications = await notificationService.getNotifications(userNo);
        setNotifications(notifications);
      } catch (error) {
        console.error('알림 불러오기 또는 읽음 처리 실패:', error);
      }
    };

    fetchNotificationsAndMarkRead();
  }, [userNo]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return defaultProfile; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <Container ref={dropdownRef}>
      <TitleWrap>
        <Title>알림</Title>
        <DeleteAllButton
          onClick={async () => {
            if (!userNo) return;
            const confirm = window.confirm('모든 알림을 삭제하시겠습니까?');
            if (!confirm) return;

            try {
              await notificationService.deleteAllNotifications(userNo);
              setNotifications([]);
            } catch (err) {
              console.error('전체 삭제 실패:', err);
            }
          }}
        >
          모두 삭제
        </DeleteAllButton>
      </TitleWrap>
      <List>
        {notifications.length === 0 && <EmptyMessage>알림이 없습니다.</EmptyMessage>}
        {notifications.map((noti) => (
          <Item
            key={noti.notificationNo}
            onClick={() => {
              navigate(noti.notificationLinkUrl);
              onClose(); // 드롭다운 닫기
            }}
            style={{ cursor: 'pointer' }}
          >
            <Left>
              <img src={getProfileImageUrl(noti?.senderProfileImage)} alt="프로필" />
            </Left>
            <Center>
              <Message>{noti.notificationMessage}</Message>
            </Center>
            <Right>{formatRelativeTime(noti.notificationCreateDate)}</Right>
            <DeleteButton
              onClick={async (e) => {
                e.stopPropagation(); // 부모 클릭 방지
                try {
                  await notificationService.deleteNotification(noti.notificationNo);
                  setNotifications((prev) => prev.filter((n) => n.notificationNo !== noti.notificationNo));
                } catch (err) {
                  console.error('알림 삭제 실패', err);
                }
              }}
            >
              <FaTimes />
            </DeleteButton>
          </Item>
        ))}
      </List>
    </Container>
  );
};
export default NotificationDropdown;

const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[3]};
`;

const Container = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  width: 450px;
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
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  gap: ${({ theme }) => theme.spacing[3]};
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

// const Sender = styled.strong`
//   font-weight: ${({ theme }) => theme.fontWeights.medium};
//   color: ${({ theme }) => theme.colors.black2};
// `;

const Message = styled.p`
  margin: ${({ theme }) => theme.spacing[1]} 0 0;
  color: ${({ theme }) => theme.colors.gray[2]};
`;

const Right = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[3]};
  white-space: nowrap;
`;
const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.xl}; // 24px로 키움
  z-index: ${({ theme }) => theme.zIndices.base};
`;
const DeleteAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[4]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: ${({ theme }) => theme.spacing[1]};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.danger || 'red'};
  }
`;
