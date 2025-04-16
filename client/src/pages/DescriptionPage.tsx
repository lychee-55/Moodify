'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Bookmark, X, Play } from 'lucide-react';
import Avvvatars from 'avvvatars-react';
import BookmarkButton from '../components/postItems/BookmarkButton';
import MusicInfo from '../components/postItems/MusicInfo';
import HeartButton from '../components/postItems/HeartButton';
interface Post {
  postId: number;
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

export default function DescriptionPage({ postId, onClose }: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [isImageNull, setIsImageNull] = useState(false);
  // const postId = 2; // 추후에는 URL 파라미터나 상태 등에서 가져올 수 있습니다.
  const handleClose = () => {
    // 닫기 동작 정의 (예: 모달 닫기 or 이동)
    onClose(); // 부모에서 모달 상태를 변경할 수 있도록 호출
  };

  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

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

        // console.log(
        //   '프론트의 description post 데이터 내용입니다::',
        //   post.likes,
        // );
        // 이미지 비율 계산
        if (response.data.data.imageUrl === null) {
          setIsImageNull(true);
          return;
        } else {
          const img = new Image();
          img.src = `${process.env.REACT_APP_API_SERVER}${response.data.data.imageUrl}`;
          img.onload = () => {
            const ratio = img.width / img.height;
            setIsPortrait(ratio < 1); // 세로가 더 길면 true
          };
        }
      } catch (error) {
        console.error('게시글 정보를 불러오지 못했습니다.', error);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (!post) return null;
  // const { isLiked, likes, isBookmarked } = post;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex">
        {/* 왼쪽 이미지 */}
        {/* <div className="w-1/2 h-96 relative flex items-center justify-center overflow-hidden bg-black"> 기존 블러처리만 적용한 값 */}
        <div
          className={`w-1/2 ${
            isPortrait === null ? 'h-96' : isPortrait ? 'h-128' : 'h-96'
          } relative flex items-center justify-center overflow-hidden bg-black`}
        >
          {isImageNull ? (
            <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full">
              <Avvvatars
                value={post.user?.profileImage || post.user?.nickname}
                style="shape"
                size={150}
                border
                borderColor="#ffffff"
              />
            </div>
          ) : (
            <>
              {/* 블러 배경 */}
              <img
                src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
                alt="블러 배경"
                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
              />
              {/* 실제 이미지 */}
              <img
                src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
                alt="게시글 이미지"
                className="relative max-w-full max-h-full object-contain z-10"
              />
            </>
          )}
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
            {/* {post && ( */}
            <div className="flex content-center space-x-4">
              <HeartButton
                postId={post.postId} // ✅ 이름을 일관되게
                isLiked={post.isLiked}
                likes={post.likes}
              />

              <BookmarkButton isBookmarked={post.isBookmarked} />
              <button onClick={handleClose}>
                <X size={20} />
              </button>
            </div>
            {/* )} */}
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
