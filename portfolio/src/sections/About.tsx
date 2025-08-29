import "../assets/styles/about.css";
import AboutImage from "../assets/images/about.png";

export default function About() {
  return (
    <section className="container-about">
      <div className="about">
        <article className="img-about">
          <img src={AboutImage} alt="About Me" />
        </article>
        <article className="about-description">
          <h2 className="about-h2">Víctor Gabriel</h2>
          <p className="paragraph-blocks-about">
            Sou Técnico em Informática e estudante de Engenharia de Software na PUC Minas, com afinidade pela área de back-end e apaixonado por transformar ideias em soluções práticas e eficientes.
          </p>
          <p className="paragraph-blocks-about">
           Embora ainda esteja no início da carreira, já participei de projetos bem-sucedidos que demonstram meu comprometimento, capacidade de aprendizado e entusiasmo por novas tecnologias.
          </p>
          <p className="paragraph-blocks-about">
            Suspendisse potenti. Proin et lorem eros. Integer sed magna ac felis
            fermentum bibendum.
          </p>
        </article>
      </div>
    </section>
  );
}
