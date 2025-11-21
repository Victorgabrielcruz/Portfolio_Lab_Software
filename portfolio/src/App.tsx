import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Element } from "react-scroll";

import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import RepoPage from "./page/Repo";
import CantadasSecreta from "./page/CantadasSecreta";
import LazySection from "./components/LazySection";
import AdminApp from "./page/AdminApp";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal com todas as seções */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
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

        {/* Rota pública de repositórios */}
        <Route 
          path="/repos" 
          element={
            <>
              <Navbar />
              <RepoPage />
            </>
          } 
        />

        {/* 👇 ROTAS SECRETAS - SEM NAVBAR */}
        <Route path="/lab" element={<CantadasSecreta />} />
        <Route path="/lab/secretMe" element={<CantadasSecreta autoOpenModal={true}/>} />

        <Route path="/lab/admin" element={<AdminApp />} />
        
        {/* Rota fallback para 404 */}
        <Route path="*" element={
          <>
            <Navbar />
            <div style={{ 
              textAlign: 'center', 
              padding: '100px 20px',
              color: 'white',
              minHeight: '60vh'
            }}>
              <h1>404 - Página Não Encontrada</h1>
              <p>Esta página não existe. <a href="/" style={{ color: '#a463f2' }}>Voltar para o início</a></p>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;