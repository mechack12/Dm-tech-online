import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Moon, Search, User as UserIcon, LogOut } from 'lucide-react';
import { useApp } from '../AppContext';
import { cn, Button } from '../components/UI';

export function Navbar() {
  const { cart, toggleDarkMode, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Shop', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Deals', path: '/deals' },
    { name: 'Support', path: '/support' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="h-20 border-b border-border-dark flex items-center justify-between px-8 sticky top-0 bg-bg-dark/80 backdrop-blur-md z-50">
      <Link to="/" className="text-2xl font-bold font-display tracking-tight hover:opacity-80 transition-opacity text-brand-primary">
        DM Tech LTD
      </Link>

      <div className="flex items-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "text-sm font-medium transition-colors hover:text-white",
              location.pathname === link.path ? "text-brand-primary border-b-2 border-brand-primary py-1" : "text-gray-400"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {location.pathname === '/' && (
            <div className="relative group mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 w-48 lg:w-64 transition-all"
                />
            </div>
        )}

        <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-primary text-bg-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Link>
        <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-white transition-colors">
          <Moon className="w-5 h-5" />
        </button>

        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <Link to="/orders" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-bg-dark transition-all overflow-hidden border border-brand-primary/20">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-none mb-1">{user.name}</p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{user.role}</p>
              </div>
            </Link>
            <button onClick={handleLogout} title="Sign Out" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary py-2 px-6">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
