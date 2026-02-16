import "./App.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrainNav, { brainRegions } from "./components/BrainNav";
import NeuralSkills, { projectTechToSkillIds, neuralSkillGraph } from "./components/NeuralSkills";

/* ----- ProjectCard ----- */
function ProjectCard({ title, tagline, description, tech = [], githubUrl, liveUrl, image }) {
  return (
    <article className="project-card">
      <div className="project-card-media">
        {image ? (
          <img src={image} alt={title} className="project-card-img" />
        ) : (
          <div className="project-card-placeholder">
            <span className="project-card-placeholder-title">{title}</span>
          </div>
        )}
      </div>
      <div className="project-card-body">
        <h3 className="project-card-title">{title}</h3>
        {tagline && <p className="project-card-tagline">{tagline}</p>}
        <p className="project-card-desc">{description}</p>
        {tech.length > 0 && (
          <div className="project-card-tags">
            {tech.map((t) => (
              <span key={t} className="project-card-tag">{t}</span>
            ))}
          </div>
        )}
        {(githubUrl || liveUrl) && (
          <div className="project-card-actions">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="project-card-btn project-card-btn-gh">GitHub</a>
            )}
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noreferrer" className="project-card-btn project-card-btn-demo">Live Demo</a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ----- Project data ----- */
const logicProjects = [
  {
    title: "Full-Stack Business Application",
    tagline: "End-to-end system development across frontend, backend, and database.",
    description: "I built a full-stack web application from the ground up, designing the frontend, backend APIs, and database architecture. The system includes a role-based admin dashboard, REST APIs, and automated testing to ensure reliability and scalability.",
    tech: ["React", "JavaScript", ".NET", "PHP", "MySQL", "MariaDB", "REST APIs", "Jest", "Postman"],
    githubUrl: "https://github.com",
    liveUrl: "",
  },
  {
    title: "Pokémon Solution — ASP.NET MVC Pokédex",
    tagline: "Server-side application built with MVC architecture.",
    description: "An interactive Pokédex built using ASP.NET Core MVC and Entity Framework. Users can browse Pokémon data, view details, and manage selections while the backend handles structured data and application logic.",
    tech: ["C#", "ASP.NET Core", "MVC", "Entity Framework", "SQL", "HTML", "CSS"],
    githubUrl: "https://github.com",
    liveUrl: "",
  },
];

const creativeProjects = [
  {
    title: "Nomadic Co — Coffee Shop Web App",
    tagline: "A brand-driven, visually focused coffee shop website.",
    description: "Nomadic Co translates a real coffee brand into a modern web experience, focusing on layout, imagery, and responsive design. This project highlights my strengths in UI development, visual storytelling, and building polished front-end interfaces.",
    tech: ["HTML", "CSS", "JavaScript", "Responsive Design", "UI Development"],
    githubUrl: "https://github.com",
    liveUrl: "",
  },
];

const emotionProjects = [
  {
    title: "Fitted — Digital Wardrobe (UX Analysis)",
    tagline: "Product thinking and UX exploration.",
    description: "A UX and product analysis of a digital wardrobe platform, focusing on how design systems and user flows solve real-world problems. This project reflects my interest in human-centered design and learning from production-level products.",
    tech: ["UX Analysis", "Product Thinking", "User-Centered Design"],
    githubUrl: "",
    liveUrl: "",
  },
];

const easeSmooth = [0.4, 0, 0.2, 1];
const zoomDuration = 0.5;

export default function App() {
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredSkillIds, setHoveredSkillIds] = useState(new Set());
  const [shanayImg, setShanayImg] = useState(null);
  useEffect(() => {
    import("./images/shanay.jpg")
      .then((m) => setShanayImg(m.default))
      .catch(() => setShanayImg(null));
  }, []);

  return (
    <div className="page mind-map-page">
      <AnimatePresence mode="wait">
        {activeRegion === null ? (
          <motion.div
            key="mind-map"
            className="mind-map-view"
            initial={{ opacity: 1 }}
            exit={{
              scale: 1.4,
              opacity: 0,
              transition: { duration: zoomDuration, ease: easeSmooth },
            }}
          >
            <header className="topbar topbar-minimal">
              <div className="wrap topbar-inner">
                <span className="brand">Shanay Mohamed</span>
              </div>
            </header>
            <main className="mind-map-main">
              <BrainNav onRegionSelect={setActiveRegion} />
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="section-view"
            className="section-view"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: zoomDuration, ease: easeSmooth }}
          >
            <header className="topbar">
              <div className="wrap topbar-inner">
                <button
                  type="button"
                  className="back-to-brain"
                  onClick={() => setActiveRegion(null)}
                  aria-label="Back to mind map"
                >
                  ← Mind map
                </button>
                <nav className="nav">
                  {brainRegions.map((region) => (
                    <button
                      key={region.id}
                      type="button"
                      className={`nav-pill ${activeRegion === region.id ? "nav-pill-active" : ""}`}
                      onClick={() => setActiveRegion(region.id)}
                      title={region.subtitle ? `${region.label} — ${region.subtitle}` : region.label}
                    >
                      {region.label}
                    </button>
                  ))}
                </nav>
              </div>
            </header>

            <main className="section-view-main">
              <div className="wrap">
                {activeRegion === "logic" && (
                  <>
                    <h1 className="section-view-heading">Software Engineering</h1>
                    <p className="section-view-lead">
                      Full-stack and server-side projects—from APIs and databases to frontend interfaces.
                    </p>
                    <NeuralSkills activeSkillIds={hoveredSkillIds} graphData={neuralSkillGraph} />
                    <div className="project-grid">
                      {logicProjects.map((p) => (
                        <div
                          key={p.title}
                          onMouseEnter={() => setHoveredSkillIds(projectTechToSkillIds(p.tech))}
                          onMouseLeave={() => setHoveredSkillIds(new Set())}
                        >
                          <ProjectCard {...p} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeRegion === "creative" && (
                  <>
                    <h1 className="section-view-heading">Creative — UI / Frontend</h1>
                    <p className="section-view-lead">
                      Brand-driven, visually focused web experiences and polished interfaces.
                    </p>
                    <NeuralSkills activeSkillIds={hoveredSkillIds} graphData={neuralSkillGraph} />
                    <div className="project-grid">
                      {creativeProjects.map((p) => (
                        <div
                          key={p.title}
                          onMouseEnter={() => setHoveredSkillIds(projectTechToSkillIds(p.tech))}
                          onMouseLeave={() => setHoveredSkillIds(new Set())}
                        >
                          <ProjectCard {...p} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeRegion === "emotion" && (
                  <>
                    <h1 className="section-view-heading">The Limbic System — About Me / Values</h1>
                    <p className="section-view-lead">
                      UX analysis, product thinking, and who I am.
                    </p>
                    <NeuralSkills activeSkillIds={hoveredSkillIds} graphData={neuralSkillGraph} />
                    {/* About Me: circular photo + glassmorphism bio cards */}
                    <section className="about-me-section">
                      <div className="about-me-photo-wrap">
                        <div className="about-me-photo-frame">
                          {shanayImg ? (
                            <img src={shanayImg} alt="Shanay Mohamed" className="about-me-photo" />
                          ) : (
                            <div className="about-me-photo-placeholder" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                      <div className="about-me-cards">
                        <div className="about-me-card glass-card">
                          <h3 className="about-me-card-title">About</h3>
                          <p className="about-me-card-text">
                            I'm a software engineer focused on building thoughtful, human-centered technology. My work sits at the intersection of logic and creativity — from full-stack systems to user experience and product thinking.
                          </p>
                        </div>
                        <div className="about-me-card glass-card">
                          <h3 className="about-me-card-title">Values</h3>
                          <p className="about-me-card-text">
                            I care about accessibility, clear communication, and learning in the open. As a neurodivergent developer, I bring a unique perspective to problem-solving and team collaboration.
                          </p>
                        </div>
                      </div>
                    </section>
                    <div className="project-grid">
                      {emotionProjects.map((p) => (
                        <div
                          key={p.title}
                          onMouseEnter={() => setHoveredSkillIds(projectTechToSkillIds(p.tech))}
                          onMouseLeave={() => setHoveredSkillIds(new Set())}
                        >
                          <ProjectCard {...p} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeRegion === "goals" && (
                  <>
                    <h1 className="section-view-heading">Goals</h1>
                    <p className="section-view-lead">Where I'm headed and what I care about.</p>
                    <div className="goals-block">
                      <div className="goals-about">
                        <strong className="goals-label">About</strong>
                        <p className="goals-text">
                          I'm a software engineer focused on building thoughtful, human-centered technology. My work sits at the intersection of logic and creativity — from full-stack systems to user experience and product thinking.
                        </p>
                      </div>
                      <div className="goals-goals">
                        <strong className="goals-label">Goals</strong>
                        <p className="goals-text">
                          I'm currently growing as a full-stack developer and looking for opportunities where I can contribute to real products, collaborate with strong teams, and continue learning across the stack.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeRegion === "contact" && (
                  <>
                    <h1 className="section-view-heading">Contact</h1>
                    <p className="section-view-lead">Get in touch — email, LinkedIn, or GitHub.</p>
                    <div className="contact-buttons">
                      <a className="contact-btn" href="mailto:you@email.com">Email</a>
                      <a className="contact-btn" href="https://linkedin.com/in/YOUR_LINK" target="_blank" rel="noreferrer">LinkedIn</a>
                      <a className="contact-btn" href="https://github.com/YOUR_USERNAME" target="_blank" rel="noreferrer">GitHub</a>
                    </div>
                    <p className="copyright">© {new Date().getFullYear()} Shanay Mohamed</p>
                  </>
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
