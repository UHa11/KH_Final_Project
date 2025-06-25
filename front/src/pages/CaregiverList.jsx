import React, { useEffect, useState } from 'react';
import { Container, Section } from '../styles/common/Container';
import styled from 'styled-components';
import profileImage from '../assets/profileImg/img_간병인.png'; // 프로필 이미지 경로
import { media } from '../styles/MediaQueries';
import SearchBar from '../components/SearchBar';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';
import { jobSeekingService } from '../api/jobSeeking';
import { useNavigate } from 'react-router-dom';
import Paging from '../components/Paging';

const CaregiverList = () => {
  const [caregiverLists, setCaregiverLists] = useState([]);
  const [loading, setLoading] = useState(false); // 초기 false
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gender, setGender] = useState('');
  const [account, setAccount] = useState('');
  const [careStatus, setCareStatus] = useState(false);

  //검색창
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  // 1. 컴포넌트가 처음 마운트될 때 전체 리스트를 불러옵니다.
  useEffect(() => {
    loadHireLists(false); // 초기 로딩 시에는 필터 없이 전체 데이터 요청
  }, []);

  // 간병사모집 리스트를 불러오는 함수
  const loadHireLists = async () => {
    try {
      setLoading(true);
      setError(null);

      const caregiverList = await jobSeekingService.getResumeList();
      setCaregiverLists(caregiverList);
    } catch (error) {
      console.error(error);
      const errorMessage = '간병사모집 리스트를 가져오지 못했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // SearchBar에서 검색 버튼을 눌렀을 때 호출되는 함수
  const handleSearchSubmit = (keyword) => {
    // SearchBar로부터 받은 키워드를 searchKeyword 상태에 저장합니다.
    setKeyword(keyword);
    // 이 상태 변경은 위에 있는 useEffect를 트리거하여 자동으로 검색을 실행시킬 것입니다.
  };

  // 숙식 제공 체크박스 변경 핸들러
  const handleCheckChange = (e) => {
    setCareStatus(e.target.checked);
    // 이 상태 변경 역시 위에 있는 useEffect를 트리거하여 자동으로 검색을 실행시킬 것입니다.
  };
  return (
    <>
      <SearchSection>
        <Title>간병사 모집</Title>
        <SearchContainer>
          <SearchDivder>
            <Section1>
              <SearchDivder1>
                <SelectBox value={address} onChange={(e) => setAddress(e.target.value)}>
                  <option value="">지역</option>
                  <option value="서울">서울</option>
                  <option value="부산">부산</option>
                  <option value="제주">제주</option>
                  {/* 더 많은 지역 옵션 */}
                </SelectBox>
              </SearchDivder1>

              <SearchDivder1>
                <ACCOUNT
                  type="number"
                  placeholder="시급 ~ 이상"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </SearchDivder1>
            </Section1>
            <Section2>
              <SearchDivder1>
                <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <DateSeparator>-</DateSeparator>
                <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </SearchDivder1>
              <SearchDivder1>
                <SearchBar onSearch={handleSearchSubmit} />
              </SearchDivder1>
            </Section2>
            <Section3>
              <SearchDivder1>
                <RadioGroup>
                  <RadioWrapper>
                    {/* checked prop 전달 */}
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={gender === 'M'}
                      onChange={() => setGender('M')}
                    />
                    <label htmlFor="male">남성</label>
                  </RadioWrapper>
                  <RadioWrapper>
                    {/* checked prop 전달 */}
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={gender === 'F'}
                      onChange={() => setGender('F')}
                    />
                    <label htmlFor="female">여성</label>
                  </RadioWrapper>
                  <RadioWrapper>
                    <input
                      type="radio"
                      id="anyGender"
                      name="gender"
                      value="" // 성별 무관을 위해 빈 문자열로 설정
                      checked={gender === ''}
                      onChange={() => setGender('')}
                    />
                    <label htmlFor="anyGender">성별 무관</label>
                  </RadioWrapper>
                </RadioGroup>
              </SearchDivder1>
              <SearchDivder2>
                <AccommodationCheckboxLabel>
                  <HiddenCheckbox type="checkbox" checked={careStatus} onChange={handleCheckChange} />
                  <StyledCheckbox checked={careStatus}>
                    {handleCheckChange && <IoCheckmarkOutline size="20px" color="white" />}
                  </StyledCheckbox>
                  관련 자격증 소지
                </AccommodationCheckboxLabel>
                <AccommodationCheckboxLabel>
                  <HiddenCheckbox type="checkbox" checked={careStatus} onChange={handleCheckChange} />
                  <StyledCheckbox checked={careStatus}>
                    {handleCheckChange && <IoCheckmarkOutline size="20px" color="white" />}
                  </StyledCheckbox>
                  상주 간병인
                </AccommodationCheckboxLabel>
                <AccommodationCheckboxLabel>
                  <HiddenCheckbox type="checkbox" checked={careStatus} onChange={handleCheckChange} />
                  <StyledCheckbox checked={careStatus}>
                    {handleCheckChange && <IoCheckmarkOutline size="20px" color="white" />}
                  </StyledCheckbox>
                  높은 평점 순
                </AccommodationCheckboxLabel>
              </SearchDivder2>
            </Section3>
          </SearchDivder>
        </SearchContainer>
      </SearchSection>

      {/* 여기부턴 간병인 리스트 */}

      {loading ? (
        <LoaderWrapper>
          <ClipLoader size={50} color={({ theme }) => theme.colors.primary} />
        </LoaderWrapper>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <HireListSection>
          {caregiverLists.map((resume) => (
            <HireListCard onClick={() => navigate(`/resumeDetail/${resume.resumeNo}`)} key={resume.resumeNo}>
              <CardHeader>
                <ProfileImage src={resume.profileImage || profileImage} alt="프로필" />
                <HeaderContent>
                  <Divder>
                    <UserInfo>
                      <UserName>
                        {resume.userName} <GrayText>님</GrayText>
                      </UserName>
                      <UserAge>
                        <GrayText>나이</GrayText> {resume.age}세(
                        {resume.gender === 'M' ? '남' : resume.gender === 'F' ? '여' : ''})
                      </UserAge>
                    </UserInfo>
                    <CareContent>{resume.resumeTitle}</CareContent>
                    <div></div>
                  </Divder>

                  {resume.score && <AccommodationInfo>평점 {resume.score}</AccommodationInfo>}
                </HeaderContent>
              </CardHeader>
              <CardFooter>
                <LocationWage>
                  <LocationText>
                    <GrayText>지역</GrayText> {resume.address}
                  </LocationText>
                  <AccuontText>
                    <GrayText>시급</GrayText> <BoldAccount>{resume.account}원</BoldAccount>
                  </AccuontText>
                </LocationWage>
                <USERINFO1>
                  {resume.licenses && <AccommodationInfo>자격증 보유</AccommodationInfo>}
                  {resume.careStatus ? (
                    <AccommodationInfo>상주 간병 O</AccommodationInfo>
                  ) : (
                    <AccommodationInfo>상주 간병 X</AccommodationInfo>
                  )}
                </USERINFO1>
              </CardFooter>
            </HireListCard>
          ))}
          <Paging></Paging>
        </HireListSection>
      )}
    </>
  );
};

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  color: ${({ theme }) => theme.colors.gray[800]};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  justify-content: flex-start;
`;

const SearchContainer = styled(Container)`
  height: 300px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
`;
const SearchDivder1 = styled.div`
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const SearchDivder2 = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SearchDivder = styled.div`
  display: flex;
  height: 100%;
`;

const SearchSection = styled(Section)``;

const Section1 = styled(Section)`
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  justify-content: center;
  text-align: center;
`;
const Section2 = styled(Section)`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;
const Section3 = styled(Section)`
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const SelectBox = styled.select`
  width: 80%;
  height: 50px;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border: none;
  border-radius: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.spacing[4]};
`;

const DateInput = styled.input`
  height: 50px;

  border-radius: ${({ theme }) => theme.spacing[1]};
  padding: 0 ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.spacing[4]};
  background-color: white;
`;

const DateSeparator = styled.span`
  margin: 0 5px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[1]};
`;
const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  // 'checked' prop을 받아서 스타일을 동적으로 적용합니다.
  input[type='radio'] {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in-out;
    background-color: white;
    // RadioWrapper에서 전달받은 checked prop 사용
    border: 1px solid ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.gray[4])};
  }

  input[type='radio']::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease-in-out;
  }

  input[type='radio']:checked::before {
    transform: translate(-50%, -50%) scale(1);
  }

  label {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.gray[1]};
    cursor: pointer;
  }
`;

const ACCOUNT = styled.input`
  width: 80%;
  height: 50px;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border: none;
  border-radius: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.spacing[4]};
`;

const AccommodationCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */
  color: ${({ theme }) => theme.colors.gray[800]}; /* 텍스트 색상 */
  font-size: ${({ theme }) => theme.fontSizes.base};
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.gray[4])}; /* 회색 400으로 통일 */
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, checked }) => (checked ? theme.colors.primary : 'white')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;
/*돌봄 대상자 리스트 관련 */
const HireListSection = styled(Section)`
  height: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const HireListCard = styled.div`
  width: 100%;
  margin: 0 auto; /* 중앙 정렬 */
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden; /* 내부 요소가 넘치지 않도록 */
`;

// --- 상단 영역 스타일 ---
const CardHeader = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  padding: ${({ theme }) => theme.spacing[4]}; /* 작은 화면용 패딩 */
  align-items: center; /* 세로 중앙 정렬 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  gap: ${({ theme }) => theme.spacing[3]}; /* 작은 화면용 간격 */
  font-size: ${({ theme }) => theme.fontSizes.xs};

  ${media.sm`
    flex-direction: row; /* sm 이상에서는 가로로 나열 */
    padding: ${({ theme }) => theme.spacing[6]}; /* 큰 화면용 패딩 */
    gap: ${({ theme }) => theme.spacing[6]}; /* 큰 화면용 간격 */
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

const ProfileImage = styled.img`
  width: 60px; /* 작은 화면 이미지 크기 */
  height: 60px;
  border-radius: 50%;
  object-fit: cover;

  ${media.sm`
    width: 80px; /* sm 이상 이미지 크기 */
    height: 80px;
  `}
`;

const HeaderContent = styled.div`
  flex-grow: 1; /* 남은 공간을 차지하도록 */
  display: grid; /* 그리드 레이아웃으로 배치 */
  grid-template-columns: 1fr auto; /* 왼쪽(이름,내용)은 1프랙션, 오른쪽(날짜)은 자동 너비 */
  grid-template-rows: auto auto; /* 2개의 행 */
  gap: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[4]}; /* 행/열 간격 */
  align-items: center; /* 세로 중앙 정렬 */
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 작은 화면에서 중앙 정렬 */
  grid-column: 1;
  gap: ${({ theme }) => theme.spacing[2]};

  ${media.sm`
    align-items: baseline; /* sm 이상에서 원래대로 */
  `}
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg}; /* 작은 화면 폰트 크기 */
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xl}; /* sm 이상 폰트 크기 */
  `}
`;

const UserAge = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 작은 화면 폰트 크기 */
  color: ${({ theme }) => theme.colors.gray[600]};
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.md}; /* sm 이상 폰트 크기 */
  `};
`;

const CareContent = styled.span`
  grid-column: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 작은 화면 폰트 크기 */
  color: ${({ theme }) => theme.colors.gray[800]};
  text-align: center; /* 작은 화면에서 중앙 정렬 */

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.md}; /* sm 이상 폰트 크기 */
    text-align: left; /* sm 이상에서 왼쪽 정렬 */
  `}
`;

const DateInfo = styled.span`
  grid-column: 1 / span 2; /* 작은 화면에서는 1줄 전체 사용 */
  grid-row: auto;
  font-size: ${({ theme }) => theme.fontSizes.xs}; /* 작은 화면 폰트 크기 */
  color: ${({ theme }) => theme.colors.gray[500]};
  white-space: nowrap;
  align-self: center; /* 수직 중앙 정렬 */
  text-align: center; /* 작은 화면에서 중앙 정렬 */

  ${media.sm`
    grid-column: 2; /* sm 이상에서 원래 컬럼 */
    grid-row: 1 / span 2; /* sm 이상에서 원래 행 */
    font-size: ${({ theme }) => theme.fontSizes.sm}; /* sm 이상 폰트 크기 */
    text-align: right; /* sm 이상에서 오른쪽 정렬 */
  `}
`;

// --- 하단 영역 스타일 ---
const CardFooter = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  justify-content: space-between;
  align-items: center; /* 작은 화면에서 중앙 정렬 */
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]}; /* 작은 화면 패딩 */
  gap: ${({ theme }) => theme.spacing[2]}; /* 작은 화면 간격 */

  ${media.sm`
    flex-direction: row; /* sm 이상에서는 가로로 나열 */
    padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]}; /* sm 이상 패딩 */
    gap: ${({ theme }) => theme.spacing[4]}; /* sm 이상 간격 */
  `}
`;

const LocationWage = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]}; /* 지역과 시급 사이 간격 */
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const LocationText = styled.span``;

const GrayText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[4]};
`;
const AccuontText = styled.span`
  strong {
    font-size: ${({ theme }) => theme.fontSizes.base}; /* 작은 화면 시급 강조 */
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${media.sm`
    strong {
      font-size: ${({ theme }) => theme.fontSizes.lg}; /* sm 이상 시급 강조 */
    }
  `}
`;

const BoldAccount = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const AccommodationInfo = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md}; /* 작은 화면 폰트 크기 */
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[3]};
  white-space: nowrap;

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xl}; /* sm 이상 폰트 크기 */
  `}
`;

const USERINFO1 = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Divder = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  width: 100%; /* 부모 너비 채움 */

  ${media.sm`
    /* sm 이상에서는 그리드 레이아웃의 자식으로 적절히 동작 */
  `}
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: red;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-top: ${({ theme }) => theme.spacing[5]};
`;
export default CaregiverList;
