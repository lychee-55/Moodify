'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Avvvatars from 'avvvatars-react';
import MusicInfo from '../components/postItems/MusicInfo';
import HeaderSection from '../components/postItems/HeaderSection';
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
  fetchUrl: string;
}
// interface PostListProps {
//   queryParams?: Record<string, any>;
// }

export default function DescriptionPage({ postId, onClose, fetchUrl }: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [isImageNull, setIsImageNull] = useState(false);
  // const postId = 2; // 추후에는 URL 파라미터나 상태 등에서 가져올 수 있습니다.
  const handleClose = () => {
    // 닫기 동작 정의 (예: 모달 닫기 or 이동)
    onClose(); // 부모에서 모달 상태를 변경할 수 있도록 호출
  };

  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  // 🟡 pastelColors 정의
  const pastelColors = [
    '#FADADD', // 연한 핑크
    '#D1F2EB', // 연한 민트
    '#FFFACD', // 연한 노랑
    '#E0BBE4', // 연한 라일락
    '#B5EAD7', // 연한 그린
    '#FFDAC1', // 연한 살구
    '#CDE7F0', // 연한 블루
  ];

  // 🟡 아바타 배경 색상 useMemo로 지정
  const avatarBackgroundColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
  }, []);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(fetchUrl, {
          withCredentials: true,
        });
        setPost(response.data.data);
        console.log('프론트에서 받은 response.data입니다.:::', response.data);

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
      <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col sm:flex-row">
        {/* ✅ 모바일 상단용 HeaderSection (모바일에서만 보임) */}
        <div className="block sm:hidden p-4 border-b">
          <HeaderSection
            profileImage={post.user.profileImage}
            nickname={post.user.nickname}
            title={post.title}
            postId={post.postId}
            isLiked={post.isLiked}
            likes={post.likes}
            isBookmarked={post.isBookmarked}
            onClose={handleClose}
          />
        </div>

        {/* ✅ 이미지 영역 */}
        <div
          className={`w-full sm:w-1/2 ${
            isPortrait === null ? 'h-96' : isPortrait ? 'h-128' : 'h-96'
          } relative flex items-center justify-center overflow-hidden ${
            isImageNull ? '' : 'bg-black'
          } order-2 md:order-1`}
          style={isImageNull ? { backgroundColor: avatarBackgroundColor } : {}}
        >
          {isImageNull ? (
            <div className=" flex items-center justify-center bg-white rounded-full">
              <Avvvatars
                value={post.user?.profileImage || post.user?.nickname}
                style="shape"
                size={150}
                // border
                // borderColor="#ffffff"
              />
            </div>
          ) : (
            <>
              <img
                src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
                alt="블러 배경"
                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
              />
              <img
                src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
                alt="게시글 이미지"
                className="relative max-w-full max-h-full object-contain z-10"
              />
            </>
          )}
        </div>

        {/* ✅ 본문 및 음악 영역 */}
        <div className="w-full sm:w-1/2 p-6 flex flex-col order-3 sm:order-2">
          {/* PC에서만 보이는 HeaderSection */}
          <div className="hidden sm:block mb-4">
            <HeaderSection
              profileImage={post.user.profileImage}
              nickname={post.user.nickname}
              title={post.title}
              postId={post.postId}
              isLiked={post.isLiked}
              likes={post.likes}
              isBookmarked={post.isBookmarked}
              onClose={handleClose}
            />
          </div>

          <div className="mb-6 flex-grow overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
          </div>

          <MusicInfo
            postId={post.postId}
            title={post.music.title}
            artist={post.music.artist}
            coverImage={post.music.coverImage}
          />
        </div>
      </div>
    </div>
  );
}
