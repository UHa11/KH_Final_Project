import React, { useState } from 'react';
import { Btn, Input, MenuBox, Page } from '../../styles/common/Board';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { commuService } from '../../api/community';
import useUserStore from '../../store/userStore';
import { getUploadUrl, uploadFileToS3 } from '../../api/fileApi';
const QuestionCreate = () => {
  //   const userId = useUserStore((state) => state.user?.userId);
  const userNo = useUserStore((state) => state.user?.userNo);

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [files, setFiles] = useState([]);

  const onSubmit = async (data) => {
    if (!data.boardTitle.trim() || !data.boardContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. 파일 먼저 S3 업로드
      const uploadedFileNames = [];
      for (const file of files) {
        const { presignedUrl, changeName } = await getUploadUrl(
          file.name,
          file.type,
          'image/' // 저장 경로는 커뮤니티 게시판용
        );
        await uploadFileToS3(presignedUrl, file);
        uploadedFileNames.push(changeName); // 업로드된 파일 경로 저장
      
      }

      // 2. 게시글 등록 (첨부파일 경로 포함)
      const questionData = {
        board_title: data.boardTitle,
        board_content: data.boardContent,
        user_no: userNo,
        role: 'Q',
        question_status: 'N',
        question_category: data.category,
        file_names: uploadedFileNames.length > 0 ? uploadedFileNames : [],
      };

      const response = await commuService.createQuestion(questionData);
     
      toast.success('등록되었습니다');
      navigate('/question/history');
    } catch (error) {
      console.error(error);
      const errorMessage = '등록에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      reset();
      setFiles([]);
    }
  };

  if (error) {
    return null;
  }
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList → 배열
    setFiles(selectedFiles);
  };

  return (
    <Page>
      <MenuBox>
        <p> 1:1 문의사항 </p>
        <div>
          <Link to="/question/full">전체</Link>
          <Link to="/question/history">문의내역</Link>
          <div>문의하기</div>
        </div>
      </MenuBox>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageBody>
          <div>
            <div>유형</div>
            <select {...register('category')}>
              <option value="T">기술적 문제</option>
              <option value="S">서비스 관련</option>
              <option value="E">기타</option>
            </select>
          </div>
          <div>
            <div>제목</div>
            <Input type="text" placeholder="제목을 입력하세요" {...register('boardTitle')} disabled={isSubmitting} />
          </div>
          <div>
            <div>내용</div>
            <Textarea as="textarea" {...register('boardContent')} disabled={isSubmitting} />
          </div>
          <div>
            <div>파일 첨부</div>
            <input type="file" multiple onChange={handleFileChange} />
          </div>
          <div>
            <div></div>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li> // 파일 이름 출력
              ))}
            </ul>
          </div>
          <div>
            <div></div>
            <Button type="button">취소</Button>
            <Button type="submit">등록</Button>
          </div>
        </PageBody>
      </form>
    </Page>
  );
};

const PageBody = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[3]};
  padding: 20px 20px 0 20px;
  > div {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;

    > div {
      min-width: 80px;
      padding-right: 10px;
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
    }
    > select {
      border-radius: ${({ theme }) => theme.borderRadius.md};
      padding: 5px;
    }
    > ul {
      display: flex;
      flex-direction: column;
    }
  }
`;
export const Textarea = styled(Input)`
  width: 100%;
  min-height: 200px;
  resize: none;
`;

const Button = styled(Btn)`
  margin-right: 10px;
  padding: 8px 20px;
`;
export default QuestionCreate;
