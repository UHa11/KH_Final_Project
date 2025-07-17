import React, { useState } from 'react';
import styled from 'styled-components';
import { Section } from '../styles/common/Container';
import { ButtonText, SubmitButton } from '../styles/common/Button';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { reportService } from '../api/report';
import TextareaAutosize from 'react-textarea-autosize';
import useUserStore from '../store/userStore';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa6';
const ReportForm = () => {
  const { patNo } = useParams();
  const patName = useLocation().state;
  const [count, setCount] = useState(1);
  const [error, setError] = useState(null);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    careGiverNo: user.userNo,
    patNo: Number(patNo),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await reportService.addReports(formData);
      alert('일지가 등록되었습니다.');
    } catch (error) {
      console.error(error);
      const errorMessage = '일지 등록에 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      navigate(`/report/${formData.patNo}`);
    }
  };

  if (error) {
    return null;
  }
  return (
    <Wrap>
      <MainTitle>진단 일지 등록 / 수정</MainTitle>
      <form id="report">
        <TopContainer>
          <Top>
            <Input name="reportTitle" placeholder="제목" value={formData.reportTitle || ''} onChange={handleChange} />
            <Name>{patName}</Name>
            <Name>{new Date().toISOString().slice(0, 10)}</Name>
          </Top>
        </TopContainer>
        {Array.from({ length: count }).map((_, index) => (
          <Container key={index}>
            <Header>
              <Contents onClick={() => close()}>
                <img src="Union.png" alt="" />
              </Contents>
            </Header>
            <Body>
              <Input
                name={`subTitle${index}`}
                placeholder="소제목"
                value={formData[`subTitle${index}`] || ''}
                onChange={handleChange}
              />
              <MainInput
                name={`content${index}`}
                placeholder="내용"
                value={formData[`content${index}`] || ''}
                onChange={handleChange}
                minRows={5}
              />
            </Body>
          </Container>
        ))}
      </form>
      <br />
      <AddBtn onClick={() => setCount((prevCount) => prevCount + 1)}>
        <ButtonText>
          <FaPlus size="20px" />
        </ButtonText>
      </AddBtn>
      <br /> <br />
      <Line />
      <br />
      <Buttons>
        <Btn onClick={() => window.history.back()}>
          <ButtonText>이전</ButtonText>
        </Btn>
        <Btn onClick={handleSubmit}>
          <ButtonText>등록</ButtonText>
        </Btn>
      </Buttons>
    </Wrap>
  );
};

const Wrap = styled.div`
  padding: ${({ theme }) => theme.spacing[8]} 0;
  max-width: 950px;
  margin: 0 auto;
`;

const MainTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  padding-bottom: ${({ theme }) => theme.spacing[8]};
`;

const TopContainer = styled(Section)`
  box-shadow: ${({ theme }) => theme.shadows.base};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
`;

const Container = styled(Section)`
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  margin: 20px 0 20px 0;
`;

const Top = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 16px;
`;

const Input = styled(TextareaAutosize)`
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  width: 100%;
  padding: 10px 20px;
  margin: 10px 0 5px 0;
  resize: none;
`;

const Name = styled.div`
  width: 20%;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 10px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[4]};
`;

const Contents = styled.div`
  margin: 8px 16px;

  > img {
    filter: brightness(300%) saturate(0%);
  }
`;

const MainInput = styled(TextareaAutosize)`
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 100%;
  height: 200px;
  padding: 10px 20px;
  resize: none;
`;

const Body = styled.div`
  width: 100%;
  padding: 20px;
`;

const Line = styled.div`
  width: 100%;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.gray[3]};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const Btn = styled(SubmitButton)`
  width: 160px;
  height: 60px;
`;

const AddBtn = styled(SubmitButton)`
  width: 100%;
  height: 60px;
`;
export default ReportForm;
