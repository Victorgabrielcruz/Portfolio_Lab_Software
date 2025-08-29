import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/Projects.css";
import video1 from "../assets/videos/EducaCidades.mp4";
import video2 from "../assets/videos/RecompensaVerde_Video.mp4";
import { FaGithub} from "react-icons/fa";

export default function Projects() {
  // Configuração do carrossel
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <div className="projects-section">
      <h1 className="projects-title">Meus Projetos</h1>

      <div className="projects-carousel">
        <Slider {...settings}>
          {/* Slide 1 */}
          <div className="video-container">
            <video width="100%" height="auto" controls>
              <source src={video2} type="video/mp4" />
              Seu navegador não suporta vídeos em HTML5.
            </video>
            <a
              href="https://github.com/Victorgabrielcruz/Recompensa-Verde"
              target="_blank"
              rel="noreferrer"
              className="video-button"
            >
              <FaGithub size={30} color="#000000" />
            </a>
          </div>

          {/* Slide 2 */}
          <div className="video-container">
            <video width="100%" height="auto" controls>
              <source src={video1} type="video/mp4" />
              Seu navegador não suporta vídeos em HTML5.
            </video>
            <a
              href="https://github.com/Victorgabrielcruz/Instituto-Educa-Cidade"
              target="_blank"
              rel="noreferrer"
              className="video-button"
            >
              <FaGithub size={30} color="#000000" />
            </a>
          </div>
        </Slider>
      </div>

      <div className="projects-button-container">
        <Link to="/repos">
          <button className="projects-button">Veja Mais</button>
        </Link>
      </div>
    </div>
  );
}
