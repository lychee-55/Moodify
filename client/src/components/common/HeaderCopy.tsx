import { Link } from 'react-router-dom';
import { Search } from 'lucide-react'; // Lucide 아이콘 라이브러리 사용

export default function HeaderCopy() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-white/30 bg-background text-textColor">
      {/* 왼쪽: Moodify 로고 */}
      <h1 className="text-xl font-bold">
        <Link to="/">Moodify</Link>
      </h1>

      {/* 가운데: 검색창 */}
      <div className="relative flex-1 flex justify-center w-full max-w-md">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          className="w-full max-w-md px-4 py-2 pr-10 rounded-md border border-[#c4b8ac] bg-[#e8e2db] text-[#272b1c] focus:outline-none focus:border-blue-400"
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={20}
        />
      </div>

      {/* 오른쪽: 로그인 / 회원가입 버튼 */}
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-md hover:bg-[#e0dad4] transition"
        >
          Signup
        </Link>
      </div>
    </header>
  );
}
