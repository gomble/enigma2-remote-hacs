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
CARD_URL       = f"{CARD_SERVE_URL}?v={_VERSION}"
CARD_PATH      = os.path.join(os.path.dirname(__file__), "www", "enigma2-remote-card.js")


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Enigma2 Remote Control from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    if "_card_registered" not in hass.data[DOMAIN]:
        # 1. Serve the JS file as a static path
        if os.path.isfile(CARD_PATH):
            from homeassistant.components.http import StaticPathConfig
            await hass.http.async_register_static_paths(
                [StaticPathConfig(CARD_SERVE_URL, CARD_PATH, cache_headers=False)]
            )
            _LOGGER.info(
                "Enigma2 Remote Card served at %s (version %s)", CARD_URL, _VERSION
            )

        # 2. Remove any stale entries for our card URL from lovelace_resources storage.
        #    These were written by older versions of this integration using
        #    async_create_item(). We delete them so the browser doesn't pick up the
        #    unversioned URL and ignore the cache-busted one.
        await _async_cleanup_stale_lovelace_resource(hass)

        # 3. Register via add_extra_js_url — in-memory only, never writes to
        #    .storage/lovelace_resources, so it cannot affect other integrations.
        from homeassistant.components.frontend import add_extra_js_url
        add_extra_js_url(hass, CARD_URL)
        _LOGGER.info(
            "Enigma2 Remote Card registered as extra JS module: %s", CARD_URL
        )

        hass.data[DOMAIN]["_card_registered"] = True

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_cleanup_stale_lovelace_resource(hass: HomeAssistant) -> None:
    """
    Remove any lovelace_resources entry whose URL starts with CARD_SERVE_URL.

    This cleans up entries written by older versions of this integration
    (which used ResourceStorageCollection.async_create_item). Those entries
    lack the ?v= suffix and prevent proper cache-busting.
    """
    try:
        from homeassistant.components.lovelace.resources import ResourceStorageCollection

        if "lovelace" not in hass.data:
            return

        lovelace_data = hass.data["lovelace"]
        resources = None

        if hasattr(lovelace_data, "resources"):
            resources = lovelace_data.resources
        elif isinstance(lovelace_data, dict):
            resources = lovelace_data.get("resources")

        if resources is None or not isinstance(resources, ResourceStorageCollection):
            return

        # Find all items whose URL is our card (with or without ?v=...)
        to_delete = [
            item["id"]
            for item in resources.async_items()
            if item.get("url", "").startswith(CARD_SERVE_URL)
        ]

        for item_id in to_delete:
            try:
                await resources.async_delete_item(item_id)
                _LOGGER.info(
                    "Removed stale Lovelace resource entry (id=%s) — "
                    "card is now served via add_extra_js_url with version suffix",
                    item_id,
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning(
                    "Could not remove stale Lovelace resource id=%s: %s",
                    item_id, err,
                )

    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Stale resource cleanup skipped: %s", err)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok
