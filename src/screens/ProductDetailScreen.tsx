import { useParams, Link } from 'react-router-dom';
import { PRODUCTS, REVIEWS } from '../constants';
import { Badge, Button, Card, cn } from '../components/UI';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';

export function ProductDetailScreen() {
  const { id } = useParams();
  const { addToCart, products } = useApp();
  const product = products.find(p => p.id === id) || products[0];

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className={cn("aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all", i === 0 ? "border-brand-primary" : "border-transparent opacity-50 hover:opacity-100")}>
                <img src={product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-8">
            <Badge variant="success">In Stock</Badge>
            <h1 className="text-4xl font-bold font-display mt-4 mb-2 tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-brand-primary text-brand-primary' : 'text-white/10'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-400">{product.reviews} Reviews</span>
            </div>
          </div>

          <div className="text-5xl font-bold font-display text-brand-primary mb-8">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-gray-400 leading-relaxed mb-12 max-w-xl">
            {product.description}
          </p>

          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Color: Midnight Slate</p>
            <div className="flex items-center gap-3">
              {product.colors?.map(color => (
                <button
                  key={color.name}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                    color.name === 'Midnight Slate' ? "border-brand-primary p-0.5" : "border-transparent"
                  )}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: color.value }} title={color.name} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Button className="flex-1 py-4 text-lg" onClick={() => addToCart(product)}>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
            <Button variant="outline" className="w-14 h-14 rounded-full p-0 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Truck className="w-5 h-5 text-brand-primary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
              <span>2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <h2 className="text-3xl font-bold font-display tracking-tight">Customer Reviews</h2>
          <Link to="#" className="text-sm font-bold text-brand-primary group flex items-center gap-1">
            Write a review <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map(review => (
            <Card key={review.id} className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-brand-primary text-brand-primary' : 'text-white/5'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">{review.date}</span>
              </div>
              <h3 className="text-xl font-bold font-display mb-4">{review.userName === 'John D.' ? 'Exceptional Clarity' : review.userName === 'Sarah M.' ? 'Great, but slightly heavy' : 'Sleek aesthetics'}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-grow">
                {review.comment}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                  {review.userInitials}
                </div>
                <span className="text-xs font-bold text-gray-300">{review.userName}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
