# Enigma2 Remote Control Integration for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/gomble/enigma2-remote-hacs.svg)](https://github.com/gomble/enigma2-remote-hacs/releases)
[![License](https://img.shields.io/github/license/gomble/enigma2-remote-hacs.svg)](LICENSE)

A complete Home Assistant integration for controlling Enigma2 set-top boxes (e.g. Dreambox, VU+) via the OpenWebif API.

## ✨ Features

- 🎮 **Full Remote Control** — All essential buttons implemented
- 🖥️ **Modern Lovelace Card** — Beautiful, responsive design for all devices
- ⚙️ **Config Flow** — Easy setup through the Home Assistant UI
- 🔘 **Long Key Presses** — Hold-function support (500 ms)
- 🌐 **OpenWebif API** — Uses the standard API, no additional software required
- 🔓 **No Authentication** — Works out of the box without login

## 📋 Prerequisites

- Home Assistant 2023.1.0 or later
- Enigma2 set-top box with OpenWebif enabled
- Network connectivity between Home Assistant and the box

## 🚀 Installation

### Via HACS (recommended)

1. Open HACS in Home Assistant
2. Click **Integrations**
3. Click the three-dot menu (⋮) in the top-right corner
4. Select **Custom repositories**
5. Add the URL: `https://github.com/gomble/enigma2-remote-hacs`
6. Category: **Integration**
7. Click **Add**
8. Search for "Enigma2 Remote Control" and click **Download**
9. Restart Home Assistant

### Manual Installation

1. Download the latest version from [Releases](https://github.com/gomble/enigma2-remote-hacs/releases)
2. Extract the archive
3. Copy the folder `custom_components/enigma2_remote` to `<config>/custom_components/`
4. Copy the file `www/enigma2-remote-card.js` to `<config>/www/`
5. Restart Home Assistant

## ⚙️ Configuration

### Adding the Integration

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration**
3. Search for "Enigma2 Remote Control"
4. Enter the IP address of your Enigma2 box
5. Enter the port (default: 80)
6. Click **Submit**

The integration automatically creates a Remote entity named `remote.enigma2_remote_<ip_address>`.

### Adding the Lovelace Card

The Lovelace card is **automatically registered** when the integration is installed via HACS. No manual resource configuration needed!

#### Via the UI (recommended)

1. Edit your dashboard
2. Click **+ Add Card**
3. Scroll down and select **Custom: Enigma2 Remote Card**
4. Configure the card:

```yaml
type: custom:enigma2-remote-card
entity: remote.enigma2_remote_192_168_1_100
name: Living Room TV
```

#### Manually (YAML)

If the card is not auto-detected, add the resource in your Lovelace configuration:

**Settings** → **Dashboards** → **⋮** → **Resources**

- URL: `/enigma2_remote/enigma2-remote-card.js`
- Resource type: JavaScript Module

Then add the card to your dashboard:

```yaml
type: custom:enigma2-remote-card
entity: remote.enigma2_remote_192_168_1_100
name: My Enigma2 Box
```

## 🎮 Supported Keys

### Number Keys
`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`

### Navigation
- **Arrow keys**: `KEY_UP`, `KEY_DOWN`, `KEY_LEFT`, `KEY_RIGHT`
- **OK**: `KEY_OK`
- **Menu**: `KEY_MENU`
- **Exit**: `KEY_EXIT`

### Color Keys
`KEY_RED`, `KEY_GREEN`, `KEY_YELLOW`, `KEY_BLUE`

### Channel Keys
- **Channel up**: `KEY_CHANNELUP`
- **Channel down**: `KEY_CHANNELDOWN`

### Additional Functions
- **Info**: `KEY_INFO`
- **EPG**: `KEY_EPG` (Electronic Program Guide)
- **PVR**: `KEY_PVR` (Recordings)
- **TV**: `KEY_TV`
- **Text**: `KEY_TEXT` (Teletext)
- **Help**: `KEY_HELP`

## 🤖 Usage in Automations

You can use the Remote entity in automations and scripts:

```yaml
service: remote.send_command
target:
  entity_id: remote.enigma2_remote_192_168_1_100
data:
  command: KEY_CHANNELUP
```

### Long Key Presses

```yaml
service: remote.send_command
target:
  entity_id: remote.enigma2_remote_192_168_1_100
data:
  command: KEY_OK
  hold_secs: 1
```

### Multiple Keys in Sequence

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

The Lovelace card displays a clean remote control with:
- Number keys (0–9)
- Navigation keys (arrows + OK)
- Menu and Exit
- Color keys (Red, Green, Yellow, Blue)
- Channel keys
- Additional functions (Info, EPG, PVR, TV)

The design automatically adapts to your Home Assistant theme and is fully responsive.

## 🔧 Troubleshooting

### Cannot Add the Integration

- Make sure OpenWebif is enabled on your Enigma2 box
- Verify the IP address and port
- Test the connection: `http://<ip>:<port>/api/about`

### Keys Are Not Working

- Check the logs in Home Assistant: **Settings** → **System** → **Logs**
- Ensure the box is reachable on the network
- Test the API directly: `http://<ip>:<port>/api/remotecontrol?command=103`

### Card Is Not Displayed

- Make sure the resource has been added
- Clear your browser cache (Ctrl+F5)
- Check the browser console for errors

## 🛠️ Development

### Project Structure

```
enigma2_remote/
├── custom_components/
│   └── enigma2_remote/
│       ├── __init__.py              # Integration setup
│       ├── manifest.json            # Integration manifest
│       ├── config_flow.py           # UI configuration flow
│       ├── remote.py                # Remote entity platform
│       ├── const.py                 # Constants
│       ├── strings.json             # UI strings
│       ├── translations/
│       │   └── en.json              # English translations
│       └── www/
│           └── enigma2-remote-card.js  # Lovelace card (auto-registered)
├── www/
│   └── enigma2-remote-card.js       # Lovelace custom card
├── README.md                        # This file
├── hacs.json                        # HACS manifest
├── LICENSE                          # MIT License
└── info.md                          # HACS store description
```

### Local Testing

1. Clone the repository
2. Copy `custom_components/enigma2_remote` to `<ha_config>/custom_components/`
3. Copy `www/enigma2-remote-card.js` to `<ha_config>/www/`
4. Restart Home Assistant

## 📝 API Reference

The integration uses the OpenWebif API:

- **Key press**: `GET /api/remotecontrol?command=<code>`
- **Long key press**: `GET /api/remotecontrol?type=long&command=<code>`

Key codes are defined in `const.py`.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Home Assistant Community
- OpenWebif Developers
- Enigma2 Developers

## 📞 Support

For questions or issues:

- 🐛 [Create an Issue](https://github.com/gomble/enigma2-remote-hacs/issues)
- 💬 [Discussions](https://github.com/gomble/enigma2-remote-hacs/discussions)
