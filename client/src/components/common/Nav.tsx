import { useRef, useState } from 'react';
import {
  Home,
  User,
  Settings,
  Pencil,
  ArrowLeftCircle,
  ArrowRightCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';

export default function DraggableNav() {
  const navRef = useRef<HTMLDivElement>(null!);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Draggable nodeRef={navRef} bounds="body">
      <div
        ref={navRef}
        className={`z-50 fixed bg-white border shadow-xl rounded-2xl p-2 transition-all duration-300
        ${
          isOpen
            ? 'w-[240px] h-auto'
            : 'w-14 h-14 flex items-center justify-center'
        }
        md:bottom-10 md:left-10 bottom-4 left-4`}
        style={{ resize: 'both', overflow: 'auto' }}
      >
        {isOpen ? (
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <Home size={20} />
                <span>홈</span>
              </Link>
            </li>
            <li>
              <Link
                to="/li/user/myPage"
                className="flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <User size={20} />
                <span>마이</span>
              </Link>
            </li>
            <li>
              <Link
                to="/li/user/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <Settings size={20} />
                <span>설정</span>
              </Link>
            </li>
            <li>
              <Link
                to="/li/moodPosts/create"
                className="flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <Pencil size={20} />
                <span>작성</span>
              </Link>
            </li>
            <button
              className="mt-2 text-gray-400 hover:text-black flex items-center justify-start"
              onClick={() => setIsOpen(false)}
            >
              <ArrowLeftCircle size={20} />
              <span className="ml-1">닫기</span>
            </button>
          </ul>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-500 hover:text-black"
          >
            <ArrowRightCircle size={28} />
          </button>
        )}
      </div>
    </Draggable>
  );
}
