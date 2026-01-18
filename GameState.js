/**
 * Gerencia o estado do jogo (pontos, vidas, game over, etc)
 */
export default class GameState {
  constructor() {
    this.pontos = 0;
    this.vidas = 3;
    this.gameOver = false;
    this.morreu = false;
    this.aguardandoReinicioVida = false;
  }

  resetarVida() {
    this.aguardandoReinicioVida = false;
    this.morreu = false;
  }

  perderVida() {
    this.morreu = true;
    this.vidas -= 1;

    if (this.vidas > 0) {
      this.aguardandoReinicioVida = true;
      return false; // não é game over
    } else {
      this.gameOver = true;
      return true; // é game over
    }
  }

  coletarMoeda(pontosPorMoeda = 10) {
    this.pontos += pontosPorMoeda;
  }

  reiniciar() {
    this.pontos = 0;
    this.vidas = 3;
    this.gameOver = false;
    this.morreu = false;
    this.aguardandoReinicioVida = false;
  }
}
