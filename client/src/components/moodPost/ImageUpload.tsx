import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';
interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  defaultImageUrl?: string; // ← 이 줄을 추가하세요!
}

export default function ImageUpload({
  onImageChange,
  defaultImageUrl,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      setPreviewUrl(null);
      onImageChange(null);
    }
  };

  useEffect(() => {
    if (defaultImageUrl) {
      setPreviewUrl(`${process.env.REACT_APP_API_SERVER}${defaultImageUrl}`);
    }
  }, [defaultImageUrl]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto relative">
      {/* 이미지 영역 - 4:3 비율 */}
      <div className="w-full relative">
        <div
          className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center cursor-pointer relative"
          onClick={handleClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600">이미지 선택</p>
            </div>
          )}
          {/* 이미지 변경 안내 오버레이 */}
          {previewUrl && (
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                이미지 변경
              </span>
            </div>
          )}

          {/* 툴팁 트리거 - 우측 하단에 위치 */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-gray-100 px-2 py-2 rounded-xl">
            <span className="text-xs text-gray-600">이미지 업로드 가이드</span>
            <button
              onClick={toggleTooltip}
              type="button"
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              aria-label="이미지 가이드 보기"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* 툴팁 내용 - 모달 형태로 표시 */}
      {showTooltip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                이미지 업로드 가이드
              </h3>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="가이드 닫기"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  <strong>4:3 비율</strong>의 이미지를 권장합니다 (예: 800×600,
                  1200×900)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  <strong>JPEG 또는 PNG</strong> 형식의 파일을 업로드해주세요
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  최대 <strong>5MB</strong>까지 업로드 가능합니다
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  최소 <strong>800×600 픽셀</strong> 이상의 해상도를 권장합니다
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>저작권에 문제가 없는 이미지만 업로드해주세요</span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              이미지를 선택하거나 여기로 드래그 앤 드롭하세요.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
