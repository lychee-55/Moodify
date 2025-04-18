// components/PostItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import Avvvatars from 'avvvatars-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Edit3, Eye } from 'lucide-react';
import { Post } from '../../types/post';
import axios from 'axios';

interface Props {
  post: Post;
  onClick: () => void;
  editMode?: boolean; // 추가
}
const DeletedPostItem = React.memo(
  ({ post, onClick, editMode = false }: Props) => {
    // 태그 컴포넌트 분리 */
    const TagItem = ({ tag }: { tag: string }) => {
      if (!tag) return null;

      // 랜덤 색상 생성 (미리 정의된 색상 팔레트에서 선택)
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return (
        <div
          className={`${randomColor} text-white px-2 py-1 rounded-full text-xs`}
        >
          #{tag}
        </div>
      );
    };

    const [imageError, setImageError] = useState(false);
    const avatarContainerRef = useRef<HTMLDivElement>(null);
    const [avatarSize, setAvatarSize] = useState(180); // 기본 크기

    // const location = useLocation();
    // const ismyPage = location.pathname.endsWith('myMoodPosts');
    // const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    // 컨테이너 크기에 따라 아바타 크기 조정
    useEffect(() => {
      const updateSize = () => {
        if (avatarContainerRef.current) {
          const containerWidth = avatarContainerRef.current.offsetWidth;
          setAvatarSize(Math.min(containerWidth, 150)); // 최대 180px로 제한
        }
      };

      updateSize();
      window.addEventListener('resize', updateSize);

      return () => {
        window.removeEventListener('resize', updateSize);
      };
    }, []);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      handleResize(); // 초기 체크
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 이미지 URL 생성 및 유효성 검사
    const getImageUrl = (): string | undefined => {
      if (!post.post_image) return undefined;
      return post.post_image.startsWith('http')
        ? post.post_image
        : `${process.env.REACT_APP_API_SERVER}${post.post_image}`;
    };

    const imageUrl = getImageUrl();
    const showImage = imageUrl && !imageError;

    const handleRestore = async () => {
      try {
        await axios.patch(
          `${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts/view/deletedMoodList/${post.post_id}/restore`,
          {},
          { withCredentials: true },
        );
        alert('복구 완료');
        window.location.reload(); // 또는 상위 상태 업데이트
      } catch (err) {
        console.error('복구 실패', err);
        alert('복구에 실패했습니다.');
      }
    };

    const handlePermanentDelete = async () => {
      if (!window.confirm('정말로 영구 삭제하시겠습니까?')) return;

      try {
        await axios.delete(
          `${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts/view/deletedMoodList/${post.post_id}/permanent-delete`,
          { withCredentials: true },
        );
        alert('영구 삭제 완료');
        window.location.reload(); // 또는 상위 상태 업데이트
      } catch (err) {
        console.error('삭제 실패', err);
        alert('삭제에 실패했습니다.');
      }
    };

    return (
      <div className="mb-4 flex justify-center">
        <div className="relative rounded-lg overflow-hidden group shadow-md w-full">
          {/* 고정된 1:1 비율 이미지 컨테이너 */}
          <div className="relative" style={{ paddingBottom: '100%' }}>
            {showImage ? (
              <img
                src={imageUrl}
                alt={post.title || '게시물 이미지'}
                loading="lazy"
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#adcf56]"
                ref={avatarContainerRef}
              >
                <div className="overflow-hidden rounded-none w-[90%] h-[90%] flex items-center justify-center">
                  <Avvvatars
                    value={post.author?.nickname || '익명'}
                    style="shape"
                    size={avatarSize}
                    border
                    borderColor="#ffffff"
                  />
                </div>
              </div>
            )}
            {/* 편집 모드일 때 삭제/복구 버튼 노출 */}
            {editMode && (
              <div className="absolute bottom-2 left-2 right-2 flex justify-between z-10 bg-white/80 rounded-md p-2 text-sm">
                <button
                  onClick={handleRestore}
                  className="text-green-600 hover:underline"
                >
                  복구
                </button>
                <button
                  onClick={handlePermanentDelete}
                  className="text-red-600 hover:underline"
                >
                  영구삭제
                </button>
              </div>
            )}
          </div>

          {/* 호버 오버레이 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 text-white p-4 flex flex-col transition-opacity cursor-pointer duration-300"
            onClick={onClick}
          >
            {/* 제목 - 왼쪽 상단 */}
            <p className="text-lg font-semibold line-clamp-2 mb-2">
              {post.title || '제목 없음'}
            </p>

            {/* 하단 영역 (태그 + 프로필) */}
            <div className="mt-auto flex justify-between items-end">
              {/* 태그 영역 - 왼쪽 */}
              <div className="flex flex-wrap gap-2 max-w-[70%]">
                {post.tags?.split(',').map((tag, index) => (
                  <TagItem key={index} tag={tag.trim()} />
                ))}
              </div>

              {/* 프로필 이미지 - 오른쪽 */}
              <div className="w-10 h-10">
                <Avvvatars
                  value={post.author?.profile_image || post.author?.nickname}
                  style="shape"
                  size={40}
                  border
                  borderColor="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default DeletedPostItem;
