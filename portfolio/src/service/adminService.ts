const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cantadas-api.onrender.com/api';

export interface AdminCantada {
  id: number;
  texto: string;
  categoria: string;
  ativa: boolean;
  data_criacao: string;
}

export interface AdminMensagem {
  id: number;
  mensagem: string;
  privada: boolean;
  lida: boolean;
  data_criacao: string;
}

export interface AdminEstatisticas {
  visitas: number;
  cantadasAtivas: number;
  totalMensagens: number;
  mensagensNaoLidas: number;
}

export interface LoginData {
  username: string;
  password: string;
}

class AdminService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  private async fetchAdmin<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Não autenticado');
    }

    const url = `${API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}token=${token}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (response.status === 401) {
        this.logout();
        throw new Error('Sessão expirada');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`Erro na requisição admin para ${endpoint}:`, error);
      throw error;
    }
  }

  // Login
  async login(loginData: LoginData): Promise<{ usuario: any; token: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (!data.success) {
      throw new Error(data.error || 'Login failed');
    }

    this.setToken(data.token);
    return data;
  }

  // Cantadas
  async obterCantadasAdmin(page: number = 1, limit: number = 50): Promise<{ cantadas: AdminCantada[]; total: number; page: number; totalPages: number }> {
    return this.fetchAdmin(`/admin/cantadas?page=${page}&limit=${limit}`);
  }

  async adicionarCantada(texto: string, categoria: string = 'dev'): Promise<{ cantada: AdminCantada; message: string }> {
    return this.fetchAdmin('/admin/cantadas', {
      method: 'POST',
      body: JSON.stringify({ texto, categoria })
    });
  }

  async editarCantada(id: number, texto: string, categoria: string, ativa: boolean): Promise<{ cantada: AdminCantada; message: string }> {
    return this.fetchAdmin(`/admin/cantadas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ texto, categoria, ativa })
    });
  }

  async excluirCantada(id: number): Promise<{ message: string }> {
    return this.fetchAdmin(`/admin/cantadas/${id}`, {
      method: 'DELETE'
    });
  }

  // Mensagens
  async obterMensagensAdmin(page: number = 1, limit: number = 50): Promise<{ mensagens: AdminMensagem[]; total: number; page: number; totalPages: number }> {
    return this.fetchAdmin(`/admin/mensagens?page=${page}&limit=${limit}`);
  }

  async excluirMensagem(id: number): Promise<{ message: string }> {
    return this.fetchAdmin(`/admin/mensagens/${id}`, {
      method: 'DELETE'
    });
  }

  // Estatísticas
  async obterEstatisticasAdmin(): Promise<{ estatisticas: AdminEstatisticas }> {
    return this.fetchAdmin('/admin/estatisticas');
  }
}

export const adminService = new AdminService();