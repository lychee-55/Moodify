// components/MusicInfo.tsx
'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import axios from 'axios';
import { Console } from 'console';

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
  const [videoId, setVideoId] = useState<string | null>(null);
  const post_id = 2;
  const handlePlay = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/${post_id}/search-youtube-audio`,
        {
          params: { title, artist, post_id },
          withCredentials: true,
        },
      );
      if (response.data.status === 'SUCCESS') {
        setVideoId(response.data.data);
        console.log('음원 찾기성공', response.data.data);
      } else {
        console.log('음원 찾기 실패', response.data.data);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('YouTube 검색 실패:', error);
    }
  };

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
        <button
          onClick={handlePlay}
          className="absolute inset-2 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
        >
          <Play size={12} fill="white" color="white" />
        </button>
      </div>

      {/* 재생 영역 */}
      {videoId && (
        <div className="ml-4">
          <iframe
            width="200"
            height="120"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&controls=1`}
            allow="autoplay"
            allowFullScreen
            title="YouTube Audio Preview"
          />
        </div>
      )}
    </div>
  );
}
