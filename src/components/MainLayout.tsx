import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="py-12 border-t border-border-dark text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-bg-dark">
        &copy; 2026 DM Tech LTD. All rights Reserved.
      </footer>
    </div>
  );
}
