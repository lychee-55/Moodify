// import { Heart, Bookmark, X, Play } from 'lucide-react';

// export default function DescriptionPage() {
//   // 임시 데이터 - 실제로는 API에서 받아오는 데이터로 대체
//   const post = {
//     imageUrl: '/post-image.jpg',
//     title: '오늘의 무드',
//     content:
//       '이 노래를 들으면서 커피를 마시니 정말 기분이 좋아요. 여러분도 한번 들어보세요!',
//     user: {
//       profileImage: '/profile.jpg',
//       nickname: '음악애호가',
//     },
//     music: {
//       title: 'Blinding Lights',
//       artist: 'The Weeknd',
//       coverImage: '/music-cover.jpg',
//       audioUrl: '/music.mp3',
//     },
//     likes: 24,
//     isLiked: false,
//     isBookmarked: false,
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex">
//         {/* 왼쪽 - 게시글 이미지 */}
//         <div className="w-1/2 bg-gray-200 flex items-center justify-center">
//           <img
//             src={post.imageUrl}
//             alt="게시글 이미지"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* 오른쪽 - 컨텐츠 영역 */}
//         <div className="w-1/2 p-6 flex flex-col">
//           {/* 상단 헤더 영역 (프로필, 제목, 닉네임, 액션 버튼) */}
//           <div className="flex items-start justify-between mb-4">
//             {/* 프로필 이미지 */}
//             <div className="flex-shrink-0 mr-3">
//               <img
//                 src={post.user.profileImage}
//                 alt={post.user.nickname}
//                 className="w-12 h-12 rounded-full object-cover"
//               />
//             </div>

//             {/* 제목과 닉네임 (세로 정렬) */}
//             <div className="flex-grow">
//               <h2 className="text-xl font-bold">{post.title}</h2>
//               <p className="text-gray-600">@{post.user.nickname}</p>
//             </div>

//             {/* 액션 버튼들 (좋아요, 북마크, 닫기) */}
//             <div className="flex items-center space-x-4">
//               <button className="flex items-center space-x-1">
//                 <Heart
//                   size={20}
//                   fill={post.isLiked ? 'red' : 'none'}
//                   color={post.isLiked ? 'red' : 'currentColor'}
//                 />
//                 <span>{post.likes}</span>
//               </button>

//               <button>
//                 <Bookmark
//                   size={20}
//                   fill={post.isBookmarked ? 'yellow' : 'none'}
//                   color={post.isBookmarked ? 'yellow' : 'currentColor'}
//                 />
//               </button>

//               <button>
//                 <X size={20} />
//               </button>
//             </div>
//           </div>

//           {/* 본문 내용 */}
//           <div className="mb-6 flex-grow overflow-y-auto">
//             <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
//           </div>

//           {/* 음악 정보 영역 */}
//           <div className="flex items-center justify-end bg-gray-100 p-3 rounded-lg">
//             {/* 음악 정보 (제목, 아티스트) */}
//             <div className="text-right mr-3">
//               <p className="font-semibold">{post.music.title}</p>
//               <p className="text-sm text-gray-600">{post.music.artist}</p>
//             </div>

//             {/* 음악 커버 이미지와 재생 버튼 */}
//             <div className="relative">
//               <img
//                 src={post.music.coverImage}
//                 alt={`${post.music.title} 앨범 커버`}
//                 className="w-16 h-16 rounded-full object-cover"
//               />
//               <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2">
//                 <Play size={16} fill="white" color="white" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/MoodPostDetail.tsx
import { X, Heart, Star, Play } from 'lucide-react';

export default function MoodPostDetail() {
  return (
    <div className="flex w-full h-full p-6 gap-6">
      {/* 게시글 이미지 */}
      <div className="w-1/2 h-auto rounded-2xl overflow-hidden shadow-lg">
        <img
          src="/example-post-image.jpg"
          alt="게시글 이미지"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 오른쪽 콘텐츠 영역 */}
      <div className="w-1/2 flex flex-col justify-between gap-6">
        {/* 프로필/제목/유저정보/좋아요/북마크/닫기 */}
        <div className="flex items-start justify-between">
          {/* 왼쪽: 사용자 프로필 이미지 */}
          <img
            src="/example-profile.jpg"
            alt="프로필"
            className="w-14 h-14 rounded-full object-cover"
          />

          {/* 중앙: 제목과 닉네임 */}
          <div className="flex flex-col justify-center ml-4 flex-grow">
            <h2 className="text-xl font-bold">게시글 제목</h2>
            <span className="text-sm text-gray-600">닉네임</span>
          </div>

          {/* 오른쪽: 좋아요, 북마크, 닫기 */}
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-500 cursor-pointer" />
            <Star className="w-5 h-5 text-yellow-400 cursor-pointer" />
            <X className="w-6 h-6 text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="text-base text-gray-800">
          이곳은 게시글의 본문입니다. 감상평이나 분위기 설명 등이 들어갑니다.
        </div>

        {/* 노래 정보 및 재생 */}
        <div className="flex items-center justify-end gap-4 mt-auto relative">
          {/* 왼쪽: 제목 + 아티스트 (세로 정렬) */}
          <div className="flex flex-col items-end text-right">
            <span className="text-lg font-semibold">노래 제목</span>
            <span className="text-sm text-gray-600">가수 이름</span>
          </div>

          {/* 오른쪽: 앨범 이미지 + 재생 버튼 */}
          <div className="relative w-20 h-20">
            <img
              src="/example-album.jpg"
              alt="앨범 커버"
              className="w-full h-full rounded-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <Play className="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
