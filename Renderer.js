/**
 * Responsável pela renderização no canvas
 */
export default class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Limpa o canvas
   */
  limpar() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Desenha o chão do jogo
   * @param {HTMLImageElement} chaoImg - Imagem do chão
   * @param {number} chaoY - Posição Y do chão
   * @param {number} alturaChao - Altura do chão
   */
  desenharChao(chaoImg, chaoY, alturaChao) {
    if (!chaoImg) return;

    for (let x = 0; x < this.canvas.width; x += chaoImg.width) {
      this.ctx.drawImage(chaoImg, x, chaoY, chaoImg.width, alturaChao);
    }
  }

  /**
   * Desenha uma entidade (Mario, Bloco, etc)
   * @param {Object} entidade - Entidade com método desenhar(ctx)
   */
  desenharEntidade(entidade) {
    if (entidade && typeof entidade.desenhar === 'function') {
      entidade.desenhar(this.ctx);
    }
  }
}
