import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Element } from "react-scroll";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import RepoPage from "./page/Repo";
import CantadasSecreta from "./page/CantadasSecreta";
import LazySection from "./components/LazySection";

function MainContent() {
  const [showCantadas, setShowCantadas] = useState(false);

  useEffect(() => {
    // Verifica hash na URL
    if (window.location.hash === '#cantadas' || 
        window.location.hash === '#secret') {
      setShowCantadas(true);
    }
  }, []);

  if (showCantadas) {
    return <CantadasSecreta />;
  }

  return (
    <>
      <Element name="home" className="section">
        <LazySection className="homeSection">
          <Home />
        </LazySection>
      </Element>

      <Element name="about" className="section">
        <LazySection className="aboutSection">
          <About />
        </LazySection>
      </Element>

      <Element name="projects" className="section">
        <LazySection className="projectsSection">
          <Projects />
        </LazySection>
      </Element>

      <Element name="experience" className="section">
        <LazySection className="experienceSection">
          <Experience />
        </LazySection>
      </Element>

      <Element name="contact" className="section">
        <LazySection className="contactSection">
          <Contact />
        </LazySection>
      </Element>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <MainContent />
            </>
          }
        />

        <Route 
          path="/repos" 
          element={
            <>
              <Navbar />
              <RepoPage />
            </>
          } 
        />

        {/* Rotas secretas alternativas */}
        <Route path="/cantadas" element={<CantadasSecreta />} />
        <Route path="/secret" element={<CantadasSecreta />} />
      </Routes>
    </Router>
  );
}

export default App;