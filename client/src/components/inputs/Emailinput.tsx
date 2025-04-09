// components/EmailInput.tsx
import { Mail, Check, X, CheckCircle } from 'lucide-react';

type Props = {
  email: string;
  emailStatus: 'idle' | 'checking' | 'valid' | 'invalid';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck: () => void;
};

export default function EmailInput({
  email,
  emailStatus,
  onChange,
  onCheck,
}: Props) {
  return (
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
            value={email}
            onChange={onChange}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
            placeholder="example@moodify.com"
          />
        </div>
        <button
          type="button"
          onClick={onCheck}
          disabled={emailStatus === 'checking' || !email}
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
              <Check className="h-4 w-4 mr-1" /> 사용 가능한 이메일입니다
            </>
          ) : emailStatus === 'invalid' ? (
            <>
              <X className="h-4 w-4 mr-1" /> 이미 사용 중인 이메일입니다
            </>
          ) : null}
        </p>
      )}
    </div>
  );
}
