import { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { adminService } from '../service/adminService';
import '../assets/styles/AdminLogin.css';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setErro('Preencha todos os campos');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      await adminService.login(formData);
      onLogin();
    } catch (error) {
      console.error('Erro no login:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>🔐 Painel Administrativo</h2>
          <p>Acesso restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="input-icon" />
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Digite seu usuário"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              disabled={carregando}
            />
          </div>

          {erro && <div className="form-error">{erro}</div>}

          <button
            type="submit"
            className="btn-login"
            disabled={carregando}
          >
            {carregando ? (
              <>⏳ Entrando...</>
            ) : (
              <>
                <FaSignInAlt />
                Entrar no Painel
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;