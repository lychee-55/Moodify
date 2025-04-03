import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import KakaoLogin from './KakaoLogin';
import { login } from '../../store/modules/checkSessionSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/li/user/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // 세션 사용 시 필수
        },
      );

      if (response.data.status === 'SUCCESS') {
        const { nickname, auth_provider } = response.data.data;

        // Redux Store에 로그인 정보 저장
        dispatch(login({ nickname, authProvider: auth_provider }));

        alert('로그인 성공!');
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message || '로그인 중 오류가 발생했습니다.',
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] flex flex-col items-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">LOGIN</h2>
        <p className="mt-2 text-sm text-gray-600">
          <span className="pacifico-regular">Moodify</span>에 로그인하여 당신의
          무드를 공유하세요!
        </p>
      </div>
      <div className=" mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
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
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                  placeholder="example@moodify.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  to="/find-password"
                  className="font-medium text-[#adcf56] hover:text-[#8aac34] flex items-center"
                >
                  비밀번호를 잊으셨나요?
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#adcf56] hover:bg-[#8aac34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#adcf56] transition-colors"
              >
                로그인
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  또는 소셜 계정으로 로그인
                </span>
              </div>
            </div>

            <div className="mt-6">
              <KakaoLogin />
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    아직 회원이 아니신가요?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/li/user/sign-up"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#adcf56] transition-colors"
                >
                  회원가입 하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
