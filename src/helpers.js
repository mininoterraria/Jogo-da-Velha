
const tratarNomesJogadores = (nomeJogador1, nomeJogador2) => {
    if(nomeJogador1 === nomeJogador2){
        console.error("O nome dos jogadores não podem ser iguais!");
        return false;
    }

    return true;
}

const validarInputs = (jogadaFileira, jogadaQuadrante) => {
    const regex = /^[1-3]$/;
    const testeRegexFileira = regex.test(jogadaFileira);
    const testeRegexQuadrante = regex.test(jogadaQuadrante);

    if(!testeRegexFileira || !testeRegexQuadrante){
        console.error("Insira apenas números de 1 a 3!");
        return;
    }

    return true;
}

export {tratarNomesJogadores, validarInputs};