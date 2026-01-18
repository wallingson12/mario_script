/**
 * Gerencia animações CSS (canos, nuvens)
 */
const CANO_ALTURA_MIN = 80;
const CANO_ALTURA_MAX = 140;

export default class CSSAnimationManager {
  constructor(elementosCano, elementosNuvem) {
    this.elementosCano = elementosCano;
    this.elementosNuvem = elementosNuvem;
    this.canoAnimationHandles = [];
    this.paused = false;
  }

  iniciarPulseCanos() {
    this.elementosCano.forEach((cano, index) => {
      let alturaAtual = CANO_ALTURA_MIN;
      let crescente = true;

      const pulse = () => {
        if (!this.paused) {
          if (crescente) {
            alturaAtual += 0.5;
            if (alturaAtual >= CANO_ALTURA_MAX) crescente = false;
          } else {
            alturaAtual -= 0.5;
            if (alturaAtual <= CANO_ALTURA_MIN) crescente = true;
          }
          cano.style.height = alturaAtual + 'px';
        }
        const handle = requestAnimationFrame(pulse);
        this.canoAnimationHandles[index] = handle;
      };

      pulse();
    });
  }

  pause() {
    this.paused = true;
    this.elementosCano.forEach(p => (p.style.animationPlayState = 'paused'));
    this.elementosNuvem.forEach(c => (c.style.animationPlayState = 'paused'));
  }

  resume() {
    this.paused = false;
    this.elementosCano.forEach(p => (p.style.animationPlayState = 'running'));
    this.elementosNuvem.forEach(c => (c.style.animationPlayState = 'running'));
  }

  reset() {
    const resetElementos = (eles, animacao) => {
      eles.forEach(e => {
        e.style.animation = 'none';
        e.offsetHeight; // Force reflow
        e.style.animation = animacao;
      });
    };

    resetElementos(this.elementosCano, 'cano-move 5s linear infinite');
    resetElementos(this.elementosNuvem, 'cloud-move 10s linear infinite');

    if (this.elementosNuvem[0]) this.elementosNuvem[0].style.animationDelay = '0s';
    if (this.elementosNuvem[1]) this.elementosNuvem[1].style.animationDelay = '3s';
    if (this.elementosNuvem[2]) this.elementosNuvem[2].style.animationDelay = '6s';
  }

  limpar() {
    // Cancela animações de pulso dos canos
    this.canoAnimationHandles.forEach(handle => {
      if (handle) cancelAnimationFrame(handle);
    });
    this.canoAnimationHandles = [];
  }
}
