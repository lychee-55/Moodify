// src/components/common/MyProfileAvvvatars.tsx
import Avvvatars from 'avvvatars-react';

interface MyProfileAvvvatarsProps {
  nickname: string;
}

export default function MyProfileAvvvatars({
  nickname,
}: MyProfileAvvvatarsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avvvatars value={nickname} style="shape" size={96} />
      {/* <p className="text-sm text-gray-500">자동 생성된 프로필입니다</p> */}
    </div>
  );
}
