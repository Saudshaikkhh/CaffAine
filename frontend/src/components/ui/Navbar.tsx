'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Coffee, Sparkles, ShoppingBag, LayoutDashboard, User, LogOut, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cart } = useCart();
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const isHiddenPage = pathname.startsWith('/admin');

    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isHiddenPage) return null;

    const navLinks = [
        { href: '/menu', label: 'Menu', icon: Coffee },
        { href: '/order', label: itemCount > 0 ? `Cart (${itemCount})` : 'Cart', icon: ShoppingBag },
        { href: '/orders', label: 'History', icon: Clock },
        { href: '/mood', label: 'Mood AI', icon: Sparkles },
    ];

    // Only add Admin link if user is an admin
    if (isAdmin) {
        navLinks.push({ href: '/admin', label: 'Admin', icon: LayoutDashboard });
    }

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                scrolled
                    ? 'bg-zinc-950/80 backdrop-blur-xl py-3 shadow-2xl shadow-black/50'
                    : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group relative">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                        className="relative z-10"
                    >
                        <img
                            src="/rlogo.png"
                            alt="CaffAIne"
                            className="h-16 w-auto object-contain transition-all duration-300"
                        />
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-full group flex items-center gap-2',
                                    isActive
                                        ? 'text-white'
                                        : 'text-zinc-400 hover:text-white'
                                )}
                            >
                                <Icon
                                    size={16}
                                    className={cn(
                                        'transition-transform duration-300 group-hover:scale-110',
                                        isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-orange-400'
                                    )}
                                />
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="navPill"
                                        className="absolute inset-0 bg-white/10 border border-white/10 rounded-full -z-10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                    <div className="ml-6 pl-6 border-l border-zinc-800 flex items-center gap-4">

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-white/5 rounded-2xl group/user">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-lg">
                                        <User size={16} />
                                    </div>
                                    <div className="text-left hidden xl:block">
                                        <p className="text-xs font-black text-white leading-none mb-1">{user?.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">{user?.role}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="ml-2 p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            </div>

                        ) : (
                            <Link href="/login">
                                <Button className="rounded-2xl px-6 bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 font-bold transition-all">
                                    Login
                                </Button>
                            </Link>
                        )}


                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 lg:hidden">
                    <Link href="/order" className="relative group/cart">
                        <ShoppingBag size={24} className="text-zinc-400" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 text-[10px] font-black flex items-center justify-center text-white border-2 border-zinc-950">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-zinc-900/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col gap-4">
                            {isAuthenticated && (
                                <div className="flex items-center gap-4 p-4 mb-2 bg-white/5 rounded-3xl border border-white/5">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                                        <User size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-white">{user?.name}</p>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{user?.role}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-3 bg-red-500/10 text-red-500 rounded-xl"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            )}

                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'flex items-center gap-4 p-4 rounded-2xl transition-all duration-300',
                                            isActive
                                                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        <div className={cn(
                                            'w-10 h-10 rounded-xl flex items-center justify-center',
                                            isActive ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-500'
                                        )}>
                                            <Icon size={20} />
                                        </div>
                                        <span className="text-lg font-semibold">{link.label}</span>
                                    </Link>
                                );
                            })}

                            {!isAuthenticated && (
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-zinc-800 text-white border border-white/10">
                                        Login
                                    </Button>
                                </Link>
                            )}

                            <div className="pt-4 border-t border-zinc-800">
                                <Link href="/order" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 border-none shadow-xl shadow-orange-500/20">
                                        {itemCount > 0 ? 'Checkout' : 'Order Now'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
