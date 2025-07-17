import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../api/users';
import { ClipLoader } from 'react-spinners';
import useUserStore from '../store/userStore';
import { SubmitBtn } from '../styles/PatientRegistration';
import { AuthContainer, Button, Input, InputGroup } from '../styles/Auth.styles';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ModalContainer } from '../styles/common/Modal';
import { RiAlarmWarningLine } from 'react-icons/ri';
import { matchingService } from '../api/matching';
import { useLocation } from 'react-router-dom';
import chatImage from '../assets/icons/icon_채팅아이콘.png'; // 채팅 이미지 경로
import profileImage from '../assets/profileImg/img_간병인.png'; // 프로필 이미지 경로
const CareGiverProfile = () => {
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useUserStore((state) => state.user?.userId);
  const [licenseList, setLicenseList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const matNo = location.state?.matNo;
  const [formData, setFormData] = useState({
    userId: '', // 아이디 필드도 포함
    userName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
  });

  const { userNo } = useParams();

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false);
        setError('사용자 ID를 사용할 수 없습니다.');
        toast.error('사용자 ID를 사용할 수 없습니다.');
        return;
      }

      try {
        const info = await userService.getCareGiverProfile(Number(userNo));
        if (info !== null) {
          setProfile(info); // 프로필 원본 데이터 저장

          // formData 초기화
          setFormData({
            userId: info.userId || '', // 아이디 필드 추가
            userName: info.userName || '',
            age: info.age || '',
            gender: (info.gender === 'M' ? '남' : '여') || '',
            phone: info.phone || '',
            email: info.email || '',
            address: info.address || '',
          });

          if (info.licenses?.length > 0) {
            setLicenseList(info.licenses);
          }
        }
      } catch (error) {
        console.error('프로필 로드 실패:', error);
        const errorMessage = '개인정보 불러오는데 실패했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <AuthContainer>
        <ClipLoader size={50} aria-label="로딩 중" />
      </AuthContainer>
    );
  }

  if (error || !profile) {
    return (
      <AuthContainer>
        <div>{error || '프로필 정보를 불러올 수 없습니다.'}</div>
      </AuthContainer>
    );
  }

  const handleInfo = async () => {
    const info =
      '신고가 접수되었습니다. 확인을 누르시면 매칭이 종료되며, 매칭내역에서 사라집니다. 매칭을 종료하시겠습니까?';

    const confirmed = window.confirm(info);

    if (!confirmed) return;

    try {
      await matchingService.getMatchingChangeStatus(Number(matNo), 'N');
      navigate('/guardian/matchpage');
    } catch (error) {
      console.error('신고 처리 중 오류 발생:', error);
    }
  };

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <ModalContainer2>
      <ContentTitle>간병인 정보</ContentTitle>

      <ProfileCardWrap>
        <ContentTitle>프로필</ContentTitle>

        <ProfileCard type="patient">
          <ProfileImage src={getProfileImageUrl(profile?.profileImage)} alt="프로필" />

          <ProfileInfo>
            <UserName>
              {' '}
              <Strong>{profile.userName} </Strong> &nbsp; &nbsp;간병사 님
            </UserName>
            <UserAge>
              나이 <Strong>{profile.age} </Strong>
              세(<Strong>{profile.gender === 'M' ? '남' : profile.gender === 'F' ? '여' : '기타'}</Strong>)
            </UserAge>
          </ProfileInfo>
          <ChatButton>
            <img src={chatImage} alt="프로필 이미지" sizes="10px" /> 채팅하기
          </ChatButton>
        </ProfileCard>
      </ProfileCardWrap>

      <hr />
      <LicenseWrap>
        <ContentTitle> 자격증</ContentTitle>
        {licenseList && licenseList.length > 0 ? (
          <LicenseTable>
            <thead>
              <tr>
                <th>자격증명</th>
                <th>발급기관</th>
                <th>발급일자</th>
              </tr>
            </thead>
            {licenseList.map((li) => (
              <tbody key={li.licenseName}>
                <tr>
                  <td>{li.licenseName}</td>
                  <td>{li.licensePublisher}</td>
                  <td>{li.licenseDate}</td>
                </tr>
              </tbody>
            ))}
          </LicenseTable>
        ) : (
          <p>자격증정보가 없습니다.</p>
        )}
      </LicenseWrap>
      <ButtonWrap>
        <Button onClick={() => navigate(-1)}> 이전으로 </Button>
        <Button onClick={handleInfo}>
          {/* <RiAlarmWarningLine></RiAlarmWarningLine> */}
          신고하기
        </Button>
      </ButtonWrap>
    </ModalContainer2>
  );
};

export const ModalContainer2 = styled(ModalContainer)`
  min-height: min-content;
  margin-top: 50px;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[16]};
`;

const ProfileCardWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
  justify-content: flex-start;
  margin-top: ${({ theme }) => theme.spacing[3]};
`;
const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  /* ProfileCard의 type prop에 따라 배경색이 변경됩니다. */
`;

const ButtonWrap = styled.div`
  margin: 20px;
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
`;
const ContentTitle = styled.h3`
  text-align: left;
  margin: 0;
`;
const ProfileCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  justify-content: flex-start;
  align-items: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1; /* 남은 공간을 채우도록 */
  gap: ${({ theme }) => theme.spacing[2]};
`;

const UserName = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.base};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const UserAge = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Strong = styled.strong`
  color: ${({ theme }) => theme.colors.black1};
`;

const LicenseWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const LicenseTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border: 1px solid #ccc;
  font-size: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[3]};

  th {
    background-color: ${({ theme }) => theme.colors.gray[5]};
    align-items: center;
  }
  th,
  td {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[5]};
    text-align: left;
  }

  /* 안쪽 선만 */
  td,
  th {
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }
`;

const ChatButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: fit-content;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  display: flex;
  margin-right: ${({ theme }) => theme.spacing[3]};
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  img {
    width: 20px;
    height: 20px;
  }
`;

export default CareGiverProfile;
