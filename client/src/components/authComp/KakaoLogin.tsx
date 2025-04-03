export default function KakaoLogin() {
  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_SERVER}/li/user/kakao-login`;
  };
  return (
    <>
      <button
        onClick={handleKakaoLogin}
        className="w-full flex justify-center items-center px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 bg-[#FEE500] hover:bg-[#FEE500]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]/50 transition-colors"
      >
        <img
          src="/asset/kakao_login_medium_wide.png"
          alt="카카오 로그인"
          className="h-auto w-auto"
        />
      </button>
    </>
  );
}
