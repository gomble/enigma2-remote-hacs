"""Constants for the Enigma2 Remote Control integration."""

DOMAIN = "enigma2_remote"

# Frontend
URL_BASE = "/enigma2_remote"
ENIGMA2_CARDS = [
    {
        "name":     "Enigma2 Remote Card",
        "filename": "enigma2-remote-card.js",
        "version":  "1.7.2b3",
    }
]

# Configuration
CONF_HOST = "host"
CONF_PORT = "port"
CONF_SSL  = "ssl"
CONF_USERNAME = "username"
CONF_PASSWORD = "password"

DEFAULT_PORT = 80
DEFAULT_SSL  = False

# Enigma2 Remote Control Key Codes (from OpenWebif full remote data-code attributes)
KEY_CODES = {
    # Number keys
    "KEY_0": 11,
    "KEY_1": 2,
    "KEY_2": 3,
    "KEY_3": 4,
    "KEY_4": 5,
    "KEY_5": 6,
    "KEY_6": 7,
    "KEY_7": 8,
    "KEY_8": 9,
    "KEY_9": 10,

    # Power & Mute
    "KEY_POWER": 1001,
    "KEY_MUTE":  113,

    # Volume keys
    "KEY_VOLUMEUP":   115,
    "KEY_VOLUMEDOWN": 114,

    # Navigation keys
    "KEY_UP":    103,
    "KEY_DOWN":  108,
    "KEY_LEFT":  105,
    "KEY_RIGHT": 106,
    "KEY_OK":    352,
    "KEY_MENU":  139,
    "KEY_EXIT":  174,
    "KEY_BACK":  158,
    "KEY_HOME":  102,

    # Color keys
    "KEY_RED":    398,
    "KEY_GREEN":  399,
    "KEY_YELLOW": 400,
    "KEY_BLUE":   401,

    # Channel keys
    "KEY_CHANNELUP":   402,
    "KEY_CHANNELDOWN": 403,

    # Media playback keys
    "KEY_PLAY":        207,
    "KEY_PAUSE":       119,
    "KEY_STOP":        128,
    "KEY_RECORD":      167,
    "KEY_REWIND":      168,
    "KEY_FASTFORWARD": 208,
    "KEY_PREVIOUS":    412,
    "KEY_NEXT":        407,
    "KEY_SKIPBACK":    165,
    "KEY_SKIPFORWARD": 163,

    # Info & guide keys
    "KEY_INFO":     358,
    "KEY_EPG":      365,
    "KEY_PVR":      366,
    "KEY_TIMER":    359,

    # AV & subtitle keys
    "KEY_SUBTITLE": 370,
    "KEY_AUDIO":    392,
    "KEY_TEXT":     388,
    "KEY_ASPECT":   373,

    # Navigation & mode keys
    "KEY_TV":        377,
    "KEY_RADIO":     385,
    "KEY_LIST":      393,
    "KEY_FAVORITES": 364,
    "KEY_PIP":       375,

    # System / function keys
    "KEY_HELP":    138,
    "KEY_SETUP":   141,
    "KEY_PORTAL":  156,
    "KEY_SLEEP":   142,
    "KEY_OPTIONS": 357,
    "KEY_CONTEXT": 438,
    "KEY_F1":      59,
    "KEY_F2":      60,
    "KEY_VOD":     627,

    # Letter keys (keyboard panel)
    "KEY_A": 30, "KEY_B": 48, "KEY_C": 46, "KEY_D": 32, "KEY_E": 18,
    "KEY_F": 33, "KEY_G": 34, "KEY_H": 35, "KEY_I": 23, "KEY_J": 36,
    "KEY_K": 37, "KEY_L": 38, "KEY_M": 50, "KEY_N": 49, "KEY_O": 24,
    "KEY_P": 25, "KEY_Q": 16, "KEY_R": 19, "KEY_S": 31, "KEY_T": 20,
    "KEY_U": 22, "KEY_V": 47, "KEY_W": 17, "KEY_X": 45, "KEY_Y": 21,
    "KEY_Z": 44,

    # Typing utility keys
    "KEY_SPACE":     57,
    "KEY_BACKSPACE": 14,
    "KEY_ENTER":     28,
    "KEY_LEFTSHIFT": 42,
    "KEY_DOT":       52,
    "KEY_COMMA":     51,
    "KEY_MINUS":     12,
}
