// 📁 src/pages/FindPassword.tsx
import { Mail, ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function FindPassword() {
  const [email, setEmail] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('이메일을 입력해 주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/li/user/find-password`,
        { email },
        {
          //   headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      if (response.data.status === 'SUCCESS') {
        alert('임시 비밀번호가 이메일로 전송되었습니다.');
        navigate('/login');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            '비밀번호 찾기 요청 중 오류가 발생했습니다.',
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] flex flex-col items-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">비밀번호 찾기</h2>
        <p className="mt-2 text-sm text-gray-600">
          가입된 이메일을 입력하면{' '}
          <span className="font-medium">임시 비밀번호</span>가 전송됩니다.
        </p>
      </div>

      <div className="mx-auto w-full max-w-md">
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
                  type="email"
                  required
                  ref={emailRef}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                  placeholder="example@moodify.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#adcf56] hover:bg-[#8aac34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#adcf56] transition-colors"
              >
                임시 비밀번호 받기
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-[#adcf56] hover:text-[#8aac34] flex justify-center items-center mx-auto"
            >
              로그인 페이지로 돌아가기
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
