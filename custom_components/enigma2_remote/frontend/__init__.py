"""Frontend registration for Enigma2 Remote Card."""
import logging
import pathlib

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import __version__ as HA_VERSION

from ..const import DOMAIN, URL_BASE, ENIGMA2_CARDS

_LOGGER = logging.getLogger(__name__)


def _ha_version_tuple(version_str: str) -> tuple:
    """Convert a HA version string like '2025.3.1' to a comparable tuple."""
    try:
        return tuple(int(x) for x in version_str.split(".")[:3])
    except Exception:
        return (0, 0, 0)


_HA = _ha_version_tuple(HA_VERSION)


class Enigma2CardRegistration:
    def __init__(self, hass: HomeAssistant):
        self.hass = hass

    @property
    def lovelace_resource_mode(self) -> str:
        lovelace = self.hass.data.get("lovelace")
        if lovelace is None:
            return "storage"
        if _HA >= (2026, 2, 0):
            return lovelace.resource_mode
        elif _HA >= (2025, 2, 0):
            return lovelace.mode
        else:
            return lovelace.get("mode", "storage")

    @property
    def lovelace_resources(self):
        lovelace = self.hass.data.get("lovelace")
        if lovelace is None:
            return None
        if _HA >= (2025, 2, 0):
            return lovelace.resources
        else:
            return lovelace.get("resources")

    async def async_register(self) -> None:
        await self._async_register_static_path()
        if self.lovelace_resource_mode == "storage":
            await self._async_wait_for_lovelace_resources()

    async def _async_register_static_path(self) -> None:
        """Serve the www/ directory at URL_BASE."""
        www_path = pathlib.Path(__file__).parent.parent / "www"
        try:
            await self.hass.http.async_register_static_paths(
                [StaticPathConfig(URL_BASE, str(www_path), False)]
            )
            _LOGGER.debug("Enigma2 Remote: static path registered at %s → %s", URL_BASE, www_path)
        except RuntimeError:
            _LOGGER.debug("Enigma2 Remote: static path already registered")

    async def _async_wait_for_lovelace_resources(self) -> None:
        """Wait until Lovelace resources are loaded, then register the card."""
        async def _check(now):
            resources = self.lovelace_resources
            if resources is not None and resources.loaded:
                await self._async_register_cards()
            else:
                _LOGGER.debug(
                    "Enigma2 Remote: Lovelace resources not yet loaded, retrying in 5 s"
                )
                async_call_later(self.hass, 5, _check)

        await _check(None)

    async def _async_register_cards(self) -> None:
        """Create or update each card entry in lovelace_resources."""
        resources = self.lovelace_resources
        if resources is None:
            _LOGGER.warning("Enigma2 Remote: cannot access lovelace resources")
            return

        # All existing entries that belong to our integration
        existing = [
            r for r in resources.async_items()
            if r.get("url", "").startswith(URL_BASE)
        ]

        for card in ENIGMA2_CARDS:
            base_url    = f"{URL_BASE}/{card['filename']}"
            versioned   = f"{base_url}?v={card['version']}"
            registered  = False

            for res in existing:
                res_path = res["url"].split("?")[0]
                res_ver  = res["url"].split("?v=")[-1] if "?v=" in res["url"] else ""

                if res_path == base_url:
                    registered = True
                    if res_ver != card["version"]:
                        _LOGGER.info(
                            "Enigma2 Remote: updating %s → v%s", card["name"], card["version"]
                        )
                        await resources.async_update_item(
                            res["id"], {"res_type": "module", "url": versioned}
                        )
                    else:
                        _LOGGER.debug(
                            "Enigma2 Remote: %s already registered at v%s",
                            card["name"], card["version"],
                        )

            if not registered:
                _LOGGER.info(
                    "Enigma2 Remote: registering %s v%s", card["name"], card["version"]
                )
                await resources.async_create_item({"res_type": "module", "url": versioned})

    async def async_unregister(self) -> None:
        """Remove our resource entries when the integration is unloaded."""
        if self.lovelace_resource_mode != "storage":
            return
        resources = self.lovelace_resources
        if resources is None:
            return
        for card in ENIGMA2_CARDS:
            base_url = f"{URL_BASE}/{card['filename']}"
            to_delete = [
                r for r in resources.async_items()
                if r.get("url", "").startswith(base_url)
            ]
            for res in to_delete:
                await resources.async_delete_item(res["id"])
                _LOGGER.debug("Enigma2 Remote: removed resource %s", res["url"])
