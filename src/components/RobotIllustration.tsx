export default function RobotIllustration() {
  return (
    <div className="hero-illustration-wrap w-full h-full">
      <svg
        className="hero-illustration w-full h-full"
        viewBox="0 0 320 320"
        fill="none"
        strokeWidth="1.6"
        aria-hidden
      >
        {/* head */}
        <rect x="70" y="60" width="180" height="170" rx="34" className="draw" />

        {/* antennae */}
        <line x1="115" y1="60" x2="115" y2="28" className="draw" style={{ animationDelay: '0.1s' }} />
        <line x1="205" y1="60" x2="205" y2="28" className="draw" style={{ animationDelay: '0.15s' }} />
        <circle cx="115" cy="22" r="5" className="pulse-node" style={{ animationDelay: '0.3s' }} />
        <circle cx="205" cy="22" r="5" className="pulse-node" style={{ animationDelay: '0.5s' }} />

        {/* eyes */}
        <circle cx="125" cy="140" r="16" className="draw" style={{ animationDelay: '0.5s' }} />
        <circle cx="195" cy="140" r="16" className="draw" style={{ animationDelay: '0.6s' }} />
        <circle cx="125" cy="140" r="4" className="pulse-node" style={{ animationDelay: '0.2s' }} />
        <circle cx="195" cy="140" r="4" className="pulse-node" style={{ animationDelay: '0.5s' }} />

        {/* neural brain trace */}
        <line x1="125" y1="140" x2="160" y2="100" className="draw" style={{ animationDelay: '0.7s' }} />
        <line x1="195" y1="140" x2="160" y2="100" className="draw" style={{ animationDelay: '0.75s' }} />
        <circle cx="160" cy="100" r="6" className="pulse-node" style={{ animationDelay: '0.6s' }} />

        {/* speaker grille mouth */}
        <line x1="130" y1="195" x2="130" y2="207" className="draw" style={{ animationDelay: '0.85s' }} />
        <line x1="148" y1="195" x2="148" y2="207" className="draw" style={{ animationDelay: '0.88s' }} />
        <line x1="166" y1="195" x2="166" y2="207" className="draw" style={{ animationDelay: '0.91s' }} />
        <line x1="184" y1="195" x2="184" y2="207" className="draw" style={{ animationDelay: '0.94s' }} />

        {/* ear / port modules */}
        <rect x="50" y="125" width="20" height="34" rx="4" className="draw" style={{ animationDelay: '0.95s' }} />
        <rect x="250" y="125" width="20" height="34" rx="4" className="draw" style={{ animationDelay: '1s' }} />
        <circle cx="60" cy="142" r="2.5" className="pulse-node" style={{ animationDelay: '1.2s' }} />
        <circle cx="260" cy="142" r="2.5" className="pulse-node" style={{ animationDelay: '1.3s' }} />

        {/* shoulders */}
        <line x1="100" y1="230" x2="92" y2="262" className="draw" style={{ animationDelay: '1.05s' }} />
        <line x1="220" y1="230" x2="228" y2="262" className="draw" style={{ animationDelay: '1.1s' }} />
        <line x1="92" y1="262" x2="228" y2="262" className="draw" style={{ animationDelay: '1.2s' }} />
      </svg>
    </div>
  )
}
