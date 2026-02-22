'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Coffee as MenuIcon,
    LogOut,
    ChevronRight,
    Search,
    Bell,
    User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout, user, isAdmin, loading } = useAuth();
    const router = useRouter();

    const isLoginPage = pathname === '/admin/login';

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Don't wrap login page in dashboard layout
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Redirect if not admin
    if (!isAdmin) {
        if (typeof window !== 'undefined') {
            router.push('/admin/login');
        }
        return null;
    }

    const menuItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'User Management', icon: Users },
        { href: '/admin/products', label: 'Menu Management', icon: MenuIcon },
    ];

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-zinc-900 border-r border-white/5 flex flex-col">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                            <MenuIcon className="text-white" size={20} />
                        </div>
                        <span className="font-black text-xl tracking-tight">CaffAIne <span className="text-orange-500 uppercase text-[10px] block tracking-[0.3em]">Admin</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-orange-500 text-white shadow-xl shadow-orange-500/10"
                                        : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} />
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                </div>
                                <ChevronRight
                                    size={16}
                                    className={cn(
                                        "transition-transform",
                                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40 group-hover:translate-x-1"
                                    )}
                                />
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-white/5">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 text-zinc-500 hover:text-red-400 transition-colors w-full font-bold text-sm"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-zinc-900/50 backdrop-blur-md border-b border-white/5 px-10 flex items-center justify-between relative z-20">
                    <div className="flex items-center gap-6 flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Universal search..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-zinc-700"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-zinc-900" />
                        </button>
                        <div className="h-10 w-[1px] bg-white/5 mx-2" />
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-white">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Master Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                                <User size={20} className="text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
