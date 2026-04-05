class Enigma2RemoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
          padding: 16px;
          background: var(--ha-card-background, var(--card-background-color, white));
          border-radius: var(--ha-card-border-radius, 12px);
        }
        
        .card-header {
          font-size: 24px;
          font-weight: 500;
          padding-bottom: 16px;
          text-align: center;
          color: var(--primary-text-color);
        }
        
        .remote-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .button-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          width: 100%;
        }
        
        .button {
          background: var(--primary-color);
          border: none;
          border-radius: 8px;
          color: var(--text-primary-color, white);
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          padding: 12px 16px;
          transition: all 0.2s;
          min-width: 60px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .button:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .button.small {
          padding: 8px 12px;
          font-size: 14px;
          min-width: 50px;
        }
        
        .button.large {
          padding: 16px 20px;
          font-size: 18px;
          min-width: 70px;
        }
        
        .button.round {
          border-radius: 50%;
          width: 60px;
          height: 60px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .button.color-red {
          background: #e74c3c;
        }
        
        .button.color-green {
          background: #2ecc71;
        }
        
        .button.color-yellow {
          background: #f39c12;
        }
        
        .button.color-blue {
          background: #3498db;
        }
        
        .nav-grid {
          display: grid;
          grid-template-columns: repeat(3, 70px);
          grid-template-rows: repeat(3, 70px);
          gap: 8px;
        }
        
        .nav-button {
          background: var(--primary-color);
          border: none;
          border-radius: 8px;
          color: var(--text-primary-color, white);
          cursor: pointer;
          font-size: 24px;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .nav-button:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .nav-ok {
          background: var(--accent-color, #ff9800);
          border-radius: 50%;
          font-weight: bold;
        }
        
        .number-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          width: 100%;
          max-width: 250px;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 8px;
        }
        
        @media (max-width: 600px) {
          .remote-container {
            gap: 12px;
          }
          
          .button-row {
            gap: 8px;
          }
          
          .nav-grid {
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
          }
        }
      </style>
      
      <ha-card>
        <div class="card-header">${title}</div>
        <div class="remote-container">
          
          <!-- Number Pad -->
          <div class="section-title">Zifferntasten</div>
          <div class="number-grid">
            ${[1,2,3,4,5,6,7,8,9].map(num => `
              <button class="button" data-key="KEY_${num}">${num}</button>
            `).join('')}
            <button class="button" data-key="KEY_HELP">?</button>
            <button class="button" data-key="KEY_0">0</button>
            <button class="button" data-key="KEY_TEXT">TXT</button>
          </div>
          
          <!-- Navigation -->
          <div class="section-title">Navigation</div>
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
            <button class="button large" data-key="KEY_MENU">MENU</button>
            <button class="button large" data-key="KEY_EXIT">EXIT</button>
          </div>
          
          <!-- Color Buttons -->
          <div class="section-title">Farbtasten</div>
          <div class="button-row">
            <button class="button color-red" data-key="KEY_RED">●</button>
            <button class="button color-green" data-key="KEY_GREEN">●</button>
            <button class="button color-yellow" data-key="KEY_YELLOW">●</button>
            <button class="button color-blue" data-key="KEY_BLUE">●</button>
          </div>
          
          <!-- Channel Controls -->
          <div class="section-title">Kanal</div>
          <div class="button-row">
            <button class="button" data-key="KEY_CHANNELDOWN">◀ CH</button>
            <button class="button" data-key="KEY_CHANNELUP">CH ▶</button>
          </div>
          
          <!-- Additional Functions -->
          <div class="section-title">Funktionen</div>
          <div class="button-row">
            <button class="button small" data-key="KEY_INFO">INFO</button>
            <button class="button small" data-key="KEY_EPG">EPG</button>
            <button class="button small" data-key="KEY_PVR">PVR</button>
            <button class="button small" data-key="KEY_TV">TV</button>
          </div>
          
        </div>
      </ha-card>
    `;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('[data-key]');
    buttons.forEach(button => {
      // Click event
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const key = button.getAttribute('data-key');
        this.sendCommand(key, false);
      });
      
      // Long press support
      let pressTimer;
      button.addEventListener('mousedown', (e) => {
        const key = button.getAttribute('data-key');
        pressTimer = setTimeout(() => {
          this.sendCommand(key, true);
        }, 500); // 500ms for long press
      });
      
      button.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
      });
      
      button.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
      });
      
      // Touch support for mobile
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const key = button.getAttribute('data-key');
        pressTimer = setTimeout(() => {
          this.sendCommand(key, true);
        }, 500);
      });
      
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
      });
    });
  }

  sendCommand(key, longPress = false) {
    if (!this._hass) return;
    
    const entityId = this.config.entity;
    
    // Prepare service data
    const serviceData = {
      entity_id: entityId,
      command: [key]
    };
    
    // Add hold_secs for long press
    if (longPress) {
      serviceData.hold_secs = 1;
    }
    
    // Call the remote.send_command service
    this._hass.callService('remote', 'send_command', serviceData);
    
    // Visual feedback
    const button = this.shadowRoot.querySelector(`[data-key="${key}"]`);
    if (button) {
      button.style.opacity = '0.6';
      setTimeout(() => {
        button.style.opacity = '1';
      }, 200);
    }
  }

  updateState() {
    // Could be used to update UI based on entity state if needed
  }

  getCardSize() {
    return 8;
  }

  static getStubConfig() {
    return {
      entity: 'remote.enigma2_remote',
      name: 'Enigma2 Remote'
    };
  }
}

customElements.define('enigma2-remote-card', Enigma2RemoteCard);

// Announce the card to Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'enigma2-remote-card',
  name: 'Enigma2 Remote Card',
  description: 'A remote control card for Enigma2 devices',
  preview: false,
  documentationURL: 'https://github.com/yourusername/enigma2_remote',
});
