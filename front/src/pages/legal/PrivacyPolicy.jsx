import React from 'react';
import {
  LegalWrap,
  LegalTitle,
  LegalContainer,
  LegalSubTitle,
  Hr,
  Bold,
  Contents,
  List,
  ListItem,
} from '../../styles/Legal.styles';

const PrivacyPolicy = () => {
  return (
    <LegalWrap>
      <LegalTitle>약관 및 정책</LegalTitle>
      <LegalContainer>
        <LegalSubTitle>개인정보처리방침</LegalSubTitle>
        <Hr />
        <Bold>개인정보처리방침</Bold>
        <Contents>
          본 약관은 주식회사 돌보미(이하 “회사”)가 회원에게 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리,
          의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Contents>
        <Bold>제1조 (개인정보의 이용목적)</Bold>
        <Contents>
          본 약관은 주식회사 돌보미(이하 “회사”)가 회원에게 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리,
          의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Contents>
        <Bold>제2조 (개인정보의 수집)</Bold>
        <Bold>회사는 회원가입, 상담, 매칭 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</Bold>
        <Bold>수집항목 : </Bold>
        <List>
          <ListItem>알아서 뭐하게</ListItem>
          <ListItem>알아서 뭐하게</ListItem>
          <ListItem>알아서 뭐하게</ListItem>
        </List>
      </LegalContainer>
    </LegalWrap>
  );
};

export default PrivacyPolicy;
