'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    User,
    Mail,
    Calendar,
    ShoppingBag,
    ChevronRight,
    X,
    Clock,
    IndianRupee,
    ChevronDown,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/users');
            const data = await res.json();
            // Filter out admins if you want, but user said "search for users"
            setUsers(data.filter((u: any) => u.role === 'CUSTOMER'));
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserHistory = async (userId: number) => {
        setHistoryLoading(true);
        try {
            const res = await fetch(`http://localhost:3001/users/${userId}`);
            const data = await res.json();
            setSelectedUser(data);
        } catch (err) {
            console.error('Failed to fetch user history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">User <span className="text-orange-500">Management</span></h1>
                    <p className="text-zinc-500 mt-2">Manage your customer base and view order patterns</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Member</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Joined Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Loading Registry...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                        onClick={() => fetchUserHistory(user.id)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{user.name}</p>
                                                    <p className="text-xs text-zinc-500 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-zinc-500 text-xs">
                                            {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-500/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-zinc-800 rounded-xl text-zinc-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-zinc-600 font-bold">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Details Sidebar/Overlay */}
            <AnimatePresence>
                {selectedUser && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 p-6"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-zinc-950 border-l border-white/10 z-[60] shadow-3xl flex flex-col"
                        >
                            <div className="p-10 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black">{selectedUser.name}</h2>
                                        <div className="flex items-center gap-3 text-zinc-500 mt-1">
                                            <Mail size={14} />
                                            <span className="text-xs font-bold">{selectedUser.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-3 hover:bg-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-zinc-900 rounded-[2rem] border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Total Orders</p>
                                        <p className="text-3xl font-black text-white">{selectedUser.orders?.length || 0}</p>
                                    </div>
                                    <div className="p-6 bg-zinc-900 rounded-[2rem] border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Since</p>
                                        <p className="text-xl font-black text-white">
                                            {new Date(selectedUser.createdAt || Date.now()).toLocaleDateString('en-GB', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black flex items-center gap-3">
                                            <Clock size={20} className="text-orange-500" />
                                            Order History
                                        </h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full">Archive</span>
                                    </div>

                                    <div className="space-y-4">
                                        {selectedUser.orders && selectedUser.orders.length > 0 ? (
                                            selectedUser.orders.map((order: any, idx: number) => {
                                                const orderTotal = order.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        key={order.id}
                                                        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 group hover:border-orange-500/30 transition-all"
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                                    <ShoppingBag size={18} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black uppercase tracking-widest text-white">Order #{order.id.toString().padStart(4, '0')}</p>
                                                                    <p className="text-[10px] font-bold text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-lg font-black text-orange-500">₹{orderTotal}</p>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60">Success</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2 pt-4 border-t border-white/5">
                                                            {order.items.map((item: any) => (
                                                                <div key={item.id} className="flex items-center justify-between text-xs">
                                                                    <span className="text-zinc-400 font-medium">
                                                                        <span className="text-orange-500 font-bold mr-2">{item.quantity}x</span>
                                                                        {item.product.name}
                                                                    </span>
                                                                    <span className="text-zinc-500 font-mono">₹{item.product.price * item.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/5">
                                                <ShoppingBag size={40} className="mx-auto text-zinc-800 mb-4" />
                                                <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No orders found for this user</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
