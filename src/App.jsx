import React from 'react'
import Carousel from './components/Carousel'
import './App.css'

function App() {
  return (
    <div className="App">
      <header>
        <h1>Shanay Mohamed</h1>
        <p>Software Developer</p>
      </header>

      <section id="about">
        <h2>About Me</h2>
        <p>
          I'm a software developer with a background in analytics, problem-solving, and customer-facing work.
          I enjoy building clean, thoughtful applications that make complex processes easier for people to understand.
          I'm especially interested in technology that's human-centered, accessible, and purposeful.
        </p>
      </section>

      <section id="projects">
        <h2>Projects</h2>

        <div className="project">
          <h3>Nomadic Cafe</h3>
          <Carousel />
          <p>A coffee shop application that allows users to create accounts, browse a coffee menu, and manage shopping carts. Built with authentication features requiring users to sign up and log in to access the app. This capstone project was developed to deepen TypeScript proficiency while building upon foundational React skills.</p>
          <p><strong>Technologies:</strong> TypeScript, JavaScript, React, Node.js, Firebase/Firestore, Vite, CSS, HTML</p>
          <a href="https://your-live-link.com" target="_blank" rel="noopener noreferrer">View Live Demo</a> | 
          <a href="https://github.com/ShanaySharif/nomadic-co" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>

        <div className="project">
          <h3>Project Two</h3>
          <p>Short description of what this project does.</p>
          <a href="#">View Project</a>
        </div>
      </section>

      <footer>
        <p>© 2026 Shanay Mohamed</p>
      </footer>
    </div>
  )
}

export default App
