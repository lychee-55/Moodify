import { useEffect } from 'react';
import axios from 'axios';

export default function SessionChecker() {
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/li/user/check-session`,
          { withCredentials: true },
        );

        console.log('현재 로그인된 사용자:', response.data);
      } catch (error) {
        console.error('세션 확인 중 오류 발생:', error);
      }
    };

    checkAuthStatus();
  }, []);

  return null; // 화면에 아무것도 렌더링하지 않음
}
