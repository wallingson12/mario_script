// Jogo.js
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
import Bloco from './bloco.js';

class Jogo {
  constructor() {
    this.canvas = document.getElementById('tela');
    this.ctx = this.canvas.getContext('2d');

    this.spriteManager = new Sprites();

    // 🔹 Parâmetros do jogo
    this.larguraSprite = 64 * 1.5;
    this.alturaSprite = 64 * 1.5;
    this.alturaChao = 50;
    this.gravidade = 0.5;
    this.forcaPulo = -14;

    this.plataforma = new Plataforma(500, 500, 64, 64);

    // 🔥 Mario começa no chão
    this.mario = new Mario(
      50,
      this.canvas.height - this.alturaChao - this.alturaSprite,
      this.larguraSprite,
      this.alturaSprite,
      this.forcaPulo,
      this.gravidade,
      this.spriteManager
    );

    // 🔹 Blocos (coins)
    const numBlocos = Math.floor(Math.random() * 3) + 1;
    this.blocos = [];
    let posX = this.canvas.width;
    for (let i = 0; i < numBlocos; i++) {
      const distancia = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
      this.blocos.push(new Bloco(posX, 500, 64, 64, this.spriteManager));
      posX += 64 + distancia;
    }

    // 🔹 Estado inicial
    this.chaoY = this.canvas.height - this.alturaChao;
    this.pontos = 0;
    this.vidas = 3;
    this.gameOver = false;
    this.morreu = false;
    this.aguardandoReinicioVida = false;

    // 🔹 Elementos HTML animados (CSS)
    this.elementosCano = document.querySelectorAll('.pipe');
    this.elementosNuvem = document.querySelectorAll('.cloud');

    // 🔹 Sons
    this.somColetar = new Audio('assets/audio/coin.mp3');
    this.somColetar.loop = false;
    this.somMorte = new Audio('assets/audio/lost_a_life.wav');
    this.somMorte.loop = false;
    this.somGameOver = new Audio('assets/audio/gameover.mp3');
    this.somGameOver.loop = false;

    this.loop = this.loop.bind(this);

    // 🔹 Preload imagens e inicia o jogo
    this.preloadImagens([
      MARIO_PARADO,
      MARIO_RIGHT,
      MARIO_RIGHT_2,
      MARIO_LEFT,
      MARIO_LEFT_2,
      MARIO_GAME_OVER,
      COIN,
      CHAO
    ]).then(() => {
      this.chaoImg = this.spriteManager.carregarImagem(CHAO);
      this.iniciarPulsePipes();
      this.iniciar();
      this.loop();
    });
  }

  // ============================================================
  // 🔹 Preload confiável
  // ============================================================
  preloadImagens(imagens) {
    return new Promise(resolve => {
      let carregadas = 0;
      imagens.forEach(src => {
        const img = this.spriteManager.carregarImagem(src);
        if (img.complete) {
          carregadas++;
          if (carregadas === imagens.length) resolve();
        } else {
          img.onload = () => {
            carregadas++;
            if (carregadas === imagens.length) resolve();
          };
          img.onerror = () => {
            console.error('Erro ao carregar imagem:', src);
            carregadas++;
            if (carregadas === imagens.length) resolve();
          };
        }
      });
    });
  }

  // ============================================================
  // 🔹 Colisões
  // ============================================================
  colisaoRetangular(r1, r2) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  }

  // ============================================================
  // 🔹 Loop principal
  // ============================================================
  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameOver) {
      this.desenharChao();
      this.blocos.forEach(b => b.desenhar(this.ctx));
      this.desenharGameOver();
      return;
    }

    if (!this.aguardandoReinicioVida) {
      this.mario.mover(this.chaoY, this.plataforma, this.canvas.width);
    } else {
      this.mario.velocidadeX = 0;
      this.mario.velocidadeY = 0;
      this.mario.andando = false;
    }

    const marioRect = this.mario.getRect();

    // 🔹 Blocos (coins)
    this.blocos.forEach(bloco => {
      if (!this.aguardandoReinicioVida) bloco.mover(this.canvas.width);
      bloco.desenhar(this.ctx);

      if (!this.aguardandoReinicioVida && this.colisaoRetangular(marioRect, bloco.getRect()) && !bloco.coletado) {
        this.pontos += 10;
        this.somColetar.currentTime = 0;
        this.somColetar.play();
        bloco.coletado = true; // marca como coletado
      }
    });

    // 🔹 Colisão com canos
    this.elementosCano.forEach(pipe => {
      const pipeRect = pipe.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();
      const pipePos = {
        left: pipeRect.left - canvasRect.left,
        right: pipeRect.right - canvasRect.left,
        top: pipeRect.top - canvasRect.top,
        bottom: pipeRect.bottom - canvasRect.top,
      };

      if (!this.aguardandoReinicioVida && this.colisaoRetangular(marioRect, pipePos)) {
        if (!this.morreu) {
          this.morreu = true;
          this.mario.spriteAtual = MARIO_GAME_OVER;
          this.vidas -= 1;

          if (this.vidas > 0) {
            this.somMorte.currentTime = 0;
            this.somMorte.play();
            this.pauseAnimacoes();
            this.aguardandoReinicioVida = true;
          } else {
            this.somGameOver.currentTime = 0;
            this.somGameOver.play();
            this.gameOver = true;
            this.pauseAnimacoes();
          }
        }
      }
    });

    // 🔹 Desenhos
    this.desenharChao();
    this.mario.desenhar(this.ctx);
    this.blocos.forEach(b => b.desenhar(this.ctx));
    this.desenharPontuacao();
    this.desenharVidas();

    if (this.aguardandoReinicioVida && !this.gameOver) {
      this.desenharMensagemPressEnter('Pressione Enter para continuar');
    }

    requestAnimationFrame(this.loop);
  }

  // ============================================================
  // 🔹 Desenhar elementos
  // ============================================================
  desenharChao() {
    if (!this.chaoImg) return;
    for (let x = 0; x < this.canvas.width; x += this.chaoImg.width) {
      this.ctx.drawImage(this.chaoImg, x, this.chaoY, this.chaoImg.width, this.alturaChao);
    }
  }

  desenharPontuacao() {
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Pontos: ' + this.pontos, 20, 40);
  }

  desenharVidas() {
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('Vidas: ' + this.vidas, 20, 70);
  }

  desenharMensagemPressEnter(msg) {
    this.ctx.font = '22px Arial';
    this.ctx.fillStyle = 'yellow';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(msg, this.canvas.width / 2, this.canvas.height / 2 - 20);
    this.ctx.textAlign = 'start';
  }

  desenharGameOver() {
    const img = this.spriteManager.carregarImagem(MARIO_GAME_OVER);
    this.ctx.drawImage(img, this.mario.x, this.mario.y, this.mario.largura, this.mario.altura);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.font = '30px Arial';
    this.ctx.fillText('Pontos: ' + this.pontos, this.canvas.width / 2, this.canvas.height / 2 + 40);
    this.ctx.textAlign = 'start';
  }

  // ============================================================
  // 🔹 Animação dos canos
  // ============================================================
  iniciarPulsePipes() {
    this.elementosCano.forEach(pipe => {
      const alturaMin = 80;
      const alturaMax = 140;
      let alturaAtual = alturaMin;
      let crescente = true;

      const pulse = () => {
        if (!this.gameOver && !this.aguardandoReinicioVida) {
          if (crescente) {
            alturaAtual += 0.5;
            if (alturaAtual >= alturaMax) crescente = false;
          } else {
            alturaAtual -= 0.5;
            if (alturaAtual <= alturaMin) crescente = true;
          }
          pipe.style.height = alturaAtual + 'px';
        }
        requestAnimationFrame(pulse);
      };
      requestAnimationFrame(pulse);
    });
  }

  // ============================================================
  // 🔹 Controles
  // ============================================================
  iniciar() {
    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'enter') {
        if (this.gameOver) { location.reload(); return; }

        if (this.aguardandoReinicioVida) {
          this.aguardandoReinicioVida = false;
          this.morreu = false;
          this.mario.x = 50;
          this.mario.y = this.chaoY - this.alturaSprite;
          this.mario.velocidadeX = 0;
          this.mario.velocidadeY = 0;
          this.mario.spriteAtual = MARIO_PARADO;

          // 🔹 Reinicia posição dos coins igual pipes
          let posX = this.canvas.width;
          this.blocos.forEach(bloco => {
            bloco.x = posX;
            bloco.coletado = false; // coin reaparece
            const distancia = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
            posX += 64 + distancia;
          });

          this.resumeAnimacoes();
          this.resetarAnimacoes();
        }
      }

      if (this.aguardandoReinicioVida) return;

      if (e.key === 'ArrowRight') {
        this.mario.andando = true;
        this.mario.direcao = 'right';
        this.mario.velocidadeX = 3;
      } else if (e.key === 'ArrowLeft') {
        this.mario.andando = true;
        this.mario.direcao = 'left';
        this.mario.velocidadeX = -3;
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (this.mario.noChao) this.mario.velocidadeY = this.mario.forcaPulo;
      }
    });

    window.addEventListener('keyup', e => {
      if (this.aguardandoReinicioVida) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        this.mario.andando = false;
        this.mario.velocidadeX = 0;
      }
    });
  }

  pauseAnimacoes() {
    this.elementosCano.forEach(p => (p.style.animationPlayState = 'paused'));
    this.elementosNuvem.forEach(c => (c.style.animationPlayState = 'paused'));
  }

  resumeAnimacoes() {
    this.elementosCano.forEach(p => (p.style.animationPlayState = 'running'));
    this.elementosNuvem.forEach(c => (c.style.animationPlayState = 'running'));
  }

  resetarAnimacoes() {
    // Remove e recria a animação para forçar reinício
    this.elementosCano.forEach(p => {
      p.style.animation = 'none';
      p.offsetHeight;
      p.style.animation = 'pipe-move 5s linear infinite';
    });
    this.elementosNuvem.forEach(c => {
      c.style.animation = 'none';
      c.offsetHeight;
      c.style.animation = 'cloud-move 10s linear infinite';
    });

    // Reaplica delays das nuvens
    const clouds = document.querySelectorAll('.cloud');
    if (clouds[0]) clouds[0].style.animationDelay = '0s';
    if (clouds[1]) clouds[1].style.animationDelay = '3s';
    if (clouds[2]) clouds[2].style.animationDelay = '6s';
  }
}

export default Jogo;
