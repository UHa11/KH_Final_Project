import React, { useState } from 'react';
import { Title, AuthContainer, TipP } from '../styles/Auth.styles';
import { SubmitButton, ButtonText } from '../styles/common/Button';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { useEffect } from 'react';
import { CiCircleInfo } from 'react-icons/ci';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { jobSeekingService } from '../api/jobSeeking';
import { toast } from 'react-toastify';
import { pageing } from '../hooks/pageing';
import Paging from '../components/Paging';

const ResumeManagement = () => {
  const { user } = useUserStore();
  const [resumeLists, setResumeLists] = useState([]);
  const { currentPage, chagneCurrentPage } = pageing();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/');
        return;
      }

      try {
        const getResumeLists = await jobSeekingService.getMyResumeList(currentPage, user.userNo);
        setResumeLists(getResumeLists.content);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const handleStatusToggle = async (resumeNo, currentStatus) => {
    const newStatus = currentStatus === 'Y' ? 'W' : 'Y';

    if (newStatus === 'Y') {
      const confirmPost = window.confirm('이 이력서를 간병사 모집에 게시하시겠습니까?');
      if (!confirmPost) return;

      // 2. 이미 등록된 resume가 3개 이상인지 검사
      const activeResumes = resumeLists.filter((resume) => resume.status === 'Y');
      if (activeResumes.length >= 3) {
        toast.error('이력서는 최대 3개까지만 등록할 수 있습니다.');
        return;
      }
    }

    try {
      await jobSeekingService.updateResume(resumeNo, { status: newStatus });
      if (newStatus === 'Y') {
        toast.success('이력서가 게시되었습니다.');
      } else {
        toast.success('이력서가 회수되었습니다.');
      }

      setResumeLists((prev) =>
        prev.map((resume) => (resume.resumeNo === resumeNo ? { ...resume, status: newStatus } : resume))
      );
    } catch (error) {
      toast.error('상태 변경 중 문제가 발생했습니다.');
      console.error('상태 변경 에러: ', error);
    }
  };
  return (
    <>
      <AuthContainer>
        <Head>
          <TitleSection>
            <NewTitle>이력서 목록</NewTitle>
            <TipP>
              <CiCircleInfo color="#EF7A46" size={'20px'}></CiCircleInfo> 체크표시된 이력서는 구인글로 게시됩니다.
              확인하세요.
            </TipP>
          </TitleSection>

          <RegistrationButton>
            <ButtonText onClick={() => navigate('/caregiver/resumeregistration')}>이력서 등록</ButtonText>
          </RegistrationButton>
        </Head>

        <CardWrap>
          <ContentSection>
            {resumeLists?.map((resume, index) => (
              <Card key={resume.resumeNo}>
                <ProfileDiv>
                  <ProfileTextGray>
                    NO <ProfileTextStrong>{index + 1}</ProfileTextStrong>
                  </ProfileTextGray>
                  <StyledCheckbox checked={resume.status === 'Y'}>
                    <HiddenCheckbox
                      checked={resume.status === 'Y'}
                      onChange={() => handleStatusToggle(resume.resumeNo, resume.status)}
                    />
                    {resume.status === 'Y' && <IoCheckmarkOutline size="20px" color="white" />}
                  </StyledCheckbox>
                </ProfileDiv>

                <ButtonDiv>
                  <SubmitButton1 onClick={() => navigate(`/caregiver/myresume/${resume.resumeNo}`)}>
                    <ButtonText>이력서 상세</ButtonText>
                  </SubmitButton1>
                </ButtonDiv>
              </Card>
            ))}
          </ContentSection>

          <PagingSection>
            <Paging currentPage={currentPage} totalPage={resumeLists.totalPage} chagneCurrentPage={chagneCurrentPage} />
          </PagingSection>
        </CardWrap>
      </AuthContainer>
    </>
  );
};

export const TitleSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

export const NewTitle = styled(Title)`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin: 0px;
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const CardWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.base};
  min-height: 700px;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  align-content: start;
  gap: ${({ theme }) => theme.spacing[5]}; /* 카드 간 간격 */
`;
const PagingSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RegistrationButton = styled(SubmitButton)`
  height: fit-content;
  width: 120px;
`;

const Card = styled.div`
  max-height: fit-content;
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const ProfileDiv = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing[5]};
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ProfileTextGray = styled.p`
  color: ${({ theme }) => theme.colors.gray[3]};
`;

const ProfileTextStrong = styled.strong`
  color: ${({ theme }) => theme.colors.black};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing[5]};
  gap: ${({ theme }) => theme.spacing[4]};
`;
const SubmitButton1 = styled(SubmitButton)`
  width: 100%;
`;

const Text = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.base};
  padding: ${({ theme }) => theme.spacing[5]};
  color: ${({ theme }) => theme.colors.primary};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
`;
const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
`;

const StyledCheckbox = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: ${({ checked, theme }) => (checked ? theme.colors.primary : '#eee')};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;
export default ResumeManagement;
