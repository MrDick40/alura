const numeroSenha = document.querySelector('.parametro-senha__texto');
const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkboxes = document.querySelectorAll('.checkbox');
const botaoGerar = document.querySelector('#botao-gerar');
const botaoCopiar = document.querySelector('#botao-copiar');
const avisoCopia = document.querySelector('.aviso-copia');
const statusForca = document.querySelector('.status-forca');

let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;

const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
const numeros = '0123456789';
const simbolos = '!@#$%&*?_-+=';

botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;
botaoGerar.onclick = geraSenha;
botaoCopiar.onclick = copiaSenha;

checkboxes.forEach((checkbox) => {
    checkbox.onclick = geraSenha;
});

function diminuiTamanho() {
    if (tamanhoSenha > 4) {
        tamanhoSenha--;
        atualizaTamanho();
    }
}

function aumentaTamanho() {
    if (tamanhoSenha < 32) {
        tamanhoSenha++;
        atualizaTamanho();
    }
}

function atualizaTamanho() {
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function montaAlfabeto() {
    let alfabeto = '';

    if (checkboxes[0].checked) alfabeto += letrasMaiusculas;
    if (checkboxes[1].checked) alfabeto += letrasMinusculas;
    if (checkboxes[2].checked) alfabeto += numeros;
    if (checkboxes[3].checked) alfabeto += simbolos;

    return alfabeto;
}

function geraSenha() {
    const alfabeto = montaAlfabeto();
    avisoCopia.textContent = '';

    if (alfabeto.length === 0) {
        campoSenha.value = 'Escolha pelo menos uma opção';
        atualizaForca(0);
        return;
    }

    let senha = '';

    for (let i = 0; i < tamanhoSenha; i++) {
        const posicaoAleatoria = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[posicaoAleatoria];
    }

    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
}

function classificaSenha(tamanhoAlfabeto) {
    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    atualizaForca(entropia);

    const valorEntropia = document.querySelector('.entropia');
    const segundosParaQuebrar = (2 ** Math.floor(entropia)) / 100e6;
    const diasParaQuebrar = segundosParaQuebrar / 60 / 60 / 24;

    if (diasParaQuebrar < 0.01) {
        valorEntropia.textContent = 'quase imediato';
    } else if (diasParaQuebrar > 365) {
        const anos = diasParaQuebrar / 365;
        valorEntropia.textContent = `${anos.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} anos`;
    } else {
        valorEntropia.textContent = `${diasParaQuebrar.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} dias`;
    }
}

function atualizaForca(entropia) {
    const forcaSenha = document.querySelector('.forca');
    forcaSenha.classList.remove('fraca', 'media', 'forte');

    if (entropia === 0) {
        statusForca.textContent = 'Sem dados';
        document.querySelector('.entropia').textContent = '0 dias';
        return;
    }

    if (entropia > 57) {
        forcaSenha.classList.add('forte');
        statusForca.textContent = 'Forte';
    } else if (entropia > 35) {
        forcaSenha.classList.add('media');
        statusForca.textContent = 'Média';
    } else {
        forcaSenha.classList.add('fraca');
        statusForca.textContent = 'Fraca';
    }
}

async function copiaSenha() {
    if (!campoSenha.value || campoSenha.value.includes('Escolha')) {
        avisoCopia.textContent = 'Gere uma senha primeiro.';
        return;
    }

    try {
        await navigator.clipboard.writeText(campoSenha.value);
        avisoCopia.textContent = 'Senha copiada.';
    } catch (erro) {
        campoSenha.select();
        document.execCommand('copy');
        avisoCopia.textContent = 'Senha copiada.';
    }
}

geraSenha();
