import { ThemeProvider } from 'styled-components';
import './App.css';
import GlobalStyle from './styles/GlobalStyle';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import theme from './styles/theme';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import CommunityBoard from './pages/CommunityBoard';
import SignUp from './pages/SignUp';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import HireList from './pages/HireList';
import Patient from './pages/Patient';
import PatientRegisteration from './pages/PatientRegistration';
import PatientUpdate from './pages/PatientUpdate';
import ReportDetail from './pages/ReportDetail';
import ReportForm from './pages/ReportForm';
import CommunityDetail from './pages/CommunityDetail';
import NoticeBoard from './pages/NoticeBoard';
import CaregiverList from './pages/CaregiverList';
import HireRegistration from './pages/HireRegistration';
import HireDetail from './pages/HireDetail';
import ResumeRegistration from './pages/ResumeRegistration';
import ResumeDetail from './pages/ResumeDetail';
import GuardianMainPage from './pages/GuardianMainPage';
import CareGiverMainPage from './pages/CareGiverMainPage';
import { useEffect } from 'react';
// import useUserStore from './store/userStore';
import ReportMain from './pages/ReportMain';
import CreateCommuBoardForm from './pages/CreateCommuBoardForm';
import UpdateCommuBoardForm from './pages/UpdateCommuBoardForm';
import ReviewModal from './components/ReviewModal';

import HireDetailMine from './pages/HireDetailMine';
import CareGiverSupportBoard from './pages/CareGiverSupportBoard';
import ResumeDetailMine from './pages/ResumeDetailMine';
import GuardianSupportBoard from './pages/GuardianSupportBoard';

import ResumeManagement from './pages/ResumeManagement';
import ScrollToTop from './utils/scrollToTop';
import HistoryManageMent from './pages/HistoryManageMent';

import ReceivedReviews from './pages/ReceivedReviews';
import WrittenReviews from './pages/WrittenReviews';
import MatchToCaregiver from './pages/MatchToCaregiver';
import MatchToPatient from './pages/MatchToPatient';
import MyResume from './pages/MyResume';
import CareGiverCommunity from './pages/CareGiverCommunity';
import GuardianCommunity from './pages/GuardianCommunity';
import QuestionFull from './pages/question/QuestionFull';
import QuestionCreate from './pages/question/QuestionCreate';
import QuestionHistory from './pages/question/QuestionHistory';
import QuestionDetail from './pages/question/QuestionDetail';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/guardian');
    }
  }, [location, navigate]);

  return (
    <>
      <Layout>
        <ScrollToTop />
        <Routes>
          {/* 간병인 */}
          <Route path="/caregiver" element={<CareGiverMainPage />} />
          <Route path="/caregiver/hirelist" element={<HireList />} />
          <Route path="/caregiver/resumeregistration" element={<ResumeRegistration />} />
          <Route path="/caregiver/reportform/:patNo" element={<ReportForm />} />

          <Route path="/caregiver/resumeDetail/:resumeNo" element={<ResumeDetailMine />} />
          <Route path="/caregiver/guardianSupportBoard" element={<GuardianSupportBoard />} />

          <Route path="/caregiver/resumemanagement" element={<ResumeManagement />} />
          <Route path="/caregiver/review" element={<ReceivedReviews />} />

          <Route path="/caregiver/matchpage" element={<MatchToPatient />} />
          <Route path="/myresume/:resumeNo" element={<MyResume />} />

          {/* 보호자 */}
          <Route path="/guardian" element={<GuardianMainPage />} />
          <Route path="/guardian/caregiverlist" element={<CaregiverList />} />
          <Route path="/guardian/hire-registration" element={<HireRegistration />} />
          <Route path="/guardian/patient" element={<Patient />} />
          <Route path="/guardian/patient/:id" element={<PatientUpdate />} />
          <Route path="/guardian/patientregisteration" element={<PatientRegisteration />} />
          <Route path="/guardian/review" element={<WrittenReviews />} />
          <Route path="/review" element={<ReviewModal />} />
          <Route path="/guardian/matchpage" element={<MatchToCaregiver />} />
          <Route path="/guardian/hireDetail/:hiringNo" element={<HireDetailMine />} />
          <Route path="/guardian/careGiverSupportBorad" element={<CareGiverSupportBoard />} />

          {/* 공용 */}
          <Route path="/community/create" element={<CreateCommuBoardForm />} />
          <Route path="/community/free" element={<CommunityBoard />} />
          <Route path="/community/detail/:no" element={<CommunityDetail />} />
          <Route path="/community/guardian" element={<GuardianCommunity />} />
          <Route path="/community/caregiver" element={<CareGiverCommunity />} />
          <Route path="/community/update/:no" element={<UpdateCommuBoardForm />} />
          <Route path="/question/full" element={<QuestionFull />} />
          <Route path="/question/history" element={<QuestionHistory />} />
          <Route path="/question/detail/:no" element={<QuestionDetail />} />
          <Route path="/question/create" element={<QuestionCreate />} />
          <Route path="/community/notice" element={<NoticeBoard />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/myprofile" element={<MyProfile />} />

          <Route path="/hireDetail/:hiringNo" element={<HireDetail />} />

          <Route path="/resumeDetail/:resumeNo" element={<ResumeDetail />} />
          <Route path="/report/:patNo" element={<ReportMain />} />
          <Route path="/report/:patNo/detail/:reportNo" element={<ReportDetail />} />
          <Route path="/history-management" element={<HistoryManageMent />} />
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
