import React, { useEffect, useState } from 'react';
import { commuService } from '../../api/community';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';
import useUserStore from '../../store/userStore';
import Paging from '../../components/Paging';
import { Input, Page } from '../../styles/common/Board';
import {
  BoardItem,
  BoardItemTop,
  BoardMenu,
  BoardTop,
  BoardTopLeft,
  BoardTopRight,
  MenuDiv,
  MenuLink,
  PageInfo,
  PageTitle,
  PageTop,
  SearchBtn,
} from './style/Question.styles';

const QuestionHistory = () => {
  const userId = useUserStore((state) => state.user?.userId);

  const ROLE = 'Q';
  const STATUS = 'Y';

  const [error, setError] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentList = questionList.slice(startIndex, endIndex);
  const totalPage = Math.ceil(questionList.length / ITEMS_PER_PAGE);

  const chagneCurrentPage = (value) => {
    setCurrentPage(value);
  };
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const myHistory = await commuService.getQuestion(STATUS, ROLE, userId);
        console.log(myHistory);
        setQuestionList(myHistory);
      } catch (error) {
        console.error(error);
        const errorMessage = '목록을 불러오는데 실패했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [userId]);

  if (loading) {
    return (
      <div>
        <ClipLoader size={50} aria-label="Loading Spinner" />
      </div>
    );
  }

  if (error) {
    return null;
  }
  return (
    <Page>
      <PageInfo>
        <PageTop>
          <PageTitle> 1:1 문의사항 </PageTitle>
          <BoardMenu>
            <MenuLink to="/question/full">전체</MenuLink>
            <MenuDiv>문의내역</MenuDiv>
            {userId && <MenuLink to="/question/create"> 문의하기</MenuLink>}{' '}
          </BoardMenu>
        </PageTop>

        <BoardTop>
          <BoardTopLeft>총 {questionList.length}건</BoardTopLeft>
          <BoardTopRight>
            <Drop value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="date">날짜순</option>
              <option value="views">조회순</option>
            </Drop>
            <Input type="text" />
            <SearchBtn>검색</SearchBtn>
          </BoardTopRight>
        </BoardTop>
        <BoardItemTop>
          <div>No</div>
          <div style={{ flex: '2' }}>제목</div>
          <div>작성자</div>
          <div>작성 일자</div>
          <div>처리 현황</div>
        </BoardItemTop>
        {currentList.map((info) => (
          <BoardItem key={info.no} to={`/question/detail/${info.no}`}>
            <div>{info.no}</div>
            <div style={{ flex: '2' }}>{info.title}</div>
            <div>{info.name}</div>
            <div>{info.create_date}</div>
            {info.question_status == 'Y' ? <div>완료</div> : <div>대기</div>}
          </BoardItem>
        ))}

        <Paging totalPage={totalPage} currentPage={currentPage} chagneCurrentPage={chagneCurrentPage} />
      </PageInfo>
    </Page>
  );
};

const Drop = styled.select`
  min-width: 20%;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
  padding: 2px 4px;
`;

export default QuestionHistory;
