# Enigma2 Remote Control Integration

A complete Home Assistant integration for controlling Enigma2 set-top boxes via the OpenWebif API.

## Features

✅ **Easy Setup** — Config Flow for convenient configuration through the UI  
✅ **Full Remote Control** — All essential buttons implemented  
✅ **Modern Lovelace Card** — Beautiful, responsive design  
✅ **Long Key Presses** — Hold-function support  
✅ **No Authentication** — Works directly with OpenWebif  

## Supported Keys

### Number Keys
0–9, Text, Help

### Navigation
Up, Down, Left, Right, OK, Menu, Exit

### Color Keys
Red, Green, Yellow, Blue

### Channel Keys
Channel up, Channel down

### Additional Functions
Info, EPG, PVR, TV

## Prerequisites

- Home Assistant 2023.1.0 or later
- Enigma2 set-top box with OpenWebif enabled
- Network connectivity between Home Assistant and the box

## Usage

After installation:

1. Add the integration via **Settings → Devices & Services → Add Integration**
2. Enter the IP address and port (default: 80) of your Enigma2 box
3. Add the Lovelace card to your dashboard:

```yaml
type: custom:enigma2-remote-card
entity: remote.enigma2_remote_192_168_1_100
name: My Enigma2 Box
```

## Support

For questions or issues, please create an issue on GitHub.
