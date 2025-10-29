
"""Set up the Mirage UI frontend."""
import logging
from homeassistant.core import HomeAssistant
from homeassistant.components.frontend import async_register_lovelace_resource

_LOGGER = logging.getLogger(__name__)
DOMAIN = "mirage"
URL_BASE = f"/{DOMAIN}_static"
RESOURCE_URL = f"{URL_BASE}/mirage-card.js"

async def async_setup_platform(hass: HomeAssistant, config, async_add_entities, discovery_info=None):
    """Set up the Mirage frontend platform."""

    # Register static path for the card resources
    # This makes the files in the 'www' directory accessible via a URL.
    if DOMAIN not in hass.http.components:
        _LOGGER.debug("Registering Mirage static path %s", URL_BASE)
        hass.http.register_static_path(
            URL_BASE,
            hass.config.path(f"custom_components/{DOMAIN}/www"),
            cache_headers=False
        )

    # Register the Lovelace card resource
    # The URL points to the file served by our static path.
    resource_manager = hass.data.get("lovelace", {}).get("resources")
    if resource_manager and not resource_manager.is_registered(RESOURCE_URL):
        try:
            await async_register_lovelace_resource(
                hass,
                RESOURCE_URL,
                "module"
            )
            _LOGGER.info("Registered Mirage Card resource: %s", RESOURCE_URL)
        except ValueError:
            _LOGGER.warning("Mirage Card resource may already be registered.")
    else:
        _LOGGER.debug("Mirage Card resource already registered.")
        
    return True
