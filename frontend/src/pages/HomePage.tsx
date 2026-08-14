import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem { label: string; value: number; suffix: string; icon: string; }
interface FeatureItem { icon: string; title: string; desc: string; color: string; }
interface StepItem { icon: string; title: string; desc: string; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS: StatItem[] = [
    { label: 'Registered PCs', value: 2847, suffix: '+', icon: '💻' },
    { label: 'Active Users', value: 94, suffix: '', icon: '👤' },
    { label: 'Campus Gates', value: 4, suffix: '', icon: '🏛️' },
    { label: 'Daily Registrations', value: 312, suffix: '+', icon: '📋' },
];

const FEATURES: FeatureItem[] = [
    { icon: '⚡', title: 'Instant Registration', desc: 'Register laptops at the gate in under 10 seconds with our streamlined digital workflow.', color: '#3b82f6' },
    { icon: '🛡️', title: 'Guard Verification', desc: 'Guards verify exits instantly by serial number or student ID — no paper needed.', color: '#06b6d4' },
    { icon: '📡', title: 'Real-time Tracking', desc: 'Know exactly which laptops are on campus at any moment with live status updates.', color: '#8b5cf6' },
    { icon: '📄', title: 'PDF Reports', desc: 'Generate and export detailed registration reports with one click, any time.', color: '#10b981' },
    { icon: '🔐', title: 'Role-based Access', desc: 'Separate admin and guard roles with fine-grained permission control.', color: '#f59e0b' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Visual insights into daily activity, peak hours, and laptop brand distribution.', color: '#ec4899' },
];

const STEPS: StepItem[] = [
    { icon: '🎓', title: 'Student Arrives at Gate', desc: 'Student approaches the campus gate with their laptop.' },
    { icon: '🔍', title: 'Guard Registers Device', desc: 'Guard enters serial number, student ID, and laptop details in seconds.' },
    { icon: '✅', title: 'System Records & Tracks', desc: 'Record is stored with timestamp. Guard can verify exit in one search.' },
];

const SECURITY = [
    'Role-based authentication with secure session management',
    'All data encrypted at rest and in transit via HTTPS',
    'Full audit trail — every action is logged with user and timestamp',
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = value / 60;
        const timer = setInterval(() => {
            start += step;
            if (start >= value) { setCount(value); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Three.js Particle Network ────────────────────────────────────────────────
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const COUNT = 100;
        const MAX_DIST = 140;
        const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

        let W = canvas.offsetWidth;
        let H = canvas.offsetHeight;
        canvas.width = W;
        canvas.height = H;

        type Particle = { x: number; y: number; vx: number; vy: number; r: number };
        const particles: Particle[] = Array.from({ length: COUNT }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 1,
        }));

        let mouse = { x: W / 2, y: H / 2 };
        const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        window.addEventListener('mousemove', onMouseMove);

        let animId: number;
        const draw = () => {
            animId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, W, H);

            // Move
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            }

            // Draw connections
            for (let i = 0; i < COUNT; i++) {
                for (let j = i + 1; j < COUNT; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < MAX_DIST_SQ) {
                        const alpha = (1 - Math.sqrt(distSq) / MAX_DIST) * 0.25;
                        ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Mouse proximity boost
            for (const p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 22500) {
                    const alpha = (1 - Math.sqrt(distSq) / 150) * 0.5;
                    ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Draw dots
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59,130,246,0.7)';
                ctx.fill();
            }
        };
        draw();

        const onResize = () => {
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = W;
            canvas.height = H;
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        />
    );
}

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat, delay }: { stat: StatItem; delay: number }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Reveal delay={delay}>
            <motion.div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{ scale: 1.04, rotateX: -3, rotateY: 3 }}
                style={{
                    background: 'rgba(30,41,59,0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${hovered ? '#3b82f6' : 'rgba(59,130,246,0.15)'}`,
                    borderRadius: 16,
                    padding: '28px 24px',
                    cursor: 'default',
                    boxShadow: hovered ? '0 0 30px rgba(59,130,246,0.25)' : '0 4px 24px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
            >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{stat.icon}</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 8 }}>
                    <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>{stat.label}</div>
            </motion.div>
        </Reveal>
    );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ feature, delay }: { feature: FeatureItem; delay: number }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Reveal delay={delay}>
            <motion.div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{ scale: 1.03, y: -4 }}
                style={{
                    background: 'rgba(15,23,42,0.7)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${hovered ? feature.color : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 16,
                    padding: '28px',
                    height: '100%',
                    boxShadow: hovered ? `0 0 28px ${feature.color}33` : 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
            >
                <motion.div
                    animate={hovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ fontSize: 36, marginBottom: 16, display: 'inline-block' }}
                >
                    {feature.icon}
                </motion.div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{feature.title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{feature.desc}</div>
            </motion.div>
        </Reveal>
    );
}

// ─── Background grid ──────────────────────────────────────────────────────────
const GridBg = () => (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#0f172a', color: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>

            {/* ── NAV ── */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                    background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '0 24px', height: 64,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/asset/logo.png" alt="HU" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }} />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Haramaya University</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>PC Registry System</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(59,130,246,0.5)',
                            background: 'transparent', color: '#93c5fd', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', marginRight: 8,
                        }}
                    >
                        Sign In
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '8px 20px', borderRadius: 8, border: 'none',
                            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        Get Started
                    </motion.button>
                </div>
            </motion.nav>

            {/* ── HERO ── */}
            <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: 64 }}>
                {/* Gradient background */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #1e3a5f44 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #3b82f620, transparent 70%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #06b6d420, transparent 70%)', filter: 'blur(40px)' }} />

                <ParticleCanvas />
                <GridBg />

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 860, margin: '0 auto' }}>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32 }}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                        <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Haramaya University · Ethiopia</span>
                    </motion.div>

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                        style={{ marginBottom: 28 }}
                    >
                        <motion.img
                            src="/asset/logo.png"
                            alt="Haramaya University"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #3b82f6', boxShadow: '0 0 40px rgba(59,130,246,0.4), 0 0 80px rgba(59,130,246,0.15)' }}
                        />
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                        style={{ fontSize: 'clamp(38px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}
                    >
                        <span style={{ color: '#fff' }}>Smart Campus</span>
                        <br />
                        <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            PC Registry System
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                        style={{ fontSize: 'clamp(15px, 2.2vw, 20px)', color: '#94a3b8', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}
                    >
                        Replacing paper-based laptop tracking with intelligent digital management — built for university gates.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                        style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59,130,246,0.6)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/login')}
                            style={{ padding: '14px 36px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em' }}
                        >
                            Get Started →
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{ padding: '14px 36px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </div>

                {/* Scroll hint */}
                <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: '#475569', fontSize: 22 }}
                >
                    ↓
                </motion.div>
            </section>

            {/* ── STATS ── */}
            <section style={{ padding: '100px 24px', position: 'relative' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>By the numbers</div>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Trusted across campus</h2>
                        </div>
                    </Reveal>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                        {STATS.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 0.1} />)}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" style={{ padding: '100px 24px', background: 'rgba(15,23,42,0.8)', position: 'relative' }}>
                <GridBg />
                <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Everything you need</div>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16 }}>Built for real-world campus operations</h2>
                            <p style={{ color: '#64748b', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>Every feature was designed around the actual workflow of university security guards and administrators.</p>
                        </div>
                    </Reveal>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                        {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} delay={i * 0.08} />)}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <Reveal>
                        <div style={{ textAlign: 'center', marginBottom: 72 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Simple process</div>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Up and running in seconds</h2>
                        </div>
                    </Reveal>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {STEPS.map((step, i) => (
                            <Reveal key={step.title} delay={i * 0.15}>
                                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative' }}>
                                    {/* Step indicator + line */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                        <motion.div
                                            whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
                                            style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, zIndex: 1 }}
                                        >
                                            {step.icon}
                                        </motion.div>
                                        {i < STEPS.length - 1 && (
                                            <div style={{ width: 2, flex: 1, minHeight: 60, background: 'linear-gradient(to bottom, #3b82f6, #1e3a5f)', marginTop: 4 }} />
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div style={{ paddingTop: 12, paddingBottom: i < STEPS.length - 1 ? 48 : 0 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Step {i + 1}</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{step.title}</div>
                                        <div style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 480 }}>{step.desc}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECURITY ── */}
            <section style={{ padding: '100px 24px', background: '#0a1628', position: 'relative', overflow: 'hidden' }}>
                <GridBg />
                {/* Glow */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.08), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Reveal>
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0], filter: ['drop-shadow(0 0 8px #3b82f6)', 'drop-shadow(0 0 20px #3b82f6)', 'drop-shadow(0 0 8px #3b82f6)'] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            style={{ fontSize: 72, marginBottom: 24, display: 'inline-block' }}
                        >
                            🛡️
                        </motion.div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Security first</div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>Enterprise Grade Security</h2>
                        <p style={{ color: '#64748b', fontSize: 16, marginBottom: 48, lineHeight: 1.7 }}>
                            Built with university-level security standards. Your data is protected, access is controlled, and every action is traceable.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
                            {SECURITY.map((item, i) => (
                                <Reveal key={i} delay={i * 0.1}>
                                    <motion.div
                                        whileHover={{ x: 6 }}
                                        style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 12, padding: '16px 20px' }}
                                    >
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#60a5fa', flexShrink: 0, marginTop: 1 }}>✓</div>
                                        <span style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.6 }}>{item}</span>
                                    </motion.div>
                                </Reveal>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: '120px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                            style={{
                                position: 'absolute',
                                left: `${(i * 5.26) % 100}%`,
                                top: `${(i * 13.7) % 100}%`,
                                width: 4, height: 4, borderRadius: '50%',
                                background: i % 2 === 0 ? '#3b82f6' : '#06b6d4',
                                opacity: 0.4,
                            }}
                        />
                    ))}
                </div>
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Reveal>
                        <h2 style={{ fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.02em' }}>
                            Ready to modernize<br />your campus?
                        </h2>
                        <p style={{ fontSize: 18, color: '#94a3b8', marginBottom: 48 }}>
                            Join Haramaya University in replacing slow, error-prone paper systems with instant digital management.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(59,130,246,0.7), 0 20px 60px rgba(59,130,246,0.3)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/login')}
                            style={{ padding: '18px 56px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4)', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em' }}
                        >
                            Sign In to the System →
                        </motion.button>
                    </Reveal>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#0a1628', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src="/asset/logo.png" alt="HU" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1e40af' }} />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Haramaya University</div>
                            <div style={{ fontSize: 11, color: '#475569' }}>PC Registry System</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['About', 'Contact', 'Support'].map(link => (
                            <span key={link} style={{ fontSize: 13, color: '#475569', cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.target as HTMLElement).style.color = '#94a3b8'}
                                onMouseLeave={e => (e.target as HTMLElement).style.color = '#475569'}
                            >{link}</span>
                        ))}
                    </div>
                    <div style={{ fontSize: 12, color: '#334155' }}>© 2026 Haramaya University · PC Registry System · Ethiopia</div>
                </div>
            </footer>

        </div>
    );
}
