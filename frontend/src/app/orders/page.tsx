'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Calendar,
    MapPin,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    Loader2,
    Coffee,
    PackageCheck,
    Truck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const STAGES = [
    { key: 'PENDING', label: 'Ordered', icon: ShoppingBag, color: 'orange' },
    { key: 'PREPARING', label: 'Preparing', icon: Coffee, color: 'blue' },
    { key: 'READY', label: 'Ready', icon: PackageCheck, color: 'purple' },
    { key: 'COMPLETED', label: 'Enjoyed', icon: CheckCircle2, color: 'emerald' },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const fetchOrders = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`http://localhost:3001/orders/user/${user.id}`);
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchOrders();
        const interval = setInterval(fetchOrders, 15000); // Poll every 15s for "real-time" tracking
        return () => clearInterval(interval);
    }, [user, isAuthenticated, router]);

    const getStatusIndex = (status: string) => {
        return STAGES.findIndex(s => s.key === status);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'READY': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'PREPARING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Fetching Your Coffee Journey...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 font-sans">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">
                        My <span className="text-orange-500">Orders</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Live Status & Order History</p>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-20 text-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="w-24 h-24 bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-zinc-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 transform group-hover:scale-110 shadow-2xl">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">No coffee yet?</h2>
                        <p className="text-zinc-500 mb-8 max-w-xs mx-auto font-medium">Your coffee journey is waiting for its first bean. Let's make it happen!</p>
                        <button
                            onClick={() => router.push('/order')}
                            className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-3xl transition-all shadow-xl shadow-orange-500/20 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                        >
                            Start Your First Order
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => {
                            const currentStageIndex = getStatusIndex(order.status);
                            const isCancelled = order.status === 'CANCELLED';

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "group bg-zinc-900/30 border border-white/5 rounded-[3rem] overflow-hidden transition-all duration-500",
                                        expandedOrder === order.id ? "border-orange-500/40 shadow-2xl shadow-orange-500/5" : "hover:border-white/10 hover:bg-zinc-900/50"
                                    )}
                                >
                                    <div
                                        className="p-8 pb-4 cursor-pointer"
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-zinc-800 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 text-zinc-500 transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-6">
                                                    <Coffee size={28} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-2xl font-black text-white tracking-tighter">Order #{order.id}</span>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500",
                                                            getStatusStyles(order.status)
                                                        )}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar size={12} className="text-zinc-700" />
                                                            {format(new Date(order.createdAt), 'dd MMM, hh:mm a')}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-orange-500/60">
                                                            <MapPin size={12} />
                                                            Table {order.tableNumber || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-10">
                                                <div className="text-right">
                                                    <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Total Amount</p>
                                                    <p className="text-3xl font-black text-white tracking-tighter">₹{order.total.toLocaleString()}</p>
                                                </div>
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-700 transition-all group-hover:text-white group-hover:border-orange-500/50",
                                                    expandedOrder === order.id && "bg-orange-500 text-white border-none rotate-180"
                                                )}>
                                                    <ChevronDown size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-time Tracking Stepper (Only for active or recently completed orders) */}
                                    {!isCancelled && (
                                        <div className="px-8 py-8 pt-4">
                                            <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                                                {/* Connecting Line */}
                                                <div className="absolute left-0 top-[22px] h-[2px] w-full bg-zinc-800 -z-0" />
                                                <motion.div
                                                    className="absolute left-0 top-[22px] h-[2px] bg-orange-500 -z-0"
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: currentStageIndex === -1
                                                            ? 0
                                                            : `${(currentStageIndex / (STAGES.length - 1)) * 100}%`
                                                    }}
                                                    transition={{ duration: 1, ease: "circOut" }}
                                                />

                                                {STAGES.map((stage, sIndex) => {
                                                    const Icon = stage.icon;
                                                    const isCompleted = sIndex < currentStageIndex;
                                                    const isActive = sIndex === currentStageIndex;

                                                    return (
                                                        <div key={stage.key} className="relative z-10 flex flex-col items-center gap-3">
                                                            <motion.div
                                                                className={cn(
                                                                    "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-black",
                                                                    isCompleted ? "bg-orange-500 text-white" :
                                                                        isActive ? "bg-zinc-100 text-black scale-125" :
                                                                            "bg-zinc-800 text-zinc-600"
                                                                )}
                                                                animate={isActive ? {
                                                                    boxShadow: ["0px 0px 0px rgba(249,115,22,0)", "0px 0px 20px rgba(249,115,22,0.3)", "0px 0px 0px rgba(249,115,22,0)"]
                                                                } : {}}
                                                                transition={{ repeat: Infinity, duration: 2 }}
                                                            >
                                                                <Icon size={20} />
                                                            </motion.div>
                                                            <span className={cn(
                                                                "text-[9px] font-black uppercase tracking-widest",
                                                                isActive ? "text-orange-500" : isCompleted ? "text-white" : "text-zinc-700"
                                                            )}>
                                                                {stage.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <AnimatePresence>
                                        {expandedOrder === order.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden border-t border-white/5 bg-zinc-950/30"
                                            >
                                                <div className="p-8 space-y-6">
                                                    {order.notes && (
                                                        <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2rem] flex items-start gap-4 mb-4">
                                                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                                                                <MessageSquare size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 mb-1">Update from Barista</p>
                                                                <p className="text-sm font-bold text-orange-100/90 leading-relaxed">"{order.notes}"</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 mb-6 flex items-center gap-2">
                                                            <Truck size={12} />
                                                            Order Items
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {order.items.map((item: any) => (
                                                                <div key={item.id} className="flex items-center justify-between p-5 bg-zinc-900/60 rounded-3xl border border-white/5 group/item hover:border-orange-500/20 transition-colors">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 transition-all font-black group-hover/item:bg-orange-500 group-hover/item:text-white">
                                                                            {item.quantity}x
                                                                        </div>
                                                                        <span className="font-black text-white uppercase text-xs tracking-widest">{item.product.name}</span>
                                                                    </div>
                                                                    <span className="font-black text-zinc-500 tracking-tighter group-hover/item:text-white">₹{item.price.toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
