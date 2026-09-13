import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import "./GlowRingButton.css";

/**
 * Scrolltide Glow Ring Button Component
 * A luxury pill button featuring an orbiting iridescent conic-gradient ring around an icon disc.
 *
 * @param {string} label - Text label for the button
 * @param {React.ComponentType} icon - Lucide or custom SVG icon component
 * @param {string} to - React Router route link (e.g. "/#featured-products" or "/cart")
 * @param {string} href - External URL link (e.g. "https://...")
 * @param {function} onClick - Click handler callback
 * @param {string} className - Optional additional CSS class names
 * @param {object} style - Inline styles
 */
export default function GlowRingButton({
  label = "Explore Collection",
  icon: Icon = Sparkles,
  to,
  href,
  onClick,
  className = "",
  style = {},
  ...rest
}) {
  const content = (
    <div className={`glow-ring-btn-wrapper ${className}`} style={style} {...rest}>
      {/* Iridescent Orbiting Ring Disc */}
      <div className="glow-ring-disc" aria-hidden="true">
        <div className="glow-ring-conic" />
        <div className="glow-ring-bloom" />
        <div className="glow-ring-inner">
          <Icon className="glow-ring-icon" />
        </div>
      </div>

      {/* Button Text Label */}
      <span className="glow-ring-label">{label}</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} style={{ textDecoration: "none", display: "inline-block" }}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "inline-block" }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
    >
      {content}
    </button>
  );
}
