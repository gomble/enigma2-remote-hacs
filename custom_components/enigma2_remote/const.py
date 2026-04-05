"""Constants for the Enigma2 Remote Control integration."""

DOMAIN = "enigma2_remote"

# Configuration
CONF_HOST = "host"
CONF_PORT = "port"

DEFAULT_PORT = 80

# Enigma2 Remote Control Key Codes
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
    
    # Power
    "KEY_POWER": 116,
    
    # Volume keys
    "KEY_VOLUMEUP": 115,
    "KEY_VOLUMEDOWN": 114,
    "KEY_MUTE": 113,
    
    # Navigation keys
    "KEY_UP": 103,
    "KEY_DOWN": 108,
    "KEY_LEFT": 105,
    "KEY_RIGHT": 106,
    "KEY_OK": 352,
    "KEY_MENU": 139,
    "KEY_EXIT": 174,
    
    # Color keys
    "KEY_RED": 398,
    "KEY_GREEN": 399,
    "KEY_YELLOW": 400,
    "KEY_BLUE": 401,
    
    # Channel keys
    "KEY_CHANNELUP": 402,
    "KEY_CHANNELDOWN": 403,
    
    # Additional keys
    "KEY_INFO": 358,
    "KEY_EPG": 365,
    "KEY_PVR": 393,
    "KEY_TV": 377,
    "KEY_TEXT": 388,
    "KEY_HELP": 138,
}
