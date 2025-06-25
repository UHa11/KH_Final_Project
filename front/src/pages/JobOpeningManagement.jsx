import React, { useState } from 'react';
import styled from 'styled-components';
import Paging from '../components/Paging';
import theme from '../styles/theme';
import { MainSubmitButton } from '../styles/common/Button';
import { useNavigate } from 'react-router-dom';

const writtenData = [
  {
    no: 15,
    title: '정성 가득한 간병인을 찾습니다.',
    period: '2025-11-01 ~ 2025-11-10',
    applicants: '2명',
    status: '모집 중',
  },
  {
    no: 14,
    title: '따뜻한 마음의 간병인을 모십니다.',
    period: '2025-10-05 ~ 2025-10-20',
    applicants: '3명',
    status: '모집 마감',
  },
  {
    no: 13,
    title: '배려 깊은 간병인을 찾습니다.',
    period: '2025-09-10 ~ 2025-09-25',
    applicants: '1명',
    status: '모집 마감',
  },
  {
    no: 12,
    title: '책임감 있는 간병인을 구합니다.',
    period: '2025-08-01 ~ 2025-08-15',
    applicants: '4명',
    status: '모집 마감',
  },
  {
    no: 11,
    title: '간병 경력자 우대합니다.',
    period: '2025-07-20 ~ 2025-07-30',
    applicants: '2명',
    status: '모집 마감',
  },
  {
    no: 10,
    title: '오랜 간병 경험을 가진 분 환영합니다.',
    period: '2025-07-01 ~ 2025-07-10',
    applicants: '3명',
    status: '모집 마감',
  },
  {
    no: 9,
    title: '가족처럼 돌봐주실 분 구합니다.',
    period: '2025-06-10 ~ 2025-06-15',
    applicants: '5명',
    status: '모집 마감',
  },
  {
    no: 8,
    title: '성실한 간병인을 찾습니다.',
    period: '2025-05-01 ~ 2025-05-10',
    applicants: '1명',
    status: '모집 마감',
  },
  {
    no: 7,
    title: '정이 많은 간병인을 구합니다.',
    period: '2025-04-10 ~ 2025-04-20',
    applicants: '2명',
    status: '모집 마감',
  },
  {
    no: 6,
    title: '정성을 다해 돌봐주실 간병인을 구합니다.',
    period: '2025-07-15 ~ 2025-07-18',
    applicants: '0명',
    status: '모집 중',
  },
  {
    no: 5,
    title: '사려 깊은 간병인을 찾습니다. (조건 협의 가능)',
    period: '2025-06-04 ~ 2025-06-25',
    applicants: '5명',
    status: '모집 마감',
  },
  {
    no: 4,
    title: '사랑과 정성으로 함께할 간병인을 찾습니다.',
    period: '2025-03-04 ~ 2025-04-03',
    applicants: '10명',
    status: '모집 마감',
  },
  {
    no: 3,
    title: '경험 많은 간병인을 모십니다. (급구)',
    period: '2025-02-04 ~ 2025-03-03',
    applicants: '10명',
    status: '모집 마감',
  },
  {
    no: 2,
    title: '가족처럼 함께할 간병인을 찾습니다.',
    period: '2025-01-04 ~ 2025-02-03',
    applicants: '5명',
    status: '모집 마감',
  },
  {
    no: 1,
    title: '정성과 배려로 환자를 돌봐주실 분을 구합니다.',
    period: '2024-12-18 ~ 2025-01-03',
    applicants: '2명',
    status: '모집 마감',
  },
];

// 자식에게 물려주는 currentPage 변경시 값 추적 함수
const chagneCurrentPage = (value) => {
  setCurrentPage(value);
};

const ITEMS_PER_PAGE = 10;

const JobOpeningManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const totalPage = Math.ceil(writtenData.length / ITEMS_PER_PAGE);

  const navigate = useNavigate();

  return (
    <Wrapper>
      <Header>
        <Title>내 구인글 관리</Title>
        <MainSubmitButton onClick={() => navigate('/guardian/hire-registration')}>구인글 등록하기</MainSubmitButton>
      </Header>
      <Table>
        <THead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성일자</th>
            <th>지원현황</th>
            <th>상태</th>
          </tr>
        </THead>
        <TBody>
          {writtenData.slice(offset, offset + ITEMS_PER_PAGE).map((item) => (
            <tr key={item.no}>
              <td>{item.no}</td>
              <td className="title">{item.title}</td>
              <td>{item.period}</td>
              <td>{item.applicants}</td>
              <td style={{ color: item.status === '모집 중' ? theme.colors.success : theme.colors.gray[4] }}>
                {item.status}
              </td>
            </tr>
          ))}
        </TBody>
      </Table>

      <Paging totalPage={totalPage} currentPage={currentPage} chagneCurrentPage={setCurrentPage} />
    </Wrapper>
  );
};

export default JobOpeningManagement;

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spacing[10]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: left;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const THead = styled.thead`
  tr {
    background-color: ${({ theme }) => theme.colors.third};
    box-shadow: ${({ theme }) => theme.shadows.base};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
  }

  th {
    padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[3]};
    text-align: center;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.black1};
    white-space: nowrap;
    letter-spacing: 0.5px;
  }
`;

const TBody = styled.tbody`
  tr {
    background-color: ${({ theme }) => theme.colors.white};
    /* box-shadow: ${({ theme }) => theme.shadows.sm}; */
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }

    td {
      padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[2]};
      text-align: center;
      font-size: ${({ theme }) => theme.fontSizes.sm};
      color: ${({ theme }) => theme.colors.black3};
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 200px;
    }
  }
`;
