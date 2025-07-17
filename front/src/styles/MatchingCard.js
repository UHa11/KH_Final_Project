import styled, { css } from 'styled-components';
import { Button, Title } from './Auth.styles';
import { MainMoveButton, MainSubmitButton } from './common/Button';
import { media } from '../styles/MediaQueries';

export const CardWrap = styled.div`
  display: ${({ list }) => (list?.length > 0 ? 'grid' : 'flex')};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[5]};
  gap: ${({ theme }) => theme.spacing[8]};
  grid-template-columns: 1fr;

  ${({ list }) =>
    list?.length > 0 &&
    media.lg`
      grid-template-columns: repeat(2, 1fr);
    `}
`;
export const CardInnerWrap = styled.div`
  width: 100%;
  gap: 10px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;
export const ProfileSection = styled.div`
  display: flex;
  margin: ${({ theme }) => theme.spacing[3]};
  margin-bottom: 0px;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing[5]};
`;

export const InfoSection = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
`;
export const ProFileImges = styled.img`
  padding: auto;
  width: 150px;
  height: 150px;
`;
export const TextWrap = styled.div`
  display: flex;
  gap: 10px;
  margin: 5px;
  align-items: center;

  img {
    width: 18px;
    height: 18px;
  }
  p {
    text-align: left;
  }
`;
export const BtnSection = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 10px;
  justify-content: center;

  button {
    padding: ${({ theme }) => theme.spacing[3]};
    border-radius: ${({ theme }) => theme.borderRadius.base};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;
export const ReportBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  width: 45%;
`;
export const EndBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.danger};
  width: 45%;
`;

//보호자 버전 styeled

export const ProfileCardPair = styled.div`
  display: flex;
  flex-direction: column;

  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%; /* 부모 컨테이너의 너비 전체 사용 */
  margin-bottom: ${({ theme }) => theme.spacing[8]}; /* 각 카드 쌍 아래쪽 간격 */
  overflow: auto;

  ${media.md`  
    display : grid;
    grid-template-columns: 1fr 1fr;
  `}

  ${media.lg`  
    display : grid;
    grid-template-columns: 1fr 2fr;
  `}
`;

/*====== 환자 스타일 =====*/
export const ProfileCard = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'none' : 'flex')};

  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[5]};

  gap: ${({ theme }) => theme.spacing[8]};
  width: 100%; /* ProfileCardPair 내에서 각 카드의 너비 (gap을 고려하여 50%보다 약간 작게) */
  box-sizing: border-box; /* 패딩과 보더가 너비에 포함되도록 */
  &:hover {
    background-color: #fcfaf0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
`;

// 프로필 이미지 스타일
export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  /* ProfileCard의 type prop에 따라 배경색이 변경됩니다. */

  ${media.lg`  // 예: 768px 이하일 때
    width: 100px;
    height: 100px;
 `}
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  flex-grow: 1; /* 남은 공간을 채우도록 */
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const UserName = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const UserAge = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[3]}; /* 어두운 회색으로 변경 */
`;

export const InfoButton = styled.button`
  display: flex;
  background-color: ${({ theme }) => theme.colors.secondary}; /* 주황색 */
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[8]}`};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  margin: ${({ theme }) => theme.spacing[1]} 0;
  white-space: nowrap;
  /* ${media.md`  // 예: 768px 이하일 때
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[2]}`};
 `} */

  ${media.lg`  // 예: 768px 이하일 때
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[2]}`};
 `}
`;

export const RightLineDiv = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

export const TestBtn = styled(InfoButton)`
  margin: auto 5px;
  cursor: pointer;

  ${media.md`
      display: none;
  `}
`;

/*====== 간병인 스타일 =====*/
export const CargiverWrap = styled.div`
  display: none;
  justify-content: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
  height: fit-content;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[2]};
  justify-content: space-around;

  ${media.md`  // 예: 768px 이하일 때
    display: flex;
    justify-content: space-around;
    flex-direction : column;
    gap: ${({ theme }) => theme.spacing[12]};
   
 `}

  ${media.lg`  // 예: 768px 이하일 때
    display: flex;
    justify-content: space-around;
    flex-direction : row;
    gap: ${({ theme }) => theme.spacing[12]};
   
 `}
`;

export const CaregiverImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CaregiverDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};

  ${media.md`  // 예: 768px 이하일 때
    justify-content: center;
    flex-direction: row;
    align-items: center;
 `}
`;

export const CaregiverTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const ProfileTextGray = styled.p`
  color: ${({ theme }) => theme.colors.gray[3]};
`;

export const ProfileTextStrong = styled.strong`
  color: ${({ theme }) => theme.colors.black1};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const CargiverButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  ${media.md`  // 예: 768px 이하일 때
flex-direction : row;
 `}
`;

export const ReportButton = styled.button`
  background-color: ${({ theme }) => theme.colors.danger}; /* 빨간색 */
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap;
`;

export const CareLogButton = styled.button`
  width: 200px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  white-space: nowrap;
`;

export const PageWrapper = styled.div`
  position: absolute;
  width: inherit;
  bottom: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[5]};
`;

export const EmptyMessage = styled.p`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[3]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;
