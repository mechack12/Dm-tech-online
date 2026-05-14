import { useApp } from '../AppContext';
import { Card } from '../components/UI';
import { Link } from 'react-router-dom';
import { ChevronRight, Laptop, Shirt, Home, Trophy, Palette } from 'lucide-react';
import { motion } from 'motion/react';

export function CategoriesScreen() {
  const { products } = useApp();
  const categories = [
    { name: 'Electronics', icon: Laptop, color: 'bg-blue-500/10 text-blue-500' },
    { name: 'Fashion', icon: Shirt, color: 'bg-pink-500/10 text-pink-500' },
    { name: 'Home & Office', icon: Home, color: 'bg-orange-500/10 text-orange-500' },
    { name: 'Sports', icon: Trophy, color: 'bg-green-500/10 text-green-500' },
    { name: 'Beauty', icon: Palette, color: 'bg-purple-500/10 text-purple-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="mb-16">
        <h1 className="text-6xl font-bold font-display tracking-tight mb-4 text-white">Browse Categories</h1>
        <p className="text-gray-500 text-xl font-medium tracking-tight">Explore our curate collections of high-end products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => {
            const productCount = products.filter(p => p.category === cat.name).length;
            return (
                <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Link to="/">
                        <Card className="p-10 group relative" hover>
                            <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mb-8 transition-transform group-hover:scale-110`}>
                                <cat.icon className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold font-display mb-2 text-white">{cat.name}</h2>
                            <p className="text-gray-500 font-medium mb-8">{productCount} Products available</p>
                            
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all">
                                View Collection <ChevronRight className="w-4 h-4" />
                            </div>

                            <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <cat.icon className="w-32 h-32" />
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            )
        })}
      </div>
    </div>
  );
}
