import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import "../assets/styles/Projects.css";
import img_git from "../assets/images/git.jpg"; // imagem padrão

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

export default function AllProjects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const githubUser = "Victorgabrielcruz"; // seu usuário no GitHub

  useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=100`) // pegando até 100
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
      <h1 className="projects-title">Todos os Projetos</h1>

      {loading ? (
        <p>Carregando projetos...</p>
      ) : repos.length === 0 ? (
        <p>Não há projetos disponíveis.</p>
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
                imageSrc={img_git} // imagem padrão
                altText={repo.name}
                title={repo.name}
                dateRange={new Date(repo.updated_at).toLocaleDateString()}
                hoverText={repo.description || "Sem descrição"}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
