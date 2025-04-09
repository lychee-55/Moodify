'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Bookmark, X, Play } from 'lucide-react';
import Avvvatars from 'avvvatars-react';
import HeartButton from '../components/postItems/HeartButton';
import BookmarkButton from '../components/postItems/BookmarkButton';
import MusicInfo from '../components/postItems/MusicInfo';
interface Post {
  //   id: number;
  title: string;
  content: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl: string;
  user: {
    nickname: string;
    profileImage: string;
  };
  music: {
    title: string;
    artist: string;
    coverImage: string;
    audioUrl: string;
  };
}

interface Props {
  postId: number;
  onClose: () => void;
}

export default function DescriptionPage() {
  const [post, setPost] = useState<Post | null>(null);
  const postId = 1; // 추후에는 URL 파라미터나 상태 등에서 가져올 수 있습니다.
  const handleClose = () => {
    // 닫기 동작 정의 (예: 모달 닫기 or 이동)
    console.log('닫기');
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/${postId}`,
          {
            withCredentials: true,
          },
        );
        setPost(response.data.data);
        console.log('프론트에서 받은 response.data입니다.:::', response.data);
      } catch (error) {
        console.error('게시글 정보를 불러오지 못했습니다.', error);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex">
        {/* 왼쪽 이미지 */}
        <div className="w-1/2 h-96 bg-gray-200 flex items-center justify-center">
          <img
            src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
            alt="게시글 이미지"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 오른쪽 컨텐츠 */}
        <div className="w-1/2 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-shrink-0 mr-3">
              <Avvvatars
                value={post.user.profileImage}
                style="shape"
                size={48}
              />
              {/* <img
                src={post.user.profileImage}
                alt={post.user.nickname}
                className="w-12 h-12 rounded-full object-cover"
              /> */}
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-sm text-gray-600">@{post.user.nickname}</p>
            </div>
            <div className="flex content-center space-x-4">
              <HeartButton isLiked={post.isLiked} likes={post.likes} />
              <BookmarkButton isBookmarked={post.isBookmarked} />
              <button onClick={handleClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="mb-6 flex-grow overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
          </div>

          <MusicInfo
            title={post.music.title}
            artist={post.music.artist}
            coverImage={post.music.coverImage}
          />
        </div>
      </div>
    </div>
  );
}
