// components/PostItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Post } from '../../../types/post';
import Avvvatars from 'avvvatars-react';

interface Props {
  post: Post;
  onClick: () => void;
}

const PostItem = React.memo(({ post, onClick }: Props) => {
  // 태그 컴포넌트 분리 */
  const TagItem = ({ tag }: { tag: string }) => {
    if (!tag) return null;

    // 랜덤 색상 생성 (미리 정의된 색상 팔레트에서 선택)
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
      <div
        className={`${randomColor} text-white px-2 py-1 rounded-full text-xs`}
      >
        #{tag}
      </div>
    );
  };

  const [imageError, setImageError] = useState(false);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [avatarSize, setAvatarSize] = useState(180); // 기본 크기

  // 컨테이너 크기에 따라 아바타 크기 조정
  useEffect(() => {
    const updateSize = () => {
      if (avatarContainerRef.current) {
        const containerWidth = avatarContainerRef.current.offsetWidth;
        setAvatarSize(Math.min(containerWidth, 150)); // 최대 180px로 제한
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // 이미지 URL 생성 및 유효성 검사
  const getImageUrl = (): string | undefined => {
    if (!post.post_image) return undefined;
    return post.post_image.startsWith('http')
      ? post.post_image
      : `${process.env.REACT_APP_API_SERVER}${post.post_image}`;
  };

  const imageUrl = getImageUrl();
  const showImage = imageUrl && !imageError;

  return (
    <div className="mb-4 flex justify-center" onClick={onClick}>
      <div className="relative rounded-lg overflow-hidden group shadow-md w-full">
        {/* 고정된 1:1 비율 이미지 컨테이너 */}
        <div className="relative" style={{ paddingBottom: '100%' }}>
          {showImage ? (
            <img
              src={imageUrl}
              alt={post.title || '게시물 이미지'}
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#adcf56]"
              ref={avatarContainerRef}
            >
              <div className="overflow-hidden rounded-none w-[90%] h-[90%] flex items-center justify-center">
                <Avvvatars
                  value={post.author?.nickname || '익명'}
                  style="shape"
                  size={avatarSize}
                  border
                  borderColor="#ffffff"
                />
              </div>
            </div>
          )}
        </div>

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 text-white p-4 flex flex-col transition-opacity duration-300">
          {/* 제목 - 왼쪽 상단 */}
          <p className="text-lg font-semibold line-clamp-2 mb-2">
            {post.title || '제목 없음'}
          </p>

          {/* 하단 영역 (태그 + 프로필) */}
          <div className="mt-auto flex justify-between items-end">
            {/* 태그 영역 - 왼쪽 */}
            <div className="flex flex-wrap gap-2 max-w-[70%]">
              {post.tags?.split(',').map((tag, index) => (
                <TagItem key={index} tag={tag.trim()} />
              ))}
            </div>

            {/* 프로필 이미지 - 오른쪽 */}
            <div className="w-10 h-10">
              <Avvvatars
                value={post.author?.profile_image || post.author?.nickname}
                style="shape"
                size={40}
                border
                borderColor="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PostItem;

// // components / PostItem.tsx;
// import React from 'react';
// import { Post } from '../../../types/post';

// const PostItem = React.memo(({ post }: { post: Post }) => {
//   return (
//     <div className="px-2 w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
//       <div className="relative rounded-lg overflow-hidden group shadow-md w-full">
//         {/* 게시글 이미지 */}
//         <img
//           src={post.post_image}
//           alt={post.title}
//           loading="lazy"
//           className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
//         />

//         {/* 마우스 hover 시 나타나는 오버레이 정보 */}
//         <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 text-white p-4 flex flex-col justify-end transition-opacity duration-300">
//           <p className="text-sm mb-1">작성자: {post.author.profile_image}</p>
//           <p className="text-lg font-semibold">{post.title}</p>
//           <p className="text-xs">{post.tags}</p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default PostItem;

// // PostItem.tsx
// import { memo, useState } from 'react';

// // 타입 분리 (types.ts로 관리 권장)
// export interface Post {
//   id: number;
//   imageUrl: string;
//   title: string;
//   author: string;
//   createdAt: string; // 필드명 확인! (createdAt → createdAt)
//   summary?: string;
//   // 추가 필드 필요 시 확장
// }

// function PostItem({ post }: { post: Post }) {
//   const [isHovered, setIsHovered] = useState(false);

//   // 날짜 포맷팅 유틸리티
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('ko-KR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   return (
//     <div
//       className="post-item"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       aria-label={`게시글: ${post.title}`}
//     >
//       <img
//         src={post.imageUrl}
//         alt={post.title}
//         className="post-image"
//         loading="lazy"
//       />

//       {isHovered && (
//         <div className="post-info">
//           <h3>{post.title}</h3>
//           <p className="author">작성자: {post.author}</p>
//           <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
//           {post.summary && <p className="summary">{post.summary}</p>}
//         </div>
//       )}
//     </div>
//   );
// }

// export default memo(PostItem);
