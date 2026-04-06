"""The Enigma2 Remote Control integration."""
import logging
import os

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.const import Platform
from homeassistant.components.lovelace.resources import (
    ResourceStorageCollection,
)

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.REMOTE]

CARD_URL = f"/enigma2_remote/enigma2-remote-card.js"
CARD_PATH = os.path.join(os.path.dirname(__file__), "www", "enigma2-remote-card.js")


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Enigma2 Remote Control from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    # Register the static path for the Lovelace card
    should_register = True
    if DOMAIN in hass.data and "_card_registered" in hass.data[DOMAIN]:
        should_register = False

    if should_register and os.path.isfile(CARD_PATH):
        from homeassistant.components.http import StaticPathConfig

        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, CARD_PATH, cache_headers=False)]
        )
        hass.data[DOMAIN]["_card_registered"] = True
        _LOGGER.info(
            "Enigma2 Remote Card registered at %s", CARD_URL
        )

        # Auto-add the card as a Lovelace resource
        await _async_register_lovelace_resource(hass)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Register the Lovelace card as a frontend resource."""
    try:
        # Access the Lovelace resources collection
        if "lovelace" not in hass.data:
            _LOGGER.debug("Lovelace not yet loaded, skipping resource registration")
            return

        lovelace_data = hass.data["lovelace"]

        # Try to get the resources collection
        resources = None
        if hasattr(lovelace_data, "resources"):
            resources = lovelace_data.resources
        elif isinstance(lovelace_data, dict) and "resources" in lovelace_data:
            resources = lovelace_data["resources"]

        if resources is None:
            _LOGGER.debug(
                "Could not find Lovelace resources collection, "
                "using frontend extra_module_url instead"
            )
            # Fallback: register via frontend extra module URL
            hass.data.setdefault("frontend_extra_module_url", set()).add(CARD_URL)
            return

        # Check if the resource is already registered
        if isinstance(resources, ResourceStorageCollection):
            existing = resources.async_items()
            for item in existing:
                if item.get("url", "") == CARD_URL:
                    _LOGGER.debug(
                        "Enigma2 Remote Card resource already registered"
                    )
                    return

            # Add the resource
            await resources.async_create_item(
                {"res_type": "module", "url": CARD_URL}
            )
            _LOGGER.info(
                "Enigma2 Remote Card Lovelace resource added: %s", CARD_URL
            )
        else:
            # Fallback for other resource types
            hass.data.setdefault("frontend_extra_module_url", set()).add(CARD_URL)
            _LOGGER.info(
                "Enigma2 Remote Card registered via frontend_extra_module_url"
            )

    except Exception as err:
        _LOGGER.warning(
            "Could not auto-register Lovelace resource: %s. "
            "You may need to add the resource manually: %s",
            err,
            CARD_URL,
        )
        # Ensure at least the fallback is set
        hass.data.setdefault("frontend_extra_module_url", set()).add(CARD_URL)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)

    return unload_ok
