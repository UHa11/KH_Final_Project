import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

//구인등록을 위한 스키마
const guardianSchema = yup.object().shape({
  hiringTitle: yup.string().required('제목을 입력해주세요'),
  hiringContent: yup.string().required('내용을 입력해주세요'),
  account: yup.number().typeError('숫자로 입력해주세요').required('희망 금액을 입력해주세요'),
  careStatus: yup.string().oneOf(['Y', 'N'], '숙식 여부를 선택해주세요'),
  startDate: yup.date().required('시작일을 입력해주세요'),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), '종료일은 시작일보다 빠를 수 없습니다')
    .required('종료일을 입력해주세요'),
  maxApplicants: yup
    .number()
    .typeError('숫자를 입력해주세요')
    .positive('지원자 수는 0보다 커야 합니다')
    .integer('정수만 입력 가능합니다')
    .required('모집 인원 수를 입력해주세요'),
});

export const guardianHiringForm = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  //react-hook-form으로 폼 상태 초기화및 유효성 검사
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }, //유효성 에러및 제출중 상태
    watch, // watch 함수를 추가로 가져옵니다.
    reset,
  } = useForm({
    resolver: yupResolver(guardianSchema), // yup스키마와 연결
    mode: 'onChange'

  });

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch, // watch 함수를 반환합니다.
  };
};
