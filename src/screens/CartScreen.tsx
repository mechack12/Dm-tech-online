import { useApp } from '../AppContext';
import { Card, Button } from '../components/UI';
import { Trash2, Minus, Plus, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CartScreen() {
  const { cart, removeFromCart, updateQuantity, createOrder } = useApp();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15.00 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    createOrder();
    setIsOrdered(true);
    setTimeout(() => {
        navigate('/orders');
    }, 2000);
  };

  if (isOrdered) {
      return (
          <div className="max-w-7xl mx-auto px-8 py-32 text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                  <CheckCircle className="w-20 h-20 text-brand-primary mb-6" />
                  <h2 className="text-4xl font-bold font-display mb-4">Order Placed Successfully!</h2>
                  <p className="text-gray-500 mb-8">Thank you for shopping with DM Tech LTD. Redirecting to your orders...</p>
              </motion.div>
          </div>
      )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 text-center">
        <h2 className="text-4xl font-bold font-display mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looking for something? Check out our latest products.</p>
        <Link to="/" className="btn-primary inline-flex">Explore Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-5xl font-bold font-display tracking-tight mb-2">Your Cart</h1>
      <p className="text-gray-500 mb-12">Review your selected items before checkout.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence>
          {cart.map(item => (
            <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
            >
                <Card className="p-6 flex items-center gap-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold font-display mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.subcategory}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                    </button>
                    </div>
                    <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold font-display text-brand-primary">${item.price.toFixed(2)}</div>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    </div>
                </div>
                </Card>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-8 sticky top-24">
            <h2 className="text-2xl font-bold font-display mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Shipping Estimate</span>
                <span className="font-medium font-mono text-white">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Tax</span>
                <span className="font-medium font-mono text-white">${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-display">Total</span>
                <span className="text-3xl font-bold font-display text-brand-primary">${total.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full py-4 text-lg">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <Lock className="w-3 h-3" />
                Secure Encrypted Checkout
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
