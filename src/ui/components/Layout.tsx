import type { ReactNode } from 'react';

export type View = 'inbox' | 'documents' | 'pack';

interface LayoutProps {
  children: ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

const NAV: { view: View; label: string }[] = [
  { view: 'inbox', label: 'Inbox' },
  { view: 'documents', label: 'Board Documents' },
];

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col shrink-0">
        <div className="p-4 flex items-center space-x-2 text-white font-medium border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="font-bold text-sm">MC</span>
          </div>
          <span>Maple Court</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Workspace</div>
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`px-4 py-2 rounded-r-full flex items-center cursor-pointer transition-colors ${
                  currentView === item.view || (item.view === 'documents' && currentView === 'pack')
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-800 hover:text-white text-gray-500'
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 leading-relaxed">
          Fictional demo data (OCSCC 742). Nothing here is sent, filed, or real.
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">{children}</main>
    </div>
  );
}
