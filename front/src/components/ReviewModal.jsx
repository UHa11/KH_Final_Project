import React, { useState } from 'react';
import styled from 'styled-components';
import { ModalCloseButton, ModalInput, ModalText } from '../styles/common/Modal';
import { ButtonText, SubmitButton } from '../styles/common/Button';
import { FaHeart } from 'react-icons/fa';
import { reviewService } from '../api/reviews';
import { toast } from 'react-toastify';
import useUserStore from '../store/userStore';

const ReviewModal = ({ matNo, maxHearts = 5, onClose, onSubmitSuccess }) => {
  const [inputValue, setInputValue] = useState('');
  const [rating, setRating] = useState('');
  const [hovered, setHovered] = useState(0); //마우스 호버된 별점
  const [error, setError] = useState(null);
  const { user } = useUserStore();
  const handleSubmit = async () => {
    try {
      if (!rating || !inputValue) {
        toast.warn('별점과 내용을 모두 입력해주세요.');
        return;
      }

      const reviewPayload = {
        matNo, // 모달 prop
        userNo: user.userNo,
        rating,
        inputValue,
      };

      await reviewService.saveReview(reviewPayload);

      toast.success('리뷰가 성공적으로 등록되었습니다!');
      onSubmitSuccess?.(); //새로고침
      onClose(); // 모달 닫기
    } catch (error) {
      console.error(error);
      toast.error('리뷰 등록에 실패했습니다.');
    } finally {
      setRating(0);
      setInputValue('');
    }
  };

  if (error) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContainer>
        <LogoImg src="/logo.png" alt="로고" />
        <LogoImg src="/dolbomi.png" alt="돌봄이" />
        <ModalText>리뷰를 작성해주세요.</ModalText>
        <Heart>
          {Array.from({ length: maxHearts }).map((_, index) => (
            <FaHeart
              key={index}
              onClick={() => setRating(index + 1)}
              onMouseEnter={() => setHovered(index + 1)} // 마우스를 올렸을 때 효과
              onMouseLeave={() => setHovered(0)} // 마우스가 벗어나면 초기화
              size={40}
              style={{
                cursor: 'pointer',
                color: index < (hovered || rating) ? '#EB5757' : '#ddd',
                transition: 'color 0.3s ease',
              }}
            />
          ))}
        </Heart>

        <Input
          value={inputValue}
          placeholder="ex) 좋은 간병 감사합니다!"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Button onClick={handleSubmit}>
          <ButtonText>리뷰 작성하기</ButtonText>
        </Button>

        <ModalCloseButton onClick={onClose}>
          <img src="/Union.png" alt="닫기" />
        </ModalCloseButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 650px;
  height: 500px;
  background: white; /*  모달 배경 */
  border-radius: ${({ theme }) => theme.borderRadius.md};
  gap: 10px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
`;
const Button = styled(SubmitButton)`
  width: 60%;
`;

const LogoImg = styled.img`
  width: 80px;
`;

const Input = styled(ModalInput)`
  margin-top: 30px;
`;

const Heart = styled.div`
  display: flex;
  gap: 10px;
`;

export default ReviewModal;
