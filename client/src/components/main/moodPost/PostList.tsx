// components/PostList.tsx
// src/components/PostList/PostList.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PostItem from './PostItem';
import axios from 'axios';
import { Post } from '../../../types/post';
import DescriptionPage from '../../../pages/DescriptionPage';

interface PostListProps {
  fetchUrl: string;
  queryParams?: Record<string, any>;
}

export default function PostList({ fetchUrl, queryParams }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const handleOpenPost = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
  };

  const fetchPosts = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    setIsLoading(true);
    isLoadingRef.current = true;

    try {
      const params = {
        page,
        limit: 10,
        ...(queryParams || {}),
      };

      const res = await axios.get(fetchUrl, {
        params,
        withCredentials: true,
      });

      const data: Post[] = res.data.data;
      console.log('postlist의 res.data::', res.data);

      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p.post_id));
        const newPosts = data.filter(p => !existingIds.has(p.post_id));
        return [...prev, ...newPosts];
      });

      // limit보다 적으면 더 이상 없음
      setHasMore(data.length === 10);
    } catch (error) {
      console.error('게시글을 불러오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchUrl, queryParams, page, hasMore]);

  useEffect(() => {
    // fetchUrl이나 queryParams가 변경될 때마다 상태 초기화
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [fetchUrl, JSON.stringify(queryParams)]); // queryParams도 문자열로 변환하여 비교

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore]);

  return (
    <div className="mx-auto px-4 w-full max-w-[1800px]">
      <div
        className={`
          grid gap-4
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-3
          lg:grid-cols-4
          w-full sm:w-[600px] md:w-[800px] lg:w-[1000px] mx-auto
        `}
      >
        {posts.map(post => (
          <PostItem
            key={post.post_id}
            post={post}
            onClick={() => handleOpenPost(post.post_id)}
          />
        ))}

        {/* 게시글 없을 때 */}
        {!isLoading && posts.length === 0 && (
          <p className="text-center py-10 col-span-full text-gray-500">
            게시글이 없습니다.
          </p>
        )}
      </div>

      {selectedPostId !== null && (
        <DescriptionPage postId={selectedPostId} onClose={handleClosePost} />
      )}

      {hasMore && (
        <div ref={observerRef} className="h-10 col-span-full">
          {isLoading && <p className="text-center py-4">로딩 중...</p>}
        </div>
      )}
    </div>
  );
}

// 성공한 코드(그냥 불러오기)
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import PostItem from './PostItem';
// import axios from 'axios';
// import { Post } from '../../../types/post';
// import DescriptionPage from '../../../pages/DescriptionPage';

// export default function PostList() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observerRef = useRef<HTMLDivElement | null>(null);
//   const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const isLoadingRef = useRef(false);

//   const handleOpenPost = (postId: number) => {
//     setSelectedPostId(postId);
//   };

//   const handleClosePost = () => {
//     setSelectedPostId(null);
//   };

//   const fetchPosts = useCallback(async () => {
//     // isLoading 체크를 함수 내부로 이동
//     if (isLoadingRef.current) return;
//     setIsLoading(true);
//     isLoadingRef.current = true;

//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/moodList?page=${page}&limit=10`,
//         { withCredentials: true },
//       );

//       const data = res.data.data;

//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p.post_id));
//         const newPosts = data.filter((p: Post) => !existingIds.has(p.post_id));
//         return [...prev, ...newPosts];
//       });

//       setHasMore(data.length > 0);
//     } catch (error) {
//       console.error('게시글을 불러오는 중 오류 발생:', error);
//     } finally {
//       setIsLoading(false);
//       isLoadingRef.current = false;
//     }
//   }, [page]); // isLoading 종속성 제거

//   useEffect(() => {
//     if (hasMore) fetchPosts();
//   }, [page, fetchPosts, hasMore]);

//   useEffect(() => {
//     if (!hasMore || isLoading) return;

//     const observer = new IntersectionObserver(
//       entries => {
//         if (entries[0].isIntersecting) {
//           setPage(prev => prev + 1);
//         }
//       },
//       { threshold: 0.1 },
//     );

//     const currentRef = observerRef.current;
//     if (currentRef) observer.observe(currentRef);

//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//     };
//   }, [hasMore, isLoading]);

//   return (
//     <div className="mx-auto px-4 w-full max-w-[1800px]">
//       <div
//         className={`
//         grid grid-cols-2 gap-4
//         sm:grid-cols-3 sm:w-10/12 sm:mx-auto
//         lg:grid-cols-4 lg:w-8/12
//       `}
//       >
//         {posts.map(post => (
//           <PostItem
//             key={post.post_id}
//             post={post}
//             onClick={() => handleOpenPost(post.post_id)}
//           />
//         ))}
//       </div>

//       {selectedPostId !== null && (
//         <DescriptionPage postId={selectedPostId} onClose={handleClosePost} />
//       )}

//       {hasMore && (
//         <div ref={observerRef} className="h-10 col-span-full">
//           {isLoading && <p className="text-center py-4">로딩 중...</p>}
//         </div>
//       )}
//     </div>
//   );
// }

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
