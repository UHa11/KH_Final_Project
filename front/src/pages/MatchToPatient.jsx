import React, { useState } from 'react';
import { Section } from '../styles/common/Container';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import { useNavigate } from 'react-router-dom';
const MatchToPatient = () => {
  const [activeTab, setActiveTab] = useState('matching');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>
      <HeadSection>
        <TitleDiv>
          <Title>매칭된 간병보기</Title>
          <Tab>
            <SubTitle onClick={() => handleTabChange('matching')} active={activeTab === 'matching'}>
              진행중
            </SubTitle>
            <SubTitle>/</SubTitle>
            <SubTitle onClick={() => handleTabChange('matched')} active={activeTab === 'matched'}>
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
              <ProfileCard type="patient">
                <ProfileImage src={profileImage} alt="환자" />
                <ProfileInfo>
                  <UserName>박영희 님</UserName>
                  <UserAge>나이 50세(여)</UserAge>
                </ProfileInfo>
                <ButtonRow>
                  <InfoButton >간병일지보기</InfoButton>
                  <ReportButton>간병 종료</ReportButton>
                </ButtonRow>
              </ProfileCard>
            </ProfileCardPair>
          </>
        )}

        {activeTab === 'matched' && (
          <>
            <ProfileCardPair>
              <ProfileCard type="patient">
                <ProfileImage src={profileImage} alt="환자" />
                <ProfileInfo>
                  <UserName>박영희 님</UserName>
                  <UserAge>나이 80세(여)</UserAge>
                </ProfileInfo>
                <ButtonRow>
                  <InfoButton>간병일지</InfoButton>
                </ButtonRow>
              </ProfileCard>
            </ProfileCardPair>
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

  color: ${({ theme }) => theme.colors.gray[800]};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  justify-content: flex-start;
`;

const SubTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;

  color: ${({ theme }) => theme.colors.gray[800]};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  justify-content: flex-start;
  color: ${({ active, theme }) => (active ? theme.colors.black1 : theme.colors.gray[3])};
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

// 카드를 두 개씩 묶어 가로로 배치하는 컨테이너
const ProfileCardPair = styled.div`
  display: flex;
  justify-content: center; /* 내부 카드들을 중앙으로 정렬 */
  gap: ${({ theme }) => theme.spacing[8]}; /* 카드 사이의 간격 */
  width: 100%; /* 부모 컨테이너의 너비 전체 사용 */
  max-width: 1200px; /* 전체 카드 쌍의 최대 너비 (조절 가능) */
  margin-bottom: ${({ theme }) => theme.spacing[8]}; /* 각 카드 쌍 아래쪽 간격 */
`;

// 개별 카드 스타일
const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  gap: ${({ theme }) => theme.spacing[4]};
  width: 100%; /* ProfileCardPair 내에서 각 카드의 너비 (gap을 고려하여 50%보다 약간 작게) */
  box-sizing: border-box; /* 패딩과 보더가 너비에 포함되도록 */
`;

// 프로필 이미지 스타일
const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  /* ProfileCard의 type prop에 따라 배경색이 변경됩니다. */
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const UserName = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const UserAge = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[600]}; /* 어두운 회색으로 변경 */
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ButtonRow = styled.div`
  display: flex;

  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  flex-grow: 1;
`;

const InfoButton = styled.button`
  width: 50%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.secondary}; /* 주황색 */
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap; /* 버튼 텍스트가 줄바꿈되지 않도록 */
`;

const ReportButton = styled.button`
  width: 50%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.danger}; /* 빨간색 */
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap;
`;

const CareLogButton = styled(InfoButton)`
  /* InfoButton 스타일을 상속받아 '간병일지' 버튼 스타일링 */
  /* 필요하다면 여기에서 추가 스타일을 정의할 수 있습니다. */
  margin-top: ${({ theme }) => theme.spacing[2]}; /* 나이 아래 버튼 간격 */
  align-self: flex-start; /* 왼쪽 정렬 */
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
export default MatchToPatient;
