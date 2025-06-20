import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GridContainer } from '../styles/common/Container';
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
import { reviewService } from '../api/reviews';
import Paging from '../components/Paging';
import { media } from '../styles/MediaQueries';

const ITEMS_PER_PAGE = 6;

const ReceivedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getReviews();
        setReviews(data);
      } catch (error) {
        console.error('리뷰 로딩 실패:', error);
      }
    };
    fetchReviews();
  }, []);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const totalPage = Math.ceil(reviews.length / ITEMS_PER_PAGE);

  const maskName = (name) => {
    if (name.length === 2) return name[0] + '○';
    if (name.length >= 3) return name[0] + '○' + name.slice(2);
    return name;
  };

  const averageScore = (reviews.reduce((acc, cur) => acc + cur.score, 0) / reviews.length || 0).toFixed(1);

  const chagneCurrentPage = (value) => {
    setCurrentPage(value);
  };

  return (
    <ReviewWrapper>
      <TopSection>
        <LeftTitle>받은 리뷰</LeftTitle>
        <RightSummary>
          <strong>홍길동 님</strong>
          <ScoreText>
            평점 <AverageScore>{averageScore}</AverageScore> <span>({reviews.length})</span>
          </ScoreText>
        </RightSummary>
      </TopSection>

      <RecivedReviewsGridContainer>
        {reviews.slice(offset, offset + ITEMS_PER_PAGE).map((review) => (
          <Card key={review.reviewNo}>
            <CardTopContent>
              <CardImage src={review.profileImage} />
              <CardTextGroup>
                <CardTitle>{maskName(review.userName)} 님</CardTitle>
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

      <Paging currentPage={currentPage} totalPage={totalPage} chagneCurrentPage={chagneCurrentPage} />
    </ReviewWrapper>
  );
};

export default ReceivedReviews;

const RecivedReviewsGridContainer = styled(GridContainer)`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing[5]};

  ${media.md`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.lg`
    grid-template-columns: repeat(3, 1fr);
  `}
`;

const ReviewWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing[10]};
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-direction: column;

  ${media.md`
    flex-direction: row;
  `}
`;

const LeftTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  ${media.sm`
    font-size: ${({ theme }) => theme.fontSizes.xl};
  `}
  ${media.lg`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  `}
`;

const RightSummary = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};

  ${media.md`
    margin-top: 0;
    font-size: ${({ theme }) => theme.fontSizes.xl};
  `}
`;

const ScoreText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  color: ${({ theme }) => theme.colors.gray[3]};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

const AverageScore = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.gray[1]};
`;
