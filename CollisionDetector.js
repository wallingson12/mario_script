/**
 * Responsável pela detecção de colisões no jogo
 */
export default class CollisionDetector {
  /**
   * Verifica colisão retangular entre dois objetos
   * @param {Object} r1 - Retângulo 1 {left, right, top, bottom}
   * @param {Object} r2 - Retângulo 2 {left, right, top, bottom}
   * @returns {boolean} - true se há colisão
   */
  colisaoRetangular(r1, r2) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  }

  /**
   * Converte um elemento DOM (cano) para coordenadas do canvas
   * @param {HTMLElement} cano - Elemento cano HTML
   * @param {HTMLCanvasElement} canvas - Canvas do jogo
   * @returns {Object} - Retângulo {left, right, top, bottom}
   */
  canoParaRetangulo(cano, canvas) {
    const canoRect = cano.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    return {
      left: canoRect.left - canvasRect.left,
      right: canoRect.right - canvasRect.left,
      top: canoRect.top - canvasRect.top,
      bottom: canoRect.bottom - canvasRect.top
    };
  }

  /**
   * Verifica colisão entre Mario e um cano
   * @param {Object} marioRect - Retângulo do Mario
   * @param {HTMLElement} cano - Elemento cano HTML
   * @param {HTMLCanvasElement} canvas - Canvas do jogo
   * @returns {boolean} - true se há colisão
   */
  checarColisaoMarioCano(marioRect, cano, canvas) {
    const canoRect = this.canoParaRetangulo(cano, canvas);
    return this.colisaoRetangular(marioRect, canoRect);
  }

  /**
   * Verifica colisão entre Mario e blocos
   * @param {Object} marioRect - Retângulo do Mario
   * @param {Array} blocos - Array de blocos
   * @returns {Array} - Array de blocos colididos
   */
  checarColisaoMarioBlocos(marioRect, blocos) {
    return blocos.filter(bloco => {
      if (bloco.coletado) return false;
      return this.colisaoRetangular(marioRect, bloco.getRect());
    });
  }
}
