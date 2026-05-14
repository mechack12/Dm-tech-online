import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Button, Card, cn } from '../components/UI';
import { ChevronRight, Trash2, Save, Plus, ChevronDown, Upload, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

export function EditProductScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  
  const isNew = id === 'new';
  const existingProduct = products.find(p => p.id === id);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stockLevel: 0,
    sku: '',
    category: 'Electronics',
    subcategory: 'General',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
    }
  }, [existingProduct]);

  const handleSave = () => {
    if (isNew) {
      const newProduct: Product = {
        ...formData as Product,
        id: Date.now().toString(),
        rating: 5,
        reviews: 0
      };
      addProduct(newProduct);
    } else if (existingProduct) {
      updateProduct({ ...existingProduct, ...formData } as Product);
    }
    navigate('/admin');
  };

  const handleDelete = () => {
    if (id && !isNew) {
      deleteProduct(id);
      navigate('/admin');
    }
  };

  return (
    <div className="flex-grow p-12">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8 overflow-x-auto">
        <Link to="/admin" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">{isNew ? 'New Product' : 'Edit Product'}</span>
      </div>

      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-bold font-display tracking-tight mb-2">{isNew ? 'Create New Product' : 'Edit Product'}</h1>
          <p className="text-gray-500 font-medium tracking-tight">Update product details, pricing, and inventory.</p>
        </div>
        <div className="flex items-center gap-4">
          {!isNew && (
            <Button variant="outline" onClick={handleDelete} className="text-red-400 border-red-400/20 hover:bg-red-400/10">
              <Trash2 className="w-4 h-4" />
              Delete Product
            </Button>
          )}
          <Button onClick={handleSave} className="py-3 px-8 shadow-lg shadow-brand-primary/10">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-10 space-y-8">
            <h2 className="text-2xl font-bold font-display">General Information</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                    <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Organic Cotton Canvas Backpack"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product in detail..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-medium resize-none"
                    />
                </div>
            </div>
          </Card>

          <Card className="p-10 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display">Product Media</h2>
                <Button variant="ghost" className="text-brand-primary text-xs font-bold uppercase tracking-widest p-0">
                    <ImageIcon className="w-4 h-4" />
                    Add Media
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-brand-primary relative group">
                    <img src={formData.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-brand-primary text-bg-dark text-[10px] font-bold rounded">Primary</div>
                </div>
                <div className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-all text-gray-500 hover:text-gray-300">
                    <Upload className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="p-10 space-y-8">
            <h2 className="text-2xl font-bold font-display">Pricing & Inventory</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price ($)</label>
                    <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-mono italic">$</span>
                        <input 
                            type="number" 
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            placeholder="0.00"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-brand-primary focus:outline-none focus:border-brand-primary/50 transition-all font-bold font-mono text-xl"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Qty</label>
                        <input 
                            type="number" 
                            value={formData.stockLevel}
                            onChange={(e) => setFormData({ ...formData, stockLevel: Number(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">SKU</label>
                        <input 
                            type="text" 
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-mono text-xs"
                        />
                    </div>
                </div>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between bg-white/[0.02] p-6 rounded-xl border border-white/5">
                    <div>
                        <p className="text-sm font-bold text-white mb-1">Track Inventory</p>
                        <p className="text-[10px] font-medium text-gray-500 max-w-[120px]">Automatically update stock levels</p>
                    </div>
                    <div className="w-12 h-6 bg-brand-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-bg-dark rounded-full shadow-md" />
                    </div>
                </div>
            </div>
          </Card>

          <Card className="p-10 space-y-8">
            <h2 className="text-2xl font-bold font-display">Organization</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <div className="relative group">
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-semibold appearance-none"
                        >
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home & Office">Home & Office</option>
                            <option value="Sports">Sports</option>
                            <option value="Beauty">Beauty</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {['Small', 'Medium', 'Large', 'One Size'].map(size => (
                            <button 
                                key={size}
                                type="button"
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                                    size === 'Medium' ? "bg-brand-primary/10 text-brand-primary border-brand-primary" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Tags</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Add tags separated by comma"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Eco-Friendly', 'Travel', 'Premium'].map(tag => (
                            <div key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-300">
                                {tag}
                                <button type="button" className="text-gray-500 hover:text-white transition-colors">×</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
