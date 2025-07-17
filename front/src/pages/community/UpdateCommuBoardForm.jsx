import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { Page } from '../../styles/common/Board';
import { BodyTop, FileBox, Icons, Left, PageBody, PageTitle, PageTop } from './style/Community.styles';
import { commuService } from '../../api/community';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import profileImage from '../../assets/images/cargiver.png'; // 프로필 이미지 경로
import { getUploadUrl, uploadFileToS3 } from '../../api/fileApi';
const UpdateCommuBoardForm = () => {
  const userNo = useUserStore((state) => state.user?.userNo);
  const userName = useUserStore((state) => state.user?.userName);
  const { boardNo } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 삭제한 기존 파일 번호 저장
  const [deletedFileNos, setDeletedFileNos] = useState([]);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const community = await commuService.getCommunityDetail(boardNo);
        setData(community);
        reset({
          boardTitle: community.boardTitle,
          boardContent: community.boardContent,
        });
        if (community.userNo !== userNo) {
          toast.error('작성자만 수정 가능합니다.');
          navigate(-1);
        }
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
  }, [boardNo, reset, userNo, navigate]);

  if (loading) {
    return (
      <div>
        <ClipLoader size={50} aria-label="Loading Spinner" />
      </div>
    );
  }

  const onSubmit = async (updateData) => {
    if (!updateData.boardTitle.trim() || !updateData.boardContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      setIsSubmitting(true);

      // 1) 새로 올린 이미지가 있다면 S3 업로드 후 이름 받아오기
      const newImageNames = [];
      for (const img of images) {
        const file = img.file;
        const { presignedUrl, changeName } = await getUploadUrl(file.name, file.type, 'image/');
        await uploadFileToS3(presignedUrl, file);
        newImageNames.push(changeName);
      }

      // 2) 기존 이미지 중 삭제하지 않은 이미지명 배열 준비
      const existingImageNames = data.files.map((file) => file.fileName);
      // (삭제 기능 넣으면 삭제된 건 제외하세요)

      // 3) 최종 이미지명 리스트
      const image_names = [...existingImageNames, ...newImageNames];

      const boardData = {
        board_no: data.boardNo,
        board_title: updateData.boardTitle,
        board_content: updateData.boardContent,
        image_names,
        deleted_file_nos: deletedFileNos,
      };

      const response = await commuService.updateCommunity(boardData);

      toast.success('수정되었습니다');
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error('수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  //
  //이미지 관련
  const handleClick = () => {
    fileInputRef.current.click(); // 숨겨진 input을 클릭
  };
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));
    setImages((prev) => [...prev, ...newImages]);

    e.target.value = '';
  };

  // 기존 파일 삭제는 서버에 요청하거나 삭제할 파일 목록 관리 필요

  // 기존 파일 삭제
  const handleDeleteExistingFile = (fileNo) => {
    setDeletedFileNos((prev) => [...prev, fileNo]);
    setData((prevData) => ({
      ...prevData,
      files: prevData.files.filter((file) => file.fileNo !== fileNo),
    }));
  };

  // 새로 추가한 파일은 상태에서 제거
  const handleDeleteNewFile = (id) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== id);
    });
  };
  //여기까지 이미지 관련

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path) => {
    if (!path) return profileImage; // 기본 이미지
    const cleanPath = path.replace(/^\//, ''); // 앞에 / 있으면 제거
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  if (error) {
    return null;
  }

  return (
    <Page>
      <PageTop>
        {data.role === 'C' ? <PageTitle>간병 게시판 수정</PageTitle> : <PageTitle>보호자 게시판 수정</PageTitle>}
      </PageTop>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageBody>
          <TitleInput type="text" placeholder="제목을 입력하세요" {...register('boardTitle')} disabled={isSubmitting} />
          <Top>
            <Icons src="/src/assets/icons/icon_작성자.png" alt="" />
            <Left style={{ fontSize: theme.fontSizes.sm }}>{userName}</Left>
          </Top>
          <div style={{ padding: '10px' }}>
            <TextInput
              as="textarea"
              placeholder="내용을 입력하세요"
              rows={10}
              {...register('boardContent')}
              disabled={isSubmitting}
            />
          </div>
          <FileBox>
            <div>
              <img src="/src/assets/icons/icon_사진.png" alt="" />
              <p>사진</p>
            </div>
            <div>
              {/* 기존 업로드된 이미지 */}
              {data?.files?.map((img) => (
                <div key={img.fileNo} className="file-card">
                  <button type="button" onClick={() => handleDeleteExistingFile(img.fileNo)}>
                    x
                  </button>
                  <img src={getProfileImageUrl(img.fileName)} alt="preview" />
                </div>
              ))}
              {/* 새로 업로드한 이미지 미리보기 */}
              {images.map((img) => (
                <div key={img.id} className="file-card">
                  <button type="button" onClick={() => handleDeleteNewFile(img.id)}>
                    x
                  </button>
                  <img src={img.preview} alt="preview" />
                </div>
              ))}
              <div className="file-button">
                <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleFilesChange} />
                <button onClick={handleClick} type="button">
                  +
                </button>
              </div>
            </div>
          </FileBox>
          <BtnBox>
            <button type="button" onClick={() => navigate(-1)}>
              이전으로
            </button>
            <button type="submit">등록하기</button>
          </BtnBox>
        </PageBody>
      </form>
      <PageEndBox>
        <span>
          • 개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법정보 유포 시 이에 대한 민형사상 책임은 작성자에게
          있습니다
        </span>
        <span>
          • 개인정보가 포함되거나 부적절한 답변은 비노출 또는 해당 서개인정보를 공유 및 요청하거나, 명예 훼손, 무단
          광고, 불법 정보 유포 시 이에 대한 민형사상 책임은 작성자에게 있습니다.
        </span>
        <span>• 개인정보가 포함되거나 부적절한 글은 비노출 또는 서비스 이용 정지 사유가 될 수 있습니다.</span>
        <span>• 인기 글로 추천될 수 있습니다.비스 이용 불가 처리될 수 있습니다</span>
      </PageEndBox>
    </Page>
  );
};

const Top = styled(BodyTop)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: 0 10px 10px;
`;
const TextInput = styled.input`
  width: 100%;
  min-height: 200px;
  resize: none;
`;

const InputFile = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;
const ImgBox = styled.div`
  width: calc(100% / 4);
  aspect-ratio: 4 / 3;
  padding: 0 10px 10px 0px;
  position: relative;
  display: inline-block;
  > button {
    display: none;
    position: absolute;
    width: 100%;
    aspect-ratio: 4 / 3;
    padding: 0 10px 10px 0px;
    color: wheat;
    font-size: xx-large;
  }
  &:hover button {
    display: block;
  }
`;
const FileButton = styled.button`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.gray[4]};
  color: ${({ theme }) => theme.colors.white};
  font-size: xx-large;
  font-weight: 500;
`;
const BtnBox = styled.div`
  width: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[4]};
  > button {
    align-content: center;
    width: 100px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-radius: 4px;
    margin: 10px 10px 0px 10px;
  }
`;

const PageEndBox = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;

  > span {
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.light};
  }
`;

export default UpdateCommuBoardForm;
