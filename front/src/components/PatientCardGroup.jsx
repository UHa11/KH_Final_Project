import React, { useEffect } from 'react';
import pat_profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import care_profileImage from '../assets/images/cargiver.png'; // 프로필 이미지 경로
import {
  ProfileImage,
  ProfileInfo,
  UserAge,
  UserName,
  InfoButton,
  RightLineDiv,
  CargiverWrap,
  CaregiverImg,
  CaregiverDiv,
  CaregiverTextDiv,
  ProfileTextGray,
  ProfileTextStrong,
  CargiverButtonDiv,
  ReportButton,
  CareLogButton,
  PageWrapper,
  EmptyMessage,
} from '../styles/MatchingCard';
import { ProfileCard } from '../styles/MatchingCard';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchDate from './SearchDate';
import { Button } from '../styles/Auth.styles';
import Paging from './Paging';

const PatientCardGroup = ({
  patient,
  caregiverList,
  handleSearchClick,
  onClose,
  handleClick,
  activeTab,
  endedCurrentPage,
  endedTotalPage,
  handleEndedPageChange,
  setShowReviewModal,
  setSelectedCaregiver,
  cargiverListRest,
}) => {
  useEffect(() => {
    if(patient){
      handleClick(patient.patNo)
    }
    cargiverListRest();
  }, [activeTab]);

  if (!patient) return <p>선택된 환자 정보가 없습니다.</p>;

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
    <Div>
      <ProfileCard type="patient">
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
            나이 {patient.patAge}세({patient?.patGender === 'M' ? '남' : '여'})
          </UserAge>

          <InfoButton onClick={() => navigate(`/report/${patient.patNo}`)}>간병일지 보기</InfoButton>
        </ProfileInfo>
      </ProfileCard>

      <Button onClick={onClose(null)}>상세보기 닫기</Button>

      {activeTab === 'matched' ? <SearchDate handleSearchClick={handleSearchClick} patient={patient} /> : <></>}

      {caregiverList && caregiverList.length > 0 ? (
        caregiverList.map((care) => (
          // 모바일일때는 반응형으로 display none: flex로 잡고
          // 여기는 모바일일 때 보여야 상세보기로 display 조건을 isOpen 속성을 추가하여 caregiverCard와 다르게 써야함
          <NewWrap key={care.caregiverNo}>
            <CaregiverDiv>
              <CaregiverImg
                src={getProfileImageUrl(care.caregiverProfileImage, 'caregiver')}
                alt="간병인"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = care_profileImage;
                }}
              />
              <CaregiverTextDiv>
                <ProfileTextGray>
                  <ProfileTextStrong>{care.userName}</ProfileTextStrong> 님
                </ProfileTextGray>
                <ProfileTextGray>
                  나이
                  <ProfileTextStrong>
                    {care.age} 세 ({care.gender === 'M' ? '남' : care.gender === 'F' ? '여' : '성별 정보 없음'})
                  </ProfileTextStrong>
                </ProfileTextGray>
              </CaregiverTextDiv>
            </CaregiverDiv>

            <CargiverButtonDiv>
              <CareLogButton
                onClick={() =>
                  navigate(`/caregiverProfile/${Number(care.caregiverNo)}`, {
                    state: { matNo: care.matNo },
                  })
                }
              >
                간병인 정보
              </CareLogButton>
              {activeTab === 'matched' && (
                <ReportButton
                  style={{ visibility: care.reviewNo ? 'hidden' : 'visible' }}
                  onClick={() => {
                    setSelectedCaregiver(care); // 선택한 매칭 정보 저장
                    setShowReviewModal(true); // 모달 표시
                  }}
                >
                  리뷰 작성
                </ReportButton>
              )}
            </CargiverButtonDiv>
          </NewWrap>
        ))
      ) : (
        <EmptyMessage>매칭된 간병이 없습니다.</EmptyMessage>
      )}

      {activeTab === 'matched' ? (
        <PageWrapper>
          <Paging currentPage={endedCurrentPage} totalPage={endedTotalPage} chagneCurrentPage={handleEndedPageChange} />
        </PageWrapper>
      ) : (
        <></>
      )}
    </Div>
  );
};

export default PatientCardGroup;

const NewWrap = styled(CargiverWrap)`
  display: ${({ isOpen }) => (isOpen ? 'none' : 'flex')};
`;

const Div = styled.div`
  padding-bottom: 80px; //
  position: relative;
`;
