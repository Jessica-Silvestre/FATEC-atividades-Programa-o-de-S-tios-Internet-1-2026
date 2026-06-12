// api-mock.js - API com produtos reais de beleza
// Usa DummyJSON API (sem problemas de CORS)

const API_REAL = 'https://dummyjson.com/products/category/beauty';

const API = {
  // Obter todos os produtos
  async getProducts() {
    try {
      console.log('🔄 Buscando produtos de beleza da API...');
      
      const response = await fetch(API_REAL);

      if (!response.ok) {
        console.warn('❌ API indisponível');
        throw new Error('API não respondeu');
      }

      const data = await response.json();
      console.log('✅ Produtos carregados:', data.products.length, 'itens');

      // Mapear dados da API para formato do projeto
      const produtos = data.products.map((produto) => ({
        id: produto.id,
        nome: produto.title || 'Produto sem nome',
        descricao: produto.description || 'Produto de beleza',
        preco: parseFloat(produto.price) || 0,
        preco_original: parseFloat(produto.price) * 1.5 || 0,
        desconto: Math.round(produto.discountPercentage) || 0,
        imagem: produto.thumbnail || produto.images?.[0] || 'https://via.placeholder.com/280x250?text=Produto',
        marca: produto.brand || 'Marca'
      }));

      // ✅ RETORNA TODOS OS PRODUTOS (não limita a 50)
      return produtos;
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error.message);
      console.log('📦 Usando produtos de exemplo...');
      return this.getProdutosComFallback();
    }
  },

  // Fallback: produtos de exemplo se API falhar
  getProdutosComFallback() {
    return [
      {
        id: 1,
        nome: "Sérum Facial Premium",
        descricao: "Sérum hidratante com vitamina C e ácido hialurônico",
        preco: 89.90,
        preco_original: 129.90,
        desconto: 30,
        imagem: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
        marca: "BeautyShop"
      },
      {
        id: 2,
        nome: "Paleta de Sombras",
        descricao: "12 cores vibrantes de alta qualidade com pigmentação intensa",
        preco: 79.90,
        preco_original: 99.90,
        desconto: 20,
        imagem: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png",
        marca: "BeautyShop"
      },
      {
        id: 3,
        nome: "Batom Matte",
        descricao: "Batom com acabamento matte, longa duração e cores variadas",
        preco: 34.90,
        preco_original: 49.90,
        desconto: 30,
        imagem: "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png",
        marca: "BeautyShop"
      }
    ];
  },

  // Fazer login
  async login(email, password) {
    try {
      console.log('🔐 Tentando fazer login...');
      
      // Login simulado
      if (email && password && password.length >= 6) {
        return { 
          success: true, 
          message: '✓ Login bem-sucedido!',
          user: {
            email: email,
            nome: email.split('@')[0]
          }
        };
      }
      throw new Error('E-mail ou senha inválidos');
    } catch (error) {
      console.error('❌ Erro no login:', error.message);
      throw error;
    }
  },

  // Criar cliente/cadastro
  async createClient(clientData) {
    try {
      console.log('📝 Cadastrando novo cliente...');
      
      // Validar dados
      if (!clientData.nome || !clientData.sobrenome || !clientData.endereco) {
        throw new Error('Campos obrigatórios faltando');
      }

      // Simular cadastro bem-sucedido
      const newClient = {
        id: Math.random().toString(36).substr(2, 9),
        ...clientData,
        criado_em: new Date().toISOString()
      };

      console.log('✅ Cliente cadastrado:', newClient);
      
      return {
        success: true,
        message: '✓ Cadastro realizado com sucesso!',
        cliente: newClient
      };
    } catch (error) {
      console.error('❌ Erro ao cadastrar:', error.message);
      throw error;
    }
  }
};

console.log('✨ Sistema de API com Fallback Ativado');
console.log('📍 Usando API: https://dummyjson.com/products/category/beauty');