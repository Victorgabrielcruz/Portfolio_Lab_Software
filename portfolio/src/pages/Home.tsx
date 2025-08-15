import "../styles/home.css";

export default function Home() {
  const Name = 'Víctor Gabriel Cruz Pereira';

  return (
    <div className="home">
      <h1 className="home-h1">{Name}</h1>
      <section className="home-description">
          <p className="paragraph-blocks">Olá! Eu sou Víctor Gabriel, desenvolvedor back-end e analista de dados, apaixonado por transformar ideias em soluções práticas e eficientes.</p>

          <p className="paragraph-blocks_">Sou Técnico em Informática e estudante de Engenharia de Software na PUC Minas, com afinidade por back-end e análise de dados. Já desenvolvi projetos bem-sucedidos e estou sempre em busca de aprender e aplicar novas tecnologias.</p>
      </section>
      <section className="home-button-section">
        <button className="home-button">Continuar</button>
      </section>
    </div>
  );
}
