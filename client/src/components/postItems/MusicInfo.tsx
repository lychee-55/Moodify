// components/MusicInfo.tsx
'use client';

import { Play } from 'lucide-react';

interface MusicInfoProps {
  title: string;
  artist: string;
  coverImage: string;
}

export default function MusicInfo({
  title,
  artist,
  coverImage,
}: MusicInfoProps) {
  return (
    <div className="flex items-center justify-end bg-gray-100 p-2 rounded-lg">
      <div className="text-right mr-3">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-600">{artist}</p>
      </div>
      <div className="relative border rounded-full">
        <img
          src={coverImage}
          alt={`${title} 앨범 커버`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <button className="absolute inset-2 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <Play size={12} fill="white" color="white" />
        </button>
      </div>
    </div>
  );
}
