'use client';

import { Bookmark } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

interface BookmarkButtonProps {
  postId: number;
  initialIsBookmarked: boolean;
}

export default function BookmarkButton({
  postId,
  initialIsBookmarked,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleClick = async () => {
    try {
      if (isBookmarked) {
        const res = await axios.patch(
          `${process.env.REACT_APP_API_SERVER}/li/moodPost/favor/${postId}/mark`,
          { post_id: postId },
          { withCredentials: true },
        );
        if (res.data.status === 'SUCCESS') {
          setIsBookmarked(!isBookmarked);
        } else {
          alert(res.data.message);
          return;
        }
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_SERVER}/li/moodPost/favor/${postId}/mark`,
          { post_id: postId },
          { withCredentials: true },
        );
        if (res.data.status === 'SUCCESS') {
          setIsBookmarked(!isBookmarked);
        } else {
          alert(res.data.message);
          return;
        }
      }
    } catch (err) {
      console.error('북마크 요청 실패:', err);
    }
  };

  return (
    <button onClick={handleClick}>
      <Bookmark
        size={20}
        fill={isBookmarked ? 'yellow' : 'none'}
        color={isBookmarked ? 'yellow' : 'currentColor'}
      />
    </button>
  );
}
