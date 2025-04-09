// components/ProfileEditForm.tsx
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import {
  User,
  Lock,
  Mail,
  Check,
  X,
  CheckCircle,
  Edit,
  ArrowLeft,
} from 'lucide-react';
import Avvvatars from 'avvvatars-react';
import { useSelector } from 'react-redux';
import NicknameInput from '../components/inputs/Nicknameinput';
import PasswordInput from '../components/inputs/Passwordinput';
import useUserData from '../hook/useUserData';
import { RootState } from '../store/store';
import axios from 'axios';

export default function ProfileEditForm() {
  const { userData, updateUserProfile } = useUserData();
  const authProvider = useSelector(
    (state: RootState) => state.checkSession.authProvider,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(userData.nickname);
  const [avatarSeed, setAvatarSeed] = useState(userData.nickname);
  const [nicknameStatus, setNicknameStatus] = useState<
    'idle' | 'checking' | 'valid' | 'invalid'
  >('idle');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // 프로필 데이터 변경 시 상태 업데이트
  useEffect(() => {
    setNickname(userData.nickname);
    setAvatarSeed(userData.profile_image);
  }, [userData]);

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameStatus('idle');
  };

  const handleAvatarSeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatarSeed(e.target.value);
  };

  const handleNicknameCheck = async () => {
    if (!nickname) return;

    setNicknameStatus('checking');
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/user/check-nickname?nickname=${nickname}`,
      );
      console.log(response.data);
      if (response.data.status === 'SUCCESS') {
        setNicknameStatus('valid');
      } else if (
        response.data.status === 'ERROR' &&
        response.data.message.includes('닉네임')
      ) {
        setNicknameStatus('invalid');
      } else {
        alert(response.data.message);
        setNicknameStatus('idle');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setNicknameStatus('invalid');
        } else {
          alert('서버 오류가 발생했습니다. 관리자에게 문의해주세요.');
          setNicknameStatus('idle');
        }
      }
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    else if (name === 'confirmPassword') setConfirmPassword(value);
    else if (name === 'currentPassword') setCurrentPassword(value);
  };

  // ProfileEditForm.tsx 중 verifyCurrentPassword 함수 수정
  const verifyCurrentPassword = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/li/user/profile/check-password`,
        { password: currentPassword },
        {
          withCredentials: true,
        },
      );

      if (response.data.status === 'SUCCESS') {
        setPasswordVerified(true);
        setShowPasswordFields(true);
      } else {
        alert(response.data.message);
        setCurrentPassword('');
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      alert('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  const isPasswordValid = (pw: string) => {
    return (
      pw.length >= 8 &&
      /[a-zA-Z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^a-zA-Z0-9]/.test(pw)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 변경사항 체크
    const isNicknameChanged = nickname !== userData.nickname;
    const isAvatarSeedChanged = avatarSeed !== userData.profile_image; // 프로필 이미지 seed는 원래 닉네임 기준
    const isPasswordChanged = showPasswordFields && password;

    // 변경사항이 없는 경우
    if (!isNicknameChanged && !isAvatarSeedChanged && !isPasswordChanged) {
      alert('변경사항이 없습니다.');
      return;
    }

    // 닉네임 변경 시 중복 확인 필수
    if (isNicknameChanged && nicknameStatus !== 'valid') {
      alert('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    // 비밀번호 변경 시 현재 비밀번호 확인 필수 (이메일 로그인 사용자만)
    if (isPasswordChanged && authProvider === 'email' && !passwordVerified) {
      alert('현재 비밀번호 확인을 완료해주세요.');
      return;
    }

    try {
      const updatedData: {
        nickname?: string;
        profile_image?: string;
        newPassword?: string;
      } = {};

      // 변경된 필드만 추가
      if (isNicknameChanged) updatedData.nickname = nickname;
      if (isAvatarSeedChanged) updatedData.profile_image = avatarSeed;
      if (isPasswordChanged) updatedData.newPassword = password;

      const result = await updateUserProfile(updatedData);

      if (result?.status === 'SUCCESS') {
        alert('프로필이 성공적으로 업데이트되었습니다.');
        setIsEditing(false);
        setPasswordVerified(false);
        setShowPasswordFields(false);
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
      } else {
        alert(result?.message || '프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  // 닉네임 변경 감지
  useEffect(() => {
    if (nickname !== userData.nickname) {
      setNicknameStatus('idle');
    }
  }, [nickname, userData.nickname]);

  const toggleEdit = () => {
    if (isEditing) {
      // 취소 버튼 클릭 시 (편집 모드 -> 읽기 모드)
      setNickname(userData.nickname); // 닉네임 초기화
      setAvatarSeed(userData.profile_image || userData.nickname); // 프로필 이미지 초기화
      setNicknameStatus('idle'); // 닉네임 상태 초기화
      setCurrentPassword(''); // 현재 비밀번호 초기화
      setPassword(''); // 새 비밀번호 초기화
      setConfirmPassword(''); // 비밀번호 확인 초기화
      setPasswordVerified(false); // 비밀번호 검증 상태 초기화
      setShowPasswordFields(false); // 비밀번호 필드 숨기기
    }
    setIsEditing(!isEditing); // 편집 모드 토글
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            프로필 수정
          </h2>

          <form onSubmit={handleSubmit}>
            {/* 프로필 이미지 섹션 */}
            <div
              className={`mb-8 ${
                isEditing
                  ? 'flex flex-col sm:flex-row items-center sm:items-start gap-6'
                  : 'flex justify-center'
              }`}
            >
              <div className="flex flex-col items-center">
                <Avvvatars value={avatarSeed} style="shape" size={140} />
              </div>

              {isEditing && (
                <div className="w-full sm:flex-1 flex flex-col gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      프로필 이미지 생성
                    </h3>
                    <p className="text-xs text-gray-500">
                      아래 입력창을 기반으로 프로필 이미지를 자동 생성하여
                      사용할 수 있습니다.
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        id="avatarSeed"
                        name="avatarSeed"
                        type="text"
                        value={avatarSeed}
                        onChange={handleAvatarSeedChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                        placeholder="프로필 이미지를 생성할 텍스트 입력"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 이메일 입력 (카카오 로그인 시 숨김) */}
            {authProvider === 'email' && (
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이메일
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    readOnly
                    value={userData.email}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* 닉네임 입력 */}
            <div className="mb-6">
              {isEditing ? (
                <NicknameInput
                  nickname={nickname}
                  nicknameStatus={nicknameStatus}
                  onChange={handleNicknameChange}
                  onCheck={handleNicknameCheck}
                />
              ) : (
                <>
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    닉네임
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      readOnly
                      value={nickname}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none text-gray-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* 비밀번호 변경 섹션 (카카오 로그인 시 숨김) */}
            {authProvider === 'email' && isEditing && (
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      비밀번호 변경
                    </span>
                  </div>
                </div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mt-5 mb-1"
                >
                  현재 비밀번호
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56] text-gray-700"
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                  </div>
                  {!passwordVerified && (
                    <button
                      type="button"
                      onClick={verifyCurrentPassword}
                      disabled={!currentPassword}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors disabled:opacity-50 w-[55px] sm:w-[90px]"
                    >
                      <span className="hidden sm:inline">확인</span>
                      <CheckCircle className="inline sm:hidden h-5 w-5" />
                    </button>
                  )}
                </div>
                {passwordVerified && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    비밀번호가 확인되었습니다. 새 비밀번호를 입력해주세요.
                  </p>
                )}

                {showPasswordFields && (
                  <div className="mt-4 space-y-4">
                    <PasswordInput
                      password={password}
                      confirmPassword={confirmPassword}
                      onChange={handlePasswordChange}
                      showTooltip={showTooltip}
                      toggleTooltip={() => setShowTooltip(!showTooltip)}
                      isPasswordValid={isPasswordValid}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 버튼 그룹 */}
            <div className="mt-8 flex justify-center space-x-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-6 py-3 bg-[#adcf56] hover:bg-[#9bbf46] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    <span>프로필 수정</span>
                  </div>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleEdit}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      <span>취소</span>
                    </div>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#adcf56] hover:bg-[#9bbf46] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    변경 내용 저장
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
