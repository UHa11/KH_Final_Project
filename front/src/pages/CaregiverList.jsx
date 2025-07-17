import React, { useEffect, useState } from 'react';
import { Container, Section } from '../styles/common/Container';
import styled from 'styled-components';
import profileImage from '../assets/profileImg/img_간병인.png'; // 프로필 이미지 경로
import { media } from '../styles/MediaQueries';
import SearchBar from '../components/SearchBar';
import { ClipLoader } from 'react-spinners';
import { jobSeekingService } from '../api/jobSeeking';
import { Link } from 'react-router-dom';
import Paging from '../components/Paging';
import { addressService } from '../api/address';
import { extractRegionFromEnd } from '../utils/formatData';

const CaregiverList = () => {
  const [caregiverLists, setCaregiverLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  //상세검색창
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({
    region: '',
    account: '',
    home: '',
    patGender: '',
    keyword: '',
  });
  const [region, setRegion] = useState([]); // 지역
  const [sgg, setSgg] = useState([]); // 시,군,구
  const [selectedCd, setSelectedCd] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSgg, setSelectedSgg] = useState('');
  const [updateData, setUpdateData] = useState({});

  // 'region': 지역 목록 보여줌, 'sgg': 시군구 목록 보여줌
  const [displayMode, setDisplayMode] = useState('region');

  //마운트시 페이징처리 및 지역불러오기
  useEffect(() => {
    // API에선 0부터 시작일 가능성 있어 -1 처리
    loadCaregiverLists(page - 1, size, updateData);

    //마운트시 초기 지역목록 가져오기(region)
    const fetchInitialRegions = async () => {
      try {
        const initialRegions = await addressService.getRegionList();
        setRegion(initialRegions);
        // console.log('CaregiverList에 온 값:', initialRegions);
      } catch (error) {
        console.error('초기 지역 목록 조회 실패:', error);
      }
    };
    fetchInitialRegions();
  }, [page, size]);

  // 이름 첫글자 O 처리하기
  const maskName = (name) => {
    if (name.length === 2) {
      return name[0] + ' ○ ';
    } else if (name.length >= 3) {
      return name[0] + ' ○ ' + name.slice(2);
    }

    return name;
  };

  // SearchBar에서 검색 버튼을 눌렀을 때 호출되는 함수
  const handleSearchSubmit = async (keyword) => {
    // SearchBar로부터 받은 키워드를 searchKeyword 상태에 저장합니다.

    let finalRegionValue = ``;
    if (selectedSgg) {
      finalRegionValue = selectedSgg;
    } else {
      finalRegionValue = selectedRegion;
    }

    const finalForm = {
      ...data,
      keyword: keyword,
      region: finalRegionValue?.fullAddr,
    }; // 최신 상태 생성

    setUpdateData(finalForm); // 상태 업데이트
    setPage(1);

    await loadCaregiverLists(page - 1, size, finalForm);
  };

  // 간병사모집 리스트를 불러오는 함수
  const loadCaregiverLists = async (pageNumber, pageSize, searchData) => {
    try {
      setLoading(true);
      setError(null);

      const caregiverList = await jobSeekingService.getCaregiverList({ page: pageNumber, size: pageSize, searchData });

      setCaregiverLists(caregiverList); // 이게 구조를 보여줌
      if (caregiverList.totalElements === 0) {
        setCaregiverLists([]);
        setError('등록된 간병사 모집 글이 없습니다.');
      } else {
        setCaregiverLists(caregiverList.content);
        setTotalPages(caregiverList.totalPage);
      }
    } catch (error) {
      setError('간병사모집 리스트를 가져오지 못했습니다.' + error);
    } finally {
      setLoading(false);
    }
  };

  //상세검색 눌렀는가? 창 오픈
  const handleDetail = () => {
    setVisible((prev) => !prev);
  };

  //범용적인 input값 처리용
  const dataInfo = (e) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  //지역선택 버튼 클릭시 지역들 출력
  const handleGetRegionClick = () => {
    setSelectedCd(null);
    setSelectedRegion(null);
    setSgg([]);
    setSelectedSgg(null);
    setDisplayMode('region'); //지역 목록을 보여주도록 세팅
  };

  //지역 선택시 시군구 출력
  const handleRegionChange = async (region) => {
    // 이미 선택된 지역이면 API 호출 방지 (불필요한 재렌더링 및 API 호출 방지)
    if (selectedCd === region.cd && displayMode == 'sgg') {
      return;
    }

    setSelectedCd(region.cd);
    setSelectedRegion(region);

    //지역을 바꾸면 시군구도 초기화되게
    setSelectedSgg(null);
    setSgg([]);

    try {
      const sggList = await addressService.getRegionList(region.cd);
      setSgg(sggList);
      setDisplayMode('sgg');
    } catch (error) {
      console.error('시군구 조회 실패:', error);
    }
  };

  //시군구 선택시
  const handleSggChange = async (sgg) => {
    try {
      setSelectedSgg(sgg);
    } catch (error) {
      console.error('시군구 조회 실패:', error);
    }
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
      <SearchSection>
        <Title>간병사 모집</Title>

        <SearchContainer2>
          <Search>
            <SearchBar onSearch={handleSearchSubmit} />
            <DetailBtn onClick={handleDetail}>상세검색</DetailBtn>
          </Search>
          {visible && (
            <Detail $visible={visible}>
              <Item>
                <RegionDiv>
                  {displayMode === 'region' && region.length > 0
                    ? region.map((region) => (
                        <RegionLabel key={region.cd}>
                          <RadioWrapper>
                            <input
                              type="radio"
                              name="region"
                              value={region.cd}
                              checked={selectedCd === region.cd}
                              onChange={() => handleRegionChange(region)}
                            />
                            <p> {region.addrName}</p>
                          </RadioWrapper>
                        </RegionLabel>
                      ))
                    : displayMode === 'region' && <p>로딩중...</p>}
                </RegionDiv>
              </Item>
              <Item>
                <RegionDiv>
                  {displayMode === 'sgg' && sgg.length > 0
                    ? sgg.map((sgg) => (
                        <RegionLabel key={sgg.cd}>
                          <RadioWrapper>
                            <input
                              type="radio"
                              name="sgg"
                              value={sgg}
                              // checked={}
                              onChange={() => handleSggChange(sgg)}
                            />
                            <p>{sgg.addrName}</p>
                          </RadioWrapper>
                        </RegionLabel>
                      ))
                    : displayMode === 'sgg' &&
                      selectedRegion && <p>{selectedRegion.addrName}에 해당하는 시군구가 없습니다.</p>}
                </RegionDiv>
              </Item>
              <SearchSelect>
                <div>
                  <RegionBtn onClick={handleGetRegionClick}>지역 초기화</RegionBtn>
                  {selectedRegion && <p>지역 :{selectedSgg ? selectedSgg.fullAddr : selectedRegion.fullAddr}</p>}
                </div>
                <div>
                  <div>
                    <SearchTitle>근무유형: </SearchTitle>
                    <SelectBox name="home" value={data.home} onChange={dataInfo}>
                      <option value="">전체</option>
                      <option value="Y">입주</option>
                      <option value="N">출퇴근</option>
                    </SelectBox>
                  </div>
                  <div>
                    <SearchTitle>최대 시급:</SearchTitle>
                    <ACCOUNT
                      name="account"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="시급"
                      value={data.account}
                      onChange={dataInfo}
                    />
                  </div>
                  <div>
                    <SearchTitle>성별:</SearchTitle>
                    <RadioWrapper>
                      {/* checked prop 전달 */}
                      <input
                        type="radio"
                        id="male"
                        name="patGender"
                        value="M"
                        checked={data.patGender === 'M'}
                        onChange={dataInfo}
                      />
                      <Label htmlFor="male">남성</Label>
                    </RadioWrapper>
                    <RadioWrapper>
                      {/* checked prop 전달 */}
                      <input
                        type="radio"
                        id="female"
                        name="patGender"
                        value="F"
                        checked={data.patGender === 'F'}
                        onChange={dataInfo}
                      />
                      <Label htmlFor="female">여성</Label>
                    </RadioWrapper>
                    <RadioWrapper>
                      <input
                        type="radio"
                        id="anyGender"
                        name="patGender"
                        value="" // 성별 무관을 위해 빈 문자열로 설정
                        checked={data.patGender === ''}
                        onChange={dataInfo}
                      />
                      <Label2 htmlFor="anyGender">성별 무관</Label2>
                    </RadioWrapper>
                  </div>
                </div>
              </SearchSelect>
            </Detail>
          )}
        </SearchContainer2>
      </SearchSection>

      {/* 여기부턴 간병인 리스트 */}

      {loading ? (
        <LoaderWrapper>
          <ClipLoader size={50} color={({ theme }) => theme.colors.primary} />
        </LoaderWrapper>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <CaregiverListSection>
          {caregiverLists.map((resume) => (
            <CaregiverListCard to={`/caregiver/resumeDetail/${resume.resumeNo}`} key={resume.resumeNo}>
              <CardHeader>
                <ProfileImage src={getProfileImageUrl(resume.profileImage)} alt="프로필" />

                <HeaderContent>
                  <Divder>
                    <UserInfo>
                      <UserName>
                        {maskName(resume.userName)} <GrayText>님</GrayText>
                      </UserName>
                      <UserAge>
                        나이 {resume.age}세(
                        {resume.gender === 'M' ? '남' : resume.gender === 'F' ? '여' : ''})
                      </UserAge>
                    </UserInfo>
                    <CareContent>{resume.resumeTitle}</CareContent>
                    <div></div>
                  </Divder>
                  {resume.avgScore > 0 && (
                    <AccommodationInfo>평점 {Math.round(resume.avgScore * 10) / 10}</AccommodationInfo>
                  )}
                </HeaderContent>
              </CardHeader>
              <CardFooter>
                <LocationWage>
                  <LocationText>
                    <GrayText>시급</GrayText>
                    <BoldText>{resume.resumeAccount}원</BoldText>
                  </LocationText>
                  <AccuontText>
                    <GrayText>지역</GrayText>
                    <BoldText>{extractRegionFromEnd(resume.address)}</BoldText>
                  </AccuontText>
                </LocationWage>

                <USERINFO1>
                  {resume.hasLicense && <GrayText>자격증 보유</GrayText>}
                  <AccommodationInfo>
                    <GrayText>근무유형 </GrayText>
                    {resume.careStatus ? (
                      <CareStatusTag>입주형 </CareStatusTag>
                    ) : (
                      <CareStatusTag>출퇴근형</CareStatusTag>
                    )}
                  </AccommodationInfo>
                </USERINFO1>
              </CardFooter>
            </CaregiverListCard>
          ))}
          <Paging totalPage={totalPages} currentPage={page} chagneCurrentPage={(newPage) => setPage(newPage)} />
        </CaregiverListSection>
      )}
    </>
  );
};

//----------------------------- 검색 -----------------------------------
const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  color: ${({ theme }) => theme.colors.gray[1]};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  justify-content: flex-start;
`;

const SearchContainer2 = styled(Container)`
  padding: 20px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailBtn = styled.p`
  width: 100px;
  padding-left: 16px;
  color: ${({ theme }) => theme.colors.gray[3]};
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ theme }) => theme.colors.gray[2]};
  }
`;

const Detail = styled.div`
  margin-top: 20px;
  user-select: none;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
`;

const Item = styled.div`
  margin: auto;
`;

const RegionDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const RegionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 4px;
  padding-left: 10px;

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

const RegionBtn = styled.button`
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin: 10px;
  &:hover {
    transform: scale(0.95); /* 5% 확대 */
  }
`;

const SearchSelect = styled.div`
  margin: auto;
  > div {
    width: auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > div {
      display: grid;
      margin-top: 10px;
    }
    > div:first-of-type,
    div:nth-of-type(2) {
      grid-template-columns: 90px 150px;
    }
    > div:nth-of-type(3) {
      width: auto;
      grid-template-columns: 90px repeat(2, 70px) 100px;
    }
  }
`;

const SearchTitle = styled.span`
  width: 80px;
  text-align: right;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[1]};
`;

const Items = styled.div`
  display: flex;
  align-items: center;
  grid-column: span 1;
`;

const SelectBox = styled.select`
  width: 120px;
  height: 30px;
  text-align: center;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.spacing[4]};

  &:option {
    text-align: center;
  }
`;

const ACCOUNT = styled.input`
  width: 150px;
  height: 30px;
  text-align: center;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.spacing[4]};
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

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

const Label = styled.label`
  width: 40px;
  text-align: center;
`;

const Label2 = styled.label`
  width: 80px;
  text-align: center;
`;

//------------------------------------------------------------

const SearchSection = styled(Section)``;

/*돌봄 대상자 리스트 관련 */
const CaregiverListSection = styled(Section)`
  height: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const CaregiverListCard = styled(Link)`
  width: 100%;
  margin: 0 auto; /* 중앙 정렬 */
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden; /* 내부 요소가 넘치지 않도록 */
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

// --- 상단 영역 스타일 ---
const CardHeader = styled.div`
  display: flex;

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
  ${media.sm`
  flex-direction : 
    align-items: baseline; /* sm 이상에서 원래대로 */
  `}
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
  color: ${({ theme }) => theme.colors.gray[3]};
  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.base}; /* sm 이상 폰트 크기 */
  `};
`;

const CareContent = styled.span`
  text-align: center; /* 작은 화면에서 중앙 정렬 */
  display: none;

  ${media.md`
  display: block;
  color: ${({ theme }) => theme.colors.black1}; */
    font-size: ${({ theme }) => theme.fontSizes.lg}; /* sm 이상 폰트 크기 */
    text-align: left; /* sm 이상에서 왼쪽 정렬 */
  `}
`;

// --- 하단 영역 스타일 ---
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]}; /* 작은 화면 패딩 */
  gap: ${({ theme }) => theme.spacing[2]}; /* 작은 화면 간격 */

  ${media.md`
    flex-direction: row; /* sm 이상에서는 가로로 나열 */
    padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]}; /* sm 이상 패딩 */
    gap: ${({ theme }) => theme.spacing[4]}; /* sm 이상 간격 */

  `}
`;

const LocationWage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]}; /* 지역과 시급 사이 간격 */
  color: ${({ theme }) => theme.colors.gray[3]};
  flex-direction: column;
  ${media.md`
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing[6]}; /* 지역과 시급 사이 간격 */
  `}
`;

const LocationText = styled.span``;

const GrayText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[3]};
  margin-right: ${({ theme }) => theme.spacing[2]};
  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

const BoldText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black1};
  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

const CareStatusTag = styled.div`
  margin: ${({ theme }) => theme.spacing[2]};
  display: inline;
  justify-content: center;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.third};
  width: fit-content;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[3]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[5]};

  ${media.sm`
      font-size: ${({ theme }) => theme.fontSizes.base}; 

  `}
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

const AccommodationInfo = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 작은 화면 폰트 크기 */
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[3]};
  white-space: nowrap;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base}; /* sm 이상 폰트 크기 */
  `}
`;

const USERINFO1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  ${media.md`
   
  align-items: center;
    flex-direction : row;
    gap: ${({ theme }) => theme.spacing[8]};
  `}
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
