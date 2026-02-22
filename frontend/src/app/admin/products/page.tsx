'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Image as ImageIcon,
    Tag,
    IndianRupee,
    Hash,
    Layers,
    Coffee,
    Search,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { API_URL, getImageUrl } from '@/lib/api';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        inventory: '',
        image: ''
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/image`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                inventory: product.inventory.toString(),
                image: product.image || ''
            });
        } else {
            setSelectedProduct(null);
            setFormData({
                name: '',
                price: '',
                category: '',
                inventory: '100',
                image: ''
            });
        }
        setIsMenuModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = selectedProduct ? 'PATCH' : 'POST';
        const url = selectedProduct
            ? `${API_URL}/products/${selectedProduct.id}`
            : `${API_URL}/products`;

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            inventory: parseInt(formData.inventory)
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchProducts();
                setIsMenuModalOpen(false);
            }
        } catch (err) {
            console.error('Failed to save product:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to remove this item from the collection?')) return;

        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchProducts();
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Menu <span className="text-orange-500">Management</span></h1>
                    <p className="text-zinc-500 mt-2">Curate your coffee shop's offerings and inventory</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter menu..."
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
                        />
                    </div>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="rounded-2xl bg-orange-500 hover:bg-orange-600 px-6 h-12 flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20"
                    >
                        <Plus size={18} />
                        Add Item
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 h-64 animate-pulse" />
                    ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={product.id}
                            className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-6 group hover:border-orange-500/30 transition-all flex flex-col justify-between shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <button
                                    onClick={() => handleOpenModal(product)}
                                    className="p-3 bg-white text-zinc-950 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-3 bg-zinc-800 text-zinc-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl border border-white/5"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-800 flex items-center justify-center text-orange-500 shadow-inner group-hover:scale-110 transition-transform overflow-hidden border border-white/5">
                                    {product.image ? (
                                        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Coffee size={32} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{product.category}</p>
                                    <h3 className="text-xl font-bold leading-tight group-hover:text-orange-400 transition-colors">{product.name}</h3>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 leading-none mb-1">Price</p>
                                    <p className="text-2xl font-black text-white">₹{product.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 leading-none mb-1">Stock</p>
                                    <p className={cn(
                                        "text-xs font-black px-3 py-1 rounded-lg border",
                                        product.inventory < 20
                                            ? "text-orange-500 border-orange-500/20 bg-orange-500/5 animate-pulse"
                                            : "text-zinc-400 border-white/5 bg-zinc-800"
                                    )}>
                                        {product.inventory}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-zinc-900 border border-white/5 border-dashed rounded-[3rem]">
                        <AlertCircle size={48} className="mx-auto text-zinc-800 mb-6" />
                        <h3 className="text-xl font-bold text-zinc-500">No matching items in your menu</h3>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isMenuModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden flex flex-col"
                        >
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                {/* Modal Header (Condensed) */}
                                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                            {selectedProduct ? <Edit2 size={18} /> : <Plus size={18} />}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black tracking-tight">
                                                {selectedProduct ? 'Edit Item' : 'New Creation'}
                                            </h2>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Menu Management</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsMenuModalOpen(false)}
                                        className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all group"
                                    >
                                        <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                    </button>
                                </div>

                                {/* Modal Body (Condensed) */}
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left: Image Upload Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 block">Product Image</label>
                                                {formData.image && <CheckCircle2 size={12} className="text-orange-500" />}
                                            </div>
                                            <div className="aspect-[4/3] w-full rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden flex flex-col items-center justify-center relative group p-4">
                                                {formData.image ? (
                                                    <motion.img
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        src={getImageUrl(formData.image)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-2xl shadow-xl"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3 text-zinc-700">
                                                        <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center transition-colors group-hover:bg-zinc-800 group-hover:text-zinc-500">
                                                            <ImageIcon size={32} />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">Mirror Mirror</p>
                                                            <p className="text-[8px] font-medium opacity-50">Choose a vibrant photo</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {uploading && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center rounded-3xl z-40">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                                                            <p className="text-[7px] font-black uppercase tracking-widest text-orange-500">Uploading...</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20 backdrop-blur-sm p-4 text-center">
                                                    <div className="relative w-full max-w-[150px]">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileUpload}
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-30"
                                                        />
                                                        <div className="w-full bg-white text-zinc-950 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                                                            {formData.image ? 'Change Photo' : 'Select Photo'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-orange-500/5 py-3 rounded-xl border border-orange-500/10 flex items-center justify-center gap-2">
                                                <AlertCircle size={12} className="text-orange-500/50" />
                                                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Hi-res JPG/PNG preferred (1:1)</p>
                                            </div>
                                        </div>

                                        {/* Right: Form Data Section */}
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 block ml-4">Item Identity</label>
                                                <div className="relative group">
                                                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-all" size={16} />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="e.g. Signature Espresso"
                                                        className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-13 pr-4 transition-all focus:ring-1 focus:ring-orange-500/50 outline-none text-sm font-bold placeholder:text-zinc-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 block ml-4">Price (₹)</label>
                                                    <div className="relative group">
                                                        <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-all" size={16} />
                                                        <input
                                                            required
                                                            type="number"
                                                            value={formData.price}
                                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                            placeholder="299"
                                                            className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-13 pr-4 transition-all focus:ring-1 focus:ring-orange-500/50 outline-none text-sm font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 block ml-4">Stock</label>
                                                    <div className="relative group">
                                                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-all" size={16} />
                                                        <input
                                                            required
                                                            type="number"
                                                            value={formData.inventory}
                                                            onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                                                            placeholder="100"
                                                            className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-13 pr-4 transition-all focus:ring-1 focus:ring-orange-500/50 outline-none text-sm font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 block ml-4">Classification</label>
                                                <div className="relative group">
                                                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-all pointer-events-none" size={16} />
                                                    <select
                                                        required
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl pl-13 pr-4 appearance-none transition-all focus:ring-1 focus:ring-orange-500/50 outline-none text-sm font-bold"
                                                    >
                                                        <option value="" disabled>Select a category</option>
                                                        <option value="Coffee">Coffee</option>
                                                        <option value="Cold Brew">Cold Brew</option>
                                                        <option value="Pastry">Pastry</option>
                                                        <option value="Snacks">Snacks</option>
                                                        <option value="Tea">Tea</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-all pointer-events-none" size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer (Condensed) */}
                                <div className="p-6 bg-zinc-900/50 border-t border-white/10 flex items-center justify-between gap-6 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setIsMenuModalOpen(false)}
                                        className="px-6 py-3 text-zinc-500 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={loading || uploading}
                                        type="submit"
                                        className="flex-1 max-w-[250px] h-12 bg-white text-zinc-950 hover:bg-orange-500 hover:text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <>
                                                {selectedProduct ? 'Update Creation' : 'Ready to Serve'}
                                                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
