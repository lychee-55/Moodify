// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../src/style/main.css';
import Header from './components/common/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateMoodPage from './pages/CreateMoodPage';
import MyPage from './pages/MyPage';
import MyLikes from './components/myPageComp/MyLikes';
import MyBookmarks from './components/myPageComp/MyBookmarks';
import MyProfilePage from './pages/MyProfilePage';
import DescriptionPage from './pages/DescriptionPage';

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
            <Route path="/li/user/profile" element={<MyProfilePage />} />
            <Route path="/li/user/myPage" element={<MyPage />}>
              <Route path="like" element={<MyLikes />} />
              <Route path="bookmark" element={<MyBookmarks />} />
            </Route>
            <Route path="/li/moodPosts/create" element={<CreateMoodPage />}>
              {/* <Route path="search-music" element={<SearchMusic />} /> */}
            </Route>
            {/* <Route
              path="/li/moodposts/view/:post_id"
              element={<DescriptionPage />}
            /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
