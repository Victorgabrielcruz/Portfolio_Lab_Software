import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Element } from "react-scroll";

import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import RepoPage from "./page/Repo"; // página separada
import LazySection from "./components/LazySection"; // para animação ao entrar na tela

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
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
          }
        />

        <Route path="/repos" element={<RepoPage />} /> {/* página separada */}
      </Routes>
    </Router>
  );
}

export default App;
