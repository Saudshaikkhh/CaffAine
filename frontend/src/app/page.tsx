'use client';

import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Coffee, Star, Zap, Heart, ChevronDown, Play } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';

// Steam particles for coffee cup animation - using deterministic offsets
const steamOffsets = [-10, 5, -5, 12, -8];
const SteamParticle = ({ delay, index }: { delay: number; index: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-white/60 rounded-full blur-sm"
    initial={{ opacity: 0, y: 0, x: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      y: [-20, -80],
      x: [0, steamOffsets[index % steamOffsets.length]],
    }}
    transition={{
      duration: 2.5,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

// Animated coffee cup with steam
const AnimatedCoffeeCup = ({ scale = 1, isBrewing = false }: { scale?: number; isBrewing?: boolean }) => (
  <div className="relative" style={{ transform: `scale(${scale})` }}>
    {/* Steam - Only show when full or brewing */}
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-20 overflow-hidden">
      {[0, 1, 2].map((delay, i) => (
        <SteamParticle key={i} delay={delay} index={i} />
      ))}
    </div>

    {/* Cup */}
    <motion.div
      className="relative w-32 h-26 bg-gradient-to-b from-zinc-100 to-zinc-300 rounded-b-[40px] rounded-t-lg shadow-2xl overflow-hidden"
      animate={{ rotate: isBrewing ? [0, -1, 1, 0] : 0 }}
      transition={{ duration: 0.5, repeat: isBrewing ? Infinity : 0, ease: "easeInOut" }}
    >
      {/* Coffee liquid */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-950 via-orange-900 to-orange-800"
        initial={{ height: '0%' }}
        animate={{
          height: isBrewing ? ['0%', '75%'] : '75%',
        }}
        transition={{
          duration: isBrewing ? 5 : 0.5,
          ease: "linear"
        }}
      >
        {/* Coffee shine */}
        <div className="absolute top-2 left-3 w-8 h-4 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-sm" />
      </motion.div>

      {/* Cup shine */}
      <div className="absolute top-0 left-2 w-3 h-full bg-gradient-to-r from-white/30 to-transparent" />
    </motion.div>

    {/* Handle */}
    <div className="absolute top-4 -right-6 w-6 h-14 border-4 border-zinc-200 border-l-0 rounded-r-full" />

    {/* Saucer */}
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-40 h-4 bg-gradient-to-b from-zinc-200 to-zinc-300 rounded-full shadow-lg" />
  </div>
);

// Professional AI Coffee Machine component
const ProfessionalCoffeeMachine = () => {
  const [isBrewing, setIsBrewing] = useState(false);
  const [hasBrewed, setHasBrewed] = useState(false);

  const startBrewing = () => {
    if (isBrewing) return;
    setIsBrewing(true);
    setHasBrewed(true);
    setTimeout(() => {
      setIsBrewing(false);
    }, 5000);
  };

  return (
    <div className="relative w-[320px] h-[480px] mx-auto group">
      {/* Machine Body */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden gpu">
        {/* Metallic Texture Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

        {/* Side Vents */}
        <div className="absolute left-4 top-1/4 bottom-1/4 w-1 flex flex-col gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-white/5 rounded-full" />
          ))}
        </div>

        {/* Top Display Panel */}
        <div className="absolute top-8 left-8 right-8 h-32 bg-zinc-950/80 rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center justify-center gap-2 p-4">
          {/* AI Pulse Graph */}
          <div className="flex items-center gap-1 h-8">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-1 rounded-full",
                  isBrewing ? "bg-orange-400" : "bg-orange-500/40"
                )}
                animate={{
                  height: isBrewing ? [4, 28, 4] : [4, Math.random() * 12 + 4, 4],
                }}
                transition={{
                  duration: isBrewing ? 0.4 : 1.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          <div className="text-[10px] font-mono text-orange-400/60 tracking-[0.2em] uppercase">
            {isBrewing ? 'Brewing AI Blend...' : 'AI Neural Processing'}
          </div>

          {/* Animated Scan Line */}
          <motion.div
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: isBrewing ? 2 : 4, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Minimal Dot Button below screen */}
        <div className="absolute top-[170px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <motion.button
            onClick={startBrewing}
            disabled={isBrewing}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "w-6 h-6 rounded-full border-2 transition-all duration-500 relative group/btn",
              isBrewing
                ? "border-orange-500 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] cursor-not-allowed"
                : "border-white/20 bg-zinc-900 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] shadow-xl"
            )}
          >
            {/* Inner Glow */}
            {!isBrewing && (
              <div className="absolute inset-0 rounded-full bg-orange-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            )}

            {/* Status Dot */}
            <motion.div
              className={cn(
                "absolute inset-1.5 rounded-full",
                isBrewing ? "bg-white" : "bg-white/10"
              )}
              animate={isBrewing ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.button>
          <div className="text-[8px] font-bold text-zinc-600 tracking-[0.2em] uppercase">Trigger</div>
        </div>

        {/* Brewing Chamber */}
        <div className="absolute bottom-12 left-10 right-10 top-[220px] bg-zinc-950 rounded-b-2xl border-t border-white/5 flex flex-col items-center justify-end pb-8 group">
          {/* Inner Light Glow */}
          <motion.div
            className="absolute inset-0 blur-xl"
            animate={{
              backgroundColor: isBrewing ? "rgba(249, 115, 22, 0.15)" : "rgba(249, 115, 22, 0.05)"
            }}
          />

          {/* Coffee Machine Nozzle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-b-xl border border-white/5" />

          {/* Liquid Stream Animation */}
          <AnimatePresence>
            {isBrewing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 160, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 w-2 z-0 bg-gradient-to-b from-orange-900 via-orange-800 to-orange-950 rounded-full blur-[1px]"
              >
                {/* Steam inside chamber during brew */}
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Cup */}
          <div className="relative z-10 scale-[0.65] origin-bottom">
            <AnimatedCoffeeCup isBrewing={isBrewing} />
          </div>

          {/* Drip Tray */}
          <div className="absolute bottom-0 w-full h-1.5 bg-zinc-800/80 grid grid-cols-6 gap-0.5 px-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-black/40 h-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Exterior Elements */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-zinc-800 rounded-full border-r border-white/10" />
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-zinc-800 rounded-full border-l border-white/10" />

      {/* Floor shadow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[280px] h-12 bg-black/60 blur-3xl rounded-full" />
    </div>
  );
};

// Intro splash screen
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-gradient-to-br from-zinc-900 via-amber-950 to-zinc-900 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        {/* Animated Logo Reveal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <motion.img
            src="/rlogo.png"
            alt="CaffAIne"
            className="h-28 md:h-36 mx-auto"
          />
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-light text-white tracking-widest"
            initial={{ letterSpacing: "0.5em", opacity: 0 }}
            animate={{ letterSpacing: "0.3em", opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            WELCOME TO
          </motion.h1>
          <motion.h2
            className="text-5xl md:text-7xl font-bold mt-4 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
          >
            CaffAIne
          </motion.h2>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="mt-12 w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 2.4, duration: 1 }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-amber-200/60 mt-6 text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          AI-Powered Coffee Experience
        </motion.p>
      </div>

      {/* Background particles - reduced and optimized */}
      {[
        { left: 10, top: 20, delay: 0.2 }, { left: 80, top: 80, delay: 1.5 },
        { left: 30, top: 40, delay: 0.8 }, { left: 70, top: 60, delay: 1.2 },
        { left: 20, top: 75, delay: 0.5 }, { left: 90, top: 25, delay: 1.8 },
        { left: 50, top: 50, delay: 0.3 }, { left: 15, top: 10, delay: 1.0 },
      ].map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-400/20 rounded-full gpu"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 4,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// Feature data
const features = [
  {
    icon: Sparkles,
    title: 'AI Mood Detection',
    desc: 'Tell us how you feel, we\'ll find your perfect brew',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Instant Orders',
    desc: 'Skip the line with seamless mobile ordering',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Heart,
    title: 'Crafted with Love',
    desc: 'Premium beans, expert baristas, unforgettable taste',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Star,
    title: 'Rewards Program',
    desc: 'Earn points with every sip, unlock exclusive perks',
    color: 'from-amber-500 to-yellow-500'
  },
];

// Testimonials
const testimonials = [
  { name: 'Sarah M.', text: 'The AI knew exactly what I needed after my morning workout!', rating: 5 },
  { name: 'James K.', text: 'Best coffee app I\'ve ever used. The mood feature is genius.', rating: 5 },
  { name: 'Emily R.', text: 'Finally, coffee that matches my energy. Love it!', rating: 5 },
];

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['morning', 'mood', 'moment', 'soul'];

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <div ref={containerRef} className="relative bg-zinc-950 text-white overflow-hidden">
        {/* Hero Section - Full Screen - Removed items-center to prevent collision */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 lg:pt-0">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-amber-950/40 to-zinc-900" />

            {/* Animated grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(251,146,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.3) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }} />
            </div>

            <motion.img
              src="/rlogo.png"
              alt="CaffAIne"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 md:h-32 opacity-5"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating orbs - Optimized blur and animate fewer properties */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[80px] gpu"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[60px] gpu"
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Content - Substantial clearance for the large logo */}
          <div className="relative z-10 w-full px-6 max-w-7xl mx-auto pt-16 lg:pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left Column: Text Content */}
              <motion.div
                style={{ y, opacity }}
                className="text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-sm font-medium text-orange-300/80">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Coffee size={16} />
                    </motion.span>
                    Future of Coffee
                  </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
                >
                  <span className="text-white whitespace-nowrap">Coffee for every</span>
                  <br />
                  <span className="relative inline-block whitespace-nowrap">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentWord}
                        initial={{ y: 20, opacity: 0, rotateX: -90 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -20, opacity: 0, rotateX: 90 }}
                        transition={{ duration: 0.4 }}
                        className="inline-block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent"
                      >
                        {words[currentWord]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-xl md:text-2xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed"
                >
                  Our AI barista learns your preferences and crafts personalized
                  recommendations based on your mood, time, and taste.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                >
                  <Link href="/order">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(249,115,22,0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative h-16 px-10 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg shadow-xl shadow-orange-500/20 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Order Now
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowRight size={20} />
                        </motion.span>
                      </span>
                    </motion.button>
                  </Link>

                  <Link href="/mood">
                    <motion.button
                      whileHover={{ scale: 1.05, borderColor: "rgba(249,115,22,0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="h-16 px-10 rounded-2xl border border-zinc-800 text-white font-medium text-lg hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                      <Sparkles size={20} className="text-orange-400/80" />
                      Try Mood AI
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Column: Visual Component */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 1, type: "spring" }}
                className="flex justify-center lg:justify-end lg:pr-12 mt-12 lg:mt-0"
              >
                <div className="scale-90 md:scale-110 xl:scale-125 transform transition-transform duration-700">
                  <ProfessionalCoffeeMachine />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-zinc-500"
            >
              <span className="text-xs uppercase tracking-widest">Explore</span>
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Why <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">CaffAIne?</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Experience the future of coffee ordering with cutting-edge AI technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group relative p-8 rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-16">
                Loved by <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Coffee Lovers</span>
              </h2>
            </motion.div>

            <div className="relative h-48">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-2xl md:text-3xl text-white font-light italic mb-6">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <p className="text-orange-400 font-semibold">
                    — {testimonials[currentTestimonial].name}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonial ? 'bg-orange-500 w-8' : 'bg-zinc-600'
                    }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-32 px-6 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600" />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
            animate={{ x: [0, 40], y: [0, 40] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready for your perfect cup?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                Join thousands of coffee lovers who've discovered their ideal brew with CaffAIne.
              </p>
              <Link href="/mood">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 px-12 rounded-2xl bg-zinc-900 text-white font-bold text-lg shadow-2xl hover:bg-zinc-800 transition-colors flex items-center gap-3 mx-auto"
                >
                  <Play size={20} fill="currentColor" />
                  Start Your Journey
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-zinc-950 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <img src="/rlogo.png" alt="CaffAIne" className="h-8" />
            <p className="text-zinc-500 text-sm">
              © 2026 CaffAIne. Brewed with AI & ❤️
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
