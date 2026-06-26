import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles, BookOpen, Megaphone, Palette,
  ArrowRight, Zap, Shield, BarChart3,
  CheckCircle2, ChevronRight,
  FileText, Lightbulb, Star,
} from 'lucide-react';
import { useDemoLogin } from '../hooks/useDemoLogin';
import '../styles/Landing.css';

/* ── variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ── count-up hook ── */
function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setValue(target); clearInterval(t); }
      else setValue(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return { ref, value };
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <div className="stat-item">
      <span ref={ref} className="stat-num">{v}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function AnimSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

/* ── data ── */
const FEATURES = [
  { icon: BookOpen,  title: 'Story Generator',  desc: 'Craft narratives, fiction, and scripts across any genre with AI as your co-author.', color: '#B08304', bg: '#FFFDE3' },
  { icon: Megaphone, title: 'Campaign Planner', desc: 'Full marketing campaigns — messaging, hooks, ad headlines, and content calendars.',  color: '#B08304', bg: '#FFFDE3' },
  { icon: Palette,   title: 'Brand Kit',        desc: 'Brand voice, color palettes, taglines, and messaging pillars — built in minutes.',   color: '#B08304', bg: '#FFFDE3' },
  { icon: Lightbulb, title: 'Idea Brainstorm',  desc: 'Break creative blocks instantly. Generate original ideas on any topic or brief.',    color: '#B08304', bg: '#FFFDE3' },
  { icon: FileText,  title: 'Caption Writer',   desc: 'Platform-optimised captions for Instagram, TikTok, LinkedIn, and Twitter.',          color: '#B08304', bg: '#FFFDE3' },
  { icon: Sparkles,  title: 'Script Writer',    desc: 'YouTube videos, podcast intros, ad scripts, and explainer content on demand.',       color: '#B08304', bg: '#FFFDE3' },
];

const HOW = [
  { n: '01', title: 'Describe your goal',      desc: 'Tell Luminary what you want to create — a story, campaign, brand, or any asset.' },
  { n: '02', title: 'AI generates content',    desc: 'Groq LLaMA 3 produces high-quality output in under 3 seconds.' },
  { n: '03', title: 'Watson scores quality',   desc: 'IBM Watson NLU analyses tone, emotion, sentiment, and readability instantly.' },
  { n: '04', title: 'Refine and publish',      desc: 'Edit inline, save to your library, and ship with full confidence.' },
];

const STATS = [
  { value: 10,  suffix: '+', label: 'Creative Tools'        },
  { value: 3,   suffix: 's', label: 'Avg. Generation Time'  },
  { value: 99,  suffix: '%', label: 'Uptime SLA'            },
];

const STACK = [
  { icon: Zap,       color: '#B08304', label: 'Groq LLaMA 3',    sub: 'Fastest open-source LLM inference' },
  { icon: BarChart3, color: '#B08304', label: 'IBM Watson NLU',   sub: 'Enterprise tone & emotion analysis' },
  { icon: Shield,    color: '#B08304', label: 'Secure by default', sub: 'JWT auth, zero data retention' },
];

const TESTIMONIALS = [
  {
    quote: "Luminary helped us launch 3 campaigns in a week. The Watson scoring gives us full confidence in our brand voice.",
    author: "Sarah Jenkins",
    role: "Head of Content, GrowthFlow",
    rating: 5,
    avatar: "S"
  },
  {
    quote: "As a solo writer, the Story Generator is my ultimate co-author. It breaks creative blocks instantly.",
    author: "Marcus Chen",
    role: "Novelist & Scriptwriter",
    rating: 5,
    avatar: "M"
  },
  {
    quote: "The speed is mind-blowing. LLaMA 3 produces quality captions and headlines in under three seconds.",
    author: "Elena Rostova",
    role: "Social Media Strategist",
    rating: 5,
    avatar: "E"
  }
];

/* ════════════════════════════════════════ */
export default function Landing() {
  const { loginAsDemo, loading: demoLoading } = useDemoLogin();

  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="l-hero">
        <div className="container l-hero__inner">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="l-hero__text">

            <motion.div variants={fadeUp} custom={0}>
              <span className="eyebrow-chip">
                <Sparkles size={11} strokeWidth={2.5} />
                Groq LLaMA 3 &nbsp;·&nbsp; IBM Watson NLU
              </span>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <h1 className="l-hero__h1">
                AI that generates{' '}
                <span className="hero-highlight">Content</span>{' '}
                that converts
              </h1>
            </motion.div>

            <motion.p variants={fadeUp} custom={2} className="l-hero__sub">
              Luminary is the creative intelligence platform for marketers, writers,
              and brand builders. Go from brief to finished content in seconds.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="l-hero__actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get started free <ArrowRight size={16} />
              </Link>
              <button className="btn-outline-hero" onClick={loginAsDemo} disabled={demoLoading}>
                {demoLoading ? <span className="spinner" /> : 'Live demo →'}
              </button>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="l-hero__proof">
              <div className="avatar-group">
                <span className="avatar" style={{ backgroundColor: '#D97706', color: '#fff' }}>S</span>
                <span className="avatar" style={{ backgroundColor: '#2563EB', color: '#fff' }}>M</span>
                <span className="avatar" style={{ backgroundColor: '#059669', color: '#fff' }}>E</span>
                <span className="avatar-plus">+10k</span>
              </div>
              <span className="proof-text">
                <strong>10,000+ creators</strong> &amp; marketers trust Luminary
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── DIVIDER / TECH BAR ── */}
      <div className="l-techbar">
        <div className="container l-techbar__inner">
          <span className="l-techbar__label">Powered by</span>
          {['Groq', 'IBM Watson', 'React 18', 'FastAPI', 'SQLAlchemy'].map((t, i, arr) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span className="l-techbar__name">{t}</span>
              {i < arr.length - 1 && <span className="l-techbar__sep">·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="l-stats">
        <div className="container l-stats__row">
          {STATS.map(s => <StatItem key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="l-features" id="features">
        <div className="container">
          <AnimSection className="l-section-head">
            <motion.p variants={fadeUp} custom={0} className="section-eyebrow">Features</motion.p>
            <motion.h2 variants={fadeUp} custom={1}>Everything you need to create</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="section-sub">
              Six AI tools in one workspace. Write faster, brand better, campaign smarter.
            </motion.p>
          </AnimSection>

          <div className="l-features__grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="feat-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-32px' }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="feat-card__icon" style={{ background: f.bg, color: f.color }}>
                  <f.icon size={18} strokeWidth={1.8} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <Link to="/register" className="feat-card__link">
                  Try free <ChevronRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="l-how" id="how-it-works">
        <div className="container">
          <AnimSection className="l-section-head">
            <motion.p variants={fadeUp} custom={0} className="section-eyebrow">How it works</motion.p>
            <motion.h2 variants={fadeUp} custom={1}>From brief to published in seconds</motion.h2>
          </AnimSection>

          <div className="l-how__steps">
            {HOW.map((s, i) => (
              <motion.div
                key={s.n}
                className="how-step"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <span className="how-step__n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / STACK ── */}
      <section className="l-about" id="about">
        <div className="container l-about__inner">
          <motion.div
            className="l-about__copy"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-eyebrow">About Luminary</p>
            <h2>Built for creators who ship</h2>
            <p>
              We combine the speed of Groq's large language models with IBM Watson's
              enterprise NLU — so you get not just content, but confidence in its quality.
            </p>
            <p>
              Solo creator, agency strategist, or startup founder — Luminary fits
              your workflow and helps you produce better work, faster.
            </p>
          </motion.div>

          <motion.div
            className="l-about__stack"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {STACK.map(({ icon: Icon, color, label, sub }) => (
              <div key={label} className="stack-row">
                <span className="stack-row__icon" style={{ color }}>
                  <Icon size={16} strokeWidth={2} />
                </span>
                <div>
                  <strong>{label}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="l-testimonials" id="testimonials">
        <div className="container">
          <AnimSection className="l-section-head">
            <motion.p variants={fadeUp} custom={0} className="section-eyebrow">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} custom={1}>Loved by modern creators</motion.h2>
          </AnimSection>

          <div className="l-testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                className="testimonial-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-32px' }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="testimonial-card__stars">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={14} fill="#FFCE25" color="#FFCE25" />
                  ))}
                </div>
                <p className="testimonial-card__quote">"{t.quote}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.avatar}</div>
                  <div>
                    <h4>{t.author}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
