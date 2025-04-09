// components/BookmarkButton.tsx
'use client';

import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
}

export default function BookmarkButton({ isBookmarked }: BookmarkButtonProps) {
  return (
    <button>
      <Bookmark
        size={20}
        fill={isBookmarked ? 'yellow' : 'none'}
        color={isBookmarked ? 'yellow' : 'currentColor'}
      />
    </button>
  );
}
