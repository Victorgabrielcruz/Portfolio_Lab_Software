// Agora o import.meta.env deve funcionar sem erros
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cantadas-api.onrender.com/api';

export interface Cantada {
  id: number;
  texto: string;
  categoria: string;
  ativa: boolean;
  data_criacao: string;
}

export interface Estatisticas {
  visitas: number;
  totalCantadas: number;
}

class ApiService {
  private async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // A API retorna { success: boolean, ... }
      if (data.success === false) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.fetchAPI('/health');
  }

  // Registrar visita e obter estatísticas
  async registrarVisita(): Promise<Estatisticas> {
    const data = await this.fetchAPI<{ visitas: number; totalCantadas: number }>('/visitas', {
      method: 'POST'
    });
    return {
      visitas: data.visitas,
      totalCantadas: data.totalCantadas
    };
  }

  // Obter cantadas
  async obterCantadas(): Promise<Cantada[]> {
    const data = await this.fetchAPI<{ cantadas: Cantada[] }>('/cantadas');
    return data.cantadas || [];
  }

  // Obter cantada aleatória
  async obterCantadaAleatoria(): Promise<string> {
    const data = await this.fetchAPI<{ cantada: string }>('/cantadas/random');
    return data.cantada;
  }

  // Obter apenas estatísticas
  async obterEstatisticas(): Promise<Estatisticas> {
    const data = await this.fetchAPI<{ visitas: number; totalCantadas: number }>('/estatisticas');
    return {
      visitas: data.visitas,
      totalCantadas: data.totalCantadas
    };
  }
}

export const apiService = new ApiService();