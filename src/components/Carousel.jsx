import React, { useState, useEffect } from 'react'
import './Carousel.css'

// Import images from the local images folder
// Vite will process these imports and include them in the build
import image1 from '../images/nomadic-cafe-1.png'
import image2 from '../images/nomadic-cafe-2.png'
import image3 from '../images/nomadic-cafe-3.png'

/**
 * Carousel Component
 * Displays images in a sliding carousel with auto-advance and manual navigation
 * Images are stored locally in the frontend/src/images folder
 */
function Carousel() {
  // State to track which image is currently showing (0 = first image)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Array of imported images - these are loaded from the local images folder
  const images = [image1, image2, image3]

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    // Cleanup: clear interval when component unmounts
    return () => clearInterval(interval)
  }, [images.length])

  // Function to go to next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Function to go to previous image
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => {
        // Pause auto-slide on hover (optional - you can remove this if you want)
        // This would require additional state management
      }}
    >
      <div 
        className="carousel-slides"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Nomadic Cafe screenshot ${index + 1}`}
            className="carousel-img"
          />
        ))}
      </div>
      
      <button 
        className="carousel-btn carousel-btn-prev" 
        onClick={prevSlide}
        aria-label="Previous image"
      >
        &#8249;
      </button>
      
      <button 
        className="carousel-btn carousel-btn-next" 
        onClick={nextSlide}
        aria-label="Next image"
      >
        &#8250;
      </button>
    </div>
  )
}

export default Carousel
