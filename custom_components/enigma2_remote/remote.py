"""Support for Enigma2 Remote Control."""
import logging
import aiohttp
import async_timeout

from homeassistant.components.remote import RemoteEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers import aiohttp_client

from .const import DOMAIN, DEFAULT_PORT, KEY_CODES

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Enigma2 Remote Control from a config entry."""
    host = config_entry.data[CONF_HOST]
    port = config_entry.data.get(CONF_PORT, DEFAULT_PORT)
    
    async_add_entities([Enigma2Remote(hass, host, port, config_entry.entry_id)], True)


class Enigma2Remote(RemoteEntity):
    """Representation of an Enigma2 Remote Control."""

    def __init__(self, hass: HomeAssistant, host: str, port: int, entry_id: str) -> None:
        """Initialize the remote."""
        self._hass = hass
        self._host = host
        self._port = port
        self._entry_id = entry_id
        self._attr_name = f"Enigma2 Remote ({host})"
        self._attr_unique_id = f"enigma2_remote_{host}_{port}"
        self._attr_is_on = True  # Assume always on for remote
        self._session = aiohttp_client.async_get_clientsession(hass)

    @property
    def device_info(self):
        """Return device information."""
        return {
            "identifiers": {(DOMAIN, self._entry_id)},
            "name": f"Enigma2 ({self._host})",
            "manufacturer": "Enigma2",
            "model": "Set-Top Box",
        }

    async def async_turn_on(self, **kwargs):
        """Turn the device on by sending power key."""
        _LOGGER.debug("Turn on called - sending power key")
        await self._send_key(KEY_CODES["KEY_POWER"], long_press=False)

    async def async_turn_off(self, **kwargs):
        """Turn the device off by sending power key (standby)."""
        _LOGGER.debug("Turn off called - sending power key for standby")
        await self._send_key(KEY_CODES["KEY_POWER"], long_press=False)

    async def async_send_command(self, command, **kwargs):
        """Send a command to the Enigma2 device."""
        num_repeats = kwargs.get("num_repeats", 1)
        hold = kwargs.get("hold_secs", 0)
        
        for cmd in command:
            # Get the key code
            key_code = KEY_CODES.get(cmd.upper())
            
            if key_code is None:
                _LOGGER.error("Unknown command: %s", cmd)
                continue
            
            # Repeat the command if specified
            for _ in range(num_repeats):
                if hold > 0:
                    # Long press
                    await self._send_key(key_code, long_press=True)
                else:
                    # Normal press
                    await self._send_key(key_code, long_press=False)

    async def _send_key(self, key_code: int, long_press: bool = False) -> None:
        """Send a key press to the Enigma2 device."""
        if long_press:
            url = f"http://{self._host}:{self._port}/api/remotecontrol?type=long&command={key_code}"
        else:
            url = f"http://{self._host}:{self._port}/api/remotecontrol?command={key_code}"
        
        try:
            async with async_timeout.timeout(10):
                async with self._session.get(url) as response:
                    if response.status != 200:
                        _LOGGER.error(
                            "Error sending key %s: HTTP %s",
                            key_code,
                            response.status,
                        )
                    else:
                        _LOGGER.debug("Successfully sent key %s (long_press=%s)", key_code, long_press)
        except Exception as err:
            _LOGGER.error("Error sending key %s: %s", key_code, err)
