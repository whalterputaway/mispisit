import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, CheckSquare, Calendar, GitPullRequest, Bug, LogOut } from 'lucide-react';
import { currentUser } from '../mockData';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (location.pathname === '/') {
    return <Outlet />;
  }

  return (
    <div className="h-screen w-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl">Project Manager</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="size-5" />
            <span>Дэшборд</span>
          </Link>

          <Link
            to="/tasks"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/tasks') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="size-5" />
            <span>Задачи</span>
          </Link>

          <Link
            to="/sprint"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/sprint') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calendar className="size-5" />
            <span>Спринт</span>
          </Link>

          <Link
            to="/pull-requests"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/pull-requests') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <GitPullRequest className="size-5" />
            <span>Pull Requests</span>
          </Link>

          <Link
            to="/bugs"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/bugs') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bug className="size-5" />
            <span>Баги</span>
          </Link>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center">
              {currentUser.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm">{currentUser.name}</p>
              <p className="text-xs text-slate-400">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="size-4" />
            <span className="text-sm">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
