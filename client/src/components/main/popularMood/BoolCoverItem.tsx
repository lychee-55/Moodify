import { useRef, useState, useEffect, useMemo } from 'react';
import { Book } from '../../../types/post';
import Avvvatars from 'avvvatars-react';

export default function BookCoverItem({ book }: { book: Book }) {
  const [imageError, setImageError] = useState(false);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [avatarSize, setAvatarSize] = useState(180); // 기본 크기

  const getImageUrl = (): string | undefined => {
    if (!book.post_image) return undefined;
    return book.post_image.startsWith('http')
      ? book.post_image
      : `${process.env.REACT_APP_API_SERVER}${book.post_image}`;
  };

  const imageUrl = getImageUrl();
  const showImage = imageUrl && !imageError;

  // 🟡 Aurora Gradient 목록 중 하나를 랜덤 선택 (렌더링마다 고정되도록 useMemo 사용)
  const gradientClass = useMemo(() => {
    const gradients = [
      'bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-300',
      'bg-gradient-to-tr from-green-200 via-blue-200 to-purple-300',
      'bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-300',
      'bg-gradient-to-bl from-cyan-200 via-green-200 to-blue-300',
      'bg-gradient-to-r from-fuchsia-200 via-emerald-200 to-sky-300',
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  }, []);

  return (
    <div className="book-cover w-[230px] mx-auto transition-all duration-300 hover:scale-105">
      {/* 책 커버 이미지 또는 아바타 */}
      {showImage ? (
        <img
          src={imageUrl}
          alt={book.title || '게시물 이미지'}
          loading="lazy"
          className="w-full h-64 object-cover rounded-lg shadow-md"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={`w-full h-64 rounded-lg shadow-md flex items-center justify-center ${gradientClass}`}
          ref={avatarContainerRef}
        >
          <Avvvatars
            value={book.author?.nickname || '익명'}
            style="shape"
            size={avatarSize}
            border={false} // border 제거
            // 배경 투명 지정 (기본 아바타 스타일에 따라 다를 수 있음)
            shadow={false}
          />
        </div>
      )}
      {/* 텍스트 영역 */}
      <div className="mt-3 p-2">
        <h3 className="text-lg font-bold truncate">{book.title}</h3>
        <p className="text-sm text-gray-500">by {book.author.nickname}</p>
      </div>
    </div>
  );
}
