'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/upload', label: 'Upload' },
  { href: '/user-management', label: 'User Management' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link
        href="/"
        className="text-xl font-bold text-blue-700 tracking-tight hover:opacity-80 transition"
      >
        AWS S3 Manager
      </Link>
      <ul className="flex gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-base font-medium px-3 py-1 rounded transition-colors duration-200 ${
                pathname === item.href || pathname.startsWith(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
