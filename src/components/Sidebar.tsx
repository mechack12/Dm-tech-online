import { LayoutGrid, Package, ShoppingBag, Users, Settings, Plus, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from './UI';
import { useApp } from '../AppContext';

export function Sidebar() {
  const location = useLocation();
  const { user } = useApp();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/admin/dashboard' },
    { name: 'Products', icon: Package, path: '/admin' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 border-r border-border-dark flex flex-col min-h-screen sticky top-0 bg-bg-dark">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold font-display text-brand-primary mb-12">
            <Package className="w-6 h-6" />
            DM Tech Admin
        </Link>

        <div className="space-y-8">
            <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Management Portal</p>
                <Link to="/admin/edit/new" className="w-full btn-primary justify-center mb-6 py-3">
                    <Plus className="w-4 h-4" />
                    New Product
                </Link>

                <nav className="space-y-1">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                    isActive ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-border-dark">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 overflow-hidden border border-white/10">
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    <UserIcon className="w-5 h-5" />
                )}
            </div>
            <div>
                <p className="text-sm font-bold text-white mb-0.5">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{user?.role || 'Manager'}</p>
            </div>
        </div>
      </div>
    </aside>
  );
}
