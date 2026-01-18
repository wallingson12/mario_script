# 🎮 Mario e Cano com Nuvens

Um jogo estilo Mario desenvolvido com JavaScript vanilla, Canvas HTML5 e arquitetura modular bem organizada.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Canvas](https://img.shields.io/badge/Canvas-HTML5-FF6B6B?style=flat)

## 📋 Sobre o Projeto

Jogo de plataforma 2D onde você controla o Mario, coletando moedas e evitando colisões com canos. O jogo apresenta animações CSS, sprites animados, sistema de vidas e pontuação.

## 🎯 Funcionalidades

- ✅ Movimento do Mario (esquerda, direita, pulo)
- ✅ Coleta de moedas para pontuação
- ✅ Sistema de vidas (3 vidas iniciais)
- ✅ Colisão com canos (perda de vida)
- ✅ Animações CSS para canos e nuvens
- ✅ Sistema de pontuação
- ✅ Tela de Game Over
- ✅ Reinício de vida após perder
- ✅ Sons de feedback (moeda, morte, game over)

## 🎮 Como Jogar

### Controles

- **←** ou **→**: Mover Mario para esquerda/direita
- **Espaço**: Pular
- **Enter**: Reiniciar vida após morte (ou recarregar página no Game Over)

### Objetivo

- Colete moedas para ganhar pontos (10 pontos por moeda)
- Evite colidir com os canos
- Você tem 3 vidas
- Quando perder todas as vidas, é Game Over!

## 🚀 Como Executar

### Pré-requisitos

- Um navegador moderno com suporte a ES6 Modules
- Um servidor HTTP local (não é possível abrir `index.html` diretamente por CORS)

### Executar com Python

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Executar com Node.js (http-server)

```bash
npx http-server -p 8000
```

### Executar com PHP

```bash
php -S localhost:8000
```

Depois, acesse: `http://localhost:8000`

## 📁 Estrutura do Projeto

```
Game_javascrypt/
├── assets/
│   ├── audio/           # Sons do jogo
│   └── sprites/         # Imagens e sprites
│       ├── blocos/      # Blocos
│       ├── cano/        # Canos
│       ├── clouds/      # Nuvens
│       ├── coin/        # Moedas
│       ├── mapa/        # Fundo (chão, morros)
│       └── mario/       # Sprites do Mario
│
├── core/                # Classes principais
│   ├── jogo.js          # Orquestrador principal do jogo
│   ├── GameState.js     # Gerenciamento de estado (pontos, vidas)
│   └── main.js          # Ponto de entrada
│
├── rendering/           # Renderização
│   ├── Renderer.js      # Renderização no canvas
│   └── HUD.js           # Interface do usuário (pontos, vidas)
│
├── input/               # Input
│   └── InputManager.js  # Gerenciamento de teclado
│
├── collision/           # Colisões
│   └── CollisionDetector.js  # Detecção de colisões
│
├── audio/               # Áudio
│   └── AudioManager.js  # Gerenciamento de sons
│
├── animation/           # Animações
│   └── CSSAnimationManager.js  # Animações CSS (canos, nuvens)
│
├── assets/              # Assets
│   └── AssetLoader.js   # Carregamento de sprites/imagens
│
├── entities/            # Entidades do jogo
│   ├── EntityManager.js # Gerenciamento de entidades
│   ├── mario.js         # Classe Mario
│   ├── bloco.js         # Classe Bloco (moedas)
│   └── plataforma.js    # Classe Plataforma
│
├── sprites.js           # Gerenciamento de sprites
├── index.html           # HTML principal
├── style.css            # Estilos CSS
└── README.md            # Este arquivo
```

## 🏗️ Arquitetura

Este projeto foi **refatorado seguindo o Princípio da Responsabilidade Única (SRP)**, demonstrando arquitetura modular e código limpo. Cada classe possui uma única responsabilidade bem definida, facilitando manutenção, testes e escalabilidade.

![Gif](026-01-18%2009-43-45.gif)

### Classes Principais

- **`Jogo`** (jogo.js): Orquestrador principal, coordena todos os sistemas
- **`GameState`**: Gerencia estado do jogo (pontos, vidas, game over)
- **`Renderer`**: Responsável pela renderização no canvas
- **`HUD`**: Interface do usuário (pontos, vidas, mensagens)
- **`InputManager`**: Gerencia entrada do usuário (teclado)
- **`CollisionDetector`**: Detecta colisões entre objetos
- **`AudioManager`**: Gerencia sons do jogo
- **`CSSAnimationManager`**: Controla animações CSS
- **`AssetLoader`**: Carrega sprites e imagens
- **`EntityManager`**: Gerencia entidades (Mario, Blocos)

### Entidades

- **`Mario`**: Personagem principal, com física e animações
- **`Bloco`**: Blocos/moedas coletáveis
- **`Plataforma`**: Plataformas no jogo

## 💡 Destaques Técnicos

- ✨ **Arquitetura Modular**: Separação clara de responsabilidades (SRP)
- 🎯 **Canvas API**: Renderização 2D eficiente com HTML5 Canvas
- 🎨 **Animações CSS**: Animações fluidas sem JavaScript
- 🔊 **Sistema de Áudio**: Gerenciamento de sons e feedback
- 💥 **Detecção de Colisões**: Sistema robusto de colisão retangular
- 🎮 **Game Loop**: Implementação de game loop com requestAnimationFrame
- 📦 **ES6 Modules**: Organização modular com import/export

## 🛠️ Tecnologias Utilizadas

- **JavaScript (ES6+)** - Lógica do jogo com módulos ES6
- **HTML5 Canvas** - Renderização gráfica 2D
- **CSS3** - Estilos e animações
- **Vanilla JS** - Sem frameworks ou dependências externas

## 🎨 Recursos Visuais

- Sprites do Mario com animações de caminhada
- Fundo animado com nuvens
- Canos animados com efeito de pulso
- Interface simples e clara

## 📦 Estrutura de Assets

Todos os assets (imagens e sons) estão organizados na pasta `assets/`.

## 👨‍💻 Projeto de Portfólio

Este projeto demonstra conhecimento em:
- Arquitetura de software e design patterns
- Programação orientada a objetos em JavaScript
- Game development com Canvas HTML5
- Código limpo e manutenível
- Refatoração e boas práticas

Desenvolvido como parte do portfólio para demonstrar habilidades em JavaScript e desenvolvimento de jogos.

---

**Divirta-se jogando!** 🎮
