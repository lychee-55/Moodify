import { useEffect, useState } from 'react';
import PostItem from './PostItem';
import axios from 'axios';

// API 응답 타입 정의 (백엔드와 일치시키기)
interface ApiPost {
  post_id: number; // 주의: id → post_id로 변경
  title: string;
  post_image: string; // imageUrl → post_image
  tags: string[];
  author: {
    user_id: string; // author 필드가 객체로 변경
    profile_image: string; // authorImage → author.profile_image
  };
  created_at: string; // createdAt → created_at
}

// 프론트엔드에서 사용할 Post 타입
interface Post {
  id: number;
  title: string;
  imageUrl: string;
  author: string;
  authorImage: string;
  createdAt: string;
  tags?: string[]; // 추가 필드
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<{ data: ApiPost[] }>(
          `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/moodList`,
          { withCredentials: true },
        );

        // API 응답 → 프론트엔드 타입으로 변환
        const transformedPosts = response.data.data.map((apiPost: ApiPost) => ({
          id: apiPost.post_id,
          title: apiPost.title,
          imageUrl: apiPost.post_image,
          author: apiPost.author.user_id, // user_id를 author 문자열로
          authorImage: apiPost.author.profile_image,
          createdAt: apiPost.created_at, // 필드명 변환
          tags: apiPost.tags,
        }));

        setPosts(transformedPosts);
        setError(null);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
        setError('게시글을 불러오지 못했습니다.');
        setPosts([]); // 에러 시 빈 배열로 초기화
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 로딩/에러 상태 처리
  if (loading) return <div className="loading-spinner">🌀 로딩 중...</div>;
  if (error) return <div className="error-message">⚠️ {error}</div>;
  if (posts.length === 0) return <div>표시할 게시글이 없습니다.</div>;

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
