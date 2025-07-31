import React, { useEffect, useState } from 'react';
import {
  GridForm,
  GridInerContainer,
  GenderRadioGroup,
  RadioWrapper,
  HeightWegithDiv,
  FromWrap,
  NotesTexttarea,
  SubmitBtn,
  NewTitle,
  BtnWrap,
  BackBtn,
} from '../styles/PatientRegistration';
import { AuthContainer, Label, Input, InputGroup, ErrorMessage } from '../styles/Auth.styles';
import { usepatientRegistrationForm } from '../hooks/usePatientRegistrationForm';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import Tags from '../components/Tags';
import styled from 'styled-components';
import PostcodeSearch from '../components/PostcodeSearch';
import { useRef } from 'react';
import { HiMiniPencilSquare } from 'react-icons/hi2';
import profileImage from '../assets/profileImg/img_환자소.png';
const PatientRegistration = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    watch,
    setValue,
    formatPhoneNumber,
    selectedFile,
    handleFileChange,
    previewUrl,
  } = usepatientRegistrationForm(user);
  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';

  useEffect(() => {
    // 일단 접근가능하게 로그인 구현 되면 user -> !user 바꿀것
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/guardian');
    }
  }, []);

  // 'gender' 필드의 현재 값을 watch하여 라디오 버튼의 checked 상태를 제어합니다.
  const currentGender = watch('patGender');

  //주소 관련
  const [addressData, setAddressData] = useState({
    zonecode: '',
    address: '',
    extraAddress: '',
  });

  useEffect(() => {
    const fullAddress = `${addressData.address}${addressData.extraAddress}`.trim();
    if (fullAddress) {
      setValue('patAddress', fullAddress);
    }
  }, [addressData, setValue]);

  // 태그관련
  const [tags, setTags] = useState([]);
  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  const handleTagChange = (newVal) => {
    setTags(newVal); // set을 대체하는 커스텀 함수
  };

  const inputRef = useRef(null);
  const handleDivClick = () => {
    inputRef.current?.click(); // 파일 선택창 열기
  };

  const getImageOrDefault = (url) => {
    return url || profileImage;
  };

  return (
    <>
      <AuthContainer>
        <FromWrap>
          <NewTitle>돌봄 대상자 등록</NewTitle>

          <GridForm onSubmit={handleSubmit(onSubmit)}>
            <ProfileImageWrapper>
              <ProfileImage>
                <img
                  src={getImageOrDefault(previewUrl)}
                  alt="프로필 이미지"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </ProfileImage>
              <EditIcon onClick={handleDivClick}>
                <HiMiniPencilSquare size={30} />
              </EditIcon>
            </ProfileImageWrapper>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <GridInerContainer>
              <Label htmlFor="patName">이름</Label>
              <Label htmlFor="patAge">나이</Label>
              <Input
                type="text"
                id="patName"
                placeholder="이름을 입력해주세요"
                {...register('patName')}
                $error={errors.patName}
              />
              <Input
                type="number"
                id="patAge"
                min="0"
                placeholder="나이를 입력해주세요"
                {...register('patAge')}
                $error={errors.patAge}
              />
              {errors.patName && <ErrorMessage>{errors.patName.message}</ErrorMessage>}
              {errors.patAge && <ErrorMessage>{errors.patAge.message}</ErrorMessage>}
            </GridInerContainer>

            <GenderRadioGroup>
              <Label>성별</Label>
              <RadioWrapper checked={currentGender === 'M'}>
                {/* checked prop 전달 */}
                <input
                  type="radio"
                  id="M"
                  name="patGender"
                  value="M"
                  checked={currentGender === 'M'} // watch 값으로 제어
                  {...register('patGender')}
                  $error={errors.patGender} // register만 남김
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
                  {...register('patGender')}
                  $error={errors.patGender} // register만 남김
                />
                <label htmlFor="F">여성</label>
              </RadioWrapper>
              {errors.patGender && <ErrorMessage>{errors.patGender.message}</ErrorMessage>}
            </GenderRadioGroup>

            <InputGroup>
              <Label htmlFor="phone">비상연락망</Label>
              <Input
                type="text"
                id="phone"
                placeholder="전화번호를 입력해주세요"
                {...register('patPhone')}
                $error={errors.patPhone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setValue('patPhone', formatted); // react-hook-form의 값도 갱신
                }}
              />
              {errors.patPhone && <ErrorMessage>{errors.patPhone.message}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="patAddress">주소</Label>
              <Row>
                <AddressInput
                  type="text"
                  id="patAddress"
                  {...register('patAddress')}
                  $error={errors.patAddress}
                  placeholder="주소를 검색해주세요"
                  readOnly
                />
                <PostcodeSearch onAddressSelected={setAddressData} />
              </Row>

              {errors.patAddress && <ErrorMessage>{errors.patAddress.message}</ErrorMessage>}
            </InputGroup>

            <GridInerContainer>
              <Label htmlFor="height">키</Label>
              <Label htmlFor="weight">몸무게</Label>

              <HeightWegithDiv>
                <Input type="number" step="0.01" id="patHeight" {...register('patHeight')} $error={errors.patHeight} />

                <span>cm</span>
              </HeightWegithDiv>

              <HeightWegithDiv>
                <Input
                  type="number"
                  step="0.01"
                  id="patWeight"
                  onWheel={(e) => e.target.blur()}
                  {...register('patWeight')}
                  $error={errors.patWeight}
                />

                <span>kg</span>
              </HeightWegithDiv>

              {errors.patHeight && <ErrorMessage>{errors.patHeight.message}</ErrorMessage>}
              {errors.patWeight && <ErrorMessage>{errors.patWeight.message}</ErrorMessage>}
            </GridInerContainer>

            <InputGroup>
              <Tags tags={tags} handleTagChange={handleTagChange} $error={errors.tags} />
              {errors.tags && <ErrorMessage>{errors.tags.message}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="patContent">돌봄대상자 특이사항</Label>
              <NotesTexttarea
                id="notes"
                className="textarea-field"
                rows="5"
                placeholder="돌봄대상자의 특이사항을 입력해주세요"
                {...register('patContent')}
                $error={errors.patContent}
              />
              {errors.patContent && <ErrorMessage>{errors.patContent.message}</ErrorMessage>}
            </InputGroup>

            <BtnWrap>
              <BackBtn type="button" onClick={() => navigate(-1)}>
                이전
              </BackBtn>
              <SubmitBtn type="submit">등록</SubmitBtn>
            </BtnWrap>
          </GridForm>
        </FromWrap>
      </AuthContainer>
    </>
  );
};

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 200px; /* 원하는 크기로 조절 */
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: 50%;

  overflow: hidden;
  cursor: pointer;
`;

const EditIcon = styled.div`
  position: absolute;
  bottom: 5px;
  right: 1px;
  background: white;
  border-radius: 50%;
  padding: 5px;
  display: flex;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  padding: 10px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const AddressInput = styled(Input)`
  width: 100%;
`;

// const ErrorMessage = styled.span`
//   color: ${({ theme }) => theme.colors.error};
//   font-size: ${({ theme }) => theme.fontSizes.sm};
// `;

export default PatientRegistration;
