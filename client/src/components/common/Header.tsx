import { Link } from 'react-router-dom';
import { Search, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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
          </div>

          {/* 모바일 로그인 아이콘 */}
          <Link to="/li/user/login" className="md:hidden p-2">
            <LogIn size={20} />
          </Link>
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
