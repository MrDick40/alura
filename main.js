// 1. DECLARAÇÃO DE VARIÁVEIS E COMPONENTES DO DOM
const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;

const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?';

const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkboxes = document.querySelectorAll('.checkbox');

// 2. CONFIGURAÇÃO DOS BOTÕES (+ e -)
botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;

// Atualiza a senha automaticamente quando qualquer caixinha for clicada
checkboxes.forEach(checkbox => {
    checkbox.onclick = geraSenha;
});

function diminuiTamanho() {
    if (tamanhoSenha > 1) { // Garante que o tamanho não seja menor que 1
        tamanhoSenha--;
        numeroSenha.textContent = tamanhoSenha;
        geraSenha();
    }
}

function aumentaTamanho() {
    tamanhoSenha++;
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

// 3. FUNÇÃO PRINCIPAL PARA GERAR A SENHA ALEATÓRIA
function geraSenha() {
    let alfabeto = '';
    
    // Constrói o banco de caracteres conforme as marcações
    if (checkboxes[0].checked) alfabeto += letrasMaiusculas;
    if (checkboxes[1].checked) alfabeto += letrasMinusculas;
    if (checkboxes[2].checked) alfabeto += numeros;
    if (checkboxes[3].checked) alfabeto += simbolos;

    // Caso nenhum checkbox esteja marcado, exibe um aviso e limpa o campo
    if (alfabeto.length === 0) {
        campoSenha.value = "Selecione uma opção";
        const valorEntropia = document.querySelector('.entropia');
        valorEntropia.textContent = "0";
        const forcaSenha = document.querySelector('.forca');
        forcaSenha.classList.remove('fraca', 'media', 'forte');
        return;
    }

    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        let numeroAleatorio = Math.random() * alfabeto.length;
        numeroAleatorio = Math.floor(numeroAleatorio);
        senha += alfabeto[numeroAleatorio];
    }
    
    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
}

// 4. FUNÇÃO PARA CALCULAR A ENTROPIA E ALTERAR A INTERFACE
function classificaSenha(tamanhoAlfabeto) {
    // Equação da entropia: Comprimento * log2(Tamanho do Alfabeto)
    let entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    console.log("Entropia atual em bits: " + entropia);

    const forcaSenha = document.querySelector('.forca');
    forcaSenha.classList.remove('fraca', 'media', 'forte');

    // Validação pelas regras de entropia definidas em aula
    if (entropia > 57) {
        forcaSenha.classList.add('forte');
    } else if (entropia > 35 && entropia < 57) {
        forcaSenha.classList.add('media');
    } else if (entropia <= 35) {
        forcaSenha.classList.add('fraca');
    }

    // Exibição do cálculo do tempo estimado em dias
    const valorEntropia = document.querySelector('.entropia');
    let diasParaQuebrar = (2 ** Math.floor(entropia)) / (100e6 * 60 * 60 * 24);
    
    // Formata o número para exibição de forma legível
    if (diasParaQuebrar < 0.01) {
        valorEntropia.textContent = "Imediato";
    } else {
        valorEntropia.textContent = diasParaQuebrar.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    }
}

// Inicializa o programa gerando a primeira senha padrão ao carregar a página
geraSenha();