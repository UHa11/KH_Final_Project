import React from 'react';
import pat_profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import care_profileImage from '../assets/images/cargiver.png'; // 프로필 이미지 경로
import {
  ProfileImage,
  ProfileInfo,
  UserAge,
  UserName,
  InfoButton,
  BtnSection,
  TestBtn,
  EmptyMessage,
} from '../styles/MatchingCard';
import { ProfileCard } from '../styles/MatchingCard';
import { useNavigate } from 'react-router-dom';
import { MatchForm } from '../hooks/matchFrom';
import styled from 'styled-components';
import { media } from '../styles/MediaQueries';

const TestPatientCard = ({ patient, getCareGiver, getEndedMatchingList, handleClick, activeTab, isOpen }) => {
  if (!patient) {
    alert('선택된 환자가 없습니다.');
  }

 
  if (!patient){
    alert("선택된 환자가 없습니다.")
  }; 
 
  const handlePatientClick = (patNo) => {
    if (activeTab === 'matching') {
      getCareGiver(patNo);
      return
    }
    if (activeTab === 'matched') {
      getEndedMatchingList(patNo);
      return
    }
  };

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path, type = 'caregiver') => {
    if (!path) {
      return type === 'patient' ? pat_profileImage : care_profileImage;
    }
    const cleanPath = path.replace(/^\//, ''); // 슬래시 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  const navigate = useNavigate();

  return (
    <div>
      {patient && patient.length > 0 ? (
        patient.map((pat) => (
          <ProfileCard type="patient" key={pat.patNo}>
            <ProfileImage
              src={getProfileImageUrl(pat.profileImage, 'patient')}
              alt="환자"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = pat_profileImage;
              }}
            />
            <ProfileInfo>
              <UserName>{pat.patName} 님</UserName>
              <UserAge>
                나이 {pat.patAge}세({pat.patGender === 'M' ? '남' : '여'})
              </UserAge>
              <BtnSection>
                <InfoButton onClick={() => navigate(`/report/${pat.patNo}`)}>간병일지 보기</InfoButton>
               <OpenButton onClick={() => handleClick(pat.patNo)}>간병인 보기</OpenButton>
              </BtnSection>
            </ProfileInfo>
          </ProfileCard>
        ))
      ) : (
        <EmptyMessage>등록된 환자가 없습니다.</EmptyMessage>
      )}
    </div>
  );
};

export default TestPatientCard;


const OpenButton = styled(InfoButton)`
  display: flex;

  ${media.md`  // 예: 768px 이하일 때
  display: flex;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[8]}`};
 `}

  ${media.lg`  // 예: 768px 이하일 때
    display: flex;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[6]}`};
 `}
`;
