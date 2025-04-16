import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUpload from '../../moodPost/ImageUpload';
import SearchMusic from '../../moodPost/SearchMusic';
import TagInput from '../../moodPost/TagInput';

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

type EditPostProps = {
  postId: number;
  onClose: () => void;
};

export default function EditPost({ postId, onClose }: EditPostProps) {
  const [postData, setPostData] = useState<PostData>({
    image: null,
    title: '',
    music: null,
    content: '',
    tags: [],
  });
  const [defaultImageUrl, setDefaultImageUrl] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchPostData = async () => {
      console.log('✅ EditPost postid', postId);
      console.log('✅ EditPost 렌더링됨');
      try {
        console.log('📡 fetchPostData 호출됨'); // ← 이거 확인!
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts/${postId}`,
          { withCredentials: true },
        );
        const { data } = response.data;
        console.log('게시글 수정 게시글 조회 res::', data);
        if (response.data.status === 'SUCCESS') {
          setPostData(prevState => ({
            ...prevState,
            title: data.title,
            music: {
              music_title: data.music.music_title,
              artist: data.music.artist,
              album: data.music.album,
              music_image: data.music.music_image,
              track_id: data.music.track_id,
            },
            content: data.content,
            tags: data.tags ? data.tags.split(',') : [], // 빈 배열로 초기화
          }));
        } else {
          alert(response.data.message);
          console.log(response.data.message);
        }

        console.log('데이터 값을 받은후의 postData::', postData);
        setDefaultImageUrl(data.post_image);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        alert('게시글 정보를 불러오는 데 실패했습니다.');
        onClose();
      }
    };
    console.log('데이터 값을 받은후의 postData::', postData);

    if (postId) {
      fetchPostData();
    }
  }, [postId, onClose]);

  // useEffect(() => {
  //   console.log('🆕 postData가 변경됨:', postData);
  // }, [postData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postData.title.trim()) {
      alert('게시글 제목을 입력해주세요.');
      return;
    }

    if (!postData.music) {
      alert('음악을 선택해주세요.');
      return;
    }

    const formData = new FormData();

    if (postData.image) {
      formData.append('image', postData.image);
    }

    formData.append(
      'music',
      JSON.stringify({
        title: postData.music.music_title,
        artist: postData.music.artist,
        album: postData.music.album,
        thumbnail: postData.music.music_image,
        spotify_id: postData.music.track_id,
        spotify_preview_url: postData.music.preview_url,
      }),
    );

    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('tags', JSON.stringify(postData.tags));

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts/${postId}/edit`,
        formData,
        { withCredentials: true },
      );

      const { status, message } = response.data;

      if (status === 'SUCCESS') {
        alert(message || '게시글이 성공적으로 수정되었습니다.');
        onClose();
      } else {
        alert(message || '게시글 수정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('게시글 수정 오류:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">게시글 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="md:flex md:space-x-6 md:space-y-0 space-y-6">
            <div className="md:w-1/2">
              <ImageUpload
                onImageChange={file =>
                  setPostData({ ...postData, image: file })
                }
                defaultImageUrl={defaultImageUrl}
              />
            </div>

            <div className="md:w-1/2 space-y-6">
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
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
                  value={postData.title}
                  onChange={e =>
                    setPostData({ ...postData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  음악 선택 *
                </label>
                <SearchMusic
                  onSelect={music => setPostData({ ...postData, music })}
                  selectedMusic={postData.music}
                />
              </div>

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
                />
              </div>

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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-[#adcf56] text-white py-2 px-4 rounded-md hover:bg-[#8aac34]"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
