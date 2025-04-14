// 'use client';

// import { Link } from 'react-router-dom';
// import {
//   Home,
//   User,
//   Settings,
//   PencilLine,
//   ChevronRight,
//   ChevronLeft,
// } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';

// export default function NavBar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [position, setPosition] = useState({
//     x: window.innerWidth / 2 - 200,
//     y: window.innerHeight - 150,
//   });
//   const navRef = useRef<HTMLDivElement>(null);
//   const dragging = useRef(false);
//   const offset = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!dragging.current) return;
//       setPosition({
//         x: e.clientX - offset.current.x,
//         y: e.clientY - offset.current.y,
//       });
//     };

//     const handleMouseUp = () => {
//       dragging.current = false;
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('mouseup', handleMouseUp);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, []);

//   const startDragging = (e: React.MouseEvent) => {
//     if (!navRef.current) return;
//     dragging.current = true;
//     const rect = navRef.current.getBoundingClientRect();
//     offset.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };
//   };

//   return (
//     <div
//       ref={navRef}
//       onMouseDown={startDragging}
//       style={{
//         position: 'absolute',
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         cursor: 'grab',
//         zIndex: 9999,
//       }}
//       className={`
//         bg-gray-800 opacity-80 rounded-full shadow-lg py-0
//         transition-all duration-300 ease-in-out select-none
//         ${collapsed ? 'w-[125px]' : 'w-10/12 sm:w-9/12 md:w-8/12 lg:w-6/12'}
//         ${collapsed ? 'px-1 sm:px-4' : 'px-2 sm:px-4 md:px-6'}
//       `}
//     >
//       <nav className="flex justify-between items-center text-white text-sm relative min-h-[64px]">
//         {/* 왼쪽 < 아이콘 */}
//         {collapsed && (
//           <button
//             onClick={() => setCollapsed(false)}
//             className="absolute left-3 text-white hover:text-gray-300 transition-all"
//           >
//             <ChevronLeft size={24} />
//           </button>
//         )}

//         <div
//           className={`
//             flex-1 flex items-center
//             transition-all duration-300 ease-in-out
//             ${collapsed ? 'justify-center' : 'justify-evenly'}
//           `}
//         >
//           {!collapsed ? (
//             <>
//               <NavItem icon={<Home size={24} />} label="홈" to="/" />
//               <NavItem
//                 icon={<User size={24} />}
//                 label="마이"
//                 to="/li/user/myPage"
//               />
//               <NavItem
//                 icon={<Settings size={24} />}
//                 label="설정"
//                 to="/li/user/profile"
//               />
//               <NavItem
//                 icon={<PencilLine size={24} />}
//                 label="작성"
//                 to="/li/moodPosts/create"
//               />
//             </>
//           ) : (
//             <NavItem
//               icon={<PencilLine size={24} />}
//               label="작성"
//               to="/li/moodPosts/create"
//             />
//           )}
//         </div>

//         {/* 오른쪽 > 아이콘 */}
//         {!collapsed && (
//           <button
//             onClick={() => setCollapsed(true)}
//             className="absolute right-1 sm:right-4 text-white hover:text-gray-300 transition-all"
//           >
//             <ChevronRight size={24} />
//           </button>
//         )}
//       </nav>
//     </div>
//   );
// }

// function NavItem({
//   icon,
//   label,
//   to,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   to: string;
// }) {
//   return (
//     <Link
//       to={to}
//       className="flex flex-col items-center gap-1 hover:text-gray-300 cursor-pointer transition-all duration-300"
//     >
//       {icon}
//       <span className="text-xs transition-opacity duration-300 hidden sm:inline">
//         {label}
//       </span>
//     </Link>
//   );
// }

// 이동전 최종 네비바:
'use client';

import { Link } from 'react-router-dom';
import {
  Home,
  User,
  Settings,
  PencilLine,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

export default function NavBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`
        absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50
        bg-gray-800 opacity-80 rounded-full shadow-lg py-0
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[125px]' : 'w-10/12 sm:w-9/12 md:w-8/12 lg:w-6/12'}
        ${collapsed ? 'px-1 sm:px-4' : 'px-2 sm:px-6'}
      `}
    >
      <nav className="flex justify-between items-center text-white text-sm relative min-h-[64px]">
        {/* 왼쪽 < 아이콘 */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute left-3 text-white hover:text-gray-300 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* 네비게이션 아이템 */}
        <div
          className={`
            flex-1 flex items-center
            transition-all duration-300 ease-in-out
            ${collapsed ? 'justify-center' : 'justify-evenly'}
          `}
        >
          {!collapsed ? (
            <>
              <NavItem icon={<Home size={24} />} label="홈" to="/" />
              <NavItem
                icon={<User size={24} />}
                label="마이"
                to="/li/user/myPage"
              />
              <NavItem
                icon={<Settings size={24} />}
                label="설정"
                to="/li/user/profile"
              />
              <NavItem
                icon={<PencilLine size={24} />}
                label="작성"
                to="/li/moodPosts/create"
              />
            </>
          ) : (
            <NavItem
              icon={<PencilLine size={24} />}
              label="작성"
              to="/li/moodPosts/create"
            />
          )}
        </div>

        {/* 오른쪽 > 아이콘 */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="absolute right-0 sm:right-4 text-white hover:text-gray-300 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </nav>
    </div>
  );
}

function NavItem({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 hover:text-gray-300 cursor-pointer transition-all duration-300"
    >
      {icon}
      <span
        className={`
          text-xs transition-opacity duration-300
          hidden sm:inline
        `}
      >
        {label}
      </span>
    </Link>
  );
}

// 이동 가능한 네비바:
// import { useRef, useState } from 'react';
// import {
//   Home,
//   User,
//   Settings,
//   Pencil,
//   ArrowLeftCircle,
//   ArrowRightCircle,
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import Draggable from 'react-draggable';

// export default function DraggableNav() {
//   const navRef = useRef<HTMLDivElement>(null!);
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <Draggable nodeRef={navRef} bounds="body">
//       <div
//         ref={navRef}
//         className={`z-50 fixed bg-white border shadow-xl rounded-2xl p-2 transition-all duration-300
//         ${
//           isOpen
//             ? 'w-[240px] h-auto'
//             : 'w-14 h-14 flex items-center justify-center'
//         }
//         md:bottom-10 md:left-10 bottom-4 left-4`}
//         style={{ resize: 'both', overflow: 'auto' }}
//       >
//         {isOpen ? (
//           <ul className="flex flex-col gap-4">
//             <li>
//               <Link
//                 to="/"
//                 className="flex items-center gap-2 text-gray-600 hover:text-black"
//               >
//                 <Home size={20} />
//                 <span>홈</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/li/user/myPage"
//                 className="flex items-center gap-2 text-gray-600 hover:text-black"
//               >
//                 <User size={20} />
//                 <span>마이</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/li/user/profile"
//                 className="flex items-center gap-2 text-gray-600 hover:text-black"
//               >
//                 <Settings size={20} />
//                 <span>설정</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/li/moodPosts/create"
//                 className="flex items-center gap-2 text-gray-600 hover:text-black"
//               >
//                 <Pencil size={20} />
//                 <span>작성</span>
//               </Link>
//             </li>
//             <button
//               className="mt-2 text-gray-400 hover:text-black flex items-center justify-start"
//               onClick={() => setIsOpen(false)}
//             >
//               <ArrowLeftCircle size={20} />
//               <span className="ml-1">닫기</span>
//             </button>
//           </ul>
//         ) : (
//           <button
//             onClick={() => setIsOpen(true)}
//             className="text-gray-500 hover:text-black"
//           >
//             <ArrowRightCircle size={28} />
//           </button>
//         )}
//       </div>
//     </Draggable>
//   );
// }
