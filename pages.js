// pages.js - Renderização de páginas

const Pages = {
  // Renderizar navbar
  renderNavbar(container, callbacks) {
  const navbar = document.createElement('nav');
  navbar.className = 'navbar';

  const navbarContainer = document.createElement('div');
  navbarContainer.className = 'navbar-container';

  // Logo
  const logo = document.createElement('a');
  logo.className = 'navbar-logo';
  logo.href = '#';
  

  const logoText = document.createElement('span');
  logoText.className = 'logo-text';
  logoText.innerHTML = `<div style="font-size: 1.5rem; font-weight: 700; line-height: 1; text-align: center;">Beleza</div><div style="font-size: 0.75rem; font-style: italic; text-align: center;">na Fatec</div>`;
  logo.appendChild(logoText);

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    callbacks.onLogoClick();
  });

    // Menu
    const menu = document.createElement('div');
    menu.className = 'navbar-menu';

    const catalogBtn = document.createElement('button');
    catalogBtn.className = 'navbar-menu-item active';
    catalogBtn.textContent = 'Catálogo';
    catalogBtn.addEventListener('click', () => {
      document.querySelectorAll('.navbar-menu-item').forEach(btn => btn.classList.remove('active'));
      catalogBtn.classList.add('active');
      callbacks.onCatalogClick();
    });

    const cadastroBtn = document.createElement('button');
    cadastroBtn.className = 'navbar-menu-item';
    cadastroBtn.textContent = 'Cadastro';
    cadastroBtn.addEventListener('click', () => {
      document.querySelectorAll('.navbar-menu-item').forEach(btn => btn.classList.remove('active'));
      cadastroBtn.classList.add('active');
      callbacks.onCadastroClick();
    });

    menu.appendChild(catalogBtn);
    menu.appendChild(cadastroBtn);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'navbar-actions';

    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn-auth';
    loginBtn.textContent = 'Entrar';
    loginBtn.addEventListener('click', () => callbacks.onLoginClick());

 

    actions.appendChild(loginBtn);
   

    navbarContainer.appendChild(logo);
    navbarContainer.appendChild(menu);
    navbarContainer.appendChild(actions);
    navbar.appendChild(navbarContainer);

    return navbar;
  },

  // Renderizar página de catálogo
  async renderCatalog(container, callbacks) {
    container.innerHTML = '';

    // Navbar
    const navbar = Pages.renderNavbar(container, callbacks);
    container.appendChild(navbar);

    // Hero Section - Com imagem 
    const hero = document.createElement('section');
    hero.className = 'hero';

    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';

    //  IMAGEM CORRIGIDA - Agora aparece corretamente
    const heroImage = document.createElement('img');
    heroImage.src = 'img/imgRealista.png';
    heroImage.alt = 'BeautyShop - Produtos de Beleza';
    heroImage.style.width = '120%';
    heroImage.style.height = 'auto';
    heroImage.style.maxHeight = '300px'; 
    heroImage.style.borderRadius = '8px';
    heroImage.style.display = 'block';
    heroImage.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)'; 
    
    heroContent.appendChild(heroImage);
    hero.appendChild(heroContent);

    container.appendChild(hero);

    // Catalog Page
    const catalogPage = document.createElement('div');
    catalogPage.className = 'catalog-page';

    const catalogContainer = document.createElement('div');
    catalogContainer.className = 'catalog-container';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Nossos Produtos';

    const subtitle = document.createElement('p');
    subtitle.className = 'section-subtitle';
    subtitle.textContent = 'Confira nossa seleção de produtos premium de beleza';

    // ===== FILTROS DE CATEGORIA =====
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filters';

    const categories = [
      { id: 'todos', label: '✨ Todos' },
      { id: 'maquiagem', label: '💄 Maquiagem' },
      { id: 'skincare', label: '🧴 Skincare' },
      { id: 'cabelos', label: '💆 Cabelos' },
      { id: 'perfumes', label: '🌸 Perfumes' }
    ];

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      if (cat.id === 'todos') btn.classList.add('active');
      btn.textContent = cat.label;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Pages.filterProductsByCategory(cat.id);
      });
      filterContainer.appendChild(btn);
    });

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';
    productsGrid.id = 'products-grid';

    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = '⏳ Carregando produtos...';
    productsGrid.appendChild(loading);

    catalogContainer.appendChild(title);
    catalogContainer.appendChild(subtitle);
    catalogContainer.appendChild(filterContainer);
    catalogContainer.appendChild(productsGrid);
    catalogPage.appendChild(catalogContainer);

    container.appendChild(catalogPage);

    // Footer
    const footer = Pages.renderFooter();
    container.appendChild(footer);

    // Carregar produtos
    try {
      const products = await API.getProducts();
      productsGrid.innerHTML = '';

      if (!products || products.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Nenhum produto disponível no momento';
        productsGrid.appendChild(emptyMsg);
        return;
      }

      products.forEach(product => {
        const card = Pages.createProductCard(product);
        productsGrid.appendChild(card);
      });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      productsGrid.innerHTML = '';
      const errorDiv = document.createElement('div');
      errorDiv.className = 'empty-message';
      errorDiv.textContent = '❌ Erro ao carregar produtos. Tente novamente.';
      productsGrid.appendChild(errorDiv);
    }
  },

  // Criar card de produto
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Definir categoria baseada no nome do produto
    let category = 'maquiagem';
    const nome = product.nome?.toLowerCase() || '';
    if (nome.includes('skin') || nome.includes('serum') || nome.includes('creme') || nome.includes('hidrat')) {
      category = 'skincare';
    } else if (nome.includes('cabelo') || nome.includes('shampoo') || nome.includes('condicionador')) {
      category = 'cabelos';
    } else if (nome.includes('perfume') || nome.includes('colônia') || nome.includes('eau')) {
      category = 'perfumes';
    }
    
    card.dataset.category = category;

    // Imagem
    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image-container';

    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = product.imagem || 'https://dummyimage.com/280x250/cccccc/969696.jpg';
    image.alt = product.nome || 'Produto';
    image.onerror = () => {
     // Se falhar, usa fallback:
      image.src = 'https://dummyimage.com/280x250/cccccc/969696.jpg'; 
    };
    imageContainer.appendChild(image);

    // Badge
    if (product.desconto) {
      const badge = document.createElement('div');
      badge.className = 'product-badge';
      badge.textContent = `-${product.desconto}%`;
      imageContainer.appendChild(badge);
    }

    // Info
    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = product.nome || 'Produto';

    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.descricao || 'Descrição não disponível';

    const rating = document.createElement('div');
    rating.className = 'product-rating';
    rating.textContent = '⭐⭐⭐⭐⭐ (128 avaliações)';

    const priceContainer = document.createElement('div');
    priceContainer.className = 'product-price-container';

    if (product.preco_original) {
      const originalPrice = document.createElement('span');
      originalPrice.className = 'product-price-original';
      originalPrice.textContent = `R$ ${product.preco_original.toFixed(2).replace('.', ',')}`;
      priceContainer.appendChild(originalPrice);
    }

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = `R$ ${product.preco.toFixed(2).replace('.', ',')}`;
    priceContainer.appendChild(price);

    const footer = document.createElement('div');
    footer.className = 'product-footer';

    const addCartBtn = document.createElement('button');
    addCartBtn.className = 'btn-add-cart';
    addCartBtn.textContent = '🛒 Adicionar';
    addCartBtn.addEventListener('click', () => {
      alert(`✓ ${product.nome} adicionado ao carrinho!`);
    });

    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'btn-favorite';
    favoriteBtn.textContent = '♡';
    favoriteBtn.addEventListener('click', () => {
      favoriteBtn.textContent = favoriteBtn.textContent === '♡' ? '♥' : '♡';
    });

    footer.appendChild(addCartBtn);
    footer.appendChild(favoriteBtn);

    info.appendChild(name);
    info.appendChild(description);
    info.appendChild(rating);
    info.appendChild(priceContainer);
    info.appendChild(footer);

    card.appendChild(imageContainer);
    card.appendChild(info);

    return card;
  },

  // Login Modal
  renderLoginModal(container, callbacks) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-content';

    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = 'Entrar';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => {
      overlay.remove();
      callbacks.onClose();
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    const form = document.createElement('form');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert-message alert-error';
    errorDiv.style.display = 'none';

    // Email
    const emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';

    const emailLabel = document.createElement('label');
    emailLabel.className = 'form-label';
    emailLabel.textContent = 'E-mail';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-input';
    emailInput.placeholder = 'seu@email.com';
    emailInput.required = true;

    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);

    // Senha
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';

    const passwordLabel = document.createElement('label');
    passwordLabel.className = 'form-label';
    passwordLabel.textContent = 'Senha';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.className = 'form-input';
    passwordInput.placeholder = 'Sua senha';
    passwordInput.required = true;

    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);

    // Submit
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'btn-submit';
    submitBtn.textContent = 'Entrar';

    submitBtn.addEventListener('click', async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      errorDiv.style.display = 'none';

      if (!email || !password) {
        errorDiv.textContent = '❌ Preencha e-mail e senha';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';

        const response = await API.login(email, password);

        if (callbacks.onLoginSuccess) {
          callbacks.onLoginSuccess(response);
        }

        setTimeout(() => {
          overlay.remove();
          callbacks.onClose();
        }, 1500);
      } catch (error) {
        errorDiv.textContent = `❌ ${error.message || 'Erro ao fazer login'}`;
        errorDiv.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
      }
    });

    // Toggle para cadastro
    const toggleDiv = document.createElement('div');
    toggleDiv.className = 'form-toggle';
    const toggleText = document.createTextNode('Não tem conta? ');
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'Cadastre-se';
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.remove();
      callbacks.onToggleCadastro();
    });

    toggleDiv.appendChild(toggleText);
    toggleDiv.appendChild(toggleBtn);

    form.appendChild(errorDiv);
    form.appendChild(header);
    form.appendChild(emailGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitBtn);
    form.appendChild(toggleDiv);

    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  },

  // Cadastro Modal
  renderCadastroModal(container, callbacks) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-content';

    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = 'Cadastro de Cliente';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => {
      overlay.remove();
      callbacks.onClose();
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    const form = document.createElement('form');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert-message alert-error';
    errorDiv.style.display = 'none';
    errorDiv.id = 'cadastro-error';

    const successDiv = document.createElement('div');
    successDiv.className = 'alert-message alert-success';
    successDiv.style.display = 'none';
    successDiv.id = 'cadastro-success';

    // Nome
    const nomeGroup = document.createElement('div');
    nomeGroup.className = 'form-group';

    const nomeLabel = document.createElement('label');
    nomeLabel.className = 'form-label';
    nomeLabel.textContent = 'Nome *';

    const nomeInput = document.createElement('input');
    nomeInput.type = 'text';
    nomeInput.className = 'form-input';
    nomeInput.placeholder = 'Digite seu nome';
    nomeInput.id = 'cadastro-nome';

    nomeGroup.appendChild(nomeLabel);
    nomeGroup.appendChild(nomeInput);

    // Sobrenome
    const sobrenomeGroup = document.createElement('div');
    sobrenomeGroup.className = 'form-group';

    const sobrenomeLabel = document.createElement('label');
    sobrenomeLabel.className = 'form-label';
    sobrenomeLabel.textContent = 'Sobrenome *';

    const sobrenomeInput = document.createElement('input');
    sobrenomeInput.type = 'text';
    sobrenomeInput.className = 'form-input';
    sobrenomeInput.placeholder = 'Digite seu sobrenome';
    sobrenomeInput.id = 'cadastro-sobrenome';

    sobrenomeGroup.appendChild(sobrenomeLabel);
    sobrenomeGroup.appendChild(sobrenomeInput);

    // Email
    const emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';

    const emailLabel = document.createElement('label');
    emailLabel.className = 'form-label';
    emailLabel.textContent = 'E-mail *';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-input';
    emailInput.placeholder = 'seu@email.com';
    emailInput.id = 'cadastro-email';

    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);

    // Senha
    const senhaGroup = document.createElement('div');
    senhaGroup.className = 'form-group';

    const senhaLabel = document.createElement('label');
    senhaLabel.className = 'form-label';
    senhaLabel.textContent = 'Senha *';

    const senhaInput = document.createElement('input');
    senhaInput.type = 'password';
    senhaInput.className = 'form-input';
    senhaInput.placeholder = 'Mínimo 6 caracteres';
    senhaInput.id = 'cadastro-senha';

    senhaGroup.appendChild(senhaLabel);
    senhaGroup.appendChild(senhaInput);

    //  Confirmar Senha
    const confirmaSenhaGroup = document.createElement('div');
    confirmaSenhaGroup.className = 'form-group';

    const confirmaSenhaLabel = document.createElement('label');
    confirmaSenhaLabel.className = 'form-label';
    confirmaSenhaLabel.textContent = 'Confirmar Senha *';

    const confirmaSenhaInput = document.createElement('input');
    confirmaSenhaInput.type = 'password';
    confirmaSenhaInput.className = 'form-input';
    confirmaSenhaInput.placeholder = 'Confirme sua senha';
    confirmaSenhaInput.id = 'cadastro-confirma-senha';

    confirmaSenhaGroup.appendChild(confirmaSenhaLabel);
    confirmaSenhaGroup.appendChild(confirmaSenhaInput);

    //  Validação em tempo real - Campo fica vermelho se senhas forem diferentes
    confirmaSenhaInput.addEventListener('input', () => {
      if (confirmaSenhaInput.value && senhaInput.value !== confirmaSenhaInput.value) {
        confirmaSenhaInput.style.borderColor = '#ef4444';
        confirmaSenhaInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      } else {
        confirmaSenhaInput.style.borderColor = '#e5e7eb';
        confirmaSenhaInput.style.boxShadow = 'none';
      }
    });

    // Telefone
    const teleGroup = document.createElement('div');
    teleGroup.className = 'form-group';

    const teleLabel = document.createElement('label');
    teleLabel.className = 'form-label';
    teleLabel.textContent = 'Telefone (Opcional)';

    const teleInput = document.createElement('input');
    teleInput.type = 'tel';
    teleInput.className = 'form-input';
    teleInput.placeholder = '(11) 99999-9999';
    teleInput.id = 'cadastro-telefone';

    teleGroup.appendChild(teleLabel);
    teleGroup.appendChild(teleInput);

    // Endereço
    const endGroup = document.createElement('div');
    endGroup.className = 'form-group';

    const endLabel = document.createElement('label');
    endLabel.className = 'form-label';
    endLabel.textContent = 'Endereço *';

    const endInput = document.createElement('input');
    endInput.type = 'text';
    endInput.className = 'form-input';
    endInput.placeholder = 'Rua, número, bairro';
    endInput.id = 'cadastro-endereco';

    endGroup.appendChild(endLabel);
    endGroup.appendChild(endInput);

    // Complemento
    const compGroup = document.createElement('div');
    compGroup.className = 'form-group';

    const compLabel = document.createElement('label');
    compLabel.className = 'form-label';
    compLabel.textContent = 'Complemento (Opcional)';

    const compInput = document.createElement('input');
    compInput.type = 'text';
    compInput.className = 'form-input';
    compInput.placeholder = 'Apto, Bloco, etc';
    compInput.id = 'cadastro-complemento';

    compGroup.appendChild(compLabel);
    compGroup.appendChild(compInput);

    // Submit
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'btn-submit';
    submitBtn.textContent = 'Cadastrar';

    submitBtn.addEventListener('click', async () => {
      const nome = nomeInput.value.trim();
      const sobrenome = sobrenomeInput.value.trim();
      const email = emailInput.value.trim();
      const senha = senhaInput.value.trim();                   
      const confirmaSenha = confirmaSenhaInput.value.trim();     
      const telefone = teleInput.value.trim();
      const endereco = endInput.value.trim();
      const complemento = compInput.value.trim();

      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      // ✅ VALIDAÇÃO COMPLETA
      if (!nome || !sobrenome || !email || !senha || !confirmaSenha || !endereco) {
        errorDiv.textContent = '❌ Preencha todos os campos obrigatórios';
        errorDiv.style.display = 'block';
        return;
      }

      // ✅ Validar comprimento da senha
      if (senha.length < 6) {
        errorDiv.textContent = '❌ A senha deve ter no mínimo 6 caracteres';
        errorDiv.style.display = 'block';
        return;
      }

      // ✅ Validar se as senhas são iguais
      if (senha !== confirmaSenha) {
        errorDiv.textContent = '❌ As senhas não conferem! Digite a mesma senha em ambos os campos.';
        errorDiv.style.display = 'block';
        confirmaSenhaInput.style.borderColor = '#ef4444';
        confirmaSenhaInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Cadastrando...';

        const clientData = {
          nome,
          sobrenome,
          email,
          senha,                              
          telefone: telefone || null,
          endereco,
          complemento: complemento || null
        };

        const response = await API.createClient(clientData);

        successDiv.textContent = '✓ Cadastro realizado com sucesso!';
        successDiv.style.display = 'block';

        // ✅ NOVO: Salvar dados do usuário para auto-login
        const usuarioDados = {
          email: email,
          senha: senha,
          nome: nome,
          sobrenome: sobrenome
        };
        localStorage.setItem('novoUsuario', JSON.stringify(usuarioDados));

        // Limpar
        nomeInput.value = '';
        sobrenomeInput.value = '';
        emailInput.value = '';
        senhaInput.value = '';                  
        confirmaSenhaInput.value = '';          
        teleInput.value = '';
        endInput.value = '';
        compInput.value = '';

        setTimeout(() => {
          overlay.remove();
          // ✅ NOVO: Fazer login automático após cadastro
          callbacks.onCadastroSuccess(usuarioDados);
        }, 2000);
      } catch (error) {
        errorDiv.textContent = `❌ ${error.message || 'Erro ao cadastrar'}`;
        errorDiv.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Cadastrar';
      }
    });

    // Toggle para login
    const toggleDiv = document.createElement('div');
    toggleDiv.className = 'form-toggle';
    const toggleText = document.createTextNode('Já tem conta? ');
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'Faça login';
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.remove();
      callbacks.onToggleLogin();
    });

    toggleDiv.appendChild(toggleText);
    toggleDiv.appendChild(toggleBtn);

    form.appendChild(errorDiv);
    form.appendChild(successDiv);
    form.appendChild(header);
    form.appendChild(nomeGroup);
    form.appendChild(sobrenomeGroup);
    form.appendChild(emailGroup);
    form.appendChild(senhaGroup);              
    form.appendChild(confirmaSenhaGroup);      
    form.appendChild(teleGroup);
    form.appendChild(endGroup);
    form.appendChild(compGroup);
    form.appendChild(submitBtn);
    form.appendChild(toggleDiv);

    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  },

  // Footer
  renderFooter() {
    const footer = document.createElement('footer');
    const text = document.createElement('p');
    text.innerHTML = 'FATEC São Roque – Aluna: Jéssica Silvestre de Paula – RA: 2650832513013';
    footer.appendChild(text);
    return footer;
  },

  filterProductsByCategory(categoryId) {
    const grid = document.getElementById('products-grid');
    const cards = grid.querySelectorAll('.product-card');

    cards.forEach(card => {
      const category = card.dataset.category;
      if (categoryId === 'todos' || category === categoryId) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
};