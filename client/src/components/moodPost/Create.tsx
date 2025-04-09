import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import SearchMusic from './SearchMusic';
import TagInput from './TagInput';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type MusicData = {
  music_title: string;
  artist: string;
  album: string;
  music_image: string;
  track_id: string;
  duration_ms?: number;
  preview_url?: string;
};

type PostData = {
  image: File | null;
  title: string;
  music: MusicData | null;
  content: string;
  tags: string[];
};

export default function Create() {
  const [postData, setPostData] = useState<PostData>({
    image: null,
    title: '',
    music: null,
    content: '',
    tags: [],
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 유효성 검사
    if (!postData.title.trim()) {
      alert('게시글 제목을 입력해주세요.');
      const titleInput = document.getElementById('title') as HTMLInputElement;
      titleInput?.focus();
      return;
    }

    if (!postData.music) {
      alert('음악을 선택해주세요.');
      // SearchMusic 컴포넌트의 input에 focus
      const searchInput = document.querySelector(
        '.search-music-input',
      ) as HTMLInputElement;
      searchInput?.focus();
      return;
    }

    // 서버로 전송할 데이터 구성
    const formData = new FormData();

    // 이미지 추가 (있을 경우)
    if (postData.image) {
      formData.append('image', postData.image);
    }

    // 음악 데이터 추가 (SearchMusic의 MusicData 구조에 맞춤)
    formData.append(
      'music',
      JSON.stringify({
        title: postData.music.music_title, // music_title 필드 사용
        artist: postData.music.artist,
        album: postData.music.album,
        thumbnail: postData.music.music_image, // music_image 필드 사용
        spotify_id: postData.music.track_id,
        // duration_ms: postData.music.duration_ms,///
        spotify_preview_url: postData.music.preview_url,
      }),
    );

    // 기타 데이터 추가
    formData.append('title', postData.title); // 게시글 제목
    formData.append('content', postData.content);
    formData.append('tags', JSON.stringify(postData.tags));

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    console.log('보내는 데이터', formData); // handleSubmit 내부에서 출력해보세요.
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/li/moodPosts/create`,
        formData,
        {
          withCredentials: true,
        },
      );

      const { status, message } = response.data;

      if (status === 'SUCCESS') {
        alert(message || '게시글이 성공적으로 등록되었습니다.');

        // 성공 후 상태 초기화 및 이동
        setPostData({
          image: null,
          title: '',
          music: null,
          content: '',
          tags: [],
        });
        navigate('/');
      } else {
        // 서버에서 에러 응답이 왔지만 status 200인 경우
        alert(message || '게시글 생성에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('게시글 생성 오류:', error);

      // 백엔드에서 전달한 에러 메시지가 있는 경우
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`오류: ${error.response.data.message}`);
      } else if (error.message) {
        alert(`에러: ${error.message}`);
      } else {
        alert('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] py-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
          <h1 className="text-2xl font-bold mb-8 text-center">게시글 작성</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 데스크탑 레이아웃 - 좌우 분할 */}
            <div className="md:flex md:space-x-6 md:space-y-0 space-y-6">
              {/* 왼쪽: 이미지 업로드 (데스크탑에서만 고정 너비) */}
              <div className="md:w-1/2">
                <ImageUpload
                  onImageChange={file =>
                    setPostData({ ...postData, image: file })
                  }
                />
              </div>

              {/* 오른쪽: 입력 폼들 */}
              <div className="md:w-1/2 space-y-6">
                {/* 게시글 제목 */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    제목 *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                    value={postData.title}
                    onChange={e =>
                      setPostData({ ...postData, title: e.target.value })
                    }
                    placeholder="게시글 제목을 입력하세요"
                  />
                </div>

                {/* 음악 검색 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    음악 선택 *
                  </label>
                  <SearchMusic
                    onSelect={music => setPostData({ ...postData, music })}
                    selectedMusic={postData.music}
                  />
                </div>

                {/* 게시글 본문 */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    내용
                  </label>
                  <textarea
                    id="content"
                    rows={6}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                    value={postData.content}
                    onChange={e =>
                      setPostData({ ...postData, content: e.target.value })
                    }
                    placeholder="게시글 내용을 입력하세요"
                  />
                </div>

                {/* 태그 입력 */}
                <TagInput
                  tags={postData.tags}
                  onAddTag={tag =>
                    setPostData({ ...postData, tags: [...postData.tags, tag] })
                  }
                  onRemoveTag={index =>
                    setPostData({
                      ...postData,
                      tags: postData.tags.filter((_, i) => i !== index),
                    })
                  }
                />
              </div>
            </div>

            {/* 제출 버튼 (항상 전체 너비) */}
            <button
              type="submit"
              className="w-full bg-[#adcf56] text-white py-3 px-4 rounded-md hover:bg-[#8aac34] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              게시글 작성
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
