import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./BrainNav.css";

const NEON_CYAN = "#00f2ff";
const NEON_PURPLE = "#bc13fe";

/** Neuro-Architect navigation: biological counterparts for portfolio sections */
export const brainRegions = [
  { id: "logic", label: "The Cerebellum", subtitle: "Backend/Systems", color: NEON_CYAN },
  { id: "creative", label: "Neural Plasticity", subtitle: "Frontend/UI", color: NEON_PURPLE },
  { id: "emotion", label: "The Limbic System", subtitle: "About Me/Values", color: "#ec4899" },
  { id: "goals", label: "The Frontal Lobe", subtitle: "Roadmap/Learning", color: "#f59e0b" },
  { id: "contact", label: "The Synapse", subtitle: "Networking", color: NEON_CYAN },
];

/** Top-down anatomical brain silhouette (viewBox 0 0 320 260) — frosted shell */
const BRAIN_SILHOUETTE =
  "M 160 32 C 205 32 248 52 258 88 C 266 118 262 148 242 178 C 218 208 188 232 160 240 C 132 232 102 208 78 178 C 58 148 54 118 62 88 C 72 52 115 32 160 32 Z";

/** Central microchip (CPU) — center ~160,130 */
const CHIP_X = 146;
const CHIP_Y = 122;
const CHIP_W = 28;
const CHIP_H = 16;
const CX = 160;
const CY = 130;

/**
 * Dense circuit network: orthogonally-routed (90° and 45°) polylines from chip into both hemispheres.
 * Each circuit has regionId and nodes[] (junctions + endpoint) for synapse dots.
 */
const CIRCUITS = [
  // —— logic (left upper) ——
  { regionId: "logic", points: [[CHIP_X, 125], [100, 125], [100, 82], [68, 82], [68, 55]], nodes: [[100, 82], [68, 55]] },
  { regionId: "logic", points: [[CHIP_X + 2, CHIP_Y], [112, CHIP_Y], [112, 92], [78, 92], [78, 68]], nodes: [[112, 92], [78, 68]] },
  { regionId: "logic", points: [[CHIP_X, 132], [95, 132], [95, 100], [72, 100], [72, 78]], nodes: [[95, 100], [72, 78]] },
  { regionId: "logic", points: [[CHIP_X, 122], [88, 122], [88, 70], [62, 70], [62, 48]], nodes: [[88, 70], [62, 48]] },
  { regionId: "logic", points: [[CHIP_X + 6, CHIP_Y], [105, CHIP_Y], [105, 85], [80, 85], [80, 62]], nodes: [[105, 85], [80, 62]] },
  { regionId: "logic", points: [[CHIP_X + 10, 125], [98, 125], [98, 95], [70, 95], [70, 72]], nodes: [[98, 95], [70, 72]] },
  // —— creative (right upper) ——
  { regionId: "creative", points: [[CHIP_X + CHIP_W, 125], [220, 125], [220, 82], [252, 82], [252, 55]], nodes: [[220, 82], [252, 55]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W - 2, CHIP_Y], [208, CHIP_Y], [208, 92], [242, 92], [242, 68]], nodes: [[208, 92], [242, 68]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W, 132], [225, 132], [225, 100], [248, 100], [248, 78]], nodes: [[225, 100], [248, 78]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W, 122], [232, 122], [232, 70], [258, 70], [258, 48]], nodes: [[232, 70], [258, 48]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W - 6, CHIP_Y], [215, CHIP_Y], [215, 85], [240, 85], [240, 62]], nodes: [[215, 85], [240, 62]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W - 10, 125], [222, 125], [222, 95], [250, 95], [250, 72]], nodes: [[222, 95], [250, 72]] },
  // —— emotion (left lower) ——
  { regionId: "emotion", points: [[CHIP_X, 132], [98, 132], [98, 172], [68, 172], [68, 198]], nodes: [[98, 172], [68, 198]] },
  { regionId: "emotion", points: [[CHIP_X + 4, CHIP_Y + CHIP_H], [108, CHIP_Y + CHIP_H], [108, 185], [75, 185], [75, 210]], nodes: [[108, 185], [75, 210]] },
  { regionId: "emotion", points: [[CHIP_X, 136], [92, 136], [92, 165], [65, 165], [65, 192]], nodes: [[92, 165], [65, 192]] },
  { regionId: "emotion", points: [[CHIP_X + 8, 138], [102, 138], [102, 178], [72, 178], [72, 205]], nodes: [[102, 178], [72, 205]] },
  // —— goals (right lower) ——
  { regionId: "goals", points: [[CHIP_X + CHIP_W, 132], [222, 132], [222, 172], [252, 172], [252, 198]], nodes: [[222, 172], [252, 198]] },
  { regionId: "goals", points: [[CHIP_X + CHIP_W - 4, CHIP_Y + CHIP_H], [212, CHIP_Y + CHIP_H], [212, 185], [245, 185], [245, 210]], nodes: [[212, 185], [245, 210]] },
  { regionId: "goals", points: [[CHIP_X + CHIP_W, 136], [228, 136], [228, 165], [255, 165], [255, 192]], nodes: [[228, 165], [255, 192]] },
  { regionId: "goals", points: [[CHIP_X + CHIP_W - 8, 138], [218, 138], [218, 178], [248, 178], [248, 205]], nodes: [[218, 178], [248, 205]] },
  // —— contact (center bottom) ——
  { regionId: "contact", points: [[160, CHIP_Y + CHIP_H], [160, 192], [160, 225]], nodes: [[160, 192], [160, 225]] },
  { regionId: "contact", points: [[154, CHIP_Y + CHIP_H], [154, 172], [148, 192]], nodes: [[154, 172], [148, 192]] },
  { regionId: "contact", points: [[166, CHIP_Y + CHIP_H], [166, 172], [172, 192]], nodes: [[166, 172], [172, 192]] },
  { regionId: "contact", points: [[CHIP_X + 4, 138], [140, 138], [140, 180], [152, 205]], nodes: [[140, 180], [152, 205]] },
  { regionId: "contact", points: [[CHIP_X + CHIP_W - 4, 138], [180, 138], [180, 180], [168, 205]], nodes: [[180, 180], [168, 205]] },
];

/** Invisible hit areas for click (approximate region polygons) */
const REGION_HIT_PATHS = [
  { id: "logic", path: "M 70 55 L 90 55 L 95 130 L 146 130 L 146 122 L 90 122 L 85 80 L 70 80 Z" },
  { id: "creative", path: "M 250 55 L 250 80 L 265 80 L 230 122 L 174 122 L 174 130 L 230 130 L 252 82 Z" },
  { id: "emotion", path: "M 68 132 L 98 132 L 98 198 L 75 210 L 68 198 L 68 172 Z" },
  { id: "goals", path: "M 222 132 L 252 132 L 252 198 L 245 210 L 252 198 L 252 172 Z" },
  { id: "contact", path: "M 148 138 L 172 138 L 172 192 L 160 225 L 148 192 Z" },
];

function BrainNav({ onRegionSelect }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });
  const cardRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleRegionClick = (region, event) => {
    if (event) event.preventDefault();
    onRegionSelect?.(region.id);
  };

  const handleKeyDown = (region, event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRegionSelect?.(region.id);
    }
  };

  const handleMouseMove = (region, event) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setTooltip({
      show: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top - 36,
      text: region.subtitle ? `${region.label} — ${region.subtitle}` : region.label,
    });
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setTooltip({ show: false, x: 0, y: 0, text: "" });
  };

  return (
    <div ref={cardRef} className="brain-nav-container mind-map-brain">
      <motion.div
        className="brain-card"
        initial={false}
        animate={
          prefersReducedMotion
            ? { scale: 1 }
            : {
                scale: [1, 1.02, 1],
                transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <svg
          className="brain-svg"
          viewBox="0 0 320 260"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Interactive brain map — click a region to explore"
        >
          <defs>
            {/* Strong glow for active (hovered) circuits */}
            <filter id="brainNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feFlood floodColor={NEON_CYAN} floodOpacity="0.85" result="cyan" />
              <feFlood floodColor={NEON_PURPLE} floodOpacity="0.5" result="purple" />
              <feComposite in="cyan" in2="blur" operator="in" result="cyanGlow" />
              <feComposite in="purple" in2="blur" operator="in" result="purpleGlow" />
              <feBlend in="SourceGraphic" in2="cyanGlow" mode="screen" result="withCyan" />
              <feBlend in="withCyan" in2="purpleGlow" mode="screen" result="final" />
              <feMerge>
                <feMergeNode in="final" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Soft electric-cyan glow for idle circuit lines (whole network glows) */}
            <filter id="brainCircuitGlowSoft" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
              <feFlood floodColor={NEON_CYAN} floodOpacity="0.5" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Node glow when active */}
            <filter id="brainNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feFlood floodColor={NEON_CYAN} floodOpacity="0.9" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Softer node glow when idle (bright synapse dots across network) */}
            <filter id="brainNodeGlowSoft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
              <feFlood floodColor={NEON_CYAN} floodOpacity="0.6" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Brain shell: semi-transparent glassmorphism (frosted silhouette) */}
          <path
            className="brain-shell"
            d={BRAIN_SILHOUETTE}
            fill="rgba(255, 255, 255, 0.05)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.8"
          />

          {/* 2. Dense circuit network (orthogonal + 45°) with electric cyan glow */}
          <g className="brain-circuits">
            {CIRCUITS.map((circuit, i) => {
              const isActive = hoveredRegion === circuit.regionId;
              const pointsStr = circuit.points.map((p) => p.join(",")).join(" ");
              const nodes = circuit.nodes || [circuit.points[circuit.points.length - 1]];
              return (
                <g key={i} className={`brain-circuit-group ${isActive ? "brain-circuit-active" : ""}`}>
                  <motion.polyline
                    points={pointsStr}
                    fill="none"
                    stroke={isActive ? NEON_CYAN : "rgba(0, 242, 255, 0.5)"}
                    strokeWidth={isActive ? 2.5 : 1.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0.75,
                      strokeWidth: isActive ? 2.5 : 1.2,
                    }}
                    transition={{ duration: 0.2 }}
                    filter={isActive ? "url(#brainNeonGlow)" : "url(#brainCircuitGlowSoft)"}
                  />
                  {nodes.map(([nx, ny], j) => (
                    <motion.circle
                      key={j}
                      cx={nx}
                      cy={ny}
                      r={j === nodes.length - 1 ? 4 : 3}
                      fill={isActive ? NEON_CYAN : "rgba(0, 242, 255, 0.6)"}
                      stroke={isActive ? NEON_PURPLE : "rgba(188, 19, 254, 0.35)"}
                      strokeWidth={isActive ? 1.5 : 0.6}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0.85,
                        r: isActive ? (j === nodes.length - 1 ? 5 : 4) : (j === nodes.length - 1 ? 4 : 3),
                      }}
                      transition={{ duration: 0.2 }}
                      filter={isActive ? "url(#brainNodeGlow)" : "url(#brainNodeGlowSoft)"}
                    />
                  ))}
                </g>
              );
            })}
          </g>

          {/* 3. Central microchip (CPU) with radial pins */}
          <g className="brain-chip" filter="url(#brainNeonGlow)">
            <rect
              x={CHIP_X}
              y={CHIP_Y}
              width={CHIP_W}
              height={CHIP_H}
              rx={2}
              fill="rgba(10, 10, 10, 0.92)"
              stroke={NEON_CYAN}
              strokeWidth="1.2"
              opacity={0.98}
            />
            {/* Pins radiating outward: top */}
            <line x1={CHIP_X + 6} y1={CHIP_Y} x2={CHIP_X + 6} y2={CHIP_Y - 3} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            <line x1={CHIP_X + 14} y1={CHIP_Y} x2={CHIP_X + 14} y2={CHIP_Y - 3} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            <line x1={CHIP_X + 22} y1={CHIP_Y} x2={CHIP_X + 22} y2={CHIP_Y - 3} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            {/* right */}
            <line x1={CHIP_X + CHIP_W} y1={CHIP_Y + 4} x2={CHIP_X + CHIP_W + 3} y2={CHIP_Y + 4} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            <line x1={CHIP_X + CHIP_W} y1={CHIP_Y + 12} x2={CHIP_X + CHIP_W + 3} y2={CHIP_Y + 12} stroke={NEON_PURPLE} strokeWidth="0.9" opacity="0.85" />
            {/* bottom */}
            <line x1={CHIP_X + 6} y1={CHIP_Y + CHIP_H} x2={CHIP_X + 6} y2={CHIP_Y + CHIP_H + 3} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            <line x1={CHIP_X + 14} y1={CHIP_Y + CHIP_H} x2={CHIP_X + 14} y2={CHIP_Y + CHIP_H + 3} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            <line x1={CHIP_X + 22} y1={CHIP_Y + CHIP_H} x2={CHIP_X + 22} y2={CHIP_Y + CHIP_H + 3} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            {/* left (into circuitry) */}
            <line x1={CHIP_X} y1={CHIP_Y + 4} x2={CHIP_X - 3} y2={CHIP_Y + 4} stroke={NEON_CYAN} strokeWidth="0.9" opacity="0.85" />
            <line x1={CHIP_X} y1={CHIP_Y + 12} x2={CHIP_X - 3} y2={CHIP_Y + 12} stroke={NEON_PURPLE} strokeWidth="0.9" opacity="0.85" />
            {/* diagonal corners for denser pin look */}
            <line x1={CHIP_X + 2} y1={CHIP_Y + 2} x2={CHIP_X - 2} y2={CHIP_Y - 2} stroke={NEON_CYAN} strokeWidth="0.6" opacity="0.7" />
            <line x1={CHIP_X + CHIP_W - 2} y1={CHIP_Y + 2} x2={CHIP_X + CHIP_W + 2} y2={CHIP_Y - 2} stroke={NEON_CYAN} strokeWidth="0.6" opacity="0.7" />
            <line x1={CHIP_X + 2} y1={CHIP_Y + CHIP_H - 2} x2={CHIP_X - 2} y2={CHIP_Y + CHIP_H + 2} stroke={NEON_CYAN} strokeWidth="0.6" opacity="0.7" />
            <line x1={CHIP_X + CHIP_W - 2} y1={CHIP_Y + CHIP_H - 2} x2={CHIP_X + CHIP_W + 2} y2={CHIP_Y + CHIP_H + 2} stroke={NEON_CYAN} strokeWidth="0.6" opacity="0.7" />
          </g>

          {/* 4. Invisible hit areas for click */}
          {brainRegions.map((region) => (
            <path
              key={region.id}
              d={REGION_HIT_PATHS.find((r) => r.id === region.id)?.path ?? ""}
              fill="transparent"
              className="brain-region-hit"
              onClick={(e) => handleRegionClick(region, e)}
              onKeyDown={(e) => handleKeyDown(region, e)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseMove={(e) => handleMouseMove(region, e)}
              onMouseLeave={handleMouseLeave}
              tabIndex={0}
              role="button"
              aria-label={`Explore ${region.label}`}
            />
          ))}
        </svg>

        {tooltip.show && hoveredRegion && (
          <div
            className="brain-tooltip"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {tooltip.text}
          </div>
        )}

        <div className="brain-legend">
          {brainRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              className={`brain-legend-item ${hoveredRegion === region.id ? "brain-legend-item-active" : ""}`}
              style={{ "--region-color": region.color }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => { e.preventDefault(); handleRegionClick(region, e); }}
            >
              <span className="brain-legend-dot" />
              <span className="brain-legend-label">{region.label}<span className="brain-legend-subtitle"> ({region.subtitle})</span></span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default BrainNav;
