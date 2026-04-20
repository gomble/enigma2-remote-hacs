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
  nl: {
    standby_toggle: 'Standby Wisselen', power_off: 'Uitschakelen',
    receiver_restart: 'Ontvanger Herstart', gui_restart: 'GUI Herstart',
    wake_up: 'Wekken', standby: 'Standby',
    menu: 'MENU', exit: 'EXIT', info: 'INFO', back: 'BACK', list: 'LIST',
  },
  pl: {
    standby_toggle: 'Przełącz Czuwanie', power_off: 'Wyłącz',
    receiver_restart: 'Restart Odbiornika', gui_restart: 'Restart GUI',
    wake_up: 'Wybudź', standby: 'Czuwanie',
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

// ── T9 Multi-Tap Map ──────────────────────────────────────────────────────────
const T9_CHARS = {
  '1': [...'.:;+-*/=_@#$%&'],
  '2': [...'abcäàä2ABCAAA'],
  '3': [...'defdéé3DEFE'],
  '4': [...'ghi4GHI'],
  '5': [...'jkl5JKL'],
  '6': [...'mnoöó6MNOO'],
  '7': [...'pqrsß7PQRS'],
  '8': [...'tuvüù8TUVU'],
  '9': [...'wxyz9WXYZ'],
  '0': [...'0,?!\'"\\()<>[]{}~^`|'],
};
const T9_LOOKUP = {};
for (const [digit, chars] of Object.entries(T9_CHARS)) {
  chars.forEach((ch, idx) => {
    if (!(ch in T9_LOOKUP)) {
      T9_LOOKUP[ch] = { key: `KEY_${digit}`, count: idx + 1 };
    }
  });
}

// ── Editor Translations ───────────────────────────────────────────────────────
const EDITOR_TRANSLATIONS = {
  en: {
    entity:               'Enigma2 Remote Entity',
    name:                 'Remote Control Name (optional)',
    _colors_heading:      'Colors',
    color_buttons:        'Buttons Color',
    color_text:           'Text Color',
    color_background:     'Background Color (leave empty for HA default)',
    color_border:         'Border Color (leave empty for HA default)',
    show_color_buttons:   'Show Color Buttons (RED / GREEN / YELLOW / BLUE)',
    show_standby_options: 'Show Standby Options (Power Off, Restart, Wake Up, Standby)',
    show_media_buttons:   'Show Media Buttons (Play, Pause, Stop, Rewind, Record, ...)',
    show_extra_buttons:   'Show Extra Buttons (TXT, Audio, Sub, TV, PVR, Setup, Timer, ...)',
    haptic_feedback:      'Haptic Feedback (iOS)',
    _dims_heading:        'Dimensions',
    scale:                'Card Scale',
    border_width:         'Card Border Width',
  },
  de: {
    entity:               'Enigma2 Fernbedienung Entity',
    name:                 'Name der Fernbedienung (optional)',
    _colors_heading:      'Farben',
    color_buttons:        'Tastenfarbe',
    color_text:           'Textfarbe',
    color_background:     'Hintergrundfarbe (leer = HA Standard)',
    color_border:         'Rahmenfarbe (leer = HA Standard)',
    show_color_buttons:   'Farbtasten anzeigen (ROT / GRÜN / GELB / BLAU)',
    show_standby_options: 'Standby-Optionen anzeigen (Ausschalten, Neustart, Aufwecken, Standby)',
    show_media_buttons:   'Medientasten anzeigen (Play, Pause, Stop, Rückspulen, Aufnahme, ...)',
    show_extra_buttons:   'Extra-Tasten anzeigen (TXT, Audio, Sub, TV, PVR, Setup, Timer, ...)',
    haptic_feedback:      'Haptisches Feedback (iOS)',
    _dims_heading:        'Abmessungen',
    scale:                'Kartenskalierung',
    border_width:         'Rahmenbreite',
  },
  es: {
    entity:               'Entidad Enigma2 Remote',
    name:                 'Nombre del mando (opcional)',
    _colors_heading:      'Colores',
    color_buttons:        'Color de botones',
    color_text:           'Color de texto',
    color_background:     'Color de fondo (vacío = predeterminado HA)',
    color_border:         'Color de borde (vacío = predeterminado HA)',
    show_color_buttons:   'Mostrar botones de color (ROJO / VERDE / AMARILLO / AZUL)',
    show_standby_options: 'Mostrar opciones de espera (Apagar, Reiniciar, Despertar, Espera)',
    show_media_buttons:   'Mostrar botones multimedia (Play, Pausa, Stop, Rebobinar, Grabar, ...)',
    show_extra_buttons:   'Mostrar botones extra (TXT, Audio, Sub, TV, PVR, Setup, Temporizador, ...)',
    haptic_feedback:      'Retroalimentación háptica (iOS)',
    _dims_heading:        'Dimensiones',
    scale:                'Escala de la tarjeta',
    border_width:         'Ancho del borde',
  },
  fr: {
    entity:               'Entité Enigma2 Remote',
    name:                 'Nom de la télécommande (optionnel)',
    _colors_heading:      'Couleurs',
    color_buttons:        'Couleur des boutons',
    color_text:           'Couleur du texte',
    color_background:     'Couleur de fond (vide = défaut HA)',
    color_border:         'Couleur de bordure (vide = défaut HA)',
    show_color_buttons:   'Afficher les boutons couleur (ROUGE / VERT / JAUNE / BLEU)',
    show_standby_options: 'Afficher les options veille (Éteindre, Redémarrer, Réveiller, Veille)',
    show_media_buttons:   'Afficher les boutons média (Lecture, Pause, Stop, Retour, Enregistrer, ...)',
    show_extra_buttons:   'Afficher les boutons extra (TXT, Audio, Sub, TV, PVR, Config, Minuterie, ...)',
    haptic_feedback:      'Retour haptique (iOS)',
    _dims_heading:        'Dimensions',
    scale:                'Échelle de la carte',
    border_width:         'Largeur de la bordure',
  },
  it: {
    entity:               'Entità Enigma2 Remote',
    name:                 'Nome del telecomando (opzionale)',
    _colors_heading:      'Colori',
    color_buttons:        'Colore pulsanti',
    color_text:           'Colore testo',
    color_background:     'Colore sfondo (vuoto = predefinito HA)',
    color_border:         'Colore bordo (vuoto = predefinito HA)',
    show_color_buttons:   'Mostra pulsanti colore (ROSSO / VERDE / GIALLO / BLU)',
    show_standby_options: 'Mostra opzioni standby (Spegni, Riavvia, Sveglia, Standby)',
    show_media_buttons:   'Mostra pulsanti media (Play, Pausa, Stop, Riavvolgi, Registra, ...)',
    show_extra_buttons:   'Mostra pulsanti extra (TXT, Audio, Sub, TV, PVR, Setup, Timer, ...)',
    haptic_feedback:      'Feedback aptico (iOS)',
    _dims_heading:        'Dimensioni',
    scale:                'Scala della card',
    border_width:         'Larghezza bordo',
  },
  nl: {
    entity:               'Enigma2 Remote Entiteit',
    name:                 'Naam afstandsbediening (optioneel)',
    _colors_heading:      'Kleuren',
    color_buttons:        'Knopkleur',
    color_text:           'Tekstkleur',
    color_background:     'Achtergrondkleur (leeg = HA standaard)',
    color_border:         'Randkleur (leeg = HA standaard)',
    show_color_buttons:   'Kleurknoppen tonen (ROOD / GROEN / GEEL / BLAUW)',
    show_standby_options: 'Standby-opties tonen (Uitschakelen, Herstart, Wekken, Standby)',
    show_media_buttons:   'Mediaknoppen tonen (Play, Pauze, Stop, Terugspoelen, Opnemen, ...)',
    show_extra_buttons:   'Extra knoppen tonen (TXT, Audio, Sub, TV, PVR, Setup, Timer, ...)',
    haptic_feedback:      'Haptische feedback (iOS)',
    _dims_heading:        'Afmetingen',
    scale:                'Kaartschaal',
    border_width:         'Randbreedte',
  },
  pl: {
    entity:               'Encja Enigma2 Remote',
    name:                 'Nazwa pilota (opcjonalnie)',
    _colors_heading:      'Kolory',
    color_buttons:        'Kolor przycisków',
    color_text:           'Kolor tekstu',
    color_background:     'Kolor tła (puste = domyślny HA)',
    color_border:         'Kolor obramowania (puste = domyślny HA)',
    show_color_buttons:   'Pokaż przyciski kolorów (CZERWONY / ZIELONY / ŻÓŁTY / NIEBIESKI)',
    show_standby_options: 'Pokaż opcje czuwania (Wyłącz, Uruchom ponownie, Wybudź, Czuwanie)',
    show_media_buttons:   'Pokaż przyciski mediów (Play, Pauza, Stop, Przewijanie, Nagrywanie, ...)',
    show_extra_buttons:   'Pokaż dodatkowe przyciski (TXT, Audio, Sub, TV, PVR, Setup, Timer, ...)',
    haptic_feedback:      'Wibracje (iOS)',
    _dims_heading:        'Wymiary',
    scale:                'Skala karty',
    border_width:         'Szerokość obramowania',
  },
  pt: {
    entity:               'Entidade Enigma2 Remote',
    name:                 'Nome do controlo remoto (opcional)',
    _colors_heading:      'Cores',
    color_buttons:        'Cor dos botões',
    color_text:           'Cor do texto',
    color_background:     'Cor de fundo (vazio = padrão HA)',
    color_border:         'Cor da borda (vazio = padrão HA)',
    show_color_buttons:   'Mostrar botões de cor (VERMELHO / VERDE / AMARELO / AZUL)',
    show_standby_options: 'Mostrar opções de espera (Desligar, Reiniciar, Despertar, Espera)',
    show_media_buttons:   'Mostrar botões de media (Play, Pausa, Stop, Retroceder, Gravar, ...)',
    show_extra_buttons:   'Mostrar botões extra (TXT, Áudio, Sub, TV, PVR, Setup, Timer, ...)',
    haptic_feedback:      'Feedback háptico (iOS)',
    _dims_heading:        'Dimensões',
    scale:                'Escala do cartão',
    border_width:         'Largura da borda',
  },
  ru: {
    entity:               'Объект Enigma2 Remote',
    name:                 'Название пульта (необязательно)',
    _colors_heading:      'Цвета',
    color_buttons:        'Цвет кнопок',
    color_text:           'Цвет текста',
    color_background:     'Цвет фона (пусто = по умолчанию HA)',
    color_border:         'Цвет рамки (пусто = по умолчанию HA)',
    show_color_buttons:   'Показать цветные кнопки (КРАСНЫЙ / ЗЕЛЁНЫЙ / ЖЁЛТЫЙ / СИНИЙ)',
    show_standby_options: 'Показать опции ожидания (Выключить, Перезапустить, Пробудить, Ожидание)',
    show_media_buttons:   'Показать медиакнопки (Воспр., Пауза, Стоп, Перемотка, Запись, ...)',
    show_extra_buttons:   'Показать доп. кнопки (TXT, Аудио, Sub, TV, PVR, Setup, Таймер, ...)',
    haptic_feedback:      'Тактильная обратная связь (iOS)',
    _dims_heading:        'Размеры',
    scale:                'Масштаб карточки',
    border_width:         'Ширина рамки',
  },
  tr: {
    entity:               'Enigma2 Remote Varlığı',
    name:                 'Uzaktan kumanda adı (isteğe bağlı)',
    _colors_heading:      'Renkler',
    color_buttons:        'Düğme rengi',
    color_text:           'Metin rengi',
    color_background:     'Arka plan rengi (boş = HA varsayılanı)',
    color_border:         'Kenarlık rengi (boş = HA varsayılanı)',
    show_color_buttons:   'Renk düğmelerini göster (KIRMIZI / YEŞİL / SARI / MAVİ)',
    show_standby_options: 'Bekleme seçeneklerini göster (Kapat, Yeniden Başlat, Uyandır, Bekleme)',
    show_media_buttons:   'Medya düğmelerini göster (Oynat, Duraklat, Durdur, Geri Sar, Kaydet, ...)',
    show_extra_buttons:   'Ekstra düğmeleri göster (TXT, Ses, Alt Yazı, TV, PVR, Kurulum, Zamanlayıcı, ...)',
    haptic_feedback:      'Dokunsal geri bildirim (iOS)',
    _dims_heading:        'Boyutlar',
    scale:                'Kart ölçeği',
    border_width:         'Kenarlık genişliği',
  },
  zh: {
    entity:               'Enigma2 远程实体',
    name:                 '遥控器名称（可选）',
    _colors_heading:      '颜色配置',
    color_buttons:        '按钮颜色',
    color_text:           '文字颜色',
    color_background:     '背景颜色（空 = HA 默认）',
    color_border:         '边框颜色（空 = HA 默认）',
    show_color_buttons:   '显示颜色按钮（红 / 绿 / 黄 / 蓝）',
    show_standby_options: '显示待机选项（关机、重启、唤醒、待机）',
    show_media_buttons:   '显示媒体按钮（播放、暂停、停止、倒带、录制…）',
    show_extra_buttons:   '显示扩展按钮（TXT、音频、字幕、TV、PVR、设置、定时器…）',
    haptic_feedback:      '触觉反馈（iOS）',
    _dims_heading:        '尺寸',
    scale:                '卡片缩放',
    border_width:         '边框宽度',
  },
  ar: {
    entity:               'كيان Enigma2 Remote',
    name:                 'اسم جهاز التحكم (اختياري)',
    _colors_heading:      'الألوان',
    color_buttons:        'لون الأزرار',
    color_text:           'لون النص',
    color_background:     'لون الخلفية (فارغ = افتراضي HA)',
    color_border:         'لون الحدود (فارغ = افتراضي HA)',
    show_color_buttons:   'إظهار أزرار الألوان (أحمر / أخضر / أصفر / أزرق)',
    show_standby_options: 'إظهار خيارات الاستعداد (إيقاف، إعادة تشغيل، تنبيه، استعداد)',
    show_media_buttons:   'إظهار أزرار الوسائط (تشغيل، إيقاف مؤقت، إيقاف، ترجيع، تسجيل...)',
    show_extra_buttons:   'إظهار الأزرار الإضافية (TXT، صوت، ترجمة، TV، PVR، إعداد، مؤقت...)',
    haptic_feedback:      'التغذية الراجعة اللمسية (iOS)',
    _dims_heading:        'الأبعاد',
    scale:                'مقياس البطاقة',
    border_width:         'عرض الحدود',
  },
};

function _et(lang, key) {
  const base = lang ? lang.split('-')[0].toLowerCase() : 'en';
  const dict = EDITOR_TRANSLATIONS[base] || EDITOR_TRANSLATIONS['en'];
  return dict[key] || EDITOR_TRANSLATIONS['en'][key] || key;
}

// ── Card ─────────────────────────────────────────────────────────────────────
class Enigma2RemoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._lang        = null;
    this._kbdOpen     = false;
    this._t9LastKey   = null;
    this._t9LastCount = 0;
    this._t9Active    = false;
    this._t9Timer     = null;
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
    const showColor    = this._cfg('show_color_buttons',    true);
    const showExtra    = this._cfg('show_extra_buttons',    false);
    const showStandby  = this._cfg('show_standby_options',  true);
    const showMedia    = this._cfg('show_media_buttons',    true);

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
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
          gap: calc(var(--remotewidth) / 13);
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
        .vc-mute     { grid-area: mute;     border-radius: 0; background: #e67e22 !important; font-size: calc(var(--remotewidth)/21) !important; }
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
        /* Title row with keyboard toggle */
        .title-row {
          width: 100%; display: flex; align-items: center; justify-content: center; position: relative;
        }
        .btn-kbd-toggle {
          position: absolute; right: 0; background: transparent; border: none;
          color: var(--primary-text-color); cursor: pointer; padding: 2px;
          border-radius: 4px; display: flex; align-items: center;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation; user-select: none;
        }
        .btn-kbd-toggle.active { color: var(--accent-color, #ff9800); }
        /* Keyboard panel */
        .kbd-panel {
          width: var(--remotewidth);
          border: var(--border-width) solid var(--border-color);
          border-radius: calc(var(--remotewidth) / 10);
          padding: calc(var(--remotewidth) / 16);
          display: flex; flex-direction: column; gap: 4px;
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
          box-sizing: border-box;
        }
        .kbd-panel[hidden] { display: none; }
        .kbd-row { display: flex; gap: 3px; justify-content: center; }
        .btn-key {
          flex: 1; min-width: 0;
          background: var(--btn-color); border: none; color: var(--btn-text);
          cursor: pointer; border-radius: calc(var(--remotewidth) / 30);
          font-size: calc(var(--remotewidth) / 18); font-weight: 500;
          height: calc(var(--remotewidth) / 8);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          user-select: none; transition: filter .12s; box-sizing: border-box;
        }
        .btn-key:active { filter: brightness(.7); }
        .btn-key.wide    { flex: 1.6; }
        .btn-key.space-bar { flex: 5; }
        .btn-key.shift-active { background: var(--accent-color, #ff9800); }
        .btn-key ha-icon { --mdc-icon-size: calc(var(--remotewidth) / 12); }
        /* MDI icon sizing per button context */
        .btn-kbd-toggle ha-icon { --mdc-icon-size: calc(var(--remotewidth)/12); }
        .btn-standby ha-icon { --mdc-icon-size: calc(var(--remotewidth)/13); flex-shrink: 0; }
        .btn-vc ha-icon      { --mdc-icon-size: calc(var(--remotewidth)/7);  }
        .btn-nav ha-icon     { --mdc-icon-size: calc(var(--remotewidth)/7);  }
        .btn-color ha-icon   { --mdc-icon-size: calc(var(--remotewidth)/7);  }
        .btn-media ha-icon   { --mdc-icon-size: calc(var(--remotewidth)/8);  }
        .btn-record { color: #e74c3c; }
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
          <div class="title-row">
            <div class="remote-title">${title}</div>
            <button class="btn-kbd-toggle${this._kbdOpen ? ' active' : ''}" id="kbd-toggle">
              <ha-icon icon="mdi:keyboard"></ha-icon>
            </button>
          </div>
          <div class="power-section">
            <button class="btn-standby" data-command="POWER_STATE_0"><ha-icon icon="mdi:power"></ha-icon> ${t('standby_toggle')}</button>
            ${showStandby ? `<div class="power-options">
              <button class="btn-power-opt" data-command="POWER_STATE_1">${t('power_off')}</button>
              <button class="btn-power-opt" data-command="POWER_STATE_2">${t('receiver_restart')}</button>
              <button class="btn-power-opt" data-command="POWER_STATE_3">${t('gui_restart')}</button>
              <button class="btn-power-opt" data-command="POWER_STATE_4">${t('wake_up')}</button>
              <button class="btn-power-opt" data-command="POWER_STATE_5">${t('standby')}</button>
            </div>` : ''}
          </div>
          <div class="divider"></div>
          <div class="grid-vc">
            <button class="btn-vc vc-ch-up"   data-key="KEY_CHANNELUP">CH+</button>
            <button class="btn-vc vc-menu"     data-key="KEY_MENU">${t('menu')}</button>
            <button class="btn-vc vc-vol-up"   data-key="KEY_VOLUMEUP">VOL+</button>
            <button class="btn-vc vc-ch-down"  data-key="KEY_CHANNELDOWN">CH−</button>
            <button class="btn-vc vc-mute"     data-key="KEY_MUTE"><ha-icon icon="mdi:volume-mute"></ha-icon></button>
            <button class="btn-vc vc-vol-down" data-key="KEY_VOLUMEDOWN">VOL−</button>
            <button class="btn-vc vc-exit"     data-key="KEY_EXIT">${t('exit')}</button>
            <button class="btn-vc vc-info"     data-key="KEY_INFO">${t('info')}</button>
            <button class="btn-vc vc-back"     data-key="KEY_EPG">EPG</button>
          </div>
          <div class="divider"></div>
          <div class="grid-nav">
            <button class="btn-nav nav-up"    data-key="KEY_UP"><ha-icon icon="mdi:chevron-up"></ha-icon></button>
            <button class="btn-nav nav-left"  data-key="KEY_LEFT"><ha-icon icon="mdi:chevron-left"></ha-icon></button>
            <button class="btn-nav btn-ok nav-ok" data-key="KEY_OK">OK</button>
            <button class="btn-nav nav-right" data-key="KEY_RIGHT"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
            <button class="btn-nav nav-down"  data-key="KEY_DOWN"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
          </div>
          <div class="divider"></div>
          ${showColor ? `
          <div class="row-color">
            <button class="btn-color c-red"    data-key="KEY_RED"><ha-icon icon="mdi:circle"></ha-icon></button>
            <button class="btn-color c-green"  data-key="KEY_GREEN"><ha-icon icon="mdi:circle"></ha-icon></button>
            <button class="btn-color c-yellow" data-key="KEY_YELLOW"><ha-icon icon="mdi:circle"></ha-icon></button>
            <button class="btn-color c-blue"   data-key="KEY_BLUE"><ha-icon icon="mdi:circle"></ha-icon></button>
          </div>
          <div class="divider"></div>
          ` : ''}
          <div class="grid-num">
            ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="btn-num" data-key="KEY_${n}">${n}</button>`).join('')}
            <button class="btn-num small" data-key="KEY_PREVIOUS">&lt;</button>
            <button class="btn-num"       data-key="KEY_0">0</button>
            <button class="btn-num small" data-key="KEY_NEXT">&gt;</button>
          </div>
          <div class="divider"></div>
          <div class="row-func">
            <button class="btn-func" data-key="KEY_HISTORY">History</button>
            <button class="btn-func" data-key="KEY_LIST">${t('list')}</button>
            <button class="btn-func" data-key="KEY_TEXT">TXT</button>
          </div>
          ${showMedia ? `
          <div class="row-media">
            <button class="btn-media" data-key="KEY_REWIND"><ha-icon icon="mdi:rewind"></ha-icon></button>
            <button class="btn-media" data-key="KEY_PLAY"><ha-icon icon="mdi:play"></ha-icon></button>
            <button class="btn-media" data-key="KEY_PAUSE"><ha-icon icon="mdi:pause"></ha-icon></button>
            <button class="btn-media" data-key="KEY_STOP"><ha-icon icon="mdi:stop"></ha-icon></button>
            <button class="btn-media" data-key="KEY_FASTFORWARD"><ha-icon icon="mdi:fast-forward"></ha-icon></button>
          </div>
          <div class="row-media">
            <button class="btn-media" data-key="KEY_SKIPBACK"><ha-icon icon="mdi:skip-previous"></ha-icon></button>
            <button class="btn-media btn-record" data-key="KEY_RECORD"><ha-icon icon="mdi:record"></ha-icon></button>
            <button class="btn-media" data-key="KEY_STOP"><ha-icon icon="mdi:stop"></ha-icon></button>
            <button class="btn-media" data-key="KEY_SKIPFORWARD"><ha-icon icon="mdi:skip-next"></ha-icon></button>
          </div>
          ` : ''}
          ${showExtra ? `
          <div class="divider"></div>
          <div class="row-func">
            <button class="btn-func" data-key="KEY_TEXT">TXT</button>
            <button class="btn-func" data-key="KEY_AUDIO">Audio</button>
            <button class="btn-func" data-key="KEY_SUBTITLE">Sub</button>
            <button class="btn-func" data-key="KEY_VIDEO">Video</button>
          </div>
          <div class="row-func">
            <button class="btn-func" data-key="KEY_PVR">PVR</button>
            <button class="btn-func" data-key="KEY_TV">TV</button>
            <button class="btn-func" data-key="KEY_RADIO">Radio</button>
            <button class="btn-func" data-key="KEY_HELP">Help</button>
          </div>
          <div class="row-func">
            <button class="btn-func" data-key="KEY_SETUP">Setup</button>
            <button class="btn-func" data-key="KEY_PORTAL">Portal</button>
            <button class="btn-func" data-key="KEY_SLEEP">Sleep</button>
            <button class="btn-func" data-key="KEY_TIMER">Timer</button>
          </div>
          <div class="row-func">
            <button class="btn-func" data-key="KEY_F1">F1</button>
            <button class="btn-func" data-key="KEY_F2">F2</button>
          </div>
          <div class="row-func">
            <button class="btn-func" data-key="KEY_BACK">${t('back')}</button>
            <button class="btn-func" data-key="KEY_OPTIONS">Opt</button>
            <button class="btn-func" data-key="KEY_CONTEXT">Context</button>
            <button class="btn-func" data-key="KEY_ASPECT">Aspect</button>
          </div>
          ` : ''}
        </div>
        <div class="kbd-panel" id="kbd-panel"${this._kbdOpen ? '' : ' hidden'}>
          <div class="kbd-row">
            ${['1','2','3','4','5','6','7','8','9','0'].map(n =>
              `<button class="btn-key t9-digit" data-kbd-char="${n}" title="${(T9_CHARS[n]||[]).join(' ')}">${n}</button>`
            ).join('')}
          </div>
          <div class="kbd-row">
            ${['Q','W','E','R','T','Z','U','I','O','P']
              .map(l => `<button class="btn-key" data-kbd-char="${l}">${l}</button>`).join('')}
          </div>
          <div class="kbd-row">
            ${['A','S','D','F','G','H','J','K','L']
              .map(l => `<button class="btn-key" data-kbd-char="${l}">${l}</button>`).join('')}
          </div>
          <div class="kbd-row">
            <button class="btn-key wide" id="kbd-backspace">
              <ha-icon icon="mdi:backspace-outline"></ha-icon>
            </button>
            ${['Y','X','C','V','B','N','M']
              .map(l => `<button class="btn-key" data-kbd-char="${l}">${l}</button>`).join('')}
            <button class="btn-key wide" data-kbd-key="KEY_ENTER">
              <ha-icon icon="mdi:keyboard-return"></ha-icon>
            </button>
          </div>
          <div class="kbd-row">
            <button class="btn-key space-bar" data-kbd-key="KEY_SPACE">space</button>
          </div>
        </div>
        </div>
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
    // ── Keyboard toggle ───────────────────────────────────────────────────────
    const kbdToggle = this.shadowRoot.getElementById('kbd-toggle');
    const kbdPanel  = this.shadowRoot.getElementById('kbd-panel');
    if (kbdToggle && kbdPanel) {
      kbdToggle.addEventListener('click', () => {
        this._kbdOpen = !this._kbdOpen;
        kbdPanel.toggleAttribute('hidden', !this._kbdOpen);
        kbdToggle.classList.toggle('active', this._kbdOpen);
      });
    }

    // ── Keyboard backspace button ─────────────────────────────────────────────
    const bsBtn = this.shadowRoot.getElementById('kbd-backspace');
    if (bsBtn) {
      const sendBs = () => {
        clearTimeout(this._t9Timer);
        this._t9LastKey   = null;
        this._t9LastCount = 0;
        this._t9Active    = false;
        this._send('KEY_BACKSPACE', false);
      };
      let bsTouched = false;
      bsBtn.addEventListener('touchstart', e => { e.preventDefault(); bsTouched = true; sendBs(); }, { passive: false });
      bsBtn.addEventListener('touchend',   e => { e.preventDefault(); setTimeout(() => { bsTouched = false; }, 300); }, { passive: false });
      bsBtn.addEventListener('click', () => { if (!bsTouched) sendBs(); });
    }

    // ── Keyboard direct-key buttons (space, enter) ────────────────────────────
    if (kbdPanel) {
      kbdPanel.querySelectorAll('[data-kbd-key]').forEach(btn => {
        const sendKbd = () => {
          clearTimeout(this._t9Timer);
          this._t9LastKey   = null;
          this._t9LastCount = 0;
          this._t9Active    = false;
          this._send(btn.getAttribute('data-kbd-key'), false);
        };
        let touched = false;
        btn.addEventListener('touchstart', e => { e.preventDefault(); touched = true; sendKbd(); }, { passive: false });
        btn.addEventListener('touchend',   e => { e.preventDefault(); setTimeout(() => { touched = false; }, 300); }, { passive: false });
        btn.addEventListener('click', () => { if (!touched) sendKbd(); });
      });
    }

    // ── Keyboard char buttons (T9 multi-tap) ─────────────────────────────────
    if (kbdPanel) {
      kbdPanel.querySelectorAll('[data-kbd-char]').forEach(btn => {
        const onPress = () => { this._t9Press(btn.getAttribute('data-kbd-char')); };
        let touched = false;
        btn.addEventListener('touchstart', e => { e.preventDefault(); touched = true; onPress(); }, { passive: false });
        btn.addEventListener('touchend',   e => { e.preventDefault(); setTimeout(() => { touched = false; }, 300); }, { passive: false });
        btn.addEventListener('click', () => { if (!touched) onPress(); });
      });
    }

    // ── Remote buttons ────────────────────────────────────────────────────────
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

  _t9Press(char) {
    const entry = T9_LOOKUP[char.toUpperCase()] || T9_LOOKUP[char.toLowerCase()] || T9_LOOKUP[char];
    if (!entry) return;

    const { key, count } = entry;
    const digit = key.replace('KEY_', '');
    const chars = T9_CHARS[digit];

    clearTimeout(this._t9Timer);

    if (this._t9Active && this._t9LastKey === key) {
      // Same digit group — advance by one: backspace + one more press
      this._t9LastCount = (this._t9LastCount % chars.length) + 1;
      this._send('KEY_BACKSPACE', false);
      this._send(key, false);
    } else {
      // New digit group — press the key `count` times to reach this char
      this._t9LastKey   = key;
      this._t9LastCount = count;
      this._t9Active    = true;
      for (let i = 0; i < count; i++) {
        this._send(key, false);
      }
    }

    this._t9Timer = setTimeout(() => {
      this._t9LastKey   = null;
      this._t9LastCount = 0;
      this._t9Active    = false;
    }, 1500);
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
      show_standby_options: true,
      show_media_buttons: true,
      show_extra_buttons: false,
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
      show_color_buttons:   cfg.show_color_buttons   !== false,
      show_standby_options: cfg.show_standby_options !== false,
      show_media_buttons:   cfg.show_media_buttons   !== false,
      show_extra_buttons:   cfg.show_extra_buttons   === true,
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
      show_color_buttons:   data.show_color_buttons,
      show_standby_options: data.show_standby_options,
      show_media_buttons:   data.show_media_buttons,
      show_extra_buttons:   data.show_extra_buttons,
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
        name:     'show_standby_options',
        label:    'Show Standby Options (Power Off, Restart, Wake Up, Standby)',
        selector: { boolean: {} },
      },
      {
        name:     'show_media_buttons',
        label:    'Show Media Buttons (Play, Pause, Stop, Rewind, Record, ...)',
        selector: { boolean: {} },
      },
      {
        name:     'show_extra_buttons',
        label:    'Show Extra Buttons (TXT, Audio, Sub, TV, PVR, Setup, Timer, ...)',
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
    form.computeLabel = (s) => _et(this._hass?.language, s.name);

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
