// produtoCadastro.js 

const ProdutoCadastro = {
  // Chaves de armazenamento
  STORAGE_KEY_CADASTRADOS: 'beautyshop_products_cadastrados',
  STORAGE_KEY_PUBLICADOS: 'beautyshop_products_publicados',

  //  produtos cadastrados
  getProdutosCadastrados() {
    const stored = localStorage.getItem(this.STORAGE_KEY_CADASTRADOS);
    return stored ? JSON.parse(stored) : [];
  },

  //  produtos publicados no catálogo
  getProdutosPublicados() {
    const stored = localStorage.getItem(this.STORAGE_KEY_PUBLICADOS);
    return stored ? JSON.parse(stored) : [];
  },

  // Salvar produtos cadastrados
  saveProdutosCadastrados(products) {
    localStorage.setItem(this.STORAGE_KEY_CADASTRADOS, JSON.stringify(products));
  },

  // Salvar produtos publicados
  saveProdutosPublicados(products) {
    localStorage.setItem(this.STORAGE_KEY_PUBLICADOS, JSON.stringify(products));
  },

  // Adicionar novo produto
  addProduct(product) {
    const products = this.getProdutosCadastrados();
    product.id = Date.now();
    product.data_criacao = new Date().toLocaleDateString('pt-BR');
    products.push(product);
    this.saveProdutosCadastrados(products);
    return product;
  },

  // Publicar produto no catálogo
  publishProduct(id) {
    const produtos = this.getProdutosCadastrados();
    const produto = produtos.find(p => p.id === id);
    
    if (produto) {
      const publicados = this.getProdutosPublicados();
      publicados.push({ ...produto, publicado_em: new Date().toLocaleDateString('pt-BR') });
      this.saveProdutosPublicados(publicados);
      return true;
    }
    return false;
  },

  // Editar produto
  updateProduct(id, updatedProduct) {
    let products = this.getProdutosCadastrados();
    products = products.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
    this.saveProdutosCadastrados(products);
  },

  // Deletar produto
  deleteProduct(id) {
    let products = this.getProdutosCadastrados();
    // Remove apenas o primeiro (um de cada vez)
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
    }
    this.saveProdutosCadastrados(products);
  },

  // Deletar apenas 1 produto publicado do catálogo
  deletePublishedProduct(id) {
    let publicados = this.getProdutosPublicados();
    // Remove apenas o primeiro (um de cada vez)
    const index = publicados.findIndex(p => p.id === id);
    if (index !== -1) {
      publicados.splice(index, 1);
    }
    this.saveProdutosPublicados(publicados);
  },

  // Renderizar página de cadastro de produto
  renderAddProductPage(container, callbacks) {
    container.innerHTML = '';
    const page = document.createElement('div');
    page.style.minHeight = '100vh';
    page.style.display = 'flex';
    page.style.flexDirection = 'column';

    //  NAVBAR 
    const navbar = Pages.renderNavbar(container, {
      onLogoClick: () => callbacks.onCancel(),
      onCatalogClick: () => callbacks.onCancel(),
      onCadastroClick: () => callbacks.onCancel(),
      onLoginClick: () => callbacks.onCancel(),
      onAdminProductsClick: () => callbacks.onCancel()
    });
    page.appendChild(navbar);

    // CONTEÚDO 
    const catalogPage = document.createElement('div');
    catalogPage.className = 'catalog-page';

    const catalogContainer = document.createElement('div');
    catalogContainer.className = 'catalog-container';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Cadastrar Novo Produto';
    title.style.marginBottom = '2rem';

    const form = document.createElement('div');
    form.style.maxWidth = '600px';
    form.style.margin = '0 auto';
    form.style.backgroundColor = 'white';
    form.style.padding = '2rem';
    form.style.borderRadius = '8px';
    form.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

    const nomeGroup = document.createElement('div');
    nomeGroup.className = 'form-group';
    const nomeLabel = document.createElement('label');
    nomeLabel.className = 'form-label';
    nomeLabel.textContent = 'Nome do Produto *';
    const nomeInput = document.createElement('input');
    nomeInput.type = 'text';
    nomeInput.className = 'form-input';
    nomeInput.placeholder = 'Ex: Sérum Facial Premium';
    nomeInput.required = true;
    nomeGroup.appendChild(nomeLabel);
    nomeGroup.appendChild(nomeInput);

    const valorGroup = document.createElement('div');
    valorGroup.className = 'form-group';
    const valorLabel = document.createElement('label');
    valorLabel.className = 'form-label';
    valorLabel.textContent = 'Valor (R$) *';
    const valorInput = document.createElement('input');
    valorInput.type = 'number';
    valorInput.className = 'form-input';
    valorInput.placeholder = '89.90';
    valorInput.step = '0.01';
    valorInput.required = true;
    valorGroup.appendChild(valorLabel);
    valorGroup.appendChild(valorInput);

    const descricaoGroup = document.createElement('div');
    descricaoGroup.className = 'form-group';
    const descricaoLabel = document.createElement('label');
    descricaoLabel.className = 'form-label';
    descricaoLabel.textContent = 'Descrição *';
    const descricaoInput = document.createElement('textarea');
    descricaoInput.className = 'form-input';
    descricaoInput.placeholder = 'Descreva as características do produto...';
    descricaoInput.rows = '4';
    descricaoInput.required = true;
    descricaoInput.style.resize = 'vertical';
    descricaoGroup.appendChild(descricaoLabel);
    descricaoGroup.appendChild(descricaoInput);

    const fotoGroup = document.createElement('div');
    fotoGroup.className = 'form-group';
    const fotoLabel = document.createElement('label');
    fotoLabel.className = 'form-label';
    fotoLabel.textContent = 'Foto do Produto *';
    const fotoInput = document.createElement('input');
    fotoInput.type = 'file';
    fotoInput.className = 'form-input';
    fotoInput.accept = 'image/*';
    fotoInput.required = true;
    const fotoPreview = document.createElement('img');
    fotoPreview.style.marginTop = '1rem';
    fotoPreview.style.maxWidth = '200px';
    fotoPreview.style.borderRadius = '6px';
    fotoPreview.style.display = 'none';
    fotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fotoPreview.src = event.target.result;
          fotoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
    fotoGroup.appendChild(fotoLabel);
    fotoGroup.appendChild(fotoInput);
    fotoGroup.appendChild(fotoPreview);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.gap = '1rem';
    buttonsDiv.style.marginTop = '2rem';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-submit';
    submitBtn.textContent = 'Salvar Produto';
    submitBtn.style.flex = '1';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-submit';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.style.flex = '1';
    cancelBtn.style.background = '#6b7280';

    buttonsDiv.appendChild(submitBtn);
    buttonsDiv.appendChild(cancelBtn);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert-message alert-error';
    errorDiv.style.display = 'none';
    errorDiv.style.marginBottom = '1rem';

    const successDiv = document.createElement('div');
    successDiv.className = 'alert-message alert-success';
    successDiv.style.display = 'none';
    successDiv.style.marginBottom = '1rem';

    form.appendChild(errorDiv);
    form.appendChild(successDiv);
    form.appendChild(nomeGroup);
    form.appendChild(valorGroup);
    form.appendChild(descricaoGroup);
    form.appendChild(fotoGroup);
    form.appendChild(buttonsDiv);

    catalogContainer.appendChild(title);
    catalogContainer.appendChild(form);
    catalogPage.appendChild(catalogContainer);
    page.appendChild(catalogPage);

    //  FOOTER 
    const footer = Pages.renderFooter();
    page.appendChild(footer);

    container.appendChild(page);

    submitBtn.addEventListener('click', () => {
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      const nome = nomeInput.value.trim();
      const valor = valorInput.value.trim();
      const descricao = descricaoInput.value.trim();
      const foto = fotoPreview.src;

      if (!nome || !valor || !descricao || !foto) {
        errorDiv.textContent = 'Preencha todos os campos!';
        errorDiv.style.display = 'block';
        return;
      }

      const newProduct = {
        nome,
        preco: parseFloat(valor),
        descricao,
        imagem: foto,
        marca: 'BeautyShop'
      };

      ProdutoCadastro.addProduct(newProduct);
      successDiv.textContent = 'Produto cadastrado com sucesso!';
      successDiv.style.display = 'block';

      nomeInput.value = '';
      valorInput.value = '';
      descricaoInput.value = '';
      fotoInput.value = '';
      fotoPreview.style.display = 'none';

      setTimeout(() => {
        callbacks.onProductAdded();
      }, 1500);
    });

    cancelBtn.addEventListener('click', () => {
      callbacks.onCancel();
    });
  },

  // Renderizar página de meus produtos
  renderMyProductsPage(container, callbacks) {
    container.innerHTML = '';
    const page = document.createElement('div');
    page.style.minHeight = '100vh';
    page.style.display = 'flex';
    page.style.flexDirection = 'column';

    // ===== NAVBAR =====
    const navbar = Pages.renderNavbar(container, {
      onLogoClick: () => callbacks.onCancel(),
      onCatalogClick: () => callbacks.onCancel(),
      onCadastroClick: () => callbacks.onCancel(),
      onLoginClick: () => callbacks.onCancel(),
      onAdminProductsClick: () => callbacks.onCancel()
    });
    page.appendChild(navbar);

    // ===== CONTEÚDO =====
    const catalogPage = document.createElement('div');
    catalogPage.className = 'catalog-page';
    catalogPage.style.flex = '1';

    const catalogContainer = document.createElement('div');
    catalogContainer.className = 'catalog-container';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Meus Produtos';

    const subtitle = document.createElement('p');
    subtitle.className = 'section-subtitle';
    subtitle.textContent = 'Gerencie seus produtos: edite, delete ou publique no catálogo';

    const newProductBtn = document.createElement('button');
    newProductBtn.textContent = 'Novo Produto';
    newProductBtn.className = 'filter-btn active';
    newProductBtn.style.marginBottom = '2rem';
    newProductBtn.addEventListener('click', () => callbacks.onAddProduct());

    catalogContainer.appendChild(title);
    catalogContainer.appendChild(subtitle);
    catalogContainer.appendChild(newProductBtn);

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';

    const products = ProdutoCadastro.getProdutosCadastrados();

    if (products.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-message';
      emptyMsg.style.gridColumn = '1 / -1';
      emptyMsg.textContent = 'Nenhum produto cadastrado. Clique em "Novo Produto" para começar!';
      productsGrid.appendChild(emptyMsg);
    } else {
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-image-container';
        const image = document.createElement('img');
        image.className = 'product-image';
        image.src = product.imagem;
        image.alt = product.nome;
        imageContainer.appendChild(image);

        const info = document.createElement('div');
        info.className = 'product-info';

        const name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = product.nome;

        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = product.descricao;

        const priceContainer = document.createElement('div');
        priceContainer.className = 'product-price-container';
        const price = document.createElement('span');
        price.className = 'product-price';
        price.textContent = `R$ ${parseFloat(product.preco).toFixed(2)}`;
        priceContainer.appendChild(price);

        const date = document.createElement('small');
        date.style.color = '#9ca3af';
        date.style.marginTop = 'auto';
        date.textContent = `Criado em: ${product.data_criacao}`;

        info.appendChild(name);
        info.appendChild(description);
        info.appendChild(priceContainer);
        info.appendChild(date);

        const footer = document.createElement('div');
        footer.className = 'product-footer';
        footer.style.marginTop = '1rem';
        footer.style.display = 'flex';
        footer.style.flexDirection = 'column';
        footer.style.gap = '0.5rem';

        const topButtons = document.createElement('div');
        topButtons.style.display = 'flex';
        topButtons.style.gap = '0.5rem';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-add-cart';
        editBtn.textContent = 'Editar';
        editBtn.style.background = '#3b82f6';
        editBtn.style.flex = '1';
        editBtn.addEventListener('click', () => {
          callbacks.onEditProduct(product);
        });

        topButtons.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-favorite';
        deleteBtn.textContent = 'Deletar';
        deleteBtn.style.background = '#fee2e2';
        deleteBtn.style.color = '#dc2626';
        deleteBtn.style.width = '100%';
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Tem certeza que deseja deletar "${product.nome}"?`)) {
            ProdutoCadastro.deleteProduct(product.id);
            ProdutoCadastro.renderMyProductsPage(container, callbacks);
          }
        });

        footer.appendChild(topButtons);
        footer.appendChild(deleteBtn);
        info.appendChild(footer);

        card.appendChild(imageContainer);
        card.appendChild(info);
        productsGrid.appendChild(card);
      });
    }

    catalogContainer.appendChild(title);
    catalogContainer.appendChild(subtitle);
    catalogContainer.appendChild(newProductBtn);
    catalogContainer.appendChild(productsGrid);

    // Botão Publicar Todos - Embaixo da grid, alinhado à ESQUERDA
    const publishAllBtn = document.createElement('button');
    publishAllBtn.textContent = 'Publicar Todos';
    publishAllBtn.className = 'filter-btn';
    publishAllBtn.style.background = '#10b981';
    publishAllBtn.style.color = 'white';
    publishAllBtn.style.borderColor = '#10b981';
    publishAllBtn.style.marginTop = '2rem';
    publishAllBtn.style.alignSelf = 'flex-start';  // ← ESQUERDA
    publishAllBtn.addEventListener('click', () => {
      const products = ProdutoCadastro.getProdutosCadastrados();
      if (products.length === 0) {
        alert('Nenhum produto para publicar!');
        return;
      }
      if (confirm(`Tem certeza que deseja publicar todos os ${products.length} produtos?`)) {
        products.forEach(product => {
          ProdutoCadastro.publishProduct(product.id);
        });
        alert(`${products.length} produto(s) publicado(s) com sucesso!`);
        if (callbacks.onPublishProduct) {
          callbacks.onPublishProduct();
        }
      }
    });

    catalogContainer.appendChild(publishAllBtn);
    catalogPage.appendChild(catalogContainer);
    page.appendChild(catalogPage);

    // ===== FOOTER =====
    const footerElement = Pages.renderFooter();
    page.appendChild(footerElement);

    container.appendChild(page);
  },

  // Gerenciar produtos publicados no catálogo
  renderGerenciarCatalogo(container, callbacks) {
    container.innerHTML = '';
    const page = document.createElement('div');
    page.style.minHeight = '100vh';
    page.style.display = 'flex';
    page.style.flexDirection = 'column';

    // ===== NAVBAR =====
    const navbar = Pages.renderNavbar(container, {
      onLogoClick: () => callbacks.onCancel(),
      onCatalogClick: () => callbacks.onCancel(),
      onCadastroClick: () => callbacks.onCancel(),
      onLoginClick: () => callbacks.onCancel(),
      onGerenciarCatalogo: () => callbacks.onCancel()
    });
    page.appendChild(navbar);

    // ===== CONTEÚDO =====
    const catalogPage = document.createElement('div');
    catalogPage.className = 'catalog-page';
    catalogPage.style.flex = '1';

    const catalogContainer = document.createElement('div');
    catalogContainer.className = 'catalog-container';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Gerenciar Catálogo';

    const subtitle = document.createElement('p');
    subtitle.className = 'section-subtitle';
    subtitle.textContent = 'Gerencie os produtos publicados no catálogo';

    const voltarBtn = document.createElement('button');
    voltarBtn.textContent = 'Voltar';
    voltarBtn.className = 'filter-btn';
    voltarBtn.style.marginBottom = '2rem';
    voltarBtn.addEventListener('click', () => callbacks.onCancel());

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';

    const publicados = ProdutoCadastro.getProdutosPublicados();

    catalogContainer.appendChild(title);
    catalogContainer.appendChild(subtitle);
    catalogContainer.appendChild(voltarBtn);

    if (publicados.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-message';
      emptyMsg.style.gridColumn = '1 / -1';
      emptyMsg.textContent = 'Nenhum produto publicado no catálogo ainda.';
      productsGrid.appendChild(emptyMsg);
    } else {
      publicados.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-image-container';
        const image = document.createElement('img');
        image.className = 'product-image';
        image.src = product.imagem;
        image.alt = product.nome;
        imageContainer.appendChild(image);

        const info = document.createElement('div');
        info.className = 'product-info';

        const name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = product.nome;

        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = product.descricao;

        const priceContainer = document.createElement('div');
        priceContainer.className = 'product-price-container';
        const price = document.createElement('span');
        price.className = 'product-price';
        price.textContent = `R$ ${parseFloat(product.preco).toFixed(2)}`;
        priceContainer.appendChild(price);

        const status = document.createElement('small');
        status.style.color = '#10b981';
        status.style.marginTop = 'auto';
        status.style.fontWeight = '600';
        status.textContent = `Publicado em: ${product.publicado_em}`;

        info.appendChild(name);
        info.appendChild(description);
        info.appendChild(priceContainer);
        info.appendChild(status);

        const footer = document.createElement('div');
        footer.className = 'product-footer';
        footer.style.marginTop = '1rem';
        footer.style.display = 'flex';
        footer.style.flexDirection = 'column';
        footer.style.gap = '0.5rem';

        const topButtons = document.createElement('div');
        topButtons.style.display = 'flex';
        topButtons.style.gap = '0.5rem';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-add-cart';
        editBtn.textContent = 'Editar';
        editBtn.style.background = '#3b82f6';
        editBtn.style.flex = '1';
        editBtn.addEventListener('click', () => {
          // Editar produto publicado
          if (callbacks.onEditPublishedProduct) {
            callbacks.onEditPublishedProduct(product);
          }
        });

        topButtons.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-favorite';
        deleteBtn.textContent = 'Remover do Catálogo';
        deleteBtn.style.background = '#fee2e2';
        deleteBtn.style.color = '#dc2626';
        deleteBtn.style.width = '100%';
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Tem certeza que deseja remover "${product.nome}" do catálogo?`)) {
            ProdutoCadastro.deletePublishedProduct(product.id);
            ProdutoCadastro.renderGerenciarCatalogo(container, callbacks);
          }
        });

        footer.appendChild(topButtons);
        footer.appendChild(deleteBtn);
        info.appendChild(footer);

        card.appendChild(imageContainer);
        card.appendChild(info);
        productsGrid.appendChild(card);
      });
    }

    catalogContainer.appendChild(productsGrid);
    catalogPage.appendChild(catalogContainer);
    page.appendChild(catalogPage);

    // ===== FOOTER =====
    const footerElement = Pages.renderFooter();
    page.appendChild(footerElement);

    container.appendChild(page);
  },

  // Renderizar página de edição
  renderEditProductPage(container, product, callbacks) {
    container.innerHTML = '';
    const page = document.createElement('div');
    page.style.minHeight = '100vh';
    page.style.display = 'flex';
    page.style.flexDirection = 'column';

    // ===== NAVBAR =====
    const navbar = Pages.renderNavbar(container, {
      onLogoClick: () => callbacks.onCancel(),
      onCatalogClick: () => callbacks.onCancel(),
      onCadastroClick: () => callbacks.onCancel(),
      onLoginClick: () => callbacks.onCancel(),
      onAdminProductsClick: () => callbacks.onCancel()
    });
    page.appendChild(navbar);

    // ===== CONTEÚDO =====
    const catalogPage = document.createElement('div');
    catalogPage.className = 'catalog-page';
    catalogPage.style.flex = '1';

    const catalogContainer = document.createElement('div');
    catalogContainer.className = 'catalog-container';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Editar Produto';
    title.style.marginBottom = '2rem';

    const form = document.createElement('div');
    form.style.maxWidth = '600px';
    form.style.margin = '0 auto';
    form.style.backgroundColor = 'white';
    form.style.padding = '2rem';
    form.style.borderRadius = '8px';
    form.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

    const nomeGroup = document.createElement('div');
    nomeGroup.className = 'form-group';
    const nomeLabel = document.createElement('label');
    nomeLabel.className = 'form-label';
    nomeLabel.textContent = 'Nome do Produto *';
    const nomeInput = document.createElement('input');
    nomeInput.type = 'text';
    nomeInput.className = 'form-input';
    nomeInput.value = product.nome;
    nomeInput.required = true;
    nomeGroup.appendChild(nomeLabel);
    nomeGroup.appendChild(nomeInput);

    const valorGroup = document.createElement('div');
    valorGroup.className = 'form-group';
    const valorLabel = document.createElement('label');
    valorLabel.className = 'form-label';
    valorLabel.textContent = 'Valor (R$) *';
    const valorInput = document.createElement('input');
    valorInput.type = 'number';
    valorInput.className = 'form-input';
    valorInput.value = product.preco;
    valorInput.step = '0.01';
    valorInput.required = true;
    valorGroup.appendChild(valorLabel);
    valorGroup.appendChild(valorInput);

    const descricaoGroup = document.createElement('div');
    descricaoGroup.className = 'form-group';
    const descricaoLabel = document.createElement('label');
    descricaoLabel.className = 'form-label';
    descricaoLabel.textContent = 'Descrição *';
    const descricaoInput = document.createElement('textarea');
    descricaoInput.className = 'form-input';
    descricaoInput.value = product.descricao;
    descricaoInput.rows = '4';
    descricaoInput.required = true;
    descricaoInput.style.resize = 'vertical';
    descricaoGroup.appendChild(descricaoLabel);
    descricaoGroup.appendChild(descricaoInput);

    const fotoGroup = document.createElement('div');
    fotoGroup.className = 'form-group';
    const fotoLabel = document.createElement('label');
    fotoLabel.className = 'form-label';
    fotoLabel.textContent = 'Foto do Produto';
    const fotoInput = document.createElement('input');
    fotoInput.type = 'file';
    fotoInput.className = 'form-input';
    fotoInput.accept = 'image/*';
    const fotoPreview = document.createElement('img');
    fotoPreview.style.marginTop = '1rem';
    fotoPreview.style.maxWidth = '200px';
    fotoPreview.style.borderRadius = '6px';
    fotoPreview.src = product.imagem;
    fotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          fotoPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    fotoGroup.appendChild(fotoLabel);
    fotoGroup.appendChild(fotoInput);
    fotoGroup.appendChild(fotoPreview);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.gap = '1rem';
    buttonsDiv.style.marginTop = '2rem';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-submit';
    submitBtn.textContent = 'Salvar Alterações';
    submitBtn.style.flex = '1';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-submit';
    cancelBtn.textContent = ' Cancelar';
    cancelBtn.style.flex = '1';
    cancelBtn.style.background = '#6b7280';

    buttonsDiv.appendChild(submitBtn);
    buttonsDiv.appendChild(cancelBtn);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert-message alert-error';
    errorDiv.style.display = 'none';
    errorDiv.style.marginBottom = '1rem';

    const successDiv = document.createElement('div');
    successDiv.className = 'alert-message alert-success';
    successDiv.style.display = 'none';
    successDiv.style.marginBottom = '1rem';

    form.appendChild(errorDiv);
    form.appendChild(successDiv);
    form.appendChild(nomeGroup);
    form.appendChild(valorGroup);
    form.appendChild(descricaoGroup);
    form.appendChild(fotoGroup);
    form.appendChild(buttonsDiv);

    catalogContainer.appendChild(title);
    catalogContainer.appendChild(form);
    catalogPage.appendChild(catalogContainer);
    page.appendChild(catalogPage);

    // FOOTER 
    const footer = Pages.renderFooter();
    page.appendChild(footer);

    container.appendChild(page);

    submitBtn.addEventListener('click', () => {
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      const nome = nomeInput.value.trim();
      const valor = valorInput.value.trim();
      const descricao = descricaoInput.value.trim();
      const imagem = fotoPreview.src;

      if (!nome || !valor || !descricao || !imagem) {
        errorDiv.textContent = ' Preencha todos os campos!';
        errorDiv.style.display = 'block';
        return;
      }

      ProdutoCadastro.updateProduct(product.id, {
        nome,
        preco: parseFloat(valor),
        descricao,
        imagem
      });

      successDiv.textContent = 'Produto atualizado com sucesso!';
      successDiv.style.display = 'block';

      setTimeout(() => {
        callbacks.onProductUpdated();
      }, 1500);
    });

    cancelBtn.addEventListener('click', () => {
      callbacks.onCancel();
    });
  }
};