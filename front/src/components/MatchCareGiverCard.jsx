import React, { useEffect } from 'react';
import pat_profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import care_profileImage from '../assets/images/cargiver.png'; // 프로필 이미지 경로
import {
  CargiverWrap,
  CaregiverImg,
  CaregiverDiv,
  CaregiverTextDiv,
  ProfileTextGray,
  ProfileTextStrong,
  CargiverButtonDiv,
  CareLogButton,
  ReportButton,
} from '../styles/MatchingCard';
import { ProfileCard } from '../styles/MatchingCard';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchDate from '../components/SearchDate';
import Paging from './Paging';


const MatchCareGiverCard = ({
  caregiverList,
  cargiverListRest,
  activeTab,
  setShowReviewModal,
  setSelectedCaregiver,
  handleSearchClick,
  selectedPatNo,
  endedCurrentPage,
  endedTotalPage,
  handleEndedPageChange,
}) => {


  useEffect(() => {
    cargiverListRest()

   }, [activeTab]);
 

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
      {activeTab === 'matched' && (
        <SearchDate
          handleSearchClick={handleSearchClick}
          selectedPatNo ={selectedPatNo}
        />
      )}

      {caregiverList && caregiverList.length > 0 ? (
        caregiverList.map((care, index) => (
          <>
            <CargiverWrap key={index}>
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
            </CargiverWrap>
          </>
        ))
      ) : selectedPatNo ? (
        <EmptyMessage>매칭된 간병이 없습니다.</EmptyMessage>
      ) : (
        <EmptyMessage>환자를 선택해주세요</EmptyMessage>
      )}
      <PageWrapper>
        <Paging currentPage={endedCurrentPage} totalPage={endedTotalPage} chagneCurrentPage={handleEndedPageChange} />
      </PageWrapper>
    </Div>
  );
};

export default MatchCareGiverCard;

const EmptyMessage = styled.p`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[3]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const PageWrapper = styled.div`
  width: inherit;
  bottom: 0;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing[2]};
`;
