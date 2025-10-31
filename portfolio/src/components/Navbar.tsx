import type { FC, JSX } from "react";
import { scroller } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import perfilImg from "../assets/images/perfil.jpeg";
import "../assets/styles/Navbar.css";
import { useEffect, useState } from "react";

const Navbar: FC = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    setIsMobileMenuOpen(false); // Fecha menu ao clicar
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: -70,
      });
    }
  };

  const handleReposClick = () => {
    setIsMobileMenuOpen(false); // Fecha menu ao clicar
  };

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const section = (location.state as any).scrollTo;
      scroller.scrollTo(section, { smooth: true, duration: 500, offset: -70 });
      setActiveSection(section);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Fecha menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navStyles">
      <div className="linksNavStyle">
        <div className="containerStyles">
          {/* Nome visível em desktop */}
          <span className="desktop-name">Victor Gabriel</span>
          
          {/* Links desktop */}
          <div className="desktop-links">
            {["home", "about", "projects", "contact"].map((section) => (
              <span
                key={section}
                className={`linkStyles ${activeSection === section ? "active" : ""}`}
                onClick={() => handleNavClick(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
            ))}
            <RouterLink to="/repos" className="linkStyles">
              Repositories
            </RouterLink>
          </div>

          {/* Menu Hamburguer Mobile */}
          <div className="mobile-menu">
            <span className="mobile-name">Victor</span>
            <button 
              className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        <div className={`mobile-dropdown ${isMobileMenuOpen ? "active" : ""}`}>
          {["home", "about", "projects", "contact"].map((section) => (
            <span
              key={section}
              className={`mobile-link ${activeSection === section ? "active" : ""}`}
              onClick={() => handleNavClick(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          ))}
          <RouterLink 
            to="/repos" 
            className="mobile-link"
            onClick={handleReposClick}
          >
            Repositories
          </RouterLink>
        </div>
      </div>
      <img className="imgStyles" src={perfilImg} alt="Perfil" />
    </nav>
  );
};

export default Navbar;