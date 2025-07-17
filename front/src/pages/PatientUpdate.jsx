import React, { useState, useEffect, useRef } from 'react';
import { AuthContainer } from '../styles/Auth.styles';
import { Title } from '../styles/Auth.styles';
import {
  GridForm,
  GridInerContainer,
  GenderRadioGroup,
  RadioWrapper,
  HeightWegithDiv,
  FromWrap,
  NotesTexttarea,
  SubmitBtn,
  Img,
  BackBtn,
  BtnWrap,
  NewTitle,
} from '../styles/PatientRegistration';
import { Label, Input, InputGroup, ErrorMessage } from '../styles/Auth.styles';
import { usepatientRegistrationForm } from '../hooks/usePatientRegistrationForm';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { patientService } from '../api/patient';
import { toast } from 'react-toastify';
import Tags from '../components/Tags';
import styled from 'styled-components';
import PostcodeSearch from '../components/PostcodeSearch';
import profileImg from '../assets/profileImg/img_환자소.png';
import { getUploadUrl, uploadFileToS3, completeUpload } from '../api/fileApi';
import { HiMiniPencilSquare } from 'react-icons/hi2';

const PatientUpdate = () => {
  const { user, userStatus } = useUserStore();
  const { patNo } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState();
  // tag 관련
  const [tags, setTags] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  //주소 관련
  const [addressData, setAddressData] = useState({
    zonecode: '',
    address: '',
    extraAddress: '',
  });

  const { register, handleSubmit, watch, setValue, formatPhoneNumber, errors, isSubmitting } =
    usepatientRegistrationForm();

  const currentGender = watch('patGender');
  const inputRef = useRef(null);

  const handleTagChange = (newVal) => {
    setTags(newVal); // set을 대체하는 커스텀 함수
  };

  //환자 정보 가져오기
  // 환자 정보 가져오기
  useEffect(() => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    const fetchPatient = async () => {
      try {
        const onePatient = await patientService.getPatientId(patNo);
        setPatient(onePatient);
        setTags(onePatient.diseaseTags || []);
        setValue('patName', onePatient.patName || '');
        setValue('patAge', onePatient.patAge || '');
        setValue('patGender', onePatient.patGender || '');
        setValue('patPhone', onePatient.patPhone || '');
        setValue('patAddress', onePatient.patAddress || '');
        setValue('patHeight', onePatient.patHeight || '');
        setValue('patWeight', onePatient.patWeight || '');
        setValue('patContent', onePatient.patContent || '');
        setValue('diseaseTags', onePatient.diseaseTags || []);
      } catch (err) {
        console.error(err);
        toast.error('환자 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchPatient();
  }, [userStatus, patNo, setValue]);

  // 주소가 바뀌면 form 값에도 반영
  useEffect(() => {
    const fullAddress = `${addressData.address}${addressData.extraAddress}`.trim();
    if (fullAddress) {
      setValue('patAddress', fullAddress);
    }
  }, [addressData, setValue]);

  // 이게 있어야 tag가 변경됌
  useEffect(() => {
    setValue('diseaseTags', tags);
  }, [tags]);

  const onSubmit = async (data) => {
    try {
      let imagePath = patient?.patImage || '';

      if (selectedFile) {
        const { presignedUrl, changeName } = await getUploadUrl(selectedFile.name, selectedFile.type, 'patient/');
        await uploadFileToS3(presignedUrl, selectedFile);
        imagePath = changeName;
      }

      await patientService.updatePatient(patNo, {
        ...patient,
        ...data,
        profileImage: imagePath,
      });

      toast.success('돌봄대상자 수정 완료!');
      navigate('/guardian/patient');
    } catch (err) {
      toast.error('수정 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const deletePatient = async (patNo) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (!confirmDelete) return; // 사용자가 취소하면 함수 종료

    const updatedPatient = {
      ...patient,
      status: 'N',
    };

    try {
      await patientService.updatePatient(patNo, updatedPatient);
      toast.success('돌봄대상자 삭제완료!');
      navigate('/guardian/patient');
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  const getProfileImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (patient?.profileImage) {
      return `${CLOUDFRONT_URL}${patient.profileImage}`;
    }
    return profileImg; // 기본 이미지
  };

  return (
    <>
      <AuthContainer>
        <FromWrap>
          <NewTitle>돌봄 대상자 상세</NewTitle>
          <ProfileImageWrapper>
            <ProfileImage>
              <img
                src={getProfileImageUrl(previewUrl)}
                alt="프로필 이미지"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </ProfileImage>
            <EditIcon onClick={handleImageClick}>
              <HiMiniPencilSquare size={30} />
            </EditIcon>
          </ProfileImageWrapper>
          <input type="file" ref={inputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
          <GridForm onSubmit={handleSubmit(onSubmit)}>
            <GridInerContainer>
              <Label htmlFor="patName">이름</Label>
              <Label htmlFor="patAge">나이</Label>
              <Input type="text" id="patName" {...register('patName')} $error={errors.patName} />
              <Input type="number" id="patAge" {...register('patAge')} $error={errors.patAge} />
              {errors.patName && <ErrorMessage>{errors.patName.message}</ErrorMessage>}
              {errors.patAge && <ErrorMessage>{errors.patAge.message}</ErrorMessage>}
            </GridInerContainer>

            <GenderRadioGroup>
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
                  $error={errors.patGender}
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
                  $error={errors.patGender}
                />
                <label htmlFor="F">여성</label>
              </RadioWrapper>
              {errors.patGender && <ErrorMessage>{errors.patGender.message}</ErrorMessage>}
            </GenderRadioGroup>

            <InputGroup>
              <Label htmlFor="phone">보호자 전화번호</Label>
              <Input
                type="text"
                id="phone"
                {...register('patPhone')}
                $error={errors.patPhone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setValue('patPhone', formatted); // react-hook-form의 값도 갱신
                }}
              />{' '}
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
              <Label htmlFor="patHeight">키</Label>
              <Label htmlFor="patWeight">몸무게</Label>
              <HeightWegithDiv>
                <Input type="number" id="patHeight" {...register('patHeight')} $error={errors.patHeight} />
                <span>cm</span>
              </HeightWegithDiv>

              <HeightWegithDiv>
                <Input type="number" id="patWeight" {...register('patWeight')} $error={errors.patWeight} />
                <span>kg</span>
              </HeightWegithDiv>

              {errors.patWeight && <ErrorMessage>{errors.patWeight.message}</ErrorMessage>}
              {errors.patHeight && <ErrorMessage>{errors.patHeight.message}</ErrorMessage>}
            </GridInerContainer>

            <InputGroup>
              <Tags
                tags={tags}
                id="diseaseTags"
                handleTagChange={handleTagChange}
                {...register('diseaseTags')}
                $error={errors.tags}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="patContent">환자 특이사항</Label>
              <NotesTexttarea
                id="notes"
                className="textarea-field"
                rows="5"
                {...register('patContent')}
                $error={errors.patContent}
              />
              {errors.patContent && <ErrorMessage>{errors.patContent.message}</ErrorMessage>}
            </InputGroup>
            <BtnWrap>
              <BackBtn type="button" onClick={() => navigate(-1)}>
                이전
              </BackBtn>
              <SubmitBtn type="submit">수정</SubmitBtn>
              <SubmitBtn type="button" onClick={() => deletePatient(patNo)}>
                삭제
              </SubmitBtn>
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
  margin-bottom: 40px;
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: 50%;

  overflow: hidden;
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

export default PatientUpdate;
