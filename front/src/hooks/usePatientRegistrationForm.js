import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { patientService } from '../api/patient';
import { useNavigate } from 'react-router-dom';

//환자등록 폼의 유효성 검사 스키마
const patientsSchema = yup.object().shape({
  patName: yup
    .string()
    .required('이름을 입력하세요.')
    .matches(/^[가-힣a-zA-Z]+$/, '이름은 영어 또는 한글만 입력 가능합니다.')
    .max(10, '이름은 최대 10자까지만 입력 가능합니다.'),

  patAge: yup
    .number()
    .typeError('나이는 숫자여야 합니다.')
    .required('나이를 입력해주세요.')
    .integer('정수를 입력해주세요.')
    .min(0, '0세 이상이어야 합니다.')
    .max(120, '120세 이하로 입력해주세요.'),

  patGender: yup.string().oneOf(['M', 'F'], '성별을 선택해주세요').required('성별은 필수입니다.'),

  patWeight: yup.number().typeError('몸무게는 숫자여야 합니다.'),
  patHeight: yup.number().typeError('키는 숫자여야 합니다.'),
  
  patPhone: yup
  .string()
  .matches(/^010-\d{4}-\d{4}$/, '전화번호 형식은 010-0000-0000 이어야 합니다')
  .required('전화번호를 입력해주세요'),

  patAddress: yup
    .string()
    .required('주소를 입력해주세요.')
    .min(5, '주소는 최소 5자 이상이어야 합니다.')
    .max(100, '주소는 100자 이하로 입력해주세요.'),
});



export const usepatientRegistrationForm = (user) => {
  
  const navigate = useNavigate();

  //react-hook-form으로 폼 상태 초기화및 유효성 검사
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }, //유효성 에러및 제출중 상태
    watch, // watch 함수를 추가로 가져옵니다.
  } = useForm({
    resolver: yupResolver(patientsSchema), // yup스키마와 연결
    mode: 'onChange',
    defaultValues: {
     
      patGender: 'M', 
      // 나머지 필드에 대한 기본값이 있다면 여기에 추가
    },
  });

  const formatPhoneNumber = (value) => {
    // 숫자만 남기기
    const numbersOnly = value.replace(/\D/g, '');
  
    // 010부터 시작하고 길이에 따라 포맷팅
    if (numbersOnly.length < 4) return numbersOnly;
    if (numbersOnly.length < 8)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
  };

  const onSubmit = async (data) => {
    console.log(data)
    try {
      await patientService.postNewPatient({
        guardianNo: user.userNo,
        patName: data.patName,
        patAge: data.patAge,
        patPhone: data.patPhone,
        patAddress: data.patAddress,
        patGender: data.patGender,
        patHeight: data.patHeight,
        patWeight: data.patWeight,
        patContent: data.patContent,
        diseaseTags: data.tags,
      });
      navigate("/modal")
     
    } catch (error) {
      // toast.error('돌봄대상자 등록 중 문제가 발생하였습니다.');
      console.error('돌봄대상자 등록 에러 : ', error);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
   errors, isSubmitting , //유효성 에러및 제출중 상태
    setValue,
    formatPhoneNumber,
    onSubmit,
    watch, // watch 함수를 반환합니다.
  };
};
