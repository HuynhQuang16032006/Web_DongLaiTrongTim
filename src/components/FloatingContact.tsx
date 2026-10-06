"use client";

import Link from "next/link";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-4">
      {/* Nút Zalo */}
      <Link 
        href="https://zalo.me/09xxxxxx" // Thay bằng số điện thoại thật
        target="_blank"
        className="w-12 h-12 md:w-14 md:h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative group"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 11.5C21.5 16.1944 17.2464 20 12 20C11.1398 20 10.3087 19.8973 9.51659 19.7077C7.30601 21.0549 4.79246 21.3644 3.01358 20.8953C2.81223 20.8423 2.70997 20.6121 2.8093 20.4357L4.79717 16.9059C3.15173 15.4851 2 13.626 2 11.5C2 6.80558 6.47715 3 12 3C17.5228 3 21.5 6.80558 21.5 11.5Z" fill="white"/>
          <path d="M7 11.5C7 11.2239 7.22386 11 7.5 11H9.5C9.77614 11 10 11.2239 10 11.5C10 11.7761 9.77614 12 9.5 12H7.5C7.22386 12 7 11.7761 7 11.5Z" fill="#3b82f6"/>
        </svg>
        <span className="absolute right-16 bg-white text-warm-dark px-3 py-1.5 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat Zalo
        </span>
      </Link>

      {/* Nút Messenger */}
      <Link 
        href="https://m.me/ten_page_cua_ban" // Thay bằng link Messenger thật
        target="_blank"
        className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-blue-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative group"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.14 2 11.25C2 14.156 3.493 16.743 5.824 18.36C5.975 18.471 6.075 18.638 6.082 18.825L6.155 20.579C6.182 21.264 6.944 21.656 7.514 21.278L9.589 19.897C9.729 19.803 9.895 19.761 10.059 19.779C10.686 19.851 11.336 19.89 12 19.89C17.523 19.89 22 15.75 22 10.64C22 5.53 17.523 2 12 2ZM12.753 13.916C12.399 14.475 11.602 14.526 11.185 14.015L9.362 11.792C9.098 11.469 8.608 11.411 8.272 11.664L6.194 13.218C5.641 13.632 4.908 12.981 5.253 12.385L7.307 8.835C7.661 8.276 8.458 8.225 8.875 8.736L10.698 10.959C10.962 11.282 11.452 11.34 11.788 11.087L13.866 9.533C14.419 9.119 15.152 9.77 14.807 10.366L12.753 13.916Z"/>
        </svg>
        <span className="absolute right-16 bg-white text-warm-dark px-3 py-1.5 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat Messenger
        </span>
      </Link>
    </div>
  );
}
