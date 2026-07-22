import { Link } from 'react-router-dom'
import NorthLogo from '../components/ui/NorthLogo'

const features = [
  {
    title: 'A calm system for building momentum.',
    description: 'Turn daily intentions into a measured routine with elegant structure and thoughtful pacing.'
  },
  {
    title: 'See your progress as it evolves.',
    description: 'Follow streaks, completions, and quiet wins through a refined dashboard designed for focus.'
  },
  {
    title: 'Stay grounded in the work.',
    description: 'Reduce friction and keep your habits visible through a product experience that feels precise and calm.'
  }
]

const insights = [
  { label: 'Habit flow', value: 'Measured and intentional' },
  { label: 'Momentum', value: 'Built in layers' },
  { label: 'Experience', value: 'Quietly premium' }
]

const Landing = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page-shell">
      <header className="site-nav">
        <Link className="brand" to="/">
          <NorthLogo />
        </Link>

        <nav className="site-links" aria-label="Primary navigation">
          <button type="button" className="nav-link-button" onClick={scrollToFeatures}>
            Features
          </button>
          <button type="button" className="nav-link-button" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            About
          </button>
        </nav>

        <div className="nav-actions">
          <Link className="text-link" to="/login">
            Login
          </Link>
          <Link className="button primary" to="/signup">
            Get Started
          </Link>
        </div>
      </header>

      <main className="landing-main" id="top">
        <section className="hero-section" id="get-started">
          <div className="hero-copy">
            <p className="hero-tagline">A sharper way to keep going</p>
            <h1>
              Build a rhythm that feels
              <span>as refined as your work.</span>
            </h1>
            <p className="hero-text">
              North brings your habits into a premium, focused experience designed for steady growth, elegant clarity, and long-term momentum.
            </p>

            <div className="cta-group">
              <Link className="button primary" to="/signup">
                Begin your routine
              </Link>
              <button type="button" className="button secondary" onClick={scrollToFeatures}>
                Explore the experience
              </button>
            </div>

            <div className="hero-badges">
              <span>Refined habit tracking</span>
              <span>Thoughtful progress cues</span>
              <span>Quiet, focused design</span>
            </div>
          </div>

          <div className="hero-visual-stack">
            <div className="hero-card main-card" aria-label="North preview">
              <div className="panel-top">
                <div>
                  <p className="panel-label">Current focus</p>
                  <strong>Steady growth</strong>
                </div>
                <span className="status-pill">In motion</span>
              </div>

              <div className="panel-list">
                <div className="habit-item">
                  <span className="dot" />
                  <span>Morning reflection</span>
                </div>
                <div className="habit-item">
                  <span className="dot" />
                  <span>Deep work block</span>
                </div>
                <div className="habit-item">
                  <span className="dot" />
                  <span>Evening reset</span>
                </div>
              </div>

              <div className="panel-footer">
                <div>
                  <p className="panel-label">Momentum</p>
                  <strong>8 habits</strong>
                </div>
                <div className="mini-ring" aria-hidden="true">
                  <span />
                </div>
              </div>
            </div>

            <div className="hero-card note-card">
              <p className="note-label">Editorial note</p>
              <p className="quote-text">Consistency becomes elegant when it is designed with care.</p>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">Made for steady days</p>
            <h2>Designed to make intention feel effortless.</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className={`feature-card ${index === 1 ? 'feature-card-wide' : ''}`} key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="stats-section" id="about">
          <div className="stats-card">
            {insights.map((item) => (
              <div className="stat-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 North. Find your direction. Keep your pace.</p>
      </footer>
    </div>
  )
}

export default Landing
