import { useApp } from '../AppContext';
import { Card, Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Timer, Percent } from 'lucide-react';
import { motion } from 'motion/react';

export function DealsScreen() {
  const { products, addToCart } = useApp();
  const deals = products.slice(0, 3); // Just show some products as "deals"

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
           <Badge variant="warning">Limited Time</Badge>
           <h1 className="text-6xl font-bold font-display tracking-tight mt-4 mb-4 text-white">Exclusive Deals</h1>
           <p className="text-gray-500 text-xl font-medium tracking-tight">Don't miss out on these premium offers. Prices return soon.</p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <Timer className="w-8 h-8 text-brand-primary animate-pulse" />
            <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Ends In</p>
                <p className="text-xl font-bold font-mono text-white">04:22:15:09</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {deals.map((product, i) => (
            <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
            >
                <Card className="group relative overflow-hidden" hover>
                    <div className="absolute top-4 right-4 z-10">
                        <div className="bg-brand-primary text-bg-dark font-bold py-2 px-3 rounded-lg shadow-lg flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            20% OFF
                        </div>
                    </div>
                    <Link to={`/product/${product.id}`}>
                        <div className="aspect-[16/10] overflow-hidden">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </Link>
                    <div className="p-8">
                        <div className="flex flex-col gap-1 mb-6">
                            <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{product.category}</p>
                            <h3 className="text-2xl font-bold font-display text-white">{product.name}</h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 line-through mb-1">${(product.price * 1.25).toFixed(2)}</p>
                                <p className="text-3xl font-bold font-display text-brand-primary">${product.price.toFixed(2)}</p>
                            </div>
                            <Button variant="outline" onClick={() => addToCart(product)} className="py-3 px-6">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        ))}
      </div>

      <Card className="bg-brand-primary text-bg-dark p-16 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
             <h2 className="text-5xl font-bold font-display mb-6">Join Member Club</h2>
             <p className="text-bg-dark/70 text-lg font-medium mb-10">
                DM Tech members get early access to product drops, free shipping on all orders, and exclusive weekend discounts.
             </p>
             <Button className="bg-bg-dark text-white border-bg-dark hover:bg-bg-dark/90 py-4 px-10 text-sm font-bold uppercase tracking-widest">
                Join Now for Free
             </Button>
        </div>
        <div className="absolute -bottom-20 -right-20 opacity-10">
            <Percent className="w-96 h-96" />
        </div>
      </Card>
    </div>
  );
}
