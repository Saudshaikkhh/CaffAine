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
    User,
    ClipboardList
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
        { href: '/admin/orders', label: 'Recent Orders', icon: ClipboardList },
        { href: '/admin/users', label: 'User Management', icon: Users },
        { href: '/admin/products', label: 'Menu Management', icon: MenuIcon },
    ];

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-zinc-900 border-r border-white/5 flex flex-col">
                <div className="p-8 flex justify-center">
                    <Link href="/" className="group">
                        <img
                            src="/rlogo.png"
                            alt="CaffAIne Logo"
                            className="w-44 h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                        />
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
                <header className="h-20 bg-zinc-900 border-b border-white/5 px-10 flex items-center justify-between relative z-20">
                    <div className="flex items-center gap-6 flex-1" />

                    <div className="flex items-center gap-6">
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
