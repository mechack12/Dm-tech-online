import { Card, Badge, Button } from '../components/UI';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

export function ShopScreen() {
  const { addToCart, products } = useApp();
  const categories = ['All', 'Electronics', 'Home & Garden', 'Fashion', 'Sports', 'Beauty'];

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full text-sm font-medium border border-white/10 transition-all ${
              i === 0 ? 'bg-brand-primary text-bg-dark border-brand-primary' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="group relative" hover>
            <Link to={`/product/${product.id}`}>
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {product.stockLevel === 0 ? (
                  <div className="absolute top-4 left-4">
                    <Badge variant="danger">Out of Stock</Badge>
                  </div>
                ) : product.stockLevel < 20 ? (
                  <div className="absolute top-4 left-4">
                    <Badge variant="warning">Low Stock</Badge>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4">
                    <Badge variant="success">In Stock</Badge>
                  </div>
                )}
              </div>
            </Link>

            <div className="p-6">
              <div className="flex flex-col gap-1 mb-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</p>
                <Link to={`/product/${product.id}`} className="text-lg font-bold font-display hover:text-brand-primary transition-colors line-clamp-2">
                  {product.name}
                </Link>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-brand-primary text-brand-primary' : 'text-white/10'}`} />
                  ))}
                  <span className="text-[10px] text-gray-500 font-bold ml-1">({product.reviews})</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {product.oldPrice && <span className="text-xs text-gray-500 line-through mr-2">${product.oldPrice.toFixed(2)}</span>}
                  <span className="text-xl font-bold font-display text-brand-primary">${product.price.toFixed(2)}</span>
                </div>
                <Button 
                  variant="icon" 
                  onClick={() => addToCart(product)} 
                  disabled={product.status === 'Out of Stock'}
                  className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-bg-dark border-0"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
