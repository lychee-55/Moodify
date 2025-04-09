// src/hook/useUserData.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

type ProfileData = {
  nickname: string;
  email: string;
  profile_image: string;
};

export default function useUserData() {
  const [userData, setUserData] = useState<ProfileData>({
    nickname: '',
    email: '',
    profile_image: 'default_image',
  });

  // ✅ 프로필 조회
  const getUserProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/user/profile`,
        { withCredentials: true },
      );
      if (res.data.status === 'SUCCESS') {
        console.log('프로필 조회success데이터', res.data.data);
        setUserData(res.data.data);
      } else if (res.data.status === 'ERROR') {
        alert(res.data.message);
        console.log(res.data.message);
      }
    } catch (err) {
      console.error('프로필 조회 실패:', err);
    }
  };

  // ✅ 프로필 수정
  // src/hook/useUserData.tsx (수정)
  const updateUserProfile = async (updatedData: {
    nickname?: string;
    profile_image?: string;
    newPassword?: string;
    currentPassword?: string;
  }) => {
    try {
      // 변경사항이 없는 경우 API 호출하지 않음 (이미 프론트에서 처리)
      if (Object.keys(updatedData).length === 0) {
        return { status: 'ERROR', message: '변경사항이 없습니다.' };
      }
      const res = await axios.put(
        `${process.env.REACT_APP_API_SERVER}/li/user/profile`,
        updatedData,
        { withCredentials: true },
      );

      if (res.data.status === 'SUCCESS') {
        // 업데이트된 데이터로 상태 갱신
        console.log(' 프로필 업데이트 내역 조회::', res.data);
        setUserData(prev => ({
          ...prev,
          nickname: res.data.data.nickname || prev.nickname,
          profile_image: res.data.data.profile_image || prev.profile_image,
        }));
        return res.data;
      } else {
        alert(res.data.message);
        return res.data;
      }
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      alert('프로필 수정 중 오류가 발생했습니다.');
      return null;
    }
  };

  // 컴포넌트 mount 시 자동 조회
  useEffect(() => {
    getUserProfile();
  }, []);

  return { userData, getUserProfile, updateUserProfile };
}
