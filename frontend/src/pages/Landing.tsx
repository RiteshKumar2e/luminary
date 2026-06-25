import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, BookOpen, Megaphone, Palette,
  ArrowRight, Zap, Shield, BarChart3, Users,
  CheckCircle2, ChevronRight,
} from 'lucide-react';
import '../styles/Landing.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Story Generator',
    desc: 'Create compelling narratives, scripts, and fiction across any genre with AI as your co-author.',
    color: '#5b6af0',
  },
  {
    icon: Megaphone,
    title: 'Campaign Planner',
    desc: 'Build end-to-end marketing campaigns with messaging strategy, content ideas, and copy variations.',
    color: '#7c5cd8',
  },
  {
    icon: Palette,
    title: 'Brand Kit Generator',
    desc: 'Define your brand voice, messaging pillars, color palettes, and identity in minutes.',
    color: '#0ea5e9',
  },
  {
    icon: Sparkles,
    title: 'Creative Studio',
    desc: 'Brainstorm ideas, generate captions, scripts, taglines, and any creative content on demand.',
    color: '#f59e0b',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Describe your creative goal',
    desc: 'Tell Luminary what you want to create — a story, campaign, brand, or any creative asset.',
  },
  {
    step: '02',
    title: 'AI generates your content',
    desc: 'Groq LLM produces high-quality content in seconds while IBM Watson analyzes tone and quality.',
  },
  {
    step: '03',
    title: 'Refine and publish',
    desc: "Review Watson's emotional insights, edit inline, save to your library, and publish.",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="container">
          <motion.div
            className="landing-hero__content"
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} custom={0} className="landing-hero__badge">
              <span className="badge badge-accent">
                <Sparkles size={11} /> Powered by Groq &amp; IBM Watson
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="landing-hero__heading">
              Reimagine Your Creative<br />
              <span className="hero-accent">Work with AI</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="landing-hero__sub">
              Luminary is your AI creative partner. Generate stories, plan campaigns, build brand identities,
              and create compelling content — powered by industry-leading language models.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="landing-hero__cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Creating Free <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="btn btn-secondary btn-lg">
                See How It Works
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="landing-hero__trust">
              {['No credit card required', 'Instant access', 'IBM Watson + Groq powered'].map((t) => (
                <span key={t} className="trust-item">
                  <CheckCircle2 size={14} className="trust-icon" /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="landing-hero__visual"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            <div className="hero-card-mock">
              <div className="hero-card-mock__header">
                <span className="hero-card-mock__dot red" />
                <span className="hero-card-mock__dot yellow" />
                <span className="hero-card-mock__dot green" />
                <span className="hero-card-mock__label">Luminary AI Studio</span>
              </div>
              <div className="hero-card-mock__body">
                <div className="mock-prompt">
                  <span className="mock-label">Prompt</span>
                  <p>Write a campaign for a sustainable fashion brand targeting Gen Z...</p>
                </div>
                <div className="mock-output">
                  <span className="mock-label">Generated</span>
                  <p className="mock-line w-full">🎯 Campaign: "Wear the Change"</p>
                  <p className="mock-line w-80">Tagline: "Fashion that gives back."</p>
                  <p className="mock-line w-90">Hook: "Every stitch tells a story..."</p>
                  <p className="mock-line w-70">Platform: TikTok, Instagram Reels</p>
                </div>
                <div className="mock-watson">
                  <span className="mock-label">Watson Analysis</span>
                  <div className="mock-chips">
                    <span className="mock-chip positive">Positive 94%</span>
                    <span className="mock-chip joy">Joy 88%</span>
                    <span className="mock-chip quality">Quality Score 91</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="landing-problem">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="landing-problem__content"
          >
            <motion.h2 variants={fadeUp} custom={0}>
              Creators spend 80% of their time on process, not creativity.
            </motion.h2>
            <motion.p variants={fadeUp} custom={1}>
              Brainstorming, drafting, refining, scheduling — the mechanics of content creation
              consume the time that should be spent on ideas. Luminary shifts that ratio.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeUp} custom={0} className="section-eyebrow">Features</motion.span>
            <motion.h2 variants={fadeUp} custom={1}>Everything a creator needs</motion.h2>
            <motion.p variants={fadeUp} custom={2}>
              One platform. Every creative tool. Powered by the best AI models available.
            </motion.p>
          </motion.div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div
                  className="feature-card__icon"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  <f.icon size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <Link to="/register" className="feature-card__link">
                  Try it free <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-how" id="how-it-works">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeUp} custom={0} className="section-eyebrow">How It Works</motion.span>
            <motion.h2 variants={fadeUp} custom={1}>From idea to content in minutes</motion.h2>
          </motion.div>

          <div className="how-steps">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                className="how-step"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="how-step__num">{step.step}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="landing-about" id="about">
        <div className="container">
          <div className="about-grid">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-eyebrow">About Luminary</span>
              <h2>Built for creators who move fast</h2>
              <p>
                Luminary was built by creators, for creators. We believe AI should be a collaborator,
                not a replacement. Our platform combines the speed of Groq's large language models
                with the analytical intelligence of IBM Watson to give you not just content,
                but insight.
              </p>
              <p>
                Whether you're a solo content creator, a brand strategist at an agency,
                or a startup founder writing your first story — Luminary meets you where you are.
              </p>
              <div className="about-stats">
                {[
                  { n: '10+', label: 'Creative Tools' },
                  { n: '3s', label: 'Avg. Generation Time' },
                  { n: '99%', label: 'Uptime SLA' },
                ].map((s) => (
                  <div key={s.label} className="about-stat">
                    <span className="about-stat__num">{s.n}</span>
                    <span className="about-stat__label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="about-visual"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="about-card">
                <div className="about-card__row">
                  <Zap size={20} color="var(--color-accent)" />
                  <div>
                    <strong>Groq LLM</strong>
                    <span>World's fastest inference — outputs in seconds</span>
                  </div>
                </div>
                <div className="about-card__row">
                  <BarChart3 size={20} color="var(--color-secondary)" />
                  <div>
                    <strong>IBM Watson NLU</strong>
                    <span>Enterprise-grade tone, emotion &amp; quality analysis</span>
                  </div>
                </div>
                <div className="about-card__row">
                  <Shield size={20} color="#22c55e" />
                  <div>
                    <strong>Secure &amp; Private</strong>
                    <span>JWT auth, encrypted storage, zero data retention</span>
                  </div>
                </div>
                <div className="about-card__row">
                  <Users size={20} color="#f59e0b" />
                  <div>
                    <strong>Creator First</strong>
                    <span>Designed for real creative workflows</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container">
          <motion.div
            className="cta-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Ready to transform your creative process?</h2>
            <p>Join thousands of creators using Luminary to build better content, faster.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started for Free <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
