import Link from 'next/link';
import { ROUTES } from '@/config/app';

const navItems = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: '📊' },
  { label: 'Users', href: ROUTES.users, icon: '👥' },
  { label: 'Settings', href: ROUTES.settings, icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-gray-900">NextGen</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
