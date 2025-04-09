// components/PasswordInput.tsx
import { Lock, AlertCircle, X } from 'lucide-react';

type Props = {
  password: string;
  confirmPassword: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showTooltip: boolean;
  toggleTooltip: () => void;
  isPasswordValid: (pw: string) => boolean;
};

export default function PasswordInput({
  password,
  confirmPassword,
  onChange,
  showTooltip,
  toggleTooltip,
  isPasswordValid,
}: Props) {
  return (
    <>
      <div>
        {/* 비밀번호 */}
        <div className="flex items-center">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            비밀번호
          </label>
          <button
            type="button"
            data-tooltip-id="password-tooltip"
            className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            onClick={toggleTooltip}
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
            value={password}
            onChange={onChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        {password && !isPasswordValid(password) && (
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
            value={confirmPassword}
            onChange={onChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <X className="h-4 w-4 mr-1" />
            입력하신 비밀번호와 일치하지 않습니다
          </p>
        )}
      </div>
    </>
  );
}
