# ⭐️ 돌보미 프론트엔트 ⭐️

## 프로젝트 구조
- api : 외부 API 호출 관련 모듈 (예: 구글 로그인, 카카오맵 등)
- assets : 이미지, 아이콘 등 정적 파일
- components : 재사용 가능한 공통 UI 컴포넌트 (버튼, 모달 등)
- config : 환경 설정 파일 (예: API Base URL, 토큰 설정 등)
- hooks :  커스텀 훅(Custom Hook) 정의 
- store : 상태 관리 관련 코드
- styles : 전역 스타일 및 공통 CSS, SCSS 파일
- utils : 유틸 함수 모음 (예: 변수명 변환 등)

## 주요 페이지

### 로그인 및 회원가입 페이지
  <img width="649" height="661" alt="로그인" src="https://github.com/user-attachments/assets/a2bdeae6-3f0e-4154-93fd-125e798429e0" />
  <img width="616" height="672" alt="회원가입" src="https://github.com/user-attachments/assets/6d1d1c14-12fc-4179-ba27-0d08afad0d87" />
  <p> 이메일 또는 구글 계정으로 회원가입 및 로그인 기능 제공 </p>
<hr/>

### 개인정보 페이지
  <img width="477" height="512" alt="마이페이지 수정" src="https://github.com/user-attachments/assets/84bb07e0-0909-4f26-b3c6-f447f0e5717f" />
  <p> 이름, 연락처, 주소, 자격증 등 개인정보 및 비밀번호 수정 기능 제공 </p>
<hr/>

### 구인목록 및 구인상세페이지
  <img width="918" height="739" alt="구인글 모집리스트" src="https://github.com/user-attachments/assets/613dbebc-9bf2-4dc4-845a-9b544c24a8dc" />
  <img width="500" height="768" alt="구인 상세" src="https://github.com/user-attachments/assets/f89281d6-2427-477d-a9e3-3acd613d317c" />
  <p> 등록된 구인글 목록 조회 및 상세 확인, 간병인 지원 현황 확인 기능 제공 </p>
<hr/>

### 구직목록 및 구직상세페이지
  <img width="901" height="738" alt="구직글 모집리스트" src="https://github.com/user-attachments/assets/1b0fbc2b-a6e6-4f1b-b305-675d2e3a77af" />
  <img width="1004" height="1394" alt="image" src="https://github.com/user-attachments/assets/b1072f83-4b33-4479-97f1-b5cfe4d3d40f" />
  <p> 간병인이 등록한 이력서 목록 확인 및 상세 정보 확인, 구인글 지원 기능 제공 </p>
<hr/>

### 매칭 페이지
  <img width="1286" height="478" alt="image" src="https://github.com/user-attachments/assets/bbeeef5f-2b44-4ca5-a8f5-ef6ee8dc4225" />
  <p> 매칭된 간병인 및 보호자 정보를 확인하고, 간병일지 작성 또는 간병 종료 처리 기능 제공 </p>
<hr/>

### 건강관리페이지
  <img width="1008" height="554" alt="image" src="https://github.com/user-attachments/assets/10e3d274-599c-4cfa-a8f5-2d0ce0dab9d2" />
  <img width="1016" height="708" alt="image" src="https://github.com/user-attachments/assets/2353a51e-d4bd-48f8-883e-fa4f6e0fd143" />
  <p> 간병인이 매칭된 돌봄 대상자에 대해 일지를 작성하고 관리할 수 있는 기능 제공 </p>
<hr/>

### 게시판 페이지
  <img width="1022" height="372" alt="image" src="https://github.com/user-attachments/assets/b9cc226c-f08a-463e-ad91-d972ebe60022" />
  <img width="956" height="562" alt="image" src="https://github.com/user-attachments/assets/8adc1b29-dbcb-496b-ad28-9144fd56a468" />
  <p> 간병인·보호자 커뮤니티 공간으로, 게시글 작성·조회·검색·수정 기능 제공 </p>
<hr/>

## 환경 변수
- .env 파일에서 API 서버 주소 설정
