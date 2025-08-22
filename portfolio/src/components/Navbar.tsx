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

  const handleNavClick = (section: string) => {
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

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const section = (location.state as any).scrollTo;
      scroller.scrollTo(section, { smooth: true, duration: 500, offset: -70 });
      setActiveSection(section);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <nav className="navStyles">
      <div className="linksNavStyle">
        <div className="containerStyles">
          {["home", "about", "projects", "contact"].map((section) => (
            <span
              key={section}
              className={`linkStyles ${activeSection === section ? "active" : ""}`}
              onClick={() => handleNavClick(section)}
            >
              {section === "home"
                ? "Victor Gabriel"
                : section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          ))}
          <RouterLink to="/repos" className="linkStyles">
            Repositories
          </RouterLink>
        </div>
      </div>
      <img className="imgStyles" src={perfilImg} alt="Perfil" />
    </nav>
  );
};

export default Navbar;
