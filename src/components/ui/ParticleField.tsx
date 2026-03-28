/**
 * ParticleField — Google Antigravity style
 * Pure CSS animated gradient orbs — no external dependencies.
 * Google brand colors slowly drift across the background.
 */
export default function ParticleField() {
  return (
    <div className="orb-field" aria-hidden="true">
      {/* Blue orb — top-left */}
      <div
        className="orb orb-blue"
        style={{ width: 600, height: 600, top: '-15%', left: '-10%' }}
      />
      {/* Red orb — top-right */}
      <div
        className="orb orb-red"
        style={{ width: 500, height: 500, top: '-5%', right: '-8%' }}
      />
      {/* Yellow orb — bottom-right */}
      <div
        className="orb orb-yellow"
        style={{ width: 480, height: 480, bottom: '-10%', right: '10%' }}
      />
      {/* Green orb — bottom-left */}
      <div
        className="orb orb-green"
        style={{ width: 440, height: 440, bottom: '5%', left: '-5%' }}
      />
      {/* Extra small blue center accent */}
      <div
        className="orb orb-blue"
        style={{ width: 300, height: 300, top: '40%', left: '40%', opacity: 0.15, animationDelay: '-6s', animationDuration: '14s' }}
      />
    </div>
  )
}
