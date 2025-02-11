'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function NavBar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setUserId(localStorage.getItem('userId'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole')
    router.push('/');
  };

  return (
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          {mounted ? (
              userId ? (
                  <Link href={`/users/${userId}`} className="hover:underline">
                    My Account
                  </Link>
              ) : (
                  <Link href="/" className="hover:underline">
                    Login
                  </Link>
              )
          ) : (
              <span className="invisible">My Account</span>
          )}
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <Link href="/users" className="hover:underline">
            Users
          </Link>
        </div>
        <button
            onClick={handleLogout}
            className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 transition"
        >
          Log Out
        </button>
      </nav>
  );
}
