// =============================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDOMReferences();
    setupEventListeners();
    initializeApp();
});

function initializeDOMReferences() {
    categorySelect = document.getElementById('category');
    dynamicFields = document.getElementById('dynamicFields');
    widthInput = document.getElementById('width');
    heightInput = document.getElementById('height');
    qtyInput = document.getElementById('qty');
    addItemBtn = document.getElementById('addItemBtn');
    resetFormBtn = document.getElementById('resetFormBtn');
    itemsList = document.getElementById('itemsList');
    itemCountEl = document.getElementById('itemCount');
    clearBudgetBtn = document.getElementById('clearBudgetBtn');
    viewBudgetBtn = document.getElementById('viewBudgetBtn');
    searchInput = document.getElementById('searchInput');
    savedBudgetsDiv = document.getElementById('savedBudgets');
    clienteEl = document.getElementById('cliente');
    telefoneEl = document.getElementById('telefone');
}

function setupEventListeners() {
    // Eventos do formulário principal
    categorySelect.addEventListener('change', renderDynamicFields);
    widthInput.addEventListener('input', validateForm);
    heightInput.addEventListener('input', validateForm);
    qtyInput.addEventListener('input', validateForm);
    addItemBtn.addEventListener('click', addItem);
    resetFormBtn.addEventListener('click', resetForm);
    
    // Eventos do orçamento
    clearBudgetBtn.addEventListener('click', clearBudget);
    viewBudgetBtn.addEventListener('click', viewBudget);
    
    // Eventos de busca
    searchInput.addEventListener('input', searchBudgets);
    document.getElementById('searchBtn').addEventListener('click', searchBudgets);
    
    // Eventos de validação em tempo real
    clienteEl.addEventListener('input', function() {
        if (this.value.trim()) clearError('clienteError');
        updateViewBudgetButton();
    });
    telefoneEl.addEventListener('input', function() {
        if (this.value.trim()) clearError('telefoneError');
        updateViewBudgetButton();
    });
}

function initializeApp() {
    // Renderizar orçamentos salvos
    renderSavedBudgets();
    
    // Testar conexão com Supabase
    testSupabaseConnection();
}

// =============================================================================
// RENDERIZAÇÃO DOS CAMPOS DINÂMICOS (CORRIGIDO - ESPESSURA AUTOMÁTICA)
// =============================================================================

function renderDynamicFields() {
    const category = categorySelect.value;
    dynamicFields.innerHTML = '';
    
    if (!category) {
        dynamicFields.innerHTML = '<div class="muted">Escolha uma categoria para ver as opções específicas...</div>';
        validateForm();
        return;
    }
    
    const categoryData = PRICE_TABLE[category];
    
    if (categoryData.steps.includes('model')) {
        createModelBasedFields(category);
    } else if (category === "5") {
        createMirrorFields(category);
    } else if (category === "6") {
        createBoxFields(category);
    } else if (category === "7") {
        createPanelFields(category);
    } else if (category === "8") {
        createMosquitoNetFields(category);
    }
    
    validateForm();
}

function createModelBasedFields(category) {
    const categoryData = PRICE_TABLE[category];
    
    // Grupo do Modelo
    const modelGroup = document.createElement('div');
    modelGroup.className = 'dynamic-field-group';
    
    const modelLabel = document.createElement('label');
    modelLabel.textContent = '📦 Modelo';
    const modelSelect = document.createElement('select');
    modelSelect.id = 'modelSelect';
    modelSelect.innerHTML = '<option value="">— Selecione o Modelo —</option>';
    
    Object.keys(categoryData.models).forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
    
    modelSelect.addEventListener('change', function() {
        onModelChange(category);
        validateForm();
    });
    
    modelGroup.appendChild(modelLabel);
    modelGroup.appendChild(modelSelect);
    dynamicFields.appendChild(modelGroup);
    
    // Grupo da Espessura - APENAS PARA PORTAS (categoria "2") E PAINÉIS (categoria "7")
    if (category === "2" || category === "7") {
        const thicknessGroup = document.createElement('div');
        thicknessGroup.className = 'dynamic-field-group';
        
        const thicknessLabel = document.createElement('label');
        thicknessLabel.textContent = '📏 Espessura';
        const thicknessSelect = document.createElement('select');
        thicknessSelect.id = 'thickSelect';
        thicknessSelect.innerHTML = '<option value="">— Selecione a Espessura —</option>';
        thicknessSelect.addEventListener('change', function() {
            onThicknessChange(category);
            validateForm();
        });
        
        thicknessGroup.appendChild(thicknessLabel);
        thicknessGroup.appendChild(thicknessSelect);
        dynamicFields.appendChild(thicknessGroup);
    }
    
    // Grupo da Cor
    const colorGroup = document.createElement('div');
    colorGroup.className = 'dynamic-field-group';
    
    const colorLabel = document.createElement('label');
    colorLabel.textContent = '🎨 Cor';
    const colorSelect = document.createElement('select');
    colorSelect.id = 'colorSelect';
    colorSelect.innerHTML = '<option value="">— Selecione a Cor —</option>';
    colorSelect.addEventListener('change', validateForm);
    
    colorGroup.appendChild(colorLabel);
    colorGroup.appendChild(colorSelect);
    dynamicFields.appendChild(colorGroup);
}

function createMirrorFields(category) {
    const categoryData = PRICE_TABLE[category];
    
    const group = document.createElement('div');
    group.className = 'dynamic-field-group';
    
    const label = document.createElement('label');
    label.textContent = '🪞 Tipo de Espelho';
    const select = document.createElement('select');
    select.id = 'mirrorSelect';
    select.innerHTML = '<option value="">— Selecione o Tipo —</option>';
    
    Object.keys(categoryData.options).forEach(optionKey => {
        const option = document.createElement('option');
        option.value = optionKey;
        option.textContent = optionKey;
        select.appendChild(option);
    });
    
    select.addEventListener('change', validateForm);
    
    group.appendChild(label);
    group.appendChild(select);
    dynamicFields.appendChild(group);
}

function createBoxFields(category) {
    const categoryData = PRICE_TABLE[category];
    
    const group = document.createElement('div');
    group.className = 'dynamic-field-group';
    
    const label = document.createElement('label');
    label.textContent = '🚿 Material do Box';
    const select = document.createElement('select');
    select.id = 'boxSelect';
    select.innerHTML = '<option value="">— Selecione o Material —</option>';
    
    Object.keys(categoryData.options).forEach(optionKey => {
        const option = document.createElement('option');
        option.value = optionKey;
        option.textContent = optionKey;
        select.appendChild(option);
    });
    
    select.addEventListener('change', validateForm);
    
    group.appendChild(label);
    group.appendChild(select);
    dynamicFields.appendChild(group);
}

function createPanelFields(category) {
    const categoryData = PRICE_TABLE[category];
    
    const group = document.createElement('div');
    group.className = 'dynamic-field-group';
    
    const label = document.createElement('label');
    label.textContent = '🏢 Tipo de Painel';
    const select = document.createElement('select');
    select.id = 'panelSelect';
    select.innerHTML = '<option value="">— Selecione o Tipo —</option>';
    
    Object.keys(categoryData.options).forEach(optionKey => {
        const option = document.createElement('option');
        option.value = optionKey;
        option.textContent = optionKey;
        select.appendChild(option);
    });
    
    select.addEventListener('change', validateForm);
    
    group.appendChild(label);
    group.appendChild(select);
    dynamicFields.appendChild(group);
}

function createMosquitoNetFields(category) {
    const categoryData = PRICE_TABLE[category];
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-box';
    infoDiv.innerHTML = `
        <strong>🦟 Tela Mosquiteiro</strong><br>
        <small>Adicione as medidas para calcular o valor</small>
    `;
    
    dynamicFields.appendChild(infoDiv);
}

function onModelChange(category) {
    const modelSelect = document.getElementById('modelSelect');
    const thicknessSelect = document.getElementById('thickSelect');
    const colorSelect = document.getElementById('colorSelect');
    
    const model = modelSelect.value;
    
    // Limpar selects dependentes
    if (thicknessSelect) {
        thicknessSelect.innerHTML = '<option value="">— Selecione a Espessura —</option>';
    }
    colorSelect.innerHTML = '<option value="">— Selecione a Cor —</option>';
    
    if (!model) return;
    
    const modelData = PRICE_TABLE[category].models[model];
    if (!modelData) return;
    
    // Popular espessuras disponíveis (apenas para portas e painéis)
    if (thicknessSelect && (category === "2" || category === "7")) {
        Object.keys(modelData.prices).forEach(thickness => {
            const option = document.createElement('option');
            option.value = thickness;
            option.textContent = thickness;
            thicknessSelect.appendChild(option);
        });
    }
    
    // Para outras categorias, selecionar automaticamente as cores disponíveis para 8mm
    if (category === "1") { // Janelas - sempre 8mm
        const thickness = "8mm";
        const prices = modelData.prices[thickness] || {};
        const colors = Object.keys(prices);
        
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            colorSelect.appendChild(option);
        });
    }
}

function onThicknessChange(category) {
    const modelSelect = document.getElementById('modelSelect');
    const thicknessSelect = document.getElementById('thickSelect');
    const colorSelect = document.getElementById('colorSelect');
    
    const model = modelSelect.value;
    const thickness = thicknessSelect ? thicknessSelect.value : "8mm"; // Default 8mm para outras categorias
    
    colorSelect.innerHTML = '<option value="">— Selecione a Cor —</option>';
    
    if (!model) return;
    
    const modelData = PRICE_TABLE[category].models[model];
    if (!modelData) return;
    
    // Para portas e painéis, usar a espessura selecionada
    // Para outras categorias, usar sempre 8mm
    const selectedThickness = (category === "2" || category === "7") ? thickness : "8mm";
    
    const prices = modelData.prices[selectedThickness] || {};
    const colors = Object.keys(prices);
    
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });
}

// =============================================================================
// VALIDAÇÃO DO FORMULÁRIO
// =============================================================================

function validateForm() {
    try {
        const formState = gatherFormState();
        
        if (!formState.category) {
            addItemBtn.disabled = true;
            return;
        }
        
        const categoryData = PRICE_TABLE[formState.category];
        let canCalculate = true;
        
        // Verificar campos obrigatórios por categoria
        if (categoryData.steps.includes('model')) {
            if (!formState.model || !formState.color) {
                canCalculate = false;
            }
            // Para portas e painéis, verificar espessura também
            if ((formState.category === "2" || formState.category === "7") && !formState.thickness) {
                canCalculate = false;
            }
        } else if (formState.category === "5") {
            if (!formState.option) canCalculate = false;
        } else if (formState.category === "6") {
            if (!formState.material) canCalculate = false;
        } else if (formState.category === "7") {
            if (!formState.panel_type) canCalculate = false;
        }
        
        if (!canCalculate || !formState.width || !formState.height) {
            addItemBtn.disabled = true;
            return;
        }
        
        addItemBtn.disabled = false;
        
    } catch (error) {
        console.warn('Erro na validação:', error);
        addItemBtn.disabled = true;
    }
}

function updateViewBudgetButton() {
    viewBudgetBtn.disabled = !(currentItems.length > 0 && clienteEl.value.trim() && telefoneEl.value.trim());
}

// =============================================================================
// GESTÃO DE ITENS DO ORÇAMENTO (COM ESCOLHA APÓS ADICIONAR)
// =============================================================================

function addItem() {
    if (!validateRequiredFields()) {
        showNotification('Preencha o nome e telefone do cliente antes de adicionar itens', 'error');
        return;
    }
    
    const formState = gatherFormState();
    
    if (!formState.category) {
        showNotification('Selecione uma categoria', 'error');
        return;
    }
    
    // Validar campos específicos da categoria
    const categoryData = PRICE_TABLE[formState.category];
    if (categoryData.steps.includes('model')) {
        if (!formState.model || !formState.color) {
            showNotification('Preencha modelo e cor', 'error');
            return;
        }
        // Para portas e painéis, verificar espessura também
        if ((formState.category === "2" || formState.category === "7") && !formState.thickness) {
            showNotification('Selecione a espessura', 'error');
            return;
        }
    } else if (formState.category === "5" && !formState.option) {
        showNotification('Selecione o tipo de espelho', 'error');
        return;
    } else if (formState.category === "6" && !formState.material) {
        showNotification('Selecione o material do box', 'error');
        return;
    } else if (formState.category === "7" && !formState.panel_type) {
        showNotification('Selecione o tipo de painel', 'error');
        return;
    }
    
    // Validar medidas
    if (!formState.width || !formState.height) {
        showNotification('Informe largura e altura', 'error');
        return;
    }
    
    try {
        const subtotal = calculateItem(formState);
        
        const item = {
            category: formState.category,
            model: formState.model,
            thickness: formState.thickness || "8mm", // Default 8mm para categorias sem espessura
            color: formState.color,
            option: formState.option,
            material: formState.material,
            panel_type: formState.panel_type,
            width: formState.width,
            height: formState.height,
            quantity: formState.quantity,
            subtotal: subtotal,
            id: Date.now() + Math.random().toString(36).substr(2, 9)
        };
        
        if (editItemIndex !== null) {
            // Editando item existente
            currentItems[editItemIndex] = item;
            editItemIndex = null;
            addItemBtn.textContent = '➕ Adicionar Item';
            showNotification('Item atualizado com sucesso!');
            
            renderItemsList();
            resetItemForm();
            updateViewBudgetButton();
        } else {
            // Adicionando novo item
            currentItems.push(item);
            
            renderItemsList();
            resetItemForm();
            updateViewBudgetButton();
            
            // Perguntar se deseja adicionar mais itens ou ver o orçamento
            askNextAction();
        }
        
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        showNotification('Erro ao calcular item: ' + error.message, 'error');
    }
}

// FUNÇÃO PARA PERGUNTAR PRÓXIMA AÇÃO APÓS ADICIONAR ITEM
function askNextAction() {
    const action = confirm('✅ Item adicionado com sucesso!\n\nDeseja adicionar mais itens?\n\n• Clique em "OK" para adicionar outro item\n• Clique em "Cancelar" para gerar o PDF do orçamento');
    
    if (action) {
        // Usuário quer adicionar mais itens - manter formulário limpo para novo item
        showNotification('📝 Continue adicionando itens...');
    } else {
        // Usuário quer ver o orçamento - gerar PDF
        if (currentItems.length > 0 && clienteEl.value.trim() && telefoneEl.value.trim()) {
            viewBudget();
        } else {
            showNotification('Preencha todos os dados do cliente antes de gerar o PDF', 'error');
        }
    }
}

function renderItemsList() {
    if (currentItems.length === 0) {
        itemsList.innerHTML = '<div class="muted" style="text-align:center; padding:20px;">📝 Nenhum item adicionado ao orçamento...</div>';
        itemCountEl.textContent = '0';
        return;
    }
    
    let html = '';
    currentItems.forEach((item, index) => {
        const categoryName = PRICE_TABLE[item.category].name;
        let description = '';
        
        if (item.category === "5") {
            description = item.option;
        } else if (item.category === "6") {
            description = item.material;
        } else if (item.category === "7") {
            description = item.panel_type;
        } else if (item.category === "8") {
            description = 'Tela Mosquiteiro';
        } else {
            description = `${item.model} - ${item.thickness} - ${item.color}`;
        }
        
        const dimensions = `${item.width.toFixed(2)}m × ${item.height.toFixed(2)}m`;
        const area = (item.width * item.height).toFixed(2) + ' m²';
        
        html += `
            <div class="budget-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: var(--accent);">${categoryName}</div>
                        <div class="muted">${description}</div>
                        <div class="muted" style="font-size: 0.8rem;">
                            ${dimensions} • ${area} • Qtd: ${item.quantity}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="display: flex; gap: 5px;">
                            <button class="small ghost" onclick="editItem(${index})">✏️ Editar</button>
                            <button class="small ghost" style="color: #dc2626;" onclick="removeItem(${index})">🗑️ Remover</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    itemsList.innerHTML = html;
    itemCountEl.textContent = currentItems.length.toString();
}

function editItem(index) {
    const item = currentItems[index];
    
    // Preencher formulário com dados do item
    categorySelect.value = item.category;
    renderDynamicFields();
    
    // Usar setTimeout para garantir que os campos dinâmicos foram renderizados
    setTimeout(() => {
        if (item.category === "1" || item.category === "2") {
            const modelSelect = document.getElementById('modelSelect');
            const thickSelect = document.getElementById('thickSelect');
            const colorSelect = document.getElementById('colorSelect');
            
            if (modelSelect) modelSelect.value = item.model;
            if (modelSelect && item.model) {
                onModelChange(item.category);
                setTimeout(() => {
                    if (thickSelect && (item.category === "2" || item.category === "7")) {
                        thickSelect.value = item.thickness;
                    }
                    if (thickSelect && item.thickness && (item.category === "2" || item.category === "7")) {
                        onThicknessChange(item.category);
                        setTimeout(() => {
                            if (colorSelect) colorSelect.value = item.color;
                        }, 50);
                    } else {
                        // Para categorias sem espessura, selecionar cor diretamente
                        setTimeout(() => {
                            if (colorSelect) colorSelect.value = item.color;
                        }, 50);
                    }
                }, 50);
            }
        } else if (item.category === "5") {
            const mirrorSelect = document.getElementById('mirrorSelect');
            if (mirrorSelect) mirrorSelect.value = item.option;
        } else if (item.category === "6") {
            const boxSelect = document.getElementById('boxSelect');
            if (boxSelect) boxSelect.value = item.material;
        } else if (item.category === "7") {
            const panelSelect = document.getElementById('panelSelect');
            if (panelSelect) panelSelect.value = item.panel_type;
        }
        
        widthInput.value = item.width;
        heightInput.value = item.height;
        qtyInput.value = item.quantity;
        
        editItemIndex = index;
        addItemBtn.textContent = '💾 Atualizar Item';
        
        // Scroll para o formulário
        document.getElementById('formCard').scrollIntoView({ behavior: 'smooth' });
        
    }, 100);
}

function removeItem(index) {
    if (confirm('Tem certeza que deseja remover este item do orçamento?')) {
        currentItems.splice(index, 1);
        renderItemsList();
        updateViewBudgetButton();
        showNotification('Item removido do orçamento');
    }
}

function resetItemForm() {
    categorySelect.value = '';
    dynamicFields.innerHTML = '<div class="muted">Escolha uma categoria para ver as opções específicas...</div>';
    widthInput.value = '';
    heightInput.value = '';
    qtyInput.value = '1';
    validateForm();
}

function resetForm() {
    resetItemForm();
    editItemIndex = null;
    addItemBtn.textContent = '➕ Adicionar Item';
}

function clearBudget() {
    if (currentItems.length === 0) return;
    
    if (confirm('Tem certeza que deseja limpar todos os itens do orçamento atual?')) {
        currentItems = [];
        renderItemsList();
        updateViewBudgetButton();
        showNotification('Orçamento limpo');
    }
}

// =============================================================================
// VISUALIZAR E SALVAR ORÇAMENTO (SALVA EM AMBOS - LOCAL E BANCO)
// =============================================================================

function viewBudget() {
    if (!validateRequiredFields()) {
        showNotification('Preencha o nome e telefone do cliente', 'error');
        return;
    }
    
    if (currentItems.length === 0) {
        showNotification('Adicione pelo menos um item ao orçamento', 'error');
        return;
    }
    
    // Gerar PDF primeiro
    exportBudgetPDF('current');
    
    // Depois salvar automaticamente (local e banco) SEM AVISO
    saveBudgetSilently();
}

// FUNÇÃO DE SALVAMENTO SILENCIOSO (SEM AVISOS)
async function saveBudgetSilently() {
    const client = clienteEl.value.trim();
    const phone = telefoneEl.value.trim();
    const date = new Date().toISOString().split('T')[0]; // Data atual do sistema
    const total = currentItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    const budget = {
        id: editBudgetId || 'budget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        client: client,
        phone: phone,
        date: date,
        total: total,
        items: JSON.parse(JSON.stringify(currentItems)), // Deep clone para evitar referências
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    try {
        // SALVAR NO BANCO DE DADOS (SUPABASE)
        if (supabase) {
            try {
                await supabase
                    .from('budgets')
                    .upsert([budget]);
            } catch (error) {
                console.warn('⚠️ Erro ao salvar no Supabase:', error);
            }
        }
        
        // SALVAR LOCALMENTE (LOCALSTORAGE)
        try {
            if (editBudgetId) {
                const index = budgets.findIndex(b => b.id === editBudgetId);
                if (index !== -1) {
                    budgets[index] = budget;
                } else {
                    budgets.push(budget);
                }
            } else {
                budgets.push(budget);
            }
            
            localStorage.setItem('budgets_vidra', JSON.stringify(budgets));
        } catch (localError) {
            console.warn('⚠️ Erro ao salvar localmente:', localError);
        }
        
        // Limpar formulário SEM mostrar aviso
        clearBudget();
        clienteEl.value = '';
        telefoneEl.value = '';
        editBudgetId = null;
        
        // Atualizar lista de orçamentos salvos
        renderSavedBudgets();
        
    } catch (error) {
        console.error('❌ Erro ao salvar orçamento:', error);
        // Não mostrar erro para o usuário também
    }
}

// =============================================================================
// BUSCA E RENDERIZAÇÃO DE ORÇAMENTOS SALVOS (LOCAIS)
// =============================================================================

function searchBudgets() {
    renderSavedBudgets();
}

function renderSavedBudgets() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let filteredBudgets = [...budgets];
    
    if (searchTerm) {
        filteredBudgets = budgets.filter(budget => 
            budget.client.toLowerCase().includes(searchTerm) ||
            budget.phone.includes(searchTerm) ||
            budget.date.includes(searchTerm)
        );
    }
    
    if (filteredBudgets.length === 0) {
        savedBudgetsDiv.innerHTML = `
            <div class="muted" style="text-align:center; padding:15px;">
                ${searchTerm ? '🔍 Nenhum orçamento encontrado...' : '💾 Nenhum orçamento salvo localmente...'}
            </div>
        `;
        return;
    }
    
    // Ordenar por data (mais recente primeiro)
    filteredBudgets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    let html = '';
    filteredBudgets.forEach(budget => {
        const itemCount = budget.items ? budget.items.length : 0;
        
        html += `
            <div class="budget-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: var(--accent);">${budget.client}</div>
                        <div class="muted">📞 ${budget.phone} • 📅 ${budget.date}</div>
                        <div class="muted" style="font-size: 0.8rem;">
                            ${itemCount} item(s) • 💰 Valor total calculado no PDF
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="display: flex; gap: 5px; flex-direction: column;">
                            <button class="small ghost" onclick="exportBudgetPDF('${budget.id}')">👁️ Ver PDF</button>
                            <button class="small ghost" onclick="loadBudget('${budget.id}')">📝 Continuar</button>
                            <button class="small ghost" style="color: #dc2626;" onclick="deleteBudget('${budget.id}')">🗑️ Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    savedBudgetsDiv.innerHTML = html;
}

function loadBudget(budgetId) {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
        showNotification('Orçamento não encontrado', 'error');
        return;
    }
    
    // Preencher dados do cliente
    clienteEl.value = budget.client;
    telefoneEl.value = budget.phone;
    
    // Carregar itens
    currentItems = JSON.parse(JSON.stringify(budget.items)); // Deep clone
    editBudgetId = budgetId;
    
    // Renderizar itens
    renderItemsList();
    updateViewBudgetButton();
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showNotification('Orçamento carregado! Você pode editar os itens.');
}

function deleteBudget(budgetId) {
    if (!confirm('Tem certeza que deseja excluir este orçamento permanentemente?')) {
        return;
    }
    
    try {
        // Remover do localStorage
        budgets = budgets.filter(b => b.id !== budgetId);
        localStorage.setItem('budgets_vidra', JSON.stringify(budgets));
        
        // Tentar remover do Supabase também
        if (supabase) {
            supabase
                .from('budgets')
                .delete()
                .eq('id', budgetId)
                .then(({ error }) => {
                    if (error) {
                        console.warn('⚠️ Erro ao excluir do Supabase:', error);
                    }
                });
        }
        
        // Atualizar interface
        renderSavedBudgets();
        showNotification('Orçamento excluído com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao excluir orçamento:', error);
        showNotification('Erro ao excluir orçamento', 'error');
    }
}

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

function gatherFormState() {
    const category = categorySelect.value;
    const width = safeFloat(widthInput.value);
    const height = safeFloat(heightInput.value);
    const quantity = parseInt(qtyInput.value) || 1;
    
    const formState = {
        category: category,
        width: width,
        height: height,
        quantity: quantity
    };
    
    if (category === "1" || category === "2") {
        const modelSelect = document.getElementById('modelSelect');
        const thickSelect = document.getElementById('thickSelect');
        const colorSelect = document.getElementById('colorSelect');
        
        formState.model = modelSelect ? modelSelect.value : '';
        // Para janelas (categoria "1"), usar sempre 8mm
        // Para portas (categoria "2"), usar a espessura selecionada
        formState.thickness = (category === "1") ? "8mm" : (thickSelect ? thickSelect.value : '');
        formState.color = colorSelect ? colorSelect.value : '';
    } else if (category === "5") {
        const mirrorSelect = document.getElementById('mirrorSelect');
        formState.option = mirrorSelect ? mirrorSelect.value : '';
    } else if (category === "6") {
        const boxSelect = document.getElementById('boxSelect');
        formState.material = boxSelect ? boxSelect.value : '';
    } else if (category === "7") {
        const panelSelect = document.getElementById('panelSelect');
        const thickSelect = document.getElementById('thickSelect');
        formState.panel_type = panelSelect ? panelSelect.value : '';
        formState.thickness = thickSelect ? thickSelect.value : '';
    }
    
    return formState;
}

function calculateItem(formState) {
    const category = formState.category;
    const width = formState.width || 0;
    const height = formState.height || 0;
    const quantity = formState.quantity || 1;
    
    let area = width * height;
    if (area < 0.25) area = 0.25;
    
    // Espelho (preço por m²)
    if (category === "5") {
        const optionData = PRICE_TABLE[category].options[formState.option];
        if (!optionData) return 0;
        return optionData.price * area * quantity;
    }
    
    // Box Banheiro (preço por m²)
    if (category === "6") {
        const optionData = PRICE_TABLE[category].options[formState.material];
        if (!optionData) return 0;
        return optionData.price * area * quantity;
    }
    
    // Painel/Vitrine (preço por m²)
    if (category === "7") {
        const optionData = PRICE_TABLE[category].options[formState.panel_type];
        if (!optionData) return 0;
        return optionData.price * area * quantity;
    }
    
    // Tela Mosquiteiro (preço por m²)
    if (category === "8") {
        const price = PRICE_TABLE[category].price;
        return price * area * quantity;
    }
    
    // Janelas e Portas (preço por m² baseado em modelo/espessura/cor)
    if (category === "1" || category === "2") {
        const modelData = PRICE_TABLE[category].models[formState.model];
        if (!modelData) return 0;
        
        // Para janelas, usar sempre 8mm
        // Para portas, usar a espessura selecionada
        const thickness = (category === "1") ? "8mm" : formState.thickness;
        
        const pricePerM2 = (modelData.prices[thickness] || {})[formState.color] || 0;
        return pricePerM2 * area * quantity;
    }
    
    return 0;
}

// =============================================================================
// EXPORTAÇÃO PARA PDF (MODIFICADA COM RODAPÉ DA EMPRESA)
// =============================================================================

// NOVA FUNÇÃO PARA EXPORTAR PDF A PARTIR DE DADOS
function exportBudgetPDFFromData(budget) {
    if (!budget) {
        showNotification('Nenhum orçamento para exportar', 'error');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações do documento
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);
        
        // Cabeçalho
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('VIDRAÇARIA DA FAMÍLIA', pageWidth / 2, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema de Orçamentos - Orçamento Gerado em ' + new Date().toLocaleDateString('pt-BR'), pageWidth / 2, 22, { align: 'center' });
        
        // Informações do cliente
        let yPosition = 45;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('DADOS DO CLIENTE', margin, yPosition);
        
        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nome: ${budget.client}`, margin, yPosition);
        doc.text(`Telefone: ${budget.phone}`, margin + 80, yPosition);
        doc.text(`Data: ${budget.date}`, margin + 150, yPosition);
        
        // Itens do orçamento
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ITENS DO ORÇAMENTO', margin, yPosition);
        
        yPosition += 8;
        
        // Cabeçalho da tabela
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPosition, contentWidth, 8, 'F');
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('Item', margin + 2, yPosition + 5);
        doc.text('Descrição', margin + 40, yPosition + 5);
        doc.text('Medidas', margin + 100, yPosition + 5);
        doc.text('Área', margin + 130, yPosition + 5);
        doc.text('Qtd', margin + 150, yPosition + 5);
        doc.text('Valor', margin + 170, yPosition + 5);
        
        yPosition += 8;
        
        // Itens
        budget.items.forEach((item, index) => {
            // Verificar se precisa de nova página
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
                
                // Recriar cabeçalho da tabela na nova página
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, yPosition, contentWidth, 8, 'F');
                
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
                doc.text('Item', margin + 2, yPosition + 5);
                doc.text('Descrição', margin + 40, yPosition + 5);
                doc.text('Medidas', margin + 100, yPosition + 5);
                doc.text('Área', margin + 130, yPosition + 5);
                doc.text('Qtd', margin + 150, yPosition + 5);
                doc.text('Valor', margin + 170, yPosition + 5);
                
                yPosition += 15;
            }
            
            const categoryName = PRICE_TABLE[item.category]?.name || 'Desconhecido';
            let description = '';
            
            if (item.category === "5") {
                description = item.option;
            } else if (item.category === "6") {
                description = item.material;
            } else if (item.category === "7") {
                description = item.panel_type;
            } else if (item.category === "8") {
                description = 'Tela Mosquiteiro';
            } else {
                description = `${item.model} - ${item.thickness} - ${item.color}`;
            }
            
            const dimensions = `${item.width.toFixed(2)}m × ${item.height.toFixed(2)}m`;
            const area = (item.width * item.height).toFixed(2) + ' m²';
            const quantity = item.quantity.toString();
            const subtotal = formatCurrency(item.subtotal);
            
            doc.setFontSize(8);
            doc.text((index + 1).toString(), margin + 2, yPosition + 4);
            doc.text(categoryName, margin + 12, yPosition + 4);
            doc.text(description, margin + 40, yPosition + 4);
            doc.text(dimensions, margin + 100, yPosition + 4);
            doc.text(area, margin + 130, yPosition + 4);
            doc.text(quantity, margin + 150, yPosition + 4);
            doc.text(subtotal, margin + 170, yPosition + 4);
            
            yPosition += 6;
        });
        
        // Total
        yPosition += 10;
        doc.setFillColor(220, 237, 200);
        doc.rect(margin, yPosition, contentWidth, 10, 'F');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 100, 0);
        doc.text('VALOR TOTAL DO ORÇAMENTO:', margin + 2, yPosition + 7);
        doc.text(formatCurrency(budget.total), margin + 150, yPosition + 7);
        
        // =============================================================================
        // RODAPÉ COM DADOS DA EMPRESA
        // =============================================================================
        
        yPosition += 20;
        
        // Linha separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        
        yPosition += 10;
        
        // Dados da empresa
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('VIDRAÇARIA DA FAMÍLIA', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 5;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        
        // Endereço
        doc.text(' Rua Elias Calixto, 699 - Centro - Ipiranga/PR', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;
        
        // Contatos
        doc.text('(42) 99960-8330 •  sremersonp@gmail.com', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;
        
        // Horário de funcionamento
        doc.text(' Segunda a Sexta: 8h às 18h', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;
        
        // Especialidades
        doc.text(' Especializada em Vidros, Espelhos, Box, Portas e Janelas', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 6;
        
        // Observações finais
        doc.setFontSize(7);
        doc.text('• Orçamento válido por 15 dias • Preços sujeitos a alteração sem aviso prévio', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 3;
        doc.text('• Instalação não incluída • Medidas sujeitas a confirmação técnica no local', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 3;
        doc.text('• Formas de pagamento: À vista (5% desconto) ou parcelado', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 8;
        
        // Agradecimento final
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Agradecemos pela preferência! Estamos à disposição para esclarecer dúvidas.', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 4;
        
        // Data de geração
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const now = new Date();
        doc.text(`Orçamento gerado em ${now.toLocaleString('pt-BR')} - Vidraçaria da Família © ${now.getFullYear()}`, pageWidth / 2, yPosition, { align: 'center' });
        
        // Salvar PDF
        const fileName = `orcamento_${budget.client.replace(/\s+/g, '_')}_${budget.date}.pdf`;
        doc.save(fileName);
        
        showNotification('📄 PDF gerado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao gerar PDF:', error);
        showNotification('❌ Erro ao gerar PDF: ' + error.message, 'error');
    }
}

// ATUALIZAR A FUNÇÃO EXISTENTE exportBudgetPDF PARA USAR A NOVA FUNÇÃO
function exportBudgetPDF(budgetId) {
    if (budgetId === 'current') {
        // Orçamento atual
        const total = currentItems.reduce((sum, item) => sum + item.subtotal, 0);
        const budget = {
            client: clienteEl.value.trim(),
            phone: telefoneEl.value.trim(),
            date: new Date().toISOString().split('T')[0],
            total: total,
            items: currentItems
        };
        exportBudgetPDFFromData(budget);
    } else {
        // Orçamento salvo - usar a nova função que busca em ambos os locais
        downloadBudgetPDF(budgetId);
    }
}

// =============================================================================
// ADMINISTRAÇÃO (MODAL DE LOGIN) - CORRIGIDO PARA PDF
// =============================================================================

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (!email || !password) {
        errorDiv.textContent = 'Preencha email e senha';
        return;
    }
    
    // Aqui você implementaria a lógica de autenticação real
    // Por enquanto, vamos usar uma verificação simples para demonstração
    if (email === 'admin@vidracaria.com' && password === 'admin123') {
        isLoggedIn = true;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        errorDiv.textContent = '';
        showNotification('✅ Login realizado com sucesso!');
        
        // Carregar orçamentos automaticamente após login
        await viewAllBudgets();
    } else {
        errorDiv.textContent = 'Credenciais inválidas';
    }
}

function logout() {
    isLoggedIn = false;
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('allBudgetsList').innerHTML = '<div class="loading">Clique em "Atualizar Lista" para carregar os orçamentos...</div>';
    closeLoginModal();
    showNotification('👋 Logout realizado');
}

async function viewAllBudgets() {
    if (!isLoggedIn) return;
    
    const listDiv = document.getElementById('allBudgetsList');
    listDiv.innerHTML = '<div class="loading">🔄 Carregando orçamentos do banco de dados...</div>';
    
    try {
        const { data: supabaseBudgets, error } = await supabase
            .from('budgets')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        // Combinar orçamentos do Supabase com os locais
        const allBudgets = [...(supabaseBudgets || []), ...budgets];
        
        // Remover duplicatas (priorizando Supabase)
        const uniqueBudgets = allBudgets.filter((budget, index, self) =>
            index === self.findIndex(b => b.id === budget.id)
        );
        
        if (uniqueBudgets.length === 0) {
            listDiv.innerHTML = '<div class="muted" style="text-align:center; padding:20px;">📭 Nenhum orçamento encontrado...</div>';
            return;
        }
        
        let html = '';
        uniqueBudgets.forEach(budget => {
            const itemCount = budget.items ? budget.items.length : 0;
            const createdDate = new Date(budget.created_at).toLocaleDateString('pt-BR');
            const source = budget.id.startsWith('budget_') ? '🌐 Banco de Dados' : '💾 Local';
            
            html += `
                <div class="budget-item" style="margin-bottom:10px; padding:10px; border:1px solid #e6eef8; border-radius:8px;">
                    <div style="font-weight:700; color:var(--accent);">${budget.client}</div>
                    <div class="muted">📞 ${budget.phone} • 📅 ${budget.date} • ${source}</div>
                    <div class="muted" style="font-size:0.8rem;">
                        ${itemCount} item(s) • 💰 ${formatCurrency(budget.total)} • 🕒 ${createdDate}
                    </div>
                    <div style="margin-top:8px; display:flex;gap:5px;">
                        <button class="small ghost" onclick="downloadBudgetPDF('${budget.id}')">📄 Ver PDF</button>
                        <button class="small ghost" style="color:#dc2626;" onclick="deleteBudgetAdmin('${budget.id}')">🗑️ Excluir</button>
                    </div>
                </div>
            `;
        });
        
        listDiv.innerHTML = html;
        
    } catch (error) {
        console.error('❌ Erro ao carregar orçamentos:', error);
        listDiv.innerHTML = `<div class="error" style="text-align:center; padding:10px;">❌ Erro ao carregar orçamentos: ${error.message}</div>`;
    }
}

// FUNÇÃO CORRIGIDA PARA BAIXAR PDF DO BANCO DE DADOS
async function downloadBudgetPDF(budgetId) {
    try {
        let budget;
        
        // Primeiro tenta buscar no banco de dados
        if (supabase) {
            const { data: supabaseData, error } = await supabase
                .from('budgets')
                .select('*')
                .eq('id', budgetId)
                .single();
            
            if (!error && supabaseData) {
                budget = supabaseData;
            }
        }
        
        // Se não encontrou no banco, busca localmente
        if (!budget) {
            budget = budgets.find(b => b.id === budgetId);
        }
        
        if (!budget) {
            showNotification('❌ Orçamento não encontrado', 'error');
            return;
        }
        
        // Usar a função existente de exportação de PDF
        exportBudgetPDFFromData(budget);
        
    } catch (error) {
        console.error('❌ Erro ao baixar orçamento:', error);
        showNotification('❌ Erro ao baixar orçamento: ' + error.message, 'error');
    }
}

async function deleteBudgetAdmin(budgetId) {
    if (!confirm('Tem certeza que deseja excluir permanentemente este orçamento?')) {
        return;
    }
    
    try {
        let deletedFromSupabase = false;
        let deletedFromLocal = false;
        
        // Tentar excluir do Supabase
        if (supabase) {
            const { error } = await supabase
                .from('budgets')
                .delete()
                .eq('id', budgetId);
            
            if (!error) {
                deletedFromSupabase = true;
            }
        }
        
        // Excluir localmente
        const initialLength = budgets.length;
        budgets = budgets.filter(b => b.id !== budgetId);
        if (budgets.length < initialLength) {
            localStorage.setItem('budgets_vidra', JSON.stringify(budgets));
            deletedFromLocal = true;
        }
        
        showNotification('✅ Orçamento excluído com sucesso');
        await viewAllBudgets(); // Recarregar a lista
        
    } catch (error) {
        console.error('❌ Erro ao excluir orçamento:', error);
        showNotification('❌ Erro ao excluir orçamento: ' + error.message, 'error');
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}