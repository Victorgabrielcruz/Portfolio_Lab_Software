import "../assets/styles/Experience.css";
import Card from "../components/Card";
import TechnologyCard from "../components/TechnologyCard";
import stellantisLogo from "../assets/images/Stellantis.jpg";

import { SiSpring, SiPostgresql, SiOracle } from "react-icons/si";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaJava, FaGit, FaDocker, FaPython } from "react-icons/fa";

function Experience() {
  const empresas = [
    {
      imageSrc: stellantisLogo,
      altText: 'Stellantis',
      title: 'Stellantis Automoveis',
      dateRange: 'ATUAL',
      hoverText: 'Apoio na análise de dados tarifários\nControle do fluxo tarifário\nDesenvolvimento de ferramentas de automação\nsuporte ao time de Customs\nElaboração de relatórios e dashboards'
    },
  ];

  const tecnologias = [
    { name: 'HTML', Icon: FaHtml5, color: '#E34F26' },
    { name: 'CSS', Icon: FaCss3Alt, color: '#1572B6' },
    { name: 'JavaScript', Icon: FaJs, color: '#F7DF1E' },
    { name: 'React', Icon: FaReact, color: '#61DAFB' },
    { name: 'Java', Icon: FaJava, color: '#007396' },
    { name: 'Spring', Icon: SiSpring, color: '#6DB33F' },
    { name: 'Git', Icon: FaGit, color: '#F05032' },
    { name: 'PostgreSQL', Icon: SiPostgresql, color: '#336791' },
    { name: 'Docker', Icon: FaDocker, color: '#2496ED' },
    { name: 'Oracle Database', Icon: SiOracle, color: '#F80000' },
    { name: 'Python', Icon: FaPython, color: '#3776AB' },
  ];

  return (
    <div className="experience">
      <h1 className="experience-title">Experience</h1>
      <div className="experience-grid">
        {empresas.map((empresa, index) => (
          <Card
            key={index}
            imageSrc={empresa.imageSrc}
            altText={empresa.altText}
            title={empresa.title}
            dateRange={empresa.dateRange}
            hoverText={empresa.hoverText}
          />
        ))}
      </div>
      <h1 className="technologies-title">Technologies</h1>
      <div className="technologies-grid">
        {tecnologias.map((tech, index) => (
          <TechnologyCard
            key={index}
            name={tech.name}
            Icon={tech.Icon}
            color={tech.color}
            index={index}
          />
        ))}
      </div>

    </div>
  );
}

export default Experience;
