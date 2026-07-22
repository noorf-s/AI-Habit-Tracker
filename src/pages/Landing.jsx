import { Link } from 'react-router-dom'
import NorthLogo from '../components/ui/NorthLogo'

const features = [
  {
    title: 'Build routines that quietly move you forward.',
    description: 'Create habits that feel natural to keep, with gentle structure and room to breathe.'
  },
  {
    title: 'See your steadiness clearly.',
    description: 'A calm view of your weekly progress helps you notice what is already working.'
  },
  {
    title: 'Stay intentional.',
    description: 'Thoughtful reflections make it easier to continue with clarity and care.'
  }
]

const stats = [
  { value: '12k+', label: 'steady users' },
  { value: '82%', label: 'weekly consistency' },
  { value: '4.9/5', label: 'average care' }
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
            <p className="hero-tagline">Find your direction</p>
            <h1>
              Small actions shape
              <span>meaningful progress.</span>
            </h1>
            <p className="hero-text">
              North helps you stay steady, notice your progress, and build routines that quietly carry you forward.
            </p>

            <div className="cta-group">
              <Link className="button primary" to="/signup">
                Get Started
              </Link>
              <button type="button" className="button secondary" onClick={scrollToFeatures}>
                Learn More
              </button>
            </div>

            <div className="hero-badges">
              <span>Daily check-ins</span>
              <span>Streak tracking</span>
              <span>Clear summaries</span>
            </div>
          </div>

          <div className="hero-visual-stack">
            <div className="hero-card main-card" aria-label="North preview">
              <div className="panel-top">
                <div>
                  <p className="panel-label">This week</p>
                  <strong>7 day streak</strong>
                </div>
                <span className="status-pill">On track</span>
              </div>

              <div className="panel-list">
                <div className="habit-item">
                  <span className="dot" />
                  <span>Morning stretch</span>
                </div>
                <div className="habit-item">
                  <span className="dot" />
                  <span>Read 20 minutes</span>
                </div>
                <div className="habit-item">
                  <span className="dot" />
                  <span>Plan tomorrow</span>
                </div>
              </div>

              <div className="panel-footer">
                <div>
                  <p className="panel-label">Completion</p>
                  <strong>82%</strong>
                </div>
                <div className="mini-bar">
                  <span></span>
                </div>
              </div>
            </div>

            <div className="hero-card note-card">
              <p className="note-label">Editorial note</p>
              <p className="quote-text">Quiet consistency creates remarkable change.</p>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">Made for steady days</p>
            <h2>Gentle structure for the life you are building.</h2>
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
            {stats.map((item) => (
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
