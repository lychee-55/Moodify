// src/pages/MyProfile.tsx
import { useState } from 'react';
import MyLikes from './MyLikes';
import MyBookmarks from './MyBookmarks';
import { Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// type TabType = 'like' | 'bookmark';

export default function MyProfile() {
  //   const [selectedTab, setSelectedTab] = useState<TabType>('like');
  const navigate = useNavigate();
  const location = useLocation();

  const isLike = location.pathname.endsWith('like');
  const isBookmark = location.pathname.endsWith('bookmark');
  return (
    <div className="max-w-4xl mx-auto py-8 px-6 md:px-12">
      {/* 마이 프로필 섹션 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img
            src="/default-profile.png"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-bold">사용자 닉네임</h2>
          </div>
        </div>
        <div>
          {/* PC에서는 텍스트 버튼, 모바일에서는 아이콘 버튼 */}
          <button className="hidden md:block px-4 py-2 border border-[#272b1c] rounded-md hover:bg-[#e0dad4] transition">
            프로필 수정
          </button>
          <button className="md:hidden p-2  hover:text-[#0c0c07]">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* 메뉴 탭 */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-center ${
            isLike
              ? 'border-b-2 border-blue-500 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => navigate('like')}
        >
          좋아요
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            isBookmark
              ? 'border-b-2 border-blue-500 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => navigate('bookmark')}
        >
          북마크
        </button>
      </div>
    </div>
  );
}

// 게시글 카드 컴포넌트
