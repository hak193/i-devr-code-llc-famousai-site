
import { Header } from '@/components/ui/Header';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import {
    CheckCircle,
    DollarSign,
    Edit,
    Filter,
    Package,
    Plus,
    Search,
    Trash2,
    TrendingUp,
    Users,
    XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Stats
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+12%', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Users', value: '1,234', change: '+5%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Orders', value: '456', change: '+8%', icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Avg. Order Value', value: '$85', change: '+2%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update
      setProducts(products.map(p => 
        p.id === id ? { ...p, is_published: !currentStatus } : p
      ));
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Header onOpenCart={() => {}} onOpenAuth={() => {}} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-zinc-400">Overview of your store's performance and products</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Products Table Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Table Header / Controls */}
          <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Package className="w-5 h-5 text-purple-400" />
              Products Management
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 w-full sm:w-64"
                />
              </div>
              <button className="p-2 border border-zinc-700 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium text-center">Downloads</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-500">Loading products...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                     <td colSpan={6} className="p-8 text-center text-zinc-500">No products found.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white line-clamp-1">{product.name}</div>
                            <div className="text-xs text-zinc-500 line-clamp-1">{product.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 capitalize">
                          {product.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-zinc-300">
                        ${(product.price_cents / 100).toFixed(2)}
                      </td>
                      <td className="p-4 text-center text-zinc-400">
                        {product.downloads_count}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => togglePublish(product.id, product.is_published)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            product.is_published 
                              ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' 
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          {product.is_published ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Mock) */}
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
             <span>Showing {filteredProducts.length} results</span>
             <div className="flex gap-2">
               <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-white disabled:opacity-50" disabled>Previous</button>
               <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-white disabled:opacity-50" disabled>Next</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
