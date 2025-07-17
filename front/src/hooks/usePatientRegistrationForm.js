import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { patientService } from '../api/patient';
import { useNavigate } from 'react-router-dom';
import { getUploadUrl, uploadFileToS3 } from '../api/fileApi';

import { useState } from 'react';

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

  prifleImage: yup.string(),
});

export const usepatientRegistrationForm = (user) => {
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // 추가

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
    if (numbersOnly.length < 8) return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file); // 파일 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = async (formData) => {
    try {
      
      // 이미지가 선택되었는지 체크
      const imageChanged = !!selectedFile;
      let uploadedImageName = "";

      // 프로필 이미지가 변경된 경우
      if (imageChanged) {
        // 1. Presigned URL 요청
        const { presignedUrl, changeName } = await getUploadUrl(
          selectedFile.name,
          selectedFile.type,
          'patient/' // 업로드 경로
        );

        // 2. S3 직접 업로드
        await uploadFileToS3(presignedUrl, selectedFile);

        uploadedImageName= changeName;
      }
        await patientService.postNewPatient({
          guardianNo: user.userNo,
          patName: formData.patName,
          patAge: formData.patAge,
          patPhone: formData.patPhone,
          patAddress: formData.patAddress,
          patGender: formData.patGender,
          patHeight: formData.patHeight,
          patWeight: formData.patWeight,
          patContent: formData.patContent,
          diseaseTags: formData.tags,
          profileImage: uploadedImageName,
        });

        navigate('/modal');
   
    } catch (error) {
      console.error('돌봄대상자 등록 에러 : ', error);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
    errors,
    isSubmitting, //유효성 에러및 제출중 상태
    setValue,
    formatPhoneNumber,
    onSubmit,
    previewUrl,
    selectedFile,
    handleFileChange,
    watch, // watch 함수를 반환합니다.
  };
};
