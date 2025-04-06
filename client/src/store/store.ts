import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage 사용
import checkSessionReducer from './modules/checkSessionSlice';

const rootReducer = combineReducers({
  checkSession: checkSessionReducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['checkSession'], // ✅ taskReducer도 포함 가능
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Redux Persist 관련 직렬화 오류 방지
    }),
});
export const persistor = persistStore(store);
// console.log('Persistor State:', store.getState()._persist); // undefined
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
