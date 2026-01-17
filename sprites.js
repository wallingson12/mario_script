// 🔹 Constantes dos sprites
export const MARIO_PARADO = 'assets/sprites/mario/parado.png';
export const MARIO_RIGHT = 'assets/sprites/mario/right.png';
export const MARIO_RIGHT_2 = 'assets/sprites/mario/right_2.png';
export const MARIO_LEFT = 'assets/sprites/mario/left.png';
export const MARIO_LEFT_2 = 'assets/sprites/mario/left_2.png';
export const MARIO_GAME_OVER = 'assets/sprites/mario/game_over.png';
export const COIN = 'assets/sprites/coin/coin.png';
export const BLOCO = 'assets/sprites/blocos/bloco.png';
export const CHAO = 'assets/sprites/mapa/chao.png';
export const HILL = 'assets/sprites/mapa/hill.jpg';
export const CLOUDS = 'assets/sprites/clouds/clouds.png';
export const PIPE = 'assets/sprites/pipe/pipe.png';

export default class Sprites {
  constructor() {
    this.sprites = {
      right: [MARIO_RIGHT, MARIO_RIGHT_2],
      left: [MARIO_LEFT, MARIO_LEFT_2],
      parado_right: MARIO_PARADO,
      parado_left: MARIO_PARADO,
      game_over: MARIO_GAME_OVER
    };

    this.imagens = {};
  }

  carregarImagem(caminho) {
    if (!this.imagens[caminho]) {
      const img = new Image();
      img.src = caminho;
      img.onload = () => console.log(`Imagem carregada: ${caminho}`);
      img.onerror = () => console.error(`Erro ao carregar imagem: ${caminho}`);
      this.imagens[caminho] = img;
    }
    return this.imagens[caminho];
  }
}