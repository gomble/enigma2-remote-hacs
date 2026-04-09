"""Support for Enigma2 Remote Control."""
import logging
import aiohttp
import async_timeout

from homeassistant.components.remote import RemoteEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PORT, CONF_USERNAME, CONF_PASSWORD
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers import aiohttp_client

from .const import DOMAIN, DEFAULT_PORT, DEFAULT_SSL, CONF_SSL, KEY_CODES

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Enigma2 Remote Control from a config entry."""
    host     = config_entry.data[CONF_HOST]
    port     = config_entry.data.get(CONF_PORT, DEFAULT_PORT)
    ssl      = config_entry.data.get(CONF_SSL, DEFAULT_SSL)
    username = config_entry.data.get(CONF_USERNAME, "")
    password = config_entry.data.get(CONF_PASSWORD, "")

    async_add_entities(
        [Enigma2Remote(hass, host, port, ssl, username, password, config_entry.entry_id)],
        True,
    )


class Enigma2Remote(RemoteEntity):
    """Representation of an Enigma2 Remote Control."""

    def __init__(
        self,
        hass: HomeAssistant,
        host: str,
        port: int,
        ssl: bool,
        username: str,
        password: str,
        entry_id: str,
    ) -> None:
        """Initialize the remote."""
        self._hass     = hass
        self._host     = host
        self._port     = port
        self._ssl      = ssl
        self._username = username
        self._password = password
        self._entry_id = entry_id

        scheme = "https" if ssl else "http"
        self._base_url = f"{scheme}://{host}:{port}"

        self._auth = aiohttp.BasicAuth(username, password) if username else None
        # Accept self-signed certificates when SSL is active
        self._ssl_param = False if ssl else None

        self._attr_name      = f"Enigma2 Remote ({host})"
        self._attr_unique_id = f"enigma2_remote_{host}_{port}"
        self._attr_is_on     = True
        self._session        = aiohttp_client.async_get_clientsession(hass)

    @property
    def device_info(self):
        """Return device information."""
        return {
            "identifiers": {(DOMAIN, self._entry_id)},
            "name":         f"Enigma2 ({self._host})",
            "manufacturer": "Enigma2",
            "model":        "Set-Top Box",
        }

    # ── HA service hooks ──────────────────────────────────────────────────────

    async def async_turn_on(self, **kwargs):
        """Wake up the device (power state 4)."""
        _LOGGER.debug("turn_on → power state 4 (Wake Up)")
        await self._send_power_state(4)

    async def async_turn_off(self, **kwargs):
        """Put the device into standby (power state 5)."""
        _LOGGER.debug("turn_off → power state 5 (Standby)")
        await self._send_power_state(5)

    async def async_send_command(self, command, **kwargs):
        """Send one or more commands to the Enigma2 device."""
        num_repeats = kwargs.get("num_repeats", 1)
        hold        = kwargs.get("hold_secs", 0)

        for cmd in command:
            cmd_upper = cmd.upper()

            # ── Power state shortcut ──
            if cmd_upper.startswith("POWER_STATE_"):
                try:
                    state = int(cmd_upper.replace("POWER_STATE_", ""))
                    if not 0 <= state <= 5:
                        raise ValueError(f"state {state} out of range 0–5")
                    await self._send_power_state(state)
                except ValueError as err:
                    _LOGGER.error(
                        "Invalid power state command '%s': %s — "
                        "valid commands are POWER_STATE_0 … POWER_STATE_5",
                        cmd, err,
                    )
                continue

            # ── Mute (uses volume API, not remotecontrol) ──
            if cmd_upper == "KEY_MUTE":
                for _ in range(num_repeats):
                    await self._send_mute()
                continue

            # ── Regular key press ──
            key_code = KEY_CODES.get(cmd_upper)
            if key_code is None:
                _LOGGER.error(
                    "Unknown command '%s' — not found in KEY_CODES. "
                    "Check const.py for available key names.",
                    cmd,
                )
                continue

            for _ in range(num_repeats):
                await self._send_key(key_code, long_press=(hold > 0))

    # ── Internal helpers ──────────────────────────────────────────────────────

    async def _send_mute(self) -> None:
        """Toggle mute via the volume API (web/vol?set=mute)."""
        url = f"{self._base_url}/web/vol?set=mute"
        await self._get(url, context="mute toggle")

    async def _send_power_state(self, state: int) -> None:
        """Send a power-state request to /api/powerstate."""
        url = f"{self._base_url}/api/powerstate?newstate={state}"
        await self._get(url, context=f"power state {state}")

    async def _send_key(self, key_code: int, long_press: bool = False) -> None:
        """Send a key-press request to /api/remotecontrol."""
        if long_press:
            url = f"{self._base_url}/api/remotecontrol?type=long&command={key_code}"
        else:
            url = f"{self._base_url}/api/remotecontrol?command={key_code}"
        await self._get(url, context=f"key {key_code} (long={long_press})")

    async def _get(self, url: str, context: str) -> bool:
        """
        Perform a GET request and log detailed diagnostics on any failure.

        Returns True on success, False on any error.
        """
        try:
            async with async_timeout.timeout(10):
                async with self._session.get(
                    url, auth=self._auth, ssl=self._ssl_param
                ) as response:
                    if response.status == 200:
                        _LOGGER.debug("OK [%s] → %s", context, url)
                        return True

                    body = await response.text()

                    if response.status == 401:
                        _LOGGER.error(
                            "Authentication failed [%s] → %s — "
                            "HTTP 401 Unauthorized. "
                            "Check the username and password in the integration settings. "
                            "Response body: %s",
                            context, url, body[:300],
                        )
                    elif response.status == 403:
                        _LOGGER.error(
                            "Access denied [%s] → %s — "
                            "HTTP 403 Forbidden. "
                            "The OpenWebif user may lack permission for this endpoint.",
                            context, url,
                        )
                    elif response.status == 404:
                        _LOGGER.error(
                            "Endpoint not found [%s] → %s — "
                            "HTTP 404. "
                            "Check that OpenWebif is running and the port is correct.",
                            context, url,
                        )
                    else:
                        _LOGGER.error(
                            "Unexpected HTTP %s [%s] → %s. Body: %s",
                            response.status, context, url, body[:300],
                        )
                    return False

        except aiohttp.ClientConnectorError as err:
            _LOGGER.error(
                "Cannot connect [%s] → %s — "
                "The device may be offline, the hostname/IP may have changed, "
                "or the port (%s) is blocked. Detail: %s",
                context, url, self._port, err,
            )
        except aiohttp.ClientSSLError as err:
            _LOGGER.error(
                "SSL/TLS error [%s] → %s — "
                "If the receiver uses a self-signed certificate this should "
                "normally be handled automatically. Detail: %s",
                context, url, err,
            )
        except aiohttp.ServerTimeoutError:
            _LOGGER.error(
                "Timeout [%s] → %s — "
                "No response within 10 s. "
                "Check that the device is powered on and reachable on the network.",
                context, url,
            )
        except aiohttp.ClientError as err:
            _LOGGER.error(
                "HTTP client error [%s] → %s: %s",
                context, url, err,
            )
        except Exception as err:  # noqa: BLE001
            _LOGGER.exception(
                "Unexpected error [%s] → %s: %s",
                context, url, err,
            )

        return False
