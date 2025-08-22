import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import "../assets/styles/Projects.css";
import img_git from "../assets/images/git.jpg"; // Imagem de fundo opcional
import { Link } from "react-router-dom"; // <- substituir o import
type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  owner: {
    avatar_url: string;
  };
  updated_at: string;
};

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const githubUser = "Victorgabrielcruz"; // seu usuário no GitHub

  useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=3`)
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="projects-section">
      <h1 className="projects-title">Meus Projetos</h1>

      {loading ? (
        <p>Carregando projetos...</p>
      ) : (
        <div className="projects-cards">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="project-link"
            >
              <Card
                imageSrc={img_git} // imagem do GitHub
                altText={repo.name}
                title={repo.name}
                dateRange={new Date(repo.updated_at).toLocaleDateString()} // data da última atualização
                hoverText={repo.description || "Sem descrição"}
              />
            </a>
          ))}
        </div>
      )}

<div className="projects-button-container">
  <Link to="/repos">
    <button className="projects-button">Veja Mais</button>
  </Link>
</div>
    </div>
  );
}
