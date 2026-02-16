import React, { useMemo } from "react";
import { motion } from "framer-motion";
import "./NeuralSkills.css";

/** Normalize tech string to a stable id for matching (e.g. "React" -> "react", "ASP.NET Core" -> "asp-net-core", "C#" -> "c-sharp") */
export function techToId(tech) {
  return String(tech)
    .toLowerCase()
    .replace(/#/g, "-sharp")
    .replace(/\s+/g, "-")
    .replace(/[.&]/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Graph-based skill data: hubs (central nodes) and dendrites (skill nodes).
 * Each dendrite belongs to one hub. Links are implied: hub <-> dendrite.
 */
const HUBS = [
  { id: "frontend", label: "Frontend", angle: 0 },
  { id: "backend", label: "Backend", angle: 72 },
  { id: "data", label: "Data", angle: 144 },
  { id: "tools", label: "Tools", angle: 216 },
  { id: "design", label: "Design", angle: 288 },
];

const DENDRITES = [
  { id: "react", label: "React", hubId: "frontend" },
  { id: "javascript", label: "JavaScript", hubId: "frontend" },
  { id: "html", label: "HTML", hubId: "frontend" },
  { id: "css", label: "CSS", hubId: "frontend" },
  { id: "tailwind", label: "Tailwind", hubId: "frontend" },
  { id: "responsive-design", label: "Responsive Design", hubId: "frontend" },
  { id: "ui-development", label: "UI Development", hubId: "frontend" },
  { id: "node-js", label: "Node.js", hubId: "backend" },
  { id: "c-sharp", label: "C#", hubId: "backend" },
  { id: "asp-net-core", label: "ASP.NET Core", hubId: "backend" },
  { id: "mvc", label: "MVC", hubId: "backend" },
  { id: "entity-framework", label: "Entity Framework", hubId: "backend" },
  { id: "rest-apis", label: "REST APIs", hubId: "backend" },
  { id: "php", label: "PHP", hubId: "backend" },
  { id: "mysql", label: "MySQL", hubId: "data" },
  { id: "mariadb", label: "MariaDB", hubId: "data" },
  { id: "sql", label: "SQL", hubId: "data" },
  { id: "jest", label: "Jest", hubId: "tools" },
  { id: "postman", label: "Postman", hubId: "tools" },
  { id: "ux-analysis", label: "UX Analysis", hubId: "design" },
  { id: "product-thinking", label: "Product Thinking", hubId: "design" },
  { id: "user-centered-design", label: "User-Centered Design", hubId: "design" },
  { id: "net", label: ".NET", hubId: "backend" },
];

const CENTER_X = 200;
const CENTER_Y = 200;
const HUB_RADIUS = 95;
const DENDRITE_RADIUS = 140;
const HUB_SIZE = 28;
const NODE_SIZE = 14;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

/** Build positions for hubs and dendrites; assign dendrite angles within each hub's arc */
function buildGraph() {
  const hubPositions = new Map();
  HUBS.forEach((hub, i) => {
    const pos = polarToCartesian(CENTER_X, CENTER_Y, HUB_RADIUS, hub.angle);
    hubPositions.set(hub.id, { ...hub, ...pos });
  });

  const dendritesByHub = new Map(HUBS.map((h) => [h.id, []]));
  DENDRITES.forEach((d) => {
    const arr = dendritesByHub.get(d.hubId);
    if (arr) arr.push(d);
  });

  const dendritePositions = [];
  hubPositions.forEach((hub, hubId) => {
    const list = dendritesByHub.get(hubId) || [];
    const step = list.length > 0 ? 360 / list.length : 0;
    list.forEach((d, i) => {
      const angle = hub.angle + (i - (list.length - 1) / 2) * 22;
      const pos = polarToCartesian(CENTER_X, CENTER_Y, DENDRITE_RADIUS, angle);
      dendritePositions.push({ ...d, ...pos });
    });
  });

  const links = [];
  dendritePositions.forEach((d) => {
    const hub = hubPositions.get(d.hubId);
    if (hub) links.push({ from: hub, to: d });
  });

  return { hubs: Array.from(hubPositions.values()), dendrites: dendritePositions, links };
}

export const neuralSkillGraph = buildGraph();

/** Resolve project tech array to set of node ids that exist in our graph */
export function projectTechToSkillIds(tech = []) {
  const ids = new Set();
  const allIds = new Set(DENDRITES.map((d) => d.id));
  tech.forEach((t) => {
    const id = techToId(t);
    if (allIds.has(id)) ids.add(id);
    // Also try without hyphens for "REST APIs" -> "rest apis" -> "rest-apis" etc.
    const alt = id.replace(/-/g, "");
    DENDRITES.forEach((d) => {
      if (d.id.replace(/-/g, "") === alt) ids.add(d.id);
    });
  });
  return ids;
}

const NEON_BLUE = "#00f2ff";
const NEON_PURPLE = "#bc13fe";

function NeuralSkills({ activeSkillIds = new Set(), className = "" }) {
  const graph = useMemo(() => buildGraph(), []);

  return (
    <div className={`neural-skills ${className}`}>
      <svg
        className="neural-skills-svg"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Neural skills map — hubs and dendrites"
      >
        <defs>
          <linearGradient id="neuralLinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={NEON_BLUE} />
            <stop offset="100%" stopColor={NEON_PURPLE} />
          </linearGradient>
          <filter id="neuralGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neuralGlowStrong">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Links (pathways) */}
        {graph.links.map((link, i) => {
          const toActive = activeSkillIds.has(link.to.id);
          const fromActive = graph.hubs.some((h) => h.id === link.from.id && graph.dendrites.some((d) => d.hubId === h.id && activeSkillIds.has(d.id)));
          const active = toActive || fromActive;
          return (
            <motion.line
              key={`link-${i}`}
              x1={link.from.x}
              y1={link.from.y}
              x2={link.to.x}
              y2={link.to.y}
              stroke={active ? "url(#neuralLinkGradient)" : "var(--line)"}
              strokeWidth={active ? 2.5 : 1}
              initial={false}
              animate={{
                opacity: active ? 1 : 0.4,
                filter: active ? "url(#neuralGlow)" : "none",
              }}
              transition={{ duration: 0.25 }}
            />
          );
        })}

        {/* Hub nodes */}
        {graph.hubs.map((hub) => (
          <g key={hub.id}>
            <motion.circle
              cx={hub.x}
              cy={hub.y}
              r={HUB_SIZE}
              fill="var(--card-bg)"
              stroke="var(--line)"
              strokeWidth={1.5}
              initial={false}
              animate={{
                stroke: graph.dendrites.some((d) => d.hubId === hub.id && activeSkillIds.has(d.id)) ? NEON_PURPLE : "var(--line)",
                filter: graph.dendrites.some((d) => d.hubId === hub.id && activeSkillIds.has(d.id)) ? "url(#neuralGlow)" : "none",
              }}
              transition={{ duration: 0.25 }}
            />
            <text
              x={hub.x}
              y={hub.y + 5}
              textAnchor="middle"
              className="neural-skills-hub-label"
              fill="var(--muted)"
            >
              {hub.label}
            </text>
          </g>
        ))}

        {/* Dendrite nodes */}
        {graph.dendrites.map((node) => {
          const isActive = activeSkillIds.has(node.id);
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={NODE_SIZE}
                fill={isActive ? NEON_BLUE : "var(--warm)"}
                stroke={isActive ? NEON_PURPLE : "var(--line)"}
                strokeWidth={isActive ? 2 : 1}
                initial={false}
                animate={{
                  r: NODE_SIZE,
                  filter: isActive ? "url(#neuralGlowStrong)" : "none",
                  boxShadow: isActive ? `0 0 20px ${NEON_BLUE}` : "none",
                }}
                transition={{
                  duration: 0.3,
                  repeat: isActive ? Infinity : 0,
                  repeatType: "reverse",
                  repeatDuration: 0.8,
                }}
              />
              {isActive && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  fill="none"
                  stroke={NEON_PURPLE}
                  strokeWidth={1}
                  initial={{ r: NODE_SIZE + 4, opacity: 0.5 }}
                  animate={{
                    r: [NODE_SIZE + 4, NODE_SIZE + 12, NODE_SIZE + 4],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <text
                x={node.x}
                y={node.y + NODE_SIZE + 14}
                textAnchor="middle"
                className="neural-skills-node-label"
                fill={isActive ? "var(--accent)" : "var(--muted)"}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default NeuralSkills;
