// components/moodPost/DeletePostButton.tsx
import React from 'react';
import axios from 'axios';

type DeletePostButtonProps = {
  postId: number;
  onClose: () => void;
};

export default function DeleteMoodBtn({
  postId,
  onClose,
}: DeletePostButtonProps) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts/${postId}/soft-delete`,
        {},
        { withCredentials: true },
      );

      const { status, message } = response.data;
      if (status === 'SUCCESS') {
        alert(message || '게시글이 삭제되었습니다.');
        onClose();
      } else {
        alert(message || '게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
    >
      삭제
    </button>
  );
}
