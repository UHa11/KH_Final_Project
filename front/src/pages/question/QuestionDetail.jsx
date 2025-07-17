import { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import { commuService } from '../../api/community';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { BodyText, BodyTop, Btn, Page, PageBody, PageTop } from '../../styles/common/Board';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { Icons } from '../community/style/Community.styles';
import { Textarea } from './style/Question.styles';
import { getDownloadUrl } from '../../api/fileApi';
const QuestionDetail = () => {
  const userRole = useUserStore((state) => state.user?.userRole);
  const userNo = useUserStore((state) => state.user?.userNo);
  const userName = useUserStore((state) => state.user?.userName);
  const { boardNo } = useParams();

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [communityDetail, setCommunityDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [replyMode, setReplyMode] = useState('none');
  const handleCreateClick = () => {
    setReplyMode(replyMode === 'create' ? 'none' : 'create');
  };
  const handleUpdateClick = () => {
    if (communityDetail.reply?.length > 0) {
      setEditedContent(communityDetail.reply[0].replyContent);
    }
    setReplyMode(replyMode === 'update' ? 'none' : 'update');
  };

  const [editedContent, setEditedContent] = useState('');
  useEffect(() => {
    if (communityDetail?.reply?.length > 0) {
      setEditedContent(communityDetail.reply[0].replyContent);
    }
  }, [communityDetail]);

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
      }
    };

    loadCommunity();
  }, [boardNo, userRole]);

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
  const handleSaveReply = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const replyData = {
        board_no: boardNo,
        user_no: userNo,
        reply_content: editedContent,
      };

      await commuService.createReplyQusetion(replyData); // API 호출

      const updatedCommunity = await commuService.getCommunityDetail(boardNo); // 데이터만 다시 요청
      setCommunityDetail(updatedCommunity); // 상태 갱신
      setReplyMode('none'); // 작성 모드 종료
      setEditedContent(''); // 작성 내용 초기화
    } catch (error) {
      toast.error(error.message);
      const errorMessage = '등록에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReply = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const replyData = {
        reply_no: communityDetail.reply[0].replyNo,
        reply_content: editedContent,
      };

      await commuService.updateReply(replyData); // API 호출

      const updatedCommunity = await commuService.getCommunityDetail(boardNo); // 데이터만 다시 요청
      setCommunityDetail(updatedCommunity); // 상태 갱신
      setReplyMode('none'); // 작성 모드 종료
      setEditedContent(''); // 작성 내용 초기화
    } catch (error) {
      toast.error(error.message);
      const errorMessage = '등록에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
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

  const handleDownload = async (fileNo, fileName) => {
    try {
      const { presignedUrl } = await getDownloadUrl(fileNo);
      const response = await fetch(presignedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  return (
    <Page>
      <PageTop>
        <p>문의 게시판 상세</p>
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
              <button type="button" onClick={handleDeleteBoard}>
                삭제
              </button>
            ) : null}
          </div>
        </BodyTop>

        <BodyText>{communityDetail.boardContent}</BodyText>
        {communityDetail.files && communityDetail.files.length > 0 && (
          <FileBox>
            <p>파일 목록</p>
            {communityDetail.files && communityDetail.files.length > 0 ? (
              communityDetail.files.map((file) => (
                <div key={file.fileNo}>
                  <span>{file.fileName.split('/').pop()}</span> {/* 경로 제외한 파일명만 표시 */}
                  <button onClick={() => handleDownload(file.fileNo, file.fileName.split('/').pop())}>다운로드</button>
                </div>
              ))
            ) : (
              <EmptyMessage>첨부된 파일이 없습니다</EmptyMessage>
            )}
          </FileBox>
        )}
      </PageBody>
      <CommentSelectBox>
        <div style={{ gap: '6px', paddingLeft: '10px' }}>
          <div>
            <div style={{ fontWeight: theme.fontWeights.bold }}>답변</div>
            <div style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.bold }}>
              {communityDetail.questionStatus === 'Y' ? '완료' : '대기'}
            </div>
          </div>
          {userRole === 'ADMIN' && replyMode === 'none' && (
            <div>
              {communityDetail.questionStatus === 'Y' ? (
                <Btn type="button" onClick={handleUpdateClick}>
                  수정
                </Btn>
              ) : (
                <Btn type="button" onClick={handleCreateClick}>
                  작성
                </Btn>
              )}
            </div>
          )}
        </div>
        {replyMode !== 'none' && (
          <CommentSelect style={{ padding: '10px' }}>
            {replyMode === 'update' &&
              communityDetail.reply.map((reply) => (
                <div key={reply.replyNo} style={{ width: '100%', gap: '8px' }}>
                  <Icons src="/src/assets/icons/icon_작성자.png" alt="" />
                  <div>{reply.userName}</div>
                  <div>{reply.updateDate}</div>
                  <div style={{ marginLeft: 'auto' }}>
                    <Btn type="button" onClick={handleUpdateReply}>
                      수정
                    </Btn>
                    <Btn type="button" style={{ margin: '0 10PX' }} onClick={handleUpdateClick}>
                      취소
                    </Btn>
                  </div>
                </div>
              ))}
            {replyMode === 'create' && (
              <div style={{ width: '100%', gap: '8px' }}>
                <Icons src="/src/assets/icons/icon_작성자.png" alt="" />
                <div>{userName}</div>
                <div style={{ marginLeft: 'auto' }}>
                  <Btn type="button" onClick={handleSaveReply}>
                    작성
                  </Btn>
                  <Btn type="button" style={{ margin: '0 10PX' }} onClick={handleCreateClick}>
                    취소
                  </Btn>
                </div>
              </div>
            )}

            <Textarea
              style={{ marginTop: '10px' }}
              as="textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </CommentSelect>
        )}
        {replyMode === 'none' &&
          communityDetail.reply?.map((reply) => (
            <CommentSelect key={reply.replyNo}>
              <div style={{ width: '100%', gap: '8px' }}>
                <Icons src="/src/assets/icons/icon_작성자.png" alt="" />
                <div>{reply.userName}</div>
                <div>{reply.updateDate}</div>
              </div>
              <div style={{ textAlign: 'left', padding: '5px 10px 0' }}>{reply.replyContent}</div>
            </CommentSelect>
          ))}
      </CommentSelectBox>
    </Page>
  );
};

const FileBox = styled.div`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: 10px;
  margin-top: 10px;
  * {
    border-radius: ${({ theme }) => theme.borderRadius.base};
  }
  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
  > p {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-right: auto;
    padding: 0 10px 10px;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.gray[6]};
    padding: 10px;
    > span {
      color: ${({ theme }) => theme.colors.gray[3]};
    }
    > button {
      font-size: ${({ theme }) => theme.fontSizes.sm};
      color: ${({ theme }) => theme.colors.primary};
      background: transparent;
      border: 1px solid ${({ theme }) => theme.colors.primary};
      cursor: pointer;
      transition: all 0.2s;
      padding: 8px 20px;

      &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.white};
      }
    }
  }
  > span {
    width: 100%;
    color: ${({ theme }) => theme.colors.gray[3]};
    background-color: ${({ theme }) => theme.colors.gray[6]};
    padding: 10px;
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

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6c757d;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 6px;
`;

export default QuestionDetail;
