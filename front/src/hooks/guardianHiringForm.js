import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { hiringService } from '../api/hiring';

const today = new Date();
today.setHours(0, 0, 0, 0);

//구인등록을 위한 스키마
const guardianSchema = yup.object().shape({
  hiringTitle: yup.string().required('제목을 입력해주세요'),
  hiringContent: yup.string().required('내용을 입력해주세요'),
  account: yup.number().typeError('숫자로 입력해주세요').required('희망 시급을 입력해주세요'),
  careStatus: yup.string().required('숙식 여부를 선택해주세요').oneOf(['Y', 'N'], '숙식 여부를 선택해주세요'),
  startDate: yup
    .date()
    .typeError('시작일을 선택해주세요')
    .min(today, '오늘 이후 날짜만 선택할 수 있습니다.')
    .required('시작일을 선택해주세요'),
  endDate: yup
    .date()
    .typeError('종료일을 선택해주세요')
    .min(yup.ref('startDate'), '종료일은 시작일보다 빠를 수 없습니다')
    .required('종료일을 선택해주세요'),
  maxApplicants: yup
    .number()
    .typeError('숫자를 입력해주세요')
    .positive('지원자 수는 0보다 커야 합니다')
    .integer('정수만 입력 가능합니다')
    .required('모집 인원 수를 입력해주세요'),
});

export const guardianHiringForm = () => {
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
    mode: 'onChange',
  });

  return {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    // 변경
    errors,
    isSubmitting, //유효성 에러및 제출중 상태
  };
};
