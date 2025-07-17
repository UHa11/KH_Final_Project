import React, { useEffect, useState } from 'react';
import { Section } from '../styles/common/Container';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import { useNavigate } from 'react-router-dom';
import { patientService } from '../api/patient';
import useUserStore from '../store/userStore';
import { matchingService } from '../api/matching';
import Paging from '../components/Paging';
import {
  CardWrap,
  CardInnerWrap,
  ProfileSection,
  ProFileImges,
  TextWrap,
  InfoSection,
  BtnSection,
  ReportBtn,
  EndBtn,
} from '../styles/MatchingCard';
import { media } from '../styles/MediaQueries';
import useUserStatusStore from '../store/userStatusStore';

const MatchToPatient = () => {
  const [activeTab, setActiveTab] = useState('matching');
  const { user } = useUserStore();
  const [patientList, setPatientList] = useState();
  const navigate = useNavigate();
  const { setUserStatus } = useUserStatusStore();
  // 진행중 매칭 관련
  const [caregiverList, setCareGiverList] = useState([]);
  const [userPatients, setUserpatients] = useState([]);

  // // 종료된 매칭 관련 페이징 상태
  const [endedPatientList, setEndedPatientList] = useState([]);
  const [endedCurrentPage, setEndedCurrentPage] = useState(1);
  const [endedTotalPage, setEndedTotalPage] = useState(1);
  // const [selectedPatNo, setSelectedPatNo] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        return;
      }

      try {
        setUserStatus(false);
        const patientsList = await patientService.getPatients(user.userNo);
        setUserpatients(patientsList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    try {
      const patientList = await matchingService.getMatchingPatient(user.userNo, 'Y');
     
      patientList.length === 0 ? setPatientList([]) : setPatientList(patientList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndMatching = async (matNo) => {
    try {
 
      const confirmDelete = window.confirm('종료된 매칭으로 이동됩니다. 정말로 간병을 종료하시겠습니까?');

      if (!confirmDelete) return;

      await matchingService.getMatchingChangeStatus(matNo, 'N');
      await fetchAll();

      // 상태 변경 후 다시 불러오기
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchEndedMatching = async () => {
      if (!user || activeTab !== 'matched') return;

      try {
        const res = await matchingService.findMatchedPatients(user.userNo, 'N', endedCurrentPage - 1);
      
        setEndedPatientList(res.content);
        setEndedCurrentPage(res.currentPage + 1); // ← 여기가 핵심
        setEndedTotalPage(res.totalPage); // ← 주의: API에선 totalPage로 오네요
      } catch (err) {
        console.error('종료된 매칭 불러오기 실패:', err);
      }
    };

    fetchEndedMatching();
  }, [activeTab, endedCurrentPage]);

  const chagneCurrentPage = (value) => {
    setEndedCurrentPage(value);
  };

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <>
      <HeadSection>
        <TitleDiv>
          <Title>매칭된 돌봄대상자 보기</Title>
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
      </HeadSection>

      {/* {activeTab === 'matched' ? (

 
        <SearchDivWrap>
          <SearchInput placeholder="찾으시는 돌봄대상자를 검색하세요"></SearchInput>
          <SearchBtn>
            <SearchIcon>
              <IoSearchOutline />
            </SearchIcon>
          </SearchBtn>
        </SearchDivWrap>
      ) : (
        <></>
      )} */}

      {/*진행중 매칭 */}
      <MatchSection>
        <CardWrap list={activeTab === 'matching' ? patientList : endedPatientList}>
          {activeTab === 'matching' && (
            <>
              {patientList && patientList.length > 0 ? (
                patientList.map((pat) => (
                  <CardInnerWrap key={pat.matNo}>
                    <ProfileSection>
                      <ProFileImges src={getProfileImageUrl(pat?.profileImage)} alt="프로필" />
                      <InfoSection>
                        <TextWrap>
                          <img src="/src/assets/icons/icon_Group.png" />
                          <p>{pat.patName} 님</p>
                        </TextWrap>
                        <TextWrap>
                          <img src="/src/assets/icons/icon_age.png" />
                          <p>{pat.patAge} 세</p>
                        </TextWrap>
                        <TextWrap>
                          <img src="/src/assets/icons/icon_gender.png" />
                          <p>{pat.patGender === 'F' ? '여성' : '남성'}</p>
                        </TextWrap>
                      </InfoSection>
                    </ProfileSection>

                    <BtnSection>
                      <ReportBtn onClick={() => navigate(`/report/${pat.patNo}`)}>간병일지 보기</ReportBtn>
                      <EndBtn type="button" onClick={() => handleEndMatching(pat.matNo)}>
                        간병 종료
                      </EndBtn>
                    </BtnSection>
                  </CardInnerWrap>
                ))
              ) : (
                <>
                  <EmptyMessage> 매칭된 환자가 없습니다. </EmptyMessage>
                </>
              )}
            </>
          )}

          {activeTab === 'matched' && (
            <>
              {endedPatientList && endedPatientList.length > 0 ? (
                endedPatientList.map((pat) => (
                  <CardInnerWrap key={pat.matNo}>
                    <ProfileSection>
                      <ProFileImges src={getProfileImageUrl(pat?.profileImage)} alt="프로필" />
                      <InfoSection>
                        <TextWrap>
                          <img src="/src/assets/icons/icon_Group.png" />
                          <p>{pat.patName} 님</p>
                        </TextWrap>
                        <TextWrap>
                          <img src="/src/assets/icons/icon_age.png" />
                          <p>{pat.patAge}세</p>
                        </TextWrap>
                        <TextWrap>
                          <img src="/src/assets/icons/icon_gender.png" />
                          <p>{pat.patGender === 'F' ? '여성' : '남성'}</p>
                        </TextWrap>
                        <TextWrap>
                          <img src="/src/assets/icons/icon_달력.png" />
                          <p>
                            {pat.startDate?.slice(0, 10)} ~ {pat.endDate?.slice(0, 10)}
                          </p>
                        </TextWrap>
                      </InfoSection>
                    </ProfileSection>
                    <BtnSection>
                      <InfoButton onClick={() => navigate(`/report/${pat.patNo}`, { state: { status: 'N' } })}>
                        간병일지 보기
                      </InfoButton>
                    </BtnSection>
                  </CardInnerWrap>
                ))
              ) : (
                <EmptyMessage> 종료된 매칭 환자가 없습니다. </EmptyMessage>
              )}
            </>
          )}
        </CardWrap>
        {activeTab === 'matched' && (
          <Paging currentPage={endedCurrentPage} totalPage={endedTotalPage} chagneCurrentPage={chagneCurrentPage} />
        )}
      </MatchSection>
    </>
  );
};

const HeadSection = styled(Section)`
  display: flex;
  height: auto;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  align-items: flex-start;
  ${media.md` /* 768px 이상 (태블릿/데스크톱) */
    padding: 40px 16px 10px 16px;
  `}
`;

const TitleDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl}; /* 모바일 기본 폰트 크기 */
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: left; /* 모바일 기본: 왼쪽 정렬 */
  color: ${({ theme }) => theme.colors.black1};
  padding: ${({ theme }) => theme.spacing[5]} 0; /* 모바일 기본 패딩 */
  display: flex;
  justify-content: flex-start;

  ${media.md` /* 768px 이상 */
    font-size: ${({ theme }) => theme.fontSizes['2xl']};

    padding: ${({ theme }) => theme.spacing[3]};
    text-align: center; /* 데스크톱에서 중앙 정렬 (원래 위치) */
  `}
`;

const SubTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg}; /* 모바일 기본 폰트 크기 */
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: left; /* 모바일 기본: 왼쪽 정렬 */
  color: ${({ $active, theme }) => ($active ? theme.colors.black1 : theme.colors.gray[3])};
  padding: ${({ theme }) => theme.spacing[1]} 0; /* 모바일 기본 패딩 */
  display: flex;
  justify-content: flex-start;
  cursor: pointer;

  ${media.md` /* 768px 이상 */
    font-size: ${({ theme }) => theme.fontSizes['xl']};
    padding: ${({ theme }) => theme.spacing[3]};
    text-align: center; /* 데스크톱에서 중앙 정렬 (원래 위치) */
  `}
`;

const Tab = styled.div`
  display: flex;
  align-items: flex-start; /* 모바일 기본: 왼쪽 정렬 */
  gap: ${({ theme }) => theme.spacing[2]};

  ${media.md` /* 768px 이상 */
    flex-direction: row; /* 가로 정렬 */
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    ${SubTitle}:nth-child(even) { /* 데스크톱에서 '/' 다시 보이기 */
      display: flex;
    }
  `}
`;

const MatchSection = styled(Section)`
  width: 100%;
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  flex-direction: column; /* 모바일 우선: 카드 쌍들이 세로로 쌓이도록 */
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]}; /* 모바일 기본 패딩 */
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const InfoButton = styled.button`
  width: 100%;
  margin: ${({ theme }) => theme.spacing[5]};
  padding: ${({ theme }) => theme.spacing[5]};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};

  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap; /* 버튼 텍스트가 줄바꿈되지 않도록 */
  font-size: ${({ theme }) => theme.fontSizes.sm};

  ${media.md` /* 576px 이상 */
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

const EmptyMessage = styled.p`
  width: 100%;
  height: 700px;
  text-align: center;
  font-size: 0.875rem;
  color: #6c757d;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 6px;
`;
export default MatchToPatient;
