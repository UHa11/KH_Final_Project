import React, { useState } from 'react';
import styled from 'styled-components';
import { ModalCloseButton, ModalContainer, ModalInput, ModalText } from '../styles/common/Modal';
import { ButtonText, SubmitButton } from '../styles/common/Button';
import { FaHeart } from 'react-icons/fa';
import { reviewService } from '../api/reviews';
import { toast } from 'react-toastify';

const ReviewModal = ({ maxHearts = 5 }) => {
  const [inputValue, setInputValue] = useState(null);
  const [rating, setRating] = useState('');
  const [hovered, setHovered] = useState(0); //마우스 호버된 별점
  const [error, setError] = useState(null);
  

  const handleSubmit = async () => {
    try {
      const review = await reviewService.saveReview({
        rating,
        inputValue,
      });
      console.log(review);
    } catch (error) {
      console.error(error);
      const errorMessage = '리뷰를 불러오는데 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setRating(0);
      setInputValue('');
    }
  };

  if (error) {
    return null;
  }

  return (
    <ModalContainer>
      <LogoImg src="logo.png" />
      <LogoImg src="dolbomi.png" />
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

      <ModalCloseButton onClick="#">
        <img src="Union.png" />
      </ModalCloseButton>
    </ModalContainer>
  );
};

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
