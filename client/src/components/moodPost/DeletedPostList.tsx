// components/PostList.tsx
// src/components/PostList/PostList.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Post } from '../../types/post';
import axios from 'axios';
import DeletedPostItem from './DeletedPostItem';
import DescriptionPage from '../../pages/DescriptionPage';
import EditPost from '../main/moodPost/EditPost';
// import { useLocation } from 'react-router-dom';

interface PostListProps {
  fetchUrl: string;
  queryParams?: Record<string, any>;
  editMode?: boolean; // 추가
}

export default function DeletedPostList({
  fetchUrl,
  queryParams,
  editMode = false, // 기본값 false
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  // const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenPost = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
  };

  // const handleEditPost = (postId: number) => {
  //   setSelectedPostId(postId);
  //   setIsEditMode(true);
  // };

  useEffect(() => {
    const loadPosts = async () => {
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

        if (res.data.status === 'SUCCESS') {
          setPosts(prev => {
            const existingIds = new Set(prev.map(p => p.post_id));
            const newPosts = data.filter(p => !existingIds.has(p.post_id));
            return [...prev, ...newPosts];
          });

          setHasMore(data.length === 10);
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadPosts();
  }, [page, fetchUrl, queryParams]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    isLoadingRef.current = false; // 이 부분도 꼭 리셋해줘야 이전 상태 안 따라옴
  }, [fetchUrl, JSON.stringify(queryParams)]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, fetchUrl]); // fetchUrl도 여기에 포함

  return (
    <div className="mx-auto px-4 w-full max-w-full">
      <div
        className={`
          grid gap-4
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-3
          lg:grid-cols-4
          w-full max-w-screen-lg mx-auto
        `}
      >
        {posts.map(post => (
          <DeletedPostItem
            key={post.post_id}
            post={post}
            onClick={() => handleOpenPost(post.post_id)}
            editMode={editMode} // 전달
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
        <DescriptionPage
          postId={selectedPostId}
          onClose={handleClosePost}
          fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts/view/deletedMoodList/${selectedPostId}`}
        />
      )}

      {hasMore && (
        <div ref={observerRef} className="h-10 col-span-full">
          {isLoading && <p className="text-center py-4">로딩 중...</p>}
        </div>
      )}
    </div>
  );
}
