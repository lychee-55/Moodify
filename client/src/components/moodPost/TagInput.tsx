import { Plus } from 'lucide-react';
import React, { useState } from 'react';

type TagInputProps = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
};

const TagInput: React.FC<TagInputProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onAddTag(tagInput.trim());
      setTagInput('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        태그
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
          onChange={e => setTagInput(e.target.value)}
          value={tagInput}
          onKeyPress={e => e.key === 'Enter' && handleAddTag()}
          placeholder="태그 입력"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-[#fce179] text-gray-700 px-4 py-2 rounded-md hover:bg-[#eecb59]"
        >
          <span className="hidden sm:inline">추가</span>
          <Plus className="inline sm:hidden h-5 w-5" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(index)}
                className="ml-1 text-blue-600 hover:text-blue-900"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
