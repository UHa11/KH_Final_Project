import { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { commuService } from '../../api/community';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { BodyText, BodyTop, Btn, Page, PageBody, PageTop } from '../../styles/common/Board';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { FileBox, Icons } from './style/Community.styles';
import { useForm } from 'react-hook-form';
import profileImage from '../../assets/images/cargiver.png'; // 프로필 이미지 경로
const CommunityDetail = () => {
  const userNo = useUserStore((state) => state.user?.userNo);

  const [error, setError] = useState(null);
  const [communityDetail, setCommunityDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { boardNo } = useParams();

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const handleUpdateClick = (replyNo, replyContent) => {
    setEditedContent(replyContent);
    setEditingReplyNo(replyNo);
  };

  const handleCancelEdit = () => {
    setEditingReplyNo(null);
    setEditedContent('');
  };

  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const community = await commuService.getCommunityDetail(boardNo);

        setCommunityDetail(community);
      } catch (error) {
        console.error(error);
        const errorMessage = '목록을 불러오는데 실패했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        reset();
      }
    };

    loadCommunity();
  }, [boardNo, reset]);

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

  if (!communityDetail) {
    return <Page>게시글을 찾을 수 없습니다.</Page>;
  }

  const onSubmit = async (data) => {
    if (!data.replyContent.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }
    try {
      setIsSubmitting(true);
      const replyData = {
        board_no: boardNo,
        user_no: userNo,
        reply_content: data.replyContent,
      };

      await commuService.createReply(replyData);

      const community = await commuService.getCommunityDetail(boardNo);
      setCommunityDetail(community);
    } catch (error) {
      console.error(error);
      const errorMessage = '등록에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };
  const handleUpdateReply = async (data) => {
    try {
      const replyData = {
        reply_no: data,
        reply_content: editedContent,
      };

      await commuService.updateReply(replyData); // API 호출

      const updatedCommunity = await commuService.getCommunityDetail(boardNo); // 데이터만 다시 요청
      setCommunityDetail(updatedCommunity); // 상태 갱신
      setEditedContent(''); // 작성 내용 초기화
      setEditingReplyNo(null);
    } catch (error) {
      toast.error(error.message);
      const errorMessage = '등록에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };
  const handleDeleteBoard = async () => {
    try {
      const deleteBoard = await commuService.deleteBoard(boardNo); // API 호출
      toast.success(deleteBoard);
      navigate(-1);
      // 데이터만 다시 요청
    } catch (error) {
      toast.error(error.message);
      const errorMessage = '삭제 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteReply = async (replyNo) => {
    try {
      const deleteReply = await commuService.deleteReply(replyNo); // API 호출
      toast.success(deleteReply);
      const updatedCommunity = await commuService.getCommunityDetail(boardNo); // 데이터만 다시 요청
      setCommunityDetail(updatedCommunity); // 상태 갱신
      setEditedContent(''); // 작성 내용 초기화
      setEditingReplyNo(null);
    } catch (error) {
      toast.error(error.message);
      const errorMessage = '삭제 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <Page>
      <PageTop>
        {communityDetail.role === 'C' ? <p>간병 게시판 상세</p> : <p>보호자 게시판 상세</p>}

        <button type="button" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </PageTop>

      <PageBody>
        <p>{communityDetail.boardTitle}</p>
        <BodyTop>
          <div>
            <img src="/src/assets/icons/icon_작성자.png" alt="" />
            <div>{communityDetail?.userName}</div>
          </div>
          <div>
            <img src="/src/assets/icons/icon_조회수.png" alt="" />
            <div>{communityDetail?.count}</div>
            <img src="/src/assets/icons/icon_작성일자.png" alt="" />
            <div>{communityDetail.createDate.split('.')[0].replace('T', ' / ')}</div>
            {communityDetail.userNo === userNo ? (
              <MenuBox>
                <img src="/src/assets/icons/icon_설정메뉴.png" alt="" />
                <ul>
                  <li>
                    <img src="/src/assets/icons/icon_수정.png" alt="" />
                    <Link to={`/community/update/${communityDetail.boardNo}`}>수정</Link>
                  </li>
                  <li>
                    <img src="/src/assets/icons/icon_삭제.png" alt="" />
                    <button onClick={handleDeleteBoard}> 삭제</button>
                  </li>
                </ul>
              </MenuBox>
            ) : null}
          </div>
        </BodyTop>
        <BodyText>{communityDetail.boardContent}</BodyText>
        {communityDetail.files && communityDetail.files.length > 0 && (
          <FileBox>
            <div>
              <img src="/src/assets/icons/icon_사진.png" alt="" />
              <p>사진</p>
            </div>
            <div>
              {communityDetail.files?.map((file, index) => (
                <div className="file-card" key={index}>
                  <a href={getProfileImageUrl(file?.fileName)} target="_blank" rel="noopener noreferrer">
                    <img src={getProfileImageUrl(file?.fileName)} alt="첨부 이미지" />
                  </a>
                </div>
              ))}
            </div>
          </FileBox>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CommentBox>
            <CommentInput
              type="text"
              placeholder="댓글을 입력하세요"
              {...register('replyContent')}
              disabled={isSubmitting}
            />
            <CommentButton type="submit">댓글 작성</CommentButton>
          </CommentBox>
        </form>
        <CommentEx>
          <span>
            • 개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법정보 유포 시 이에 대한 민형사상 책임은 작성자에게
            있습니다
          </span>
          <span>• 개인정보가 포함되거나 부적절한 답변은 비노출 또는 해당 서비스 이용 불가 처리될 수 있습니다</span>
        </CommentEx>
      </PageBody>
      <CommentSelectBox>
        <div style={{ gap: '6px', paddingLeft: '10px' }}>
          <div style={{ fontWeight: theme.fontWeights.bold }}>댓글</div>
          <div style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.bold }}>
            {communityDetail.reply.length}
          </div>
        </div>
        {communityDetail.reply?.map((reply) => (
          <CommentSelect key={reply.replyNo}>
            <div style={{ width: '100%', gap: '8px' }}>
              <img src="/src/assets/icons/icon_작성자.png" alt="" />
              <div>{reply.userName}</div>
              <div>{reply.updateDate}</div>
              {communityDetail.userNo === userNo || reply.userNo === userNo ? (
                <MenuBox style={{ marginLeft: 'auto' }}>
                  <img src="/src/assets/icons/icon_설정메뉴.png" alt="" />
                  <ul>
                    {reply.userNo === userNo ? (
                      <li>
                        <img src="/src/assets/icons/icon_수정.png" alt="" />
                        <button type="button" onClick={() => handleUpdateClick(reply.replyNo, reply.replyContent)}>
                          수정
                        </button>
                      </li>
                    ) : null}
                    <li>
                      <img src="/src/assets/icons/icon_삭제.png" alt="" />
                      <button type="button" onClick={() => handleDeleteReply(reply.replyNo)}>
                        삭제
                      </button>
                    </li>
                  </ul>
                </MenuBox>
              ) : null}
            </div>
            {editingReplyNo === reply.replyNo ? (
              <CommentUpdate style={{ display: 'flex', flexDirection: 'column', margin: '10px 10px 0' }}>
                <input value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                <div>
                  <Btn type="button" onClick={() => handleUpdateReply(reply.replyNo)}>
                    수정
                  </Btn>
                  <Btn type="button" onClick={handleCancelEdit}>
                    취소
                  </Btn>
                </div>
              </CommentUpdate>
            ) : (
              <div style={{ padding: '5px 10px 0' }}>{reply.replyContent}</div>
            )}
          </CommentSelect>
        ))}
      </CommentSelectBox>
    </Page>
  );
};

const MenuBox = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  > ul {
    display: none;
    position: absolute;
    top: 104%;
    right: 0;
    padding: 10px 10px 0px 10px;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.base};
    z-index: 1;
    > li {
      display: flex; /* 이 줄 추가 */
      align-items: center;
      min-width: 70px;
      cursor: pointer;
      margin-bottom: 10px;
      > img {
        margin-right: 5px;
      }
      > a,
      button {
        padding: 0;
        color: black;
        font-weight: ${({ theme }) => theme.fontWeights.medium};
        &:hover {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
  &:hover ul {
    display: block;
  }
  > img {
    width: min-content;
  }
`;

const LinkLi = styled(Link)`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: center;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const CommentBox = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[4]};
  padding: 10px;
`;
const CommentInput = styled.input`
  flex-grow: 1;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 4px;
`;

const CommentUpdate = styled.div`
  > input {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.gray[4]};
    border-radius: 4px;
    padding: 4px;
  }
  > div {
    margin-right: auto;
    > button {
      margin-top: 6px;
      margin-right: 6px;
    }
  }
`;
const CommentButton = styled.button`
  width: 100px;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 5px;
`;

const CommentEx = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin: 0 10px;
  padding: 10px;
  > span {
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.light};
  }
`;
const CommentSelectBox = styled(PageBody)`
  margin-bottom: 40px;
  > div {
    display: flex;
    justify-content: flex-start;
    > div {
      display: flex;
      justify-content: flex-start;
    }
  }
`;
const CommentSelect = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[4]};
  margin-top: 10px;
  padding: 10px 10px 0px 10px;
  > div {
    align-items: center;
  }
`;
export default CommunityDetail;
