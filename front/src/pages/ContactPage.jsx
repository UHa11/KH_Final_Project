import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { media } from '../styles/MediaQueries';

const ContactPage = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   await inquiryService.sendInquiry(form);
    //   toast.success('문의가 정상적으로 접수되었습니다.');
    //   setForm({ title: '', content: '' });
    // } catch (error) {
    //   toast.error('문의 전송에 실패했습니다.');
    // }
  };

  return (
    <Wrapper>
      <TopSection>
        <PageTitle>1:1 문의사항</PageTitle>
      </TopSection>
      <Form onSubmit={handleSubmit}>
        <Label>
          제목
          <Input name="title" value={form.title} onChange={handleChange} required />
        </Label>
        <Label>
          내용
          <Textarea name="content" value={form.content} onChange={handleChange} required />
        </Label>
        <SubmitButton type="submit">문의하기</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default ContactPage;

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spacing[10]};
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-direction: column;
  ${media.md`
    flex-direction: row;
  `}
`;

const PageTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[2]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-top: ${({ theme }) => theme.spacing[1]};
  resize: vertical;
  min-height: 120px;
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  cursor: pointer;
`;
