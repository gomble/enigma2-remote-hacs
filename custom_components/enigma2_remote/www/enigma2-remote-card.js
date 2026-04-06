class Enigma2RemoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._pressTimers = new Map();
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this.shadowRoot) {
      this.updateState();
    }
  }

  render() {
    const title = this.config.name || 'Enigma2 Remote';
    
    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          padding: 6px;
          background: var(--ha-card-background, var(--card-background-color, white));
          border-radius: var(--ha-card-border-radius, 10px);
        }
        
        .card-header {
          font-size: 13px;
          font-weight: 500;
          padding-bottom: 5px;
          text-align: center;
          color: var(--primary-text-color);
        }
        
        .remote-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          max-width: 250px;
          margin: 0 auto;
        }
        
        .button-row {
          display: flex;
          justify-content: center;
          gap: 4px;
          width: 100%;
        }
        
        .button {
          background: var(--primary-color);
          border: none;
          border-radius: 5px;
          color: var(--text-primary-color, white);
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          padding: 5px 6px;
          transition: all 0.1s;
          min-width: 32px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }
        
        .button:hover {
          filter: brightness(1.1);
        }
        
        .button:active, .button.touch-active {
          transform: scale(0.93);
          filter: brightness(0.85);
          box-shadow: 0 0 1px rgba(0,0,0,0.1);
        }
        
        .button.small {
          padding: 4px 5px;
          font-size: 10px;
          min-width: 28px;
        }
        
        .button.power {
          background: #e74c3c;
          font-size: 12px;
          padding: 5px 14px;
          min-width: 40px;
          border-radius: 16px;
        }
        
        .button.mute {
          background: #e67e22;
          font-size: 13px;
          padding: 5px 8px;
        }
        
        .button.vol-ch {
          font-size: 11px;
          padding: 5px 8px;
          min-width: 36px;
          font-weight: 600;
        }
        
        .button.color-red { background: #e74c3c; }
        .button.color-green { background: #2ecc71; }
        .button.color-yellow { background: #f39c12; color: #333; }
        .button.color-blue { background: #3498db; }
        
        .nav-grid {
          display: grid;
          grid-template-columns: repeat(3, 44px);
          grid-template-rows: repeat(3, 44px);
          gap: 3px;
        }
        
        .nav-button {
          background: var(--primary-color);
          border: none;
          border-radius: 5px;
          color: var(--text-primary-color, white);
          cursor: pointer;
          font-size: 16px;
          transition: all 0.1s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }
        
        .nav-button:active, .nav-button.touch-active {
          transform: scale(0.93);
          filter: brightness(0.85);
        }
        
        .nav-ok {
          background: var(--accent-color, #ff9800);
          border-radius: 50%;
          font-weight: bold;
          font-size: 11px;
        }
        
        .number-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3px;
          width: 100%;
          max-width: 170px;
        }
        
        .vol-ch-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 4px;
          width: 100%;
          max-width: 220px;
          align-items: center;
        }
        
        .vol-ch-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        
        .vol-ch-label {
          font-size: 9px;
          font-weight: 600;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .section-title {
          font-size: 9px;
          font-weight: 600;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-top: 2px;
        }
        
        .divider {
          width: 80%;
          height: 1px;
          background: var(--divider-color, rgba(0,0,0,0.08));
          margin: 1px 0;
        }
        
        @media (max-width: 600px) {
          ha-card {
            padding: 5px;
          }
          .remote-container {
            gap: 4px;
          }
          .nav-grid {
            grid-template-columns: repeat(3, 40px);
            grid-template-rows: repeat(3, 40px);
          }
        }
      </style>
      
      <ha-card>
        <div class="card-header">${title}</div>
        <div class="remote-container">
          
          <!-- Power -->
          <div class="button-row">
            <button class="button power" data-key="KEY_POWER">⏻ Power</button>
          </div>
          
          <div class="divider"></div>
          
          <!-- Volume & Channel -->
          <div class="vol-ch-grid">
            <div class="vol-ch-col">
              <span class="vol-ch-label">Vol</span>
              <button class="button vol-ch" data-key="KEY_VOLUMEUP">🔊+</button>
              <button class="button vol-ch" data-key="KEY_VOLUMEDOWN">🔉−</button>
            </div>
            <button class="button mute" data-key="KEY_MUTE">🔇</button>
            <div class="vol-ch-col">
              <span class="vol-ch-label">CH</span>
              <button class="button vol-ch" data-key="KEY_CHANNELUP">CH+</button>
              <button class="button vol-ch" data-key="KEY_CHANNELDOWN">CH−</button>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <!-- Navigation -->
          <div class="nav-grid">
            <div></div>
            <button class="nav-button" data-key="KEY_UP">▲</button>
            <div></div>
            <button class="nav-button" data-key="KEY_LEFT">◀</button>
            <button class="nav-button nav-ok" data-key="KEY_OK">OK</button>
            <button class="nav-button" data-key="KEY_RIGHT">▶</button>
            <div></div>
            <button class="nav-button" data-key="KEY_DOWN">▼</button>
            <div></div>
          </div>
          
          <!-- Menu & Exit -->
          <div class="button-row">
            <button class="button" data-key="KEY_MENU">MENU</button>
            <button class="button" data-key="KEY_EXIT">EXIT</button>
            <button class="button" data-key="KEY_BACK">BACK</button>
          </div>
          
          <div class="divider"></div>
          
          <!-- Number Pad -->
          <div class="section-title">Ziffern</div>
          <div class="number-grid">
            ${[1,2,3,4,5,6,7,8,9].map(num => `
              <button class="button" data-key="KEY_${num}">${num}</button>
            `).join('')}
            <button class="button small" data-key="KEY_HELP">?</button>
            <button class="button" data-key="KEY_0">0</button>
            <button class="button small" data-key="KEY_TEXT">TXT</button>
          </div>
          
          <div class="divider"></div>
          
          <!-- Color Buttons -->
          <div class="button-row">
            <button class="button color-red small" data-key="KEY_RED">●</button>
            <button class="button color-green small" data-key="KEY_GREEN">●</button>
            <button class="button color-yellow small" data-key="KEY_YELLOW">●</button>
            <button class="button color-blue small" data-key="KEY_BLUE">●</button>
          </div>
          
          <!-- Additional Functions -->
          <div class="button-row">
            <button class="button small" data-key="KEY_INFO">INFO</button>
            <button class="button small" data-key="KEY_EPG">EPG</button>
            <button class="button small" data-key="KEY_LIST">LIST</button>
            <button class="button small" data-key="KEY_TV">TV</button>
          </div>
          
          <!-- Media Controls -->
          <div class="button-row">
            <button class="button small" data-key="KEY_REWIND">⏪</button>
            <button class="button small" data-key="KEY_PLAY">▶</button>
            <button class="button small" data-key="KEY_PAUSE">⏸</button>
            <button class="button small" data-key="KEY_STOP">⏹</button>
            <button class="button small" data-key="KEY_FASTFORWARD">⏩</button>
          </div>
          
        </div>
      </ha-card>
    `;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('[data-key]');
    buttons.forEach(button => {
      let pressTimer;
      let touchHandled = false;

      // Touch events - fire immediately on touchstart for responsiveness
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchHandled = true;
        button.classList.add('touch-active');
        
        const key = button.getAttribute('data-key');
        
        // Send command immediately on touch
        this.sendCommand(key, false);
        
        // Also set up long-press detection
        pressTimer = setTimeout(() => {
          this.sendCommand(key, true);
        }, 500);
      }, { passive: false });

      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(pressTimer);
        button.classList.remove('touch-active');
        setTimeout(() => { touchHandled = false; }, 300);
      }, { passive: false });

      button.addEventListener('touchcancel', (e) => {
        clearTimeout(pressTimer);
        button.classList.remove('touch-active');
        touchHandled = false;
      });

      // Click event for mouse/desktop
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (touchHandled) return;
        const key = button.getAttribute('data-key');
        this.sendCommand(key, false);
      });
      
      // Long press for mouse
      button.addEventListener('mousedown', (e) => {
        if (touchHandled) return;
        const key = button.getAttribute('data-key');
        pressTimer = setTimeout(() => {
          this.sendCommand(key, true);
        }, 500);
      });
      
      button.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
      });
      
      button.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
      });
    });
  }

  sendCommand(key, longPress = false) {
    if (!this._hass) return;
    
    const entityId = this.config.entity;
    
    const serviceData = {
      entity_id: entityId,
      command: [key]
    };
    
    if (longPress) {
      serviceData.hold_secs = 1;
    }
    
    this._hass.callService('remote', 'send_command', serviceData);
    
    // Visual feedback
    const button = this.shadowRoot.querySelector(`[data-key="${key}"]`);
    if (button) {
      button.style.opacity = '0.5';
      setTimeout(() => {
        button.style.opacity = '1';
      }, 150);
    }
  }

  updateState() {}

  getCardSize() {
    return 6;
  }

  static getStubConfig() {
    return {
      entity: 'remote.enigma2_remote',
      name: 'Enigma2 Remote'
    };
  }
}

customElements.define('enigma2-remote-card', Enigma2RemoteCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'enigma2-remote-card',
  name: 'Enigma2 Remote Card',
  description: 'A compact remote control card for Enigma2 devices via OpenWebif',
  preview: false,
  documentationURL: 'https://github.com/gomble/enigma2-remote-hacs',
});
