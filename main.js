import Sprites, {MARIO_GAME_OVER, MARIO_PARADO, MARIO_RIGHT, MARIO_RIGHT_2, MARIO_LEFT, MARIO_LEFT_2, COIN, BLOCO, CHAO, HILL, CLOUDS, PIPE} from './sprites.js';
import Jogo from './jogo.js';

const canvas = document.getElementById('tela');
const spriteManager = new Sprites();

// 🔹 Carrega todas as imagens do jogo
const imagens = [
  MARIO_PARADO,
  MARIO_RIGHT,
  MARIO_RIGHT_2,
  MARIO_LEFT,
  MARIO_LEFT_2,
  MARIO_GAME_OVER,
  COIN,
  BLOCO,
  CHAO,
  HILL,
  CLOUDS,
  PIPE
];

imagens.forEach(src => spriteManager.carregarImagem(src));

// 🔹 Inicia o jogo
const jogo = new Jogo();