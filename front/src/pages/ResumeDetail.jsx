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

import chatImage from '../assets/icons/icon_채팅아이콘.png'; // 채팅 이미지 경로
import Paging from '../components/Paging';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { jobSeekingService } from '../api/jobSeeking';
import { reviewService } from '../api/reviews';
import useUserStore from '../store/userStore';
import { toast } from 'react-toastify';
import { proposerService } from '../api/propose';
import { extractRegionFromEnd } from '../utils/formatData';
function ResumeDetail() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('info');
  const [reviews, setReviews] = useState({ receivedReview: { content: [], totalPage: 0 } });
  const [currentPage, setCurrentPage] = useState(1);

  const { resumeNo, hiringNo } = useParams(); //hiringNo가 없을 수도 있음 (어떤 구인글에 이 이력서로 신청했는지)
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [isMatched, setIsMatched] = useState(false);

  // **새로 추가: 구인글 작성자인지 체크하는 상태**
  const [isHiringOwner, setIsHiringOwner] = useState(false);
  // 구인글 모집 상태 체크
  const [isHiringClosed, setIsHiringClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  /*이력서 정보를 갖고오는 (유저 정보 담아서) */
  useEffect(() => {
    // 로그인하지 않은 경우 이전 페이지로 이동
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // 1) 이력서 데이터 불러오기
        const resume = await jobSeekingService.getResume(Number(resumeNo));
        setResumeData(resume);

        if (hiringNo) {
          // 2) 백엔드 API로 해당 hiringNo 구인글 작성자가 로그인 유저인지 체크
          const result = await proposerService.getHiringOwnerUserNo(Number(hiringNo));
          const { ownerUserNo, hiringStatus } = result;

          if (user?.userNo === ownerUserNo) {
            setIsHiringOwner(true);
          } else {
            alert('권한이 없습니다.');
            navigate('/'); // 권한 없으면 이전 페이지로 이동
            return;
          }
          if (hiringStatus === 'N') {
            setIsHiringClosed(true); // 모집 마감 상태로 체크
          }
        }
      } catch (error) {
        console.error(error);
        alert('데이터를 불러오는데 실패했습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resumeNo, hiringNo, navigate]);

  /*작성자의  리뷰를 갖고오는 코드 */
  useEffect(() => {
    if (activeTab === 'review' && resumeData?.resumeNo) {
      const fetchReviews = async () => {
        try {
          const data = await reviewService.getResumeDetailReviews(currentPage, resumeData.resumeNo);
          setReviews({ receivedReview: data });
        } catch (error) {
          console.error('리뷰 로딩 실패:', error);
        }
      };
      fetchReviews();
    }
  }, [activeTab, currentPage, resumeData?.resumeNo]);

  const chagneCurrentPage = (value) => {
    setCurrentPage(value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAcceptMatching = async () => {
    const confirm = window.confirm('매칭을 수락하시겠습니까?');
    if (!confirm) return;

    try {
      await proposerService.acceptMatching({ resumeNo, hiringNo });
      toast.success('매칭이 수락되었습니다!');
      navigate(`/guardian/careGiverSupportBorad/${hiringNo}`);
    } catch (error) {
      console.error(error);
      toast.error('매칭 수락 중 오류가 발생했습니다.');
    }
  };

  //이미 매칭 수락된 이력서 인지 판단
  useEffect(() => {
    const checkMatched = async () => {
      if (hiringNo) {
        try {
          const matched = await proposerService.checkAccepted({ resumeNo, hiringNo });
          setIsMatched(matched);
        } catch (error) {
          console.error('매칭 상태 확인 실패:', error);
        }
      }
    };
    checkMatched();
  }, [resumeNo, hiringNo]);

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  if (loading) {
    return <div>로딩중...</div>;
  }

  return (
    <HireRegistSection>
      <HireContainer>
        <HireHead>
          <HireHeadTitle>간병사 정보</HireHeadTitle>
        </HireHead>
        <ContentWrapper>
          <div>
            <ProfilImageWrapper>
              <img src={getProfileImageUrl(resumeData?.profileImage)} alt="프로필" />
            </ProfilImageWrapper>
            <ChatButton onClick={() => alert('서비스 구현중입니다')}>
              <img src={chatImage} alt="프로필 이미지" />1 : 1 채팅하기
            </ChatButton>
          </div>
          <Divider>
            <InputRow>
              <InputGroup>
                <Label>이름</Label>
                <ResumeInput type="text" value={resumeData?.userName || ''} readOnly />
              </InputGroup>
              <InputGroup>
                <Label>나이</Label>
                <ResumeInput type="text" value={resumeData?.age || ''} readOnly />
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
            {/* <InputGroup>
              <Label>전화번호</Label>
              <Input type="text" value={resumeData?.phone || ''} readOnly />
            </InputGroup> */}
            <InputGroup>
              <Label>주소</Label>
              <ResumeInput type="text" value={extractRegionFromEnd(resumeData?.address)} readOnly />
            </InputGroup>
          </Divider>
        </ContentWrapper>

        <ContentWrapper2>
          {resumeData?.licenseList?.map((license, index) => (
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
          <HireBottomTitle onClick={() => handleTabChange('info')} $active={activeTab === 'info'}>
            지원 정보
          </HireBottomTitle>

          <HireBottomTitle onClick={() => handleTabChange('review')} $active={activeTab === 'review'}>
            리뷰
          </HireBottomTitle>
        </HireBottom>
        {activeTab === 'info' && (
          <ContentWrapper1>
            <HireContent>
              <Label>제목</Label>
              <ResumeInput value={resumeData?.resumeTitle || ''} readOnly />

              <Label>내용</Label>
              <Content value={resumeData?.resumeContent || ''} readOnly />

              <RadioGroup>
                <RadioContainer>
                  <Label>입주형</Label>
                  <RadioWrapper>
                    <input type="radio" value="Y" checked={resumeData?.careStatus === 'Y'} readOnly />
                  </RadioWrapper>
                  <Label>출퇴근형</Label>
                  <RadioWrapper>
                    <input type="radio" value="N" checked={resumeData?.careStatus === 'N'} readOnly />
                  </RadioWrapper>
                </RadioContainer>
                <AccountGroup>
                  <InputGroup>
                    <Label>희망 시급</Label>
                    <ResumeInput value={resumeData?.resumeAccount || ''} readOnly />
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
                {!reviews.receivedReview?.content || reviews.receivedReview.content.length === 0 ? (
                  <EmptyMessage>받은 리뷰가 없습니다.</EmptyMessage>
                ) : (
                  reviews.receivedReview?.content?.map((review) => (
                    <Card key={review.reviewNo}>
                      <CardTopContent>
                        <CardImage src={getProfileImageUrl(review?.profileImage)} alt="프로필" />
                        <CardTextGroup>
                          <CardTitle>{review.reviewWriterName} 님</CardTitle>
                          <CardText>
                            나이 {review.reviewAge}세({review.gender === 'M' ? '남' : '여'})
                          </CardText>
                        </CardTextGroup>
                      </CardTopContent>
                      <CardMidBottomContent>
                        <ReviewTextBox>{review.reviewContent}</ReviewTextBox>
                        <ReviewFooter>
                          <ReviewScore>
                            평점 <strong>{review.score.toFixed(1)}</strong>
                          </ReviewScore>
                          <ReviewDate>
                            작성일 {review.updateDate ? review.updateDate.slice(0, 10) : '정보 없음'}
                          </ReviewDate>
                        </ReviewFooter>
                      </CardMidBottomContent>
                    </Card>
                  ))
                )}
              </RecivedReviewsGridContainer>
            </ContentWrapper1>
            <Paging
              currentPage={currentPage}
              totalPage={reviews.receivedReview?.totalPage}
              chagneCurrentPage={chagneCurrentPage}
            />
          </>
        )}

        <ButtonGroup>
          <BackButton onClick={() => navigate(-1)}>이전</BackButton>
          {hiringNo && (
            <SubmitButton1
              onClick={handleAcceptMatching}
              disabled={isMatched || isHiringClosed}
              $disabled={isMatched || isHiringClosed}
            >
              {isMatched ? '매칭 완료' : isHiringClosed ? '매칭 수락 불가 (모집 종료)' : '매칭 수락'}
            </SubmitButton1>
          )}

          {resumeData?.userNo !== user?.userNo ? (
            ''
          ) : (
            <SubmitButton1 type="button" onClick={() => navigate(`/caregiver/myresume/${resumeData?.resumeNo}`)}>
              수정하기
            </SubmitButton1>
          )}
        </ButtonGroup>
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

const ResumeInput = styled(Input)`
  pointer-events: none; /* 클릭/포커스 불가 */
  cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
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
    pointer-events: none; /* 클릭/포커스 불가 */
    cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
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
    pointer-events: none; /* 클릭/포커스 불가 */
    cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
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
  color: ${({ $active, theme }) => ($active ? theme.colors.black1 : theme.colors.gray[3])};
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
  pointer-events: none; /* 클릭/포커스 불가 */
  cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
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
  border: 1px solid ${({ theme, $disabled }) => ($disabled ? theme.colors.gray[5] : theme.colors.gray[5])};
  background-color: ${({ theme, $disabled }) => ($disabled ? theme.colors.gray[5] : theme.colors.primary)};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: white;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const LicenseGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const LicenseInput = styled(Input)`
  pointer-events: none; /* 클릭/포커스 불가 */
  cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
`;

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

const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  height: 300px; // 높이 넉넉하게 설정
  display: flex;
  align-items: center; // 수직 가운데
  justify-content: center; // 수평 가운데
  padding: ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[3]};
  text-align: center;
`;

export default ResumeDetail;
