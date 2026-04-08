"""Constants for the Enigma2 Remote Control integration."""

DOMAIN = "enigma2_remote"

# Frontend
URL_BASE = "/enigma2_remote"
ENIGMA2_CARDS = [
    {
        "name":     "Enigma2 Remote Card",
        "filename": "enigma2-remote-card.js",
        "version":  "1.7.0",
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

# Enigma2 Remote Control Key Codes (from OpenWebif main.tmpl data-code attributes)
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

    # Power & Mute (OpenWebif special codes)
    "KEY_POWER": 1001,
    "KEY_MUTE": 1000,

    # Volume keys
    "KEY_VOLUMEUP": 115,
    "KEY_VOLUMEDOWN": 114,

    # Navigation keys
    "KEY_UP": 103,
    "KEY_DOWN": 108,
    "KEY_LEFT": 105,
    "KEY_RIGHT": 106,
    "KEY_OK": 352,
    "KEY_MENU": 139,
    "KEY_EXIT": 174,
    "KEY_BACK": 158,
    "KEY_HOME": 102,

    # Color keys
    "KEY_RED": 398,
    "KEY_GREEN": 399,
    "KEY_YELLOW": 400,
    "KEY_BLUE": 401,

    # Channel keys
    "KEY_CHANNELUP": 402,
    "KEY_CHANNELDOWN": 403,

    # Media playback keys
    "KEY_PLAY": 207,
    "KEY_PAUSE": 119,
    "KEY_STOP": 128,
    "KEY_RECORD": 167,
    "KEY_REWIND": 168,
    "KEY_FASTFORWARD": 208,
    "KEY_PREVIOUS": 412,
    "KEY_NEXT": 407,

    # Additional keys
    "KEY_INFO": 358,
    "KEY_EPG": 365,
    "KEY_SUBTITLE": 370,
    "KEY_TV": 377,
    "KEY_RADIO": 385,
    "KEY_AUDIO": 392,
    "KEY_LIST": 393,
    "KEY_TEXT": 388,
    "KEY_HELP": 138,
    "KEY_VOD": 627,
}
