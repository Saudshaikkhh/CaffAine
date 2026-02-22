'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Clock,
    User,
    Table,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Package,
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface OrderItem {
    id: number;
    price: number;
    quantity: number;
    product: {
        name: string;
    };
}

interface Order {
    id: number;
    userId: number | null;
    tableNumber: string | null;
    status: string;
    notes: string | null;
    total: number;
    createdAt: string;
    items: OrderItem[];
    user: {
        name: string;
        email: string;
    } | null;
}

const statusColors: Record<string, string> = {
    'PENDING': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'PREPARING': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'READY': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'COMPLETED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/10',
    'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function RecentOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [customMessage, setCustomMessage] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:3001/orders');
            const data = await res.json();
            setOrders(data);

            // Re-sync selected order if search filter or interval update happens
            if (selectedOrder) {
                const refreshed = data.find((o: Order) => o.id === selectedOrder.id);
                if (refreshed) setSelectedOrder(refreshed);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 15000); // Polling every 15s for better responsiveness
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId: number, status: string, message?: string) => {
        setUpdatingStatus(orderId);
        try {
            const res = await fetch(`http://localhost:3001/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    notes: message || customMessage || undefined
                }),
            });
            if (res.ok) {
                await fetchOrders();
                setCustomMessage('');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchQuery) ||
        order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber?.includes(searchQuery)
    );

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Recent Orders</h1>
                    <p className="text-zinc-500 font-medium">Manage and track live customer orders</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, User or Table..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Live Orders...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Orders List */}
                    <div className="xl:col-span-2 space-y-4">
                        {filteredOrders.map((order) => (
                            <motion.div
                                layout
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={cn(
                                    "p-6 rounded-[2rem] border transition-all cursor-pointer group",
                                    selectedOrder?.id === order.id
                                        ? "bg-zinc-900 border-orange-500/50 shadow-2xl shadow-orange-500/5"
                                        : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-black uppercase tracking-widest text-zinc-600">Order</span>
                                                <span className="text-sm font-black text-white">#{order.id}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {format(new Date(order.createdAt), 'hh:mm a')}
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <Table size={12} />
                                                    Table {order.tableNumber || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-1">Total</p>
                                            <p className="text-lg font-black text-white">₹{order.total.toLocaleString()}</p>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                            statusColors[order.status] || statusColors['PENDING']
                                        )}>
                                            {order.status}
                                        </div>
                                        <ChevronRight className="text-zinc-700 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
                                <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No orders found matching your search</p>
                            </div>
                        )}
                    </div>

                    {/* Order Details Panel */}
                    <div className="xl:col-span-1">
                        <AnimatePresence mode="wait">
                            {selectedOrder ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-zinc-900 rounded-[2.5rem] border border-white/5 p-8 sticky top-8 space-y-8"
                                >
                                    {/* Panel Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                            <ClipboardList size={24} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Order ID</p>
                                            <p className="text-xl font-black text-white">#{selectedOrder.id}</p>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{selectedOrder.user?.name || 'Guest Customer'}</p>
                                                <p className="text-[10px] font-bold text-zinc-500 truncate max-w-[150px]">{selectedOrder.user?.email || 'Walk-in Order'}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <Table size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">Table No.</p>
                                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{selectedOrder.tableNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Order Content</h3>
                                        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-800/30 border border-white/5 group hover:bg-zinc-800/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-orange-500">
                                                            {item.quantity}x
                                                        </div>
                                                        <span className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{item.product.name}</span>
                                                    </div>
                                                    <span className="text-sm font-black text-zinc-400">₹{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Notes (If Any) */}
                                    {selectedOrder.notes && (
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Internal Notes</h3>
                                            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-4">
                                                <MessageSquare className="text-orange-500 mt-1 shrink-0" size={16} />
                                                <p className="text-xs font-bold text-orange-200/80 italic leading-relaxed">
                                                    "{selectedOrder.notes}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Controls */}
                                    <div className="space-y-4">
                                        {selectedOrder.status === 'COMPLETED' ? (
                                            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center gap-3 py-10">
                                                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-2">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                                <h4 className="text-lg font-black text-emerald-500 uppercase tracking-tighter">Order Fulfilled</h4>
                                                <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest">Completed on {format(new Date(), 'dd MMM, hh:mm a')}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Update Status</h3>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => updateStatus(selectedOrder.id, 'PREPARING')}
                                                        disabled={updatingStatus === selectedOrder.id}
                                                        className={cn(
                                                            "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-zinc-400",
                                                            selectedOrder.status === 'PREPARING'
                                                                ? "bg-blue-500/10 border-blue-500/50 text-blue-500"
                                                                : "bg-zinc-800 border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5"
                                                        )}
                                                    >
                                                        <Clock size={20} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Preparing</span>
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(selectedOrder.id, 'READY')}
                                                        disabled={updatingStatus === selectedOrder.id}
                                                        className={cn(
                                                            "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-zinc-400",
                                                            selectedOrder.status === 'READY'
                                                                ? "bg-purple-500/10 border-purple-500/50 text-purple-500"
                                                                : "bg-zinc-800 border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5"
                                                        )}
                                                    >
                                                        <CheckCircle2 size={20} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Ready</span>
                                                    </button>
                                                </div>

                                                {selectedOrder.status === 'READY' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="space-y-3 pt-2"
                                                    >
                                                        <div className="relative group">
                                                            <MessageSquare className="absolute left-4 top-4 text-zinc-700 group-focus-within:text-orange-500 transition-colors" size={16} />
                                                            <textarea
                                                                placeholder="Add a final note or collection instructions..."
                                                                value={customMessage}
                                                                onChange={(e) => setCustomMessage(e.target.value)}
                                                                className="w-full bg-zinc-800 border border-white/5 rounded-2xl p-4 pl-12 text-xs font-medium focus:ring-1 focus:ring-orange-500/50 outline-none transition-all resize-none h-24"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => updateStatus(selectedOrder.id, 'COMPLETED')}
                                                            disabled={updatingStatus === selectedOrder.id}
                                                            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                        >
                                                            {updatingStatus === selectedOrder.id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <>
                                                                    Complete Order
                                                                    <ArrowRight size={16} />
                                                                </>
                                                            )}
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-zinc-900/40 rounded-[2.5rem] border border-dashed border-white/5">
                                    <div className="w-16 h-16 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-zinc-700 mb-6">
                                        <Package size={32} />
                                    </div>
                                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-2">No Order Selected</h3>
                                    <p className="text-xs text-zinc-600 font-bold max-w-[200px]">Select an order from the list to view details and update its status</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}

import { ClipboardList } from 'lucide-react';
