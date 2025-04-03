// src/store/modules/checkSessionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckSessionState {
  nickname: string | null;
  authProvider: string | null; // 'kakao' | 'email'
  sessionValid: boolean;
  showAlert: boolean; // 특정 컴포넌트에서만 alert 여부 관리
}

const initialState: CheckSessionState = {
  nickname: null,
  authProvider: null,
  sessionValid: false,
  showAlert: true, // 기본값은 alert를 띄우도록 설정
};

const checkSessionSlice = createSlice({
  name: 'checkSession',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ nickname: string; authProvider: string }>,
    ) => {
      state.nickname = action.payload.nickname;
      state.authProvider = action.payload.authProvider;
      state.sessionValid = true;
      state.showAlert = true; // 로그인 시 alert 사용 가능하도록 초기화
    },
    logout: state => {
      state.nickname = null;
      state.authProvider = null;
      state.sessionValid = false;
      state.showAlert = false; // 로그아웃 후 alert 비활성화
    },
    setSessionStatus: (state, action: PayloadAction<boolean>) => {
      state.sessionValid = action.payload;
      if (!action.payload) {
        state.nickname = null;
        state.authProvider = null;
      }
    },
    setAuthProvider: (state, action: PayloadAction<string>) => {
      state.authProvider = action.payload;
    },
    deleteAccount: state => {
      state.nickname = null;
      state.authProvider = null;
      state.sessionValid = false;
    },
    disableAlert: state => {
      state.showAlert = false; // 특정 컴포넌트에서 alert 비활성화
    },
  },
});

export const {
  login,
  logout,
  setSessionStatus,
  setAuthProvider,
  deleteAccount,
  disableAlert,
} = checkSessionSlice.actions;
export default checkSessionSlice.reducer;
