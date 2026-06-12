// main.js - Controle principal da aplicação

class BeautyShopApp {
  constructor() {
    this.app = document.getElementById('app');
    this.currentPage = 'catalog';
    this.init();
  }

  init() {
    this.showCatalog();
  }

  showCatalog() {
    this.currentPage = 'catalog';
    Pages.renderCatalog(this.app, {
      onLogoClick: () => this.showCatalog(),
      onCatalogClick: () => this.showCatalog(),
      onCadastroClick: () => this.showCadastroModal(),
      onLoginClick: () => this.showLoginModal()
    });
  }

  showLoginModal() {
    Pages.renderLoginModal(this.app, {
      onClose: () => this.showCatalog(),
      onLoginSuccess: (data) => {
        // ✅ Após login bem-sucedido, vai direto para os produtos (SEM AVISO)
        this.showCatalog();
      },
      onToggleCadastro: () => {
        this.showCadastroModal();
      }
    });
  }

  showCadastroModal() {
    Pages.renderCadastroModal(this.app, {
      onClose: () => this.showCatalog(),
      onToggleLogin: () => {
        this.showLoginModal();
      },
      // ✅ NOVO: Após cadastro bem-sucedido, abre página de LOGIN
      onCadastroSuccess: (usuarioDados) => {
        console.log('📝 Cadastro bem-sucedido! Abrindo página de login...');
        
        // Salvar dados para pré-preencher o login
        localStorage.setItem('novoUsuario', JSON.stringify(usuarioDados));
        
        // Abrir modal de login (usuário faz login manualmente)
        this.showLoginModal();
      }
    });
  }
}

// Inicializar app quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new BeautyShopApp();
  });
} else {
  window.app = new BeautyShopApp();
}