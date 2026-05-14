import { useState, createContext, useContext, ReactNode } from 'react';
import { CartItem, Product, User, Order } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, ORDERS as INITIAL_ORDERS } from './constants';

interface AppContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (name: string, username: string, password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dm_tech_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dm_tech_orders');
    return saved ? JSON.parse(saved).map((o: any) => ({ ...o, total: Number(o.total) })) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dm_tech_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('dm_tech_registered_users');
    return saved ? JSON.parse(saved) : [
      {
        id: 'u1',
        name: 'Mech',
        username: 'Mech',
        password: '1234',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
      },
      {
        id: 'u2',
        name: 'Lucky',
        username: 'Lucky',
        password: '12345',
        role: 'guest',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
      }
    ];
  });

  // Sync to local storage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('dm_tech_products', JSON.stringify(newProducts));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('dm_tech_orders', JSON.stringify(newOrders));
  };

  const addProduct = (product: Product) => saveProducts([...products, product]);
  const updateProduct = (product: Product) => saveProducts(products.map(p => p.id === product.id ? product : p));
  const deleteProduct = (productId: string) => saveProducts(products.filter(p => p.id !== productId));

  const createOrder = () => {
    if (cart.length === 0) return;
    
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = 15;
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      total: subtotal + tax + shipping,
      status: 'Processing',
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }))
    };

    saveOrders([newOrder, ...orders]);
    setCart([]);
  };

  const login = (username: string, password: string): boolean => {
    const foundUser = registeredUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const { password: _, ...userSession } = foundUser;
      setUser(userSession);
      localStorage.setItem('dm_tech_user', JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const register = (name: string, username: string, password: string): boolean => {
    if (registeredUsers.some(u => u.username === username)) {
      return false; // User already exists
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      username,
      password,
      role: 'guest' as const,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    const newUsersList = [...registeredUsers, newUser];
    setRegisteredUsers(newUsersList);
    localStorage.setItem('dm_tech_registered_users', JSON.stringify(newUsersList));
    
    // Automatically login
    const { password: _, ...userSession } = newUser;
    setUser(userSession);
    localStorage.setItem('dm_tech_user', JSON.stringify(userSession));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dm_tech_user');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{ 
      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      orders, createOrder,
      isDarkMode, toggleDarkMode, user, login, register, logout 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
