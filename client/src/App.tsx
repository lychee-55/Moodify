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
import PostList from './components/main/moodPost/PostList';
import SearchResultPage from './pages/SearchResultPage';
import FindPassword from './components/authComp/FindPassword';
import DeletedMoods from './components/moodPost/DeletedMoods';
import { useState } from 'react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달을 열기 위한 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };
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
            <Route path="/li/user/find-password" element={<FindPassword />} />
            <Route path="/li/user/profile" element={<MyProfilePage />} />
            {/* <Route path="/li/user/EditPostModal" element={<EditPostModal />} /> */}

            <Route path="/li/user/myPage" element={<MyPage />}>
              <Route
                path="myMoodPosts"
                element={
                  <PostList
                    fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts`}
                  />
                }
              />
              <Route
                path="likes"
                element={
                  <PostList
                    fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/likes`}
                  />
                }
              />
              <Route
                path="marks"
                element={
                  <PostList
                    fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/marks`}
                  />
                }
              />
            </Route>
            <Route path="/li/moodPosts/create" element={<CreateMoodPage />}>
              {/* <Route path="search-music" element={<SearchMusic />} /> */}
            </Route>
            <Route path="/li/moodPosts/search" element={<SearchResultPage />} />
            {/* <Route
              path="/li/moodPost/myPage/myMoodPosts/view/deletedMoodList"
              element={<DeletedMoods onClose={closeModal} />}
            /> */}
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
