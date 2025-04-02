// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../src/style/main.css';
import Header from './components/common/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateMoodPage from './pages/CreateMoodPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="pt-16">
          {' '}
          {/* 헤더 높이(4rem ≈ 16px × 4)만큼 패딩 */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/li/user/login" element={<LoginPage />} />
            <Route path="/li/user/sign-up" element={<SignupPage />} />
            <Route path="/li/moodPosts/create" element={<CreateMoodPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
