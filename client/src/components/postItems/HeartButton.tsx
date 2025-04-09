// components/HeartButton.tsx
'use client';

import { Heart } from 'lucide-react';

interface HeartButtonProps {
  isLiked: boolean;
  likes: number;
}

export default function HeartButton({ isLiked, likes }: HeartButtonProps) {
  return (
    <button className="flex items-center space-x-1">
      <Heart
        size={20}
        fill={isLiked ? 'red' : 'none'}
        color={isLiked ? 'red' : 'currentColor'}
      />
      <span>{likes}</span>
    </button>
  );
}
