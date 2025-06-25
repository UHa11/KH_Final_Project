import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../api/users';
import { ClipLoader } from 'react-spinners';
import useUserStore from '../store/userStore';
import { SubmitBtn } from '../styles/PatientRegistration';
import { AuthContainer, Input, InputGroup } from '../styles/Auth.styles';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const CareGiverProfile = () => {
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useUserStore((state) => state.user?.userId);
  const [licenseList, setLicenseList] = useState([]);
  const navigate = useNavigate();

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
        console.log(userNo);
        const info = await userService.getCareGiverProfile(Number(userNo));
        console.log(info);

        if (info !== null) {
          setProfile(info); // 프로필 원본 데이터 저장

          // formData 초기화
          setFormData({
            userId: info.userId || '', // 아이디 필드 추가
            userName: info.userName || '',
            age: info.age || '',
            gender: info.gender || '',
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

  return (
    <ModalContainer>
      <ButtonWrap>
        <ContentTitle>간병인 정보</ContentTitle>
        <button onClick={() => navigate(-1)}> x </button>
      </ButtonWrap>

      <ProfileCardWrap>
        <ContentTitle>프로필</ContentTitle>

        <ProfileCard type="patient">
          <ProfileImage src="/src/assets/profileImg/img_간병인.png" alt="사용자" />

          <ProfileInfo>
            <UserName>
              {' '}
              <Strong>{profile.userName} </Strong> &nbsp; &nbsp;간병사 님
            </UserName>
            <UserAge>
              나이 <Strong>{profile.age} </Strong>
              세(<Strong>{profile.gender}</Strong>)
            </UserAge>
          </ProfileInfo>
        </ProfileCard>
      </ProfileCardWrap>

      <hr />
      <LicenseWrap>
        <ContentTitle> 자격증</ContentTitle>
        {licenseList && licenseList.length > 0 ? (
          <LicenseTable>
            <tr>
              <th>자격증명</th>
              <th>발급기관</th>
              <th>발급일자</th>
            </tr>
            {licenseList.map((li) => (
              <tr key={li.licenseName}>
                <td>{li.licenseName}</td>
                <td>{li.licensePublisher}</td>
                <td>{li.licenseDate}</td>
              </tr>
            ))}
          </LicenseTable>
        ) : (
          <p>자격증정보가 없습니다.</p>
        )}
      </LicenseWrap>
    </ModalContainer>
  );
};

export const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[16]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 650px;
  min-height: 500px;
  gap: 10px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
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
  width: 100%;
  display: flex;
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

export default CareGiverProfile;
