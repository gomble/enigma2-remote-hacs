# Changelog

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
