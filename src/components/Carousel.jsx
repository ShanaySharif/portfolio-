import React, { useState, useEffect, useCallback } from 'react'
import './Carousel.css'

/**
 * Carousel Component
 * Accepts a projects prop (array) and renders one project per slide.
 * Each slide: image, title, description, tech tags, GitHub link, Live Demo (if link provided).
 * Supports prev/next arrows, dot indicators, and keyboard left/right.
 */
function Carousel({ projects = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const count = projects.length

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count)
  }, [count])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (count === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [count, nextSlide])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevSlide, nextSlide])

  if (count === 0) return null

  return (
    <div className="carousel-container" role="region" aria-label="Projects carousel">
      <div
        className="carousel-slides"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {projects.map((project, index) => (
          <div key={project.title + index} className="carousel-slide">
            <div className="carousel-slide-image-wrap">
              <img
                src={project.image}
                alt={project.title}
                className="carousel-img"
              />
              {index === currentIndex && (
                <div className="carousel-dots" role="tablist" aria-label="Slide indicators">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === currentIndex}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`carousel-dot ${i === currentIndex ? 'carousel-dot-active' : ''}`}
                      onClick={() => setCurrentIndex(i)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="carousel-slide-content">
              <h3 className="carousel-slide-title">{project.title}</h3>
              <p className="carousel-slide-desc">{project.description}</p>
              <div className="carousel-slide-tags">
                {project.tech?.map((t) => (
                  <span key={t} className="carousel-tag">{t}</span>
                ))}
              </div>
              <div className="carousel-slide-actions">
                {project.githubUrl && (
                  <a
                    className="carousel-btn-link"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    className="carousel-btn-link carousel-btn-link-primary"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-btn carousel-btn-prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &#8249;
      </button>
      <button
        type="button"
        className="carousel-btn carousel-btn-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &#8250;
      </button>
    </div>
  )
}

export default Carousel
