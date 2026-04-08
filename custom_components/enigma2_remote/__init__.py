"""The Enigma2 Remote Control integration."""
import json
import logging
import os
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.const import Platform

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.REMOTE]

# Read version from manifest so the URL changes on every release → cache-busting
_MANIFEST = json.loads((Path(__file__).parent / "manifest.json").read_text())
_VERSION   = _MANIFEST.get("version", "0")

CARD_SERVE_URL = "/enigma2_remote/enigma2-remote-card.js"
CARD_URL       = f"{CARD_SERVE_URL}?v={_VERSION}"   # versioned, for browser cache-busting
CARD_PATH      = os.path.join(os.path.dirname(__file__), "www", "enigma2-remote-card.js")


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Enigma2 Remote Control from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    # Register the static path for the Lovelace card (only once per HA run)
    if "_card_registered" not in hass.data[DOMAIN]:
        if os.path.isfile(CARD_PATH):
            from homeassistant.components.http import StaticPathConfig

            await hass.http.async_register_static_paths(
                [StaticPathConfig(CARD_SERVE_URL, CARD_PATH, cache_headers=False)]
            )
            _LOGGER.info("Enigma2 Remote Card served at %s (version %s)", CARD_URL, _VERSION)

        # Register as an extra JS module — in-memory only, never touches
        # .storage/lovelace_resources, so it cannot corrupt other integrations'
        # resource entries (e.g. /hacsfile/... entries added by HACS).
        from homeassistant.components.frontend import add_extra_js_url
        add_extra_js_url(hass, CARD_URL)
        _LOGGER.info("Enigma2 Remote Card registered as extra JS module: %s", CARD_URL)

        hass.data[DOMAIN]["_card_registered"] = True

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok
