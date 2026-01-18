/**
 * Gerencia entrada do usuário (teclado, mouse, etc)
 */
export default class InputManager {
  constructor() {
    this.keysPressed = {};
    this.onEnterCallbacks = [];
    this._setupListeners();
  }

  _setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.key] = true;

      // Handler especial para Enter
      if (e.key.toLowerCase() === 'enter') {
        this.onEnterCallbacks.forEach(callback => callback());
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.key] = false;
    });
  }

  /**
   * Verifica se uma tecla está pressionada
   * @param {string} key - Nome da tecla
   * @returns {boolean}
   */
  isPressed(key) {
    return !!this.keysPressed[key];
  }

  /**
   * Registra callback para quando Enter é pressionado
   * @param {Function} callback
   */
  onEnter(callback) {
    this.onEnterCallbacks.push(callback);
  }

  /**
   * Remove callback do Enter
   * @param {Function} callback
   */
  offEnter(callback) {
    const index = this.onEnterCallbacks.indexOf(callback);
    if (index > -1) {
      this.onEnterCallbacks.splice(index, 1);
    }
  }
}
