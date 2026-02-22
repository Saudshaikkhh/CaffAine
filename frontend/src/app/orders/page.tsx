'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Calendar, MapPin, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.id) {
            fetch(`http://localhost:3001/orders/user/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user, isAuthenticated, router]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'CANCELLED':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle2 size={14} />;
            case 'CANCELLED':
                return <XCircle size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Order <span className="text-orange-500">History</span>
                    </h1>
                    <p className="text-zinc-500 text-lg">Relive your favorite coffee moments</p>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-[3rem] p-20 text-center"
                    >
                        <div className="w-24 h-24 bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-zinc-600">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">No orders yet</h2>
                        <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-lg">Looks like you haven't started your journey yet.</p>
                        <button
                            onClick={() => router.push('/order')}
                            className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-3xl transition-all shadow-xl shadow-orange-500/20"
                        >
                            Start Your First Order
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500"
                            >
                                <div
                                    className="p-8 cursor-pointer"
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-zinc-500 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-500">
                                                <ShoppingBag size={28} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-xl font-black text-white">Order #{order.id}</span>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5",
                                                        getStatusStyles(order.status)
                                                    )}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-zinc-500 text-sm font-bold">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-orange-500/70">
                                                        <MapPin size={14} />
                                                        Table {order.tableNumber || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-8">
                                            <div className="text-right">
                                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Paid</p>
                                                <p className="text-2xl font-black text-white">₹{order.total.toFixed(2)}</p>
                                            </div>
                                            <div className="text-zinc-600 transition-transform group-hover:text-white">
                                                {expandedOrder === order.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedOrder === order.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-white/5 bg-zinc-950/30"
                                        >
                                            <div className="p-8 space-y-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Order Details</p>
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                                                                <span className="text-xs font-black">{item.quantity}x</span>
                                                            </div>
                                                            <span className="font-bold text-white uppercase text-sm tracking-tight">{item.product.name}</span>
                                                        </div>
                                                        <span className="font-black text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
