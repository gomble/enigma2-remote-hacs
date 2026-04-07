/**
 * Enigma2 Remote Control Card for Home Assistant
 * Visual design inspired by LG WebOS Remote Control
 * https://github.com/madmicio/LG-WebOS-Remote-Control
 */

// ── Translations ────────────────────────────────────────────────────────────
const ENIGMA2_TRANSLATIONS = {
  de: {
    standby_toggle:   'Standby Umschalten',
    power_off:        'Ausschalten',
    receiver_restart: 'Rcvr Neustart',
    gui_restart:      'GUI Neustart',
    wake_up:          'Aufwecken',
    standby:          'Standby',
    menu:             'MENU',
    exit:             'EXIT',
    info:             'INFO',
    back:             'BACK',
    list:             'LIST',
  },
  en: {
    standby_toggle:   'Toggle Standby',
    power_off:        'Power Off',
    receiver_restart: 'Rcvr Restart',
    gui_restart:      'GUI Restart',
    wake_up:          'Wake Up',
    standby:          'Standby',
    menu:             'MENU',
    exit:             'EXIT',
    info:             'INFO',
    back:             'BACK',
    list:             'LIST',
  },
  fr: {
    standby_toggle:   'Basculer Veille',
    power_off:        'Éteindre',
    receiver_restart: 'Redém. Rcvr',
    gui_restart:      'Redém. GUI',
    wake_up:          'Réveiller',
    standby:          'Veille',
    menu:             'MENU',
    exit:             'EXIT',
    info:             'INFO',
    back:             'BACK',
    list:             'LIST',
  },
  tr: {
    standby_toggle:   'Bekleme Geçiş',
    power_off:        'Kapat',
    receiver_restart: 'Alıcı Yeniden',
    gui_restart:      'GUI Yeniden',
    wake_up:          'Uyandır',
    standby:          'Bekleme',
    menu:             'MENU',
    exit:             'EXIT',
    info:             'INFO',
    back:             'BACK',
    list:             'LIST',
  },
};

function _t(lang, key) {
  const base = lang ? lang.split('-')[0].toLowerCase() : 'en';
  const dict = ENIGMA2_TRANSLATIONS[base] || ENIGMA2_TRANSLATIONS['en'];
  return dict[key] || ENIGMA2_TRANSLATIONS['en'][key] || key;
}
// ────────────────────────────────────────────────────────────────────────────

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
    // Re-render when language changes
    const lang = hass.language || hass.locale?.language || 'en';
    if (lang !== this._lang) {
      this._lang = lang;
      this._render();
    }
  }

  _render() {
    const title = this.config.name || 'Enigma2 Remote';
    const w = this.config.width ? parseInt(this.config.width) : 260;
    const lang = this._lang || 'en';
    const t = (key) => _t(lang, key);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --remotewidth: ${w}px;
          --btn-color:        var(--custom-btn-color,    #6d767e);
          --btn-text:         var(--custom-btn-text,     #ffffff);
          --border-color:     var(--custom-border-color, var(--primary-text-color, #888));
          --border-width:     var(--custom-border-width, 1px);
        }

        /* Card shell */
        ha-card {
          background: var(--ha-card-background, var(--card-background-color));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          overflow: hidden;
        }

        .card {
          display: flex;
          justify-content: center;
          padding: 12px 8px;
        }

        /* Remote body */
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

        /* Header */
        .remote-title {
          font-size: calc(var(--remotewidth) / 15);
          font-weight: 500;
          color: var(--primary-text-color);
          text-align: center;
          letter-spacing: 0.3px;
        }

        /* Divider */
        .divider {
          width: 85%;
          height: 1px;
          background: var(--divider-color, rgba(128,128,128,0.18));
        }

        /* ================================================
           POWER SECTION
        ================================================ */
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
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
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
          border: none;
          color: #fff;
          cursor: pointer;
          border-radius: calc(var(--remotewidth) / 22);
          font-size: calc(var(--remotewidth) / 23);
          font-weight: 500;
          padding: calc(var(--remotewidth) / 42) 2px;
          line-height: 1.3;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.4);
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          transition: filter .12s;
        }
        .btn-power-opt:active { filter: brightness(.68); }

        /* ================================================
           VOL / CH BLOCK  (3×3 connected grid)
        ================================================ */
        .grid-vc {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows:    repeat(3, calc(var(--remotewidth) / 6.2));
          grid-template-areas:
            "ch_up   menu    vol_up"
            "ch_down mute    vol_down"
            "exit    info    back";
          gap: 2px;
          width: 100%;
        }

        .vc-ch-up    { grid-area: ch_up; }
        .vc-menu     { grid-area: menu; }
        .vc-vol-up   { grid-area: vol_up; }
        .vc-ch-down  { grid-area: ch_down; }
        .vc-mute     { grid-area: mute; background: #e67e22 !important; font-size: calc(var(--remotewidth) / 10) !important; }
        .vc-vol-down { grid-area: vol_down; }
        .vc-exit     { grid-area: exit; }
        .vc-info     { grid-area: info; font-size: calc(var(--remotewidth) / 20) !important; }
        .vc-back     { grid-area: back; font-size: calc(var(--remotewidth) / 20) !important; }

        /* Corner radii for connected-block look */
        .vc-ch-up    { border-radius: calc(var(--remotewidth)/11) 0 0 0; }
        .vc-menu     { border-radius: 0; font-size: calc(var(--remotewidth) / 21) !important; }
        .vc-vol-up   { border-radius: 0 calc(var(--remotewidth)/11) 0 0; }
        .vc-ch-down  { border-radius: 0; }
        .vc-mute     { border-radius: 0; }
        .vc-vol-down { border-radius: 0; }
        .vc-exit     { border-radius: 0 0 0 calc(var(--remotewidth)/11); font-size: calc(var(--remotewidth) / 20) !important; }
        .vc-info     { border-radius: 0; }
        .vc-back     { border-radius: 0 0 calc(var(--remotewidth)/11) 0; }

        .btn-vc {
          background: var(--btn-color);
          border: none;
          color: var(--btn-text);
          cursor: pointer;
          font-size: calc(var(--remotewidth) / 17);
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          transition: filter .12s;
        }
        .btn-vc:active { filter: brightness(.65); }

        /* ================================================
           NAVIGATION D-PAD  (3×3 grid, circular buttons)
        ================================================ */
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
          width: 100%;
          height: 100%;
          background: var(--btn-color);
          border: none;
          color: var(--btn-text);
          cursor: pointer;
          border-radius: 50%;
          font-size: calc(var(--remotewidth) / 10);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          transition: filter .1s, transform .1s;
        }
        .btn-nav:active {
          filter: brightness(.68);
          transform: scale(.91);
        }

        .btn-ok {
          background: var(--accent-color, #ff9800);
          font-size: calc(var(--remotewidth) / 14);
          font-weight: bold;
        }

        /* ================================================
           COLOR BUTTONS
        ================================================ */
        .row-color {
          display: flex;
          gap: calc(var(--remotewidth) / 18);
          justify-content: center;
        }

        .btn-color {
          background: var(--btn-color);
          border: none;
          color: var(--btn-text);
          cursor: pointer;
          border-radius: 50%;
          width:  calc(var(--remotewidth) / 6);
          height: calc(var(--remotewidth) / 6);
          font-size: calc(var(--remotewidth) / 9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          transition: filter .1s, transform .1s;
        }
        .btn-color:active { filter: brightness(.7); transform: scale(.91); }
        .c-red    { background: #e74c3c; }
        .c-green  { background: #2ecc71; }
        .c-yellow { background: #f39c12; color: #222; }
        .c-blue   { background: #3498db; }

        /* ================================================
           NUMBER PAD
        ================================================ */
        .grid-num {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: calc(var(--remotewidth) / 58);
          width: 100%;
        }

        .btn-num {
          background: var(--btn-color);
          border: none;
          color: var(--btn-text);
          cursor: pointer;
          border-radius: calc(var(--remotewidth) / 20);
          font-size: calc(var(--remotewidth) / 13);
          font-weight: 500;
          height: calc(var(--remotewidth) / 5.2);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.28);
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          transition: filter .12s;
        }
        .btn-num:active { filter: brightness(.7); }
        .btn-num.small  { font-size: calc(var(--remotewidth) / 22); }

        /* ================================================
           FUNCTION ROW  (EPG / LIST / TV)
        ================================================ */
        .row-func {
          display: flex;
          gap: calc(var(--remotewidth) / 38);
          width: 100%;
        }

        .btn-func {
          flex: 1;
          background: var(--btn-color);
          border: none;
          color: var(--btn-text);
          cursor: pointer;
          border-radius: calc(var(--remotewidth) / 20);
          font-size: calc(var(--remotewidth) / 19);
          font-weight: 500;
          padding: calc(var(--remotewidth) / 38) 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.28);
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          transition: filter .12s;
        }
        .btn-func:active { filter: brightness(.7); }

        /* ================================================
           MEDIA CONTROLS
        ================================================ */
        .row-media {
          display: flex;
          gap: calc(var(--remotewidth) / 38);
          justify-content: center;
        }

        .btn-media {
          background: var(--btn-color);
          border: none;
          color: var(--btn-text);
          cursor: pointer;
          border-radius: 50%;
          width:  calc(var(--remotewidth) / 6.2);
          height: calc(var(--remotewidth) / 6.2);
          font-size: calc(var(--remotewidth) / 13);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          transition: filter .1s, transform .1s;
        }
        .btn-media:active { filter: brightness(.7); transform: scale(.91); }

        /* ================================================
           RIPPLE EFFECT (all buttons)
        ================================================ */
        button::after {
          content: '';
          display: block;
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform .45s, opacity .65s;
        }
        button:active::after {
          transform: scale(0, 0);
          opacity: .22;
          transition: 0s;
        }
      </style>

      <ha-card>
        <div class="card">
          <div class="page">

            <!-- ── TITLE ── -->
            <div class="remote-title">${title}</div>

            <!-- ── POWER ── -->
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

            <!-- ── VOL / CH / MENU ── -->
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

            <!-- ── NAVIGATION D-PAD ── -->
            <div class="grid-nav">
              <button class="btn-nav nav-up"    data-key="KEY_UP">▲</button>
              <button class="btn-nav nav-left"  data-key="KEY_LEFT">◀</button>
              <button class="btn-nav btn-ok nav-ok" data-key="KEY_OK">OK</button>
              <button class="btn-nav nav-right" data-key="KEY_RIGHT">▶</button>
              <button class="btn-nav nav-down"  data-key="KEY_DOWN">▼</button>
            </div>

            <div class="divider"></div>

            <!-- ── COLOR BUTTONS ── -->
            <div class="row-color">
              <button class="btn-color c-red"    data-key="KEY_RED">●</button>
              <button class="btn-color c-green"  data-key="KEY_GREEN">●</button>
              <button class="btn-color c-yellow" data-key="KEY_YELLOW">●</button>
              <button class="btn-color c-blue"   data-key="KEY_BLUE">●</button>
            </div>

            <div class="divider"></div>

            <!-- ── NUMBER PAD ── -->
            <div class="grid-num">
              ${[1,2,3,4,5,6,7,8,9].map(n =>
                `<button class="btn-num" data-key="KEY_${n}">${n}</button>`
              ).join('')}
              <button class="btn-num small" data-key="KEY_HELP">?</button>
              <button class="btn-num"       data-key="KEY_0">0</button>
              <button class="btn-num small" data-key="KEY_TEXT">TXT</button>
            </div>

            <div class="divider"></div>

            <!-- ── FUNCTIONS ── -->
            <div class="row-func">
              <button class="btn-func" data-key="KEY_EPG">EPG</button>
              <button class="btn-func" data-key="KEY_LIST">${t('list')}</button>
              <button class="btn-func" data-key="KEY_TV">TV</button>
            </div>

            <!-- ── MEDIA CONTROLS ── -->
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

  static getStubConfig() {
    return { entity: 'remote.enigma2_remote', name: 'Enigma2 Remote' };
  }
}

customElements.define('enigma2-remote-card', Enigma2RemoteCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'enigma2-remote-card',
  name: 'Enigma2 Remote Card',
  description: 'Remote control card for Enigma2 devices via OpenWebif',
  preview: false,
  documentationURL: 'https://github.com/gomble/enigma2-remote-hacs',
});
