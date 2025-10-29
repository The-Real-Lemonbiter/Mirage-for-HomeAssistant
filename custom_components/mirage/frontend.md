
"""Handles the registration of the Mirage UI frontend card."""
import logging
from homeassistant.core import HomeAssistant
from homeassistant.components.frontend import async_register_lovelace_resource

_LOGGER = logging.getLogger(__name__)

async def async_register(hass: HomeAssistant, static_path_url: str) -> None:
    """
    Register the Mirage Card Lovelace resource.
    This function is called from the main __init__.py during setup.
    """
    resource_url = f"{static_path_url}/mirage-card.js"
    _LOGGER.debug("Registering Mirage Card Lovelace resource: %s", resource_url)

    # The async_register_lovelace_resource function handles checking
    # if the resource is already registered, so we don't need to do it manually.
    await async_register_lovelace_resource(
        hass,
        resource_url,
        "module"
    )
