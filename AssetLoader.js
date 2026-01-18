/**
 * Responsável pelo carregamento de assets (imagens, sprites)
 */
export default class AssetLoader {
  constructor(spriteManager) {
    this.spriteManager = spriteManager;
    this.imagens = {};
  }

  /**
   * Precarrega uma lista de imagens
   * @param {Array<string>} imagens - Array de caminhos de imagens
   * @returns {Promise} - Promise que resolve quando todas as imagens estão carregadas
   */
  preloadImagens(imagens) {
    return new Promise((resolve) => {
      let carregadas = 0;
      const total = imagens.length;

      if (total === 0) {
        resolve();
        return;
      }

      imagens.forEach(src => {
        const img = this.spriteManager.carregarImagem(src);
        this.imagens[src] = img;

        if (img.complete) {
          carregadas++;
          if (carregadas === total) resolve();
        } else {
          img.onload = () => {
            carregadas++;
            if (carregadas === total) resolve();
          };
          img.onerror = () => {
            console.error('Erro ao carregar imagem:', src);
            carregadas++;
            if (carregadas === total) resolve();
          };
        }
      });
    });
  }

  /**
   * Obtém uma imagem carregada
   * @param {string} chave - Chave da imagem
   * @returns {HTMLImageElement|null}
   */
  getImagem(chave) {
    return this.imagens[chave] || null;
  }

  /**
   * Verifica se uma imagem está carregada
   * @param {string} chave - Chave da imagem
   * @returns {boolean}
   */
  hasImagem(chave) {
    return chave in this.imagens && this.imagens[chave] !== null;
  }
}
