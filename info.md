# Enigma2 Remote Control Integration

Eine vollständige Home Assistant Integration zur Steuerung von Enigma2 Set-Top-Boxen über die OpenWebif API.

## Features

✅ **Einfache Einrichtung** - Config Flow für komfortable Konfiguration über die UI  
✅ **Vollständige Fernbedienung** - Alle wichtigen Tasten implementiert  
✅ **Moderne Lovelace Card** - Schönes, responsives Design  
✅ **Lange Tastendrücke** - Unterstützung für Hold-Funktionen  
✅ **Keine Authentifizierung** - Funktioniert direkt mit OpenWebif  

## Unterstützte Tasten

### Zifferntasten
0-9, Text, Hilfe

### Navigation
Hoch, Runter, Links, Rechts, OK, Menu, Exit

### Farbtasten
Rot, Grün, Gelb, Blau

### Kanaltasten
Kanal vor, Kanal zurück

### Zusätzliche Funktionen
Info, EPG, PVR, TV

## Voraussetzungen

- Home Assistant 2023.1.0 oder höher
- Enigma2 Set-Top-Box mit aktiviertem OpenWebif
- Netzwerkverbindung zwischen Home Assistant und der Box

## Verwendung

Nach der Installation:

1. Füge die Integration über **Einstellungen → Geräte & Dienste → Integration hinzufügen** hinzu
2. Gib die IP-Adresse und den Port (Standard: 80) deiner Enigma2 Box ein
3. Füge die Lovelace Card zu deinem Dashboard hinzu:

```yaml
type: custom:enigma2-remote-card
entity: remote.enigma2_remote_192_168_1_100
name: Meine Enigma2 Box
```

## Support

Bei Fragen oder Problemen erstelle bitte ein Issue auf GitHub.
