import { Link, useNavigate } from 'react-router-dom';
import { Search, LogIn, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SessionChecker from './SessionChecker';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // 로그인 상태 확인 예시
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/user/check-session`,
        { withCredentials: true },
      );

      console.log('현재 로그인된 사용자:', response.data);

      if (response.data.status === 'SUCCESS') {
        setIsLoggedIn(true);
        setUserData(response.data.data.user);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);

      if (axios.isAxiosError(error)) {
        // 서버에서 명시적으로 반환한 에러 (401: 로그인 필요)
        if (error.response?.status === 401) {
          alert('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동합니다.');
          // 로그인 페이지로 리다이렉트
          navigate('/li/user/login');
        }
        // 서버 오류 (500 등)
        else if (error.response?.status === 500) {
          alert('서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.');
        }
        // 기타 네트워크 오류
        else {
          console.error('로그인 상태 확인 실패:', error);
          alert(
            '서버 연결에 문제가 발생했습니다.\n인터넷 연결을 확인해주세요.',
          );
        }
      } else {
        console.error('예상치 못한 에러:', error);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_SERVER}/li/user/logout`,
        {},
        { withCredentials: true },
      );
      setIsLoggedIn(false);
      setUserData(null);
      alert('로그아웃에 성공하였습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <>
      {/* <SessionChecker /> */}
      {/* 헤더 - 모바일/태블릿: px-8, 데스크톱: px-16 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-4 transition-all ${
          isScrolled ? 'bg-background/90 backdrop-blur-sm' : 'bg-background'
        }`}
      >
        {/* 왼쪽: 로고 */}
        <h1 className="text-xl pacifico-regular">
          <Link to="/">Moodify</Link>
        </h1>

        {/* 가운데: 검색창 (데스크톱 전용) */}
        <div className="hidden md:block relative flex-1 max-w-xs mx-4 lg:max-w-md">
          {/* <div className="hidden md:block relative flex-1 max-w-md mx-4"> */}
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            className="w-full px-4 py-2 pr-10 rounded-md border border-[#c4b8ac] bg-[#e8e2db] text-[#272b1c] focus:outline-none focus:border-[#adcf56]"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>

        {/* 오른쪽: 네비게이션 */}
        <div className="flex items-center gap-4">
          {/* 모바일 검색 아이콘 */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* 데스크톱 로그인/회원가입 */}
          <div className="hidden md:flex gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/li/user/my-profile"
                  className="font-bold px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-bold px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/li/user/login"
                  className="font-bold px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
                >
                  Login
                </Link>
                <Link
                  to="/li/user/sign-up"
                  className="font-bold px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* 모바일 로그인/로그아웃 아이콘 */}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="md:hidden p-2">
              <LogOut size={20} />
            </button>
          ) : (
            <Link to="/li/user/login" className="md:hidden p-2">
              <LogIn size={20} />
            </Link>
          )}
        </div>
      </header>

      {/* 모바일 검색 오버레이 */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="relative top-20 mx-4">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              autoFocus
              className="w-full px-4 py-3 pr-12 rounded-md border border-[#c4b8ac] bg-[#e8e2db] text-[#272b1c] focus:outline-none focus:border-blue-400"
            />
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <button
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setIsSearchOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
