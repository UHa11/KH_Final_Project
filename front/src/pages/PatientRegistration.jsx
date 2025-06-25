import React, { useEffect, useState } from 'react';
import { AuthContainer } from '../styles/Auth.styles';
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
  NewTitle,
  BtnWrap,
  BackBtn,
} from '../styles/PatientRegistration';
import { Label, Input, InputGroup } from '../styles/Auth.styles';
import { usepatientRegistrationForm } from '../hooks/usePatientRegistrationForm';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../api/patient';
import { toast } from 'react-toastify';
import Tags from '../components/Tags';

const PatientRegistration = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { register, handleSubmit, errors, isSubmitting, watch, setValue } = usepatientRegistrationForm();

  useEffect(() => {
    // 일단 접근가능하게 로그인 구현 되면 user -> !user 바꿀것
    if (!user) {
      alert('로그인 후 이용해주세요');
      navigate('/guardian');
    }
  }, [user]);

  // 'gender' 필드의 현재 값을 watch하여 라디오 버튼의 checked 상태를 제어합니다.
  const currentGender = watch('patGender');

  const [tags, setTags] = useState([]);
  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  const onSubmit = async (data) => {
 
    try {
      await patientService.postNewPatient({
        // user가 있는 경우 user_no 저장해야함 아래의 숫자는 로그인한 user_no로 작성해주세요
        guardianNo: user.userNo,
        patName: data.patName,
        patAge: data.patAge,
        patAddress: data.patAddress,
        patGender: data.patGender,
        patHeight: data.patHeight,
        patWeight: data.patWeight,
        patContent: data.patContent,
        diseaseTags: data.tags,
      });
      toast.success('돌봄대상자 등록 완료!');
      navigate('/guardian/patient');
    } catch (error) {
      toast.error('돌봄대상자 등록 중 문제가 발생하였습니다.');
      console.error('돌본대상자 등록 에러 : ', error);
    }
  };
  return (
    <>
      <AuthContainer>
        <FromWrap>
          <NewTitle>돌봄 대상자 등록</NewTitle>
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
              <Label htmlFor="phone">비상연락망</Label>
              <Input type="text" id="phone" {...register('phone')} />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="patAddress">주소</Label>
              <Input type="text" id="patAddress" {...register('patAddress')} />
            </InputGroup>

            <GridInerContainer>
              <Label htmlFor="height">키</Label>
              <Label htmlFor="weight">몸무게</Label>
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
              <SubmitBtn type="submit">등록</SubmitBtn>
            </BtnWrap>
          </GridForm>
        </FromWrap>
      </AuthContainer>
    </>
  );
};

export default PatientRegistration;
