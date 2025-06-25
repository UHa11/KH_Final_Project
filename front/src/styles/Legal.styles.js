import styled, { css } from 'styled-components';

export const LegalWrap = styled.div`
  padding-top: ${({ theme }) => theme.spacing[12]};
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: start;
`;
export const LegalTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => theme.spacing[3]} 0;
`;
export const LegalContainer = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing[10]} ${({ theme }) => theme.spacing[12]};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;
export const LegalSubTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
export const Hr = styled.hr`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  margin: ${({ theme }) => theme.spacing[5]} 0;
`;

export const Bold = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const List = styled.ol`
  list-style: decimal;

  > li {
    margin-left: ${({ theme }) => theme.spacing[5]};
  }
`;

const contentsStyles = css`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
`;
export const Contents = styled.p`
  ${contentsStyles}
`;
export const ListItem = styled.li`
  ${contentsStyles}
`;
