'use client';

import { X } from 'lucide-react';
import Avvvatars from 'avvvatars-react';
import HeartButton from './HeartButton';
import BookmarkButton from './BookmarkButton';

interface HeaderSectionProps {
  profileImage: string;
  nickname: string;
  title: string;
  postId: number;
  isLiked: boolean;
  likes: number;
  isBookmarked: boolean;
  onClose: () => void;
}

export default function HeaderSection({
  profileImage,
  nickname,
  title,
  postId,
  isLiked,
  likes,
  isBookmarked,
  onClose,
}: HeaderSectionProps) {
  return (
    <div className="flex items-start justify-between ">
      <div className="flex-shrink-0 mr-3">
        <Avvvatars value={profileImage || nickname} style="shape" size={48} />
      </div>
      <div className="flex-grow">
        <h2 className="text-base md:text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-600">@{nickname}</p>
      </div>
      <div className="flex content-center space-x-4">
        <HeartButton postId={postId} isLiked={isLiked} likes={likes} />
        <BookmarkButton postId={postId} initialIsBookmarked={isBookmarked} />
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
