// components/PostList.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PostItem from './PostItem';
import axios from 'axios';
import { Post } from '../../../types/post';
import DescriptionPage from '../../../pages/DescriptionPage';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]); // 게시글 목록 상태
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const observerRef = useRef<HTMLDivElement | null>(null); // 무한스크롤 관찰 대상 ref
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleOpenPost = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
  };

  // 게시글 데이터를 서버에서 가져오는 함수
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/moodList?page=${page}&limit=10`,
        { withCredentials: true },
      );

      const data = res.data.data;

      // 새 데이터를 기존 게시글에 추가
      // 중복 제거 후 상태 업데이트
      setPosts(prev => {
        const existingIds = new Set(prev.map((p: Post) => p.post_id));
        const newPosts = data.filter((p: Post) => !existingIds.has(p.post_id));
        return [...prev, ...newPosts];
      });

      // 데이터가 더 없으면 hasMore를 false로 설정하여 무한스크롤 중단
      if (data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('게시글을 불러오는 중 오류 발생:', error);
    }
  }, [page]);

  // 페이지 번호가 바뀔 때마다 fetchPosts 실행
  useEffect(() => {
    if (hasMore) fetchPosts();
  }, [page, fetchPosts, hasMore]);

  // IntersectionObserver로 무한스크롤 구현
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1); // 화면 끝에 도달 시 다음 페이지 요청
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore]);

  return (
    // 수정 후
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 px-4">
      {posts.map(post => (
        <PostItem
          key={post.post_id}
          post={post}
          onClick={() => handleOpenPost(post.post_id)}
        />
      ))}
      {selectedPostId !== null && (
        <DescriptionPage postId={selectedPostId} onClose={handleClosePost} />
      )}

      {/* 관찰 대상 div: 이 요소가 화면에 보이면 다음 페이지를 로드함 */}
      <div ref={observerRef} className="h-10 col-span-full" />
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import PostItem from './PostItem';
// import axios from 'axios';

// // API 응답 타입 정의 (백엔드와 일치시키기)
// interface ApiPost {
//   post_id: number; // 주의: id → post_id로 변경
//   title: string;
//   post_image: string; // imageUrl → post_image
//   tags: string[];
//   author: {
//     user_id: string; // author 필드가 객체로 변경
//     profile_image: string; // authorImage → author.profile_image
//   };
//   created_at: string; // createdAt → created_at
// }

// // 프론트엔드에서 사용할 Post 타입
// interface Post {
//   id: number;
//   title: string;
//   imageUrl: string;
//   author: string;
//   authorImage: string;
//   createdAt: string;
//   tags?: string[]; // 추가 필드
// }

// export default function PostList() {
//   // const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // useEffect(() => {
//   //   const fetchPosts = async () => {
//   //     try {
//   //       const response = await axios.get(
//   //         `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/moodList`,
//   //         { withCredentials: true },
//   //       );
//   //       // const response = await axios.get<{ data: ApiPost[] }>(
//   //       //   `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/moodList`,
//   //       //   { withCredentials: true },
//   //       // );
//   //       console.log(response.data);

//   //       // // API 응답 → 프론트엔드 타입으로 변환
//   //       // console.log(response.data);
//   //       // const transformedPosts = response.data.data.map((apiPost: ApiPost) => ({
//   //       //   id: apiPost.post_id,
//   //       //   title: apiPost.title,
//   //       //   imageUrl: apiPost.post_image,
//   //       //   author: apiPost.author.user_id, // user_id를 author 문자열로
//   //       //   authorImage: apiPost.author.profile_image,
//   //       //   createdAt: apiPost.created_at, // 필드명 변환
//   //       //   tags: apiPost.tags,
//   //       // }));

//   //       // setPosts(transformedPosts);
//   //       setError(null);
//   //     } catch (err) {
//   //       console.error('게시글 조회 실패:', err);
//   //       setError('게시글을 불러오지 못했습니다.');
//   //       setPosts([]); // 에러 시 빈 배열로 초기화
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchPosts();
//   // }, []);

//   const posts = [
//     {
//       id: 1,
//       title: '이것은 타이틀',
//       imageUrl: 'string',
//       author: '테스트',
//       authorImage: '테스트',
//       createdAt: '2024-01-15',
//       tags: ['태그1', '태그2'],
//     },
//     {
//       id: 2,
//       title: '이것은 틀',
//       imageUrl: 'strig',
//       author: '테트',
//       authorImage: '테스',
//       createdAt: '2024-0-15',
//       tags: ['그1', '그2'],
//     },
//   ];
//   // 로딩/에러 상태 처리
//   if (loading) return <div className="loading-spinner">🌀 로딩 중...</div>;
//   if (error) return <div className="error-message">⚠️ {error}</div>;
//   if (posts.length === 0) return <div>표시할 게시글이 없습니다.</div>;

//   return (
//     <div className="post-list">
//       {posts.map(post => (
//         <PostItem key={post.id} post={post} />
//       ))}
//     </div>
//   );
// }
