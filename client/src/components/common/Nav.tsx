// components/BottomNav.tsx
import { Home, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
      <ul className="flex justify-around items-center h-16">
        <li>
          <Link
            to="/"
            className="flex flex-col items-center text-gray-600 hover:text-black"
          >
            <Home size={24} />
            <span className="text-xs">홈</span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-600 hover:text-black"
          >
            <User size={24} />
            <span className="text-xs">마이</span>
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="flex flex-col items-center text-gray-600 hover:text-black"
          >
            <Settings size={24} />
            <span className="text-xs">설정</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
