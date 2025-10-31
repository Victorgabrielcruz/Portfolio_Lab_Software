import { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaHeart } from "react-icons/fa";
import "../assets/styles/CantadasSecreta.css";

const CantadasSecreta = () => {
  const [cantadaAtual, setCantadaAtual] = useState("");
  const [contador, setContador] = useState(0);

  const cantadas = [
    "Gata, você é igual código binário... só tem 0 e 1! 💻",
    "Você é like do Instagram? Porque toda vez que te vejo, eu curto! ❤️",
    "Meu amor por você é igual bug no código... inesperado e difícil de resolver! 🐛",
    "Você é o CSS do meu HTML... sem você, minha vida não tem estilo! 🎨",
    "Gata, você é stack overflow? Porque você tem todas as soluções dos meus problemas! 🔍",
    "Me chama de React e me dá um hook, porque eu quero ficar ligado em você! ⚛️",
    "Você é commit no meu Git? Porque você salva meus dias! 💾",
    "Meu coração é como console.log... só funciona quando você está por perto! 📝",
    "Gata, você é deploy? Porque toda vez que chego perto, meu coração sobe pro ar! 🚀",
    "Você é o algoritmo do meu coração... complexo, mas sempre retorna true para você! 💝",
    "Me chama de JavaScript e vem ser minha Promise, porque eu quero resolver com você! 📜",
    "Se beleza fosse código, você seria open source! 🌟",
    "Você é like do LinkedIn? Profissionalmente, eu te curti! 💼",
    "Meu amor por você é igual loop infinito... nunca acaba! 🔄",
    "Gata, você é Wi-Fi? Porque toda vez que você passa, meu sinal fica forte! 📶",
    "Você é o Docker do meu coração... containeriza meus sentimentos! 🐳",
    "Me chama de banco de dados e vem ser minha primary key! 🔑",
    "Se existisse um hackathon do amor, eu faria pair programming com você! 👩‍💻👨‍💻",
    "Você é o npm do meu projeto... instalo tudo que preciso em você! 📦",
    "Meu coração é como API REST... sempre retorna 200 quando você faz uma request! 🌐",
    "Gata, você é debug? Porque você acha todos os erros do meu coração! 🔧",
    "Você é o TypeScript dos meus sentimentos... tipa tudo de bom! 📐",
    "Me chama de GitHub e vem fazer merge com meu coração! 🐙",
    "Se amor fosse código, você seria minha linha favorita! 💕",
    "Você é o responsive do meu layout... se adapta perfeitamente à minha vida! 📱"
  ];

  useEffect(() => {
    gerarNovaCantada();
    
    const visitas = parseInt(localStorage.getItem('visitasCantadas') || '0') + 1;
    localStorage.setItem('visitasCantadas', visitas.toString());
    setContador(visitas);
  }, []);

  const gerarNovaCantada = () => {
    const cantadaAleatoria = cantadas[Math.floor(Math.random() * cantadas.length)];
    setCantadaAtual(cantadaAleatoria);
  };

  const copiarCantada = async () => {
    try {
      await navigator.clipboard.writeText(cantadaAtual);
      alert("Cantada copiada! 🎯");
    } catch (err) {
      console.error('Falha ao copiar: ', err);
    }
  };

  const abrirWhatsApp = () => {
    const phoneNumber = "5538998968898"; // SUBSTITUA pelo seu número
    const message = "Olá Victor! Acabei de ver suas cantadas dev e queria conversar! 😄";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const abrirInstagram = () => {
    // SUBSTITUA pelo seu @ do Instagram
    const instagramUrl = "https://www.instagram.com/victor_gc21/";
    window.open(instagramUrl, '_blank');
  };

  return (
    <div className="cantadas-container">
      <div className="cantadas-header">
        <h1>💘 Cantadas Dev Secreta</h1>
        <p className="subtitulo">Área restrita para desenvolvedores românticos</p>
      </div>

      <div className="cantada-card">
        <div className="cantada-content">
          <span className="cantada-texto">{cantadaAtual}</span>
        </div>
        
        <div className="cantada-actions">
          <button onClick={gerarNovaCantada} className="btn nova-cantada">
            🔄 Nova Cantada
          </button>
          <button onClick={copiarCantada} className="btn copiar">
            📋 Copiar
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-number">{contador}</span>
          <span className="stat-label">Visitas Secretas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{cantadas.length}</span>
          <span className="stat-label">Cantadas no Banco</span>
        </div>
      </div>

      {/* NOVO FOOTER COM REDES SOCIAIS */}
      <footer className="cantadas-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>🔐 Página secreta - Acessível apenas por URL</p>
            <p>Feito com <FaHeart className="heart-icon" /> e 💻 por Victor Gabriel</p>
          </div>
          
          <div className="social-links">
            <p>Me encontre nas redes:</p>
            <div className="social-buttons">
              <button onClick={abrirWhatsApp} className="social-btn whatsapp-btn">
                <FaWhatsapp className="social-icon" />
                WhatsApp
              </button>
              <button onClick={abrirInstagram} className="social-btn instagram-btn">
                <FaInstagram className="social-icon" />
                Instagram
              </button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>💌 Se gostou das cantadas, me chama pra conversar!</p>
        </div>
      </footer>
    </div>
  );
};

export default CantadasSecreta;