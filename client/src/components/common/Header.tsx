import { Link, useNavigate } from 'react-router-dom';
import { Search, LogIn, LogOut, User } from 'lucide-react';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { RootState } from '../../store/store';
import { logout } from '../../store/modules/checkSessionSlice';
import useCheckSession from '../../hook/useCheckSession';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useCheckSession();

  const [searchKeyword, setSearchKeyword] = useState('');

  // 🔍 검색 실행 함수
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(
        `/li/moodPosts/search?keyword=${encodeURIComponent(
          searchKeyword.trim(),
        )}`,
      );
      setSearchKeyword('');
      setIsSearchOpen(false); // 모바일 검색창 닫기
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Redux 상태에서 sessionValid 가져오기
  const sessionValid = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );

  const authProvider = useSelector(
    (state: RootState) => state.checkSession.authProvider,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      console.log('auth가 뭔지 알려줘::', authProvider);
      const url =
        authProvider === 'kakao'
          ? `${process.env.REACT_APP_API_SERVER}/li/user/kakao-logout`
          : `${process.env.REACT_APP_API_SERVER}/li/user/logout`;

      await axios.post(url, {}, { withCredentials: true });
      dispatch(logout()); // Redux 상태 초기화
      alert('로그아웃에 성공하였습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-4 transition-all ${
          isScrolled ? 'bg-[#f8e4d0]/90 backdrop-blur-sm' : 'bg-background'
        }`}
      >
        <h1 className="text-xl pacifico-regular">
          <Link to="/">Moodify</Link>
        </h1>

        <div className="hidden md:block relative flex-1 max-w-xs mx-4 lg:max-w-md">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            className={`w-full px-4 py-2 pr-10 rounded-md border border-[#c4b8ac] ${
              isScrolled ? 'bg-[#fffbf7]' : 'bg-[#e8e2db]'
            } text-[#272b1c] focus:outline-none focus:border-[#adcf56]`}
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
            onClick={handleSearch}
          />
        </div>

        {/* 네비게이션 메뉴 */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* 로그인 여부에 따라 메뉴 변경 */}
          <div className="hidden md:flex gap-4">
            {sessionValid ? (
              <>
                <Link
                  to="/li/user/myPage"
                  className="font-bold px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
                >
                  My Page
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
          {sessionValid ? (
            <>
              {/* 🔹 모바일 마이페이지 아이콘 */}
              <Link
                to="/li/user/myPage"
                className="md:hidden p-2"
                title="마이페이지"
              >
                <User size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="md:hidden p-2"
                title="로그아웃"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/li/user/login" className="md:hidden p-2" title="로그인">
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
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
              onClick={handleSearch}
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
