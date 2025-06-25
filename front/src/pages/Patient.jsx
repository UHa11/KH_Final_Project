import React, { useState } from 'react';
import { Title, AuthContainer } from '../styles/Auth.styles';
import { SubmitButton, ButtonText, MainMoveButton, MainSubmitButton } from '../styles/common/Button';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { useEffect } from 'react';
import { ProfileImg } from '../styles/common/Profile';
import { patientService } from '../api/patient';

const Patient = () => {
  const { user } = useUserStore();
  const [userPatients, setUserpatients] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) {
        alert('로그인 후 이용해주세요');
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

  return (
    <>
      <AuthContainer>
        <Head>
          <Title>돌봄 대상자 목록</Title>
          <MainSubmitBtn onClick={() => navigate('/guardian/patientregisteration')}>등록</MainSubmitBtn>
        </Head>

        <CardWrap>
          {userPatients?.map((pat) => (
            <Card key={pat.patNo}>
              <ProfileDiv>
                <Img src={pat.profileImage} alt="" />
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
                <MainMoveBtn onClick={() => navigate(`/report/${pat.id}`, 1)}>일지</MainMoveBtn>
              </ButtonDiv>
            </Card>
          ))}
        </CardWrap>
      </AuthContainer>
    </>
  );
};

export default Patient;

const CardWrap = styled.div`
  display: grid;
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
  width: 120px;
`;
