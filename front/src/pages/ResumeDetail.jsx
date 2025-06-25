import React, { useEffect, useState } from 'react';
import { Container, GridContainer, Section } from '../styles/common/Container';
import profileImage from '../assets/images/cargiver.png'; // 프로필 이미지 경로
import styled from 'styled-components';
import { Input, InputGroup, Title } from '../styles/Auth.styles';
import { media } from '../styles/MediaQueries';
import { SubmitButton } from '../styles/common/Button';
import {
  Card,
  CardTopContent,
  CardImage,
  CardTextGroup,
  CardTitle,
  CardText,
  CardMidBottomContent,
  ReviewTextBox,
  ReviewFooter,
  ReviewScore,
  ReviewDate,
} from './GuardianMainPage';
// import { useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import chatImage from '../assets/icons/icon_채팅아이콘.png'; // 채팅 이미지 경로
// import { useResumeForm } from '../hooks/useResumeForm';

import Paging from '../components/Paging';
import { useNavigate } from 'react-router-dom';
import PatientSelectModal from '../components/PatientSelectModal';
import { useParams } from 'react-router-dom';
import { jobSeekingService } from '../api/jobSeeking';
import { reviewService } from '../api/reviews';
import { userService } from '../api/users';
function ResumeDetail() {
  const [activeTab, setActiveTab] = useState('info');
  const ITEMS_PER_PAGE = 4;
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { resumeNo } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //이건 만약 dto로 유저정보+자격증 까지 불러오지 않고 get을 한번 더 보낼려면~
  // const [userInfo, setUserInfo] = useState(null);

  /*작성자의 리뷰를 갖고오는 코드 */
  useEffect(() => {
    if (activeTab === 'review' && resumeData?.userNo) {
      const fetchUserReviews = async () => {
        try {
          const userReviews = await reviewService.getReviewsByUser(resumeData.userNo);
          setReviews(userReviews);
          setCurrentPage(1); // 탭 전환 시 페이지 초기화
        } catch (error) {
          console.error('리뷰 로딩 실패:', error);
        }
      };

      fetchUserReviews();
    }
  }, [activeTab, resumeData]);

  /*페이지 처리 */
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const totalPage = Math.ceil(reviews.length / ITEMS_PER_PAGE);

  const averageScore = (reviews.reduce((acc, cur) => acc + cur.score, 0) / reviews.length || 0).toFixed(1);

  const chagneCurrentPage = (value) => {
    setCurrentPage(value);
  };

  //이것도 마찬가지로 유저정보 + 이력서 갖고오는 기능
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     if (!resumeData?.userNo) return;

  //     try {
  //       const data = await userService.getUserProfile(resumeData.userNo);
  //       setUserInfo(data[0]); // userService.getUserProfile이 배열 반환 시
  //     } catch (err) {
  //       console.error('유저 정보 불러오기 실패:', err);
  //     }
  //   };

  //   fetchUserInfo();
  // }, [resumeData?.userNo]);

  /*이력서 정보를 갖고오는 (유저 정보 담아서) */
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await jobSeekingService.getResume(resumeNo);
        console.log(data);
        setResumeData(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeNo]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  /*아 */
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSubmitModal = () => {
    const confirm = window.confirm('돌봄 대상자를 신청하시겠습니까?');
    if (confirm) {
      console.log('간병신청 완료');
      setModalOpen(false);
      navigate('/guardian/matchpage'); // 원하는 경로로 이동
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  return (
    <HireRegistSection>
      <HireContainer>
        <HireHead>
          <HireHeadTitle>간병사 정보</HireHeadTitle>
        </HireHead>

        {/* <form onSubmit={handleSubmit}> */}
        <ContentWrapper>
          <div>
            <ProfilImageWrapper>
              <img src={profileImage} alt="프로필 이미지" />
            </ProfilImageWrapper>
            <ChatButton>
              <img src={chatImage} alt="프로필 이미지" />1 : 1 채팅하기
            </ChatButton>
          </div>
          <Divider>
            <InputRow>
              <InputGroup>
                <Label>이름</Label>
                <Input type="text" value={resumeData?.userName || ''} readOnly />
              </InputGroup>
              <InputGroup>
                <Label>나이</Label>
                <Input type="text" value={resumeData?.age || ''} readOnly />
              </InputGroup>
            </InputRow>
            <RadioGroup>
              <Label>성별</Label>
              <RadioWrapper>
                <input type="radio" id="male" name="gender" value="M" readOnly checked={resumeData?.gender === 'M'} />
                <label htmlFor="male">남성</label>
              </RadioWrapper>
              <RadioWrapper>
                <input type="radio" id="female" name="gender" value="F" readOnly checked={resumeData?.gender === 'F'} />
                <label htmlFor="female">여성</label>
              </RadioWrapper>
            </RadioGroup>
            <InputGroup>
              <Label>전화번호</Label>
              <Input type="text" value={resumeData?.phone || ''} readOnly />
            </InputGroup>
            <InputGroup>
              <Label>주소</Label>
              <Input type="text" value={resumeData?.address || ''} readOnly />
            </InputGroup>
          </Divider>
        </ContentWrapper>

        <ContentWrapper2>
          {resumeData?.licenses?.map((license, index) => (
            <>
              <LicenseCard key={index}>
                <LicenseGroup>
                  <Label>자격증 명</Label>
                  <LicenseInput type="text" value={license.licenseName} readOnly />
                </LicenseGroup>
                <LicenseGroup>
                  <Label>발행처</Label>
                  <LicenseInput type="text" value={license.licensePublisher} readOnly />
                </LicenseGroup>
                <LicenseGroup>
                  <Label>발행일</Label>
                  <LicenseInput type="date" value={license.licenseDate} readOnly />
                </LicenseGroup>
              </LicenseCard>
            </>
          ))}
        </ContentWrapper2>

        <HireBottom>
          <HireBottomTitle onClick={() => handleTabChange('info')} active={activeTab === 'info'}>
            지원 정보
          </HireBottomTitle>

          <HireBottomTitle onClick={() => handleTabChange('review')} active={activeTab === 'review'}>
            리뷰
          </HireBottomTitle>
        </HireBottom>
        {activeTab === 'info' && (
          <ContentWrapper1>
            <HireContent>
              <Label>제목</Label>
              <Input value={resumeData?.resumeTitle || ''} readOnly />

              <Label>내용</Label>
              <Content value={resumeData?.resumeContent || ''} readOnly />

              <RadioGroup>
                <RadioContainer>
                  <Label>숙식 가능</Label>
                  <RadioWrapper>
                    <input type="radio" value="Y" checked={resumeData?.careStatus === 'Y'} readOnly />
                  </RadioWrapper>
                  <Label>숙식 불가</Label>
                  <RadioWrapper>
                    <input type="radio" value="N" checked={resumeData?.careStatus === 'N'} readOnly />
                  </RadioWrapper>
                </RadioContainer>
                <AccountGroup>
                  <InputGroup>
                    <Label>희망 금액</Label>
                    <Input value={resumeData?.account || ''} readOnly />
                  </InputGroup>
                </AccountGroup>
              </RadioGroup>
            </HireContent>
          </ContentWrapper1>
        )}

        {activeTab === 'review' && (
          <>
            <ContentWrapper1>
              <RecivedReviewsGridContainer>
                {reviews.slice(offset, offset + ITEMS_PER_PAGE).map((review) => (
                  <Card key={review.reviewNo}>
                    <CardTopContent>
                      <CardImage src={review.profileImage} />
                      <CardTextGroup>
                        <CardTitle>{review.userName} 돌봄대상자</CardTitle>
                        <CardText>
                          나이 {review.age}세({review.gender === 'male' ? '남' : '여'})
                        </CardText>
                      </CardTextGroup>
                    </CardTopContent>
                    <CardMidBottomContent>
                      <ReviewTextBox>{review.reviewContent}</ReviewTextBox>
                      <ReviewFooter>
                        <ReviewScore>
                          평점 <strong>{review.score.toFixed(1)}</strong>
                        </ReviewScore>
                        <ReviewDate>작성일 {review.createDate}</ReviewDate>
                      </ReviewFooter>
                    </CardMidBottomContent>
                  </Card>
                ))}
              </RecivedReviewsGridContainer>
            </ContentWrapper1>
            <Paging></Paging>
          </>
        )}

        <ButtonGroup>
          <BackButton onClick={() => navigate(-1)}>이전</BackButton>
          <SubmitButton1 type="button" onClick={handleOpenModal}>
            간병 신청
          </SubmitButton1>
          {isModalOpen && <PatientSelectModal onClose={handleCloseModal} onSubmit={handleSubmitModal} />}
        </ButtonGroup>
        {/* </form> */}
      </HireContainer>
    </HireRegistSection>
  );
}

const HireRegistSection = styled(Section)``;

const HireContainer = styled(Container)`
  width: 80%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden; /* 내부 요소가 넘치지 않도록 */
`;

const HireHead = styled.div`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[5]};
  margin-top: 10px;
`;

const HireHeadTitle = styled(Title)`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  padding: ${({ theme }) => theme.spacing[6]}; /* 전체 패딩 */
  gap: ${({ theme }) => theme.spacing[6]}; /* 이미지와 입력 필드 그룹 사이 간격 */
  justify-content: space-around;
  ${media.md`

flex-direction: row;
padding: ${({ theme }) => theme.spacing[8]}; /* 큰 화면에서 패딩 증가 */
gap: ${({ theme }) => theme.spacing[10]}; /* 큰 화면에서 간격 증가 */
`}
`;

const ProfilImageWrapper = styled.div`
  flex-shrink: 0; /* 줄어들지 않도록 */
  width: 150px; /* 고정 너비 */
  height: 150px; /* 고정 높이 */
  border-radius: 50%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[100]}; /* 이미지 없을 때 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center; /* 세로 중앙 정렬 */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.md`

width: 200px;
height: 200px;
align-self: flex-start; /* 큰 화면에서는 상단 정렬 */
`}
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};

  ${media.md`

flex-direction: row;
`}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-align: left;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
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

const Divider = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const HireBottom = styled.div`
  width: 100%;
  display: flex;
  padding: 0 ${({ theme }) => theme.spacing[20]};
`;
const HireBottomTitle = styled(Title)`
  margin: 0;
  color: ${({ active, theme }) => (active ? theme.colors.black1 : theme.colors.gray[3])};
  cursor: pointer;
`;

const HireContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ContentWrapper1 = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  padding: ${({ theme }) => theme.spacing[6]}; /* 전체 패딩 */
  gap: ${({ theme }) => theme.spacing[6]}; /* 이미지와 입력 필드 그룹 사이 간격 */
  justify-content: space-around;
  ${media.md`

flex-direction: row;
padding: ${({ theme }) => theme.spacing[6]}; /* 큰 화면에서 패딩 증가 */
gap: ${({ theme }) => theme.spacing[10]}; /* 큰 화면에서 간격 증가 */
`}
`;

const Content = styled.textarea`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  min-height: 400px; /* 원하는 기본 높이 */
  resize: none;
  overflow: hidden; /* 스크롤 숨김 */
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  max-width: 800px;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const BackButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const SubmitButton1 = styled(SubmitButton)`
  width: 65%;
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: white;
`;

const LicenseGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const LicenseInput = styled(Input)``;

//기존
const ContentWrapper2 = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
`;

//변경(contentWrapper2 -> gridWrapper)인혜작성
const GridWrapper = styled.div`
  width: 80%;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.spacing[3]};

  ${media.lg`

display: grid;
grid-template-columns: repeat(5,1fr);
justify-content: center;
gap: 4px;
`}
`;

//인혜작성 시간나면 고치자
const Div = styled.div`
  width: 66px;
`;

const AccountGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const RadioContainer = styled.div`
  display: flex;
  width: 55%;
  gap: ${({ theme }) => theme.spacing[5]};
  align-items: center;
`;

const LicenseCard = styled.div`
  display: flex;
  width: 100%;

  gap: ${({ theme }) => theme.spacing[5]};
`;
const ChatButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-top: ${({ theme }) => theme.spacing[6]};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  img {
    width: 33px;
    height: 33px;
  }
`;

const RecivedReviewsGridContainer = styled(GridContainer)`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  width: 85%;
  gap: ${({ theme }) => theme.spacing[5]};

  ${media.md`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.lg`
    grid-template-columns: repeat(2, 1fr);
  `}
`;

export default ResumeDetail;
