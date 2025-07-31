import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { userService } from '../api/users';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUserStore from '../store/userStore';
import useUserStatusStore from '../store/userStatusStore';

//회원가입 폼의 유효성 검사 스키마
const loginSchema = yup.object().shape({
  userId: yup.string().required('아이디를 입력해주세요!'),
  userPwd: yup.string().required('비밀번호를 입력해주세요!'),
});

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const { userStatus, setUserStatus } = useUserStatusStore();

  //react-hook-form으로 폼 상태 초기화 및 유효성 검사
  const {
    register,
    handleSubmit,
    formState: { errors }, //유효성 에러및 제출중 상태
  } = useForm({
    resolver: yupResolver(loginSchema), // yup스키마와 연결
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      //로그인API호출
      const { token } = await userService.login(data.userId, data.userPwd);
      if (!token) throw new Error('로그인 실패: 토큰 없음');
      // 2. 토큰으로 내 정보 조회
      const user = await userService.getMyInfo();

      // 3. store에 유저 저장
      login({
        userNo: user.userNo,
        userId: user.userId,
        userName: user.userName,
        userRole: user.role,
      });

      // 4. 상태 기본 저장
      setUserStatus(userStatus);

      // 일반 로그인시 스토리지 생성
      toast.success('로그인 성공!');
      localStorage.setItem('normalLoginToast', 'normal');
      if (userStatus === false) {
        navigate('/caregiver');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || '로그인 중 오류 발생');
      console.error('로그인 에러 : ', error);
    } finally {
      setIsLoading(false);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
  };
};
