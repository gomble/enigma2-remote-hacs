"""The Enigma2 Remote Control integration."""
import json
import logging
import os
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.REMOTE]

_MANIFEST  = json.loads((Path(__file__).parent / "manifest.json").read_text())
_VERSION   = _MANIFEST.get("version", "0")

CARD_SERVE_URL = "/enigma2_remote/enigma2-remote-card.js"
CARD_URL       = f"{CARD_SERVE_URL}?v={_VERSION}"
CARD_PATH      = os.path.join(os.path.dirname(__file__), "www", "enigma2-remote-card.js")

# HA stores Lovelace resources here
_LOVELACE_RESOURCES_STORE = "lovelace_resources"
_LOVELACE_RESOURCES_VERSION = 1


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Enigma2 Remote Control from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    if "_card_registered" not in hass.data[DOMAIN]:
        # Serve the JS file as a static path
        if os.path.isfile(CARD_PATH):
            from homeassistant.components.http import StaticPathConfig
            await hass.http.async_register_static_paths(
                [StaticPathConfig(CARD_SERVE_URL, CARD_PATH, cache_headers=False)]
            )
            _LOGGER.info("Enigma2 Remote Card served at %s", CARD_URL)

        # Remove the stale unversioned storage entry directly from the Store.
        # This works regardless of whether Lovelace is already loaded in memory.
        await _async_remove_stale_storage_entry(hass)

        # Register the card in-memory only — never writes to lovelace_resources.
        from homeassistant.components.frontend import add_extra_js_url
        add_extra_js_url(hass, CARD_URL)
        _LOGGER.info("Enigma2 Remote Card registered: %s", CARD_URL)

        hass.data[DOMAIN]["_card_registered"] = True

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_remove_stale_storage_entry(hass: HomeAssistant) -> None:
    """
    Remove any lovelace_resources storage entry for our card.

    Older versions of this integration called ResourceStorageCollection.async_create_item(),
    which wrote the unversioned URL into .storage/lovelace_resources. We read and rewrite
    that file directly via Store so the stale entry is gone on next browser load.
    """
    try:
        store = Store(hass, _LOVELACE_RESOURCES_VERSION, _LOVELACE_RESOURCES_STORE)
        data = await store.async_load()

        if not data or "items" not in data:
            return

        original = list(data["items"])
        cleaned  = [
            item for item in original
            if not item.get("url", "").startswith(CARD_SERVE_URL)
        ]

        if len(cleaned) == len(original):
            _LOGGER.debug("No stale Enigma2 resource entry found in lovelace_resources.")
            return

        data["items"] = cleaned
        await store.async_save(data)
        _LOGGER.info(
            "Removed %d stale Enigma2 resource entry(s) from lovelace_resources storage. "
            "Card is now served as versioned extra JS module: %s",
            len(original) - len(cleaned),
            CARD_URL,
        )

    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Could not clean up stale lovelace_resources entry: %s", err)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok
