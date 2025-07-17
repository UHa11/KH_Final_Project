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
          <ListItem>“간병인”이라 함은 돌보미 서비스를 통해 간병 서비스를 제공하는 자를 의미합니다.</ListItem>
          <ListItem>“보호자”라 함은 돌봄이 필요한 대상자를 대신하여 서비스를 이용하는 자를 의미합니다.</ListItem>
          <ListItem>“이용계약”이라 함은 회원과 회사 간에 서비스를 이용하기 위하여 체결하는 계약을 의미합니다.</ListItem>
        </List>
        <Bold>제3조 (약관의 명시와 개정)</Bold>
        <List>
          <ListItem>
            회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면 또는 별도의 연결 화면에 게시합니다.
          </ListItem>
          <ListItem>회사는 관련 법령을 준수하며, 필요한 경우 본 약관을 개정할 수 있습니다.</ListItem>
          <ListItem>
            약관이 개정될 경우, 회사는 개정 사항과 시행일을 명시하여 이메일, 문자 등의 방법으로 회원에게 알립니다.
          </ListItem>
          <ListItem>
            회원이 개정된 약관에 동의하지 않을 경우, 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.
          </ListItem>
          <ListItem>
            개정된 약관은 공지한 시행일로부터 효력을 발생하며, 시행일 이후 서비스 이용 시 약관에 동의한 것으로
            간주됩니다.
          </ListItem>
        </List>
      </LegalContainer>
    </LegalWrap>
  );
};

export default TermsOfService;
