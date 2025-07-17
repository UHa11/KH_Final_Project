import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Section } from '../styles/common/Container';
import { media } from '../styles/MediaQueries';
import { CiCircleInfo } from 'react-icons/ci';
import { MatchForm } from '../hooks/matchFrom';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../api/patient';
import PatientCardGroup from '../components/PatientCardGroup';
import TestPatientCard from '../components/TestPatinetCard';
import {  ProfileCardPair, RightLineDiv } from '../styles/MatchingCard';
import MatchCareGiverCard from '../components/MatchCareGiverCard';
import SearchDate from '../components/SearchDate';
import Paging from '../components/Paging';
import ReviewModal from '../components/ReviewModal';
import useUserStatusStore from '../store/userStatusStore';


const MatchMainPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { setUserStatus } = useUserStatusStore();
  // 매칭 / 매칭종료 상태 구분
  const [activeTab, setActiveTab] = useState('matching');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // 매칭 / 매칭종료 공통 : 유저의 환자정보가져오기
  const [userPatients, setUserpatients] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        return;
      }

      try {
        setUserStatus(true);
        const patientsList = await patientService.getPatients(user.userNo);
        setUserpatients(patientsList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  // 반응형 브레이크 포인트 잡기
  const [isOpen, setIsOpen] = useState(false);
  const BREAKPOINT = 768;

  useEffect(() => {
    if (window.innerWidth >= BREAKPOINT) {
      setIsOpen(false); // 페이지 진입 시 큰 화면이면 상세 보기 닫기
    }
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < BREAKPOINT;
      setIsMobile(mobile);

      if (!mobile) {
        setIsOpen(false); // 데스크탑 전환 시 상세 보기 닫기
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 자식컴포넌트로 보내줌
  // 간병인보기 버튼
  const handleClick = (patNo) => {
    setSelectedPatNo(patNo);
    
    if (activeTab === 'matching') {
      getCareGiver(patNo);
      if (isMobile) {
        setIsOpen(true);
      }
      return;
    }
    if (activeTab === 'matched') {
      getEndedMatchingList(patNo);
      if (isMobile) {
        setIsOpen(true);
      }
      return;
    }

  };
  const handleClose = (patNo) => {
    setSelectedPatNo(patNo);
    setIsOpen(false);
  };

  //리뷰 관련 모달
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);

  // 리뷰 관련 set함수 전달
  const handleSetSelectedCargiver = (list) => {
    setSelectedCaregiver(list);
  };

  const handleSetShowReviewModal = (status) => {
    setShowReviewModal(status);
  };

  const {
    getCareGiver,
    getEndedMatchingList,
    handleEndedPageChange,
    getSearchDateList,
    handleSearchClick,
    setSelectedPatNo,
    handleStartDateChange,
    handleEndDateChange,
    startDate,
    endDate,
    selectedPatNo,
    caregiverList,
    endedCaregiverList,
    endedCurrentPage,
    endedTotalPage,
  } = MatchForm();

  return (
    <>
      <HeadSection>
        <Title>매칭된 간병보기</Title>
        <TitleDiv>
          <Tab>
            <SubTitle onClick={() => handleTabChange('matching')} $active={activeTab === 'matching'}>
              진행중
            </SubTitle>
            <SubTitle>/</SubTitle>
            <SubTitle onClick={() => handleTabChange('matched')} $active={activeTab === 'matched'}>
              종료된 매칭
            </SubTitle>
          </Tab>

          <TipDiv>
            <CiCircleInfo color="#EF7A46" size="20px" style={{ margin: 'auto', width: 'fit-content' }} />
            <p> 돌봄대상자를 클릭하여 종료된 매칭 간병인을 확인하세요.</p>
          </TipDiv>
        </TitleDiv>
      </HeadSection>


      <ProfileCardPair>
        <RightLineDiv>
          {/* 공통 환자목록이 보임 */}
          {/* 특정간병인을 선택 */}
          {!isOpen&& 
            <TestPatientCard
              key={userPatients.patNo}
              patient={userPatients}
              getCareGiver={getCareGiver}
              getEndedMatchingList={getEndedMatchingList}

              activeTab={activeTab}
              handleClick={handleClick}
              setSelectedPatNo={setSelectedPatNo}
              isOpen={isOpen}
              isMobile={isMobile}
            ></TestPatientCard>}
        
        </RightLineDiv>

        {/* 모바일용 간병인 상세보기 */}
        {isOpen ? (
          <PatientCardGroup
            patient={userPatients.find((p) => p.patNo === selectedPatNo)}
            caregiverList={caregiverList}
            endedCaregiverList={endedCaregiverList}
            activeTab={activeTab}
            onClose={() => handleClose}
            endedCurrentPage={endedCurrentPage}
            endedTotalPage={endedTotalPage}
            startDate={startDate}
            endDate={endDate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            handleSearchClick={handleSearchClick}
            handleEndedPageChange={handleEndedPageChange}
            handleSetShowReviewModal={handleSetShowReviewModal}
            handleSetSelectedCargiver={handleSetSelectedCargiver}
            selectedPatNo={selectedPatNo}
            isOpen={isOpen}
          />
        ) : (
          <>
            {!isMobile && (
              <>
                <MatchCareGiverCard
                  caregiverList={caregiverList}
                  endedCaregiverList={endedCaregiverList}
                  activeTab={activeTab}
                  getEndedMatchingList={getEndedMatchingList}
                  handleSearchClick={handleSearchClick}
                  setShowReviewModal={handleSetShowReviewModal}
                  setSelectedCaregiver={handleSetSelectedCargiver}
                  startDate={startDate}
                  endDate={endDate}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  selectedPatNo={selectedPatNo}
                  endedCurrentPage={endedCurrentPage}
                  endedTotalPage={endedTotalPage}
                  handleEndedPageChange={handleEndedPageChange}
                ></MatchCareGiverCard>
              
              </>
            )}
          </>
        )}
      </ProfileCardPair>

      {showReviewModal && (
        <>
          <ReviewModal
            matNo={selectedCaregiver?.matNo}
            onClose={() => setShowReviewModal(false)}
            onSubmitSuccess={() => getEndedMatchingList(selectedPatNo, endedCurrentPage)}
          />
        </>
      )}
    </>
  );
};

export default MatchMainPage;

const HeadSection = styled(Section)`
  display: flex;
  height: auto;
  justify-content: space-between;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[2]};
  align-items: flex-start;
  ${media.md` /* 768px 이상 (태블릿/데스크톱) */
    padding: 40px 16px 10px 16px;
  `}
`;

const TitleDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  ${media.md` /* 768px 이상 (태블릿/데스크톱) */
    flex-direction: row;
  `}
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;

  color: ${({ theme }) => theme.colors.black1};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  justify-content: flex-start;
`;

const TipDiv = styled.div`
  display: flex;
  gap: 10px;
  padding: ${({ theme }) => theme.spacing[3]};

  p {
    width: 95%;
    text-align: left;
  }

  ${media.md`  // 예: 768px 이하일 때
    align-items: flex-start; // 왼쪽 정렬로 자연스럽게
  `}
`;

const Tab = styled.div`
  display: flex;
`;

const SubTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;

  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  justify-content: flex-start;
  color: ${({ $active, theme }) => ($active ? theme.colors.black1 : theme.colors.gray[3])};
  cursor: pointer;
`;

const MatchSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PageWrapper = styled.div`
  width: inherit;
  bottom: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[5]};
`;