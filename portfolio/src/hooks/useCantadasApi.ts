import { useState, useEffect } from 'react';
import { apiService } from '../service/apiService';
import type { Cantada, Estatisticas } from '../service/apiService';

export const useCantadasApi = () => {
  const [cantadas, setCantadas] = useState<string[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({ visitas: 0, totalCantadas: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const cantadasFallback: string[] = [
    "Gata, você é igual código binário... só tem 0 e 1! 💻",
    "Você é like do Instagram? Porque toda vez que te vejo, eu curto! ❤️",
    "Meu amor por você é igual bug no código... inesperado e difícil de resolver! 🐛",
    "Você é o CSS do meu HTML... sem você, minha vida não tem estilo! 🎨",
    "Gata, você é stack overflow? Porque você tem todas as soluções dos meus problemas! 🔍"
  ];

  const inicializar = async () => {
    try {
      setLoading(true);
      setError('');

      // Testar conexão com a API
      await apiService.healthCheck();
      
      // Registrar visita e obter estatísticas
      const stats = await apiService.registrarVisita();
      setEstatisticas(stats);
      
      // Obter cantadas
      const cantadasDB = await apiService.obterCantadas();
      const textosCantadas = cantadasDB.map(c => c.texto);
      
      if (textosCantadas.length > 0) {
        setCantadas(textosCantadas);
      } else {
        throw new Error('Nenhuma cantada encontrada no banco');
      }

    } catch (err) {
      console.error('Erro ao carregar da API:', err);
      setError('Modo offline ativado - usando cantadas locais');
      setEstatisticas({ visitas: 0, totalCantadas: cantadasFallback.length });
      setCantadas(cantadasFallback);
      
      // Fallback para contador local
      const visitasLocal = parseInt(localStorage.getItem('visitasCantadas') || '0') + 1;
      localStorage.setItem('visitasCantadas', visitasLocal.toString());
      setEstatisticas(prev => ({ ...prev, visitas: visitasLocal }));
    } finally {
      setLoading(false);
    }
  };

  const obterCantadaAleatoria = async (): Promise<string> => {
    try {
      if (cantadas.length > 0) {
        // Se já tem cantadas carregadas, usa localmente
        return cantadas[Math.floor(Math.random() * cantadas.length)];
      } else {
        // Se não, busca uma nova da API
        return await apiService.obterCantadaAleatoria();
      }
    } catch (err) {
      // Fallback local
      return cantadasFallback[Math.floor(Math.random() * cantadasFallback.length)];
    }
  };

  useEffect(() => {
    inicializar();
  }, []);

  return {
    cantadas,
    estatisticas,
    loading,
    error,
    obterCantadaAleatoria,
    recarregar: inicializar
  };
};