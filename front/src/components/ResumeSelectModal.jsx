import { useProposerForm } from '../hooks/useProposerForm';
import profileImg from '../assets/profileImg/img_간병인.png';
import { SITE_CONFIG } from '../config/site';
import React from 'react';
import styled from 'styled-components';
import closeIcon from '../assets/icons/icon_닫기.png';
import logo from '../assets/mainImg/logo.png';

const ResumeSelectModal = ({ onClose, hiringNo, onSuccess }) => {
  const { resumeList, selectedResumeNo, handleChange, submitApplication } = useProposerForm(hiringNo, onSuccess);

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>

        <LogoWrapper>
          <LogoImg src={logo} alt="로고" />
          {SITE_CONFIG.name}
        </LogoWrapper>

        <Title>이력서를 선택해주세요</Title>

        <Card>
          <ProfileImage src={profileImg} alt="프로필" />
          <Info>
            <Name>지원합니다!</Name>
          </Info>
        </Card>

        <SelectBox value={selectedResumeNo} onChange={handleChange}>
          <option value="">이력서를 선택하세요</option>
          {resumeList.map((resume) => (
            <option key={resume.resumeNo} value={resume.resumeNo}>
              {resume.resumeTitle}
            </option>
          ))}
        </SelectBox>

        <SubmitButton onClick={submitApplication}>지원하기</SubmitButton>
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

const ModalContainer = styled.div`
  width: 500px;
  background: white;
  border-radius: 4px;
  padding: 40px 30px;
  position: relative;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  img {
    width: 20px;
    height: 20px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const LogoImg = styled.img`
  width: 80px;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  padding: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 30px;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const Age = styled.div`
  color: ${({ theme }) => theme.colors.gray[6]};
  font-size: 14px;
`;

const SelectBox = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.md};
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  width: 100%;
  padding: 14px;
  font-weight: bold;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
`;

export default ResumeSelectModal;
