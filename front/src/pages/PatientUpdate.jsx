import React, { useState, useEffect } from 'react';
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
} from '../styles/PatientRegistration';
import { Label, Input, InputGroup } from '../styles/Auth.styles';
import { usepatientRegistrationForm } from '../hooks/usePatientRegistrationForm';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { patientService } from '../api/patient';
import { toast } from 'react-toastify';
import Tags from '../components/Tags';

const PatientUpdate = () => {
  const { user, userStatus } = useUserStore();
  const { patNo } = useParams();
  const [patient, setPatinet] = useState();

  const { register, handleSubmit, errors, isSubmitting, watch, setValue } = usepatientRegistrationForm();
  const currentGender = watch('patGender');

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('로그인 후 이용해주세요');
      // navigate('/guardian');
    } else {
      const getPatient = async () => {
        try {
          const onePatient = await patientService.getPatientId(patNo);
          setPatinet(onePatient);
        } catch (error) {
          console.log(error);
        }
      };
      getPatient();
    }
  }, [user, userStatus, patNo]);

  useEffect(() => {
    if (patient) {
      setValue('patName', patient.patName || '');
      setValue('patAge', patient.patAge || '');
      setValue('patGender', patient.patGender || '');
      setValue('patAddress', patient.patAddress || '');
      setValue('patHeight', patient.patHeight || '');
      setValue('patWeight', patient.patWeight || '');
      setValue('patContent', patient.patContent || '');
      setValue('phone', patient.phone || '');
      setValue('tags', patient.tags || '');
      setTags(patient.tags ? patient.tags : []);
    }
  }, [patient, setValue]);

  // tag 관련
  const [tags, setTags] = useState([]);

  // 이게 있어야 tag가 변경됌
  useEffect(() => {
    setValue('tags', tags);
  }, [tags]);

  const onSubmit = async (data) => {
    try {
      await patientService.updatePatinet(patient.patNo, { ...patient, ...data });
      toast.success('돌봄대상자 수정완료!');
      navigate('/guardian/patient');
    } catch (error) {
      console.log(error);
    }
  };

  const deletePatient = async (id) => {
    try {
      await patientService.deletPatient(id);
      toast.success('돌봄대상자 삭제완료!');
      navigate('/guardian/patient');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AuthContainer>
        <FromWrap>
          <Title>돌봄 대상자 목록</Title>
          <Img src="/src/assets/profileImg/img_환자소.png"></Img>
          <GridForm onSubmit={handleSubmit(onSubmit)}>
            <GridInerContainer>
              <Label htmlFor="patName">이름</Label>
              <Label htmlFor="patAge">나이</Label>
              <Input type="text" id="patName" {...register('patName')} />
              <Input type="number" id="patAge" {...register('patAge')} />
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
                />
                <label htmlFor="F">여성</label>
              </RadioWrapper>
            </GenderRadioGroup>

            <InputGroup>
              <Label htmlFor="phone">보호자 전화번호</Label>
              <Input type="text" id="phone" {...register('phone')} />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="patAddress">주소</Label>
              <Input type="text" id="patAddress" {...register('patAddress')} />
            </InputGroup>

            <GridInerContainer>
              <Label htmlFor="patHeight">키</Label>
              <Label htmlFor="patWeight">몸무게</Label>
              <HeightWegithDiv>
                <Input type="number" id="patHeight" {...register('patHeight')} />
                <span>cm</span>
              </HeightWegithDiv>

              <HeightWegithDiv>
                <Input type="number" id="patWeight" {...register('patWeight')} />
                <span>kg</span>
              </HeightWegithDiv>
            </GridInerContainer>

            <InputGroup>
              <Tags tags={tags} setTags={setTags} {...register('tags')} />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="patContent">환자 특이사항</Label>
              <NotesTexttarea id="notes" className="textarea-field" rows="5" {...register('patContent')} />
            </InputGroup>
            <BtnWrap>
              <BackBtn type="button" onClick={() => navigate(-1)}>
                이전
              </BackBtn>
              <SubmitBtn type="submit">수정</SubmitBtn>
              <SubmitBtn type="button" onClick={() => deletePatient(id)}>
                삭제
              </SubmitBtn>
            </BtnWrap>
          </GridForm>
        </FromWrap>
      </AuthContainer>
    </>
  );
};

export default PatientUpdate;
