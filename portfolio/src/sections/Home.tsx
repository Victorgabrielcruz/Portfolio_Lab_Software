import { Link } from "react-scroll";
import "../assets/styles/home.css";
import Astronauta from "../assets/images/Astronauta.png";

export default function Home() {
  const name = "Víctor Gabriel";

  return (
    <section className="container-home">
      <div className="home">
        <article className="home-text">
          <h1 className="home-h1">{name}</h1>
          <section className="home-description">
            <p className="paragraph-blocks"> Olá! Eu sou Víctor Gabriel, desenvolvedor back-end apaixonado por transformar ideias em soluções práticas e eficientes.   </p>
          </section>
          <section className="home-button-section">
            <Link
              className="home-button"
              to="about"
              smooth={true}
              duration={500}
              offset={-70}
            >
              Continuar
            </Link>
          </section>
        </article>

        <article className="home-image slide-in">
          <img src={Astronauta} alt="Astronauta" />
        </article>
      </div>
    </section>
  );
}
