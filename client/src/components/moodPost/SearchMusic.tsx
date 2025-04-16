import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

type SpotifyTrackResponse = {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  // duration_ms?: number;
  preview_url?: string;
};

type MusicData = {
  music_title: string;
  artist: string;
  album: string;
  music_image: string;
  track_id: string;
  // duration_ms?: number;
  preview_url?: string;
};

type SearchMusicProps = {
  onSelect: (track: MusicData | null) => void;
  selectedMusic: MusicData | null;
  //   showNoSelectionMessage?: boolean; // 추가: 선택하지 않았을 때 메시지 표시 여부
};

export default function SearchMusic({
  onSelect,
  selectedMusic,
}: //   showNoSelectionMessage = false, // 추가: 기본값은 false
SearchMusicProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showNoSelectionMessage, setShowNoSelectionMessage] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchTracks = async (reset = false) => {
    if (!query.trim() || (isSearching && !reset)) return;

    const currentPage = reset ? 1 : page;
    setIsSearching(true);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/li/moodPosts/create/search-music`,
        {
          withCredentials: true,
          params: {
            q: query,
            page: currentPage,
          },
        },
      );

      if (res.data.status === 'SUCCESS') {
        // const newTracks = res.data.data;
        const newTracks: MusicData[] = res.data.data.map(
          (track: SpotifyTrackResponse) => ({
            music_title: track.name, // API에서는 'name'으로 오는 것을 'music_title'로 매핑
            artist: track.artist, // 'artist'는 동일
            album: track.album, // 'album'은 동일
            music_image: track.image, // API에서는 'image'로 오는 것을 'music_image'로 매핑
            track_id: track.id, // API에서는 'id'로 오는 것을 'track_id'로 매핑
            // duration_ms: track.duration_ms, // 'duration_ms'는 동일 (API 응답에 없으면 제외)
            preview_url: track.preview_url, // 'preview_url'은 동일
          }),
        );

        console.log('newTracks::', newTracks);
        if (reset) {
          setResults(newTracks);
          setHasSearched(true);
          setHasMore(newTracks.length >= 5);
        } else {
          setResults(prev => [...prev, ...newTracks]);
          setHasMore(newTracks.length > 0);
        }
        setPage(currentPage + 1);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error('Error searching music:', error);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    await fetchTracks(true);
    // setShowNoSelectionMessage(false);
    // if (!selectedMusic) {
    //   setShowNoSelectionMessage(true);
    // }
  };

  const handleSelect = (track: MusicData) => {
    onSelect(track);
    setResults([]);
    setQuery(`${track.music_title} - ${track.artist}`);
    setShowNoSelectionMessage(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery('');
    setResults([]);
    setPage(1);
    setHasMore(true);
    setHasSearched(false);
    setShowNoSelectionMessage(false);
  };

  // 무한 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isSearching) {
          fetchTracks();
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, isSearching]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setResults([]);
        if (!selectedMusic) {
          setShowNoSelectionMessage(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={resultsRef}>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#adcf56] focus:border-[#adcf56]"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSearch()}
          placeholder="노래 제목 또는 가수 입력"
          readOnly={!!selectedMusic}
        />

        {selectedMusic ? (
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            취소
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-[#fce179] text-textcolor px-4 py-2 rounded-md hover:bg-[#eecb59] disabled:bg-gray-300"
          >
            <span className="hidden sm:inline">
              {isSearching ? '검색 중...' : '검색'}
            </span>
            <Search className="inline sm:hidden h-5 w-5" />
          </button>
        )}
      </div>

      {/* 선택한 음악이 없을 때 메시지 (추가버튼 클릭시에만 표시) */}
      {showNoSelectionMessage && !selectedMusic && (
        <div className="mt-2 text-sm text-gray-500">
          선택한 음악이 없습니다.
        </div>
      )}

      {selectedMusic && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md flex items-center gap-3">
          <img
            src={
              selectedMusic.music_image ||
              `${process.env.REACT_APP_API_SERVER}${selectedMusic.music_image}`
            }
            alt={selectedMusic.music_title}
            className="w-12 h-12 rounded"
          />
          <div>
            <div className="font-medium">{selectedMusic.music_title}</div>
            <div className="text-sm text-gray-600">{selectedMusic.artist}</div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {results.map(track => (
              <div
                key={`${track.track_id}-${track.album}`}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelect(track)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={track.music_image}
                    alt={track.music_title}
                    className="w-10 h-10 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium truncate">
                      {track.music_title}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {track.artist}
                    </div>
                  </div>
                  {track.preview_url && (
                    <audio
                      controls
                      src={track.preview_url}
                      className="h-8 ml-2 hidden sm:block"
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={loaderRef} className="p-2 text-center">
              {isSearching && (
                <div className="text-sm text-gray-500">로딩 중...</div>
              )}
              {!hasMore && results.length >= 5 && (
                <div className="text-sm text-gray-500">
                  {results.length === 0
                    ? '검색 결과가 없습니다.'
                    : '모든 결과를 불러왔습니다'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
