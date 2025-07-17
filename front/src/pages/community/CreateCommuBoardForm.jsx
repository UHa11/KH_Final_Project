import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import theme from '../../styles/theme';
import styled from 'styled-components';
import { Page } from '../../styles/common/Board';
import { BodyTop, FileBox, Icons, Left, PageBody, PageTitle, PageTop } from './style/Community.styles';
import { commuService } from '../../api/community';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getUploadUrl, uploadFileToS3 } from '../../api/fileApi';

const CreateCommuBoardForm = () => {
  const userNo = useUserStore((state) => state.user?.userNo);
  const userName = useUserStore((state) => state.user?.userName);
  const { role } = useParams();

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (!data.boardTitle.trim() || !data.boardContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      setIsSubmitting(true);

      const uploadedImageNames = [];
      for (const img of images) {
        const file = img.file;
        try {
          // 1. Presigned URL 요청
          const { presignedUrl, changeName } = await getUploadUrl(
            file.name,
            file.type,
            'image/' // 저장 경로는 커뮤니티 게시판용
          );

          // 2. 파일 S3 업로드
          await uploadFileToS3(presignedUrl, file);

          // 3. 업로드 완료된 파일 이름 저장
          uploadedImageNames.push(changeName);
        } catch (uploadError) {
          console.error('이미지 업로드 실패:', uploadError);
          toast.error('이미지 업로드에 실패했습니다.');
          // continue하지 말고 중단
          setIsSubmitting(false);
          return;
        }
      }
      const boardData = {
        board_title: data.boardTitle,
        board_content: data.boardContent,
        image_names: uploadedImageNames,
        user_no: userNo,
        role: role,
      };
      const response = await commuService.createCommunity(boardData);
     
      toast.success('등록되었습니다');
      if (role === 'C') navigate('/community/caregiver');
      else navigate('/community/guardian');
    } catch (error) {
      console.error(error);
      const errorMessage = '등록에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  //
  //이미지 관련
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
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
  const handleDelete = (id) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };
  //여기까지 이미지 관련

  if (error) {
    return null;
  }

  return (
    <Page>
      <PageTop>
        {role === 'C' ? <PageTitle>간병 게시판 등록</PageTitle> : <PageTitle>보호자 게시판 등록</PageTitle>}
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
              {images.map((img) => (
                <div key={img.id} className="file-card">
                  <button onClick={() => handleDelete(img.id)}>x</button>
                  <img src={img.preview} alt="preview" />
                </div>
              ))}
              <div className="file-button">
                <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleFilesChange} />
                <button type="button" onClick={handleClick}>
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

export default CreateCommuBoardForm;
