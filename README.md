# Enigma2 Remote Control Integration für Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/yourusername/enigma2_remote.svg)](https://github.com/yourusername/enigma2_remote/releases)
[![License](https://img.shields.io/github/license/yourusername/enigma2_remote.svg)](LICENSE)

Eine vollständige Home Assistant Integration zur Steuerung von Enigma2 Set-Top-Boxen (z.B. Dreambox, VU+) über die OpenWebif API.

## ✨ Features

- 🎮 **Vollständige Fernbedienung** - Alle wichtigen Tasten implementiert
- 🖥️ **Moderne Lovelace Card** - Schönes, responsives Design für alle Geräte
- ⚙️ **Config Flow** - Einfache Einrichtung über die Home Assistant UI
- 🔘 **Lange Tastendrücke** - Unterstützung für Hold-Funktionen (500ms)
- 🌐 **OpenWebif API** - Nutzt die Standard-API, keine zusätzliche Software erforderlich
- 🔓 **Keine Authentifizierung** - Funktioniert direkt ohne Login

## 📋 Voraussetzungen

- Home Assistant 2023.1.0 oder höher
- Enigma2 Set-Top-Box mit aktiviertem OpenWebif
- Netzwerkverbindung zwischen Home Assistant und der Box

## 🚀 Installation

### Installation über HACS (empfohlen)

1. Öffne HACS in Home Assistant
2. Klicke auf "Integrationen"
3. Klicke auf die drei Punkte (⋮) oben rechts
4. Wähle "Benutzerdefinierte Repositories"
5. Füge die URL hinzu: `https://github.com/yourusername/enigma2_remote`
6. Kategorie: "Integration"
7. Klicke auf "Hinzufügen"
8. Suche nach "Enigma2 Remote Control" und klicke auf "Herunterladen"
9. Starte Home Assistant neu

### Manuelle Installation

1. Lade die neueste Version von [Releases](https://github.com/yourusername/enigma2_remote/releases) herunter
2. Entpacke das Archiv
3. Kopiere den Ordner `custom_components/enigma2_remote` nach `<config>/custom_components/`
4. Kopiere die Datei `www/enigma2-remote-card.js` nach `<config>/www/`
5. Starte Home Assistant neu

## ⚙️ Konfiguration

### Integration hinzufügen

1. Gehe zu **Einstellungen** → **Geräte & Dienste**
2. Klicke auf **+ Integration hinzufügen**
3. Suche nach "Enigma2 Remote Control"
4. Gib die IP-Adresse deiner Enigma2 Box ein
5. Gib den Port ein (Standard: 80)
6. Klicke auf **Senden**

Die Integration erstellt automatisch eine Remote Entity mit dem Namen `remote.enigma2_remote_<ip_adresse>`.

### Lovelace Card hinzufügen

#### Über die UI (empfohlen)

1. Bearbeite dein Dashboard
2. Klicke auf **+ Karte hinzufügen**
3. Scrolle nach unten und wähle **Benutzerdefiniert: Enigma2 Remote Card**
4. Konfiguriere die Karte:

```yaml
type: custom:enigma2-remote-card
entity: remote.enigma2_remote_192_168_1_100
name: Wohnzimmer TV
```

#### Manuell (YAML)

Füge die Ressource in der Lovelace-Konfiguration hinzu (falls noch nicht automatisch hinzugefügt):

**Einstellungen** → **Dashboards** → **⋮** → **Ressourcen**

- URL: `/local/enigma2-remote-card.js`
- Ressourcentyp: JavaScript-Modul

Danach kannst du die Card zu deinem Dashboard hinzufügen:

```yaml
type: custom:enigma2-remote-card
entity: remote.enigma2_remote_192_168_1_100
name: Meine Enigma2 Box
```

## 🎮 Unterstützte Tasten

### Zifferntasten
`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`

### Navigation
- **Pfeiltasten**: `KEY_UP`, `KEY_DOWN`, `KEY_LEFT`, `KEY_RIGHT`
- **OK**: `KEY_OK`
- **Menu**: `KEY_MENU`
- **Exit**: `KEY_EXIT`

### Farbtasten
`KEY_RED`, `KEY_GREEN`, `KEY_YELLOW`, `KEY_BLUE`

### Kanaltasten
- **Kanal vor**: `KEY_CHANNELUP`
- **Kanal zurück**: `KEY_CHANNELDOWN`

### Zusätzliche Funktionen
- **Info**: `KEY_INFO`
- **EPG**: `KEY_EPG` (Electronic Program Guide)
- **PVR**: `KEY_PVR` (Aufnahmen)
- **TV**: `KEY_TV`
- **Text**: `KEY_TEXT` (Videotext)
- **Hilfe**: `KEY_HELP`

## 🤖 Verwendung in Automatisierungen

Du kannst die Remote Entity in Automatisierungen und Skripten verwenden:

```yaml
service: remote.send_command
target:
  entity_id: remote.enigma2_remote_192_168_1_100
data:
  command: KEY_CHANNELUP
```

### Lange Tastendrücke

```yaml
service: remote.send_command
target:
  entity_id: remote.enigma2_remote_192_168_1_100
data:
  command: KEY_OK
  hold_secs: 1
```

### Mehrere Tasten nacheinander

```yaml
service: remote.send_command
target:
  entity_id: remote.enigma2_remote_192_168_1_100
data:
  command:
    - KEY_MENU
    - KEY_DOWN
    - KEY_DOWN
    - KEY_OK
```

## 📱 Screenshots

Die Lovelace Card zeigt eine übersichtliche Fernbedienung mit:
- Zifferntasten (0-9)
- Navigationstasten (Pfeile + OK)
- Menu und Exit
- Farbtasten (Rot, Grün, Gelb, Blau)
- Kanaltasten
- Zusatzfunktionen (Info, EPG, PVR, TV)

Das Design passt sich automatisch an das Home Assistant Theme an und ist voll responsive.

## 🔧 Fehlerbehebung

### Integration kann nicht hinzugefügt werden

- Stelle sicher, dass OpenWebif auf der Enigma2 Box aktiviert ist
- Überprüfe die IP-Adresse und den Port
- Teste die Verbindung: `http://<ip>:<port>/api/about`

### Tasten funktionieren nicht

- Überprüfe die Logs in Home Assistant: **Einstellungen** → **System** → **Protokolle**
- Stelle sicher, dass die Box erreichbar ist
- Teste die API direkt: `http://<ip>:<port>/api/remotecontrol?command=103`

### Card wird nicht angezeigt

- Stelle sicher, dass die Ressource hinzugefügt wurde
- Leere den Browser-Cache (Strg+F5)
- Überprüfe die Browser-Konsole auf Fehler

## 🛠️ Entwicklung

### Projektstruktur

```
enigma2_remote/
├── custom_components/
│   └── enigma2_remote/
│       ├── __init__.py              # Integration Setup
│       ├── manifest.json            # Integration Manifest
│       ├── config_flow.py           # UI Configuration Flow
│       ├── remote.py                # Remote Entity Platform
│       ├── const.py                 # Constants
│       ├── strings.json             # UI Strings
│       └── translations/
│           └── en.json              # English Translations
├── www/
│   └── enigma2-remote-card.js       # Lovelace Custom Card
├── README.md                        # Diese Datei
├── hacs.json                        # HACS Manifest
└── info.md                          # HACS Store Description
```

### Lokales Testen

1. Klone das Repository
2. Kopiere `custom_components/enigma2_remote` nach `<ha_config>/custom_components/`
3. Kopiere `www/enigma2-remote-card.js` nach `<ha_config>/www/`
4. Starte Home Assistant neu

## 📝 API Referenz

Die Integration nutzt die OpenWebif API:

- **Tastendruck**: `GET /api/remotecontrol?command=<code>`
- **Langer Tastendruck**: `GET /api/remotecontrol?type=long&command=<code>`

Tastencodes sind in `const.py` definiert.

## 🤝 Beitragen

Beiträge sind willkommen! Bitte:

1. Forke das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- Home Assistant Community
- OpenWebif Entwickler
- Enigma2 Entwickler

## 📞 Support

Bei Fragen oder Problemen:

- 🐛 [Erstelle ein Issue](https://github.com/yourusername/enigma2_remote/issues)
- 💬 [Diskussionen](https://github.com/yourusername/enigma2_remote/discussions)

---

**Hinweis**: Ersetze `yourusername` mit deinem GitHub-Benutzernamen, bevor du das Repository veröffentlichst.
