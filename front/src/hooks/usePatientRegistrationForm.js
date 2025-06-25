import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

//환자등록 폼의 유효성 검사 스키마
const patientsSchema = yup.object().shape({
  patName: yup
    .string()
    .required('이름을 입력하세요.')
    .matches(/^[가-힣]+$/, '이름은 한글만 입력 가능합니다.')
    .max(4, '이름은 최대 4자까지만 입력 가능합니다.'),

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
  phone: yup
    .string()
    .required('전화번호를 입력하세요.')
    .matches(/^010\d{8}$/, "010으로 시작하고 '-' 제외한 11자리여야 합니다."),

  patAddress: yup
    .string()
    .required('주소를 입력해주세요.')
    .min(5, '주소는 최소 5자 이상이어야 합니다.')
    .max(100, '주소는 100자 이하로 입력해주세요.'),
});

export const usepatientRegistrationForm = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

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
      // gender 필드의 초기값을 설정합니다.
      patGender: 'M', // 기본값을 'male'로 설정 (또는 원하는 값으로)
      // 나머지 필드에 대한 기본값이 있다면 여기에 추가
    },
  });

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    watch, // watch 함수를 반환합니다.
  };
};
