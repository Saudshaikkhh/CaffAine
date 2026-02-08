'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Plus, Minus, Sparkles, X, Coffee, Flame, Snowflake, IceCream, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const categoryColors: Record<string, string> = {
    HOT: 'from-orange-500 to-red-500',
    COLD: 'from-cyan-500 to-blue-500',
    DESSERT: 'from-pink-500 to-purple-500',
};

const categoryIcons: Record<string, any> = {
    HOT: Flame,
    COLD: Snowflake,
    DESSERT: IceCream,
};

export default function OrderPage() {
    const [products, setProducts] = useState<any[]>([]);
    const { cart, addToCart: contextAddToCart, removeFromCart, updateQuantity, clearCart } = useCart();
    const [upsell, setUpsell] = useState<any>(null);
    const [isCheckout, setIsCheckout] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(setProducts)
            .catch(console.error);
    }, []);

    const addToCart = (product: any) => {
        contextAddToCart(product);

        if (!upsell) {
            fetch('http://localhost:3001/ai/upsell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [...cart, product] })
            })
                .then(res => res.json())
                .then(setUpsell)
                .catch(console.error);
        }
    };

    const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);

    const handleCheckout = async () => {
        setIsCheckout(true);
        try {
            const res = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
                })
            });
            if (res.ok) {
                setOrderSuccess(true);
                setTimeout(() => {
                    clearCart();
                    setUpsell(null);
                    setOrderSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCheckout(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-10">
                {/* Products Grid */}
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            Build Your <span className="text-orange-500">Bespoke Brew</span>
                        </h1>
                        <p className="text-zinc-500 text-lg">Select items to curate your perfect experience</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                        {products.map((product, index) => {
                            const Icon = categoryIcons[product.category] || Coffee;
                            const inCart = cart.find(item => item.id === product.id);
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={cn(
                                        "group bg-zinc-900/50 border rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5 gpu",
                                        inCart ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/5 hover:border-white/10'
                                    )}
                                >
                                    <div className="flex gap-6 p-6">
                                        {/* Icon Container */}
                                        <div className={cn(
                                            "w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110",
                                            categoryColors[product.category] || 'from-zinc-700 to-zinc-800'
                                        )}>
                                            <Icon size={32} className="text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                                                    {product.name}
                                                </h3>
                                                <span className="font-black text-xl text-white ml-2">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-zinc-500 line-clamp-2 mb-4 leading-relaxed group-hover:text-zinc-400 transition-colors">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-1 rounded-lg bg-zinc-800 text-[10px] font-black uppercase tracking-tighter text-zinc-400 border border-white/5">
                                                        {product.category}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className={cn(
                                                        "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all transform active:scale-95 shadow-xl",
                                                        inCart
                                                            ? 'bg-orange-500 text-white shadow-orange-500/20'
                                                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                                                    )}
                                                >
                                                    <Plus size={16} />
                                                    {inCart ? `Add (${inCart.quantity})` : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div className="w-full lg:w-[400px] lg:flex-shrink-0">
                    <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] shadow-2xl shadow-black h-fit sticky top-28 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <ShoppingBag size={24} strokeWidth={3} />
                                    Your Cart
                                </h2>
                                {itemCount > 0 && (
                                    <span className="bg-zinc-950/30 backdrop-blur-md text-white text-sm font-black px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Cart Items */}
                            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {cart.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-20"
                                        >
                                            <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-600">
                                                <ShoppingBag size={40} />
                                            </div>
                                            <p className="text-zinc-500 text-lg font-bold">Your cart is empty</p>
                                            <p className="text-zinc-600 text-sm mt-1">Ready for something special?</p>
                                        </motion.div>
                                    ) : (
                                        cart.map((item: any) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-2xl border border-white/5 group"
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br",
                                                    categoryColors[item.category] || 'from-zinc-700 to-zinc-800'
                                                )}>
                                                    <Coffee size={20} className="text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-white truncate">{item.name}</p>
                                                    <p className="text-xs text-zinc-500 font-bold">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-2 bg-zinc-950/50 p-1.5 rounded-xl border border-white/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black w-6 text-center text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Upsell Indicator */}
                            <AnimatePresence>
                                {upsell && cart.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mb-8 p-6 bg-orange-500/10 rounded-2xl border border-orange-500/20 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-all duration-700">
                                            <Sparkles size={48} className="text-orange-500" />
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                                                <Sparkles size={20} />
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">AI Recommendation</p>
                                                <p className="text-sm text-zinc-300 font-medium leading-relaxed italic mb-3">
                                                    "{upsell.reason}"
                                                </p>
                                                <p className="text-lg font-black text-white">{upsell.suggestion}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Order Summary */}
                            <div className="border-t border-white/5 pt-8">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                                    <span className="text-4xl font-black text-white">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                                <Button
                                    className={cn(
                                        "w-full h-16 text-lg rounded-2xl font-black transition-all duration-500 shadow-2xl",
                                        orderSuccess
                                            ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                                            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/30'
                                    )}
                                    disabled={cart.length === 0 || isCheckout}
                                    onClick={handleCheckout}
                                >
                                    {orderSuccess ? (
                                        <motion.span
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <Check size={24} strokeWidth={3} />
                                            Order Confirmed
                                        </motion.span>
                                    ) : isCheckout ? (
                                        <span className="flex items-center gap-3 animate-pulse">
                                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            Complete Order
                                            <ArrowRight size={20} />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


