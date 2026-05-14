import { useApp } from '../AppContext';
import { Card, Badge, Button, cn } from '../components/UI';
import { Search, Filter, Download, Plus, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InventoryScreen() {
  const { products } = useApp();
  return (
    <div className="flex-grow p-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight mb-2">Product Inventory</h1>
          <p className="text-gray-500 font-medium tracking-tight">Manage your active listings, prices, and stock levels.</p>
        </div>
        <Link to="/admin/edit/new" className="btn-primary py-3 px-6 shadow-lg shadow-brand-primary/10">
          <Plus className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      <div className="bg-surface-dark border border-border-dark rounded-xl p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search products, SKUs..." 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
                />
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" className="py-2.5 px-5">
                    <Filter className="w-4 h-4 text-gray-500" />
                    Filters
                </Button>
                <Button variant="outline" className="py-2.5 px-5">
                    <Download className="w-4 h-4 text-gray-500" />
                    Export
                </Button>
            </div>
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-dark text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">SKU</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock Level</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <Link to={`/admin/edit/${product.id}`} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden border border-white/5 shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-bold font-display text-white group-hover:text-brand-primary transition-colors">{product.name}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category} • {product.subcategory}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5 font-mono text-xs text-gray-400">{product.sku}</td>
                  <td className="px-8 py-5 font-bold text-brand-primary">${product.price.toFixed(2)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", product.stockLevel > 50 ? "bg-green-500" : product.stockLevel > 0 ? "bg-yellow-500" : "bg-red-500")} />
                        <span className="text-xs font-bold text-gray-400">{product.stockLevel} in stock</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant={product.status === 'Active' ? 'success' : product.status === 'Draft' ? 'default' : 'danger'}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Button variant="ghost" className="p-2 ml-auto">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-6 border-t border-border-dark flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Showing 1 to {products.length} of {products.length} entries</p>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="w-8 h-8 p-0" disabled>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-bold ring-1 ring-brand-primary/20">1</button>
                    <button className="w-8 h-8 rounded-lg text-gray-500 hover:text-white text-xs font-bold">2</button>
                    <button className="w-8 h-8 rounded-lg text-gray-500 hover:text-white text-xs font-bold">3</button>
                    <span className="text-gray-500 mx-1">...</span>
                </div>
                <Button variant="outline" className="w-8 h-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
}

function ChevronLeft(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    )
}

function ChevronRight(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    )
}
