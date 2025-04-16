// src/components/HeartButton.tsx
import axios from 'axios';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface HeartButtonProps {
  postId: number;
  isLiked: boolean;
  likes: number;
}

export default function HeartButton({
  postId,
  isLiked,
  likes,
}: HeartButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isProcessing, setIsProcessing] = useState(false); // 중복 클릭 방지용

  const handleLikeClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. 좋아요 상태 토글 시도 (PATCH)
      const patchRes = await axios.patch(
        `${process.env.REACT_APP_API_SERVER}/li/moodPost/favor/${postId}/like`,
        { post_id: postId },
        { withCredentials: true },
      );

      const { status, message, data } = patchRes.data;
      console.log('PATCH 좋아요 응답:', patchRes.data);

      if (status === 'SUCCESS') {
        setLiked(prev => !prev);
        setLikeCount(data.totalLikes);
      } else if (message === '좋아요 정보가 존재하지 않습니다.') {
        // 2. 좋아요 정보가 없으면 생성 시도 (POST)
        const postRes = await axios.post(
          `${process.env.REACT_APP_API_SERVER}/li/moodPost/favor/${postId}/like`,
          { post_id: postId },
          { withCredentials: true },
        );

        const { status: postStatus, data: postData } = postRes.data;

        if (postStatus === 'SUCCESS') {
          setLiked(true);
          setLikeCount(postData.totalLikes);
        } else {
          console.warn('좋아요 생성 실패:', postRes.data);
        }
      } else {
        console.warn('좋아요 처리 실패:', message);
      }
    } catch (error) {
      console.error('좋아요 요청 중 오류 발생:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      className="flex items-center space-x-1"
      disabled={isProcessing}
    >
      <Heart
        size={20}
        fill={liked ? 'red' : 'none'}
        color={liked ? 'red' : 'currentColor'}
      />
      <span>{likeCount}</span>
    </button>
  );
}
