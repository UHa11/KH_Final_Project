import React from 'react';
import { useState, useEffect } from 'react';
import useUserStore from '../store/userStore.js';
import { GridContainer } from '../styles/common/Container.js';
import profileImage from '../assets/profileImg/img_간병인.png'; //간병인 기본 이미지
import {
  CardText,
  CardButton,
  HiringCard,
  HiringCardTopContent,
  HiringCardImage,
  HiringCardTextGroup,
  HiringCardTitle,
  HiringCardBottomContent,
  JobSeekingCardSection,
  HiringCardText,
  CardBottomTextSection,
  CardRegionText,
  CardWrap,
  NewCantainer,
  NewTitle,
  BackBtn,
} from '../styles/Card.styles.js';
import styled from 'styled-components';
import { proposerService } from '../api/propose.js';
import { useNavigate, useParams } from 'react-router-dom';
import { RiArrowGoBackLine } from 'react-icons/ri';
const SupportBoard = () => {
  const { user } = useUserStore();
  const { hiringNo } = useParams(); // URL에서 hiringNo 받기
  const [proposerList, setproposerList] = useState([]);
  const navigate = useNavigate();
  {
    /* 
    돌봄대상자 버전 : 간병인의 지원목록이 나올것! 
    
    >>> 맵을 돌려서 나와야함 
        돌봄대상자ver 구인서(돌봄대상자)에 대한 구직서 목록 가져올것 
           => 신청테이블(patproposer) resum_no로 조인해서 구직서데이터  가져온것
    */
  }

  useEffect(() => {
    // 로그인하지 않은 경우 이전 페이지로 이동
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate(-1);
      return;
    }
    if (!hiringNo) return; // hiringNo 없으면 실행 안 함

    const fetchList = async () => {
      try {
        const getList = await proposerService.getcareGiverLists(Number(hiringNo));
        setproposerList(getList.proposers || []); // 응답에 proposers 배열이 있다면 할당
      } catch (error) {
        console.error('간병사 지원목록 불러오기 실패:', error);
      }
    };

    fetchList();
  }, [hiringNo]); // hiringNo가 바뀔 때마다 실행

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
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <>
      {/* 보호자ver => 간병사 지원목록 */}
      <>
        <NewCantainer>
          <HeadDiv>
            <NewTitle>간병사 지원목록</NewTitle>
            <BackBtn type="button" onClick={() => navigate(-1)}>
              <p>이전으로</p>
              <RiArrowGoBackLine size={30}></RiArrowGoBackLine>
            </BackBtn>
          </HeadDiv>

          <CardWrap>
            <JobSeekingCardSection>
              <GridContainer>
                {proposerList.map((resume) => (
                  <HiringCard key={resume.proposerNo}>
                    <HiringCardTopContent>
                      <HiringCardImage src={getProfileImageUrl(resume.profileImage)} alt="프로필" />
                      <HiringCardTextGroup>
                        <HiringCardTitle>
                          {maskName(resume.caregiverName)} <span>간병사 </span>
                        </HiringCardTitle>
                        <HiringCardText>
                          나이: {resume.age}세({resume.gender == 'M' ? '남' : '여'})
                        </HiringCardText>
                        <CardText>시급: {resume.account}원</CardText>
                      </HiringCardTextGroup>
                    </HiringCardTopContent>
                    <HiringCardBottomContent>
                      <CardBottomTextSection>
                        <CardRegionText>
                          <span>자격증</span> {resume.hasLicense === true ? 'O' : 'X'}
                        </CardRegionText>
                        <CardRegionText>
                          <span>지역</span> {resume.address}
                        </CardRegionText>
                      </CardBottomTextSection>
                      <CardButton onClick={() => navigate(`/caregiver/resumeDetail/${resume.resumeNo}/${hiringNo}`)}>
                        상세보기
                      </CardButton>
                    </HiringCardBottomContent>
                  </HiringCard>
                ))}
              </GridContainer>
            </JobSeekingCardSection>
          </CardWrap>
        </NewCantainer>
      </>
    </>
  );
};

export default SupportBoard;

export const HeadDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;
