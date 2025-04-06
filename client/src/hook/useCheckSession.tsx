// // src/components/SessionChecker.tsx
// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/store';
// import { disableAlert } from '../store/modules/checkSessionSlice';
// import { useNavigate } from 'react-router-dom';

// const SessionChecker = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { sessionValid, showAlert } = useSelector(
//     (state: RootState) => state.checkSession,
//   );

//   useEffect(() => {
//     if (!sessionValid && showAlert) {
//       alert('로그인이 필요합니다.');
//       dispatch(disableAlert()); // alert 1회 실행 후 비활성화
//       navigate('/li/user/login'); // 세션이 없으면 로그인 페이지로 이동
//     }
//   }, [sessionValid, showAlert, dispatch, navigate]);
// };

// export default SessionChecker;

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { login, logout } from '../store/modules/checkSessionSlice';

const useCheckSession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 이동 시 세션 체크
  useEffect(() => {
    const excludedPaths = ['/li/user/login', '/li/user/sign-up'];
    if (excludedPaths.includes(location.pathname)) return;

    // 세션 체크 함수
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/li/user/check-session`,
          { withCredentials: true },
        );
        console.log('useCheckSession파일의 data확인용::', response.data);
        if (response.data.status === 'SUCCESS') {
          const { auth_provider, nickname } = response.data.data;
          dispatch(login({ nickname, authProvider: auth_provider }));
          return true;
        }

        dispatch(logout());
        return false;
      } catch (error) {
        dispatch(logout());
        return false;
      }
    };

    checkSession().then(isValid => {
      if (!isValid && location.pathname !== '/li/user/login') {
        navigate('/li/user/login', { replace: true });
      }
    });
  }, [location.pathname]);
};

export default useCheckSession;
