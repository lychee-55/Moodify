// src/components/SessionChecker.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { disableAlert } from '../store/modules/checkSessionSlice';
import { useNavigate } from 'react-router-dom';

const SessionChecker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionValid, showAlert } = useSelector(
    (state: RootState) => state.checkSession,
  );

  useEffect(() => {
    if (!sessionValid && showAlert) {
      alert('로그인이 필요합니다.');
      dispatch(disableAlert()); // alert 1회 실행 후 비활성화
      navigate('/li/user/login'); // 세션이 없으면 로그인 페이지로 이동
    }
  }, [sessionValid, showAlert, dispatch, navigate]);
};

export default SessionChecker;
