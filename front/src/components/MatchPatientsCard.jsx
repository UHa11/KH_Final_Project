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
  TestBtn
} from '../styles/MatchingCard';
import { ProfileCard } from '../styles/MatchingCard';
import { useNavigate } from 'react-router-dom';


const MatchPatientsCard
 = ({ patient, getCareGiver, handleClick, getEndedMatchingList, activeTab }) => {
  if (!patient) return <p>선택된 환자 정보가 없습니다.</p>;
 
  // tab의 상태에 따라 적용되는 함수가 다름
  let currentGetList;

  if (activeTab === 'matching') {
    currentGetList = (patNo) => getCareGiver(patNo);
  } else if (activeTab === 'matched') {
    currentGetList = (patNo) => getEndedMatchingList(patNo, 1); // 여기서 두 번째 인자를 고정
  }




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

  return(
    <div >
    <ProfileCard type="patient" onClick={() => currentGetList?.(patient.patNo)}>
      <ProfileImage
        src={getProfileImageUrl(patient.profileImage, 'patient')}
        alt="환자"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = pat_profileImage;
        }}
      />
      <ProfileInfo>
        <UserName>{patient.patName} 님</UserName>
        <UserAge>
          나이 {patient.patAge}세({patient.patGender === 'M' ? '남' : '여'})
        </UserAge>
        <BtnSection>
          <InfoButton onClick={() => navigate(`/report/${patient.patNo}`)}>간병일지 보기</InfoButton>
          <TestBtn onClick={() => handleClick(patient.patNo)}>간병인 보기</TestBtn>
        </BtnSection>
      </ProfileInfo>
    </ProfileCard>
  </div>
  );
};

export default MatchPatientsCard;

