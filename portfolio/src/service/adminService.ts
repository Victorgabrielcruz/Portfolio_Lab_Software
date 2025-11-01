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
    console.log('🔐 Token salvo no localStorage:', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const authenticated = !!token;
    console.log('🔍 Verificando autenticação:', authenticated, 'Token:', token);
    return authenticated;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('admin_token');
    console.log('🚪 Logout realizado - token removido');
  }

  // Método para debug
  debugAuth() {
    console.log('=== 🔍 DEBUG AUTH ===');
    console.log('Token na memória:', this.token);
    console.log('Token no localStorage:', localStorage.getItem('admin_token'));
    console.log('isAuthenticated:', this.isAuthenticated());
    console.log('LocalStorage disponível:', typeof localStorage !== 'undefined');
    console.log('========================');
  }

  private async fetchAdmin<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Não autenticado');
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 🔥 CORREÇÃO: Adicionar Bearer
          ...options.headers,
        },
        ...options,
      });

      console.log(`🔐 Requisição para: ${url}`);
      console.log(`📊 Status: ${response.status}`);

      if (response.status === 401) {
        this.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Erro HTTP ${response.status}:`, errorText);
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro na requisição');
      }

      console.log(`✅ Sucesso: ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`❌ Erro na requisição admin para ${endpoint}:`, error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Erro de conexão. Verifique sua internet.');
        } else if (error.message.includes('401')) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
      }
      
      throw error;
    }
  }

  // Login - VERSÃO CORRIGIDA
  async login(loginData: LoginData): Promise<{ usuario: any; token: string; message: string }> {
    try {
      console.log('🔐 Tentando login...', loginData);
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log(`📊 Status do login: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Dados recebidos do login:', data);

      // 🔥 CORREÇÃO: Verificar diferentes estruturas possíveis
      if (!data.success) {
        throw new Error(data.error || 'Login falhou');
      }

      // 🔥 CORREÇÃO: Garantir que temos um token
      const token = data.token || data.accessToken || data.data?.token;
      
      if (!token) {
        console.error('❌ Estrutura de token não encontrada:', data);
        throw new Error('Token não recebido do servidor');
      }

      console.log('✅ Login realizado com sucesso. Token:', token);
      
      // 🔥 CORREÇÃO: Salvar o token
      this.setToken(token);
      
      // 🔥 CORREÇÃO: Verificar se foi salvo
      const savedToken = localStorage.getItem('admin_token');
      console.log('🔍 Token salvo no localStorage:', savedToken);
      
      if (!savedToken) {
        throw new Error('Falha ao salvar token no navegador');
      }

      return {
        usuario: data.usuario || data.user,
        token: token,
        message: data.message || 'Login realizado com sucesso'
      };

    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // 🔥 CORREÇÃO: Limpar token em caso de erro
      this.logout();
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else if (error.message.includes('401') || error.message.includes('Credenciais')) {
          throw new Error('Usuário ou senha incorretos.');
        } else if (error.message.includes('Token não recebido')) {
          throw new Error('Erro de autenticação. Tente novamente.');
        }
      }
      
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  }

  // Cantadas
  async obterCantadasAdmin(page: number = 1, limit: number = 50): Promise<{ 
    cantadas: AdminCantada[]; 
    total: number; 
    page: number; 
    totalPages: number;
  }> {
    return this.fetchAdmin(`/admin/cantadas?page=${page}&limit=${limit}`);
  }

  async adicionarCantada(texto: string, categoria: string = 'dev'): Promise<{ 
    cantada: AdminCantada; 
    message: string;
  }> {
    return this.fetchAdmin('/admin/cantadas', {
      method: 'POST',
      body: JSON.stringify({ texto, categoria })
    });
  }

  async editarCantada(id: number, texto: string, categoria: string, ativa: boolean): Promise<{ 
    cantada: AdminCantada; 
    message: string;
  }> {
    return this.fetchAdmin(`/admin/cantadas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ texto, categoria, ativa })
    });
  }

  async excluirCantada(id: number): Promise<{ 
    message: string;
  }> {
    return this.fetchAdmin(`/admin/cantadas/${id}`, {
      method: 'DELETE'
    });
  }

  // Mensagens
  async obterMensagensAdmin(page: number = 1, limit: number = 50): Promise<{ 
    mensagens: AdminMensagem[]; 
    total: number; 
    page: number; 
    totalPages: number;
  }> {
    return this.fetchAdmin(`/admin/mensagens?page=${page}&limit=${limit}`);
  }

  async excluirMensagem(id: number): Promise<{ 
    message: string;
  }> {
    return this.fetchAdmin(`/admin/mensagens/${id}`, {
      method: 'DELETE'
    });
  }

  // Estatísticas
  async obterEstatisticasAdmin(): Promise<{ 
    estatisticas: AdminEstatisticas;
  }> {
    return this.fetchAdmin('/admin/estatisticas');
  }

  // Health check do serviço admin
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/estatisticas`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
      
      if (response.status === 401) {
        return { status: 'error', message: 'Não autenticado' };
      }
      
      if (!response.ok) {
        return { status: 'error', message: 'Serviço indisponível' };
      }
      
      return { status: 'ok', message: 'Serviço funcionando' };
    } catch (error) {
      return { status: 'error', message: 'Erro de conexão' };
    }
  }
}

export const adminService = new AdminService();