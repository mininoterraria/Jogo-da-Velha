import promptSync from 'prompt-sync'; //Biblioteca de prompt para nodeJs.
import { tratarNomesJogadores, validarInputs} from './helpers.js'; //Função helper para validar os nomes inputados.

const prompt = promptSync();

const gerarTabuleiro = () => { //Função que gera o tabuleiro de jogo da velha.
    const tabuleiro = [];

    for(let fileira = 0; fileira <= 2; fileira++){
        tabuleiro.push([]);

        for(let j = 0; j <= 2; j++){
            tabuleiro[fileira].push(null);
        }

    }
    return tabuleiro;
}

const infoJogadores = () => { //Função que captura os dados dos jogadores.
    let nomeJogador1 = prompt("Jogador 1, insira seu nome: ");
    let nomeJogador2 = prompt("Jogador 2, insira seu nome: ");

    const validacaoNomesJogadores = tratarNomesJogadores(nomeJogador1, nomeJogador2);

    if(!validacaoNomesJogadores){
        return;
    }

    const dadosJogadores = {
        jogador1: {
            nome: nomeJogador1,
            simbolo: 'x',
            jogadas: []
        },

        jogador2: {
            nome: nomeJogador2,
            simbolo: 'o',
            jogadas: []
        }
    }

    return dadosJogadores;
}

const obterJogada =(nomeJogador) => { //Função que obtem a jogada inputada pelo jogador atual.
    const jogadaFileira = prompt(`${nomeJogador}, insira a fileira que deseja marcar: `);
    const jogadaQuadrante = prompt(`Agora, insira o quadrante da fileira ${jogadaFileira}: `);
    const validacao = validarInputs(jogadaFileira, jogadaQuadrante);

    if(!validacao){
        return;
    }

    return {
        fileira: Number(jogadaFileira - 1),
        quadrante: Number(jogadaQuadrante - 1)
    };
}

const validarJogada = (jogadas, tabuleiro) => { //Função verifica se o quadrante está disponível para o jogador atual preencher.
    const marcacaoDesejada = tabuleiro[jogadas.fileira][jogadas.quadrante];

    if(marcacaoDesejada !== null){
        console.log("Quadrante já preenchido, insira em outro lugar!");
        return;
    }

    return true;
}

const atualizarTabuleiro = (dadosJogadores, jogador, jogadas, tabuleiro) => { //Função que insere uma jogada no tabuleiro.
    const simboloJogador = dadosJogadores[jogador]['simbolo'];
    tabuleiro[jogadas.fileira][jogadas.quadrante] = simboloJogador;
    console.table(tabuleiro);
}

const verificarVencedor = (dadosJogadores, jogador) => { //Função que verifica se já tem algum de acordo com as jogadas já feitas na tabela.
    const venceu = combinacoesVitoria(dadosJogadores[jogador]['jogadas']);

    if(venceu){
        const nomeJogador = dadosJogadores[jogador]['nome'];
        console.log(`O vencedor é ${nomeJogador}`);
        return true;
    }

    return;
};

const controleDeEmpate = (tabuleiro) => { //Função que finaliza o jogo em caso de empate, dando ambos como vencedor.
   let quadrantePreenchido = 0; 
   for(const fileira of tabuleiro){
        fileira.forEach((quadrante) => {
            if(quadrante !== null) quadrantePreenchido += 1;
        })  
   }

   if(quadrantePreenchido === 9){
    console.log("Empatou, não houve vencedor!");
    return true;
   }

   return;

}

const jogada = (dadosJogadores, jogador, tabuleiro) => { //Função que controla o fluxo de cada jogada.
    const nomeJogador = dadosJogadores[jogador]['nome'];

    const jogadas = obterJogada(nomeJogador);

    if(!jogadas){
        return;
    }

    const quadranteLivre = validarJogada(jogadas, tabuleiro);

    if(!quadranteLivre){
        return;
    }

    dadosJogadores[jogador]['jogadas'].push([jogadas.fileira, jogadas.quadrante]);

    atualizarTabuleiro(dadosJogadores, jogador, jogadas, tabuleiro);

    const empate = controleDeEmpate(tabuleiro);

    if(empate){
        return 'vencedor';
    }

    const venceu = verificarVencedor(dadosJogadores, jogador);

    if(venceu){
        return 'vencedor';
    }

    return true;

}

const combinacoes = [ //Array de todas as possíveis combinações de vitória que o jogo da velha possui.
        [[0,0],[0,1],[0,2]],
        [[1,0],[1,1],[1,2]],
        [[2,0],[2,1],[2,2]],

        [[0,0],[1,0],[2,0]],
        [[0,1],[1,1],[2,1]],
        [[0,2],[1,2],[2,2]],

        [[0,0],[1,1],[2,2]],
        [[0,2],[1,1],[2,0]]
];

const combinacoesVitoria = (jogadas) => { //Função que contém o algoritmo para conferir se as jogadas feitas pelo jogador batem com uma sequência de vitória no jogo da velha.
  for (const combinacao of combinacoes) {
    const venceu = combinacao.every(posicao =>
      jogadas.some(jogada =>
        jogada[0] === posicao[0] && jogada[1] === posicao[1]
      )
    );
    if (venceu) return true;
  }
  return false;
};

const gameLoop = () => { //Função principal que controla o loop do jogo.
    let dadosJogadores;
    let jogadaJogador1;
    let jogadaJogador2;
    const tabuleiro = gerarTabuleiro();

    do{
        dadosJogadores = infoJogadores();
    }while(typeof dadosJogadores === 'undefined');

    while(true){
        do{
            jogadaJogador1 = jogada(dadosJogadores, 'jogador1', tabuleiro);
        }while(typeof jogadaJogador1 === 'undefined');

        if(jogadaJogador1 === 'vencedor') break;

        do{
            jogadaJogador2 = jogada(dadosJogadores, 'jogador2', tabuleiro);
        }while(typeof jogadaJogador2 === 'undefined' && jogadaJogador2 !== false);

        if(jogadaJogador2 === 'vencedor') break;
        
    }
    
}

gameLoop();




