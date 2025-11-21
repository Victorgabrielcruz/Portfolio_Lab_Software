import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaDatabase, FaSync, FaEnvelope } from "react-icons/fa";
import { apiService } from "../service/apiService";
import ModalMensagem from "../components/ModalMensagem";
import "../assets/styles/CantadasSecreta.css";

interface CantadasSecretaProps {
  autoOpenModal?: boolean;
}

const CantadasSecreta: React.FC<CantadasSecretaProps> = ({ autoOpenModal = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cantadaAtual, setCantadaAtual] = useState<string>("");
  const [contador, setContador] = useState<number>(0);
  const [totalCantadas, setTotalCantadas] = useState<number>(0);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");
  const [modalAberto, setModalAberto] = useState<boolean>(autoOpenModal);

  // Cantadas de fallback
  const cantadasFallback: string[] = [
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
    
    // Se não veio por prop, verifica query params
    if (!autoOpenModal) {
      const modalParam = searchParams.get('modal');
      if (modalParam === 'mensagem') {
        setModalAberto(true);
      }
    }
  }, [autoOpenModal, searchParams]);

  const inicializarDados = async (): Promise<void> => {
    try {
      setCarregando(true);
      setErro("");

      // Testar conexão com a API
      await apiService.healthCheck();
      
      // Registrar visita e obter estatísticas
      const stats = await apiService.registrarVisita();
      setContador(stats.visitas);
      setTotalCantadas(stats.totalCantadas);

      // Gerar primeira cantada
      await gerarNovaCantadaAPI();

    } catch (error) {
      console.error('Erro ao carregar dados da API:', error);
      setErro('Não foi possível conectar com o servidor. Usando modo offline.');
      usarFallback();
    } finally {
      setCarregando(false);
    }
  };

  const usarFallback = (): void => {
    // Contador fallback
    const visitasLocal = parseInt(localStorage.getItem('visitasCantadas') || '0') + 1;
    localStorage.setItem('visitasCantadas', visitasLocal.toString());
    setContador(visitasLocal);
    setTotalCantadas(cantadasFallback.length);
    
    // Gerar primeira cantada local
    gerarNovaCantadaLocal();
  };

  const gerarNovaCantadaAPI = async (): Promise<void> => {
    try {
      const cantada = await apiService.obterCantadaAleatoria();
      setCantadaAtual(cantada);
    } catch (error) {
      console.error('Erro ao buscar cantada da API:', error);
      gerarNovaCantadaLocal();
    }
  };

  const gerarNovaCantadaLocal = (): void => {
    const cantadaAleatoria = cantadasFallback[Math.floor(Math.random() * cantadasFallback.length)];
    setCantadaAtual(cantadaAleatoria);
  };

  const gerarNovaCantada = (): void => {
    if (erro) {
      gerarNovaCantadaLocal();
    } else {
      gerarNovaCantadaAPI();
    }
  };

  const copiarCantada = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(cantadaAtual);
      alert("Cantada copiada! 🎯");
    } catch (err) {
      console.error('Falha ao copiar: ', err);
      alert("Erro ao copiar a cantada! 😢");
    }
  };

  const abrirWhatsApp = (): void => {
    const phoneNumber = "5538998968898";
    const message = "Olá Victor! Acabei de ver suas cantadas dev e queria conversar! 😄";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const abrirInstagram = (): void => {
    const instagramUrl = "https://www.instagram.com/victor_gc21/";
    window.open(instagramUrl, '_blank');
  };

  const recarregar = (): void => {
    setErro("");
    inicializarDados();
  };

  const abrirModalMensagem = (): void => {
    setModalAberto(true);
    // Adicionar parâmetro na URL
    searchParams.set('modal', 'mensagem');
    setSearchParams(searchParams);
  };

  const fecharModal = (): void => {
    setModalAberto(false);
    // Remover parâmetro da URL
    searchParams.delete('modal');
    setSearchParams(searchParams);
    
    // Se veio de rota específica, redireciona para rota normal
    if (autoOpenModal) {
      window.history.replaceState(null, '', '/cantadas');
    }
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
          <button 
            onClick={gerarNovaCantada} 
            className="btn nova-cantada"
            disabled={carregando}
          >
            🔄 Nova Cantada
          </button>
          <button 
            onClick={copiarCantada} 
            className="btn copiar"
            disabled={!cantadaAtual || carregando}
          >
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
            <p>Feito por Victor Gabriel</p>
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
              <button 
                onClick={abrirModalMensagem} 
                className="btn mensagem-btn"
                disabled={carregando}
              >
                <FaEnvelope /> Enviar Mensagem
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

      {/* Modal de Mensagens Anônimas */}
      <ModalMensagem 
        isOpen={modalAberto} 
        onClose={fecharModal} 
      />
    </div>
  );
};

export default CantadasSecreta;