# ⭐️ 백엔드 (Spring Boot) ⭐️

## 프로젝트 구조
- controller : REST API 요청을 처리하는 웹 레이어
- service : 비즈니스 로직을 담당하는 서비스 레이어
- repository : 데이터베이스 접근 및 쿼리 수행
- domain : JPA 엔티티 클래스 및 도메인 모델
- dto : 데이터 전송 객체 (Request/Response)
- auth : 인증 및 인가 관련 코드 (JWT 토큰 처리 등)
- aspect : AOP 관련 코드 (로깅 등 공통 관심사 분리)
- config : 스프링 및 보안 설정 클래스
- exception : 사용자 정의 예외 처리

## API 명세

### 전체 ERD 
<img width="1478" height="545" alt="스크린샷 2025-07-31 오후 5 20 34" src="https://github.com/user-attachments/assets/c519361b-b4f3-4c82-a232-41b55f3b1976" />

<hr/>

### USERS (회원)
<img width="800" height="385" alt="스크린샷 2025-07-31 오후 5 27 22" src="https://github.com/user-attachments/assets/2370056a-50e1-4e85-a9fc-5730d59d9523" />

<p>목적 : 보호자 또는 간병인 공통 회원 정보를 저장합니다.</p>


| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| POST | /users/v1 | 회원가입 (등록) |
| POST | /users/v1/login | 로그인 |
| GET | /users/v1/me | 내 정보 조회 |
| GET | /users/v1?user_no={userNo} | 특정 회원 조회 (userNo 기준) |
| GET | /users/v1?user_id={userId} | 특정 회원 조회 (userId 기준) |
| PATCH | /users/v1/{userNo} | 회원 정보 수정 |
| DELETE | /users/v1/{userNo}/delete | 회원 탈퇴 |
| GET | /users/v1/check | 아이디 중복 검사 |
| GET | /users/v1/user-counts | 회원 수 조회 |
| POST | /users/v1/reset_password | 비밀번호 초기화 이메일 발송|
| PATCH | /users/v1/{userNo}/change-password | 비밀번호 변경 |
| GET | /users/v1?user_no={userNo} | 간병인 프로필 조회 |

<hr/>

### COMMUNITY (게시판)
<img width="1160" height="478" alt="스크린샷 2025-07-31 오후 5 33 42" src="https://github.com/user-attachments/assets/cb1a8947-bf0e-44d8-b07f-87099e5880f1" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /community/v1/caregiver | 간병인 게시판 리스트 조회 (option, keyword, page, size) |
| GET | /community/v1/guardian | 보호자 게시판 리스트 조회 (option, keyword, page, size) |
| GET | /community/v1/detail?board_no={boardNo} | 게시글 상세 조회 |
| POST | /community/v1/reply | 댓글 등록 |
| POST | /community/v1/reply/question | 질문 댓글 등록 |
| GET | /community/v1/question | 질문 게시판 조회 (option, keyword, page, size) |
| GET | /community/v1/question?user_no={userNo} | 특정 유저 질문 게시판 조회 (option, keyword, page, size) |
| POST | /community/v1/question/create | 질문 게시글 등록 |
| DELETE | /community/v1/delete?boardNo={boardNo} | 게시글 삭제 |
| DELETE | /community/v1/reply_delete?replyNo={replyNo} | 댓글 삭제 |
| PATCH | /community/v1/update | 게시글 수정 |
| PATCH | /community/v1/update_reply | 댓글 수정 |

<hr/>

### REVIEWS (리뷰)
<img width="633" height="171" alt="스크린샷 2025-07-31 오후 5 34 58" src="https://github.com/user-attachments/assets/5ad22f9f-ced5-4f55-8f6e-7051fcc09b64" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /review/v1/simple-list | 간단 리뷰 리스트 조회 |
| GET | /review/v1/list?page={page}&userNo={userNo} | 리뷰 리스트 조회 |
| GET | /review/v1/detail?page={page}&resumeNo={resumeNo} | 리뷰 상세 조회 |
| DELETE | /review/v1/delete?reviewNo={reviewNo} | 리뷰 삭제 |

<hr/>

### HIRING (구인 공고)
<img width="930" height="494" alt="스크린샷 2025-07-31 오후 5 36 39" src="https://github.com/user-attachments/assets/2b0642ab-d010-4221-9b2d-fbb10924fa91" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /hiring/v1/simple-list | 간단 구인 리스트 조회 |
| GET | /hiring/v1/list | 구인 리스트 조회 |
| GET | /hiring/v1/my-list?page={page}&userNo={userNo} | 내 구인 리스트 조회 |
| GET | /hiring/v1/{hiringNo} | 구인 상세 조회 |
| GET | /hiring/v1/{hiringNo}/status | 구인 상태 조회 |
| PATCH | /hiring/v1/{hiringNo} | 구인 글 삭제 혹은 상태 변경 |

<hr/>

### RESUME (이력서)
<img width="931" height="316" alt="스크린샷 2025-07-31 오후 5 37 02" src="https://github.com/user-attachments/assets/bd2f514c-6d70-484d-8cf9-138d11e3a4b0" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /resume/v1/simple-list | 간단 이력서 리스트 조회 |
| GET | /resume/v1/list | 이력서 리스트 조회 |
| GET | /resume/v1/detail/{resumeNo} | 이력서 상세 조회 |
| GET | /resume/v1/user?page={page}&userNo={userNo} | 내 이력서 리스트 조회 |
| GET | /resume/v1/user/all?userNo={userNo} | 내 이력서 모두 조회 (모달용)|
| PATCH | /resume/v1/{resumeNo} | 이력서 수정 |

<hr/>

### PATIENT (환자)
<img width="974" height="405" alt="스크린샷 2025-07-31 오후 5 37 28" src="https://github.com/user-attachments/assets/bd376263-3095-4e01-8868-fc2802048b98" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /patient/v1?guardian_no={guardianNo} | 환자 리스트 조회 (보호자 기준) |
| GET | /patient/v1/{patNo} | 환자 상세 조회 |
| PATCH | /patient/v1/{patNo} | 환자 정보 수정 |

<hr/>

### DISEASE (질병)
<img width="785" height="413" alt="스크린샷 2025-07-31 오후 5 38 19" src="https://github.com/user-attachments/assets/38026f7f-3d14-41dd-ae00-85ba6cde1c67" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /disease/v1 | 질병 리스트 조회 |
| GET | /patients/v1?disNo={disNo} | 특정 질병 상세 조회 |

<hr/>

### REPORT (보고서)
<img width="580" height="200" alt="스크린샷 2025-07-31 오후 5 38 45" src="https://github.com/user-attachments/assets/87884756-4e93-404d-8a2f-87be12690940" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /report/v1/{patNo} | 환자 보고서 리스트 조회 |
| GET | /report/v1/detail/{reportNo} | 보고서 상세 조회 

<hr/>  

### PROPOSER (신청자)
<img width="767" height="202" alt="스크린샷 2025-07-31 오후 5 39 22" src="https://github.com/user-attachments/assets/82503a2f-c3d3-46de-b88a-9ad354ad2e57" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /proposer/v1?hiring_no={hiringNo} | 공고별 신청자 리스트 조회 |
| GET | /proposer/v1/my-list?page={page}&userNo={userNo} | 내 신청 리스트 조회 |
| GET | /proposer/v1/check?hiring_no={hiringNo}&caregiver_no={caregiverNo} | 신청 상태 확인 |
| DELETE | /proposer/v1/cancel?hiring_no={hiringNo}&caregiver_no={caregiverNo} | 신청 취소 |
| POST | /proposer/v1/accept | 신청 수락 |
| GET | /proposer/v1/accept/check?hiring_no={hiringNo}&resume_no={resumeNo} | 수락 여부 확인 |
| DELETE | /proposer/v1/{proposerNo} | 신청 기록 삭제 |
| GET | /proposer/v1/hiring/{hiringNo}/owner | 구인 공고 주인 조회 |

<hr/>

### MATCHING (매칭)
<img width="743" height="256" alt="스크린샷 2025-07-31 오후 5 39 56" src="https://github.com/user-attachments/assets/30104971-5197-4707-8f81-1dd6e446d219" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /matching/v1?pat_no={patNo}&status={status} | 환자 매칭 리스트 조회 |
| PATCH | /matching/v1?mat_no={matNo}&status={status} | 매칭 상태 변경 |
| GET | /matching/v1/matched?pat_no={patNo}&status={status} | 완료된 매칭 리스트 조회 |
| GET | /matching/v1/caregiver?caregiver_no={caregiverNo}&status={status} | 간병인 매칭 리스트 조회 |
| GET | /matching/v1/caregiver/matched?caregiver_no={caregiverNo}&status={status} | 완료된 간병인 매칭 리스트 조회 |
| GET | /matching/v1/matched/check | 매칭 상태 체크 |
| GET | /matching/v1/matched/date | 매칭 날짜 리스트 조회 |

<hr/>

### NOTIFICATIONS (알림)
<img width="852" height="231" alt="스크린샷 2025-07-31 오후 5 40 23" src="https://github.com/user-attachments/assets/e4c905a7-48fb-4653-acf5-d5b406b1c035" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /notifications/v1/list?user_no={userNo} | 사용자 알림 리스트 조회 |
| GET | /notifications/v1/unread-count?user_no={userNo} | 안 읽은 알림 개수 조회 |
| PATCH | /notifications/v1/mark-read?user_no={userNo} | 알림 읽음 처리 |
| DELETE | /notifications/v1/delete-all?user_no={userNo} | 전체 알림 삭제 |
| DELETE | /notifications/v1/{notificationNo} | 특정 알림 삭제 |

<hr/>

### API (주소)
| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /api/address/region?cd={cd} | 시/도/구 등 행정구역 조회 |
| GET | /api/address/region | 시/도 리스트 조회 |

<hr/>

### EMAIL (이메일 인증)
<img width="622" height="166" alt="스크린샷 2025-07-31 오후 5 41 12" src="https://github.com/user-attachments/assets/c4ce3a25-df06-4303-80b2-a3fed0aca377" />

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| POST | /auth/email/send-reset-link | 비밀번호 초기화 링크 이메일 발송 |
| POST | /auth/email/send-code | 이메일 인증 코드 발송 |
| POST | /auth/email/verify | 이메일 인증 코드 검증 |

<hr/>

### AI
| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /ai?pat_no={patNo} | AI 연동 환자 정보 요청 |

<hr/>

## 환경 변수
| 변수 경로                          | 설명                                 | 예시 또는 값 예시                                                                 |
|-----------------------------------|--------------------------------------|-----------------------------------------------------------------------------------|
| spring.datasource.url             | 데이터베이스 연결 URL                 | jdbc:mysql://localhost:#/dolbomi?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8 |
| spring.datasource.username        | DB 사용자명                          | user01                                                                            |
| spring.datasource.password        | DB 비밀번호                          | pass01                                                                            |
| spring.datasource.driver-class-name | DB 드라이버 클래스명                | com.mysql.cj.jdbc.Driver                                                          |
| spring.jpa.hibernate.ddl-auto     | JPA 자동 테이블 생성/수정 정책       | update (개발환경) / validate (운영환경)                                          |
| jwt.secret                        | JWT 토큰 서명에 사용하는 비밀 키     | Base64 인코딩된 긴 문자열                                                        |
| jwt.expiration                    | JWT 토큰 만료 시간 (분 단위)         | 3000 (예: 3000분)                                                                 |
| spring.mail.host                  | SMTP 메일 서버 호스트                | smtp.gmail.com                                                                    |
| spring.mail.port                  | SMTP 메일 서버 포트                  | 587                                                                               |
| spring.mail.username              | SMTP 로그인 사용자명                 | 이메일 주소 (예: dolbomi@gmail.com)                                             |
| spring.mail.password              | SMTP 로그인 비밀번호                 | 이메일 비밀번호 또는 앱 비밀번호                                                 |
| aws.region                        | AWS 리전                             | ap-northeast-2                                                                    |
| aws.credentials.access-key        | AWS 접근 키                          | AWS Access Key                                                                    |
| aws.credentials.secret-key        | AWS 비밀 키                          | AWS Secret Key                                                                    |
| ai.openai.api-key                 | OpenAI GPT API 키                    | sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx                         |

