import { ThemeProvider } from 'styled-components';
import './App.css';
import GlobalStyle from './styles/GlobalStyle';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import theme from './styles/theme';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import SignUp from './pages/SignUp';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import HireList from './pages/HireList';
import Patient from './pages/Patient';
import PatientRegisteration from './pages/PatientRegistration';
import PatientUpdate from './pages/PatientUpdate';
import ReportDetail from './pages/ReportDetail';
import ReportForm from './pages/ReportForm';
import CaregiverList from './pages/CaregiverList';
import HireRegistration from './pages/HireRegistration';
import HireDetail from './pages/HireDetail';
import ResumeRegistration from './pages/ResumeRegistration';

import ResumeDetail from './pages/ResumeDetail';
import GuardianMainPage from './pages/GuardianMainPage';
import CareGiverMainPage from './pages/CareGiverMainPage';

import ReportMain from './pages/ReportMain';
import ReviewModal from './components/ReviewModal';

import CareGiverSupportBoard from './pages/CareGiverSupportBoard';

import ResumeManagement from './pages/ResumeManagement';
import ScrollToTop from './utils/scrollToTop';
import ReceivedReviews from './pages/ReceivedReviews';
import WrittenReviews from './pages/WrittenReviews';

import MatchToPatient from './pages/MatchToPatient';
import MyResume from './pages/MyResume';
import CareGviverProfile from './pages/CareGiverProfile';
import ContactPage from './pages/ContactPage';
import JobOpeningManagement from './pages/JobOpeningManagement';
import QuestionFull from './pages/question/QuestionFull';
import QuestionCreate from './pages/question/QuestionCreate';
import QuestionHistory from './pages/question/QuestionHistory';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import Modal from './components/Modal';
import MyProposer from './pages/MyProposer';
import CareGiverCommunity from './pages/community/CareGiverCommunity';
import GuardianCommunity from './pages/community/GuardianCommunity';
import CommunityDetail from './pages/community/CommunityDetail';
import CreateCommuBoardForm from './pages/community/CreateCommuBoardForm';
import QuestionDetail from './pages/question/QuestionDetail';
import FileUpload from './components/FileUpload';
import FindPassword from './pages/find_password/FindPassword';
import ResetPassword from './pages/find_password/ResetPassword';
import UpdateCommuBoardForm from './pages/community/UpdateCommuBoardForm';
import PatientCardGroup from './components/PatientCardGroup';
import AiModal from './components/AiModal';
import MatchMainPage from './pages/MatchMainPage';
import ChatHome from './pages/chat/ChatHome';
import AiChat from './components/chat/AiChat';
import usePreventWheelOnNumberInput from './hooks/usePreventWheelOnNumberInput';
import MatchToCareGiver from './pages/MatchToCareGiver';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  //input type = number인 기본이벤트인 onWheel를 막는 훅입니다.
  usePreventWheelOnNumberInput();
  // useEffect(() => {
  //   if (location.pathname === '/') {
  //     navigate('/guardian');
  //   }
  // }, [location, navigate]);

  return (
    <>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<GuardianMainPage />} />

          {/* 간병인 */}
          <Route path="/caregiver" element={<CareGiverMainPage />} />
          <Route path="/caregiver/hirelist" element={<HireList />} />
          <Route path="/caregiver/resumeregistration" element={<ResumeRegistration />} />
          <Route path="/caregiver/reportform/:patNo" element={<ReportForm />} />
          <Route path="/caregiver/resumemanagement" element={<ResumeManagement />} />
          <Route path="/caregiver/review" element={<ReceivedReviews />} />
          <Route path="/caregiver/matchpage" element={<MatchToPatient />} />
          <Route path="/caregiver/myresume/:resumeNo" element={<MyResume />} />
          <Route path="/caregiver/myproposer" element={<MyProposer />} />
          {/* 같은 컴포넌트로 신청했는지 url로 처리 */}
          <Route path="/caregiver/resumeDetail/:resumeNo" element={<ResumeDetail />} />
          <Route path="/caregiver/resumeDetail/:resumeNo/:hiringNo" element={<ResumeDetail />} />

          {/* 보호자 */}
          <Route path="/guardian" element={<GuardianMainPage />} />
          <Route path="/guardian/caregiverlist" element={<CaregiverList />} />
          <Route path="/guardian/hire-registration" element={<HireRegistration />} />
          <Route path="/guardian/patient" element={<Patient />} />
          <Route path="/guardian/patient/:patNo" element={<PatientUpdate />} />
          <Route path="/guardian/patientregisteration" element={<PatientRegisteration />} />
          <Route path="/guardian/review" element={<WrittenReviews />} />
          <Route path="/review" element={<ReviewModal />} />
          <Route path="/guardian/matchpage" element={<MatchMainPage />} />
          <Route path="/guardian/careGiverSupportBorad/:hiringNo" element={<CareGiverSupportBoard />} />
          <Route path="/guardian/jobopening-management" element={<JobOpeningManagement />} />
          {/* 공용 */}
          <Route path="/community/create/:role" element={<CreateCommuBoardForm />} />
          <Route path="/community/detail/:boardNo" element={<CommunityDetail />} />
          <Route path="/community/guardian" element={<GuardianCommunity />} />
          <Route path="/community/caregiver" element={<CareGiverCommunity />} />
          <Route path="/community/update/:boardNo" element={<UpdateCommuBoardForm />} />
          <Route path="/question/full" element={<QuestionFull />} />
          <Route path="/question/history" element={<QuestionHistory />} />
          <Route path="/question/create" element={<QuestionCreate />} />
          <Route path="/question/detail/:boardNo" element={<QuestionDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/reset-password/code" element={<ResetPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/caregiverProfile/:userNo" element={<CareGviverProfile />} />
          <Route path="/hireDetail/:hiringNo" element={<HireDetail />} />
          <Route path="/report/:patNo" element={<ReportMain />} />
          <Route path="/report/detail/:reportNo" element={<ReportDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/modal" element={<Modal />} />

          {/* 테스트용 임시 */}
          <Route path="/file" element={<FileUpload />} />
<Route path='/test/test' element={<MatchToCareGiver></MatchToCareGiver>}></Route>
          <Route path="/test" element={<AiModal/> } />
          <Route path="/chatbot" element={<AiChat />}></Route>
        </Routes>
      </Layout>
    </>
  );
}

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            draggable
            hideProgressBar={false}
            newestOnTop
            theme="light"
            pauseOnHover
          />
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
