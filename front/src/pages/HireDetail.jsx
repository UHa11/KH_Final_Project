import React, { useEffect, useState } from 'react';
import { Container, Section } from '../styles/common/Container';
import profileImage from '../assets/images/pat.png'; // 프로필 이미지 경로
import caregiverImage from '../assets/profileImg/img_간병인.png'; //간병인 기본 이미지
import chatImage from '../assets/icons/icon_채팅아이콘.png'; // 채팅 이미지 경로
import styled from 'styled-components';
import { DeleteButton, SubmitButton } from '../styles/common/Button';
import { FaPlus } from 'react-icons/fa6';
import { media } from '../styles/MediaQueries';
import { useNavigate } from 'react-router-dom';
import { Input, InputGroup, Title } from '../styles/Auth.styles';
import useUserStore from '../store/userStore';
import { hiringService } from '../api/hiring';
import { useParams } from 'react-router-dom';
import { guardianHiringForm } from '../hooks/guardianHiringForm';
import ResumeSelectModal from '../components/ResumeSelectModal';
import { proposerService } from '../api/propose';
import { extractRegionFromEnd } from '../utils/formatData';

const HireDetail = () => {
  const navigate = useNavigate();
  const { hiringNo } = useParams();
  const { user } = useUserStore(); // 현재 로그인한 사용자 정보
  const [jobOpening, setJobOpening] = useState(null); // 초기값을 null로 설정하여 데이터 로딩 전 렌더링 방지
  const [applicationStatus, setApplicationStatus] = useState({
    isProposed: false,
    isMatched: false,
  });
  // 폼 관련 훅 (여기서는 읽기 전용으로 사용)
  const { register, setValue, watch, errors } = guardianHiringForm();

  //모집 마감상태
  const [recruitmentClosed, setRecruitmentClosed] = useState(false);

  const handleToggleRecruitmentStatus = async (hiringNo) => {
    if (!window.confirm(`정말 이 구인글의 모집마감 하시겠습니까?`)) return;

    try {
      await hiringService.toggleRecruitmentStatus(Number(hiringNo));
      setRecruitmentClosed((prev) => !prev);
      alert(`구인글 모집이 성공적으로 모집마감 되었습니다.`);
      // 상태 최신화 위해 getHirngById 다시 호출해도 좋음
    } catch (err) {
      alert(`구인글 모집 마감 실패`);
      console.error(err);
    }
  };

  //구인글 삭제 기능
  const deleteOnClick = async (hiringNo) => {
    if (!window.confirm('구인글을 삭제하시겠습니까?')) return;

    try {
      await hiringService.deleteHiring(hiringNo);
      alert('삭제가 완료되었습니다.');
      navigate('/guardian/jobopening-management');
    } catch (err) {
      console.error('삭제 실패', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const currentGender = watch('patGender');

  // 이력서 선택 모달 상태
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // 신청 성공 시
  const handleApply = () => {
    setApplicationStatus((prev) => ({
      ...prev,
      isProposed: true,
    }));
  };

  //신청된 글인지 확인하는 기능
  useEffect(() => {
    if (!user || !user.userNo || !hiringNo) return; // user 존재 여부 먼저 확인
    const checkProposer = async () => {
      try {
        const result = await proposerService.getProposerStatus({
          caregiverNo: Number(user.userNo),
          hiringNo: Number(hiringNo),
        });

        setApplicationStatus(result);
      } catch (error) {
        console.error(error + ': 신청확인실패 ');
      }
    };

    checkProposer();
  }, [user, hiringNo]); // 의존성 배열

  //지원 현황 관련
  const [proposerList, setproposerList] = useState([]);

  // 신청 취소 시
  const handleCancel = async () => {
    const confirm = window.confirm('신청을 취소하시겠습니까?');
    if (!confirm) return;
    try {
      await proposerService.cancelProposer({
        caregiverNo: user.userNo,
        hiringNo: Number(hiringNo),
        status: null,
      });
      alert('신청이 취소되었습니다.');
      setApplicationStatus((prev) => ({
        ...prev,
        isProposed: false,
      }));
    } catch (err) {
      alert('신청 취소 실패');
      console.error(err);
    }
  };

  useEffect(() => {
    // 로그인하지 않은 경우 이전 페이지로 이동
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    const init = async () => {
      try {
        const data = await hiringService.getHirngById(Number(hiringNo), user?.userNo);

        setJobOpening(data);
        if (data.applied && typeof data.applied === 'object') {
          setApplicationStatus(data.applied); // { isMatched: true, isProposed: true }
        }

        setRecruitmentClosed(data.hiringStatus === 'N');
        setValue('hiringStatus', data.hiringStatus);
        setValue('hiringTitle', data.hiringTitle);
        setValue('hiringContent', data.hiringContent);
        setValue('account', data.account);
        setValue('startDate', data.startDate.slice(0, 10));
        setValue('endDate', data.endDate.slice(0, 10));
        setValue('maxApplicants', data.maxApplicants);
        setValue('careStatus', data.careStatus);
        setValue('patGender', data.patGender);
      } catch (error) {
        console.error('구인글 상세 및 신청 상태 불러오기 실패', error);
      }
    };

    if (user?.userNo && hiringNo) {
      init();
    }

    const getList = async () => {
      const data = await proposerService.getcareGiverLists(hiringNo);
      setproposerList(data.proposers);
    };
    getList();
  }, [hiringNo, setValue]);

  // jobOpening 데이터가 아직 로드되지 않았다면 로딩 상태를 표시
  if (!jobOpening) {
    return <div>로딩 중...</div>;
  }

  // 로그인한 사용자가 구인글 작성자인지 판단
  // DTO의 userNo 필드가 구인글 작성자의 userNo입니다.
  const isMyJobOpening = user?.userNo === jobOpening?.userNo;
  // 모집 마감 상태 확인 (DTO에 hire_status 필드가 있다고 가정)

  const CLOUDFRONT_URL = 'https://d20jnum8mfke0j.cloudfront.net/';
  //이미지 경로 갖고오고 없다면 기본이미지
  const getProfileImageUrl = (path, defaultImage) => {
    if (!path) return defaultImage;
    const cleanPath = path.replace(/^\//, '');
    return `${CLOUDFRONT_URL}${cleanPath}`;
  };

  return (
    <HireRegistSection>
      {isMyJobOpening ? (
        <Wrapper>
          <ImageStack>
            {proposerList.slice(0, 3).map((list, index) => (
              <ProfileImg
                key={index}
                src={getProfileImageUrl(list.profileImage, caregiverImage)}
                style={{ left: `${index * 20}px`, zIndex: proposerList.length - index }}
              />
            ))}
          </ImageStack>

          <NewTitle>지원현황 {proposerList.length}명</NewTitle>
          <ActionButton type="button" onClick={() => navigate(`/guardian/careGiverSupportBorad/${hiringNo}`)}>
            확인하기
          </ActionButton>
        </Wrapper>
      ) : (
        <></>
      )}
      <HireContainer>
        <HireHead>
          <HireHeadTitle>돌봄대상자 정보</HireHeadTitle>
        </HireHead>
        <form>
          <ContentWrapper>
            <div>
              <ProfilImageWrapper>
                <img src={getProfileImageUrl(jobOpening.profileImage, profileImage)} alt="프로필" />
              </ProfilImageWrapper>
              <ChatButton onClick={() => alert('서비스 구현중입니다')}>
                <img src={chatImage} alt="프로필 이미지" />1 : 1 채팅하기
              </ChatButton>
            </div>
            <Divider>
              <InputRow>
                <InputGroup>
                  <Label>이름</Label>
                  <HireInput type="text" id="patName" value={jobOpening?.patName} readOnly />
                </InputGroup>
                <InputGroup>
                  <Label>나이</Label>
                  <HireInput type="text" id="age" value={jobOpening?.patAge} readOnly />
                </InputGroup>
              </InputRow>
              <RadioGroup>
                <Label>성별</Label>
                <RadioWrapper checked={currentGender === 'M'}>
                  <input type="radio" id="M" name="patGender" value="M" checked={currentGender === 'M'} readOnly />
                  <label htmlFor="M">남성</label>
                </RadioWrapper>
                <RadioWrapper checked={currentGender === 'F'}>
                  <input type="radio" id="F" name="patGender" value="F" checked={currentGender === 'F'} readOnly />
                  <label htmlFor="F">여성</label>
                </RadioWrapper>
              </RadioGroup>
              {/* <InputGroup>
                <Label>보호자 전화번호</Label>
                <Input type="text" value={jobOpening?.phone} readOnly />
              </InputGroup> */}
              <InputGroup>
                <Label>주소</Label>
                <HireInput type="text" id="patAddress" value={extractRegionFromEnd(jobOpening?.patAddress)} readOnly />
              </InputGroup>
              <InputRow>
                <InputGroup>
                  <Label>키</Label>
                  <HireInput type="text" value={jobOpening?.patHeight} readOnly />
                </InputGroup>
                <InputGroup>
                  <Label>몸무게</Label>
                  <HireInput type="text" value={jobOpening?.patWeight} readOnly />
                </InputGroup>
              </InputRow>
            </Divider>
          </ContentWrapper>

          <ContentWrapper>
            <DiseaseGroup>
              <Label>보유한 질병</Label>
              <DiseaseInputDiv>
                {jobOpening?.diseaseTag?.map((tag, idx) => (
                  <div key={idx}>{tag}</div>
                ))}
              </DiseaseInputDiv>
            </DiseaseGroup>
          </ContentWrapper>

          <HireBottom>
            <HireBottomTitle>채용 정보</HireBottomTitle>
          </HireBottom>
          <ContentWrapper1>
            <HireContent>
              <Label>제목</Label>
              <HireInput type="text" id="hiring_title" {...register('hiringTitle')} readOnly />

              <InputRow>
                <InputGrouping>
                  <Label>지급 금액 (시급)</Label>
                  <HireInput type="text" id="account" {...register('account')} readOnly />
                </InputGrouping>

                <InputGrouping>
                  <Label>시작일</Label>
                  <HireInput type="date" id="startDate" {...register('startDate')} readOnly />
                </InputGrouping>

                <InputGrouping>
                  <Label>종료일</Label>
                  <HireInput type="date" id="endDate" {...register('endDate')} readOnly />
                </InputGrouping>

                <InputGrouping>
                  <Label>모집 인원수 설정</Label>
                  <HireInput type="number" id="maxApplicants" {...register('maxApplicants')} readOnly />
                </InputGrouping>
              </InputRow>

              <Label>내용</Label>
              <Content type="text" id="hiringContent" {...register('hiringContent')} readOnly />
              <RadioGroup>
                <Label>숙식 제공 여부</Label>
                <RadioWrapper>
                  <input type="radio" value="Y" name="careStatus" checked={jobOpening?.careStatus === 'Y'} readOnly />
                  <label>가능</label>
                </RadioWrapper>
                <RadioWrapper>
                  <input type="radio" value="N" name="careStatus" checked={jobOpening?.careStatus === 'N'} readOnly />
                  <label>불가능</label>
                </RadioWrapper>
              </RadioGroup>
              {jobOpening?.careStatus === 'Y' && (
                <InputGroup>
                  <Label>숙소 정보</Label>
                  <RoomImage>
                    {jobOpening.roomImage ? (
                      <img
                        src={getProfileImageUrl(jobOpening.roomImage)}
                        alt="숙소 사진"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <Plus />
                    )}
                  </RoomImage>
                  <input type="file" style={{ display: 'none' }} readOnly />
                </InputGroup>
              )}
            </HireContent>
          </ContentWrapper1>
        </form>
        <ButtonGroup>
          <BackButton onClick={() => navigate(-1)}>이전</BackButton>

          {isMyJobOpening ? (
            // 본인이 작성한 글일 경우
            <>
              <DeleteButton type="button" onClick={() => deleteOnClick(hiringNo)}>
                삭제
              </DeleteButton>
              <SubmitButton1
                type="button"
                onClick={() => {
                  if (!recruitmentClosed) {
                    handleToggleRecruitmentStatus(hiringNo);
                  }
                }}
                disabled={recruitmentClosed}
                $disabled={recruitmentClosed}
              >
                {recruitmentClosed ? '마감' : '모집 마감'}
              </SubmitButton1>
            </>
          ) : recruitmentClosed ? (
            // 모집 마감된 글인데 내가 작성자가 아니면 신청 버튼 대신 비활성 모집 마감 버튼 표시
            <SubmitButton1 type="button" disabled $disabled>
              신청취소(모집마감)
            </SubmitButton1>
          ) : applicationStatus.isMatched || applicationStatus.status === 'Y' ? (
            <SubmitButton1 type="button" disabled $disabled>
              매칭 완료
            </SubmitButton1>
          ) : applicationStatus.isProposed ? (
            <>
              <SubmitButton1 type="button" onClick={handleCancel}>
                신청 취소
              </SubmitButton1>
            </>
          ) : (
            <SubmitButton1 type="button" onClick={handleOpenModal}>
              신청하기
            </SubmitButton1>
          )}

          {isModalOpen && (
            <ResumeSelectModal
              hiringNo={hiringNo}
              onClose={handleCloseModal}
              onSuccess={() => {
                handleApply();
                setModalOpen(false);
              }}
            />
          )}
        </ButtonGroup>
      </HireContainer>
    </HireRegistSection>
  );
};

const HireRegistSection = styled(Section)``;

const HireContainer = styled(Container)`
  width: 80%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden; /* 내부 요소가 넘치지 않도록 */
`;

const HireHead = styled.div`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[5]};
  margin-top: 10px;
`;

const HireHeadTitle = styled(Title)`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
`;

const ChatButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-top: ${({ theme }) => theme.spacing[6]};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  img {
    width: 33px;
    height: 33px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  padding: ${({ theme }) => theme.spacing[6]}; /* 전체 패딩 */
  gap: ${({ theme }) => theme.spacing[6]}; /* 이미지와 입력 필드 그룹 사이 간격 */
  justify-content: space-around;
  ${media.md`
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing[8]}; /* 큰 화면에서 패딩 증가 */
    gap: ${({ theme }) => theme.spacing[10]}; /* 큰 화면에서 간격 증가 */
  `}
`;

const ProfilImageWrapper = styled.div`
  flex-shrink: 0; /* 줄어들지 않도록 */
  width: 150px; /* 고정 너비 */
  height: 150px; /* 고정 높이 */
  border-radius: 50%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[100]}; /* 이미지 없을 때 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center; /* 세로 중앙 정렬 */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.md`
    width: 200px;
    height: 200px;
    align-self: flex-start; /* 큰 화면에서는 상단 정렬 */
  `}
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};

  ${media.md`
    flex-direction: row;
  `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-align: left;
`;

const HireInput = styled(Input)`
  pointer-events: none; /* 클릭/포커스 불가 */
  cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;
const InputGrouping = styled(InputGroup)`
  flex: 1; // 모든 input 그룹이 동일한 너비
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  // 'checked' prop을 받아서 스타일을 동적으로 적용합니다.
  input[type='radio'] {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in-out;
    background-color: white;
    pointer-events: none; /* 클릭/포커스 불가 */
    cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
    // RadioWrapper에서 전달받은 checked prop 사용
    border: 1px solid ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.gray[4])};
  }

  input[type='radio']::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease-in-out;
  }

  input[type='radio']:checked::before {
    transform: translate(-50%, -50%) scale(1);
  }

  label {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.gray[1]};
    pointer-events: none; /* 클릭/포커스 불가 */
    cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
  }
`;

const Divider = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DiseaseGroup = styled(InputGroup)`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing[16]};

  input {
    width: 100%;
    border: none;
  }
`;
const DiseaseInputDiv = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 55px;
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: 0 ${({ theme }) => theme.spacing[5]};
  text-align: center;
  align-items: center;
  max-width: 800px;

  div {
    width: 80px;
    height: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    color: white;
  }
`;
const HireBottom = styled.div`
  width: 100%;
  display: flex;
  padding: 0 ${({ theme }) => theme.spacing[20]};
`;
const HireBottomTitle = styled(Title)`
  margin: 0;
`;

const HireContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ContentWrapper1 = styled.div`
  display: flex;
  flex-direction: column; /* 작은 화면에서 세로로 쌓이도록 */
  padding: ${({ theme }) => theme.spacing[6]}; /* 전체 패딩 */
  gap: ${({ theme }) => theme.spacing[6]}; /* 이미지와 입력 필드 그룹 사이 간격 */
  justify-content: space-around;
  ${media.md`
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing[6]}; /* 큰 화면에서 패딩 증가 */
    gap: ${({ theme }) => theme.spacing[10]}; /* 큰 화면에서 간격 증가 */
  `}
`;

const Content = styled.textarea`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  min-height: 400px; /* 원하는 기본 높이 */
  resize: none;
  overflow: hidden; /* 스크롤 숨김 */
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  pointer-events: none; /* 클릭/포커스 불가 */
  cursor: default; /* 마우스 커서를 기본 화살표로 변경 */
`;

const RoomImage = styled.div`
  width: 50%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: 'pointer';
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  height: 50px;
  justify-content: center;
`;

const BackButton = styled.button`
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[5])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 25%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const SubmitButton1 = styled(SubmitButton)`
  width: 65%;
  border: 1px solid ${({ theme, $disabled }) => ($disabled ? theme.colors.gray[5] : theme.colors.gray[5])};
  background-color: ${({ theme, $disabled }) => ($disabled ? theme.colors.gray[5] : theme.colors.primary)};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $disabled }) => ($disabled ? theme.colors.gray[600] : 'white')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const Plus = styled(FaPlus)`
  width: 30px;
  height: 30px;
  color: white;
`;

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  gap: 50px;
  margin: 20px auto;
  margin-top: 30px;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;
const ImageStack = styled.div`
  position: relative;
  height: 50px;
  width: 20%;
  margin-bottom: 16px;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  border: 2px solid white;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const NewTitle = styled.h2`
  width: 20%;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  width: 200px;

  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
export default HireDetail;
