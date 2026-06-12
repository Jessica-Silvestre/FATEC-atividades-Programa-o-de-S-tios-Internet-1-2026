// cadastro.js - Lógica de cadastro de clientes

class CadastroCliente {
  constructor(container, onSuccess) {
    this.container = container;
    this.onSuccess = onSuccess;
    this.renderCadastro();
  }

  renderCadastro() {
    this.container.innerHTML = '';

    const cadastroPage = document.createElement('div');
    cadastroPage.className = 'cadastro-page';

    const header = document.createElement('header');
    header.className = 'header';

    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';

    const logo = document.createElement('h1');
    logo.className = 'logo';
    logo.textContent = ' BeautyShop';

    const nav = document.createElement('nav');
    nav.className = 'nav';

    const homeBtn = document.createElement('button');
    homeBtn.className = 'nav-btn';
    homeBtn.textContent = 'Home';

    const catalogBtn = document.createElement('button');
    catalogBtn.className = 'nav-btn';
    catalogBtn.textContent = 'Catálogo';

    const cadastroBtn = document.createElement('button');
    cadastroBtn.className = 'nav-btn active';
    cadastroBtn.textContent = 'Cadastro';

    nav.appendChild(homeBtn);
    nav.appendChild(catalogBtn);
    nav.appendChild(cadastroBtn);

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'nav-btn logout-btn';
    logoutBtn.textContent = 'Sair';

    headerContent.appendChild(logo);
    headerContent.appendChild(nav);
    headerContent.appendChild(logoutBtn);
    header.appendChild(headerContent);

    const cadastroContainer = document.createElement('div');
    cadastroContainer.className = 'cadastro-container';

    const title = document.createElement('h2');
    title.textContent = 'Cadastro de Cliente';

    const nomeLabel = document.createElement('label');
    nomeLabel.textContent = 'Nome *';

    const nomeInput = document.createElement('input');
    nomeInput.type = 'text';
    nomeInput.className = 'form-input';
    nomeInput.placeholder = 'Digite seu nome';
    nomeInput.id = 'cadastro-nome';
    nomeInput.required = true;

    const sobrenomeLabel = document.createElement('label');
    sobrenomeLabel.textContent = 'Sobrenome *';

    const sobrenomeInput = document.createElement('input');
    sobrenomeInput.type = 'text';
    sobrenomeInput.className = 'form-input';
    sobrenomeInput.placeholder = 'Digite seu sobrenome';
    sobrenomeInput.id = 'cadastro-sobrenome';
    sobrenomeInput.required = true;

    const telefoneLabel = document.createElement('label');
    telefoneLabel.textContent = 'Telefone (Opcional)';

    const telefoneInput = document.createElement('input');
    telefoneInput.type = 'tel';
    telefoneInput.className = 'form-input';
    telefoneInput.placeholder = '(11) 9999-9999';
    telefoneInput.id = 'cadastro-telefone';

    const enderecoLabel = document.createElement('label');
    enderecoLabel.textContent = 'Endereço *';

    const enderecoInput = document.createElement('input');
    enderecoInput.type = 'text';
    enderecoInput.className = 'form-input';
    enderecoInput.placeholder = 'Rua, número';
    enderecoInput.id = 'cadastro-endereco';
    enderecoInput.required = true;

    const complementoLabel = document.createElement('label');
    complementoLabel.textContent = 'Complemento do Endereço';

    const complementoInput = document.createElement('input');
    complementoInput.type = 'text';
    complementoInput.className = 'form-input';
    complementoInput.placeholder = 'Apt, Bloco, etc (Opcional)';
    complementoInput.id = 'cadastro-complemento';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = 'Salvar Cadastro';

    const errorDiv = document.createElement('div');
    errorDiv.id = 'cadastro-error';
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';

    const successDiv = document.createElement('div');
    successDiv.id = 'cadastro-success';
    successDiv.className = 'success-message';
    successDiv.style.display = 'none';

    cadastroContainer.appendChild(errorDiv);
    cadastroContainer.appendChild(successDiv);
    cadastroContainer.appendChild(title);
    cadastroContainer.appendChild(nomeLabel);
    cadastroContainer.appendChild(nomeInput);
    cadastroContainer.appendChild(sobrenomeLabel);
    cadastroContainer.appendChild(sobrenomeInput);
    cadastroContainer.appendChild(telefoneLabel);
    cadastroContainer.appendChild(telefoneInput);
    cadastroContainer.appendChild(enderecoLabel);
    cadastroContainer.appendChild(enderecoInput);
    cadastroContainer.appendChild(complementoLabel);
    cadastroContainer.appendChild(complementoInput);
    cadastroContainer.appendChild(submitBtn);

    cadastroPage.appendChild(header);
    cadastroPage.appendChild(cadastroContainer);
    this.container.appendChild(cadastroPage);

    // Event listeners
    homeBtn.addEventListener('click', () => {
      homeBtn.classList.add('active');
      cadastroBtn.classList.remove('active');
      catalogBtn.classList.remove('active');
    });

    catalogBtn.addEventListener('click', () => {
      catalogBtn.classList.add('active');
      homeBtn.classList.remove('active');
      cadastroBtn.classList.remove('active');
      window.app.showCatalog();
    });

    logoutBtn.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja sair?')) {
        window.app.handleLogout();
      }
    });

    submitBtn.addEventListener('click', async () => {
      await this.submitForm(
        nomeInput,
        sobrenomeInput,
        telefoneInput,
        enderecoInput,
        complementoInput,
        submitBtn,
        errorDiv,
        successDiv
      );
    });
  }

  async submitForm(nomeInput, sobrenomeInput, telefoneInput, enderecoInput, complementoInput, submitBtn, errorDiv, successDiv) {
    const nome = nomeInput.value.trim();
    const sobrenome = sobrenomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const complemento = complementoInput.value.trim();

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (!nome || !sobrenome || !endereco) {
      errorDiv.textContent = 'Por favor, preencha os campos obrigatórios (Nome, Sobrenome e Endereço)';
      errorDiv.style.display = 'block';
      return;
    }

    if (nome.length < 2) {
      errorDiv.textContent = 'Nome deve ter pelo menos 2 caracteres';
      errorDiv.style.display = 'block';
      return;
    }

    if (sobrenome.length < 2) {
      errorDiv.textContent = 'Sobrenome deve ter pelo menos 2 caracteres';
      errorDiv.style.display = 'block';
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Salvando...';

      const clientData = {
        nome,
        sobrenome,
        telefone: telefone || null,
        endereco,
        complemento: complemento || null
      };

      const response = await API.createClient(clientData);

      successDiv.textContent = 'Cadastro realizado com sucesso!';
      successDiv.style.display = 'block';

      // Limpar formulário
      nomeInput.value = '';
      sobrenomeInput.value = '';
      telefoneInput.value = '';
      enderecoInput.value = '';
      complementoInput.value = '';

      setTimeout(() => {
        successDiv.style.display = 'none';
      }, 3000);

      if (this.onSuccess) {
        this.onSuccess(response);
      }
    } catch (error) {
      errorDiv.textContent = error.message || 'Erro ao salvar cadastro. Tente novamente.';
      errorDiv.style.display = 'block';
      console.error('Erro no cadastro:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Salvar Cadastro';
    }
  }
}