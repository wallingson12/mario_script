/**
 * Gerencia a interface do usuário (HUD - Heads-Up Display)
 */
export default class HUD {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.mensagemVisivel = true;
  }

  /**
   * Desenha o HUD com pontos e vidas
   * @param {number} pontos - Pontos do jogador
   * @param {number} vidas - Vidas restantes
   */
  desenhar(pontos, vidas) {
    // Pontos
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.shadowColor = 'black';
    this.ctx.shadowBlur = 5;
    this.ctx.fillText('Pontos: ' + pontos, 20, 40);

    // Vidas
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('Vidas: ' + vidas, 20, 70);

    this.ctx.shadowBlur = 0;
  }

  /**
   * Desenha mensagem no centro da tela (piscante)
   * @param {string} msg - Mensagem a ser exibida
   */
  desenharMensagem(msg) {
    if (!this.mensagemVisivel) return;

    this.ctx.font = '22px Arial';
    this.ctx.fillStyle = 'yellow';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(msg, this.canvas.width / 2, this.canvas.height / 2 - 20);
    this.ctx.textAlign = 'start';
  }

  /**
   * Desenha tela de Game Over
   * @param {HTMLImageElement} marioGameOverImg - Imagem do Mario Game Over
   * @param {number} marioX - Posição X do Mario
   * @param {number} marioY - Posição Y do Mario
   * @param {number} marioLargura - Largura do sprite do Mario
   * @param {number} marioAltura - Altura do sprite do Mario
   * @param {number} pontos - Pontos finais
   */
  desenharGameOver(marioGameOverImg, marioX, marioY, marioLargura, marioAltura, pontos) {
    // Desenha Mario Game Over
    if (marioGameOverImg) {
      this.ctx.drawImage(marioGameOverImg, marioX, marioY, marioLargura, marioAltura);
    }

    // Texto Game Over
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    
    // Pontos finais
    this.ctx.font = '30px Arial';
    this.ctx.fillText('Pontos: ' + pontos, this.canvas.width / 2, this.canvas.height / 2 + 40);
    this.ctx.textAlign = 'start';
  }

  /**
   * Alterna visibilidade da mensagem (para efeito piscante)
   */
  toggleMensagem() {
    this.mensagemVisivel = !this.mensagemVisivel;
  }

  /**
   * Inicia o efeito de piscar mensagem
   * @param {number} intervalo - Intervalo em ms (padrão: 500ms)
   * @returns {number} - ID do intervalo para limpar depois
   */
  iniciarPiscar(intervalo = 500) {
    return setInterval(() => {
      this.toggleMensagem();
    }, intervalo);
  }
}
