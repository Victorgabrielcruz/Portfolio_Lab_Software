import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaEnvelope, FaChartBar, FaSync } from 'react-icons/fa';
import { adminService } from '../service/adminService';
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
                          onClick={() => abrirModalEditar(cantada)}
                          className="btn-edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleExcluirCantada(cantada.id)}
                          className="btn-delete"
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
                  <button onClick={carregarDados} className="btn-refresh">
                    <FaSync />
                    Atualizar
                  </button>
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
                          onClick={() => handleExcluirMensagem(mensagem.id)}
                          className="btn-delete"
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
                  <button onClick={carregarDados} className="btn-refresh">
                    <FaSync />
                    Atualizar
                  </button>
                </div>

                <div className="stats-grid">
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