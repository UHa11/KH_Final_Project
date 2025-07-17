import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { commuService } from '../../api/community';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { LinkBtn, MenuBox, NullBox, Page, SearchBoard } from '../../styles/common/Board';
import Paging from '../../components/Paging';
import { Link } from 'react-router-dom';
import { BoardBox } from './style/Community.styles';

const GuardianCommunity = () => {
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
        const community = await commuService.getGuardian(sortOption, keyword, currentPage - 1, ITEMS_PER_PAGE);

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
  }, [currentPage, sortOption, keyword]);

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
  if (totalCount == 0) {
    return (
      <Page>
        <MenuBox>
          <p> 보호자 게시판</p>
        </MenuBox>
        <SearchBoard>
          <div>총 0건</div>
          <form onSubmit={handleSubmit}>
            <select value={tempSortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">작성일</option>
              <option value="count">조회순</option>
            </select>
            <div>
              <input
                type="text"
                placeholder="검색어 입력"
                value={tempkeyword}
                onChange={(e) => setTempKeyword(e.target.value)}
              />
              <button type="submit">
                <img src="/src/assets/icons/icon_돋보기.png" alt="" />
              </button>
            </div>
          </form>
        </SearchBoard>
        <BoardBox>
          <div>
            <div>No</div>
            <div>제목</div>
            <div>작성자</div>
            <div>작성 일자</div>
            <div>조회수</div>
          </div>
        </BoardBox>
        <NullBox>
          <div>게시글이 없습니다</div>
          {userNo && <LinkBtn to="/community/create/G">글쓰기</LinkBtn>}
        </NullBox>
        <Paging totalPage={totalPage} currentPage={currentPage} chagneCurrentPage={chagneCurrentPage} />
      </Page>
    );
  }
  return (
    <Page>
      <MenuBox>
        <p> 보호자 게시판</p>
      </MenuBox>
      <SearchBoard>
        <div>총 {totalCount}건</div>
        <form onSubmit={handleSubmit}>
          <select value={tempSortOption} onChange={(e) => setTempSortOption(e.target.value)}>
            <option value="">작성일</option>
            <option value="count">조회순</option>
          </select>
          <div>
            <input
              type="text"
              placeholder="검색어 입력"
              value={tempkeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
            />
            <button type="submit">
              <img src="/src/assets/icons/icon_돋보기.png" alt="" />
            </button>
          </div>

          {userNo && <LinkBtn to="/community/create/G">글쓰기</LinkBtn>}
        </form>
      </SearchBoard>
      <BoardBox>
        <div>
          <div>No</div>
          <div>제목</div>
          <div>작성자</div>
          <div>작성 일자</div>
          <div>조회수</div>
        </div>
        {data.map((community) => (
          <Link key={community.boardNo} to={`/community/detail/${community.boardNo}`}>
            <div>{community.boardNo}</div>
            <div>{community.boardTitle}</div>
            <div>{community.userName}</div>
            <div>{community.createDate.slice(0, 10)}</div>
            <div>{community.count}</div>
          </Link>
        ))}
      </BoardBox>
      <Paging totalPage={totalPage} currentPage={currentPage} chagneCurrentPage={chagneCurrentPage} />
    </Page>
  );
};

export default GuardianCommunity;
