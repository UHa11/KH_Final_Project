import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { userService } from '../api/users';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

//회원가입 폼의 유효성 검사 스키마
const signUpSchema = yup.object().shape({
  userId: yup
    .string()
    .required('아이디를 입력하세요.')
    .min(5, '아이디는 최소 5자 이상이어야 합니다.')
    .matches(
      /^[가-힣a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
      '아이디에 특수문자가 포함되면 안되고 숫자로 시작하면 안됩니다!'
    ),

  userName: yup
    .string()
    .required('이름을 입력하세요.')
    .matches(/^[가-힣]+$/, '이름은 한글만 입력 가능합니다.')
    .max(4, '이름은 최대 4자까지만 입력 가능합니다.'),

  userPwd: yup
    .string()
    .required('비밀번호를 입력하세요.')
    .matches(/^(?=.*[a-zA-Z]).{5,}$/, '비밀번호는 영문자를 포함해 5자 이상이어야 합니다.'),

  age: yup
    .number()
    .typeError('나이는 숫자여야 합니다.')
    .required('나이를 입력해주세요.')
    .integer('정수를 입력해주세요.')
    .min(0, '0세 이상이어야 합니다.')
    .max(120, '120세 이하로 입력해주세요.'),

  gender: yup.string().oneOf(['M', 'F'], '성별을 선택해주세요').required('성별은 필수입니다.'),

  phone: yup
    .string()
    .required('전화번호를 입력하세요.')
    .matches(/^010\d{8}$/, "010으로 시작하고 '-' 제외한 11자리여야 합니다."),

  address: yup
    .string()
    .required('주소를 입력해주세요.')
    .min(5, '주소는 최소 5자 이상이어야 합니다.')
    .max(100, '주소는 100자 이하로 입력해주세요.'),

  email: yup.string().email('유효한 이메일 주소를 입력하세요.').required('이메일을 입력해주세요.'),
});

export const useSignUpForm = () => {
  const navigate = useNavigate();

  //아이디 중복 검사
  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복확인 완료 여부
  const [idCheckMessage, setIdCheckMessage] = useState('');

  //react-hook-form으로 폼 상태 초기화및 유효성 검사
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }, //유효성 에러및 제출중 상태
    watch, // watch 함수를 추가로 가져옵니다.
  } = useForm({
    resolver: yupResolver(signUpSchema), // yup스키마와 연결
    mode: 'onChange',
    defaultValues: {
      // gender 필드의 초기값을 설정합니다.
      gender: 'M', // 기본값을 'male'로 설정 (또는 원하는 값으로)
      // 나머지 필드에 대한 기본값이 있다면 여기에 추가
    },
  });

  const userId = watch('userId'); //현재 입력된 아이디를 감시

  useEffect(() => {
    // userId 변경 시 아이디 중복 검사 상태 초기화
    setIsIdChecked(false);
    setIdCheckMessage('');
  }, [userId]);

  const checkUserId = async () => {
    if (!userId || userId.length < 5) {
      //아마 훅폼으로 이미 유효성 검사할텐데 중복확인시에도 유효성 체크 할려는듯
      setIdCheckMessage('아이디는 최소 5자 이상 입력해주세요');
      return;
    }
    try {
      const res = await userService.checkUserId(userId);
      if (res.available) {
        setIdCheckMessage('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
        clearErrors('userId'); //유효성 오류 제거
      } else {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
        setError('userId', { message: '이미 사용 중인 아이디입니다.' });
      }
    } catch (err) {
      setIdCheckMessage('중복 확인 중 오류가 발생했습니다.');
      setIsIdChecked(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isIdChecked) {
      toast.error('아이디 중복을 확인을 해주세요.');
      return;
    }

    try {
      //회원가입API호출
      await userService.signUp(data);
      toast.success('회원가입 완료!');
      navigate('/login');
    } catch (error) {
      toast.error('회원가입 중 문제가 발생하였습니다.');
      console.error('회원가입 에러 : ', error);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    watch, // watch 함수를 반환합니다.
    checkUserId,
    idCheckMessage,
  };
};
