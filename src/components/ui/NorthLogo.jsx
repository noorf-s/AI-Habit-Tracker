const NorthLogo = ({ showText = true, className = '' }) => {
  return (
    <span className={`north-brand ${className}`.trim()}>
      <span className="north-mark" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="north-mark-svg">
          <rect x="18" y="18" width="84" height="84" rx="28" className="north-mark-frame" />
          <path d="M40 78L60 42L80 78" className="north-mark-path" />
          <path d="M60 42V30" className="north-mark-path" />
          <circle cx="60" cy="42" r="8" className="north-mark-accent" />
          <rect x="50" y="66" width="20" height="10" rx="5" className="north-mark-base" />
        </svg>
      </span>
      {showText ? <span className="north-wordmark">North</span> : null}
    </span>
  )
}

export default NorthLogo
