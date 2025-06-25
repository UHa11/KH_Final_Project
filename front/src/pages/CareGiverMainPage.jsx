import React, { useEffect, useState } from 'react';
import mainBennerImg from '../assets/mainImg/MainBenner1.png';
import { GridContainer } from '../styles/common/Container';
import { styled } from 'styled-components';
import { Section } from '../styles/common/Container';
import { media } from '../styles/MediaQueries';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { hiringService } from '../api/hiring';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MainMoveButton } from '../styles/common/Button';

const CareGiverMainPage = () => {
  const [jobOpeningList, setJobOpeningList] = useState([]);
  const [RoomAndBoardList, setRoomAndBoardList] = useState([]);

  useEffect(() => {
    const loadJobOpeningList = async () => {
      try {
        const list = await hiringService.getJobOpeningList();
        setJobOpeningList(list);

        // list를 기반으로 바로 필터링
        setRoomAndBoardList(list.filter((h) => h.careStatus === 'Y'));
      } catch (error) {
        toast.error('구인 목록을 불러오는데 실패했습니다.');
      }
    };

    loadJobOpeningList();
  }, []);

  // 이름 첫글자 O 처리하기
  const maskName = (name) => {
    if (name.length === 2) {
      return name[0] + '○';
    } else if (name.length >= 3) {
      return name[0] + '○' + name.slice(2);
    }

    return name;
  };

  const navigate = useNavigate();

  return (
    <>
      <HomeBannerSection>
        <MainBannerImage src={mainBennerImg} />

        <InfoBanner>
          <BannerMessage>
            <MessageLine>도움이 필요한 보호자 230명과</MessageLine>
            <MessageLine>정성 어린 마음을 전할 728명의 간병인이 함께합니다.</MessageLine>
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

      <HiringSection>
        <HiringTextSection>
          <HiringTextSectionTitle>도움이 간절한 돌봄 대상자</HiringTextSectionTitle>
        </HiringTextSection>

        <HiringCardSection>
          <GridContainer>
            {jobOpeningList.map((user) => (
              <Card key={user.hiringNo}>
                <CardTopContent>
                  <CardImage src={user.profileImage} />
                  <CardTextGroup>
                    <CardTitle>{maskName(user.patName)} 님</CardTitle>
                    <CardText>
                      <span>나이</span> : {user.patAge}세({user.patGender == 'M' ? '남' : '여'})
                    </CardText>
                    <CardText>
                      <span>시급</span> : {user.account.toLocaleString()}원
                    </CardText>
                  </CardTextGroup>
                </CardTopContent>
                <CardBottomContent>
                  <CardRegion>
                    <span>지역</span> {user.patAddress}
                  </CardRegion>
                  <MainMoveButton onClick={() => navigate(`/hireDetail/${user.hiringNo}`)}>상세보기</MainMoveButton>
                </CardBottomContent>
              </Card>
            ))}
          </GridContainer>
        </HiringCardSection>
      </HiringSection>

      <RoomAndBoardSection>
        <RoomAndBoardTextSection>
          <RoomAndBoardTextSectionTitle>숙식 제공 돌봄 대상자</RoomAndBoardTextSectionTitle>
        </RoomAndBoardTextSection>

        <RoomAndBoardCardSection>
          <GridContainer>
            {RoomAndBoardList.map((user) => (
              <Card key={user.hiringNo}>
                <CardTopContent>
                  <CardImage src={user.profileImage} />
                  <CardTextGroup>
                    <CardTitle>{maskName(user.patName)} 님</CardTitle>
                    <CardText>
                      <span>나이</span> : {user.patAge}세({user.patGender == 'M' ? '남' : '여'})
                    </CardText>
                    <CardText>
                      <span>시급</span> : {user.account.toLocaleString()}원
                    </CardText>
                  </CardTextGroup>
                </CardTopContent>
                <CardBottomContent>
                  <CardRegion>
                    <span>지역</span> {user.patAddress}
                  </CardRegion>
                  <MainMoveButton onClick={() => navigate(`/hireDetail/${user.hiringNo}`)}>상세보기</MainMoveButton>
                </CardBottomContent>
              </Card>
            ))}
          </GridContainer>
        </RoomAndBoardCardSection>
      </RoomAndBoardSection>
    </>
  );
};

export default CareGiverMainPage;

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

// ************* 중단(구인 목록) 섹션 *************

//  구인 관련 섹션
export const HiringSection = styled(HomeBannerSection)`
  padding-top: ${({ theme }) => theme.spacing[0]};
`;

// 구인글 텍스트 섹션
export const HiringTextSection = styled(BannerMessage)`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.third};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

// 구인글 텍스트
export const HiringTextSectionTitle = styled(MessageLine)`
  color: ${({ theme }) => theme.colors.black2};
`;

// 유저 카드 섹션
export const HiringCardSection = styled(Section)`
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
  background-image: ${({ src }) => (src ? `url(${src})` : 'none')};
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

// 지역 텍스트
export const CardRegion = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[1]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  span {
    color: ${({ theme }) => theme.colors.gray[3]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

// ************* 하단(숙식 제공 돌봄 대상자) 섹션 *************

export const RoomAndBoardSection = styled(HiringSection)``;

export const RoomAndBoardTextSection = styled(BannerMessage)`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.third};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

export const RoomAndBoardTextSectionTitle = styled(MessageLine)`
  color: ${({ theme }) => theme.colors.black2};
`;

export const RoomAndBoardCardSection = styled(HiringCardSection)``;
