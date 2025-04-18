'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(fetchUrl, {
          withCredentials: true,
        });
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
          } relative flex items-center justify-center overflow-hidden bg-black order-2 md:order-1`}
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
            title={post.music.title}
            artist={post.music.artist}
            coverImage={post.music.coverImage}
          />
        </div>
      </div>
    </div>
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    //   <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex">
    //     {/* 왼쪽 이미지 */}
    //     {/* <div className="w-1/2 h-96 relative flex items-center justify-center overflow-hidden bg-black"> 기존 블러처리만 적용한 값 */}
    //     <div
    //       className={`w-1/2 ${
    //         isPortrait === null ? 'h-96' : isPortrait ? 'h-128' : 'h-96'
    //       } relative flex items-center justify-center overflow-hidden bg-black`}
    //     >
    //       {isImageNull ? (
    //         <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full">
    //           <Avvvatars
    //             value={post.user?.profileImage || post.user?.nickname}
    //             style="shape"
    //             size={150}
    //             border
    //             borderColor="#ffffff"
    //           />
    //         </div>
    //       ) : (
    //         <>
    //           {/* 블러 배경 */}
    //           <img
    //             src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
    //             alt="블러 배경"
    //             className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
    //           />
    //           {/* 실제 이미지 */}
    //           <img
    //             src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
    //             alt="게시글 이미지"
    //             className="relative max-w-full max-h-full object-contain z-10"
    //           />
    //         </>
    //       )}
    //     </div>

    //     {/* 오른쪽 컨텐츠 */}
    //     <div className="w-1/2 p-6 flex flex-col">
    //       <HeaderSection
    //         profileImage={post.user.profileImage}
    //         nickname={post.user.nickname}
    //         title={post.title}
    //         postId={post.postId}
    //         isLiked={post.isLiked}
    //         likes={post.likes}
    //         isBookmarked={post.isBookmarked}
    //         onClose={handleClose}
    //       />

    //       <div className="mb-6 flex-grow overflow-y-auto">
    //         <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
    //       </div>

    //       <MusicInfo
    //         title={post.music.title}
    //         artist={post.music.artist}
    //         coverImage={post.music.coverImage}
    //       />
    //     </div>
    //   </div>
    // </div>

    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    //   <div className="bg-white rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col lg:flex-row">
    //     {/* 상단 영역 (모바일에서 상단, 데스크탑에선 왼쪽) */}
    //     <div
    //       className={`w-full lg:w-1/2 ${
    //         isPortrait === null ? 'h-96' : isPortrait ? 'h-128' : 'h-96'
    //       } relative flex items-center justify-center overflow-hidden bg-black`}
    //     >
    //       {isImageNull ? (
    //         <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full">
    //           <Avvvatars
    //             value={post.user?.profileImage || post.user?.nickname}
    //             style="shape"
    //             size={150}
    //             border
    //             borderColor="#ffffff"
    //           />
    //         </div>
    //       ) : (
    //         <>
    //           {/* 블러 배경 */}
    //           <img
    //             src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
    //             alt="블러 배경"
    //             className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
    //           />
    //           {/* 실제 이미지 */}
    //           <img
    //             src={`${process.env.REACT_APP_API_SERVER}${post.imageUrl}`}
    //             alt="게시글 이미지"
    //             className="relative max-w-full max-h-full object-contain z-10"
    //           />
    //         </>
    //       )}
    //     </div>

    //     {/* 콘텐츠 영역 (모바일에선 하단, 데스크탑에선 오른쪽) */}
    //     <div className="w-full lg:w-1/2 p-4 flex flex-col">
    //       {/* 상단 유저 정보 및 버튼 */}
    //       <div className="flex items-start justify-between mb-4">
    //         <div className="flex-shrink-0 mr-3">
    //           <Avvvatars
    //             value={post.user.profileImage}
    //             style="shape"
    //             size={48}
    //           />
    //         </div>
    //         <div className="flex-grow">
    //           <h2 className="text-xl font-bold">{post.title}</h2>
    //           <p className="text-sm text-gray-600">@{post.user.nickname}</p>
    //         </div>
    //         <div className="flex content-center space-x-4">
    //           <HeartButton
    //             postId={post.postId}
    //             isLiked={post.isLiked}
    //             likes={post.likes}
    //           />
    //           <BookmarkButton
    //             postId={post.postId}
    //             initialIsBookmarked={post.isBookmarked}
    //           />
    //           <button onClick={handleClose}>
    //             <X size={20} />
    //           </button>
    //         </div>
    //       </div>

    //       {/* 본문 */}
    //       <div className="mb-6 flex-grow overflow-y-auto">
    //         <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
    //       </div>

    //       {/* 음악 정보 */}
    //       <MusicInfo
    //         title={post.music.title}
    //         artist={post.music.artist}
    //         coverImage={post.music.coverImage}
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}
