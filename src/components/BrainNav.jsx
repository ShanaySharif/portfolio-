import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import "./BrainNav.css";

/** Theme colors (match index.css) */
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

/** Dual-hemisphere brain: left and right organic paths with center gap (longitudinal fissure). viewBox 0 0 320 260 */
const LEFT_HEMISPHERE =
  "M 158 32 C 115 32 72 52 62 88 C 54 118 58 148 78 178 C 102 208 132 232 158 240 L 158 32 Z";
const RIGHT_HEMISPHERE =
  "M 162 32 L 162 240 C 188 232 218 208 242 178 C 262 148 266 118 258 88 C 248 52 205 32 162 32 Z";

/** Central CPU microchip in the fissure */
const CHIP_X = 152;
const CHIP_Y = 124;
const CHIP_W = 16;
const CHIP_H = 12;

/**
 * Orthogonal circuit branches (90° only): from CPU into hemispheres.
 * Points are [x,y]; only horizontal/vertical segments. Terminal node = last point only.
 */
const CIRCUITS = [
  { regionId: "logic", points: [[CHIP_X, 127], [95, 127], [95, 85], [68, 85], [68, 58]] },
  { regionId: "logic", points: [[CHIP_X, 130], [90, 130], [90, 98], [72, 98], [72, 72]] },
  { regionId: "logic", points: [[CHIP_X, 133], [88, 133], [88, 110], [65, 110], [65, 88]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W, 127], [225, 127], [225, 85], [252, 85], [252, 58]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W, 130], [230, 130], [230, 98], [248, 98], [248, 72]] },
  { regionId: "creative", points: [[CHIP_X + CHIP_W, 133], [228, 133], [228, 110], [255, 110], [255, 88]] },
  { regionId: "emotion", points: [[CHIP_X, 132], [92, 132], [92, 172], [68, 172], [68, 198]] },
  { regionId: "emotion", points: [[CHIP_X + 2, 136], [98, 136], [98, 182], [72, 182], [72, 208]] },
  { regionId: "goals", points: [[CHIP_X + CHIP_W, 132], [228, 132], [228, 172], [252, 172], [252, 198]] },
  { regionId: "goals", points: [[CHIP_X + CHIP_W - 2, 136], [222, 136], [222, 182], [248, 182], [248, 208]] },
  { regionId: "contact", points: [[160, CHIP_Y + CHIP_H], [160, 195], [160, 228]] },
  { regionId: "contact", points: [[156, 136], [156, 175], [150, 195]] },
  { regionId: "contact", points: [[164, 136], [164, 175], [170, 195]] },
];

function pointsToPathD(points) {
  if (!points.length) return "";
  const [first, ...rest] = points;
  return `M ${first[0]} ${first[1]} ${rest.map((p) => `L ${p[0]} ${p[1]}`).join(" ")}`;
}

function pathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    len += Math.hypot(x1 - x0, y1 - y0);
  }
  return len;
}

/** Invisible hit areas for click */
const REGION_HIT_PATHS = [
  { id: "logic", path: "M 65 58 L 95 58 L 95 130 L 152 130 L 152 124 L 88 124 L 88 85 L 65 85 Z" },
  { id: "creative", path: "M 225 58 L 255 58 L 255 85 L 268 85 L 268 130 L 168 130 L 168 124 L 228 124 L 228 85 Z" },
  { id: "emotion", path: "M 65 132 L 98 132 L 98 208 L 72 208 L 68 198 L 68 172 Z" },
  { id: "goals", path: "M 222 132 L 252 132 L 252 198 L 248 208 L 248 182 L 222 182 Z" },
  { id: "contact", path: "M 150 136 L 170 136 L 170 195 L 160 228 L 150 195 Z" },
];

const BOOT_DURATION_MS = 2000;
const SPRING = { type: "spring", stiffness: 40, damping: 15 };

function BrainNav({ onRegionSelect }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });
  const [entrancePhase, setEntrancePhase] = useState("boot"); // 'boot' | 'settled'
  const [pathLengths, setPathLengths] = useState({});
  const cardRef = useRef(null);
  const settleControls = useAnimation();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const lengths = {};
    CIRCUITS.forEach((c, i) => {
      lengths[i] = pathLength(c.points);
    });
    setPathLengths(lengths);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setEntrancePhase("settled");
      return;
    }
    const t = setTimeout(() => {
      setEntrancePhase("settled");
      settleControls.start({
        scale: 1,
        opacity: 1,
        transition: SPRING,
      });
    }, BOOT_DURATION_MS);
    return () => clearTimeout(t);
  }, [prefersReducedMotion, settleControls]);

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

  const isBoot = entrancePhase === "boot";

  return (
    <>
      <AnimatePresence>
        {/* Cinematic overlay: brain fixed center at 2.5x for first 2s (synapse fire) */}
        {isBoot && (
          <motion.div
          className="brain-entrance-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="brain-entrance-scaled"
            initial={{ scale: 2.5 }}
            animate={{ scale: 2.5 }}
            transition={{ duration: 0 }}
          >
            <svg
              className="brain-svg brain-svg-entrance"
              viewBox="0 0 320 260"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <filter id="brainCircuitGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                  <feFlood floodColor={NEON_CYAN} floodOpacity="0.7" result="c" />
                  <feComposite in="c" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path className="brain-hemisphere brain-hemisphere-left" d={LEFT_HEMISPHERE} />
              <path className="brain-hemisphere brain-hemisphere-right" d={RIGHT_HEMISPHERE} />
              <g className="brain-circuits-entrance">
                {CIRCUITS.map((circuit, i) => {
                  const len = pathLengths[i] ?? 200;
                  return (
                    <g key={i}>
                      <motion.path
                        d={pointsToPathD(circuit.points)}
                        fill="none"
                        stroke={NEON_CYAN}
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={len}
                        initial={{ strokeDashoffset: len }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", repeat: 1, repeatDelay: 0.2 }}
                        style={{ filter: "url(#brainCircuitGlowCyan)" }}
                      />
                      <motion.circle
                        cx={circuit.points[circuit.points.length - 1][0]}
                        cy={circuit.points[circuit.points.length - 1][1]}
                        r={3}
                        fill={NEON_CYAN}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.4, 1],
                          opacity: [0, 1, 1],
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 1,
                          repeat: 2,
                          repeatDelay: 0.3,
                        }}
                        style={{ filter: "url(#brainCircuitGlowCyan)" }}
                      />
                    </g>
                  );
                })}
              </g>
              <rect
                x={CHIP_X}
                y={CHIP_Y}
                width={CHIP_W}
                height={CHIP_H}
                rx={1}
                fill="rgba(10,10,10,0.9)"
                stroke={NEON_CYAN}
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <div ref={cardRef} className="brain-nav-container mind-map-brain">
        <motion.div
          className="brain-card"
          initial={prefersReducedMotion ? false : { scale: 2.5, opacity: 0 }}
          animate={
            prefersReducedMotion ? { scale: 1, opacity: 1 } : isBoot ? { scale: 2.5, opacity: 0 } : settleControls
          }
          transition={isBoot ? { duration: 0 } : SPRING}
        >
          <svg
            className="brain-svg"
            viewBox="0 0 320 260"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Interactive brain map — click a region to explore"
          >
            <defs>
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
              <filter id="brainCircuitDropShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                <feFlood floodColor={NEON_CYAN} floodOpacity="0.6" result="c" />
                <feComposite in="c" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="brainNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                <feFlood floodColor={NEON_CYAN} floodOpacity="0.8" result="c" />
                <feComposite in="c" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Dual-hemisphere silhouette (gap = longitudinal fissure) */}
            <path
              className="brain-hemisphere brain-hemisphere-left"
              d={LEFT_HEMISPHERE}
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1.2"
            />
            <path
              className="brain-hemisphere brain-hemisphere-right"
              d={RIGHT_HEMISPHERE}
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1.2"
            />

            {/* 2. Orthogonal circuit lines (90° only), thin neon cyan + drop-shadow; nodes at terminals */}
            <g className="brain-circuits">
              {CIRCUITS.map((circuit, i) => {
                const isActive = hoveredRegion === circuit.regionId;
                const terminal = circuit.points[circuit.points.length - 1];
                return (
                  <g key={i} className={`brain-circuit-group ${isActive ? "brain-circuit-active" : ""}`}>
                    <motion.path
                      d={pointsToPathD(circuit.points)}
                      fill="none"
                      stroke={isActive ? NEON_CYAN : NEON_CYAN}
                      strokeWidth={isActive ? 1.5 : 1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0.7 }}
                      transition={{ duration: 0.2 }}
                      style={{ filter: "url(#brainCircuitDropShadow)" }}
                    />
                    <motion.circle
                      cx={terminal[0]}
                      cy={terminal[1]}
                      r={3}
                      fill={NEON_CYAN}
                      stroke={NEON_PURPLE}
                      strokeWidth={0.5}
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0.85, r: isActive ? 4 : 3 }}
                      transition={{ duration: 0.2 }}
                      style={{ filter: "url(#brainNodeGlow)" }}
                    />
                  </g>
                );
              })}
            </g>

            {/* 3. CPU in center gap */}
            <g className="brain-chip" style={{ filter: "url(#brainNeonGlow)" }}>
              <rect
                x={CHIP_X}
                y={CHIP_Y}
                width={CHIP_W}
                height={CHIP_H}
                rx={1}
                fill="rgba(10, 10, 10, 0.92)"
                stroke={NEON_CYAN}
                strokeWidth="1"
              />
            </g>

            {/* 4. Hit areas */}
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
                <span className="brain-legend-label">
                  {region.label}
                  <span className="brain-legend-subtitle"> ({region.subtitle})</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default BrainNav;
