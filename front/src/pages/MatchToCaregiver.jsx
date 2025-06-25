import React, { useState, useEffect } from 'react';
import { Section } from '../styles/common/Container';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import useUserStore from '../store/userStore';
import { matchingService } from '../api/matching';
import { patientService } from '../api/patient';
import { useNavigate } from 'react-router-dom';

const MatchToCaregiver = () => {
  const { user } = useUserStore();

const [activeTab, setActiveTab] = useState('matching');
  const [caregiverList, setCareGiverList] = useState([]);
  const [userPatients, setUserpatients] = useState([]);
 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인 후 이용해주세요');
        return;
      }
      try {
        const patientsList = await patientService.getPatients(user.userNo);
        setUserpatients(patientsList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, [user]);

  // 현재 매칭정보 : 특정 환자의 간병인 목록 가져오기
  const getCareGiver = (patno) => {
    const getList = async () => {
      try {
        const careGiverList = await matchingService.getMatchginCargiver(patno, 'Y');

        careGiverList.length === 0 ? setCareGiverList([]) : setCareGiverList(careGiverList);
      } catch (err) {
        console.error(err);
      }
    };
    getList();
  };

  // 종료된 매칭정보
  const getEndmatchingList = () => {
    const getList = async () => {
      try {
        const EndMatchingList = await matchingService.getEndMatching('N');
        setCareGiverList(EndMatchingList);
      } catch (err) {
        console.error(err);
      }
    };
    getList();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'matched') {
      getEndmatchingList();
    }
  };

  return (
    <>
      <HeadSection>
        <TitleDiv>
          <Title>매칭된 간병보기</Title>
          <Tab>
            <SubTitle onClick={() => handleTabChange('matching')} $active={activeTab === 'matching'}>
              진행중
            </SubTitle>
            <SubTitle>/</SubTitle>
            <SubTitle onClick={() => handleTabChange('matched')} $active={activeTab === 'matched'}>
              종료된 매칭
            </SubTitle>
          </Tab>
        </TitleDiv>

        <SerachDiv>
          <CaregiverSearch></CaregiverSearch>
        </SerachDiv>
      </HeadSection>
      {/*진행중 매칭 */}
      <MatchSection>
        {activeTab === 'matching' && (
          <>
            <ProfileCardPair>

              <RightLineDiv>
                {userPatients?.map((pat) => (
                  <ProfileCard key={pat.patNo} type="patient" onMouseEnter={() => getCareGiver(pat.patNo)}>
                    <ProfileImage src={profileImage} alt="환자" />
                    <ProfileInfo>
                      <UserName>{pat.patName} 님</UserName>
                      <UserAge>나이 {pat.patAge}세(여)</UserAge>
                      <InfoButton onClick={() => navigate(`/report/${pat.patNo}`)}> 간병일지 보기</InfoButton>
                    </ProfileInfo>
                  </ProfileCard>
                ))}
              </RightLineDiv>
              <div>
                {caregiverList?.map((care) => (
                  <>
                    <CargiverWrap key={care.caregiverNo}>
                      <CaregiverImg src={care.profileImage} alt="" />
                      <CaregiverTextDiv>
                        <ProfileTextGray>
                          <ProfileTextStrong>{care.userName}</ProfileTextStrong> 님
                        </ProfileTextGray>

                        <ProfileTextGray>
                          나이
                          <ProfileTextStrong>
                            {care.userAge} 세({care.gender})
                          </ProfileTextStrong>
                        </ProfileTextGray>
                      </CaregiverTextDiv>
                      <CargiverButtonDiv>
                        
                        <CareLogButton onClick={() => navigate(`/caregiverProfile/${Number(care.caregiverNo)}`)}>간병인 정보</CareLogButton>
                        <ReportButton>신고하기</ReportButton>
                      </CargiverButtonDiv>
                    </CargiverWrap>
                  </>
                ))}
              </div>
</ProfileCardPair>
          </>
        )}

        {activeTab === 'matched' && (
      
          <>
            {caregiverList.map((care) => (
              <EndProfileCard key={care.caregiverNo}>
                <RowProfileCard>
                  <ProfileImage src={care.profileImage} alt=" 간병인" />
                  <div>
                    <UserName>{care.userName} 님</UserName>
                    <UserAge>나이 {care.useAge}세({care.gender})</UserAge>
                    <ButtonRow>
                      <CareLogButton onClick={() => navigate(`/caregiverProfile/${Number(care.caregiverNo)}`)} >간병인 정보</CareLogButton>
                      <ReportButton>신고하기</ReportButton>
                    </ButtonRow>
                  </div>
                </RowProfileCard>

                <RowProfileCard>
                {/* 환자이미지 변수명이랑 겹쳐요 ㅜㅜ */}
                  <ProfileImage src={profileImage} alt="간병인" />
                  <div>
                    <UserName>{care.patName} 님</UserName>
                    <UserAge>나이 {care.patAge}세({care.patGender})</UserAge>
                    <CareLogButton>간병일지</CareLogButton>
                  </div>
                </RowProfileCard>
              </EndProfileCard>
            ))}
          </>

        )}
      </MatchSection>
    </>
  );
};

const HeadSection = styled(Section)`
  height: 200px;
  display: flex;
  justify-content: space-between;
`;

const TitleDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const CaregiverSearch = styled(SearchBar)``;

const SerachDiv = styled.div`
  display: flex;
  align-items: flex-end;
  width: 30%;
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
const Tab = styled.div`
  display: flex;
  align-items: center;
`;

const MatchSection = styled(Section)`
  height: auto;
  display: flex;
  flex-direction: column;

  align-items: center; /* 카드 쌍 전체를 가로 중앙으로 정렬 */
  padding: ${({ theme }) => theme.spacing[8]} 0; /* 상하 패딩 추가 */
`;

//=== 종료된 매칭
const EndProfileCard = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[16]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing[40]};
  align-items: center;
`;

const RowProfileCard = styled.div`
  display: flex;
  justify-content: left;
  gap: ${({ theme }) => theme.spacing[8]};
`;

// 환자정보랑 간병인 정보 분리
const ProfileCardPair = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%; /* 부모 컨테이너의 너비 전체 사용 */
  max-width: 1200px; /* 전체 카드 쌍의 최대 너비 (조절 가능) */
  margin-bottom: ${({ theme }) => theme.spacing[8]}; /* 각 카드 쌍 아래쪽 간격 */
`;

/*====== 환자 스타일 =====*/
const ProfileCard = styled.div`
  display: flex;

  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};

  gap: ${({ theme }) => theme.spacing[8]};
  width: 100%; /* ProfileCardPair 내에서 각 카드의 너비 (gap을 고려하여 50%보다 약간 작게) */
  box-sizing: border-box; /* 패딩과 보더가 너비에 포함되도록 */

  &:hover {
    background-color: #fcfaf0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
`;

// 프로필 이미지 스타일
const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  /* ProfileCard의 type prop에 따라 배경색이 변경됩니다. */
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1; /* 남은 공간을 채우도록 */
  gap: ${({ theme }) => theme.spacing[2]};
`;

const UserName = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const UserAge = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray[3]}; /* 어두운 회색으로 변경 */
`;

const InfoButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary}; /* 주황색 */
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[8]}`};
  margin: ${({ theme }) => theme.spacing[3]} 0;
border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap; /* 버튼 텍스트가 줄바꿈되지 않도록 */
`;

const RightLineDiv = styled.div`
  min-height: 800px;
  border-right: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-grow: 1;
`;

/*====== 간병인 스타일 =====*/
const CargiverWrap = styled.div`
  display: flex;
  justify-content: space-around;
  gap: ${({ theme }) => theme.spacing[12]};
  height: fit-content;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[4]} 0;
  padding: ${({ theme }) => theme.spacing[2]};
`;

const CaregiverImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const CaregiverTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: start;
`;

const ProfileTextGray = styled.p`
  color: ${({ theme }) => theme.colors.gray[3]};
`;

const ProfileTextStrong = styled.strong`
  color: ${({ theme }) => theme.colors.black1};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const CargiverButtonDiv = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
`;
const ReportButton = styled.button`
  background-color: ${({ theme }) => theme.colors.danger}; /* 빨간색 */
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap;
`;

const CareLogButton = styled.button`
  width: 200px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap;
`;

export default MatchToCaregiver;
