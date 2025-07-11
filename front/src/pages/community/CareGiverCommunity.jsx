import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { commuService } from '../../api/community';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { LinkBtn, NullBox, Page } from '../../styles/common/Board';
import {
  BoardItem,
  BoardItemTop,
  BoardMenu,
  BoardTop,
  BorderDiv,
  Drop,
  Form,
  Input,
  Left,
  NowBoard,
  PageInfo,
  Right,
  SearchBtn,
} from './style/CommunityList.styles';
import Paging from '../../components/Paging';

const CareGiverCommunity = () => {
  const userNo = useUserStore((state) => state.user?.userNo);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sortOption, setSortOption] = useState('');
  const [tempSortOption, setTempSortOption] = useState('');
  const [keyword, setKeyword] = useState('');
  const [tempkeyword, setTempKeyword] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const chagneCurrentPage = (value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const community = await commuService.getCaregiver(sortOption, keyword, currentPage - 1, ITEMS_PER_PAGE);
        console.log(community);

        setData(community.content); // 게시글 목록 등
        setTotalPage(community.totalPage); // 총 페이지 수
        setTotalCount(community.totalCount);
      } catch (error) {
        console.error(error);
        const errorMessage = '목록을 불러오는데 실패했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [currentPage, keyword, sortOption]);

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
  const handleSubmit = async (e) => {
    setSortOption(tempSortOption);
    setKeyword(tempkeyword);
    e.preventDefault();
  };
  if (!data || totalCount === 0) {
    return (
      <Page>
        <PageInfo>
          <BoardMenu>
            <NowBoard> 간병 게시판</NowBoard>
          </BoardMenu>
          <BoardTop>
            <Form onSubmit={handleSubmit}>
              <Drop value={tempSortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="">작성일</option>
                <option value="count">조회순</option>
              </Drop>
              <Input
                type="text"
                placeholder="검색어 입력"
                value={tempkeyword}
                onChange={(e) => setTempKeyword(e.target.value)}
              />
              <SearchBtn type="submit">검색</SearchBtn>
            </Form>
          </BoardTop>
          <BoardItemTop>
            <div>No</div>
            <div style={{ flex: '3' }}>제목</div>
            <div>작성자</div>
            <div style={{ flex: '2' }}>작성 일자</div>
            <div>조회수</div>
          </BoardItemTop>
          <NullBox>
            <div style={{ marginBottom: '10px' }}>게시글이 없습니다.</div>
            {userNo && (
              <LinkBtn style={{ margin: 'auto' }} to="/community/create/C">
                글쓰기
              </LinkBtn>
            )}
          </NullBox>
          <BorderDiv></BorderDiv>
          <Paging totalPage={totalPage} currentPage={currentPage} chagneCurrentPage={chagneCurrentPage} />
        </PageInfo>
      </Page>
    );
  }
  return (
    <Page>
      <PageInfo>
        <BoardMenu>
          <NowBoard> 간병 게시판</NowBoard>
        </BoardMenu>
        <BoardTop>
          <Left>총 {totalCount}건</Left>
          <Form onSubmit={handleSubmit}>
            <Drop value={tempSortOption} onChange={(e) => setTempSortOption(e.target.value)}>
              <option value="">작성일</option>
              <option value="count">조회순</option>
            </Drop>
            <Input
              type="text"
              placeholder="검색어 입력"
              value={tempkeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
            />
            <SearchBtn type="submit">검색</SearchBtn>
            {userNo && <LinkBtn to="/community/create/G">글쓰기</LinkBtn>}
          </Form>
        </BoardTop>
        <BoardItemTop>
          <div>No</div>
          <div style={{ flex: '3' }}>제목</div>
          <div>작성자</div>
          <div style={{ flex: '2' }}>작성 일자</div>
          <div>조회수</div>
        </BoardItemTop>
        {data.map((info) => (
          <BoardItem key={info.boardNo} to={`/community/detail/${info.boardNo}`}>
            <div>{info.boardNo}</div>
            <div style={{ flex: '3' }}>{info.boardTitle}</div>
            <div>{info.userName}</div>
            <div style={{ flex: '2' }}>{info.createDate.slice(0, 10)}</div>
            <div>{info.count}</div>
          </BoardItem>
        ))}
        <BorderDiv></BorderDiv>
        <Paging totalPage={totalPage} currentPage={currentPage} chagneCurrentPage={chagneCurrentPage} />
      </PageInfo>
    </Page>
  );
};

export default CareGiverCommunity;
