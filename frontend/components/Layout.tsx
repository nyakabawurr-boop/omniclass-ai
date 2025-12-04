'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService, User } from '@/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    ...(user?.role === 'STUDENT' || user?.role === 'ADMIN'
      ? [{ href: '/dashboard/subjects', label: 'Subjects' }]
      : []),
    ...(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN'
      ? [{ href: '/dashboard/instructor', label: 'Instructor Portal' }]
      : []),
    ...(user?.role === 'ADMIN'
      ? [{ href: '/dashboard/admin', label: 'Admin' }]
      : []),
    { href: '/dashboard/subscriptions', label: 'Subscriptions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                  OmniClass AI
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName} ({user.role})
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

