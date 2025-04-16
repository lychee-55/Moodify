// src/pages/MyProfile.tsx
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Avvvatars from 'avvvatars-react';
import useUserData from '../../hook/useUserData';

export default function MyProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUserData();

  const isLike = location.pathname.endsWith('likes');
  const isBookmark = location.pathname.endsWith('marks');
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-12">
      {/* 마이 프로필 섹션 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <Avvvatars value={userData.profile_image} style="shape" size={96} />
          {/* <img
            src="/default-profile.png"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          /> */}
          <div>
            <h2 className="text-2xl font-bold">{userData.nickname}</h2>
          </div>
        </div>
        <div>
          {/* PC에서는 텍스트 버튼, 모바일에서는 아이콘 버튼 */}
          <button
            className="hidden md:block px-4 py-2 border border-[#272b1c] rounded-md hover:bg-[#e0dad4] transition"
            onClick={() => navigate('/li/user/profile')}
          >
            프로필 수정
          </button>
          <button
            className="md:hidden p-2  hover:text-[#0c0c07]"
            title="프로필 설정"
          >
            <Settings size={24} onClick={() => navigate('/li/user/profile')} />
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
          onClick={() => navigate('likes')}
        >
          좋아요
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            isBookmark
              ? 'border-b-2 border-blue-500 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => navigate('marks')}
        >
          북마크
        </button>
      </div>
    </div>
  );
}

// 게시글 카드 컴포넌트
