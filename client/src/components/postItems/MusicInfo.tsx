// // components/MusicInfo.tsx

// 유투브 및 스포티파이 동시 연동 실패
// 'use client';

// import { useState } from 'react';
// import { Play } from 'lucide-react';
// import axios from 'axios';

// interface MusicInfoProps {
//   postId: number;
//   title: string;
//   artist: string;
//   coverImage: string;
// }

// export default function MusicInfo({
//   postId,
//   title,
//   artist,
//   coverImage,
// }: MusicInfoProps) {
//   const [videoId, setVideoId] = useState<string | null>(null);

//   const handlePlay = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/${postId}/search-youtube-audio`,
//         {
//           params: { title, artist },
//           withCredentials: true,
//         },
//       );

//       if (response.data.status === 'SUCCESS') {
//         setVideoId(response.data.data); // videoId 저장
//       } else {
//         alert(response.data.message);
//       }
//     } catch (error) {
//       console.error('Playback error:', error);
//       alert('음원 재생에 실패했습니다. 다시 시도해주세요.');
//     }
//   };

//   return (
//     <div className="flex flex-col items-end bg-gray-100 p-3 rounded-lg w-full">
//       <div className="flex items-center justify-end w-full">
//         <div className="text-right mr-3">
//           <p className="font-semibold">{title}</p>
//           <p className="text-sm text-gray-600">{artist}</p>
//         </div>
//         <div className="relative border rounded-full">
//           <img
//             src={coverImage}
//             alt={`${title} 앨범 커버`}
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           {/* 음악 재생 버튼 */}
//           <button
//             onClick={handlePlay}
//             className="absolute inset-2 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
//           >
//             <Play size={12} fill="white" color="white" />
//           </button>
//         </div>
//       </div>

//       {/* YouTube 영상 iframe으로 오디오 재생 */}
//       {videoId && (
//         <div className="mt-3 w-full hidden">
//           <iframe
//             width="100%"
//             height="60"
//             src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
//             title="YouTube audio player"
//             allow="autoplay"
//             className="rounded-md"
//           />
//         </div>
//       )}
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { Play, Pause } from 'lucide-react';
// import axios from 'axios';
// import classNames from 'classnames';

// interface MusicInfoProps {
//   postId: number;
//   title: string;
//   artist: string;
//   coverImage: string;
// }

// export default function MusicInfo({
//   postId,
//   title,
//   artist,
//   coverImage,
// }: MusicInfoProps) {
//   const [videoId, setVideoId] = useState<string | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const playerRef = useRef<any>(null);
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   // YouTube Player API 로드
//   useEffect(() => {
//     const tag = document.createElement('script');
//     tag.src = 'https://www.youtube.com/iframe_api';
//     document.body.appendChild(tag);

//     // YouTube API가 iframe 로드 후 player 생성
//     (window as any).onYouTubeIframeAPIReady = () => {
//       if (iframeRef.current) {
//         playerRef.current = new (window as any).YT.Player(iframeRef.current, {
//           events: {
//             onReady: () => {
//               // 준비 완료 시 자동 재생
//               playerRef.current.playVideo();
//               setIsPlaying(true);
//             },
//             onStateChange: (event: any) => {
//               // 상태 변화 감지
//               if (event.data === 0) setIsPlaying(false); // 종료 시
//               if (event.data === 2) setIsPlaying(false); // 일시정지 시
//               if (event.data === 1) setIsPlaying(true); // 재생 시
//             },
//           },
//         });
//       }
//     };
//   }, [videoId]);

//   const handlePlayPause = async () => {
//     // 이미 videoId가 있고 player가 생성된 상태면 play/pause 토글
//     if (videoId && playerRef.current) {
//       if (isPlaying) {
//         playerRef.current.pauseVideo();
//         setIsPlaying(false);
//       } else {
//         playerRef.current.playVideo();
//         setIsPlaying(true);
//       }
//     }

//     // videoId는 있지만 player가 아직 생성되지 않은 경우 → 아무것도 하지 않음
//     else if (videoId && !playerRef.current) {
//       console.log('플레이어가 아직 준비되지 않았습니다.');
//       return;
//     }

//     // 최초 재생 시 API 호출
//     else {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/${postId}/search-youtube-audio`,
//           {
//             params: { title, artist },
//             withCredentials: true,
//           },
//         );

//         if (response.data.status === 'SUCCESS') {
//           setVideoId(response.data.data);
//           // setIsPlaying(true)는 onReady 안에서 처리
//         } else {
//           alert(response.data.message);
//         }
//       } catch (error) {
//         console.error('Playback error:', error);
//         alert('음원 재생에 실패했습니다. 다시 시도해주세요.');
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col items-end bg-gray-100 p-3 rounded-lg w-full">
//       <div className="flex items-center justify-end w-full">
//         <div className="text-right mr-3">
//           <p className="font-semibold">{title}</p>
//           <p className="text-sm text-gray-600">{artist}</p>
//         </div>

//         {/* 앨범 커버 + 버튼 */}
//         <div className="relative border rounded-full">
//           <img
//             src={coverImage}
//             alt={`${title} 앨범 커버`}
//             className={classNames(
//               'w-10 h-10 rounded-full object-cover transition-transform duration-500',
//               {
//                 'animate-spin-slow': isPlaying,
//               },
//             )}
//           />
//           <button
//             onClick={handlePlayPause}
//             className="absolute inset-2 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
//           >
//             {isPlaying ? (
//               <Pause size={12} fill="white" color="white" />
//             ) : (
//               <Play size={12} fill="white" color="white" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* YouTube iframe (숨김 처리) */}
//       {videoId && (
//         <div className="hidden">
//           <iframe
//             ref={iframeRef}
//             id="yt-player"
//             width="0"
//             height="0"
//             title="YouTube audio player"
//             allow="autoplay"
//             src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import axios from 'axios';

interface MusicInfoProps {
  postId: number;
  title: string;
  artist: string;
  coverImage: string;
}

export default function MusicInfo({
  postId,
  title,
  artist,
  coverImage,
}: MusicInfoProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/${postId}/search-youtube-audio`,
        {
          params: { title, artist },
          withCredentials: true,
        },
      );

      if (response.data.status === 'SUCCESS') {
        setVideoId(response.data.data); // videoId 저장
        setIsPlaying(true); // 재생 중 상태로 변경
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Playback error:', error);
      alert('음원 재생에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-end bg-gray-100 p-3 rounded-lg w-full">
      <div className="flex items-center justify-end w-full space-x-3">
        <div className="text-right max-w-[70%] min-w-0">
          <p className="font-semibold truncate" title={title}>
            {title}
          </p>
          <p className="text-sm text-gray-600 truncate" title={artist}>
            {artist}
          </p>
        </div>

        <div className="relative border rounded-full flex-shrink-0">
          <img
            src={coverImage}
            alt={`${title} 앨범 커버`}
            className={`w-10 h-10 rounded-full object-cover transition-transform duration-500 ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          />

          {/* 재생 버튼은 재생 중일 땐 숨김 */}
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-2 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
            >
              <Play size={12} fill="white" color="white" />
            </button>
          )}
        </div>
      </div>

      {/* YouTube 영상 iframe으로 오디오 재생 (숨겨진 상태) */}
      {videoId && (
        <div className="mt-3 w-full hidden">
          <iframe
            width="100%"
            height="60"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube audio player"
            allow="autoplay"
            className="rounded-md"
          />
        </div>
      )}
    </div>
  );
}
