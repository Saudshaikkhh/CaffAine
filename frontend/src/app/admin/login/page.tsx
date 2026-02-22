'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ShieldAlert, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password, true);
            router.push('/admin');
        } catch (err: any) {
            setError(err.message || 'Invalid administrator credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 pt-24">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Admin <span className="text-orange-500">Access</span></h1>
                    <p className="text-zinc-500 font-medium tracking-wide">CaffAIne Executive Management</p>
                </div>

                <div className="bg-zinc-900 border border-white/10 p-10 rounded-[3rem] shadow-3xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Administrative Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all font-mono text-sm"
                                    placeholder="admin@caffaine.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Secure Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl pl-14 pr-14 text-white focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all font-mono text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-orange-500 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-orange-500/5 border border-orange-500/20 text-orange-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-3"
                            >
                                <ShieldAlert size={18} className="flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 group transition-all"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Authenticate
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center mt-12 bg-orange-500/5 border border-orange-500/10 p-6 rounded-3xl">
                    <p className="text-xs text-orange-200/40 font-bold uppercase tracking-widest leading-relaxed">
                        Authorized access only. All administrative activities are logged and monitored for security compliance.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
