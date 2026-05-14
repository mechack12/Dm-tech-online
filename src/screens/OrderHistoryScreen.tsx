import { useApp } from '../AppContext';
import { Card, Badge, Button } from '../components/UI';
import { Search, ChevronRight, Package, Truck, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OrderHistoryScreen() {
  const { orders } = useApp();
  const tabs = ['All Orders', 'Processing', 'Delivered', 'Cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-5xl font-bold font-display tracking-tight mb-2">Order History</h1>
      <p className="text-gray-500 mb-12">Review your past purchases and track current deliveries.</p>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative group flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search orders by ID or product..." 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    i === 0 ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant={order.status === 'Processing' ? 'warning' : order.status === 'Delivered' ? 'success' : 'danger'}>
                            <span className="flex items-center gap-1">
                                {order.status === 'Processing' && <Package className="w-3 h-3" />}
                                {order.status}
                            </span>
                        </Badge>
                    </div>
                    <h3 className="text-2xl font-bold font-display mb-1 md:text-3xl">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold font-display">${order.total.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Amount</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                      <div className="w-16 h-16 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                          +{order.items.length - 3} more
                      </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Truck className="w-4 h-4 text-brand-primary" />
                    <span>Estimated delivery: <span className="text-white font-medium">{order.estimatedDelivery}</span></span>
                  </div>
                  <Button className="py-2.5">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:w-80 shrink-0">
          <Card className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="text-4xl font-bold font-display mb-1">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-12">Total Lifetime</p>
            
            <div className="w-full space-y-6 pt-6 border-t border-white/5 text-left">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold font-display">${orders.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}</p>
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ShoppingBag(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    )
}
