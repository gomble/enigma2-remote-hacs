"""Config flow for Enigma2 Remote Control integration."""
import logging
import aiohttp
import async_timeout
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import HomeAssistant
from homeassistant.helpers import aiohttp_client

from .const import DOMAIN, DEFAULT_PORT

_LOGGER = logging.getLogger(__name__)


class Enigma2RemoteConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Enigma2 Remote Control."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            # Validate the connection
            host = user_input[CONF_HOST]
            port = user_input.get(CONF_PORT, DEFAULT_PORT)
            
            if await self._test_connection(host, port):
                # Create a unique ID based on host and port
                await self.async_set_unique_id(f"{host}:{port}")
                self._abort_if_unique_id_configured()
                
                return self.async_create_entry(
                    title=f"Enigma2 Remote ({host})",
                    data=user_input,
                )
            else:
                errors["base"] = "cannot_connect"

        # Show the configuration form
        data_schema = vol.Schema(
            {
                vol.Required(CONF_HOST): str,
                vol.Optional(CONF_PORT, default=DEFAULT_PORT): int,
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
            errors=errors,
        )

    async def _test_connection(self, host: str, port: int) -> bool:
        """Test if we can connect to the Enigma2 device."""
        url = f"http://{host}:{port}/api/about"
        
        try:
            session = aiohttp_client.async_get_clientsession(self.hass)
            async with async_timeout.timeout(10):
                async with session.get(url) as response:
                    return response.status == 200
        except Exception as err:
            _LOGGER.error("Error connecting to Enigma2 device: %s", err)
            return False
