'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Package, TrendingUp, DollarSign, Users, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPage() {
    const [products, setProducts] = useState([]);

    // Mock sales data for now
    const data = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ];

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-10"
            >
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Executive <span className="text-orange-500">Dashboard</span></h1>
                        <p className="text-zinc-500 mt-2 text-lg">Insights and inventory at your fingertips</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-xl">
                        <Download size={18} />
                        Download PDF Report
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value="$45,231.89"
                        icon={<DollarSign className="text-orange-500" />}
                        trend="+20.1% from last month"
                        color="from-orange-500/10 to-transparent"
                    />
                    <StatCard
                        title="Total Orders"
                        value="+2,350"
                        icon={<Package className="text-amber-500" />}
                        trend="+180.1% from last month"
                    />
                    <StatCard
                        title="Total Sales"
                        value="+12,234"
                        icon={<TrendingUp className="text-orange-500" />}
                        trend="+19% from last month"
                    />
                    <StatCard
                        title="Active Sessions"
                        value="+573"
                        icon={<Users className="text-amber-500" />}
                        trend="+201 since last hour"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Container */}
                    <div className="lg:col-span-2 bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrendingUp size={120} className="text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-black mb-8">Revenue Analytics</h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{
                                            backgroundColor: '#09090b',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                            padding: '12px 16px'
                                        }}
                                    />
                                    <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Inventory Sidecard */}
                    <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                        <h3 className="text-2xl font-black mb-8">Low Inventory</h3>
                        <div className="space-y-8">
                            {products.slice(0, 6).map((product: any) => (
                                <div key={product.id} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{product.name}</p>
                                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-white">{product.inventory}</p>
                                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(product.inventory, 100)}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={cn(
                                                    'h-full rounded-full',
                                                    product.inventory < 20 ? 'bg-orange-500' : 'bg-amber-500'
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && <p className="text-zinc-600 font-bold text-center py-10">Loading inventory data...</p>}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }: any) {
    return (
        <div className={cn(
            "p-8 bg-zinc-900 rounded-[2rem] border border-white/5 shadow-xl transition-all hover:border-orange-500/20 group relative overflow-hidden",
            color
        )}>
            <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-100 group-hover:scale-110 transition-transform shadow-lg">
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Overview</div>
            </div>
            <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{title}</h3>
                <div className="text-3xl font-black text-white tracking-tight">{value}</div>
                <p className="text-xs text-orange-500/80 font-bold mt-2">{trend}</p>
            </div>
        </div>
    );
}
