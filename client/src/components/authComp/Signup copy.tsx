import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import MyProfileAvvvatars from './MyProfileAvvvatars';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'checking' | 'valid' | 'invalid'
  >('idle');
  const [nicknameStatus, setNicknameStatus] = useState<
    'idle' | 'checking' | 'valid' | 'invalid'
  >('idle');
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'email') setEmailStatus('idle');
    if (name === 'nickname') setNicknameStatus('idle');
  };

  const handleEmailCheck = async () => {
    if (!formData.email) return;

    setEmailStatus('checking');
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/user/check-email?email=${formData.email}`,
      );
      console.log(response.data);
      if (response.data.status === 'SUCCESS') {
        setEmailStatus('valid');
      } else if (
        response.data.status === 'ERROR' &&
        response.data.message.includes('이메일')
      ) {
        setEmailStatus('invalid');
      } else {
        alert(response.data.message);
        setEmailStatus('idle');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '서버 오류가 발생했습니다.');
      }
      setEmailStatus('idle');
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname) return;

    setNicknameStatus('checking');
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/user/check-nickname?nickname=${formData.nickname}`,
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

  const isPasswordValid = (pw: string) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pw);
  };

  const isFormValid =
    emailStatus === 'valid' &&
    nicknameStatus === 'valid' &&
    isPasswordValid(formData.password) &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/li/user/sign-up`,
        {
          email: formData.email,
          nickname: formData.nickname,
          password: formData.password,
          profile_image: formData.nickname,
        },
      );

      if (response.data.status === 'SUCCESS') {
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        navigate('/li/user/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          alert('입력 정보를 확인해주세요.');
        } else if (error.response?.status === 409) {
          alert('이미 가입된 이메일 또는 닉네임입니다.');
        } else {
          alert('서버 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* <div className="mx-auto w-full max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900"> */}
      <div className="mx-auto w-full max-w-md text-center mb-8">
        {' '}
        {/* mb-8 추가로 통일 */}
        <h2 className="text-3xl font-extrabold text-gray-900">SIGN UP</h2>
        <p className="mt-2 text-sm text-gray-600">
          당신만의 <span className="pacifico-regular">Moodify</span> 계정을
          만들어보세요!
        </p>
        {/* <p className="mt-2 text-sm text-gray-600">
          Create your <span className="pacifico-regular">Moodify</span> account!
        </p> */}
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* 프로필 아바타 미리보기 */}
            <MyProfileAvvvatars nickname={formData.nickname} />
            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                    placeholder="example@moodify.com"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleEmailCheck}
                  disabled={emailStatus === 'checking' || !formData.email}
                  className={`py-3 px-4 rounded-r-md border-l-0 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#adcf56] ${
                    emailStatus === 'checking'
                      ? 'bg-gray-100'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {emailStatus === 'checking' ? '확인중...' : '중복확인'}
                  </span>
                  <CheckCircle className="inline sm:hidden h-5 w-5" />
                </button>
              </div>
              {emailStatus !== 'idle' && (
                <p
                  className={`mt-1 text-sm flex items-center ${
                    emailStatus === 'valid'
                      ? 'text-green-600'
                      : emailStatus === 'invalid'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {emailStatus === 'checking' ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      이메일 확인 중...
                    </>
                  ) : emailStatus === 'valid' ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> 사용 가능한
                      이메일입니다
                    </>
                  ) : emailStatus === 'invalid' ? (
                    <>
                      <X className="h-4 w-4 mr-1" /> 이미 사용 중인 이메일입니다
                    </>
                  ) : null}
                </p>
              )}
            </div>

            {/* 닉네임 입력 */}
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700"
              >
                닉네임
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNicknameCheck}
                  disabled={nicknameStatus === 'checking' || !formData.nickname}
                  className={`py-3 px-4 rounded-r-md border-l-0 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#adcf56] ${
                    nicknameStatus === 'checking'
                      ? 'bg-gray-100'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {nicknameStatus === 'checking' ? '확인중...' : '중복확인'}
                  </span>
                  <CheckCircle className="inline sm:hidden h-5 w-5" />
                </button>
              </div>
              {nicknameStatus !== 'idle' && (
                <p
                  className={`mt-1 text-sm flex items-center ${
                    nicknameStatus === 'valid'
                      ? 'text-green-600'
                      : nicknameStatus === 'invalid'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {nicknameStatus === 'checking' ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      닉네임 확인 중...
                    </>
                  ) : nicknameStatus === 'valid' ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> 사용 가능한
                      닉네임입니다
                    </>
                  ) : nicknameStatus === 'invalid' ? (
                    <>
                      <X className="h-4 w-4 mr-1" /> 이미 사용 중인 닉네임입니다
                    </>
                  ) : null}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              {/* 비밀번호 입력 라벨 부분 */}
              <div className="flex items-center ">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호
                </label>
                {'   '}
                <button
                  type="button"
                  data-tooltip-id="password-tooltip"
                  className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  onClick={() => setShowPasswordTooltip(!showPasswordTooltip)}
                >
                  <AlertCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              {formData.password && !isPasswordValid(formData.password) && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  8자 이상의 영문, 숫자, 특수문자를 입력해주세요.
                </p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    입력하신 비밀번호와 일치하지 않습니다
                  </p>
                )}
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#adcf56] transition-colors ${
                  isFormValid && !isSubmitting
                    ? 'bg-[#adcf56] hover:bg-[#8aac34]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    처리 중...
                  </>
                ) : (
                  '회원가입'
                )}
              </button>
            </div>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/li/user/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#adcf56] transition-colors"
              >
                로그인 하기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 비밀번호 툴팁 */}
      {/* 기존 코드에서 변경된 부분만 표시 */}
      <Tooltip
        id="password-tooltip"
        place="top"
        className="z-50 max-w-xs bg-gray-800 text-white px-3 py-2 text-sm rounded-md shadow-lg"
        isOpen={showPasswordTooltip}
        content="영문, 숫자, 특수문자(@$!%*?&)를 포함해 8자 이상 입력해주세요"
      />
    </div>
  );
}
