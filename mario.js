import {MARIO_PARADO, MARIO_RIGHT, MARIO_RIGHT_2, MARIO_LEFT, MARIO_LEFT_2, MARIO_GAME_OVER} from './sprites.js';

export default class Mario {
  constructor(x, y, largura, altura, forcaPulo, gravidade, spriteManager) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.velocidadeX = 0;
    this.velocidadeY = 0;
    this.noChao = false;
    this.andando = false;
    this.direcao = 'right';
    this.frameIndex = 0;
    this.contadorQuadro = 0;
    this.intervaloQuadro = 10;
    this.forcaPulo = forcaPulo;
    this.gravidade = gravidade;
    this.spriteManager = spriteManager;

    // 🔹 Sprite atual do Mario (padrão)
    this.spriteAtual = MARIO_PARADO;

    // 🔹 Lista de sprites para animação
    this.spritesAnimacao = {
      right: [MARIO_RIGHT, MARIO_RIGHT_2],
      left: [MARIO_LEFT, MARIO_LEFT_2],
      parado_right: MARIO_PARADO,
      parado_left: MARIO_PARADO,
      game_over: MARIO_GAME_OVER
    };
  }

  mover(chaoY, plataforma, canvasLargura) {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
    this.velocidadeY += this.gravidade;

    this.noChao = false;

    // Colisão com o chão (ajustado para considerar a altura do sprite)
    if (this.y + this.altura >= chaoY) {
      this.y = chaoY - this.altura;
      this.velocidadeY = 0;
      this.noChao = true;
    }

    // Colisão com a plataforma
    const emCimaDaPlataforma =
      this.x + this.largura > plataforma.x &&
      this.x < plataforma.x + plataforma.largura &&
      this.y + this.altura >= plataforma.y &&
      this.y + this.altura <= plataforma.y + 10 &&
      this.velocidadeY >= 0;

    if (emCimaDaPlataforma) {
      this.y = plataforma.y - this.altura;
      this.velocidadeY = 0;
      this.noChao = true;
    }

    // Impedir sair da tela
    if (this.x < 0) this.x = 0;
    if (this.x > canvasLargura - this.largura)
      this.x = canvasLargura - this.largura;
  }

  desenhar(ctx) {
    let spriteAtualUsado;

    if (this.spriteAtual === MARIO_GAME_OVER) {
      spriteAtualUsado = this.spriteAtual;
    } else if (this.andando) {
      const lista = this.spritesAnimacao[this.direcao];
      spriteAtualUsado = lista[this.frameIndex % lista.length];
      this.contadorQuadro++;
      if (this.contadorQuadro >= this.intervaloQuadro) {
        this.frameIndex++;
        this.contadorQuadro = 0;
      }
    } else {
      spriteAtualUsado = this.spritesAnimacao['parado_' + this.direcao];
      this.frameIndex = 0;
    }

    const img = this.spriteManager.carregarImagem(spriteAtualUsado);
    // CORREÇÃO: Agora desenha na posição correta (y já é o topo do sprite)
    ctx.drawImage(img, this.x, this.y, this.largura, this.altura);
  }

  getRect() {
    return {
      left: this.x,
      right: this.x + this.largura,
      top: this.y,
      bottom: this.y + this.altura,
    };
  }
}