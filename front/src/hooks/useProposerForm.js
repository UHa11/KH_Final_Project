import { useState, useEffect } from 'react';
import { jobSeekingService } from '../api/jobSeeking';
import useUserStore from '../store/userStore';
import { proposerService } from '../api/propose';

export const useProposerForm = (hiringNo, onSuccess) => {
  const { user } = useUserStore();
  const [resumeList, setResumeList] = useState([]);
  const [selectedResumeNo, setSelectedResumeNo] = useState('');

  // 이력서 리스트 불러오기
  useEffect(() => {
    const fetchMyResumes = async () => {
      try {
        const resumes = await jobSeekingService.getMyResumeLists(user.userNo);
        setResumeList(resumes);
      } catch (err) {
        alert('이력서를 불러오는 데 실패했습니다.');
        console.error(err);
      }
    };

    if (user?.userNo) fetchMyResumes();
  }, [user]);

  // 이력서 선택 핸들러
  const handleChange = (e) => {
    setSelectedResumeNo(e.target.value);
  };

  // 신청 처리 함수
  const submitApplication = async () => {
    if (!selectedResumeNo) {
      alert('이력서를 선택해주세요.');
      return;
    }

    const confirmed = window.confirm('해당 채용공고에 지원하시겠습니까?');
    if (!confirmed) return;

    try {
      await proposerService.proposerToHiring({
        hiringNo: Number(hiringNo),
        resumeNo: Number(selectedResumeNo),
        caregiverNo: user.userNo, // 또는 caregiver_no
      });

      alert('지원이 완료되었습니다.');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message || '지원 신청에 실패했습니다.');
    }
  };

  return {
    resumeList,
    selectedResumeNo,
    handleChange,
    submitApplication,
  };
};
