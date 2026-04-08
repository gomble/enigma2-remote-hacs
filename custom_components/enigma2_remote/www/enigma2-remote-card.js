/**
 * Enigma2 Remote Control Card for Home Assistant
 * Visual design inspired by LG WebOS Remote Control
 * https://github.com/madmicio/LG-WebOS-Remote-Control
 */

// ── Translations ─────────────────────────────────────────────────────────────
const ENIGMA2_TRANSLATIONS = {
  de: {
    standby_toggle: 'Standby Umschalten', power_off: 'Ausschalten',
    receiver_restart: 'Rcvr Neustart', gui_restart: 'GUI Neustart',
    wake_up: 'Aufwecken', standby: 'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  en: {
    standby_toggle: 'Toggle Standby', power_off: 'Power Off',
    receiver_restart: 'Rcvr Restart', gui_restart: 'GUI Restart',
    wake_up: 'Wake Up', standby: 'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  es: {
    standby_toggle: 'Alternar Standby', power_off: 'Apagar',
    receiver_restart: 'Reiniciar Rcvr', gui_restart: 'Reiniciar GUI',
    wake_up: 'Despertar', standby: 'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  fr: {
    standby_toggle: 'Basculer Veille', power_off: 'Éteindre',
    receiver_restart: 'Redém. Rcvr', gui_restart: 'Redém. GUI',
    wake_up: 'Réveiller', standby: 'Veille',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  it: {
    standby_toggle: 'Attiva/Disattiva Standby', power_off: 'Spegni',
    receiver_restart: 'Riavvia Rcvr', gui_restart: 'Riavvia GUI',
    wake_up: 'Sveglia', standby: 'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  pt: {
    standby_toggle: 'Alternar Standby', power_off: 'Desligar',
    receiver_restart: 'Reiniciar Rcvr', gui_restart: 'Reiniciar GUI',
    wake_up: 'Despertar', standby: 'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  ru: {
    standby_toggle: 'Переключить режим ожидания', power_off: 'Выключить',
    receiver_restart: 'Перезапуск ресивера', gui_restart: 'Перезапуск GUI',
    wake_up: 'Пробудить', standby: 'Режим ожидания',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  tr: {
    standby_toggle: 'Bekleme Geçiş', power_off: 'Kapat',
    receiver_restart: 'Alıcı Yeniden', gui_restart: 'GUI Yeniden',
    wake_up: 'Uyandır', standby: 'Bekleme',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  zh: {
    standby_toggle: '切换待机', power_off: '关机',
    receiver_restart: '重启接收器', gui_restart: '重启界面',
    wake_up: '唤醒', standby: '待机',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  ar: {
    standby_toggle: 'تبديل الاستعداد', power_off: 'إيقاف التشغيل',
    receiver_restart: 'إعادة تشغيل جهاز الاستقبال', gui_restart: 'إعادة تشغيل الواجهة',
    wake_up: 'إيقاظ', standby: 'استعداد',
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
    return (v !== undefined && v !== null && v !== '') ? v : fallback;
  }

  _render() {
    const title     = this.config.name || 'Enigma2 Remote';
    const scale     = parseFloat(this._cfg('dimensions.scale', 1.0));
    const bdrW      = parseInt(this._cfg('dimensions.border_width', 1));
    const w         = Math.round(260 * scale);
    const lang      = this._lang || 'en';
    const t         = (key) => _t(lang, key);
    const btnColor  = this._cfg('colors.buttons',    '#6d767e');
    const txtColor  = this._cfg('colors.text',       '#ffffff');
    const bgColor   = this._cfg('colors.background', '');
    const bdrColor  = this._cfg('colors.border',     'var(--primary-text-color, #888)');
    const showColor = this._cfg('show_color_buttons', true);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --remotewidth:  ${w}px;
          --btn-color:    ${btnColor};
          --btn-text:     ${txtColor};
          --border-color: ${bdrColor};
          --border-width: ${bdrW}px;
        }
        /* Strip ha-card of its own background/shadow so only the .page border is visible */
        ha-card {
          background: ${bgColor || 'transparent'} !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          border: none !important;
        }
        .card {
          display: flex;
          justify-content: center;
          padding: 12px 8px;
          background: transparent;
        }
        .page {
          width: var(--remotewidth);
          border: var(--border-width) solid var(--border-color);
          border-radius: calc(var(--remotewidth) / 7);
          padding: calc(var(--remotewidth) / 14) calc(var(--remotewidth) / 13);
          display: flex; flex-direction: column; align-items: center;
          gap: calc(var(--remotewidth) / 26); box-sizing: border-box;
          background: ${bgColor || 'var(--ha-card-background, var(--card-background-color, #1c1c1c))'};
        }
        .remote-title {
          font-size: calc(var(--remotewidth) / 15); font-weight: 500;
          color: var(--primary-text-color); text-align: center; letter-spacing: 0.3px;
        }
        .divider {
          width: 85%; height: 1px;
          background: var(--divider-color, rgba(128,128,128,0.18));
        }
        /* Power */
        .power-section { width: 100%; display: flex; flex-direction: column; gap: calc(var(--remotewidth)/55); }
        .btn-standby {
          width: 100%; background: #c0392b; border: none; color: #fff; cursor: pointer;
          border-radius: calc(var(--remotewidth)/13); font-size: calc(var(--remotewidth)/16);
          font-weight: 600; padding: calc(var(--remotewidth)/32) 0;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          box-shadow: 0 3px 10px rgba(192,57,43,.45);
          position: relative; overflow: hidden; box-sizing: border-box;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .12s;
        }
        .btn-standby:active { filter: brightness(.72); }
        .power-options { display: grid; grid-template-columns: repeat(3,1fr); gap: calc(var(--remotewidth)/65); }
        .btn-power-opt {
          background: #922b21; border: none; color: #fff; cursor: pointer;
          border-radius: calc(var(--remotewidth)/22); font-size: calc(var(--remotewidth)/23);
          font-weight: 500; padding: calc(var(--remotewidth)/42) 2px;
          line-height: 1.3; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,.4);
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .12s;
        }
        .btn-power-opt:active { filter: brightness(.68); }
        /* Vol/CH block */
        .grid-vc {
          display: grid; grid-template-columns: repeat(3,1fr);
          grid-template-rows: repeat(3,calc(var(--remotewidth)/6.2));
          grid-template-areas: "ch_up menu vol_up" "ch_down mute vol_down" "exit info back";
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
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .12s;
        }
        .btn-vc:active { filter: brightness(.65); }
        /* Nav */
        .grid-nav {
          display: grid;
          grid-template-columns: repeat(3,calc(var(--remotewidth)/3.9));
          grid-template-rows:    repeat(3,calc(var(--remotewidth)/3.9));
          grid-template-areas: ". nav-up ." "nav-left nav-ok nav-right" ". nav-down .";
          gap: calc(var(--remotewidth)/48);
        }
        .nav-up    { grid-area: nav-up; }
        .nav-left  { grid-area: nav-left; }
        .nav-ok    { grid-area: nav-ok; }
        .nav-right { grid-area: nav-right; }
        .nav-down  { grid-area: nav-down; }
        .btn-nav {
          width: 100%; height: 100%; background: var(--btn-color); border: none;
          color: var(--btn-text); cursor: pointer; border-radius: 50%;
          font-size: calc(var(--remotewidth)/10);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35); position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .1s, transform .1s;
        }
        .btn-nav:active { filter: brightness(.68); transform: scale(.91); }
        .btn-ok { background: var(--accent-color,#ff9800); font-size: calc(var(--remotewidth)/14); font-weight: bold; }
        /* Colors */
        .row-color { display: flex; gap: calc(var(--remotewidth)/18); justify-content: center; }
        .btn-color {
          background: var(--btn-color); border: none; color: var(--btn-text); cursor: pointer;
          border-radius: 50%; width: calc(var(--remotewidth)/6); height: calc(var(--remotewidth)/6);
          font-size: calc(var(--remotewidth)/9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35); position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .1s, transform .1s;
        }
        .btn-color:active { filter: brightness(.7); transform: scale(.91); }
        .c-red    { background: #e74c3c; color: #fff; }
        .c-green  { background: #2ecc71; color: #fff; }
        .c-yellow { background: #f39c12; color: #fff; }
        .c-blue   { background: #3498db; color: #fff; }
        /* Numpad */
        .grid-num { display: grid; grid-template-columns: repeat(3,1fr); gap: calc(var(--remotewidth)/58); width: 100%; }
        .btn-num {
          background: var(--btn-color); border: none; color: var(--btn-text); cursor: pointer;
          border-radius: calc(var(--remotewidth)/20); font-size: calc(var(--remotewidth)/13);
          font-weight: 500; height: calc(var(--remotewidth)/5.2);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.28); position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .12s;
        }
        .btn-num:active { filter: brightness(.7); }
        .btn-num.small { font-size: calc(var(--remotewidth)/22); }
        /* Functions */
        .row-func { display: flex; gap: calc(var(--remotewidth)/38); width: 100%; }
        .btn-func {
          flex: 1; background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; border-radius: calc(var(--remotewidth)/20);
          font-size: calc(var(--remotewidth)/19); font-weight: 500;
          padding: calc(var(--remotewidth)/38) 0;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.28); position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .12s;
        }
        .btn-func:active { filter: brightness(.7); }
        /* Media */
        .row-media { display: flex; gap: calc(var(--remotewidth)/38); justify-content: center; }
        .btn-media {
          background: var(--btn-color); border: none; color: var(--btn-text); cursor: pointer;
          border-radius: 50%; width: calc(var(--remotewidth)/6.2); height: calc(var(--remotewidth)/6.2);
          font-size: calc(var(--remotewidth)/13);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35); position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .1s, transform .1s;
        }
        .btn-media:active { filter: brightness(.7); transform: scale(.91); }
        /* Ripple */
        button::after {
          content: ''; display: block; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle,#fff 10%,transparent 10.01%);
          background-repeat: no-repeat; background-position: 50%;
          transform: scale(10,10); opacity: 0; transition: transform .45s, opacity .65s;
        }
        button:active::after { transform: scale(0,0); opacity: .22; transition: 0s; }
      </style>
      <ha-card>
        <div class="card"><div class="page">
          <div class="remote-title">${title}</div>
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
          <div class="grid-nav">
            <button class="btn-nav nav-up"    data-key="KEY_UP">▲</button>
            <button class="btn-nav nav-left"  data-key="KEY_LEFT">◀</button>
            <button class="btn-nav btn-ok nav-ok" data-key="KEY_OK">OK</button>
            <button class="btn-nav nav-right" data-key="KEY_RIGHT">▶</button>
            <button class="btn-nav nav-down"  data-key="KEY_DOWN">▼</button>
          </div>
          <div class="divider"></div>
          ${showColor ? `
          <div class="row-color">
            <button class="btn-color c-red"    data-key="KEY_RED">●</button>
            <button class="btn-color c-green"  data-key="KEY_GREEN">●</button>
            <button class="btn-color c-yellow" data-key="KEY_YELLOW">●</button>
            <button class="btn-color c-blue"   data-key="KEY_BLUE">●</button>
          </div>
          <div class="divider"></div>
          ` : ''}
          <div class="grid-num">
            ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="btn-num" data-key="KEY_${n}">${n}</button>`).join('')}
            <button class="btn-num small" data-key="KEY_HELP">?</button>
            <button class="btn-num"       data-key="KEY_0">0</button>
            <button class="btn-num small" data-key="KEY_TEXT">TXT</button>
          </div>
          <div class="divider"></div>
          <div class="row-func">
            <button class="btn-func" data-key="KEY_EPG">EPG</button>
            <button class="btn-func" data-key="KEY_LIST">${t('list')}</button>
            <button class="btn-func" data-key="KEY_TV">TV</button>
          </div>
          <div class="row-media">
            <button class="btn-media" data-key="KEY_REWIND">⏪</button>
            <button class="btn-media" data-key="KEY_PLAY">▶</button>
            <button class="btn-media" data-key="KEY_PAUSE">⏸</button>
            <button class="btn-media" data-key="KEY_STOP">⏹</button>
            <button class="btn-media" data-key="KEY_FASTFORWARD">⏩</button>
          </div>
        </div></div>
      </ha-card>`;

    this._setupListeners();
  }

  _setupListeners() {
    const haptic = this._cfg('haptic_feedback', false);
    const fireHaptic = () => {
      if (!haptic) return;
      this.dispatchEvent(new CustomEvent('haptic', {
        detail: 'light', bubbles: true, composed: true,
      }));
    };
    this.shadowRoot.querySelectorAll('[data-key],[data-command]').forEach(btn => {
      let pressTimer, touchHandled = false;
      const key = () => btn.getAttribute('data-key') || btn.getAttribute('data-command');
      btn.addEventListener('touchstart', e => {
        e.preventDefault(); touchHandled = true;
        fireHaptic();
        this._send(key(), false);
        pressTimer = setTimeout(() => { fireHaptic(); this._send(key(), true); }, 500);
      }, { passive: false });
      btn.addEventListener('touchend', e => {
        e.preventDefault(); clearTimeout(pressTimer);
        setTimeout(() => { touchHandled = false; }, 300);
      }, { passive: false });
      btn.addEventListener('touchcancel', () => { clearTimeout(pressTimer); touchHandled = false; });
      btn.addEventListener('click', e => { e.preventDefault(); if (!touchHandled) { fireHaptic(); this._send(key(), false); } });
      btn.addEventListener('mousedown', () => { if (!touchHandled) pressTimer = setTimeout(() => { fireHaptic(); this._send(key(), true); }, 500); });
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
      entity: '',
      name: 'Enigma2 Remote',
      colors: { buttons: '#6d767e', text: '#ffffff', background: '', border: '' },
      show_color_buttons: true,
      haptic_feedback: false,
      dimensions: { scale: 1.0, border_width: 1 },
    };
  }
}

customElements.define('enigma2-remote-card', Enigma2RemoteCard);


// ── Visual Editor (uses ha-form — no re-render on input = no focus loss) ──────
class Enigma2RemoteCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config  = {};
    this._hass    = null;
    this._ready   = false;
  }

  // Called by HA when user opens the editor
  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config));
    if (this._ready) {
      // Already rendered — only update form data, no re-render (preserves focus)
      this._updateForm();
    } else {
      this._initialRender();
    }
  }

  set hass(hass) {
    this._hass = hass;
    // Pass hass to form without re-rendering
    const form = this.shadowRoot.querySelector('ha-form');
    if (form) form.hass = hass;
  }

  // hex string → [r, g, b] array (null if invalid/empty)
  _hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return null;
    const m = hex.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
  }

  // [r, g, b] array → hex string (null if invalid)
  _rgbToHex(rgb) {
    if (!Array.isArray(rgb) || rgb.length < 3) return null;
    return '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  }

  // Flatten nested config into the flat object ha-form expects
  _toFormData(cfg) {
    return {
      entity:             cfg.entity || '',
      name:               cfg.name   || '',
      color_buttons:      this._hexToRgb(cfg.colors?.buttons)    ?? [109, 118, 126],
      color_text:         this._hexToRgb(cfg.colors?.text)       ?? [255, 255, 255],
      color_background:   this._hexToRgb(cfg.colors?.background) ?? null,
      color_border:       this._hexToRgb(cfg.colors?.border)     ?? null,
      show_color_buttons: cfg.show_color_buttons !== false,
      haptic_feedback:    cfg.haptic_feedback === true,
      scale:              parseFloat(cfg.dimensions?.scale        ?? 1.0),
      border_width:       parseInt  (cfg.dimensions?.border_width ?? 1),
    };
  }

  // Map flat form data back to nested card config
  _fromFormData(data) {
    return {
      ...this._config,
      entity: data.entity,
      name:   data.name,
      colors: {
        buttons:    this._rgbToHex(data.color_buttons)    ?? '#6d767e',
        text:       this._rgbToHex(data.color_text)       ?? '#ffffff',
        background: this._rgbToHex(data.color_background) ?? '',
        border:     this._rgbToHex(data.color_border)     ?? '',
      },
      show_color_buttons: data.show_color_buttons,
      haptic_feedback:    data.haptic_feedback,
      dimensions: {
        scale:        data.scale,
        border_width: data.border_width,
      },
    };
  }

  _schema() {
    return [
      {
        name:     'entity',
        label:    'Enigma2 Remote Entity',
        required: true,
        selector: { entity: { domain: 'remote', integration: 'enigma2_remote' } },
      },
      {
        name:     'name',
        label:    'Remote Control Name (optional)',
        selector: { text: {} },
      },
      // Colors section header (constant label)
      {
        name:  '_colors_heading',
        label: 'Colors Configuration',
        type:  'constant',
      },
      {
        name:     'color_buttons',
        label:    'Buttons Color',
        selector: { color_rgb: {} },
      },
      {
        name:     'color_text',
        label:    'Text Color',
        selector: { color_rgb: {} },
      },
      {
        name:     'color_background',
        label:    'Background Color (leave empty for HA default)',
        selector: { color_rgb: {} },
      },
      {
        name:     'color_border',
        label:    'Border Color (leave empty for HA default)',
        selector: { color_rgb: {} },
      },
      {
        name:     'show_color_buttons',
        label:    'Show Color Buttons (RED / GREEN / YELLOW / BLUE)',
        selector: { boolean: {} },
      },
      {
        name:     'haptic_feedback',
        label:    'Haptic Feedback (iOS)',
        selector: { boolean: {} },
      },
      // Dimensions section header
      {
        name:  '_dims_heading',
        label: 'Dimensions',
        type:  'constant',
      },
      {
        name:     'scale',
        label:    'Card Scale',
        selector: { number: { min: 0.5, max: 1.5, step: 0.01, mode: 'slider' } },
      },
      {
        name:     'border_width',
        label:    'Card Border Width',
        selector: { number: { min: 0, max: 6, step: 1, mode: 'slider', unit_of_measurement: 'px' } },
      },
    ];
  }

  _updateForm() {
    const form = this.shadowRoot.querySelector('ha-form');
    if (form) form.data = this._toFormData(this._config);
  }

  _initialRender() {
    this._ready = true;

    this.shadowRoot.innerHTML = `
      <style>
        ha-form { display: block; }
        .bmac {
          display: flex;
          justify-content: center;
          padding: 12px 0 4px;
        }
        .bmac img {
          height: 40px;
          border-radius: 8px;
        }
        .footer {
          font-size: 11px;
          color: var(--secondary-text-color);
          text-align: center;
          padding: 8px 16px 4px;
        }
        .footer a { color: var(--primary-color); }
      </style>
      <ha-form></ha-form>
      <div class="bmac">
        <a href="https://www.buymeacoffee.com/gomble" target="_blank" rel="noopener">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"/>
        </a>
      </div>
      <p class="footer">
        More options via
        <a href="https://github.com/gomble/enigma2-remote-hacs" target="_blank" rel="noopener">
          Code Editor
        </a>
      </p>
    `;

    const form = this.shadowRoot.querySelector('ha-form');
    form.hass         = this._hass;
    form.schema       = this._schema();
    form.data         = this._toFormData(this._config);
    form.computeLabel = (s) => s.label || s.name;

    // value-changed fires on every user interaction — DO NOT re-render here
    form.addEventListener('value-changed', e => {
      const newConfig = this._fromFormData(e.detail.value);
      this._config = newConfig;
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      }));
    });
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
