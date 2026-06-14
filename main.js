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
      onLoginClick: () => this.showLoginModal(),
      onAdminProductsClick: () => this.showMyProducts()
    });
  }

  showLoginModal() {
    Pages.renderLoginModal(this.app, {
      onClose: () => this.showCatalog(),
      onLoginSuccess: (data) => {
        // Após login bem-sucedido, ir para Meus Produtos (produtos cadastrados)
        this.showMyProducts();
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
      onCadastroSuccess: (usuarioDados) => {
        console.log('Cadastro bem-sucedido! Abrindo página de login...');
        localStorage.setItem('novoUsuario', JSON.stringify(usuarioDados));
        this.showLoginModal();
      }
    });
  }

  // página de cadastro de produtos
  showAddProductPage() {
    this.currentPage = 'add-product';
    ProdutoCadastro.renderAddProductPage(this.app, {
      onProductAdded: () => this.showMyProducts(),
      onCancel: () => this.showCatalog()
    });
  }

  //  página com meus produtos
  showMyProducts() {
    this.currentPage = 'my-products';
    ProdutoCadastro.renderMyProductsPage(this.app, {
      onAddProduct: () => this.showAddProductPage(),
      onEditProduct: (product) => this.showEditProduct(product),
      onPublishProduct: () => this.showCatalog(), // Após publicar, voltar para catálogo
      onCancel: () => this.showCatalog()
    });
  }

  showEditProduct(product) {
    this.currentPage = 'edit-product';
    ProdutoCadastro.renderEditProductPage(this.app, product, {
      onProductUpdated: () => this.showMyProducts(),
      onCancel: () => this.showMyProducts()
    });
  }
}

// Inicializar app com DOM 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new BeautyShopApp();
  });
} else {
  window.app = new BeautyShopApp();
}