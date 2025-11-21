// components/AdminPanel.tsx
import { useState, useEffect, useRef } from 'react';
import { 
  FaSignOutAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEnvelope, 
  FaChartBar, 
  FaSync, 
  FaDownload,
  FaImage 
} from 'react-icons/fa';
import { adminService } from '../service/adminService';
import { useExportToImage } from '../hooks/useExportToImage';
import type { AdminCantada, AdminMensagem, AdminEstatisticas } from '../service/adminService';
import '../assets/styles/AdminPanel.css';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [abaAtiva, setAbaAtiva] = useState<'cantadas' | 'mensagens' | 'estatisticas'>('cantadas');
  const [cantadas, setCantadas] = useState<AdminCantada[]>([]);
  const [mensagens, setMensagens] = useState<AdminMensagem[]>([]);
  const [estatisticas, setEstatisticas] = useState<AdminEstatisticas | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [modalAberto, setModalAberto] = useState<'adicionar' | 'editar' | null>(null);
  const [cantadaEditando, setCantadaEditando] = useState<AdminCantada | null>(null);
  const [novaCantada, setNovaCantada] = useState({ texto: '', categoria: 'dev' });

  const statsRef = useRef<HTMLDivElement>(null);
  const { exportToImage } = useExportToImage();

  useEffect(() => {
    carregarDados();
  }, [abaAtiva]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      switch (abaAtiva) {
        case 'cantadas':
          const cantadasData = await adminService.obterCantadasAdmin();
          setCantadas(cantadasData.cantadas);
          break;
        case 'mensagens':
          const mensagensData = await adminService.obterMensagensAdmin();
          setMensagens(mensagensData.mensagens);
          break;
        case 'estatisticas':
          const statsData = await adminService.obterEstatisticasAdmin();
          setEstatisticas(statsData.estatisticas);
          break;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarCantada = async () => {
    if (!novaCantada.texto.trim()) {
      alert('Digite uma cantada!');
      return;
    }

    try {
      await adminService.adicionarCantada(novaCantada.texto, novaCantada.categoria);
      setNovaCantada({ texto: '', categoria: 'dev' });
      setModalAberto(null);
      carregarDados();
      alert('Cantada adicionada com sucesso! ✅');
    } catch (error) {
      console.error('Erro ao adicionar cantada:', error);
      alert('Erro ao adicionar cantada.');
    }
  };

  const handleEditarCantada = async () => {
    if (!cantadaEditando || !cantadaEditando.texto.trim()) {
      alert('Digite uma cantada!');
      return;
    }

    try {
      await adminService.editarCantada(
        cantadaEditando.id,
        cantadaEditando.texto,
        cantadaEditando.categoria,
        cantadaEditando.ativa
      );
      setCantadaEditando(null);
      setModalAberto(null);
      carregarDados();
      alert('Cantada atualizada com sucesso! ✏️');
    } catch (error) {
      console.error('Erro ao editar cantada:', error);
      alert('Erro ao editar cantada.');
    }
  };

  const handleExcluirCantada = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta cantada?')) {
      return;
    }

    try {
      await adminService.excluirCantada(id);
      carregarDados();
      alert('Cantada excluída com sucesso! 🗑️');
    } catch (error) {
      console.error('Erro ao excluir cantada:', error);
      alert('Erro ao excluir cantada.');
    }
  };

  const handleExcluirMensagem = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) {
      return;
    }

    try {
      await adminService.excluirMensagem(id);
      carregarDados();
      alert('Mensagem excluída com sucesso! 🗑️');
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      alert('Erro ao excluir mensagem.');
    }
  };

  const abrirModalEditar = (cantada: AdminCantada) => {
    setCantadaEditando(cantada);
    setModalAberto('editar');
  };

  const handleExportStats = async () => {
    if (!statsRef.current) return;
    
    try {
      await exportToImage(statsRef.current, 'estatisticas-admin');
      alert('Estatísticas exportadas com sucesso! 📸');
    } catch (error) {
      console.error('Erro ao exportar estatísticas:', error);
      alert('Erro ao exportar estatísticas. Tente novamente.');
    }
  };

  const handleExportCantada = async (cantada: AdminCantada) => {
    // Criar elemento temporário para exportação
    const tempElement = document.createElement('div');
    tempElement.className = 'cantada-export-card';
    
    const categoriaIcon = {
      'dev': '💻',
      'romantica': '💖',
      'engracada': '😄'
    }[cantada.categoria] || '💌';

    tempElement.innerHTML = `
      <div class="export-header">
        <div class="export-title">
          <h3>${categoriaIcon} Cantada ${cantada.categoria}</h3>
          <span class="export-status">${cantada.ativa ? '✅ Ativa' : '❌ Inativa'}</span>
        </div>
        <div class="export-date">
          📅 ${new Date(cantada.data_criacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </div>
      </div>
      <div class="export-content">
        <div class="cantada-text-export">
          "${cantada.texto}"
        </div>
      </div>
      <div class="export-footer">
        <div class="export-watermark">
          💌 Sistema de Cantadas
        </div>
      </div>
    `;

    // Aplicar estilos
    Object.assign(tempElement.style, {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '16px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: '500px',
      maxWidth: '90vw',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '2px solid rgba(255,255,255,0.1)',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '10000',
      opacity: '0'
    });

    const style = document.createElement('style');
    style.textContent = `
      .cantada-export-card .export-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding-bottom: 15px;
      }
      
      .cantada-export-card .export-title h3 {
        margin: 0;
        font-size: 1.4em;
        font-weight: 600;
        text-transform: capitalize;
      }
      
      .cantada-export-card .export-status {
        background: rgba(255,255,255,0.2);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.9em;
        margin-top: 8px;
        display: inline-block;
      }
      
      .cantada-export-card .export-date {
        font-size: 0.9em;
        opacity: 0.9;
        text-align: right;
      }
      
      .cantada-export-card .export-content {
        margin: 25px 0;
      }
      
      .cantada-export-card .cantada-text-export {
        font-size: 1.3em;
        line-height: 1.6;
        font-style: italic;
        text-align: center;
        padding: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        border-left: 4px solid rgba(255,255,255,0.3);
      }
      
      .cantada-export-card .export-footer {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255,255,255,0.2);
        text-align: center;
        opacity: 0.8;
        font-size: 0.9em;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(tempElement);

    await new Promise(resolve => setTimeout(resolve, 100));
    tempElement.style.opacity = '1';

    try {
      await exportToImage(tempElement, `cantada-${cantada.id}`);
    } catch (error) {
      console.error('Erro ao exportar cantada:', error);
      alert('Erro ao exportar cantada. Tente novamente.');
    } finally {
      setTimeout(() => {
        document.body.removeChild(tempElement);
        document.head.removeChild(style);
      }, 100);
    }
  };

  const handleExportMensagem = async (mensagem: AdminMensagem) => {
    // Criar elemento temporário estilizado para exportação
    const tempElement = document.createElement('div');
    tempElement.className = 'mensagem-export-card';
    
    // Determinar cores baseadas no tipo de mensagem
    const isPrivate = mensagem.privada;
    const backgroundColor = isPrivate ? 
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
      'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    
    const icon = isPrivate ? '🔒' : '🌍';
    const tipoTexto = isPrivate ? 'Mensagem Privada' : 'Mensagem Pública';
    const statusIcon = mensagem.lida ? '📭' : '📬';
    const statusTexto = mensagem.lida ? 'Lida' : 'Nova';

    tempElement.innerHTML = `
      <div class="export-header">
        <div class="export-title">
          <h3>${icon} ${tipoTexto}</h3>
          <span class="export-status">${statusIcon} ${statusTexto}</span>
        </div>
        <div class="export-date">
          📅 ${new Date(mensagem.data_criacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      <div class="export-content">
        <div class="mensagem-text-export">
          "${mensagem.mensagem}"
        </div>
      </div>
      <div class="export-footer">
        <div class="export-watermark">
          💌 Sistema de Mensagens Anônimas
        </div>
      </div>
    `;

    // Aplicar estilos diretamente
    Object.assign(tempElement.style, {
      background: backgroundColor,
      color: 'white',
      padding: '30px',
      borderRadius: '16px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: '500px',
      maxWidth: '90vw',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '2px solid rgba(255,255,255,0.1)',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '10000',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    });

    // Estilos para os elementos internos
    const style = document.createElement('style');
    style.textContent = `
      .mensagem-export-card .export-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding-bottom: 15px;
      }
      
      .mensagem-export-card .export-title h3 {
        margin: 0;
        font-size: 1.4em;
        font-weight: 600;
      }
      
      .mensagem-export-card .export-status {
        background: rgba(255,255,255,0.2);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.9em;
        margin-top: 8px;
        display: inline-block;
      }
      
      .mensagem-export-card .export-date {
        font-size: 0.9em;
        opacity: 0.9;
        text-align: right;
      }
      
      .mensagem-export-card .export-content {
        margin: 25px 0;
      }
      
      .mensagem-export-card .mensagem-text-export {
        font-size: 1.3em;
        line-height: 1.6;
        font-style: italic;
        text-align: center;
        padding: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        border-left: 4px solid rgba(255,255,255,0.3);
      }
      
      .mensagem-export-card .export-footer {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255,255,255,0.2);
        text-align: center;
        opacity: 0.8;
        font-size: 0.9em;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(tempElement);

    // Pequeno delay para garantir que os estilos são aplicados
    await new Promise(resolve => setTimeout(resolve, 100));
    
    tempElement.style.opacity = '1';

    try {
      await exportToImage(tempElement, `mensagem-${mensagem.id}`);
    } catch (error) {
      console.error('Erro ao exportar mensagem:', error);
      alert('Erro ao exportar mensagem. Tente novamente.');
    } finally {
      // Limpeza
      setTimeout(() => {
        document.body.removeChild(tempElement);
        document.head.removeChild(style);
      }, 100);
    }
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title">
          <h1>🎯 Painel Administrativo</h1>
          <p>Gerencie cantadas e mensagens</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          <FaSignOutAlt />
          Sair
        </button>
      </div>

      {/* Navegação */}
      <div className="admin-nav">
        <button
          className={`nav-btn ${abaAtiva === 'cantadas' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('cantadas')}
        >
          💌 Cantadas
        </button>
        <button
          className={`nav-btn ${abaAtiva === 'mensagens' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('mensagens')}
        >
          <FaEnvelope /> Mensagens
          {estatisticas && estatisticas.mensagensNaoLidas > 0 && (
            <span className="badge">{estatisticas.mensagensNaoLidas}</span>
          )}
        </button>
        <button
          className={`nav-btn ${abaAtiva === 'estatisticas' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('estatisticas')}
        >
          <FaChartBar /> Estatísticas
        </button>
      </div>

      {/* Conteúdo */}
      <div className="admin-content">
        {carregando ? (
          <div className="loading">
            <FaSync className="spinner" />
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            {/* ABA CANTADAS */}
            {abaAtiva === 'cantadas' && (
              <div className="cantadas-section">
                <div className="section-header">
                  <h2>📋 Gerenciar Cantadas</h2>
                  <button
                    onClick={() => setModalAberto('adicionar')}
                    className="btn-add"
                  >
                    <FaPlus />
                    Nova Cantada
                  </button>
                </div>

                <div className="cantadas-list">
                  {cantadas.map(cantada => (
                    <div key={cantada.id} className={`cantada-item ${!cantada.ativa ? 'inactive' : ''}`}>
                      <div className="cantada-content">
                        <p className="cantada-text">{cantada.texto}</p>
                        <div className="cantada-meta">
                          <span className="categoria">{cantada.categoria}</span>
                          <span className="data">
                            {new Date(cantada.data_criacao).toLocaleDateString('pt-BR')}
                          </span>
                          <span className={`status ${cantada.ativa ? 'active' : 'inactive'}`}>
                            {cantada.ativa ? '✅ Ativa' : '❌ Inativa'}
                          </span>
                        </div>
                      </div>
                      <div className="cantada-actions">
                        <button
                          onClick={() => handleExportCantada(cantada)}
                          className="btn-export-small"
                          title="Exportar como imagem"
                        >
                          <FaImage />
                        </button>
                        <button
                          onClick={() => abrirModalEditar(cantada)}
                          className="btn-edit"
                          title="Editar cantada"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleExcluirCantada(cantada.id)}
                          className="btn-delete"
                          title="Excluir cantada"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA MENSAGENS */}
            {abaAtiva === 'mensagens' && (
              <div className="mensagens-section">
                <div className="section-header">
                  <h2>💬 Mensagens Recebidas</h2>
                  <div className="header-actions">
                    <button onClick={carregarDados} className="btn-refresh">
                      <FaSync />
                      Atualizar
                    </button>
                  </div>
                </div>

                <div className="mensagens-list">
                  {mensagens.map(mensagem => (
                    <div key={mensagem.id} className={`mensagem-item ${mensagem.privada ? 'private' : 'public'} ${!mensagem.lida ? 'unread' : ''}`}>
                      <div className="mensagem-content">
                        <p className="mensagem-text">{mensagem.mensagem}</p>
                        <div className="mensagem-meta">
                          <span className={`visibility ${mensagem.privada ? 'private' : 'public'}`}>
                            {mensagem.privada ? '🔒 Privada' : '🌍 Pública'}
                          </span>
                          <span className="data">
                            {new Date(mensagem.data_criacao).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="status">
                            {mensagem.lida ? '📭 Lida' : '📬 Nova'}
                          </span>
                        </div>
                      </div>
                      <div className="mensagem-actions">
                        <button
                          onClick={() => handleExportMensagem(mensagem)}
                          className="btn-export-small"
                          title="Exportar como imagem"
                        >
                          <FaImage />
                        </button>
                        <button
                          onClick={() => handleExcluirMensagem(mensagem.id)}
                          className="btn-delete"
                          title="Excluir mensagem"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA ESTATÍSTICAS */}
            {abaAtiva === 'estatisticas' && estatisticas && (
              <div className="estatisticas-section">
                <div className="section-header">
                  <h2>📊 Estatísticas do Sistema</h2>
                  <div className="header-actions">
                    <button onClick={handleExportStats} className="btn-export">
                      <FaDownload />
                      Exportar como Imagem
                    </button>
                    <button onClick={carregarDados} className="btn-refresh">
                      <FaSync />
                      Atualizar
                    </button>
                  </div>
                </div>

                <div ref={statsRef} className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <h3>{estatisticas.visitas}</h3>
                      <p>Total de Visitas</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">💌</div>
                    <div className="stat-info">
                      <h3>{estatisticas.cantadasAtivas}</h3>
                      <p>Cantadas Ativas</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">💬</div>
                    <div className="stat-info">
                      <h3>{estatisticas.totalMensagens}</h3>
                      <p>Total de Mensagens</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📬</div>
                    <div className="stat-info">
                      <h3>{estatisticas.mensagensNaoLidas}</h3>
                      <p>Mensagens Não Lidas</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL ADICIONAR/EDITAR CANTADA */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalAberto === 'adicionar' ? '➕ Nova Cantada' : '✏️ Editar Cantada'}</h2>
              <button onClick={() => setModalAberto(null)} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Cantada:</label>
                <textarea
                  value={modalAberto === 'adicionar' ? novaCantada.texto : cantadaEditando?.texto || ''}
                  onChange={(e) => {
                    if (modalAberto === 'adicionar') {
                      setNovaCantada(prev => ({ ...prev, texto: e.target.value }));
                    } else if (cantadaEditando) {
                      setCantadaEditando(prev => prev ? { ...prev, texto: e.target.value } : null);
                    }
                  }}
                  placeholder="Digite a cantada..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Categoria:</label>
                <select
                  value={modalAberto === 'adicionar' ? novaCantada.categoria : cantadaEditando?.categoria || 'dev'}
                  onChange={(e) => {
                    if (modalAberto === 'adicionar') {
                      setNovaCantada(prev => ({ ...prev, categoria: e.target.value }));
                    } else if (cantadaEditando) {
                      setCantadaEditando(prev => prev ? { ...prev, categoria: e.target.value } : null);
                    }
                  }}
                >
                  <option value="dev">💻 Dev</option>
                  <option value="romantica">💖 Romântica</option>
                  <option value="engracada">😄 Engraçada</option>
                </select>
              </div>

              {modalAberto === 'editar' && (
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={cantadaEditando?.ativa || false}
                      onChange={(e) => {
                        if (cantadaEditando) {
                          setCantadaEditando(prev => prev ? { ...prev, ativa: e.target.checked } : null);
                        }
                      }}
                    />
                    <span className="checkmark"></span>
                    Cantada ativa
                  </label>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={() => setModalAberto(null)} className="btn-cancel">
                Cancelar
              </button>
              <button
                onClick={modalAberto === 'adicionar' ? handleAdicionarCantada : handleEditarCantada}
                className="btn-confirm"
              >
                {modalAberto === 'adicionar' ? 'Adicionar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;