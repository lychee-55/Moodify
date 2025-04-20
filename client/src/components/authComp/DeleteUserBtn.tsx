// 파일 위치 예시: src/components/Account/WithdrawButton.tsx

import axios from 'axios';
import { ArrowRight } from 'lucide-react';

const DeleteUserBtn = () => {
  const handleWithdraw = async () => {
    const confirmed = window.confirm('정말로 회원탈퇴를 진행하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/li/user/delete-account`,
        {},
        {
          withCredentials: true, // 세션 사용 시 필수
        },
      );

      if (response.data.status === 'SUCCESS') {
        alert('회원 탈퇴가 완료되었습니다.');
        // 필요 시 메인 페이지로 이동 등 처리
        window.location.href = '/'; // 예: 홈으로 이동
      } else {
        alert(`회원 탈퇴 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error('회원탈퇴 요청 중 오류:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    // <button
    //   onClick={handleWithdraw}
    //   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    // >
    //   회원탈퇴
    // </button>
    <button
      type="button"
      onClick={handleWithdraw}
      className="px-6 py-3 bg-gray-100 hover:bg-red-500 text-white rounded-md text-sm font-medium hover:text-red-500 transition-colors"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-gray-400 right-0 hover:text-white">
        회원탈퇴
        <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </button>
  );
};

export default DeleteUserBtn;
