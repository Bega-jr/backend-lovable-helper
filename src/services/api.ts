const API_BASE_URL = "https://palpiteiro-v2-backend.vercel.app";

export interface ResultadosResponse {
  ultimo_concurso: {
    concurso: number;
    data: string;
    dezenas: number[];
  };
  total_sorteios: number;
  frequencia_numeros: Record<string, number>;
  numeros_quentes: number[];
  numeros_frios: number[];
  historico: Array<{
    concurso: number;
    data: string;
    dezenas: number[];
  }>;
}

export interface PalpitesResponse {
  palpites: number[][];
  numeros_fixos: number[];
  data_geracao: string;
  baseado_em: {
    total_sorteios: number;
    ultimo_concurso: number;
  };
}

export interface AtualizarResponse {
  status: string;
  message: string;
  novos_concursos?: number;
}

class ApiService {
  private async fetchWithTimeout(url: string, timeout = 15000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Tempo limite de conexão excedido');
      }
      throw error;
    }
  }

  async getResultados(): Promise<ResultadosResponse> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/resultados`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }

  async getPalpites(): Promise<PalpitesResponse> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/palpites`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }

  async atualizar(): Promise<AtualizarResponse> {
    const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/atualizar`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }
}

export const apiService = new ApiService();
