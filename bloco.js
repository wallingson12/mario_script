import { COIN } from "./sprites.js";

export default class Bloco {
  constructor(x, y, largura, altura, spriteManager) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.spriteManager = spriteManager;
    this.velocidade = 2;
    this.coletado = false; // coin foi coletado?
  }

  getRect() {
    return {
      left: this.x,
      right: this.x + this.largura,
      top: this.y,
      bottom: this.y + this.altura,
    };
  }

  desenhar(ctx) {
    if (!this.coletado) {
      ctx.drawImage(this.spriteManager.imagens[COIN], this.x, this.y, this.largura, this.altura);
    }
  }

  mover(canvasWidth) {
    this.x -= this.velocidade;
    if (this.x + this.largura < 0) {
      this.x = canvasWidth;
      this.coletado = false; // reaparece ao lado direito
    }
  }

  coletar() {
    this.coletado = true; // coin some quando coletado
    this.x = canvasWidth;  // opcional: já envia para reinício
  }
}
