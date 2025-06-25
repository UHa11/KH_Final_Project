import React, { useState, useEffect, useRef } from 'react';
import { Container, Section } from '../styles/common/Container';
import profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import styled from 'styled-components';

import { Input, InputGroup, Title } from '../styles/Auth.styles';
import { media } from '../styles/MediaQueries';
import { SubmitButton } from '../styles/common/Button';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { patientService } from '../api/patient';
import useUserStore from '../store/userStore';
import { guardianHiringForm } from '../hooks/guardianHiringForm';
import { hiringService } from '../api/hiring';

const HireRegistration = () => {
  const { user } = useUserStore();

  const [userPatients, setUserpatients] = useState();
  const [patient, setPatient] = useState();
  const [selectPatientNo, setSelectPatientNo] = useState(undefined);
  const navigate = useNavigate();

  //숙소 이미지 넣기
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleDivClick = () => {
    inputRef.current?.click(); // 파일 선택창 열기
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = guardianHiringForm();

  const currentCareStatus = watch('careStatus');

  useEffect(() => {
    console.log('폼 에러:', errors);
  }, [errors]);


  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인 후 이용해주세요');
        return;
      }

      try {
        const patientsList = await patientService.getPatients(user.userNo);
        setUserpatients(patientsList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, [user]);

  const getPatient = (patNo) => {
    // patNo가 빈값이면 patient도 초기화
    if (!patNo) {
      setPatient(null);
      return;
    }

    setSelectPatientNo(patNo);
    const patient = userPatients.find((p) => p.patNo === Number(patNo));
    setPatient(patient);
  };

const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('선택된 파일:', file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // base64 저장
      };
      reader.readAsDataURL(file); // base64 인코딩
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await hiringService.postNewHiring({ ...data, patNo: Number(selectPatientNo) });
      toast.success('돌봄대상자 등록 완료!');
      navigate('/guardian/jobopening-management');
    } catch (error) {
      toast.error('돌봄대상자 등록 중 문제가 발생하였습니다.');
      console.error('돌본대상자 등록 에러 : ', error);
    }
  };

  return (
    <HireRegistSection>
      <HireContainer>
        <HireHead>
          <HireHeadTitle>구인 등록</HireHeadTitle>

          <SelectBox id="userPatients" value={selectPatientNo} onChange={(e) => getPatient(e.target.value)}>
            <option value="">돌봄대상자를 선택해주세요</option>
            {userPatients?.map((p) => (
              <option key={p.patNo} value={p.patNo}>
                {p.patName}
              </option>
            ))}
          </SelectBox>
        </HireHead>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ContentWrapper>
            <div>
              <ProfilImageWrapper>
                <img src={profileImage} alt="프로필 이미지" />
              </ProfilImageWrapper>
            </div>
            <Divider>
              <InputGroup>
                <Label>이름</Label>
                <Input type="text" readOnly value={patient?.patName} />
              </InputGroup>
              <InputGroup>
                <Label>나이</Label>
                <Input type="text" readOnly value={patient?.patAge} />
              </InputGroup>

              <RadioGroup>
                <Label>성별</Label>

                <RadioWrapper>
                  <input
                    type="radio"
                    id="M"
                    name="patGender"
                    value="M"
                    readOnly
                    checked={patient?.patGender === 'M'} // watch 값으로 제어
                  />
                  <label htmlFor="M">남성</label>
                </RadioWrapper>
                <RadioWrapper>
                  <input
                    type="radio"
                    id="F"
                    name="patGender"
                    value="F"
                    readOnly
                    checked={patient?.patGender === 'F'} // watch 값으로 제어
                  />
                  <label htmlFor="F">여성</label>
                </RadioWrapper>
              </RadioGroup>
              <InputGroup>
                <Label>보호자 전화번호</Label>
                <Input type="text" readOnly value={patient?.phone} />
              </InputGroup>
              <InputGroup>
                <Label>주소</Label>
                <Input type="text" readOnly value={patient?.patAddress} />
              </InputGroup>
              <InputRow>
                <InputGroup>
                  <Label>키</Label>
                  <Input type="text" readOnly value={patient?.patHeight} />
                </InputGroup>
                <InputGroup>
                  <Label>몸무게</Label>
                  <Input type="text" readOnly value={patient?.patWeight} />
                </InputGroup>
              </InputRow>
            </Divider>
          </ContentWrapper>
          <ContentWrapper>
            <DiseaseGroup>
              <Label>보유한 질병</Label>
              <DiseaseInputDiv>
                <TagsUl id="tags">
                  {Array.isArray(patient?.tags) && patient.tags.length > 0
                    ? patient.tags.map((tag, index) => (
                        <li key={index} readOnly>
                          <span>{tag}</span>
                        </li>
                      ))
                    : ''}
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
              <Input {...register('hiringTitle')} type="text" />
              <InputGird>
                <InputGroup>
                  <Label>지급 금액 (시급)</Label>
                  <Input type="text" {...register('account')} />
                </InputGroup>
                <InputGroup>
                  <Label>시작일</Label>
                  <Input {...register('startDate')} type="date" />
                </InputGroup>

                <InputGroup>
                  <Label>종료일</Label>
                  <Input {...register('endDate')} type="date" />
                </InputGroup>
                <InputGroup>
                  <Label>모집 인원수 설정</Label>
                  <Input type="number" {...register('maxApplicants')} />
                </InputGroup>
              </InputGird>
              <Label>내용</Label>
              <Content type="textarea" {...register('hiringContent')} />
              <RadioGroup>
                <Label>숙식 제공 여부</Label>
                <RadioWrapper>
                  <input type="radio" id="Y" name="careStatus" value="Y" {...register('careStatus')} />
                  <label htmlFor="Y">숙식 가능</label>
                </RadioWrapper>
                <RadioWrapper>
                  <input type="radio" id="N" name="careStatus" value="N" {...register('careStatus')} />
                  <label htmlFor="N">숙식 불가능</label>
                </RadioWrapper>
              </RadioGroup>
              <InputGroup>
                <Label>숙소 정보</Label>
                {/* 클릭 가능한 div */}
                <RoomImage onClick={handleDivClick}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="미리보기"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <Plus />
                  )}
                </RoomImage>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </InputGroup>
            </HireContent>
          </ContentWrapper1>

          <ButtonGroup>
            <BackButton type="button" onClick={() => navigate(-1)}>
              이전
            </BackButton>
            <SubmitButton1 type="submit">등록하기</SubmitButton1>
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

const SelectBox = styled.select`
  width: 20%;
  height: 50px;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.spacing[4]};
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

const InputGird = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};

  ${media.md`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20%, auto));
    
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

const Plus = styled(FaPlus)`
  width: 30px;
  height: 30px;
  color: white;
`;

// ============= 태그 ========
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
    color: ${({ theme }) => theme.colors.white};
    padding: 0 ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.fontSizes.base};
    list-style: none;
    border-radius: 4px;
    margin: 0 8px 8px 0;
    background: ${({ theme }) => theme.colors.primary};
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;
export default HireRegistration;
