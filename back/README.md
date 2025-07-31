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
<img width="810" height="195" alt="스크린샷 2025-07-31 오후 6 03 54" src="https://github.com/user-attachments/assets/0bc26c11-4d2d-4c6a-a8d0-67d6b07b5ef2" />

<p><strong>목적:</strong> 보호자 또는 간병인 공통 회원 정보를 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>user_no</code>: 회원 식별을 위한 기본키</li>
  <li><code>id</code>, <code>password</code>, <code>name</code>, <code>phone</code>, <code>email</code>, <code>gender</code>: 공통 로그인 및 연락 정보</li>
  <li><code>role</code>: 사용자 역할 (e.g., 사용자 / 관리자 구분)</li>
  <li><code>address</code>, <code>birth</code>, <code>profile_image</code>: 추가 프로필 정보</li>
</ul>

<p><strong>특징:</strong> 회원의 공통 정보만 저장되며, 역할에 따라 추가 정보는 다른 테이블에 분리되어 있습니다.</p>
 


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

<p><strong>목적:</strong> 보호자 및 간병인을 위한 커뮤니티 게시판 글을 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>board_no</code>: 게시글 고유 번호 (PK)</li>
  <li><code>user_no</code>: 작성자 번호 (FK)</li>
  <li><code>role</code>: 게시글 유형 (G: 보호자, C: 간병인, Q: 질문)</li>
  <li><code>title</code>, <code>content</code>: 게시글 제목과 내용</li>
  <li><code>status</code>: 삭제 여부</li>
  <li><code>created_at</code>: 작성 일시</li>
</ul>

<p><strong>특징:</strong> Q&A, 자유 게시판 등 다양한 형태의 커뮤니티 활동 지원</p>

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

<p><strong>목적:</strong> 매칭 종료 후 보호자가 간병인에게 작성하는 리뷰를 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>review_no</code>: 리뷰 고유 번호 (PK)</li>
  <li><code>matching_no</code>: 매칭 번호 (FK)</li>
  <li><code>content</code>: 한 줄 리뷰 내용</li>
</ul>

<p><strong>특징:</strong> 매칭이 종료된 후 한 번만 작성 가능하며, 간병인의 평판에 반영됩니다.</p>

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /review/v1/simple-list | 간단 리뷰 리스트 조회 |
| GET | /review/v1/list?page={page}&userNo={userNo} | 리뷰 리스트 조회 |
| GET | /review/v1/detail?page={page}&resumeNo={resumeNo} | 리뷰 상세 조회 |
| DELETE | /review/v1/delete?reviewNo={reviewNo} | 리뷰 삭제 |

<hr/>

### HIRING (구인 공고)
<img width="930" height="494" alt="스크린샷 2025-07-31 오후 5 36 39" src="https://github.com/user-attachments/assets/2b0642ab-d010-4221-9b2d-fbb10924fa91" />

<p><strong>목적:</strong> 보호자가 등록하는 구인 공고를 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>hiring_no</code>: 공고 고유 번호 (PK)</li>
  <li><code>guardian_no</code>: 보호자 식별 번호 (FK)</li>
  <li><code>title</code>, <code>content</code>: 공고 제목과 설명</li>
  <li><code>max_applicants</code>: 최대 지원자 수</li>
  <li><code>care_status</code>: 숙식 제공 여부</li>
  <li><code>hiring_status</code>: 모집 상태 (예: 'Y'=모집중, 'N'=마감)</li>
</ul>

<p><strong>특징:</strong> 이력서와 연결되어 간병인과의 매칭이 이루어지는 중심 테이블입니다.</p>

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

<p><strong>목적:</strong> 간병인이 등록한 이력서를 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>resume_no</code>: 이력서 고유 번호 (PK)</li>
  <li><code>caregiver_no</code>: 간병인 식별 번호 (FK)</li>
  <li><code>title</code>, <code>content</code>: 이력서 제목과 자기소개</li>
  <li><code>care_status</code>: 현재 간병 중 여부</li>
  <li><code>status</code>: 공개 여부 (Y: 공개, W: 대기, N: 삭제됨)</li>
</ul>

<p><strong>특징:</strong> 여러 장의 이력서를 관리할 수 있으며, 구인 공고 제안 시 사용됩니다.</p>

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

<p><strong>목적:</strong> 보호자에게 등록된 환자 정보를 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>patient_no</code>: 환자 고유 번호 (PK)</li>
  <li><code>guardian_no</code>: 보호자 식별 번호 (FK)</li>
  <li><code>name</code>, <code>gender</code>, <code>birth</code>: 기본 인적 정보</li>
  <li><code>height</code>, <code>weight</code>, <code>phone</code>: 상세 정보</li>
</ul>

<p><strong>특징:</strong> 질병 태깅, 간병일지, 매칭 등 환자 중심의 연관 테이블과 연결됩니다.</p>

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /patient/v1?guardian_no={guardianNo} | 환자 리스트 조회 (보호자 기준) |
| GET | /patient/v1/{patNo} | 환자 상세 조회 |
| PATCH | /patient/v1/{patNo} | 환자 정보 수정 |

<hr/>

### DISEASE (질병)
<img width="785" height="413" alt="스크린샷 2025-07-31 오후 5 38 19" src="https://github.com/user-attachments/assets/38026f7f-3d14-41dd-ae00-85ba6cde1c67" />

<p><strong>목적:</strong> 병명 마스터 테이블로, 환자의 질환 정보를 분류합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>dis_no</code>: 병명 고유 번호 (PK)</li>
  <li><code>name</code>: 병명 (예: 치매, 중풍 등)</li>
</ul>

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /disease/v1 | 질병 리스트 조회 |
| GET | /patients/v1?disNo={disNo} | 특정 질병 상세 조회 |

<hr/>

### REPORT (보고서)
<img width="580" height="200" alt="스크린샷 2025-07-31 오후 5 38 45" src="https://github.com/user-attachments/assets/87884756-4e93-404d-8a2f-87be12690940" />

<p><strong>목적:</strong> 간병인이 환자에 대해 작성하는 간병 일지를 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>report_no</code>: 보고서 고유 번호 (PK)</li>
  <li><code>patient_no</code>: 환자 번호 (FK)</li>
  <li><code>caregiver_no</code>: 간병인 번호 (FK)</li>
  <li><code>report_content</code>: 상세 간병 내용 (LOB)</li>
  <li><code>created_at</code>: 작성 일시</li>
</ul>

<p><strong>특징:</strong> 환자 상태 및 간병 진행 상황 기록에 사용됩니다.</p>

| 메서드 | 엔드포인트        | 설명           |
| ------ | ---------------- | -------------- |
| GET | /report/v1/{patNo} | 환자 보고서 리스트 조회 |
| GET | /report/v1/detail/{reportNo} | 보고서 상세 조회 

<hr/>  

### PROPOSER (신청자)
<img width="767" height="202" alt="스크린샷 2025-07-31 오후 5 39 22" src="https://github.com/user-attachments/assets/82503a2f-c3d3-46de-b88a-9ad354ad2e57" />

<p><strong>목적:</strong> 간병인이 구인 공고에 제안한 내역을 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>proposer_no</code>: 제안 고유 번호 (PK)</li>
  <li><code>resume_no</code>: 이력서 번호 (FK)</li>
  <li><code>hiring_no</code>: 구인 공고 번호 (FK)</li>
  <li><code>status</code>: 제안 상태 (예: 지원중, 취소됨)</li>
</ul>

<p><strong>특징:</strong> 간병인의 제안 기록으로 매칭 여부를 판단하는 기준이 됩니다.</p>


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

<p><strong>목적:</strong> 간병인과 환자 간 매칭 내역을 저장합니다.</p>

<p><strong>주요 컬럼:</strong></p>
<ul>
  <li><code>matching_no</code>: 매칭 고유 번호 (PK)</li>
  <li><code>proposer_no</code>: 제안 정보 (FK → PROPOSER)</li>
  <li><code>matched_at</code>: 매칭 완료 일시</li>
  <li><code>status</code>: 매칭 상태 (Y: 진행 중, N: 종료됨)</li>
</ul>

<p><strong>특징:</strong> 채팅, 리뷰, 보고서 등 다양한 기능과 연계되는 핵심 테이블입니다.</p>

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

