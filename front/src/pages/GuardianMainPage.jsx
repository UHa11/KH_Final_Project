import React, { useEffect, useState } from 'react';
import mainBennerImg from '../assets/mainImg/MainBenner1.png';
import { GridContainer } from '../styles/common/Container';
import { styled } from 'styled-components';
import { Section } from '../styles/common/Container';
import { media } from '../styles/MediaQueries';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { jobSeekingService } from '../api/jobSeeking';
import { reviewService } from '../api/reviews';
import { useNavigate } from 'react-router-dom';
import { MainMoveButton } from '../styles/common/Button';
import defaultImage from '../assets/images/cargiver.png';
import { userService } from '../api/users';

const GuardianMainPage = () => {
  const [resumeLiset, setResumeLiset] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [counts, setCounts] = useState({ guardianCount: 0, caregiverCount: 0 });

  useEffect(() => {
    const loadResumeList = async () => {
      try {
        const resumeList = await jobSeekingService.getResumeList();
        const reviewList = await reviewService.getReviews();

        setResumeLiset(resumeList);
        setReviewList(reviewList);
      } catch (error) {
        console.error(error);
        const errorMessage = '구직 목록을 불러오는데 실패했습니다.';
        toast.error(errorMessage);
      }
    };

    loadResumeList();
  }, []);

  //간병사 / 보호자수 카운트
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await userService.getUserCounts();
        setCounts(data);
      } catch (error) {
        toast.error('간병인/보호자 수를 불러오는데 실패했습니다.');
      }
    };

    fetchCounts();
  }, []);

  const navigate = useNavigate();

  // 이름 첫글자 O 처리하기
  const maskName = (name) => {
    if (name.length === 2) {
      return name[0] + '○';
    } else if (name.length >= 3) {
      return name[0] + '○' + name.slice(2);
    }

    return name;
  };

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';

  const getProfileImageUrl = (path) => {
    if (!path) return defaultImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, '');
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };
  return (
    <>
      <HomeBannerSection>
        <MainBannerImage src={mainBennerImg} />

        <InfoBanner>
          <BannerMessage>
            <MessageLine>지금까지 도움이 필요한 보호자 {counts.guardianCount}명과</MessageLine>
            <MessageLine>정성 어린 마음을 전할 {counts.caregiverCount}명의 간병인이 함께 했습니다.</MessageLine>
          </BannerMessage>

          <BannerContact>
            <ContactLine>상담문의</ContactLine>
            <ContactLine>간병사와 함께하세요.</ContactLine>
            <ContactLine>
              <PhoneIcon />
              02)525-1333
            </ContactLine>
          </BannerContact>
        </InfoBanner>
      </HomeBannerSection>

      <JobSeekingSection>
        <JobSeekingTextSection>
          <JobSeekingTextSectionTitle>당신의 환자를 돌보고 싶은 간병인들</JobSeekingTextSectionTitle>
        </JobSeekingTextSection>

        <JobSeekingCardSection>
          <GridContainer>
            {resumeLiset.length === 0 ? (
              <EmptyMessage>아직 등록된 구직자가 없습니다.</EmptyMessage>
            ) : (
              resumeLiset.map((resume) => (
                <Card key={resume.resumeNo}>
                  <CardTopContent>
                    <CardImage src={getProfileImageUrl(resume.profileImage)} alt="프로필" />
                    <CardTextGroup>
                      <CardTitle>
                        {maskName(resume.userName)} <span>간병사</span>
                      </CardTitle>
                      <CardText>
                        <span>나이</span> : {resume.age}세({resume.gender == 'M' ? '남' : '여'})
                      </CardText>
                      <CardText>
                        <span>시급</span> : {resume.resumeAccount.toLocaleString()}원
                      </CardText>
                    </CardTextGroup>
                  </CardTopContent>
                  <CardBottomContent>
                    <CardBottomTextSection>
                      <CardRegionText>
                        <span>자격증</span> {resume.hasLicense === true ? 'O' : 'X'}
                      </CardRegionText>
                      <CardRegionText>
                        <span>지역</span> {resume.address}
                      </CardRegionText>
                    </CardBottomTextSection>
                    <MainMoveButton onClick={() => navigate(`/caregiver/resumeDetail/${resume.resumeNo}`)}>
                      상세보기
                    </MainMoveButton>
                  </CardBottomContent>
                </Card>
              ))
            )}
          </GridContainer>
        </JobSeekingCardSection>
      </JobSeekingSection>

      <ReviewSection>
        <ReviewCardTextSection>
          <ReviewCardTextSectionTitle>최신 리뷰</ReviewCardTextSectionTitle>
        </ReviewCardTextSection>

        <GridContainer>
          {reviewList.length === 0 ? (
            <EmptyMessage>아직 등록된 리뷰가 없습니다.</EmptyMessage>
          ) : (
            reviewList.map((review) => (
              <Card key={review.reviewNo}>
                <CardTopContent>
                  <CardImage src={getProfileImageUrl(review.profileImage)} />
                  <CardTextGroup>
                    <CardTitle>
                      {maskName(review.userName)} <span>간병사 </span>
                    </CardTitle>
                    <CardText>
                      <span>나이</span> : {review.age}세({review.gender == 'M' ? '남' : '여'})
                    </CardText>
                    <CardRegionText>
                      <span>지역</span> : {review.address}
                    </CardRegionText>
                  </CardTextGroup>
                </CardTopContent>
                <CardMidBottomContent>
                  <ReviewTextBox>{review.reviewContent}</ReviewTextBox>
                  <ReviewFooter>
                    <ReviewScore>
                      평점 <strong>{review.reviewScore.toFixed(1)}</strong>
                    </ReviewScore>
                    <ReviewDate>작성일 {review.reviewUpdateDate.slice(0, 10)} </ReviewDate>
                  </ReviewFooter>
                </CardMidBottomContent>
              </Card>
            ))
          )}
        </GridContainer>
      </ReviewSection>
    </>
  );
};

export default GuardianMainPage;

// ************* 상단(베너) 섹션 *************

// 홈 배너 섹션 전체 컨테이너
export const HomeBannerSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

// 상단 메인 배너 이미지
export const MainBannerImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

// 텍스트 + 상담 섹션 감싸는 박스 (왼+오 구조)
export const InfoBanner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden;

  ${media.md`
    flex-direction: row;
    aspect-ratio: 5.5 / 1;
  `}
`;

// 왼쪽 메시지 텍스트 영역
export const BannerMessage = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};

  ${media.md`
    width: 75%;
    padding-left: ${({ theme }) => theme.spacing[10]};
  `}
`;

// 오른쪽 상담 섹션
export const BannerContact = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};

  ${media.md`
    width: 25%;
    padding-left: ${({ theme }) => theme.spacing[6]};
  `}

  ${media.lg`
    padding-left: ${({ theme }) => theme.spacing[10]};
  `}
`;

// 아이콘 (전화)
export const PhoneIcon = styled(BiSolidPhoneCall)`
  margin-right: ${({ theme }) => theme.spacing[2]};
  vertical-align: middle;
  font-size: ${({ theme }) => theme.fontSizes.xl};

  ${media.lg`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  `}
`;

// 메시지 라인 (왼쪽 텍스트 라인)
export const MessageLine = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: left;

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `}
  ${media.lg`
    font-size: ${({ theme }) => theme.fontSizes.xl};
  `}
  ${media.xl`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  `}
`;

// 상담 영역 텍스트 (오른쪽)
export const ContactLine = styled(MessageLine)`
  color: ${({ theme }) => theme.colors.white};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
  ${media.lg`
    font-size: ${({ theme }) => theme.fontSizes.xl};
  `}
  ${media.xl`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  `}
`;

// ************* 중단(구직 목록) 섹션 *************

//  구인 관련 섹션
export const JobSeekingSection = styled(HomeBannerSection)`
  padding-top: ${({ theme }) => theme.spacing[0]};
`;

// 구인글 텍스트 섹션
export const JobSeekingTextSection = styled(BannerMessage)`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.third};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

// 구인글 텍스트
export const JobSeekingTextSectionTitle = styled(MessageLine)`
  color: ${({ theme }) => theme.colors.black2};
`;

// 유저 카드 섹션
export const JobSeekingCardSection = styled(Section)`
  padding: ${({ theme }) => theme.spacing[0]};
`;

// 각 카드
export const Card = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.base};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

// 카드 상단 내부 내용
export const CardTopContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
`;

// 이미지
export const CardImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%; // 원형 처리
  background-image: ${({ src }) => `url(${src || defaultImage})`};
  background-size: cover;
  background-position: center;
  flex-shrink: 0; // 축소 방지

  ${media.sm`
    width: 80px;
    height: 80px;
  `}

  ${media.xl`
    width: 100px;
    height: 100px;
  `}
`;

// 카드 상단 내용 제목 + 텍스트 묶는 영역
export const CardTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// 제목 (이름)
export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[1]};
`;

// 텍스트 라벨 (나이, 시급)
export const CardText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[1]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  span {
    color: ${({ theme }) => theme.colors.gray[3]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

// 구분선 + 지역 + 버튼 감싸는 하단 영역
export const CardBottomContent = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[4]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardBottomTextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[1]};
`;

// 자격증 텍스트
export const CardLicenseText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[1]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  span {
    color: ${({ theme }) => theme.colors.gray[3]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;
// 지역 텍스트
export const CardRegionText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[1]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  // 말줄임 처리
  display: inline-block;
  max-width: 150px;
  white-space: nowrap; // 줄바꿈 방지
  overflow: hidden; // 넘친 부분 숨김
  text-overflow: ellipsis; // 넘친 텍스트를 ...으로 표시
  vertical-align: middle;

  span {
    color: ${({ theme }) => theme.colors.gray[3]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  ${media.sm`
    max-width: 120px; 
  `}
`;

// ************* 중하단 패딩 섹션 *************
export const CardMidBottomContent = styled.div`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

// ************* 하단(최신 리뷰) 섹션 *************

// 리뷰 섹션
export const ReviewSection = styled(JobSeekingSection)``;

// 리뷰 텍스트 섹션
export const ReviewCardTextSection = styled(BannerMessage)`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.third};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

// 리뷰 텍스트 섹션 글씨
export const ReviewCardTextSectionTitle = styled(MessageLine)`
  color: ${({ theme }) => theme.colors.black2};
`;

// 리뷰 카드 섹션
export const ReviewCardSection = styled(JobSeekingCardSection)``;

// 리뷰 글
export const ReviewTextBox = styled.div`
  background-color: ${({ theme }) => theme.colors.secondaryLight || '#FFF3EC'};
  color: ${({ theme }) => theme.colors.gray[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

export const ReviewFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ReviewScore = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: 6px;

  strong {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.black};
  }
`;

export const ReviewDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[3]};
`;

// 비어있음 메세지
export const EmptyMessage = styled.p`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[3]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;
