import React from 'react';
import {
  LegalWrap,
  LegalTitle,
  LegalContainer,
  Hr,
  Bold,
  List,
  LegalSubTitle,
  Contents,
  ListItem,
} from '../../styles/Legal.styles';

const TermsOfService = () => {
  return (
    <LegalWrap>
      <LegalTitle>약관 및 정책</LegalTitle>
      <LegalContainer>
        <LegalSubTitle>서비스이용약관</LegalSubTitle>
        <Hr />
        <Bold>간병 매칭 플랫폼 "돌보미" 이용약관</Bold>
        <Bold>제1조 (목적)</Bold>
        <Contents>
          본 약관은 주식회사 돌보미(이하 “회사”)가 회원에게 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리,
          의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Contents>
        <Bold>제2조 (용어의 정의)</Bold>
        <Bold>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</Bold>
        <List>
          <ListItem>
            “서비스”라 함은 회사가 운영하는 웹페이지 (https://www.dolbomi.io) 를 통하여 제공하는 서비스 일체를
            의미합니다.
          </ListItem>
          <ListItem>
            “회원”이라 함은 회원가입 절차를 완료한 자로서, 회사가 제공하는 서비스를 이용할 수 있는 자를 의미합니다.
          </ListItem>
          <ListItem>알아서 뭐하게</ListItem>
          <ListItem>알아서 뭐하게</ListItem>
          <ListItem>알아서 뭐하게</ListItem>
        </List>
        <Bold>제3조 (약관의 명시와 개정)</Bold>
        <List>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
          <ListItem></ListItem>
        </List>
      </LegalContainer>
    </LegalWrap>
  );
};

export default TermsOfService;
