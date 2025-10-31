import { useState, useEffect } from 'react';
import { adminService } from '../service/adminService';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';
import '../assets/styles/AdminApp.css';

const AdminApp: React.FC = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verificar se já está autenticado
    const token = adminService.getToken();
    setAutenticado(!!token);
    setCarregando(false);
  }, []);

  const handleLogin = () => {
    setAutenticado(true);
  };

  const handleLogout = () => {
    adminService.logout();
    setAutenticado(false);
  };

  if (carregando) {
    return (
      <div className="admin-app-loading">
        <div className="spinner">⏳</div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="admin-app">
      {autenticado ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminApp;