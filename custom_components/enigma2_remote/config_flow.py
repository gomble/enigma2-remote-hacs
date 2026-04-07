"""Config flow for Enigma2 Remote Control integration."""
import logging
import socket
import aiohttp
import async_timeout
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_HOST, CONF_PORT, CONF_USERNAME, CONF_PASSWORD
from homeassistant.core import HomeAssistant
from homeassistant.helpers import aiohttp_client

from .const import DOMAIN, DEFAULT_PORT, DEFAULT_SSL, CONF_SSL

_LOGGER = logging.getLogger(__name__)


def _build_base_url(host: str, port: int, ssl: bool) -> str:
    scheme = "https" if ssl else "http"
    return f"{scheme}://{host}:{port}"


async def _resolve_host(host: str) -> str | None:
    """Resolve hostname to IP to verify it is reachable. Returns None on failure."""
    try:
        loop = __import__("asyncio").get_event_loop()
        result = await loop.run_in_executor(None, socket.gethostbyname, host)
        return result
    except socket.gaierror as err:
        _LOGGER.debug("DNS resolution failed for '%s': %s", host, err)
        return None


class Enigma2RemoteConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Enigma2 Remote Control."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        errors = {}
        description_placeholders = {}

        if user_input is not None:
            host     = user_input[CONF_HOST].strip()
            port     = user_input.get(CONF_PORT, DEFAULT_PORT)
            ssl      = user_input.get(CONF_SSL, DEFAULT_SSL)
            username = user_input.get(CONF_USERNAME, "").strip()
            password = user_input.get(CONF_PASSWORD, "")

            # 1. Resolve hostname
            resolved = await _resolve_host(host)
            if resolved is None:
                _LOGGER.error(
                    "Cannot resolve hostname '%s' — check that the hostname is "
                    "correct and reachable from Home Assistant.",
                    host,
                )
                errors["base"] = "cannot_resolve"
            else:
                _LOGGER.debug("Resolved '%s' → %s", host, resolved)

                # 2. Test HTTP(S) connection
                error_key, detail = await self._test_connection(
                    host, port, ssl, username, password
                )
                if error_key is None:
                    await self.async_set_unique_id(f"{host}:{port}")
                    self._abort_if_unique_id_configured()
                    return self.async_create_entry(
                        title=f"Enigma2 ({host})",
                        data={
                            CONF_HOST:     host,
                            CONF_PORT:     port,
                            CONF_SSL:      ssl,
                            CONF_USERNAME: username,
                            CONF_PASSWORD: password,
                        },
                    )
                else:
                    errors["base"] = error_key
                    description_placeholders["error_detail"] = detail

        data_schema = vol.Schema(
            {
                vol.Required(CONF_HOST): str,
                vol.Optional(CONF_PORT, default=DEFAULT_PORT): int,
                vol.Optional(CONF_SSL, default=DEFAULT_SSL): bool,
                vol.Optional(CONF_USERNAME, default=""): str,
                vol.Optional(CONF_PASSWORD, default=""): str,
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
            errors=errors,
            description_placeholders=description_placeholders,
        )

    async def _test_connection(
        self,
        host: str,
        port: int,
        ssl: bool,
        username: str,
        password: str,
    ) -> tuple[str | None, str]:
        """
        Try to reach /api/about on the Enigma2 box.

        Returns (None, "") on success, or (error_key, detail_message) on failure.
        """
        base_url = _build_base_url(host, port, ssl)
        url = f"{base_url}/api/about"

        auth = None
        if username:
            auth = aiohttp.BasicAuth(username, password)

        # When SSL is used with a self-signed cert, we allow it via ssl=False on the request.
        ssl_verify = False if ssl else None

        session = aiohttp_client.async_get_clientsession(self.hass)

        try:
            async with async_timeout.timeout(10):
                async with session.get(url, auth=auth, ssl=ssl_verify) as response:
                    if response.status == 200:
                        _LOGGER.info(
                            "Successfully connected to Enigma2 at %s", url
                        )
                        return None, ""

                    if response.status == 401:
                        body = await response.text()
                        _LOGGER.error(
                            "Authentication failed for %s (HTTP 401). "
                            "Check username and password. Response: %s",
                            url, body[:200],
                        )
                        return "invalid_auth", f"HTTP 401 — invalid credentials"

                    body = await response.text()
                    _LOGGER.error(
                        "Unexpected HTTP %s from %s. Body: %s",
                        response.status, url, body[:200],
                    )
                    return "cannot_connect", f"HTTP {response.status}"

        except aiohttp.ClientConnectorError as err:
            _LOGGER.error(
                "Connection refused / network error reaching %s — "
                "check that the host is online, the port (%s) is correct, "
                "and that OpenWebif is running. Detail: %s",
                url, port, err,
            )
            return "cannot_connect", str(err)

        except aiohttp.ClientSSLError as err:
            _LOGGER.error(
                "SSL/TLS error connecting to %s — "
                "the server may be using a self-signed certificate "
                "(this integration accepts self-signed certs). Detail: %s",
                url, err,
            )
            return "cannot_connect", f"SSL error: {err}"

        except aiohttp.ServerTimeoutError as err:
            _LOGGER.error(
                "Connection to %s timed out after 10 s — "
                "check that the device is powered on and reachable. Detail: %s",
                url, err,
            )
            return "cannot_connect", f"Timeout: {err}"

        except aiohttp.ClientError as err:
            _LOGGER.error(
                "HTTP client error connecting to %s: %s", url, err
            )
            return "cannot_connect", str(err)

        except Exception as err:  # noqa: BLE001
            _LOGGER.exception(
                "Unexpected error while testing connection to %s: %s", url, err
            )
            return "unknown", str(err)
