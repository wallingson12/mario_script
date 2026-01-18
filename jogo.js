import Sprites, {
  CHAO,
  COIN,
  MARIO_GAME_OVER,
  MARIO_PARADO,
  MARIO_RIGHT,
  MARIO_RIGHT_2,
  MARIO_LEFT,
  MARIO_LEFT_2
} from './sprites.js';
import Plataforma from './plataforma.js';
import Mario from './mario.js';

// Imports das novas classes de responsabilidade única
import GameState from './GameState.js';
import Renderer from './Renderer.js';
import HUD from './HUD.js';
import InputManager from './InputManager.js';
import CollisionDetector from './CollisionDetector.js';
import AudioManager from './AudioManager.js';
import CSSAnimationManager from './CSSAnimationManager.js';
import AssetLoader from './AssetLoader.js';
import EntityManager from './EntityManager.js';

/**
 * Classe principal do jogo - Orquestrador
 * Responsável apenas por coordenar os sistemas do jogo
 */
class Jogo {
  constructor() {
    // ===== Canvas =====
    this.canvas = document.getElementById('tela');
    this.ctx = this.canvas.getContext('2d');

    // ===== Sprites =====
    this.spriteManager = new Sprites();

    // ===== Parâmetros do jogo =====
    this.larguraSprite = 64 * 1.5;
    this.alturaSprite = 64 * 1.5;
    this.alturaChao = 50;
    this.gravidade = 0.5;
    this.forcaPulo = -14;
    this.chaoY = this.canvas.height - this.alturaChao;

    // ===== Inicializar gerenciadores =====
    this.gameState = new GameState();
    this.renderer = new Renderer(this.canvas, this.ctx);
    this.hud = new HUD(this.ctx, this.canvas);
    this.inputManager = new InputManager();
    this.collisionDetector = new CollisionDetector();
    this.audioManager = new AudioManager();
    
    // Elementos HTML animados
    const elementosCano = document.querySelectorAll('.cano');
    const elementosNuvem = document.querySelectorAll('.cloud');
    this.cssAnimations = new CSSAnimationManager(elementosCano, elementosNuvem);
    
    // Asset loader
    this.assetLoader = new AssetLoader(this.spriteManager);
    
    // Entity manager
    this.entityManager = new EntityManager(
      this.canvas,
      this.alturaChao,
      this.alturaSprite,
      this.spriteManager
    );

    // ===== Criar entidades =====
    this.plataforma = new Plataforma(500, 500, 64, 64);
    this.mario = new Mario(
      50,
      this.chaoY - this.alturaSprite,
      this.larguraSprite,
      this.alturaSprite,
      this.forcaPulo,
      this.gravidade,
      this.spriteManager
    );
    
    this.entityManager.inicializar(this.mario, this.plataforma);

    // ===== Configurar callbacks de input =====
    this._setupInputCallbacks();

    // ===== Bind do loop =====
    this.loop = this.loop.bind(this);

    // ===== Preload imagens e iniciar jogo =====
    this.assetLoader.preloadImagens([
      MARIO_PARADO, MARIO_RIGHT, MARIO_RIGHT_2,
      MARIO_LEFT, MARIO_LEFT_2, MARIO_GAME_OVER,
      COIN, CHAO
    ]).then(() => {
      this.chaoImg = this.assetLoader.getImagem(CHAO);
      this.cssAnimations.iniciarPulseCanos();
      this.hud.iniciarPiscar();
      requestAnimationFrame(this.loop);
    });
  }

  // ================================
  // Configuração de Input
  // ================================
  _setupInputCallbacks() {
    this.inputManager.onEnter(() => {
      if (this.gameState.gameOver) {
        location.reload();
      } else if (this.gameState.aguardandoReinicioVida) {
        this._reiniciarVida();
      }
    });
  }

  // ================================
  // Loop principal do jogo
  // ================================
  loop() {
    this.renderer.limpar();

    if (this.gameState.gameOver) {
      this._renderizarCenario();
      this._renderizarGameOver();
      return;
    }

    // Atualizar jogo se não estiver aguardando reinício
    if (!this.gameState.aguardandoReinicioVida) {
      this._atualizarJogo();
    }

    // Renderizar
    this._renderizarJogo();

    requestAnimationFrame(this.loop);
  }

  // ================================
  // Atualização do jogo
  // ================================
  _atualizarJogo() {
    // Atualizar Mario com base no input
    this.entityManager.atualizarMario(this.inputManager, this.chaoY);

    // Atualizar blocos
    this.entityManager.atualizarBlocos(false);

    // Checar colisões
    this._checarColisoes();
  }

  // ================================
  // Detecção de colisões
  // ================================
  _checarColisoes() {
    const marioRect = this.mario.getRect();

    // Colisão com canos
    const elementosCano = document.querySelectorAll('.cano');
    elementosCano.forEach(cano => {
      if (!this.gameState.aguardandoReinicioVida) {
        if (this.collisionDetector.checarColisaoMarioCano(marioRect, cano, this.canvas)) {
          if (!this.gameState.morreu) {
            this._perderVida();
          }
        }
      }
    });

    // Colisão com blocos (coletar moedas)
    if (!this.gameState.aguardandoReinicioVida) {
      const blocosColididos = this.collisionDetector.checarColisaoMarioBlocos(
        marioRect,
        this.entityManager.blocos
      );

      blocosColididos.forEach(bloco => {
        if (!bloco.coletado) {
          this.gameState.coletarMoeda(10);
          this.audioManager.tocarColetar();
          bloco.coletado = true;
        }
      });
    }
  }

  // ================================
  // Lógica de perda de vida
  // ================================
  _perderVida() {
    this.gameState.morreu = true;
    this.mario.spriteAtual = MARIO_GAME_OVER;

    const isGameOver = this.gameState.perderVida();

    if (isGameOver) {
      this.audioManager.tocarGameOver();
      this.cssAnimations.pause();
    } else {
      this.audioManager.tocarMorte();
      this.cssAnimations.pause();
    }
  }

  // ================================
  // Reiniciar vida
  // ================================
  _reiniciarVida() {
    this.gameState.resetarVida();

    // Resetar posição do Mario
    this.entityManager.resetarMario(50, this.chaoY - this.alturaSprite);
    this.mario.spriteAtual = MARIO_PARADO;

    // Recriar blocos
    this.entityManager.criarBlocos();

    // Retomar animações
    this.cssAnimations.resume();
    this.cssAnimations.reset();
  }

  // ================================
  // Renderização
  // ================================
  _renderizarJogo() {
    this._renderizarCenario();
    this.hud.desenhar(this.gameState.pontos, this.gameState.vidas);

    // Desenhar mensagem de "Pressione Enter" se necessário
    if (this.gameState.aguardandoReinicioVida && !this.gameState.gameOver) {
      this.hud.desenharMensagem('Pressione Enter para continuar');
    }
  }

  _renderizarCenario() {
    // Desenhar chão
    this.renderer.desenharChao(this.chaoImg, this.chaoY, this.alturaChao);

    // Desenhar entidades (blocos e Mario)
    this.entityManager.desenhar(this.renderer);
  }

  _renderizarGameOver() {
    this._renderizarCenario();

    const marioGameOverImg = this.assetLoader.getImagem(MARIO_GAME_OVER);
    this.hud.desenharGameOver(
      marioGameOverImg,
      this.mario.x,
      this.mario.y,
      this.mario.largura,
      this.mario.altura,
      this.gameState.pontos
    );
  }
}

export default Jogo;
