# Changelog

## v1.7.4b4 - BETA: QWERTZ keyboard panel

> **Beta release** — not served as default in HACS.

### Lovelace Card

- **QWERTZ keyboard panel** — appears to the right of the remote, toggled via keyboard icon in the title bar
- Layout: numbers row, Q–P, A–L, Shift + Y–M + Backspace, minus/dot/space/enter
- **Shift key** (one-shot): sends `KEY_LEFTSHIFT` before the next letter for uppercase input
- Panel state (open/closed) survives HA language changes without re-render

### Integration

- Added letter key codes A–Z, Space, Backspace, Enter, Shift, Dot, Comma, Minus to `KEY_CODES` in `const.py`

---

## v1.7.4b3 - BETA: Translated editor + media toggle + record button

> **Beta release** — not served as default in HACS.

### Lovelace Card

- **Visual editor fully translated** — all labels now adapt to the HA language setting (de, en, es, fr, it, nl, pl, pt, ru, tr, zh, ar)
- **Show Media Buttons toggle** — playback section (Play/Pause/Stop/Rewind/Record/Skip) can now be hidden via the visual editor
- **Record button** — uses `mdi:record` (red) via `ha-icon`

---

## v1.7.4b2 - BETA: Record button styling

> **Beta release** — not served as default in HACS.

### Lovelace Card

- **Record button** — replaced `ha-icon` with inline SVG: white outer ring, transparent gap, red inner dot (`mdi:record-circle-outline` style)

---

## v1.7.4b1 - BETA: MDI Icons

> **Beta release** — not served as default in HACS.

### Lovelace Card

- **All symbols replaced with Material Design Icons (`ha-icon`)** — SVG-based, identical rendering across all devices and browsers (no more emoji inconsistencies on iOS/Android)
- No external dependency — `ha-icon` is built into Home Assistant
- Affects: Power, Mute (→ `mdi:volume-mute`), navigation arrows (→ chevrons), colour buttons, all media controls (Play/Pause/Stop/Rewind/FF/Skip/Record)

---

## v1.7.3 - Brand icons

- **Brand folder added** — integration now self-hosts its icon and logo via the HA Brands Proxy API (requires HA 2026.3+); includes light/dark variants and retina (@2x) versions

---

## v1.7.2 - Lovelace card improvements & fixes

### Lovelace Card

- **Standby options toggleable via visual editor** — the five power sub-buttons (Power Off, Restart, Wake Up, Standby) can now be shown/hidden via the "Show Standby Options" toggle; the main "Toggle Standby" button is always visible
- **Numpad `?` / `TXT` replaced** — positions now show `<` (KEY_PREVIOUS) and `>` (KEY_NEXT) for prev/next navigation
- **History | LIST | TXT main row** — History replaces EPG in the always-visible function row
- **EPG in CH/VOL grid** — bottom-right cell of the CH/VOL block now shows EPG
- **TV moved to extras** — TV appears in the extras panel (row: PVR | TV | Radio | Help)
- **Always-visible transport row** — ⏮ ⏺ ⏹ ⏭ (Skip Back, Record, Stop, Skip Forward) permanently shown below the main media row; record button was previously missing
- **Record button** — white button with red ⏺ dot, matching standard remote convention
- **Fixed emoji rendering for ⏪ / ⏩** — rewind and fast-forward no longer render as color emoji on some devices
- **Extras section reordered**: TXT/Audio/Sub/Video → PVR/TV/Radio/Help → Setup/Portal/Sleep/Timer → F1/F2 → Back/Opt/Context/Aspect

---

## v1.7.2b6 - BETA: Lovelace card tweaks

> **Beta release** — not served as default in HACS.

### Lovelace Card

- **EPG in CH/VOL grid** — bottom-right cell now shows EPG (was: BACK)
- **Back moved to extras** — extras bottom row now shows Back instead of EPG (Back | Opt | Context | Aspect)
- **Record button** — button stays normal color, ⏺ dot is now red (was: fully red button)

---

## v1.7.2b5 - BETA: Lovelace card tweaks

> **Beta release** — not served as default in HACS.

### Lovelace Card

- **EPG moved to extras** — extras bottom row now shows EPG instead of Back (EPG | Opt | Context | Aspect)
- **History replaces EPG in main row** — main function row now shows History | LIST | TXT
- **Record button is now red** — visually matches standard remote control convention

---

## v1.7.2b4 - BETA: Lovelace card improvements

> **Beta release** — not served as default in HACS.

### Lovelace Card

- **Standby options toggleable via visual editor** — the five power sub-buttons (Power Off, Restart, Wake Up, Standby) can now be shown/hidden via the "Show Standby Options" toggle in the card editor; the main "Toggle Standby" button is always visible
- **Numpad `?` / `TXT` replaced** — positions now show `<` (KEY_PREVIOUS, code 412) and `>` (KEY_NEXT, code 407) for prev/next navigation
- **TXT moved to main EPG/LIST row** — EPG | LIST | TXT is now always visible; TV button removed from that row
- **TV moved to extras** — TV appears in the extras panel (row: PVR | TV | Radio | Help)
- **Always-visible transport row added** — ⏮ ⏺ ⏹ ⏭ (Skip Back, Record, Stop, Skip Forward) is now permanently shown below the main media row; record button was previously missing
- **Fixed emoji rendering for ⏪ / ⏩** — rewind and fast-forward buttons were rendered as color emoji / smiley on some devices; fixed with CSS `font-variant-emoji: text`
- **Extras section reordered** to match reference layout: TXT/Audio/Sub/Video → PVR/TV/Radio/Help → Setup/Portal/Sleep/Timer → F1/F2 → Back/Opt/Context/Aspect

---

## v1.5.1 - Fix: HACS resources wiped on update & browser cache not cleared

### Bug Fixes

**HACS `/hacsfile/...` resources were deleted after updating the integration**
- Root cause: `__init__.py` was calling `ResourceStorageCollection.async_create_item()` to register the Lovelace card. This writes the **entire** resource list to `.storage/lovelace_resources`. If our integration loaded before HACS had re-registered its own `/hacsfile/...` entries (race condition on restart), the saved list only contained our entry — wiping everything else.
- Fix: Replaced `ResourceStorageCollection` with `frontend.add_extra_js_url()`. This registers the card **in memory only** — it never writes to `.storage/lovelace_resources` and therefore cannot affect any other integration's resources.

**Browser cached the old card JS after updates (no version in URL)**
- Root cause: The resource URL `/enigma2_remote/enigma2-remote-card.js` had no version suffix, so browsers served the cached old file after an update.
- Fix: Version is now read from `manifest.json` at startup and appended to the URL: `/enigma2_remote/enigma2-remote-card.js?v=1.5.1`. The URL changes on every release, forcing the browser to fetch the new file.

---

## v1.5.0 - HTTPS, Authentication, Hostname support & UI fixes

### New Features
- **Hostname support** — setup accepts hostnames (e.g. `receiver.fritz.box`) in addition to IP addresses, with DNS resolution check and specific error message on failure
- **HTTPS / SSL support** — new "Use HTTPS" toggle in setup; self-signed certificates accepted automatically
- **Authentication** — optional username and password fields; sent as HTTP Basic Auth to every request
- **Port auto-switch** — enabling HTTPS re-shows the form with port pre-filled as `443` (only when port is still on default 80)

### Improved Error Logging
- Specific log messages for every failure type: DNS, connection refused, HTTP 401/403/404, timeout, SSL error, unexpected
- All messages include actionable hints

### Lovelace Card
- Yellow color button dot is now white (was incorrectly dark)
- Remote body background is now transparent (inherits card background)

### Translations
- All 4 languages (DE/EN/FR/TR) updated with new setup field labels and error messages

---

## v1.5.0b3 - BETA: Port field updates to 443 visually when HTTPS is enabled

> **Beta release** — not served as default in HACS.

### Fix
- When HTTPS is enabled and the port is still on the default (80), the port is automatically switched to 443 before the connection test and saving.
- A manually entered port (e.g. 8443) is always preserved.

---

## v1.5.0b1 - BETA: HTTPS, Authentication, Hostname support, detailed logging

> **Beta release** — not served as default in HACS. Enable beta releases in HACS settings to install.

### New Features
- **Hostname support**: The setup dialog now accepts hostnames (e.g. `receiver.fritz.box`) in addition to IP addresses. DNS resolution is verified before attempting a connection, with a specific error message if it fails.
- **HTTPS / SSL support**: New toggle "Use HTTPS (SSL/TLS)" in setup. Self-signed certificates are accepted automatically.
- **Authentication**: New optional username and password fields in setup. Credentials are sent as HTTP Basic Auth to every request. Works for both HTTP and HTTPS.

### Improved Error Handling & Logging
All connection failures are now logged with **specific, actionable messages** at `ERROR` level:

| Situation | Log message |
|---|---|
| DNS resolution failure | hostname, reason |
| Connection refused / unreachable | host, port, suggestion to check OpenWebif |
| HTTP 401 Unauthorized | hint to check credentials |
| HTTP 403 Forbidden | hint about OpenWebif permissions |
| HTTP 404 Not Found | hint to check OpenWebif / port |
| Timeout (>10 s) | hint to check device power & network |
| SSL/TLS error | certificate details |
| Unexpected error | full stack trace via `_LOGGER.exception` |

### Config Flow
- New fields: `ssl` (bool), `username` (str), `password` (str)
- New error keys: `cannot_resolve`, `invalid_auth`
- All 4 languages (DE/EN/FR/TR) updated with new field labels and error messages

---

## v1.4.1 - Fix: Visual Editor focus loss & native Entity Picker

### Bug Fix
- **Editor inputs were immediately deselected** — root cause: editor was calling `innerHTML` on every config change, destroying and recreating all DOM nodes (and their focus state)
- **Fix**: Editor now renders **once** via `_initialRender()`. Subsequent config updates only set `ha-form.data` (a property setter — no DOM replacement). Focus is fully preserved.

### Improvements
- **Entity Picker** now uses the native HA entity picker (`ha-form` with `selector: { entity: { domain: 'remote', integration: 'enigma2_remote' } }`), filtered to only show entities from this integration
- **ha-form** replaces the custom HTML editor — HA handles all rendering, theming and accessibility internally
- Section headers for "Colors Configuration" and "Dimensions" in editor
- Buy Me a Coffee button + Code Editor link in editor footer

---

## v1.4.0 - Visual Card Editor

### New: Lovelace Visual Editor
The card can now be fully configured through the Home Assistant visual editor (no YAML needed):
- **Entity** — text field with placeholder
- **Remote Control Name** — optional display title
- **Colors Configuration** — color picker + hex text field for:
  - Buttons Color
  - Text Color
  - Background Color
  - Border Color
- **Color Buttons** — toggle to show/hide RED/GREEN/YELLOW/BLUE row
- **Dimensions**:
  - Card Scale slider (0.5×–1.5×, default 1.0)
  - Card Border Width slider (0–6 px, default 1)
- **Buy Me a Coffee** button in the editor
- Color picker and hex text field stay in sync

### Config structure change
New nested config format (backward-compatible fallback for old `width` key):
```yaml
type: custom:enigma2-remote-card
entity: remote.enigma2_remote_192_168_1_100
name: Wohnzimmer
colors:
  buttons: "#6d767e"
  text: "#ffffff"
  background: ""
  border: ""
show_color_buttons: true
dimensions:
  scale: 1.0
  border_width: 1
```

---

## v1.3.0 - Multilingual support (DE / EN / FR / TR)

### Lovelace Card — i18n
- Card labels now follow the **Home Assistant language setting** automatically (`hass.language`)
- Translated labels: Standby Toggle, Power Off, Receiver Restart, GUI Restart, Wake Up, Standby, Menu, Exit, Info, Back, List
- Supported languages: **Deutsch (de)**, **English (en)**, **Français (fr)**, **Türkçe (tr)**
- Falls back to English for any other language

### Config Flow — Translations
- Added **`translations/de.json`** — German UI strings for setup dialog
- Added **`translations/fr.json`** — French UI strings for setup dialog
- Added **`translations/tr.json`** — Turkish UI strings for setup dialog
- `translations/en.json` and `strings.json` kept in sync

---

## v1.2.1 - Logo, README & cleanup

### Changes
- Added `icon.svg` integration logo in `custom_components/enigma2_remote/`
- Added **Buy Me a Coffee** button to README (top + support section)
- Added **Screenshots** section in README with card preview
- Removed duplicate `www/enigma2-remote-card.js` from repo root — HA only serves from `custom_components/enigma2_remote/www/`
- Updated manual installation instructions (no manual JS copy needed)
- Updated project structure in README

---

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