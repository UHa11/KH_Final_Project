import { styled } from 'styled-components';

// 예시 코드입니다 지우고 새롭게 만들어주세요
// 단 기본적으로 맨위의 틀을가지고 가서 변경하는것을 추천하나, 많이 바뀔거같으면 아래와 같이 새로 하나 만들어서 사용하세요
// 절대 다른 사람이 만든 컴포넌트 말없이 수정 ㄴㄴ 당신 책임

// 이동 버튼입니다. (상세보기, 환자정보, 일지보기 등)
export const MainMoveButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
`;

// 등록 버튼입니다. (수정하기, 등록하기, 신청하기 등)
export const MainSubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
`;

// 뒤로가기 버튼입니다.
export const BackButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const Button = styled.button`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
`;

export const AddButton = styled.button``;

export const DeleteButton = styled.button``;

export const SubmitButton = styled.button`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
`;

export const ButtonText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
