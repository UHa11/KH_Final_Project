import React, { useState } from 'react';
import { Container, Section } from '../styles/common/Container';
import profileImage from '../assets/profileImg/img_간병인.png'; // 프로필 이미지 경로
import styled from 'styled-components';
import { Input, InputGroup, Title } from '../styles/Auth.styles';
import { media } from '../styles/MediaQueries';
import { SubmitButton } from '../styles/common/Button';
import { useEffect } from 'react';

import { useResumeForm } from '../hooks/useResumeForm';
import { userService } from '../api/users';
import useUserStore from '../store/userStore';
import { toast } from 'react-toastify';
import { jobSeekingService } from '../api/jobSeeking';
import { useNavigate } from 'react-router-dom';
import { extractRegionFromEnd } from '../utils/formatData';

const ResumeRegistration = () => {
  const { user } = useUserStore();
  const { register, handleSubmit, errors, handleLicenseChange } = useResumeForm();
  const [careGiver, setCareGiver] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/guardian');
      }

      try {
        const careGiverProfile = await userService.getUserProfile(user.userNo);
        setCareGiver(careGiverProfile);
      } catch (error) {
        toast.error('이력서 등록 중 문제가 발생하였습니다.');
        console.error('이력서 등록 에러 : ', error);
      }
    };
    fetchAll();
  }, []);

  const onSubmit = async (formData) => {
    const newData = {
      ...formData,

      userNo: Number(user.userNo),
    };
    try {
      await jobSeekingService.postNewResume(newData); // API 함수명 그대로 사용

      toast.success('이력서가 저장되었습니다!');
      navigate('/caregiver/resumemanagement');
    } catch (error) {
      console.error('이력서등록에 실패하였습니다.:', error);
      toast.error('이력서 저장 중 문제가 발생했습니다.');
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
    <HireRegistSection>
      <HireContainer>
        <HireHead>
          <HireHeadTitle>이력서 작성</HireHeadTitle>
        </HireHead>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ContentWrapper>
            <div>
              <ProfilImageWrapper>
                <img src={getProfileImageUrl(careGiver?.profileImage)} alt="프로필" />
              </ProfilImageWrapper>
            </div>
            <Divider>
              <InputRow>
                <InputGroup>
                  <Label>이름</Label>
                  <Input type="text" value={careGiver?.userName || ''} readOnly />
                </InputGroup>
                <InputGroup>
                  <Label>나이</Label>
                  <Input type="text" value={careGiver?.age || ''} readOnly />
                </InputGroup>
              </InputRow>
              <RadioGroup>
                <Label>성별</Label>
                <RadioWrapper>
                  <input type="radio" id="male" name="gender" value="M" checked={careGiver?.gender === 'M'} readOnly />
                  <label htmlFor="male">남성</label>
                </RadioWrapper>
                <RadioWrapper>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="F"
                    checked={careGiver?.gender === 'F'}
                    readOnly
                  />
                  <label htmlFor="female">여성</label>
                </RadioWrapper>
              </RadioGroup>
              {/* <InputGroup>
                <Label>전화번호</Label>
                <Input type="text" value={careGiver?.phone || ''} readOnly />
              </InputGroup> */}
              <InputGroup>
                <Label>주소</Label>
                <Input type="text" value={extractRegionFromEnd(careGiver?.address)} readOnly />
              </InputGroup>
            </Divider>
          </ContentWrapper>
          {careGiver?.licenses?.map((license, index) => (
            <ContentWrapper2>
              <LicenseGroup>
                <Label>자격증 명</Label>
                <LicenseInput
                  type="text"
                  value={license.licenseName}
                  onChange={(e) => handleLicenseChange(index, 'licenseName', e.target.value)}
                />
              </LicenseGroup>
              <LicenseGroup>
                <Label>발행처</Label>
                <LicenseInput
                  type="text"
                  value={license.licensePublisher}
                  onChange={(e) => handleLicenseChange(index, 'licensePublisher', e.target.value)}
                />
              </LicenseGroup>
              <LicenseGroup>
                <Label>발행일</Label>
                <LicenseInput
                  type="date"
                  value={license.licenseDate}
                  onChange={(e) => handleLicenseChange(index, 'licenseDate', e.target.value)}
                />
              </LicenseGroup>
            </ContentWrapper2>
          ))}

          <HireBottom>
            <HireBottomTitle>채용 정보</HireBottomTitle>
          </HireBottom>
          <ContentWrapper1>
            <HireContent>
              <Label id="resumeTitel">제목</Label>
              <Input {...register('resumeTitle')} placeholder="제목" />
              <p>{errors.resumeTitle?.message}</p>

              <Label id="resumeContent">내용</Label>
              <Content {...register('resumeContent')} placeholder="내용" />
              <p>{errors.resumeContent?.message}</p>

              <RadioGroup>
                <RadioContainer>
                  <Label>입주형</Label>
                  <RadioWrapper>
                    <input type="radio" value="Y" {...register('careStatus')} />
                  </RadioWrapper>
                  <Label>출퇴근형</Label>
                  <RadioWrapper>
                    <input type="radio" value="N" {...register('careStatus')} />
                  </RadioWrapper>
                  <p>{errors.provide_hope?.message}</p>
                </RadioContainer>
                <AccountGroup>
                  <InputGroup>
                    <Label>희망 시급</Label>
                    <Input {...register('resumeAccount')} placeholder="희망 시급" />
                    <p>{errors.resumeAccount?.message}</p>
                  </InputGroup>
                </AccountGroup>
              </RadioGroup>
            </HireContent>
          </ContentWrapper1>

          <ButtonGroup>
            <BackButton type="button" onClick={() => navigate(-1)}>
              이전
            </BackButton>
            <SubmitButton1 type="submit">저장하기</SubmitButton1>
          </ButtonGroup>
        </form>
      </HireContainer>
    </HireRegistSection>
  );
};

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
  padding: 64px;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: center;
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
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  ${media.md`
    flex-direction: row; 
    gap: ${({ theme }) => theme.spacing[5]};
    padding : ${({ theme }) => theme.spacing[3]};
  `}
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

const LicenseAdd = styled.button`
  display: flex;
  border-radius: 4px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: black;

  // 인혜 작성(반응형)
  ${media.lg`
  with
  span {
    width: 50px;
  }
  padding: 0;
  background-color:white; 
  margin-top: ${({ theme }) => theme.spacing[6]};
  `}
`;

const LicenseDelete = styled.button`
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  span {
    width: 50px;
  }
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;
export default ResumeRegistration;
