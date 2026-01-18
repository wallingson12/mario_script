/**
 * Gerencia todos os sons do jogo
 */
export default class AudioManager {
  constructor() {
    this.somColetar = new Audio('assets/audio/coin.mp3');
    this.somMorte = new Audio('assets/audio/lost_a_life.wav');
    this.somGameOver = new Audio('assets/audio/gameover.mp3');

    // Configurar sons para não loop
    [this.somColetar, this.somMorte, this.somGameOver].forEach(s => {
      s.loop = false;
    });
  }

  tocarColetar() {
    this.somColetar.currentTime = 0;
    this.somColetar.play().catch(err => console.error('Erro ao tocar som:', err));
  }

  tocarMorte() {
    this.somMorte.currentTime = 0;
    this.somMorte.play().catch(err => console.error('Erro ao tocar som:', err));
  }

  tocarGameOver() {
    this.somGameOver.currentTime = 0;
    this.somGameOver.play().catch(err => console.error('Erro ao tocar som:', err));
  }
}
