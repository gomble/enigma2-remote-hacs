/**
 * Enigma2 Remote Control Card for Home Assistant
 * Visual design inspired by LG WebOS Remote Control
 * https://github.com/madmicio/LG-WebOS-Remote-Control
 */

// ── Translations ─────────────────────────────────────────────────────────────
const ENIGMA2_TRANSLATIONS = {
  de: {
    standby_toggle:   'Standby Umschalten',
    power_off:        'Ausschalten',
    receiver_restart: 'Rcvr Neustart',
    gui_restart:      'GUI Neustart',
    wake_up:          'Aufwecken',
    standby:          'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  en: {
    standby_toggle:   'Toggle Standby',
    power_off:        'Power Off',
    receiver_restart: 'Rcvr Restart',
    gui_restart:      'GUI Restart',
    wake_up:          'Wake Up',
    standby:          'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  fr: {
    standby_toggle:   'Basculer Veille',
    power_off:        'Éteindre',
    receiver_restart: 'Redém. Rcvr',
    gui_restart:      'Redém. GUI',
    wake_up:          'Réveiller',
    standby:          'Veille',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  tr: {
    standby_toggle:   'Bekleme Geçiş',
    power_off:        'Kapat',
    receiver_restart: 'Alıcı Yeniden',
    gui_restart:      'GUI Yeniden',
    wake_up:          'Uyandır',
    standby:          'Bekleme',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
};

function _t(lang, key) {
  const base = lang ? lang.split('-')[0].toLowerCase() : 'en';
  const dict = ENIGMA2_TRANSLATIONS[base] || ENIGMA2_TRANSLATIONS['en'];
  return dict[key] || ENIGMA2_TRANSLATIONS['en'][key] || key;
}

// ── Card ─────────────────────────────────────────────────────────────────────
class Enigma2RemoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._lang = null;
  }

  setConfig(config) {
    if (!config.entity) throw new Error('entity required');
    this.config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    const lang = hass.language || hass.locale?.language || 'en';
    if (lang !== this._lang) {
      this._lang = lang;
      this._render();
    }
  }

  _cfg(path, fallback) {
    const parts = path.split('.');
    let v = this.config;
    for (const p of parts) { v = v?.[p]; }
    return v !== undefined && v !== '' ? v : fallback;
  }

  _render() {
    const title  = this.config.name || 'Enigma2 Remote';
    const scale  = parseFloat(this._cfg('dimensions.scale', 1.0));
    const bdrW   = parseInt(this._cfg('dimensions.border_width', 1));
    const w      = Math.round(260 * scale);
    const lang   = this._lang || 'en';
    const t      = (key) => _t(lang, key);

    const btnColor  = this._cfg('colors.buttons',    '#6d767e');
    const txtColor  = this._cfg('colors.text',       '#ffffff');
    const bgColor   = this._cfg('colors.background', '');
    const bdrColor  = this._cfg('colors.border',     '');
    const showColor = this._cfg('show_color_buttons', true);

    const bgStyle  = bgColor  ? `background:${bgColor} !important;` : '';
    const bdrStyle = bdrColor ? bdrColor : 'var(--primary-text-color, #888)';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --remotewidth:  ${w}px;
          --btn-color:    ${btnColor};
          --btn-text:     ${txtColor};
          --border-color: ${bdrStyle};
          --border-width: ${bdrW}px;
        }

        ha-card {
          ${bgStyle}
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          overflow: hidden;
        }

        .card {
          display: flex;
          justify-content: center;
          padding: 12px 8px;
        }

        .page {
          width: var(--remotewidth);
          border: var(--border-width) solid var(--border-color);
          border-radius: calc(var(--remotewidth) / 7);
          padding: calc(var(--remotewidth) / 14) calc(var(--remotewidth) / 13);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(var(--remotewidth) / 26);
          box-sizing: border-box;
        }

        .remote-title {
          font-size: calc(var(--remotewidth) / 15);
          font-weight: 500;
          color: var(--primary-text-color);
          text-align: center;
          letter-spacing: 0.3px;
        }

        .divider {
          width: 85%;
          height: 1px;
          background: var(--divider-color, rgba(128,128,128,0.18));
        }

        /* ── Power ── */
        .power-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: calc(var(--remotewidth) / 55);
        }

        .btn-standby {
          width: 100%;
          background: #c0392b;
          border: none;
          color: #fff;
          cursor: pointer;
          border-radius: calc(var(--remotewidth) / 13);
          font-size: calc(var(--remotewidth) / 16);
          font-weight: 600;
          padding: calc(var(--remotewidth) / 32) 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 3px 10px rgba(192,57,43,0.45);
          position: relative; overflow: hidden; box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .12s;
        }
        .btn-standby:active { filter: brightness(.72); }

        .power-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: calc(var(--remotewidth) / 65);
        }

        .btn-power-opt {
          background: #922b21;
          border: none; color: #fff; cursor: pointer;
          border-radius: calc(var(--remotewidth) / 22);
          font-size: calc(var(--remotewidth) / 23);
          font-weight: 500;
          padding: calc(var(--remotewidth) / 42) 2px;
          line-height: 1.3; text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.4);
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .12s;
        }
        .btn-power-opt:active { filter: brightness(.68); }

        /* ── Vol/CH block ── */
        .grid-vc {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, calc(var(--remotewidth) / 6.2));
          grid-template-areas:
            "ch_up   menu    vol_up"
            "ch_down mute    vol_down"
            "exit    info    back";
          gap: 2px; width: 100%;
        }
        .vc-ch-up    { grid-area: ch_up;    border-radius: calc(var(--remotewidth)/11) 0 0 0; }
        .vc-menu     { grid-area: menu;     border-radius: 0; font-size: calc(var(--remotewidth)/21) !important; }
        .vc-vol-up   { grid-area: vol_up;   border-radius: 0 calc(var(--remotewidth)/11) 0 0; }
        .vc-ch-down  { grid-area: ch_down;  border-radius: 0; }
        .vc-mute     { grid-area: mute;     border-radius: 0; background: #e67e22 !important; font-size: calc(var(--remotewidth)/10) !important; }
        .vc-vol-down { grid-area: vol_down; border-radius: 0; }
        .vc-exit     { grid-area: exit;     border-radius: 0 0 0 calc(var(--remotewidth)/11); font-size: calc(var(--remotewidth)/20) !important; }
        .vc-info     { grid-area: info;     border-radius: 0; font-size: calc(var(--remotewidth)/20) !important; }
        .vc-back     { grid-area: back;     border-radius: 0 0 calc(var(--remotewidth)/11) 0; font-size: calc(var(--remotewidth)/20) !important; }

        .btn-vc {
          background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; font-size: calc(var(--remotewidth)/17); font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .12s;
        }
        .btn-vc:active { filter: brightness(.65); }

        /* ── Nav D-Pad ── */
        .grid-nav {
          display: grid;
          grid-template-columns: repeat(3, calc(var(--remotewidth) / 3.9));
          grid-template-rows:    repeat(3, calc(var(--remotewidth) / 3.9));
          grid-template-areas:
            ". nav-up ."
            "nav-left nav-ok nav-right"
            ". nav-down .";
          gap: calc(var(--remotewidth) / 48);
        }
        .nav-up    { grid-area: nav-up; }
        .nav-left  { grid-area: nav-left; }
        .nav-ok    { grid-area: nav-ok; }
        .nav-right { grid-area: nav-right; }
        .nav-down  { grid-area: nav-down; }

        .btn-nav {
          width: 100%; height: 100%;
          background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; border-radius: 50%;
          font-size: calc(var(--remotewidth)/10);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .1s, transform .1s;
        }
        .btn-nav:active { filter: brightness(.68); transform: scale(.91); }
        .btn-ok { background: var(--accent-color, #ff9800); font-size: calc(var(--remotewidth)/14); font-weight: bold; }

        /* ── Color buttons ── */
        .row-color { display: flex; gap: calc(var(--remotewidth)/18); justify-content: center; }
        .btn-color {
          background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; border-radius: 50%;
          width: calc(var(--remotewidth)/6); height: calc(var(--remotewidth)/6);
          font-size: calc(var(--remotewidth)/9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .1s, transform .1s;
        }
        .btn-color:active { filter: brightness(.7); transform: scale(.91); }
        .c-red    { background: #e74c3c; }
        .c-green  { background: #2ecc71; }
        .c-yellow { background: #f39c12; color: #222; }
        .c-blue   { background: #3498db; }

        /* ── Number pad ── */
        .grid-num {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: calc(var(--remotewidth)/58); width: 100%;
        }
        .btn-num {
          background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; border-radius: calc(var(--remotewidth)/20);
          font-size: calc(var(--remotewidth)/13); font-weight: 500;
          height: calc(var(--remotewidth)/5.2);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.28);
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .12s;
        }
        .btn-num:active { filter: brightness(.7); }
        .btn-num.small { font-size: calc(var(--remotewidth)/22); }

        /* ── Function row ── */
        .row-func { display: flex; gap: calc(var(--remotewidth)/38); width: 100%; }
        .btn-func {
          flex: 1; background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; border-radius: calc(var(--remotewidth)/20);
          font-size: calc(var(--remotewidth)/19); font-weight: 500;
          padding: calc(var(--remotewidth)/38) 0;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.28);
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .12s;
        }
        .btn-func:active { filter: brightness(.7); }

        /* ── Media controls ── */
        .row-media { display: flex; gap: calc(var(--remotewidth)/38); justify-content: center; }
        .btn-media {
          background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; border-radius: 50%;
          width: calc(var(--remotewidth)/6.2); height: calc(var(--remotewidth)/6.2);
          font-size: calc(var(--remotewidth)/13);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; user-select: none;
          transition: filter .1s, transform .1s;
        }
        .btn-media:active { filter: brightness(.7); transform: scale(.91); }

        /* ── Ripple ── */
        button::after {
          content: ''; display: block; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat; background-position: 50%;
          transform: scale(10,10); opacity: 0;
          transition: transform .45s, opacity .65s;
        }
        button:active::after { transform: scale(0,0); opacity: .22; transition: 0s; }
      </style>

      <ha-card>
        <div class="card">
          <div class="page">

            <div class="remote-title">${title}</div>

            <!-- Power -->
            <div class="power-section">
              <button class="btn-standby" data-command="POWER_STATE_0">⏻ ${t('standby_toggle')}</button>
              <div class="power-options">
                <button class="btn-power-opt" data-command="POWER_STATE_1">${t('power_off')}</button>
                <button class="btn-power-opt" data-command="POWER_STATE_2">${t('receiver_restart')}</button>
                <button class="btn-power-opt" data-command="POWER_STATE_3">${t('gui_restart')}</button>
                <button class="btn-power-opt" data-command="POWER_STATE_4">${t('wake_up')}</button>
                <button class="btn-power-opt" data-command="POWER_STATE_5">${t('standby')}</button>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Vol / CH / Menu -->
            <div class="grid-vc">
              <button class="btn-vc vc-ch-up"   data-key="KEY_CHANNELUP">CH+</button>
              <button class="btn-vc vc-menu"     data-key="KEY_MENU">${t('menu')}</button>
              <button class="btn-vc vc-vol-up"   data-key="KEY_VOLUMEUP">VOL+</button>
              <button class="btn-vc vc-ch-down"  data-key="KEY_CHANNELDOWN">CH−</button>
              <button class="btn-vc vc-mute"     data-key="KEY_MUTE">🔇</button>
              <button class="btn-vc vc-vol-down" data-key="KEY_VOLUMEDOWN">VOL−</button>
              <button class="btn-vc vc-exit"     data-key="KEY_EXIT">${t('exit')}</button>
              <button class="btn-vc vc-info"     data-key="KEY_INFO">${t('info')}</button>
              <button class="btn-vc vc-back"     data-key="KEY_BACK">${t('back')}</button>
            </div>

            <div class="divider"></div>

            <!-- Navigation D-Pad -->
            <div class="grid-nav">
              <button class="btn-nav nav-up"    data-key="KEY_UP">▲</button>
              <button class="btn-nav nav-left"  data-key="KEY_LEFT">◀</button>
              <button class="btn-nav btn-ok nav-ok" data-key="KEY_OK">OK</button>
              <button class="btn-nav nav-right" data-key="KEY_RIGHT">▶</button>
              <button class="btn-nav nav-down"  data-key="KEY_DOWN">▼</button>
            </div>

            <div class="divider"></div>

            <!-- Color buttons -->
            ${showColor ? `
            <div class="row-color">
              <button class="btn-color c-red"    data-key="KEY_RED">●</button>
              <button class="btn-color c-green"  data-key="KEY_GREEN">●</button>
              <button class="btn-color c-yellow" data-key="KEY_YELLOW">●</button>
              <button class="btn-color c-blue"   data-key="KEY_BLUE">●</button>
            </div>
            <div class="divider"></div>
            ` : ''}

            <!-- Number pad -->
            <div class="grid-num">
              ${[1,2,3,4,5,6,7,8,9].map(n =>
                `<button class="btn-num" data-key="KEY_${n}">${n}</button>`
              ).join('')}
              <button class="btn-num small" data-key="KEY_HELP">?</button>
              <button class="btn-num"       data-key="KEY_0">0</button>
              <button class="btn-num small" data-key="KEY_TEXT">TXT</button>
            </div>

            <div class="divider"></div>

            <!-- Functions -->
            <div class="row-func">
              <button class="btn-func" data-key="KEY_EPG">EPG</button>
              <button class="btn-func" data-key="KEY_LIST">${t('list')}</button>
              <button class="btn-func" data-key="KEY_TV">TV</button>
            </div>

            <!-- Media controls -->
            <div class="row-media">
              <button class="btn-media" data-key="KEY_REWIND">⏪</button>
              <button class="btn-media" data-key="KEY_PLAY">▶</button>
              <button class="btn-media" data-key="KEY_PAUSE">⏸</button>
              <button class="btn-media" data-key="KEY_STOP">⏹</button>
              <button class="btn-media" data-key="KEY_FASTFORWARD">⏩</button>
            </div>

          </div>
        </div>
      </ha-card>
    `;

    this._setupListeners();
  }

  _setupListeners() {
    const buttons = this.shadowRoot.querySelectorAll('[data-key], [data-command]');
    buttons.forEach(btn => {
      let pressTimer;
      let touchHandled = false;
      const key = () => btn.getAttribute('data-key') || btn.getAttribute('data-command');

      btn.addEventListener('touchstart', e => {
        e.preventDefault();
        touchHandled = true;
        this._send(key(), false);
        pressTimer = setTimeout(() => this._send(key(), true), 500);
      }, { passive: false });

      btn.addEventListener('touchend', e => {
        e.preventDefault();
        clearTimeout(pressTimer);
        setTimeout(() => { touchHandled = false; }, 300);
      }, { passive: false });

      btn.addEventListener('touchcancel', () => {
        clearTimeout(pressTimer);
        touchHandled = false;
      });

      btn.addEventListener('click', e => {
        e.preventDefault();
        if (touchHandled) return;
        this._send(key(), false);
      });

      btn.addEventListener('mousedown', () => {
        if (touchHandled) return;
        pressTimer = setTimeout(() => this._send(key(), true), 500);
      });

      btn.addEventListener('mouseup',    () => clearTimeout(pressTimer));
      btn.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    });
  }

  _send(key, longPress = false) {
    if (!this._hass || !key) return;
    const data = { entity_id: this.config.entity, command: [key] };
    if (longPress) data.hold_secs = 1;
    this._hass.callService('remote', 'send_command', data);
  }

  getCardSize() { return 9; }

  static getConfigElement() {
    return document.createElement('enigma2-remote-card-editor');
  }

  static getStubConfig() {
    return {
      entity: 'remote.enigma2_remote',
      name: 'Enigma2 Remote',
      colors: { buttons: '#6d767e', text: '#ffffff', background: '', border: '' },
      show_color_buttons: true,
      dimensions: { scale: 1.0, border_width: 1 },
    };
  }
}

customElements.define('enigma2-remote-card', Enigma2RemoteCard);

// ── Visual Editor ─────────────────────────────────────────────────────────────
class Enigma2RemoteCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config));
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._hasFired) this._render();
  }

  _v(path, fallback = '') {
    const parts = path.split('.');
    let v = this._config;
    for (const p of parts) { v = v?.[p]; }
    return v !== undefined && v !== null ? v : fallback;
  }

  _set(path, value) {
    const parts = path.split('.');
    const config = JSON.parse(JSON.stringify(this._config));
    let obj = config;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
    this._render();
  }

  _render() {
    const scale      = this._v('dimensions.scale', 1.0);
    const borderW    = this._v('dimensions.border_width', 1);
    const showColors = this._v('show_color_buttons', true);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--paper-font-body1_-_font-family, sans-serif);
          color: var(--primary-text-color);
        }
        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 18px 0 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.12));
        }
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 12px;
        }
        .row label {
          font-size: 14px;
          flex: 1;
          min-width: 0;
        }
        .row label span {
          display: block;
          font-size: 11px;
          color: var(--secondary-text-color);
          margin-top: 2px;
        }
        input[type="text"],
        input[type="number"] {
          width: 100%;
          box-sizing: border-box;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 14px;
          outline: none;
          margin-bottom: 10px;
        }
        input[type="text"]:focus,
        input[type="number"]:focus {
          border-color: var(--primary-color);
        }
        .color-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }
        .color-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .color-item label {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
        .color-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        input[type="color"] {
          width: 36px;
          height: 30px;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 2px;
          cursor: pointer;
          background: none;
          flex-shrink: 0;
        }
        .color-text {
          flex: 1;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 13px;
          outline: none;
          font-family: monospace;
          min-width: 0;
        }
        .slider-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .slider-row label {
          font-size: 14px;
          min-width: 130px;
        }
        input[type="range"] {
          flex: 1;
          accent-color: var(--primary-color);
        }
        .slider-val {
          font-size: 13px;
          font-weight: 600;
          min-width: 32px;
          text-align: right;
          color: var(--primary-color);
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .toggle-row label {
          font-size: 14px;
        }
        .toggle {
          position: relative;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; inset: 0;
          background: var(--divider-color, #ccc);
          border-radius: 24px;
          cursor: pointer;
          transition: background .2s;
        }
        .toggle input:checked + .toggle-slider { background: var(--primary-color, #03a9f4); }
        .toggle-slider::before {
          content: '';
          position: absolute;
          width: 18px; height: 18px;
          left: 3px; top: 3px;
          background: white;
          border-radius: 50%;
          transition: transform .2s;
          box-shadow: 0 1px 3px rgba(0,0,0,.3);
        }
        .toggle input:checked + .toggle-slider::before { transform: translateX(20px); }

        .entity-hint {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-bottom: 10px;
        }
        .bmac {
          display: block;
          margin: 20px auto 4px;
          text-align: center;
        }
        .bmac img {
          height: 36px;
          border-radius: 8px;
        }
        .code-hint {
          font-size: 11px;
          color: var(--secondary-text-color);
          text-align: center;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--divider-color, rgba(0,0,0,0.1));
        }
        .code-hint a { color: var(--primary-color); }
      </style>

      <!-- Entity -->
      <div class="section-title">Entity</div>
      <input type="text" id="entity"
        placeholder="remote.enigma2_remote_..."
        value="${this._v('entity')}" />
      <p class="entity-hint">The Remote entity created by the Enigma2 integration.</p>

      <!-- Remote Name -->
      <div class="section-title">Remote Control Name</div>
      <input type="text" id="name"
        placeholder="Enigma2 Remote"
        value="${this._v('name')}" />

      <!-- Colors -->
      <div class="section-title">Colors Configuration</div>
      <div class="color-row">
        <div class="color-item">
          <label>Buttons Color</label>
          <div class="color-wrap">
            <input type="color" id="c-buttons" value="${this._toHex(this._v('colors.buttons', '#6d767e'))}"/>
            <input type="text"  class="color-text" id="ct-buttons" value="${this._v('colors.buttons', '#6d767e')}" placeholder="#6d767e"/>
          </div>
        </div>
        <div class="color-item">
          <label>Text Color</label>
          <div class="color-wrap">
            <input type="color" id="c-text" value="${this._toHex(this._v('colors.text', '#ffffff'))}"/>
            <input type="text"  class="color-text" id="ct-text" value="${this._v('colors.text', '#ffffff')}" placeholder="#ffffff"/>
          </div>
        </div>
        <div class="color-item">
          <label>Background Color</label>
          <div class="color-wrap">
            <input type="color" id="c-background" value="${this._toHex(this._v('colors.background', '#1c1c1c'))}"/>
            <input type="text"  class="color-text" id="ct-background" value="${this._v('colors.background', '')}" placeholder="HA default"/>
          </div>
        </div>
        <div class="color-item">
          <label>Border Color</label>
          <div class="color-wrap">
            <input type="color" id="c-border" value="${this._toHex(this._v('colors.border', '#888888'))}"/>
            <input type="text"  class="color-text" id="ct-border" value="${this._v('colors.border', '')}" placeholder="HA default"/>
          </div>
        </div>
      </div>

      <!-- Color buttons toggle -->
      <div class="section-title">Color Buttons</div>
      <div class="toggle-row">
        <label>Show RED / GREEN / YELLOW / BLUE buttons</label>
        <label class="toggle">
          <input type="checkbox" id="show-color-buttons" ${showColors ? 'checked' : ''}/>
          <span class="toggle-slider"></span>
        </label>
      </div>

      <!-- Dimensions -->
      <div class="section-title">Dimensions</div>
      <div class="slider-row">
        <label>Card Scale</label>
        <input type="range" id="scale" min="0.5" max="1.5" step="0.01" value="${scale}"/>
        <span class="slider-val" id="scale-val">${parseFloat(scale).toFixed(2)}</span>
      </div>
      <div class="slider-row">
        <label>Card border width</label>
        <input type="range" id="border-width" min="0" max="6" step="1" value="${borderW}"/>
        <span class="slider-val" id="border-width-val">${borderW}px</span>
      </div>

      <!-- Buy Me a Coffee -->
      <a class="bmac" href="https://www.buymeacoffee.com/gomble" target="_blank" rel="noopener">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"/>
      </a>

      <p class="code-hint">
        More options via
        <a href="https://github.com/gomble/enigma2-remote-hacs" target="_blank" rel="noopener">
          Code Editor
        </a>
      </p>
    `;

    this._attachEditorListeners();
  }

  _toHex(v) {
    if (!v || !v.startsWith('#')) return '#888888';
    if (v.length === 4) {
      return '#' + v[1]+v[1]+v[2]+v[2]+v[3]+v[3];
    }
    return v.slice(0, 7);
  }

  _attachEditorListeners() {
    const sr = this.shadowRoot;

    const bind = (id, handler) => {
      const el = sr.getElementById(id);
      if (el) el.addEventListener('change', handler);
    };
    const bindInput = (id, handler) => {
      const el = sr.getElementById(id);
      if (el) el.addEventListener('input', handler);
    };

    // Entity
    bind('entity', e => this._set('entity', e.target.value.trim()));

    // Name
    bind('name', e => this._set('name', e.target.value));

    // Colors — sync color picker ↔ text field
    const colorPairs = [
      ['c-buttons',    'ct-buttons',    'colors.buttons'],
      ['c-text',       'ct-text',       'colors.text'],
      ['c-background', 'ct-background', 'colors.background'],
      ['c-border',     'ct-border',     'colors.border'],
    ];
    colorPairs.forEach(([pickerID, textID, path]) => {
      const picker = sr.getElementById(pickerID);
      const text   = sr.getElementById(textID);
      if (picker) {
        bindInput(pickerID, e => {
          if (text) text.value = e.target.value;
          this._set(path, e.target.value);
        });
      }
      if (text) {
        bind(textID, e => {
          const val = e.target.value.trim();
          // Update picker only if valid hex
          if (/^#[0-9a-fA-F]{3,6}$/.test(val) && picker) {
            picker.value = this._toHex(val);
          }
          this._set(path, val);
        });
      }
    });

    // Color buttons toggle
    bind('show-color-buttons', e => this._set('show_color_buttons', e.target.checked));

    // Scale slider
    const scaleEl    = sr.getElementById('scale');
    const scaleVal   = sr.getElementById('scale-val');
    if (scaleEl) {
      scaleEl.addEventListener('input', e => {
        if (scaleVal) scaleVal.textContent = parseFloat(e.target.value).toFixed(2);
      });
      scaleEl.addEventListener('change', e => {
        this._set('dimensions.scale', parseFloat(e.target.value));
      });
    }

    // Border width slider
    const bwEl  = sr.getElementById('border-width');
    const bwVal = sr.getElementById('border-width-val');
    if (bwEl) {
      bwEl.addEventListener('input', e => {
        if (bwVal) bwVal.textContent = e.target.value + 'px';
      });
      bwEl.addEventListener('change', e => {
        this._set('dimensions.border_width', parseInt(e.target.value));
      });
    }
  }
}

customElements.define('enigma2-remote-card-editor', Enigma2RemoteCardEditor);

// ── Registration ──────────────────────────────────────────────────────────────
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'enigma2-remote-card',
  name: 'Enigma2 Remote Card',
  description: 'Remote control card for Enigma2 devices via OpenWebif',
  preview: false,
  documentationURL: 'https://github.com/gomble/enigma2-remote-hacs',
});
