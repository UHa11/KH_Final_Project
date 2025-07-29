# Dolbomi
React와 Spring Boot를 활용한 프리랜서 간병인 매칭 플랫폼 입니다.

## 프로젝트 개요
- 개발 기간 : 2025-05-26 ~ 2025-07-18
- 서비스 링크 : [https://dolbomi.store]
- ERD 링크 : [https://www.erdcloud.com/d/HTCDdcZYkbS85dgp4]
- 본 프로젝트의 구조를 더 자세히 알고 싶다면?
  - [백엔드 README](./back/README.md)
  - [프론트엔드 README](./front/README.md)

## 기술 스택

Front-End  
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/>
<img src="https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white"/>
<img src="https://img.shields.io/badge/Zustand-000000?style=flat-square&logoColor=white"/>
<img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white"/>

Back-End  
<img src="https://img.shields.io/badge/Java-007396?style=flat-square&logo=openjdk&logoColor=white"/>
<img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white"/>
<img src="https://img.shields.io/badge/Spring%20Data%20JPA-007396?style=flat-square&logo=hibernate&logoColor=white"/>
<img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white"/>

Infra / DevOps  
<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white"/>
<img src="https://img.shields.io/badge/Tomcat-F8DC75?style=flat-square&logo=apachetomcat&logoColor=black"/>
<img src="https://img.shields.io/badge/AWS%20EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white"/>
<img src="https://img.shields.io/badge/AWS%20S3-569A31?style=flat-square&logo=amazons3&logoColor=white"/>
<img src="https://img.shields.io/badge/CloudFront-FF9900?style=flat-square&logo=amazoncloudfront&logoColor=white"/>
<img src="https://img.shields.io/badge/AWS%20RDS-527FFF?style=flat-square&logo=amazonrds&logoColor=white"/>

Communication / IDE  
<img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/Trello-0052CC?style=flat-square&logo=trello&logoColor=white"/>
<img src="https://img.shields.io/badge/VSCode-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white"/>
<img src="https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=flat-square&logo=intellijidea&logoColor=white"/>

## 사용 라이브러리및 API
### Front-End
- react
- zustand
- react-router-dom
- react-hook-form
- yup
- axios
- styled-component
- @mui/material
- @emotion/react / @emotion/styled
- date-fns
- dayjs
- react-draggable
- react-datepicker
- react-textarea-autosize
- react-icons
- react-spinners
- react-js-pagination
- react-toastify
- dotenv
- js-cookie

### Back-End
- spring boot  
- spring security  
- jjwt (io.jsonwebtoken)  
- spring data jpa  
- mysql connector  
- spring boot devtools  
- spring validation  
- thymeleaf  
- spring mail  
- spring boot oauth2  
- amazon aws sdk (s3)  
- spring ai
- lombok

### API
- Google Oauth 2.0 API : 소셜 로그인 인증
- Sgis Open API : 지역명 조회
- Kakao map API : 주소 검색
- OpenAI GPT-4 API : 돌보미 AI 가이드 자연어 대화 처리

## 설치 및 실행 방법
```
git clone https://github.com/UHa11/KH_Final_Project.git

# 프론트
cd frontend
npm install
npm dev run

# 백엔드
cd backend
./gradlew bootRun
```
## 주요 기능
- 회원가입(Email 인증)
- 로그인 (JWT 기반)
- 매칭기능
- 건강관리기능
- 구인/구직 기능
- 소통기능(채팅/게시판)

## 부가 기능
- 소셜 로그인 (구글)
- 비밀번호 찾기
- 반응형 웹UI
- AI 웹 사용가이드

## 팀원 소개
| 이름 | 포지션 | Contact |
| --- | --- | --- |
| 백승환 | Team Leader | tmdghks605@gmail.com |
| 이지묵 | Database Manager | leezi0916@gmail.com |
| 김진석 | Issue Manager | wlstjr2015@gmail.com |
| 김유하 | Configuration Manager | extramin93@gmail.com |
| 이인혜 | Schedule Manager | ashes999@gmail.com |
