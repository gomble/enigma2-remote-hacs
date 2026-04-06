# Changelog

## v1.2.0 - Redesigned Lovelace Card (LG WebOS style)

### Lovelace Card Redesign
- Complete visual redesign inspired by [LG WebOS Remote Control](https://github.com/madmicio/LG-WebOS-Remote-Control)
- **Proportional scaling** via `--remotewidth` CSS variable (configurable via `width:` in card config)
- **Bordered remote body** (`.page`) with rounded corners — looks like a real remote
- **CSS custom properties** for full theming support:
  - `--custom-btn-color` — button background
  - `--custom-btn-text` — button text/icon color
  - `--custom-border-color` — remote border color
  - `--custom-border-width` — remote border width
- **Connected 3×3 Vol/CH block**: CH+/CH−, MENU/INFO/BACK, VOL+/VOL−, MUTE (orange center) — all touching with position-specific border-radius
- **Circular navigation D-pad**: UP/DOWN/LEFT/RIGHT (circular), OK (orange accent, circular)
- **Circular color buttons**: RED/GREEN/YELLOW/BLUE
- **Circular media controls**: ⏪ ▶ ⏸ ⏹ ⏩
- **Ripple animation** on every button press
- **Long-press support** (500 ms → hold_secs: 1) on all buttons
- Both `www/` and `custom_components/enigma2_remote/www/` are now always in sync

### Version
- Bumped `manifest.json` version from `1.1.2` to `1.2.0`

---

## v1.1.2 - Fix: Lovelace card sync

### Bug Fix
- **Lovelace card in HA war veraltet**: `custom_components/enigma2_remote/www/enigma2-remote-card.js` war noch die v1.0.x Version
- Fehlende Power State Buttons (POWER_STATE_0–5) und UI-Vergrößerungen aus v1.1.0 sind jetzt aktiv
- Beide JS-Dateien (`www/` und `custom_components/enigma2_remote/www/`) sind jetzt synchron
- Bumped `manifest.json` version to `1.1.2`

---

## v1.1.1 - Version bump & README fix

### Changes
- Bumped `manifest.json` version from `1.1.0` to `1.1.1`
- Fixed GitHub Release badge in README (was showing stale v1.0.3)

---

## v1.1.0 - Power State Control & UI Improvements

### Power State Control
- **Alle 6 OpenWebif Power-Optionen** als Buttons in der Lovelace Card:
  - Standby Umschalten (State 0)
  - Ausschalten (State 1)
  - Receiver Neustart (State 2)
  - GUI Neustart (State 3)
  - Wake Up (State 4)
  - Standby (State 5)
- Neue Methode `_send_power_state()` nutzt den OpenWebif-Endpunkt `/api/powerstate?newstate=X`
- `async_turn_on` nutzt jetzt Wake Up (State 4) statt KEY_POWER
- `async_turn_off` nutzt jetzt Standby (State 5) statt KEY_POWER
- `async_send_command` erkennt `POWER_STATE_0` bis `POWER_STATE_5` Commands

### UI Improvements
- **Lovelace Card vergrößert**: Padding, Font-Größen, Button-Größen und Abstände erhöht
- Padding: 6px → 12px
- Header Font: 13px → 16px
- Button Font: 11px → 13px, Padding: 5px → 8px
- Navigation Grid: 44px → 54px
- Container max-width: 250px → 320px

### Version
- Bumped `manifest.json` version from `1.0.3` to `1.1.0`

---

## v1.0.3 - Fix: Correct async method for static path registration

### Bug Fix
- **Fixed `AttributeError`**: `HomeAssistantHTTP` object has no attribute `register_static_path`
- Changed `hass.http.register_static_path()` → `await hass.http.async_register_static_paths()` using `StaticPathConfig`
- Removed unused import `async_register_built_in_panel`
- Compatible with Home Assistant 2024.x+ which removed the synchronous `register_static_path` method

### Version
- Bumped `manifest.json` version from `1.0.2` to `1.0.3`

---

## v1.0.2 - Fix: Auto-register Lovelace Card, correct repository URLs

### Lovelace Card Auto-Registration
- The Lovelace card (`enigma2-remote-card.js`) is now **automatically registered** when the integration is set up
- No manual resource configuration required — the card is available immediately after HACS installation
- Card JS file is now also included under `custom_components/enigma2_remote/www/` for reliable static path serving
- Uses `hass.http.async_register_static_paths()` and Lovelace resource registration with fallback to `frontend_extra_module_url`

### Repository URL Corrections
- Fixed `manifest.json`:
  - `codeowners`: `@yourusername` → `@gomble`
  - `documentation`: corrected to `https://github.com/gomble/enigma2-remote-hacs`
  - `issue_tracker`: corrected to `https://github.com/gomble/enigma2-remote-hacs/issues`

### HACS Configuration
- Updated `hacs.json` with `filename` field for proper card detection

### Version
- Bumped `manifest.json` version from `1.0.1` to `1.0.2`

---

## v1.0.1 - Fix: Korrekte Tastencodes aus OpenWebif

### Quelle der korrekten Codes
Die Tastencodes wurden aus der **offiziellen OpenWebif `main.tmpl`** extrahiert 
(`plugin/controllers/views/responsive/main.tmpl` → `data-code` Attribute).

### Geänderte Tastencodes (Alt → Neu)

| Taste | Alter Code | Neuer Code | Hinweis |
|-------|-----------|------------|---------|
| **POWER** | 116 | **1001** | OpenWebif spezieller Code (nicht Linux KEY_POWER!) |
| **MUTE** | 113 | **1000** | OpenWebif spezieller Code (nicht Linux KEY_MUTE!) |
| KEY_PVR | 393 | ❌ entfernt | War falsch; 393 = LIST in OpenWebif |

### Neue Tasten hinzugefügt

| Taste | Code | Beschreibung |
|-------|------|-------------|
| KEY_BACK | 158 | Zurück-Taste |
| KEY_HOME | 102 | Home-Taste |
| KEY_PLAY | 207 | Wiedergabe |
| KEY_PAUSE | 119 | Pause |
| KEY_STOP | 128 | Stopp |
| KEY_RECORD | 167 | Aufnahme |
| KEY_REWIND | 168 | Rückspulen |
| KEY_FASTFORWARD | 208 | Vorspulen |
| KEY_PREVIOUS | 412 | Vorheriger Titel |
| KEY_NEXT | 407 | Nächster Titel |
| KEY_SUBTITLE | 370 | Untertitel |
| KEY_RADIO | 385 | Radio-Modus |
| KEY_AUDIO | 392 | Audio-Auswahl |
| KEY_LIST | 393 | Kanalliste |
| KEY_VOD | 627 | Video on Demand |

### Unveränderte Tastencodes (korrekt seit v1.0.0)

| Taste | Code |
|-------|------|
| KEY_0 bis KEY_9 | 11, 2-10 |
| KEY_UP | 103 |
| KEY_DOWN | 108 |
| KEY_LEFT | 105 |
| KEY_RIGHT | 106 |
| KEY_OK | 352 |
| KEY_MENU | 139 |
| KEY_EXIT | 174 |
| KEY_VOLUMEUP | 115 |
| KEY_VOLUMEDOWN | 114 |
| KEY_CHANNELUP | 402 |
| KEY_CHANNELDOWN | 403 |
| KEY_RED | 398 |
| KEY_GREEN | 399 |
| KEY_YELLOW | 400 |
| KEY_BLUE | 401 |
| KEY_INFO | 358 |
| KEY_EPG | 365 |
| KEY_TV | 377 |
| KEY_TEXT | 388 |
| KEY_HELP | 138 |

### Lovelace Card Änderungen
- ✅ **Lautstärke-Tasten** (VOL+, VOL-, Mute) sind jetzt sichtbar und funktional
- ✅ **BACK-Taste** hinzugefügt neben MENU und EXIT
- ✅ **Media-Controls** hinzugefügt (⏪ ▶ ⏸ ⏹ ⏩)
- ✅ **LIST-Taste** ersetzt PVR-Taste
- 📐 **Kompakter**: max-width 250px, Buttons 32px, Font 11px, Padding 5px
- 📐 **Navigation**: 44px Grid (vorher 52px)

### Version
- `manifest.json`: 1.0.0 → **1.0.1**