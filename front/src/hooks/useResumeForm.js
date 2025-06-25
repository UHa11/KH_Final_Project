import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../api/users';
import { jobSeekingService } from '../api/jobSeeking';

// 유효성 스키마
const resumeSchema = yup.object().shape({
  resumeTitle: yup.string().required('제목을 입력해주세요'),
  resumeContent: yup.string().required('내용을 입력해주세요'),
  account: yup.number().typeError('숫자로 입력해주세요').required('희망 금액을 입력해주세요'),
  careStatus: yup.string().required('숙식 여부를 선택해주세요'),
});

export const useResumeForm = () => {
  const [user, setUser] = useState(null);
  const [licenseList, setLicenseList] = useState([{ licenseName: '', licensePublisher: '', licenseDate: '' }]);

  const navigate = useNavigate();
  const { resumeNo } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resumeSchema),
    mode: 'onChange',
  });

  // 유저 정보 불러오기
  useEffect(() => {
    const storedData = localStorage.getItem('user-storage');
    if (!storedData) return;

    try {
      const parsedState = JSON.parse(storedData);
      const user = parsedState.state.user;
      const userNo = user?.userNo;

      if (userNo) {
        userService
          .getUserProfile(userNo)
          .then((data) => {
            const userData = data[0];
            setUser(userData);
            // 자격증 정보는 이력서에서 항상 직접 입력하므로 여기서 설정하지 않음
            //등록 페이지일 때만 user.licenses로 자격증 리스트 초기화
            if (!resumeNo && userData.licenses?.length > 0) {
              setLicenseList(userData.licenses);
            }
          })
          .catch((err) => {
            console.error('유저 정보 가져오기 실패:', err);
          });
      }
    } catch (e) {
      console.error('user-storage 파싱 실패:', e);
    }
  }, []);

  // resumeNo가 있으면 이력서 데이터 불러와서 폼 초기화
  useEffect(() => {
    if (!resumeNo) return;

    (async () => {
      try {
        const data = await jobSeekingService.getResume(resumeNo);
        // data가 배열이라면 첫번째 객체 꺼내기
        const resume = Array.isArray(data) ? data[0] : data;
        console.log('불러온 이력서:', resume);

        reset({
          resumeTitle: resume.resumeTitle || '',
          resumeContent: resume.resumeContent || '',
          careStatus: resume.careStatus || '',
          account: resume.account || '',
        });

        if (resume.licenses?.length > 0) {
          setLicenseList(resume.licenses);
        }
      } catch (err) {
        console.error('이력서 조회 실패:', err);
      }
    })();
  }, [resumeNo, reset]);

  // 제출 핸들러
  const onSubmit = async (formData) => {
    if (!user) return;

    const payload = {
      ...formData,
      userNo: user.userNo,
    };

    try {
      if (resumeNo) {
        await jobSeekingService.updateResume(resumeNo, payload);
        toast.success('이력서가 수정되었습니다!');
      } else {
        await jobSeekingService.postNewResume(payload); // API 함수명 그대로 사용
        toast.success('이력서가 저장되었습니다!');
      }

      navigate('/caregiver/resumemanagement');
    } catch (error) {
      console.error('이력서 저장/수정 실패:', error);
      toast.error('이력서 저장 중 문제가 발생했습니다.');
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    user,
    licenseList,
    setLicenseList,
  };
};
