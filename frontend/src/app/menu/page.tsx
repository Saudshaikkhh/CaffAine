'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, IceCream, Flame, Snowflake, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const categories = [
    { id: 'ALL', label: 'All Items', icon: Coffee },
    { id: 'HOT', label: 'Hot Drinks', icon: Flame },
    { id: 'COLD', label: 'Cold Drinks', icon: Snowflake },
    { id: 'DESSERT', label: 'Desserts', icon: IceCream },
];

const categoryColors: Record<string, string> = {
    HOT: 'from-orange-500 to-red-500',
    COLD: 'from-cyan-500 to-blue-500',
    DESSERT: 'from-pink-500 to-purple-500',
};

const categoryBgColors: Record<string, string> = {
    HOT: 'bg-orange-500/10',
    COLD: 'bg-cyan-500/10',
    DESSERT: 'bg-pink-500/10',
};

export default function MenuPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch menu:', err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = activeCategory === 'ALL'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24">
            {/* Hero Header */}
            <div className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 to-transparent" />
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Explore <span className="text-orange-500">Our Menu</span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            A curated collection of artisanal blends and treats,
                            perfectly matched to your unique mood.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-20">
                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    'flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 transform',
                                    isActive
                                        ? 'bg-orange-500 text-white shadow-2xl shadow-orange-500/40 scale-105'
                                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5'
                                )}
                            >
                                <Icon size={20} />
                                {cat.label}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5 animate-pulse h-80" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                    className="group relative bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 gpu"
                                >
                                    {/* Image/Placeholder Area */}
                                    <div className={cn(
                                        'h-56 relative overflow-hidden flex items-center justify-center transition-colors duration-300',
                                        categoryBgColors[product.category] || 'bg-zinc-800/50'
                                    )}>
                                        {/* Background Glow */}
                                        <div className={cn(
                                            'absolute inset-0 opacity-20 bg-gradient-to-br transition-opacity group-hover:opacity-40',
                                            categoryColors[product.category] || 'from-zinc-500 to-zinc-600'
                                        )} />

                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                                                <div className={cn(
                                                    'p-6 rounded-3xl bg-gradient-to-br shadow-2xl',
                                                    categoryColors[product.category] || 'from-zinc-400 to-zinc-500'
                                                )}>
                                                    <Coffee size={48} className="text-white" />
                                                </div>
                                            </div>
                                        )}
                                        {/* Category Badge */}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <span className={cn(
                                                'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md bg-white/10 border border-white/20',
                                            )}>
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <p className="text-zinc-400 text-sm mb-6 line-clamp-2 min-h-10 leading-relaxed">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Price</span>
                                                <span className="text-2xl font-black text-white">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => addToCart(product)}
                                                className="h-12 w-12 rounded-2xl bg-zinc-800 text-white hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center p-0"
                                            >
                                                <ShoppingBag size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredProducts.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-zinc-900/30 rounded-[4rem] border border-dashed border-zinc-800"
                    >
                        <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Coffee size={40} className="text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 text-xl font-medium">No items found in this category</p>
                        <Button
                            variant="ghost"
                            className="mt-4 text-orange-500 hover:text-orange-400 font-bold"
                            onClick={() => setActiveCategory('ALL')}
                        >
                            Reset Filter
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Bottom Recommendation Banner */}
            <section className="container mx-auto px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative p-10 md:p-16 rounded-[3rem] overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                            Not sure what to pick?
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            Let our AI suggest the perfect drink based on your current vibe.
                        </p>
                        <Link href="/mood">
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-900 border-none font-black shadow-2xl">
                                Try Mood AI Now
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
