import { Link } from 'react-router-dom';
import { Search, LogIn } from 'lucide-react'; // Lucide 아이콘 추가
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
      {/* 헤더 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-4 border-b border-white/30 transition-all ${
          isScrolled ? 'bg-background/90 backdrop-blur-sm' : 'bg-background'
        }`}
      >
        {/* 왼쪽: Moodify 로고 (변경 없음) */}
        <h1 className="text-xl pacifico-regular">
          <Link to="/">Moodify</Link>
        </h1>

        {/* 가운데: 검색창 (데스크톱에서만 표시) */}
        <div className="hidden md:block relative flex-1 max-w-md mx-4">
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

        {/* 오른쪽: 모바일용 검색 아이콘 + 데스크톱용 로그인/회원가입 */}
        <div className="flex items-center gap-4">
          {/* 모바일 검색 아이콘 (md:hidden) */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* 데스크톱 로그인/회원가입 (md:flex) */}
          <div className="hidden md:flex gap-4">
            <Link
              to="/login"
              className="font-bold px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="font-bold px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
            >
              Signup
            </Link>
          </div>

          {/* 모바일 로그인 아이콘 (md:hidden) */}
          <Link to="/login" className="md:hidden p-2">
            <LogIn size={20} />
          </Link>
        </div>
      </header>

      {/* 모바일 검색창 오버레이 (isSearchOpen일 때만 표시) */}
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
      {/* 하단 20% 그라데이션 오버레이 */}
      {/* <div
        className="absolute bottom-0 left-0 right-0 h-[20%] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, var(--header-bg) 0%, transparent 100%)',
        }}
      /> */}
    </>
  );
}
