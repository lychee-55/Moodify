// components/PostItem.tsx
import React from 'react';
import { Post } from '../../../types/post';

interface Props {
  post: Post;
  onClick: () => void;
}

const PostItem = React.memo(({ post, onClick }: Props) => {
  return (
    <div className="mb-4 break-inside-avoid" onClick={onClick}>
      <div className="relative rounded-lg overflow-hidden group shadow-md w-[285px] mx-auto">
        <img
          src={post.post_image}
          alt={post.title}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 text-white p-4 flex flex-col justify-end transition-opacity duration-300">
          <p className="text-sm mb-1">작성자: {post.author.profile_image}</p>
          <p className="text-lg font-semibold">{post.title}</p>
          <p className="text-xs">{post.tags}</p>
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
