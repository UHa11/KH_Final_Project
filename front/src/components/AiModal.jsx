import profileImage from '../assets/profileImg/img_환자소.png';
import { SITE_CONFIG } from '../config/site';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import closeIcon from '../assets/icons/icon_닫기.png';
import logo from '../assets/mainImg/logo.png';
import { patientService } from '../api/patient';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../api/aiService';

const AiModal = () => {
  const { user } = useUserStore();
  const [userPatients, setUserpatients] = useState();
  const [patient, setPatient] = useState();
  const [selectPatientNo, setSelectPatientNo] = useState(undefined);
  const [aiResponse, setAiResponse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {

      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        return;
      }

      try {
        const patientsList = await patientService.getPatients(user.userNo);

        setUserpatients(patientsList);
        if (patientsList.length === 0) {
          alert('환자정보를 먼저 입력해주세요');
          navigate('/guardian/patientregisteration');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, [patient]);

  const getPatient = async (patNo) => {
    // patNo가 빈값이면 patient도 초기화
    if (!patNo) {
      setPatient({});
      return;
    }

    try {
      setSelectPatientNo(patNo);

      // patientService.getPatientId는 비동기 함수로 가정
      const patient = await patientService.getPatientId(patNo);

      setPatient(patient);
    } catch (error) {
      console.error(error);
    }
  };

  const getAiResponse = async (patNo) => {
    if (!patNo) {
      setPatient({});
      return;
    }

    try {
      const res = await aiService.getAiResponse(patNo);
      setAiResponse(res);
    } catch (error) {
      console.error(error);
    }
  };

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>

        <LogoWrapper>
          <LogoImg src={logo} alt="로고" />
          {SITE_CONFIG.name}
        </LogoWrapper>

        <Title> 서비스 준비중입니다.</Title>
        <Title> 환자를 선택하시며 환자의 질병에 맞는 예방법을 알려드립니다</Title>
        <SelectSection>
          <SelectBox
            id="userPatients"
            value={selectPatientNo ?? ''}
            onChange={(e) => {
              const patNo = Number(e.target.value);
              setSelectPatientNo(patNo); // 이걸 먼저!
              getPatient(patNo);
            }}
          >
            <option value="">돌봄대상자를 선택해주세요</option>
            {userPatients?.map((p) => (
              <option key={p.patNo} value={p.patNo}>
                {p.patName}
              </option>
            ))}
          </SelectBox>
          <SubmitButton onClick={() => getAiResponse(selectPatientNo)}>ai 요청하기</SubmitButton>
        </SelectSection>

        <Card>
          <NameBox>
            <ProfileImage src={getProfileImageUrl(aiResponse.profileImage)} />
            {patient?.patName}의 맟춤 예방법입니다. <br />
          </NameBox>

          <Info>{aiResponse.response}</Info>
        </Card>
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
  width: 800px;
  max-height: 80vh;
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
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 30px;
`;

const SelectSection = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: fit-content;
`;

const SelectBox = styled.select`
  width: 70%;
  height: inherit;
  padding: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.md};
`;

const SubmitButton = styled.button`
  width: 30%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 14px;
  font-weight: bold;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  white-space: pre-line;
  overflow-y: auto;
`;

const NameBox = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
`;

const Age = styled.div`
  color: ${({ theme }) => theme.colors.gray[6]};
  font-size: 14px;
`;

export default AiModal;
