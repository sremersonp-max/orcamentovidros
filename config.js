// =============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS - SUAS CHAVES REAIS
// =============================================================================

const SUPABASE_URL = 'https://azpsgdaxkvotkostbusn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cHNnZGF4a3ZvdGtvc3RidXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MjM5NTAsImV4cCI6MjA3NTE5OTk1MH0.wNYlTDj3PGh4q_0Mnv1lTNNYrS_ssoQR2Ovn7WrjyDA';

// Inicializar o cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================================================
// ESTADO GLOBAL DA APLICAÇÃO
// =============================================================================

let currentItems = [];
let budgets = JSON.parse(localStorage.getItem('budgets_vidra')) || [];
let editBudgetId = null;
let editItemIndex = null;
let isLoggedIn = false;

// =============================================================================
// REFERÊNCIAS DO DOM
// =============================================================================

let categorySelect, dynamicFields, widthInput, heightInput, qtyInput;
let addItemBtn, resetFormBtn, itemsList, itemCountEl;
let clearBudgetBtn, viewBudgetBtn, searchInput, savedBudgetsDiv;
let clienteEl, telefoneEl;

// =============================================================================
// FUNÇÕES UTILITÁRIAS
// =============================================================================

function formatCurrency(value) {
    const number = Number(value) || 0;
    return 'R$ ' + number.toFixed(2).replace('.', ',');
}

function safeFloat(value, fallback = 0) {
    const number = parseFloat(value);
    return isNaN(number) ? fallback : number;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.style.display = 'none';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.background = '#059669';
    } else {
        notification.style.background = '#dc2626';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// =============================================================================
// TESTE DE CONEXÃO COM SUPABASE
// =============================================================================

async function testSupabaseConnection() {
    try {
        console.log('🔍 Testando conexão com Supabase...');
        
        // Teste simples - tentar contar registros
        const { count, error } = await supabase
            .from('budgets')
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Erro na conexão:', error);
            throw error;
        }
        
        console.log('✅ Conexão com Supabase estabelecida!');
        
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = '✅ Conectado ao Banco de Dados';
            statusElement.style.background = '#dcfce7';
            statusElement.style.color = '#166534';
        }
        
        return true;
        
    } catch (error) {
        console.warn('⚠️ Supabase não conectado:', error.message);
        
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = '⚠️ Usando Armazenamento Local';
            statusElement.style.background = '#fef3c7';
            statusElement.style.color = '#92400e';
        }
        
        return false;
    }
}

// =============================================================================
// VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
// =============================================================================

function validateRequiredFields() {
    let isValid = true;
    
    if (!clienteEl.value.trim()) {
        showError('clienteError', '⚠️ Nome do cliente é obrigatório');
        isValid = false;
    } else {
        clearError('clienteError');
    }
    
    if (!telefoneEl.value.trim()) {
        showError('telefoneError', '⚠️ Telefone é obrigatório');
        isValid = false;
    } else {
        clearError('telefoneError');
    }
    
    return isValid;
}