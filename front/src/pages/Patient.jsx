import React, { useState } from 'react';
import { AuthContainer } from '../styles/Auth.styles';
import { SubmitButton, ButtonText, MainMoveButton, MainSubmitButton } from '../styles/common/Button';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { useEffect } from 'react';
import profileImage from '../assets/profileImg/img_환자소.png';
import { patientService } from '../api/patient';
import { ProfileImg } from '../styles/common/Profile';

const Patient = () => {
  const { user } = useUserStore();
  const [userPatients, setUserpatients] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        return;
      }

      try {
        const patientsList = await patientService.getPatients(user.userNo);
        setUserpatients(patientsList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <>
      <AuthContainer>
        <Head>
          <Title>돌봄 대상자 목록</Title>
          <MainSubmitBtn onClick={() => navigate('/guardian/patientregisteration')}>돌봄대상자 등록</MainSubmitBtn>
        </Head>

        <CardWrap>
          {Array.isArray(userPatients) && userPatients.length > 0 ? (
            <>
              {userPatients?.map((pat) => (
                <Card key={pat.patNo}>
                  <ProfileDiv>
                    <Img src={getProfileImageUrl(pat.profileImage)} alt="프로필" />
                    <div>
                      <ProfileTextGray>
                        <ProfileTextStrong>{pat.patName}</ProfileTextStrong> 님
                      </ProfileTextGray>

                      <ProfileTextGray>
                        나이
                        <ProfileTextStrong>
                          {pat.patAge}세 ({pat.patGender === 'F' ? '여' : '남'})
                        </ProfileTextStrong>
                      </ProfileTextGray>
                    </div>
                  </ProfileDiv>

                  <ButtonDiv>
                    <MainMoveBtn onClick={() => navigate(`/guardian/patient/${pat.patNo}`)}>관리</MainMoveBtn>
                    {}
                    <MainMoveBtn onClick={() => navigate(`/report/${pat.patNo}`)}>일지</MainMoveBtn>
                  </ButtonDiv>
                </Card>
              ))}
            </>
          ) : (
            <EmptyMessage>
              등록된 돌봄대상자가 없습니다. <br /> 돌봄대상자 등록버튼을 클릭하여 등록해주세요
            </EmptyMessage>
          )}
        </CardWrap>
      </AuthContainer>
    </>
  );
};

export default Patient;

const CardWrap = styled.div`
  display: ${({ userPatients }) => (Array.isArray(userPatients) && userPatients.length > 0 ? 'gird' : 'flex')};
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  align-content: start;
  gap: ${({ theme }) => theme.spacing[5]}; /* 카드 간 간격 */
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.base};
  min-height: 850px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding-bottom: ${({ theme }) => theme.spacing[8]};
`;

const MainMoveBtn = styled(MainMoveButton)`
  width: 100px;
`;
const Card = styled.div`
  max-height: fit-content;
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const ProfileDiv = styled.div`
  display: flex;
  text-align: left;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[5]};
`;
const Img = styled(ProfileImg)`
  width: 50px;
  height: 50px;
  margin-right: ${({ theme }) => theme.spacing[4]};
  border-radius: 50%;
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

const MainSubmitBtn = styled(MainSubmitButton)`
  width: 200px;
`;
// 비어있음 메세지
export const EmptyMessage = styled.p`
  width: 100%;
  padding: auto;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[10]} 0;
  color: ${({ theme }) => theme.colors.gray[3]};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;
