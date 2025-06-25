import React, { useEffect, useState } from 'react';
import { Container, Section } from '../styles/common/Container';
import profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import chatImage from '../assets/icons/icon_채팅아이콘.png'; // 채팅 이미지 경로
import styled from 'styled-components';
import { SubmitButton } from '../styles/common/Button';
import { FaPlus } from 'react-icons/fa6';
import { media } from '../styles/MediaQueries';
import { useNavigate } from 'react-router-dom';
import { Input, InputGroup, Title } from '../styles/Auth.styles';
import useUserStore from '../store/userStore';
import { hiringService } from '../api/hiring';
import { useParams } from 'react-router-dom';
import { guardianHiringForm } from '../hooks/guardianHiringForm';
import { proposerSevice } from '../api/propose.js';

const HireDetail = () => {
  const navigate = useNavigate();
  const { hiringNo } = useParams();
  const { user } = useUserStore();
  const [jobOpening, setJobOpening] = useState();
  const [proposerList, setproposerList] = useState([]);

  const { register, handleSubmit, errors, isSubmitting, watch, setValue, reset } = guardianHiringForm();

  // 수정중
  const currentGender = watch('patGender');

  useEffect(() => {
    if (!user) {
      alert('로그인 후 이용해주세요');
      // navigate('/guardian');
    }
    // 구인글의 번호로 가져온다 (hiringNo)
    const getJobOpening = async () => {
      const getOneJobOpening = await hiringService.getHirngById(1);
      setJobOpening(getOneJobOpening);
      
      console.log(getOneJobOpening);
    };

    getJobOpening();

    // 구직글을 가져온다. => 신청테이블에서 구인글의 번호로(hiringNo) 구직글을 가져온다
    const getList = async () => {
      const list = await proposerSevice.getcareGiverLists(1);
      setproposerList(list);
    };
    getList();
  }, [user]);

  useEffect(() => {
    if (jobOpening) {
      reset({
        patName: jobOpening.patName || '',
        patAge: jobOpening.patAge || '',
        patGender: jobOpening.patGender || '',
        patAddress: jobOpening.patAddress || '',
        patHeight: jobOpening.patHeight || '',
        patWeight: jobOpening.patWeight || '',
        phone: jobOpening.phone || '',
      });
    }
  }, [jobOpening]);

  return (
    <>
      <Wrapper>
        <ImageStack>
          {proposerList.slice(0, 3).map((list, index) => (
            <ProfileImg
              key={index}
              src={list.profileImage}
              style={{ left: `${index * 20}px`, zIndex: proposerList.length - index }}
            />
          ))}
        </ImageStack>

        <NewTitle>지원현황 {proposerList.length}명</NewTitle>
        <ActionButton type="button" onClick={() => navigate('/guardian/careGiverSupportBorad')}>
          확인하기
        </ActionButton>
      </Wrapper>

      <HireContainer>
        <HireHead>
          <HireHeadTitle>돌봄대상자 정보</HireHeadTitle>
        </HireHead>
        <form>
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
                  <Input type="text" id="patName" {...register('patName')} readOnly />
                </InputGroup>
                <InputGroup>
                  <Label>나이</Label>
                  <Input type="text" id="patAge" {...register('patAge')} readOnly />
                </InputGroup>
              </InputRow>
              <RadioGroup>
                <Label>성별</Label>
                <RadioWrapper checked={currentGender === 'M'}>
                  {' '}
                  {/* checked prop 전달 */}
                  <input
                    type="radio"
                    id="M"
                    name="patGender"
                    value="M"
                    checked={currentGender === 'M'} // watch 값으로 제어
                    {...register('patGender')} // register만 남김
                    readOnly
                  />
                  <label htmlFor="M">남성</label>
                </RadioWrapper>
                <RadioWrapper checked={currentGender === 'F'}>
                  {/* checked prop 전달 */}
                  <input
                    type="radio"
                    id="F"
                    name="patGender"
                    value="F"
                    checked={currentGender === 'F'} // watch 값으로 제어
                    {...register('patGender')} // register만 남김
                    readOnly
                  />
                  <label htmlFor="F">여성</label>
                </RadioWrapper>
              </RadioGroup>
              <InputGroup>
                <Label>보호자 전화번호</Label>
                <Input type="text" id="phone" {...register('phone')} readOnly />
              </InputGroup>
              <InputGroup>
                <Label>주소</Label>
                <Input type="text" id="patAddress" {...register('patAddress')} readOnly />
              </InputGroup>
              <InputRow>
                <InputGroup>
                  <Label>키</Label>
                  <Input type="text" id="patHeight" {...register('patHeight')} readOnly />
                </InputGroup>
                <InputGroup>
                  <Label>몸무게</Label>
                  <Input type="text" id="patWeight" {...register('patWeight')} readOnly />
                </InputGroup>
              </InputRow>
            </Divider>
          </ContentWrapper>
          <ContentWrapper>
            <DiseaseGroup>
              <Label>보유한 질병</Label>
              <DiseaseInputDiv>
                <TagsUl id="tags">
                  {jobOpening?.tags?.map((tag, index) => (
                    <li key={index}>
                      <span>{tag}</span>
                    </li>
                  ))}
                </TagsUl>
              </DiseaseInputDiv>
            </DiseaseGroup>
          </ContentWrapper>
          <HireBottom>
            <HireBottomTitle>채용 정보</HireBottomTitle>
          </HireBottom>
          <ContentWrapper1>
            <HireContent>
              <Label>제목</Label>
              <Input type="text" id="hiringTitle" {...register('hiringTitle')} />
              <InputRow>
                <InputGroup>
                  <Label>지급 금액 (시급)</Label>
                  <Input type="text" id="account" {...register('account')} />
                </InputGroup>
                <InputGroup>
                  <Label>시작일</Label>
                  <Input type="date" id="startDate" {...register('startDate')} />
                </InputGroup>

                <InputGroup>
                  <Label>종료일</Label>
                  <Input type="date" id="endDate" {...register('endDate')} />
                </InputGroup>
                <InputGroup>
                  <Label>모집 인원수 설정</Label>
                  <Input type="number" id="maxApplicants" {...register('maxApplicants')} />
                </InputGroup>
              </InputRow>
              <Label>내용</Label>
              <Content type="text" id="hiringContent" {...register('hiringContent')} />
              <RadioGroup>
                <Label>숙식 제공 여부</Label>
                <RadioWrapper>
                  <input type="radio" id="careStatus" {...register('careStatus')} />
                  <label htmlFor="careStatus">0</label>
                </RadioWrapper>
                <RadioWrapper>
                  <input type="radio" id="careStatus" {...register('careStatus')} readOnly />
                  <label htmlFor="careStatus">X</label>
                </RadioWrapper>
              </RadioGroup>
              <InputGroup>
                <Label>숙소 정보</Label>
                {/* 클릭 가능한 div */}
                <RoomImage>
                  <Plus />
                </RoomImage>
                <input type="file" style={{ display: 'none' }} />
              </InputGroup>
            </HireContent>
          </ContentWrapper1>
        </form>
        <ButtonGroup>
          <BackButton onClick={() => navigate(-1)}>이전</BackButton>
          <SubmitButton1>모집종료</SubmitButton1>
          <SubmitButton1>수정하기</SubmitButton1>
        </ButtonGroup>
      </HireContainer>
    </>
  );
};

/* ======== 지원자 현황  ========*/

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  gap: 50px;
  margin: 20px auto;
  margin-top: 30px;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;
const ImageStack = styled.div`
  position: relative;
  height: 50px;
  width: 20%;
  margin-bottom: 16px;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  border: 2px solid white;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

/* ======== main   ========*/

const HireRegistSection = styled(Section)``;
const NewTitle = styled.h2`
  width: 20%;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  width: 200px;

  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

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

const ChatButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
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
  gap: ${({ theme }) => theme.spacing[6]};
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

const DiseaseGroup = styled(InputGroup)`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing[16]};

  input {
    width: 100%;
    border: none;
  }
`;
const DiseaseInputDiv = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 55px;
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: 0 ${({ theme }) => theme.spacing[10]};
  text-align: center;
  align-items: center;
  max-width: 800px;
  div {
    width: 80px;
    height: 32px;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.gray[5]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    color: white;
  }
`;
const HireBottom = styled.div`
  width: 100%;
  display: flex;
  padding: 0 ${({ theme }) => theme.spacing[20]};
`;
const HireBottomTitle = styled(Title)`
  margin: 0;
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

const RoomImage = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  width: 50%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: 'pointer';
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  padding: 64px;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: center;
`;

const BackButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const SubmitButton1 = styled(SubmitButton)`
  width: 65%;
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: white;
`;

const Plus = styled(FaPlus)`
  width: 30px;
  height: 30px;
  color: white;
`;

export const TagsUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 8px 0 0 0;

  li {
    min-width: 80px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary};
    padding: 0 ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.fontSizes.base};
    list-style: none;
    border-radius: 4px;
    margin: 0 8px 8px 0;
    background: ${({ theme }) => theme.colors.gray[5]};
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export default HireDetail;
