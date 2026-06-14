// api.js 

const API_BASE_URL = 'https://base-back-dwpz.onrender.com';

const API = {
  // Obter todos os produtos
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar produtos');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.produtos || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  // Fazer login simplificado
  async login(email, password) {
    try {
      console.log('Tentando login com:', { email, password });
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro da API:', errorData);
        throw new Error('E-mail ou senha incorretos');
      }

      const data = await response.json();
      console.log('Login bem-sucedido:', data);
      return data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  // Criar cliente/cadastro
  async createClient(clientData) {
    try {
      console.log('Enviando dados do cliente:', clientData);
      
      // Validar dados antes de enviar
      if (!clientData.nome || !clientData.sobrenome || !clientData.endereco) {
        throw new Error('Campos obrigatórios faltando');
      }

      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(clientData)
      });

      console.log('Status da resposta:', response.status);
      const responseText = await response.text();
      console.log('Resposta da API:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Erro ${response.status}: Falha ao cadastrar`);
        } catch (e) {
          throw new Error(`Erro ao cadastrar: ${response.status} ${responseText}`);
        }
      }

      const data = JSON.parse(responseText);
      console.log('Cadastro bem-sucedido:', data);
      return data;
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      throw error;
    }
  }
};