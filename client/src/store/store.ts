import { configureStore } from '@reduxjs/toolkit';
import checkSessionReducer from './modules/checkSessionSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; // sessionStorage를 사용

const persistConfig = {
  key: 'checkSession',
  storage: storageSession, // sessionStorage를 사용하여 상태 저장
};

const persistedCheckSessionReducer = persistReducer(
  persistConfig,
  checkSessionReducer,
);

const store = configureStore({
  reducer: {
    checkSession: persistedCheckSessionReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Redux Persist 관련 직렬화 오류 방지
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
