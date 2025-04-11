// PostItem.tsx
import { memo, useState } from 'react';

// 타입 분리 (types.ts로 관리 권장)
export interface Post {
  id: number;
  imageUrl: string;
  title: string;
  author: string;
  createdAt: string; // 필드명 확인! (createdAtt → createdAt)
  summary?: string;
  // 추가 필드 필요 시 확장
}

function PostItem({ post }: { post: Post }) {
  const [isHovered, setIsHovered] = useState(false);

  // 날짜 포맷팅 유틸리티
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="post-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`게시글: ${post.title}`}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="post-image"
        loading="lazy"
      />

      {isHovered && (
        <div className="post-info">
          <h3>{post.title}</h3>
          <p className="author">작성자: {post.author}</p>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          {post.summary && <p className="summary">{post.summary}</p>}
        </div>
      )}
    </div>
  );
}

export default memo(PostItem);
