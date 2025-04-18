// src/modals/DeletedPostsModal.tsx
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DeletedPostList from './DeletedPostList';

interface DeletedPostsModalProps {
  onClose: () => void; // 모달 닫기 함수
}

export default function DeletedMoods({ onClose }: DeletedPostsModalProps) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-4/5 md:w-2/3">
        <div className="flex justify-between items-center mb-4 p-4">
          <h2 className="text-xl font-bold">삭제된 게시글</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(prev => !prev)}
              className="text-sm text-blue-600 hover:underline"
            >
              {editMode ? '편집 취소' : '편집'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto overflow-x-hidden">
          <DeletedPostList
            fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPost/myPage/myMoodPosts/view/deletedMoodList`}
            editMode={editMode}
          />
        </div>
      </div>
    </div>
  );
}
