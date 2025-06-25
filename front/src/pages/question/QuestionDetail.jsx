import React from 'react';
import { Btn, Input, Page } from '../../styles/common/Board';
import { BoardMenu, MenuDiv, MenuLink, PageInfo, PageTitle, PageTop } from './style/Question.styles';
import styled from 'styled-components';

const QuestionDetail = () => {
  return (
    <Page>
      <PageInfo>
        <PageTop>
          <PageTitle> 1:1 문의사항 </PageTitle>
          <BoardMenu>
            <MenuLink to="/question/full">전체</MenuLink>
            <MenuLink to="/question/history">문의내역</MenuLink>
            <MenuDiv>문의하기</MenuDiv>
          </BoardMenu>
        </PageTop>
        <PageBody>
          <div>
            <div>유형</div>
            <select id="category">
              <option value="">기술적 문제</option>
              <option value="service">서비스 관련</option>
              <option value="">기타</option>
            </select>
          </div>
          <div>
            <div>제목</div>
            <Input type="text" />
          </div>
          <div>
            <div>내용</div>
            <Textarea name="" id="" />
          </div>
          <div>
            <div>파일 첨부</div>
            <img src="" alt="1" />
          </div>
          <div>
            <div></div>
            <Button>취소</Button>
            <Button>등록</Button>
          </div>
        </PageBody>
      </PageInfo>
    </Page>
  );
};

const PageBody = styled.div`
  padding: 20px 20px 0 20px;
  > div {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    > div {
      ${({ theme }) => theme.fontWi}
      min-width: 80px;
      padding-right: 10px;
    }
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  resize: none;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: 4px;
`;

const Button = styled(Btn)`
  margin-right: 10px;
`;
export default QuestionDetail;
