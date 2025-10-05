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
    subtotalEl = document.getElementById('subtotal');
    addItemBtn = document.getElementById('addItemBtn');
    resetFormBtn = document.getElementById('resetFormBtn');
    itemsList = document.getElementById('itemsList');
    grandTotalEl = document.getElementById('grandTotal');
    clearBudgetBtn = document.getElementById('clearBudgetBtn');
    saveBudgetBtn = document.getElementById('saveBudgetBtn');
    searchInput = document.getElementById('searchInput');
    savedBudgetsDiv = document.getElementById('savedBudgets');
    clienteEl = document.getElementById('cliente');
    telefoneEl = document.getElementById('telefone');
    dataOrcEl = document.getElementById('dataOrc');
}

function setupEventListeners() {
    // Eventos do formulário principal
    categorySelect.addEventListener('change', renderDynamicFields);
    widthInput.addEventListener('input', updateSubtotalDisplay);
    heightInput.addEventListener('input', updateSubtotalDisplay);
    qtyInput.addEventListener('input', updateSubtotalDisplay);
    addItemBtn.addEventListener('click', addItem);
    resetFormBtn.addEventListener('click', resetForm);
    
    // Eventos do orçamento
    clearBudgetBtn.addEventListener('click', clearBudget);
    saveBudgetBtn.addEventListener('click', saveBudget);
    
    // Eventos de busca
    searchInput.addEventListener('input', searchBudgets);
    document.getElementById('searchBtn').addEventListener('click', searchBudgets);
    
    // Eventos de validação em tempo real
    clienteEl.addEventListener('input', function() {
        if (this.value.trim()) clearError('clienteError');
    });
    telefoneEl.addEventListener('input', function() {
        if (this.value.trim()) clearError('telefoneError');
    });
}

function initializeApp() {
    // Configurar data atual como padrão
    const today = new Date().toISOString().split('T')[0];
    dataOrcEl.value = today;
    
    // Renderizar orçamentos salvos
    renderSavedBudgets();
    
    // Testar conexão com Supabase
    testSupabaseConnection();
}

// =============================================================================
// RENDERIZAÇÃO DOS CAMPOS DINÂMICOS (CORRIGIDO)
// =============================================================================

function renderDynamicFields() {
    const category = categorySelect.value;
    dynamicFields.innerHTML = '';
    
    if (!category) {
        dynamicFields.innerHTML = '<div class="muted">Escolha uma categoria para ver as opções específicas...</div>';
        updateSubtotalDisplay();
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
    
    updateSubtotalDisplay();
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
        updateSubtotalDisplay();
    });
    
    modelGroup.appendChild(modelLabel);
    modelGroup.appendChild(modelSelect);
    dynamicFields.appendChild(modelGroup);
    
    // Grupo da Espessura
    const thicknessGroup = document.createElement('div');
    thicknessGroup.className = 'dynamic-field-group';
    
    const thicknessLabel = document.createElement('label');
    thicknessLabel.textContent = '📏 Espessura';
    const thicknessSelect = document.createElement('select');
    thicknessSelect.id = 'thickSelect';
    thicknessSelect.innerHTML = '<option value="">— Selecione a Espessura —</option>';
    thicknessSelect.addEventListener('change', function() {
        onThicknessChange(category);
        updateSubtotalDisplay();
    });
    
    thicknessGroup.appendChild(thicknessLabel);
    thicknessGroup.appendChild(thicknessSelect);
    dynamicFields.appendChild(thicknessGroup);
    
    // Grupo da Cor
    const colorGroup = document.createElement('div');
    colorGroup.className = 'dynamic-field-group';
    
    const colorLabel = document.createElement('label');
    colorLabel.textContent = '🎨 Cor';
    const colorSelect = document.createElement('select');
    colorSelect.id = 'colorSelect';
    colorSelect.innerHTML = '<option value="">— Selecione a Cor —</option>';
    colorSelect.addEventListener('change', updateSubtotalDisplay);
    
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
        const price = categoryData.options[optionKey].price;
        option.textContent = `${optionKey} (R$ ${price.toFixed(2)}/m²)`;
        select.appendChild(option);
    });
    
    select.addEventListener('change', updateSubtotalDisplay);
    
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
        const price = categoryData.options[optionKey].price;
        option.textContent = `${optionKey} (R$ ${price.toFixed(2)}/m²)`;
        select.appendChild(option);
    });
    
    select.addEventListener('change', updateSubtotalDisplay);
    
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
        const price = categoryData.options[optionKey].price;
        option.textContent = `${optionKey} (R$ ${price.toFixed(2)}/m²)`;
        select.appendChild(option);
    });
    
    select.addEventListener('change', updateSubtotalDisplay);
    
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
        Preço: <strong>R$ ${categoryData.price.toFixed(2)} / m²</strong><br>
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
    thicknessSelect.innerHTML = '<option value="">— Selecione a Espessura —</option>';
    colorSelect.innerHTML = '<option value="">— Selecione a Cor —</option>';
    
    if (!model) return;
    
    const modelData = PRICE_TABLE[category].models[model];
    if (!modelData) return;
    
    // Popular espessuras disponíveis
    Object.keys(modelData.prices).forEach(thickness => {
        const option = document.createElement('option');
        option.value = thickness;
        option.textContent = thickness;
        thicknessSelect.appendChild(option);
    });
}

function onThicknessChange(category) {
    const modelSelect = document.getElementById('modelSelect');
    const thicknessSelect = document.getElementById('thickSelect');
    const colorSelect = document.getElementById('colorSelect');
    
    const model = modelSelect.value;
    const thickness = thicknessSelect.value;
    
    colorSelect.innerHTML = '<option value="">— Selecione a Cor —</option>';
    
    if (!model || !thickness) return;
    
    const prices = PRICE_TABLE[category].models[model].prices;
    const colors = Object.keys(prices[thickness] || {});
    
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });
}

// =============================================================================
// CÁLCULO DE PREÇOS
// =============================================================================

function updateSubtotalDisplay() {
    try {
        const formState = gatherFormState();
        
        if (!formState.category) {
            subtotalEl.textContent = formatCurrency(0);
            addItemBtn.disabled = true;
            return;
        }
        
        const categoryData = PRICE_TABLE[formState.category];
        let canCalculate = true;
        
        // Verificar campos obrigatórios por categoria
        if (categoryData.steps.includes('model')) {
            if (!formState.model || !formState.thickness || !formState.color) {
                canCalculate = false;
            }
        } else if (formState.category === "5") {
            if (!formState.option) canCalculate = false;
        } else if (formState.category === "6") {
            if (!formState.material) canCalculate = false;
        } else if (formState.category === "7") {
            if (!formState.panel_type) canCalculate = false;
        }
        
        if (!canCalculate) {
            subtotalEl.textContent = formatCurrency(0);
            addItemBtn.disabled = true;
            return;
        }
        
        const subtotal = calculateItem(formState);
        subtotalEl.textContent = formatCurrency(subtotal);
        addItemBtn.disabled = false;
        
    } catch (error) {
        console.warn('Erro no cálculo:', error);
        subtotalEl.textContent = formatCurrency(0);
        addItemBtn.disabled = true;
    }
}

function gatherFormState() {
    const category = categorySelect.value;
    const state = {
        category: category,
        quantity: Math.max(1, parseInt(qtyInput.value || 1)),
        width: safeFloat(widthInput.value, 0),
        height: safeFloat(heightInput.value, 0)
    };
    
    if (!category) return state;
    
    const categoryData = PRICE_TABLE[category];
    
    if (categoryData.steps.includes('model')) {
        const modelSelect = document.getElementById('modelSelect');
        const thickSelect = document.getElementById('thickSelect');
        const colorSelect = document.getElementById('colorSelect');
        
        state.model = modelSelect ? modelSelect.value : null;
        state.thickness = thickSelect ? thickSelect.value : null;
        state.color = colorSelect ? colorSelect.value : null;
    } else if (category === "5") {
        const mirrorSelect = document.getElementById('mirrorSelect');
        state.option = mirrorSelect ? mirrorSelect.value : null;
    } else if (category === "6") {
        const boxSelect = document.getElementById('boxSelect');
        state.material = boxSelect ? boxSelect.value : null;
    } else if (category === "7") {
        const panelSelect = document.getElementById('panelSelect');
        state.panel_type = panelSelect ? panelSelect.value : null;
    }
    
    return state;
}

function calculateItem(itemState) {
    const category = itemState.category;
    const width = itemState.width || 0;
    const height = itemState.height || 0;
    const quantity = itemState.quantity || 1;
    
    let area = width * height;
    if (area < 0.25) area = 0.25;
    
    // Espelho (preço por m²)
    if (category === "5") {
        const optionData = PRICE_TABLE[category].options[itemState.option];
        if (!optionData) return 0;
        return optionData.price * area * quantity;
    }
    
    // Box Banheiro (preço por m²)
    if (category === "6") {
        const optionData = PRICE_TABLE[category].options[itemState.material];
        if (!optionData) return 0;
        return optionData.price * area * quantity;
    }
    
    // Painel/Vitrine (preço por m²)
    if (category === "7") {
        const optionData = PRICE_TABLE[category].options[itemState.panel_type];
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
        const modelData = PRICE_TABLE[category].models[itemState.model];
        if (!modelData) return 0;
        
        const pricePerM2 = (modelData.prices[itemState.thickness] || {})[itemState.color] || 0;
        return pricePerM2 * area * quantity;
    }
    
    return 0;
}

// =============================================================================
// CONTINUA NO PRÓXIMO ARQUIVO...
// =============================================================================
// =============================================================================
// GESTÃO DE ITENS DO ORÇAMENTO
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
        if (!formState.model || !formState.thickness || !formState.color) {
            showNotification('Preencha modelo, espessura e cor', 'error');
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
            thickness: formState.thickness,
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
        } else {
            // Adicionando novo item
            currentItems.push(item);
            showNotification('Item adicionado ao orçamento!');
        }
        
        renderItemsList();
        resetItemForm();
        
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        showNotification('Erro ao calcular item: ' + error.message, 'error');
    }
}

function renderItemsList() {
    if (currentItems.length === 0) {
        itemsList.innerHTML = '<div class="muted" style="text-align:center; padding:20px;">📝 Nenhum item adicionado ao orçamento...</div>';
        grandTotalEl.textContent = formatCurrency(0);
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
                        <div style="font-weight: 700; margin-bottom: 5px;">${formatCurrency(item.subtotal)}</div>
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
    
    // Atualizar total geral
    const total = currentItems.reduce((sum, item) => sum + item.subtotal, 0);
    grandTotalEl.textContent = formatCurrency(total);
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
                    if (thickSelect) thickSelect.value = item.thickness;
                    if (thickSelect && item.thickness) {
                        onThicknessChange(item.category);
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
        showNotification('Item removido do orçamento');
    }
}

function resetItemForm() {
    categorySelect.value = '';
    dynamicFields.innerHTML = '<div class="muted">Escolha uma categoria para ver as opções específicas...</div>';
    widthInput.value = '';
    heightInput.value = '';
    qtyInput.value = '1';
    updateSubtotalDisplay();
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
        showNotification('Orçamento limpo');
    }
}

// =============================================================================
// GESTÃO DE ORÇAMENTOS (SALVAR/CARREGAR)
// =============================================================================

async function saveBudget() {
    if (!validateRequiredFields()) {
        showNotification('Preencha o nome e telefone do cliente', 'error');
        return;
    }
    
    if (currentItems.length === 0) {
        showNotification('Adicione pelo menos um item ao orçamento', 'error');
        return;
    }
    
    const client = clienteEl.value.trim();
    const phone = telefoneEl.value.trim();
    const date = dataOrcEl.value || new Date().toISOString().split('T')[0];
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
        let savedToSupabase = false;
        let supabaseError = null;
        
        // Tentar salvar no Supabase
        if (supabase) {
            try {
                console.log('💾 Tentando salvar no Supabase...', budget);
                
                const { data, error } = await supabase
                    .from('budgets')
                    .upsert([budget]);
                
                if (error) {
                    supabaseError = error;
                    throw error;
                }
                
                savedToSupabase = true;
                console.log('✅ Salvo no Supabase:', data);
                
            } catch (supabaseError) {
                console.warn('❌ Erro ao salvar no Supabase:', supabaseError);
                // Continua para salvar localmente mesmo com erro
            }
        }
        
        // Salvar no localStorage (sempre)
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
        
        // Feedback para o usuário
        let message = 'Orçamento salvo com sucesso!';
        if (savedToSupabase) {
            message += ' ✅ (Salvo no banco de dados)';
        } else {
            let errorMsg = '';
            if (supabaseError) {
                errorMsg = ` - Erro: ${supabaseError.message}`;
            }
            message += ` 💾 (Salvo localmente${errorMsg})`;
        }
        
        showNotification(message);
        
        // Limpar para novo orçamento
        currentItems = [];
        editBudgetId = null;
        renderItemsList();
        renderSavedBudgets();
        
        // Limpar formulário (opcional - mantém dados do cliente se quiser)
        // clienteEl.value = '';
        // telefoneEl.value = '';
        // dataOrcEl.value = new Date().toISOString().split('T')[0];
        
    } catch (error) {
        console.error('💥 Erro crítico ao salvar orçamento:', error);
        showNotification('Erro ao salvar orçamento: ' + error.message, 'error');
    }
}

function renderSavedBudgets(query = '') {
    let filteredBudgets = budgets;
    
    if (query) {
        const searchTerm = query.toLowerCase();
        filteredBudgets = budgets.filter(budget => 
            budget.client.toLowerCase().includes(searchTerm) ||
            (budget.phone && budget.phone.includes(searchTerm)) ||
            budget.date.includes(searchTerm)
        );
    }
    
    if (filteredBudgets.length === 0) {
        savedBudgetsDiv.innerHTML = `
            <div class="muted" style="text-align:center; padding:15px;">
                ${query ? '🔍 Nenhum orçamento encontrado' : '💾 Nenhum orçamento salvo localmente...'}
            </div>
        `;
        return;
    }
    
    let html = '<div class="list">';
    filteredBudgets.forEach(budget => {
        const itemCount = budget.items ? budget.items.length : 0;
        html += `
            <div class="budget-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 700;">${budget.client}</div>
                        <div class="muted">📞 ${budget.phone || '—'} • 📅 ${budget.date}</div>
                        <div class="muted" style="font-size: 0.8rem;">
                            ${itemCount} itens • 💰 ${formatCurrency(budget.total)}
                        </div>
                    </div>
                    <div style="display: flex; gap: 4px; flex-direction: column;">
                        <button class="small ghost" onclick="loadBudget('${budget.id}')">📂 Carregar</button>
                        <button class="small" onclick="exportBudgetPDF('${budget.id}')">📄 PDF</button>
                        <button class="small ghost" style="color: #dc2626;" onclick="deleteBudget('${budget.id}')">🗑️ Excluir</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    savedBudgetsDiv.innerHTML = html;
}

function searchBudgets() {
    renderSavedBudgets(searchInput.value);
}

function loadBudget(budgetId) {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
        showNotification('Orçamento não encontrado', 'error');
        return;
    }
    
    if (currentItems.length > 0 && !confirm('Isso substituirá o orçamento atual. Deseja continuar?')) {
        return;
    }
    
    // Carregar dados do cliente
    clienteEl.value = budget.client;
    telefoneEl.value = budget.phone || '';
    dataOrcEl.value = budget.date;
    
    // Carregar itens
    currentItems = [...budget.items];
    editBudgetId = budgetId;
    
    renderItemsList();
    showNotification('Orçamento carregado com sucesso!');
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteBudget(budgetId) {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) {
        return;
    }
    
    budgets = budgets.filter(b => b.id !== budgetId);
    localStorage.setItem('budgets_vidra', JSON.stringify(budgets));
    
    if (editBudgetId === budgetId) {
        editBudgetId = null;
        clienteEl.value = '';
        telefoneEl.value = '';
        dataOrcEl.value = new Date().toISOString().split('T')[0];
    }
    
    renderSavedBudgets();
    showNotification('Orçamento excluído');
}

// =============================================================================
// SISTEMA DE LOGIN E PAINEL ADMIN
// =============================================================================

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (!email || !password) {
        errorEl.textContent = '⚠️ Email e senha são obrigatórios';
        return;
    }
    
    try {
        // Para demonstração - em produção use autenticação real
        if (email === 'admin@vidracaria.com' && password === 'admin123') {
            isLoggedIn = true;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            errorEl.textContent = '';
            
            await viewAllBudgets();
            showNotification('Login realizado com sucesso!');
        } else {
            throw new Error('Credenciais inválidas. Use admin@vidracaria.com / admin123');
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        errorEl.textContent = '❌ ' + error.message;
    }
}

function logout() {
    isLoggedIn = false;
    closeLoginModal();
    showNotification('Logout realizado');
}

async function viewAllBudgets() {
    const allBudgetsList = document.getElementById('allBudgetsList');
    allBudgetsList.innerHTML = '<div class="loading">📡 Buscando orçamentos...</div>';
    
    try {
        let allBudgets = [];
        
        // Buscar do Supabase
        if (supabase) {
            const { data, error } = await supabase
                .from('budgets')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            allBudgets = data || [];
        }
        
        // Combinar com orçamentos locais
        const localBudgets = JSON.parse(localStorage.getItem('budgets_vidra') || '[]');
        allBudgets = [...allBudgets, ...localBudgets];
        
        // Remover duplicatas
        const uniqueBudgets = allBudgets.filter((budget, index, self) =>
            index === self.findIndex(b => b.id === budget.id)
        );
        
        if (uniqueBudgets.length === 0) {
            allBudgetsList.innerHTML = '<div class="muted" style="text-align:center; padding:20px;">📭 Nenhum orçamento encontrado</div>';
            return;
        }
        
        let html = '<div class="list">';
        uniqueBudgets.forEach(budget => {
            const itemCount = budget.items ? budget.items.length : 0;
            const createdDate = budget.created_at ? new Date(budget.created_at).toLocaleDateString('pt-BR') : 'Data não disponível';
            
            html += `
                <div class="budget-item">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                        <div style="flex: 1;">
                            <div style="font-weight: 700;">${budget.client}</div>
                            <div class="muted">📞 ${budget.phone || '—'} • 📅 ${budget.date}</div>
                            <div class="muted" style="font-size: 0.8rem;">
                                ${itemCount} itens • 💰 ${formatCurrency(budget.total)}<br>
                                🕒 Criado em: ${createdDate}
                            </div>
                        </div>
                        <div style="display: flex; gap: 4px; flex-direction: column;">
                            <button class="small ghost" onclick="viewBudgetDetails('${budget.id}')">👁️ Ver</button>
                            <button class="small" onclick="exportBudgetPDF('${budget.id}')">📄 PDF</button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        allBudgetsList.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
        allBudgetsList.innerHTML = `<div class="error">❌ Erro ao carregar: ${error.message}</div>`;
    }
}

function viewBudgetDetails(budgetId) {
    // Buscar em todas as fontes
    let budget = budgets.find(b => b.id === budgetId);
    
    if (!budget && supabase) {
        // Tentar buscar do localStorage também
        const localBudgets = JSON.parse(localStorage.getItem('budgets_vidra') || '[]');
        budget = localBudgets.find(b => b.id === budgetId);
    }
    
    if (!budget) {
        showNotification('Orçamento não encontrado', 'error');
        return;
    }
    
    let details = `CLIENTE: ${budget.client}\n`;
    details += `TELEFONE: ${budget.phone || '—'}\n`;
    details += `DATA: ${budget.date}\n`;
    details += `TOTAL: ${formatCurrency(budget.total)}\n\n`;
    details += `ITENS (${budget.items?.length || 0}):\n\n`;
    
    budget.items?.forEach((item, index) => {
        const categoryName = PRICE_TABLE[item.category]?.name || 'Desconhecido';
        let itemDescription = '';
        
        if (item.category === "5") {
            itemDescription = item.option;
        } else if (item.category === "6") {
            itemDescription = item.material;
        } else if (item.category === "7") {
            itemDescription = item.panel_type;
        } else if (item.category === "8") {
            itemDescription = 'Tela Mosquiteiro';
        } else {
            itemDescription = `${item.model} - ${item.thickness} - ${item.color}`;
        }
        
        const dimensions = `${item.width.toFixed(2)}m × ${item.height.toFixed(2)}m`;
        const area = (item.width * item.height).toFixed(2) + ' m²';
        
        details += `${index + 1}. ${categoryName}\n`;
        details += `   📋 ${itemDescription}\n`;
        details += `   📏 ${dimensions} (${area})\n`;
        details += `   🔢 Quantidade: ${item.quantity}\n`;
        details += `   💰 Subtotal: ${formatCurrency(item.subtotal)}\n\n`;
    });
    
    alert(details);
}

// =============================================================================
// TESTE DE CONEXÃO E EXPORTAÇÃO PDF
// =============================================================================

async function testSupabaseConnection() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('budgets')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            
            const statusElement = document.getElementById('connectionStatus');
            statusElement.textContent = '✅ Conectado ao Banco de Dados';
            statusElement.style.background = '#dcfce7';
            statusElement.style.color = '#166534';
        }
    } catch (error) {
        console.warn('Supabase não conectado:', error);
        const statusElement = document.getElementById('connectionStatus');
        statusElement.textContent = '⚠️ Usando Armazenamento Local';
        statusElement.style.background = '#fef3c7';
        statusElement.style.color = '#92400e';
    }
}

function exportBudgetPDF(budgetId) {
    let budget;
    
    if (budgetId === 'current') {
        if (currentItems.length === 0 || !clienteEl.value.trim()) {
            showNotification('Nenhum orçamento atual para exportar', 'error');
            return;
        }
        budget = {
            client: clienteEl.value.trim(),
            phone: telefoneEl.value.trim(),
            date: dataOrcEl.value || new Date().toISOString().split('T')[0],
            total: currentItems.reduce((sum, item) => sum + item.subtotal, 0),
            items: currentItems
        };
    } else {
        budget = budgets.find(b => b.id === budgetId);
        if (!budget) {
            showNotification('Orçamento não encontrado', 'error');
            return;
        }
    }
    
    // Simular exportação PDF (implementação básica)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(0, 86, 179);
    doc.text('VIDRAÇARIA DA FAMÍLIA', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('ORÇAMENTO', 105, 30, { align: 'center' });
    
    // Dados do cliente
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Cliente: ${budget.client}`, 20, 50);
    doc.text(`Telefone: ${budget.phone || '—'}`, 20, 60);
    doc.text(`Data: ${budget.date}`, 20, 70);
    doc.text(`Total: ${formatCurrency(budget.total)}`, 20, 80);
    
    // Itens
    let y = 100;
    doc.text('ITENS DO ORÇAMENTO:', 20, y);
    y += 10;
    
    budget.items.forEach((item, index) => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        const categoryName = PRICE_TABLE[item.category]?.name || 'Desconhecido';
        let description = '';
        
        if (item.category === "5") description = item.option;
        else if (item.category === "6") description = item.material;
        else if (item.category === "7") description = item.panel_type;
        else if (item.category === "8") description = 'Tela Mosquiteiro';
        else description = `${item.model} - ${item.thickness} - ${item.color}`;
        
        doc.text(`${index + 1}. ${categoryName}`, 25, y);
        doc.text(`   ${description}`, 30, y + 5);
        doc.text(`   ${item.width.toFixed(2)}m × ${item.height.toFixed(2)}m • Qtd: ${item.quantity}`, 30, y + 10);
        doc.text(`   Subtotal: ${formatCurrency(item.subtotal)}`, 30, y + 15);
        
        y += 25;
    });
    
    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Emitido em ' + new Date().toLocaleString('pt-BR'), 20, 280);
    
    // Salvar PDF
    const fileName = `Orcamento_${budget.client.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
    showNotification('PDF gerado com sucesso!');
}

// =============================================================================
// INICIALIZAÇÃO FINAL
// =============================================================================

// Garantir que a inicialização ocorra quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}