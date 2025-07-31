import { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import { CiCircleInfo } from 'react-icons/ci';
import { MatchForm } from '../hooks/matchFrom';
import { matchingService } from '../api/matching';
import { patientService } from '../api/patient';
import styled from 'styled-components';
import { Section } from '../styles/common/Container';
import { media } from '../styles/MediaQueries';
import pat_profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import care_profileImage from '../assets/images/cargiver.png'; // 프로필 이미지 경로
import { InfoButton, ProfileCardPair, ProfileImage, ProfileInfo, UserAge, UserName } from '../styles/MatchingCard';
import { useNavigate } from 'react-router-dom';
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
  BtnSection,
  ProfileCard,
} from '../styles/MatchingCard';
import Paging from '../components/Paging';
import SearchDate from '../components/SearchDate';
import { searchForm } from '../hooks/searchForm';

const MatchToCareGiver = () => {
  // 매칭중 매칭종료 변경
  const [activeTab, setActiveTab] = useState('matching');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentList([]);
  };

  const [patientList, setPatientList] = useState([]);
  const [currentList, setCurrentList] = useState([]);

  const navigate = useNavigate();
  const { user } = useUserStore();

  useEffect(() => {
    console.log(user.userNo);
    if (!user?.userNo) return;

    const fetch = async () => {
      try {
        const result = await patientService.getPatients(user.userNo);
        setPatientList(result);
        console.log('환자 리스트:', result);
      } catch (err) {
        console.error('환자 리스트 요청 실패:', err);
      }
    };

    fetch();
  }, [user]);

  const {
    getCareGiver,
    getEndedMatchingList,
    handleEndedPageChange,
    handleSearchClick,
    setSelectedPatNo,

    selectedPatNo,
    caregiverList,

    endedCaregiverList,
    endedCurrentPage,
    endedTotalPage,
  } = MatchForm();




  //매칭중/ 매칭종료에 따른 간병인 목록을 다르게 가져옴

  const handleClick = (patNo) => {
    setSelectedPatNo(patNo);

    if (activeTab === 'matching') {
      getCareGiver(patNo);
      setCurrentList(caregiverList);
    } else if (activeTab === 'matched') {
      getEndedMatchingList(patNo);
      setCurrentList(endedCaregiverList);
    }
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

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path, type = 'caregiver') => {
    if (!path) {
      return type === 'patient' ? pat_profileImage : care_profileImage;
    }
    const cleanPath = path.replace(/^\//, ''); // 슬래시 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

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
        {patientList && patientList.length > 0 ? (
          patientList.map((pat) => (
            <>
              <ProfileCard type="patient">
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

                    {/* <TestBtn type="button" onClick={() => handleClick(pat.patNo)}>
                  간병인 보기
                </TestBtn> */}
                  </BtnSection>
                </ProfileInfo>
              </ProfileCard>

              {activeTab === 'matched' && (
                <SearchDate
                  handleSearchClick={handleSearchClick}
                  selectedPatNo={selectedPatNo}
                />
              )}

              {currentList &&
                currentList.length > 0 &&
                currentList.map((care, index) => (
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
                              {care.age} 세 (
                              {care.gender === 'M' ? '남' : care.gender === 'F' ? '여' : '성별 정보 없음'})
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
                              console.log('selected care:', care);
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
                ))}
            </>
          ))
        ) : (
          <EmptyMessage>등록된 환자가 없습니다.</EmptyMessage>
        )}

        {/* 
               {selectedPatNo ? (
                  <EmptyMessage>매칭된 간병이 없습니다.</EmptyMessage>
                ) : (
                  <EmptyMessage>환자를 선택해주세요</EmptyMessage>
                )} */}
        <PageWrapper>
          <Paging currentPage={endedCurrentPage} totalPage={endedTotalPage} chagneCurrentPage={handleEndedPageChange} />
        </PageWrapper>
      </ProfileCardPair>
    </>
  );
};

export default MatchToCareGiver;

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

export const EmptyMessage = styled.p`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[3]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

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

const Div = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageWrapper = styled.div`
  width: inherit;
  bottom: 0;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing[2]};
`;
