import { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaHeart, FaDatabase, FaSync } from "react-icons/fa";
import { apiService } from "../service/apiService";
import "../assets/styles/CantadasSecreta.css";

const CantadasSecreta = () => {
  const [cantadaAtual, setCantadaAtual] = useState("");
  const [contador, setContador] = useState(0);
  const [totalCantadas, setTotalCantadas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Cantadas de fallback
  const cantadasFallback = [
    "Gata, você é igual código binário... só tem 0 e 1! 💻",
    "Você é like do Instagram? Porque toda vez que te vejo, eu curto! ❤️",
    "Meu amor por você é igual bug no código... inesperado e difícil de resolver! 🐛",
    "Você é o CSS do meu HTML... sem você, minha vida não tem estilo! 🎨",
    "Gata, você é stack overflow? Porque você tem todas as soluções dos meus problemas! 🔍",
    "Me chama de React e me dá um hook, porque eu quero ficar ligado em você! ⚛️",
    "Você é commit no meu Git? Porque você salva meus dias! 💾",
    "Meu coração é como console.log... só funciona quando você está por perto! 📝",
    "Gata, você é deploy? Porque toda vez que chego perto, meu coração sobe pro ar! 🚀",
    "Você é o algoritmo do meu coração... complexo, mas sempre retorna true para você! 💝"
  ];

  useEffect(() => {
    inicializarDados();
  }, []);

  const inicializarDados = async () => {
    try {
      setCarregando(true);
      setErro("");

      // Registrar visita na API e obter estatísticas
      const estatisticas = await apiService.registrarVisita();
      setContador(estatisticas.visitas);
      setTotalCantadas(estatisticas.totalCantadas);

      // Gerar primeira cantada
      await gerarNovaCantadaAPI();

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      setErro("Não foi possível conectar com o servidor. Usando modo offline.");
      
      // Modo fallback
      const visitasLocal = parseInt(localStorage.getItem('visitasCantadas') || '0') + 1;
      localStorage.setItem('visitasCantadas', visitasLocal.toString());
      setContador(visitasLocal);
      setTotalCantadas(cantadasFallback.length);
      gerarNovaCantadaLocal();
    } finally {
      setCarregando(false);
    }
  };

  const gerarNovaCantadaAPI = async () => {
    try {
      const cantada = await apiService.obterCantadaAleatoria();
      setCantadaAtual(cantada);
    } catch (error) {
      console.error('Erro ao buscar cantada da API:', error);
      gerarNovaCantadaLocal();
    }
  };

  const gerarNovaCantadaLocal = () => {
    const cantadaAleatoria = cantadasFallback[Math.floor(Math.random() * cantadasFallback.length)];
    setCantadaAtual(cantadaAleatoria);
  };

  const gerarNovaCantada = () => {
    if (erro) {
      gerarNovaCantadaLocal();
    } else {
      gerarNovaCantadaAPI();
    }
  };

  const copiarCantada = async () => {
    try {
      await navigator.clipboard.writeText(cantadaAtual);
      alert("Cantada copiada! 🎯");
    } catch (err) {
      console.error('Falha ao copiar: ', err);
      alert("Erro ao copiar a cantada! 😢");
    }
  };

  const abrirWhatsApp = () => {
    const phoneNumber = "5538998968898";
    const message = "Olá Victor! Acabei de ver suas cantadas dev e queria conversar! 😄";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const abrirInstagram = () => {
    const instagramUrl = "https://www.instagram.com/victor_gc21/";
    window.open(instagramUrl, '_blank');
  };

  const recarregar = () => {
    setErro("");
    inicializarDados();
  };

  if (carregando) {
    return (
      <div className="cantadas-container">
        <div className="loading">
          <FaDatabase className="loading-icon" />
          <p>Conectando com a API...</p>
          <p className="loading-sub">Carregando suas cantadas especiais! 💖</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cantadas-container">
      <div className="cantadas-header">
        <h1>💘 Cantadas Dev Secreta</h1>
        <p className="subtitulo">
          {erro ? "Modo offline ativado 📴" : "Conectado com API + PostgreSQL 🚀"}
        </p>
        
        {erro && (
          <div className="error-message">
            <span>⚠️ {erro}</span>
            <button onClick={recarregar} className="btn-retry">
              <FaSync /> Tentar Novamente
            </button>
          </div>
        )}
      </div>

      <div className="cantada-card">
        <div className="cantada-content">
          <span className="cantada-texto">
            {cantadaAtual || "Clique em Nova Cantada para começar! 🎯"}
          </span>
        </div>
        
        <div className="cantada-actions">
          <button onClick={gerarNovaCantada} className="btn nova-cantada">
            🔄 Nova Cantada
          </button>
          <button onClick={copiarCantada} className="btn copiar" disabled={!cantadaAtual}>
            📋 Copiar
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-number">{contador}</span>
          <span className="stat-label">Visitas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{totalCantadas}</span>
          <span className="stat-label">Cantadas no BD</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{erro ? "📴" : "✅"}</span>
          <span className="stat-label">Status API</span>
        </div>
      </div>

      <footer className="cantadas-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>🔐 {erro ? "Modo Offline" : "API Online: cantadas-api.onrender.com"}</p>
            <p>🗄️ {erro ? "Dados Locais" : "PostgreSQL Neon.tech"}</p>
            <p>Feito com <FaHeart className="heart-icon" /> por Victor Gabriel</p>
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
          <p>
            {erro 
              ? "💌 Reconectando com o servidor..." 
              : "💌 Dados em tempo real do banco de dados!"
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CantadasSecreta;