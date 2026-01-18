import Bloco from './bloco.js';

const DISTANCIA_MIN_BLOCO = 150;
const DISTANCIA_MAX_BLOCO = 300;

/**
 * Gerencia todas as entidades do jogo (Mario, Blocos, Plataformas)
 */
export default class EntityManager {
  constructor(canvas, alturaChao, alturaSprite, spriteManager) {
    this.canvas = canvas;
    this.alturaChao = alturaChao;
    this.alturaSprite = alturaSprite;
    this.spriteManager = spriteManager;
    
    this.mario = null;
    this.plataforma = null;
    this.blocos = [];
  }

  /**
   * Inicializa as entidades do jogo
   * @param {Mario} mario - Instância do Mario
   * @param {Plataforma} plataforma - Instância da Plataforma
   */
  inicializar(mario, plataforma) {
    this.mario = mario;
    this.plataforma = plataforma;
    this.criarBlocos();
  }

  /**
   * Cria blocos aleatórios
   */
  criarBlocos() {
    const numBlocos = Math.floor(Math.random() * 3) + 1;
    let posX = this.canvas.width;
    this.blocos = [];

    for (let i = 0; i < numBlocos; i++) {
      const distancia = Math.floor(
        Math.random() * (DISTANCIA_MAX_BLOCO - DISTANCIA_MIN_BLOCO + 1)
      ) + DISTANCIA_MIN_BLOCO;

      this.blocos.push(
        new Bloco(posX, 500, 64, 64, this.spriteManager)
      );
      posX += 64 + distancia;
    }
  }

  /**
   * Atualiza o Mario baseado no input
   * @param {InputManager} inputManager - Gerenciador de input
   * @param {number} chaoY - Posição Y do chão
   */
  atualizarMario(inputManager, chaoY) {
    if (!this.mario) return;

    // Movimento horizontal
    if (inputManager.isPressed('ArrowRight')) {
      this.mario.andando = true;
      this.mario.direcao = 'right';
      this.mario.velocidadeX = 3;
    } else if (inputManager.isPressed('ArrowLeft')) {
      this.mario.andando = true;
      this.mario.direcao = 'left';
      this.mario.velocidadeX = -3;
    } else {
      this.mario.andando = false;
      this.mario.velocidadeX = 0;
    }

    // Pulo
    if (inputManager.isPressed(' ') && this.mario.noChao) {
      this.mario.velocidadeY = this.mario.forcaPulo;
    }

    // Atualizar posição
    this.mario.mover(chaoY, this.plataforma, this.canvas.width);
  }

  /**
   * Atualiza os blocos
   * @param {boolean} pausado - Se o jogo está pausado
   */
  atualizarBlocos(pausado = false) {
    this.blocos.forEach(bloco => {
      if (!pausado) {
        bloco.mover(this.canvas.width);
      }
    });
  }

  /**
   * Desenha todas as entidades
   * @param {Renderer} renderer - Renderizador
   */
  desenhar(renderer) {
    // Desenhar blocos
    this.blocos.forEach(bloco => {
      renderer.desenharEntidade(bloco);
    });

    // Desenhar Mario
    if (this.mario) {
      renderer.desenharEntidade(this.mario);
    }
  }

  /**
   * Reseta posição do Mario
   * @param {number} x - Posição X inicial
   * @param {number} y - Posição Y inicial
   */
  resetarMario(x, y) {
    if (!this.mario) return;

    this.mario.x = x;
    this.mario.y = y;
    this.mario.velocidadeX = 0;
    this.mario.velocidadeY = 0;
  }
}
