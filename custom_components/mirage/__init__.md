
"""The Mirage UI integration."""
from __future__ import annotations
import logging
from typing import Any, Dict

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.config_entries import ConfigEntry
from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.lovelace.resources import (
    async_register_resource,
    LovelaceResource,
)
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# --- Helper Functions ---
def _hex_to_rgba(hex_color: str, alpha: float) -> str:
    """Convert a hex color string to an RGBA string."""
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join([c * 2 for c in hex_color])
    if len(hex_color) != 6:
        return f"rgba(59, 130, 246, {alpha})" # Fallback color
    
    rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    return f"rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, {alpha})"

def _generate_theme_config(options: Dict[str, Any]) -> Dict[str, Any]:
    """Generate the full theme dictionary from integration options."""

    # Dark Theme Variables
    glass_alpha_dark = (options.get("glass_transparency", 30) / 100) * 1.8
    floating_alpha_dark = options.get("floating_opacity", 100) / 100
    dark_vars = {
        "mirage-accent-color": options.get("accent_color", "#3b82f6"),
        "mirage-temperature-color": options.get("temperature_color") or "var(--mirage-accent-color)",
        "mirage-weather-color": options.get("weather_color") or "var(--mirage-accent-color)",
        "mirage-humidity-color": options.get("humidity_color") or "var(--mirage-accent-color)",
        "mirage-door-color": options.get("door_color") or "var(--mirage-accent-color)",
        "mirage-primary-text-color": options.get("dark_primary_text_color", "#e5e7eb"),
        "mirage-secondary-text-color": options.get("dark_secondary_text_color", "#9ca3af"),
        "mirage-border-radius": f"{options.get('border_radius', 16)}px",
        "mirage-border-width": f"{options.get('border_width', 1.0)}px",
        "mirage-separator-width": f"{options.get('separator_width', 1.0)}px",
        "mirage-glass-blur": f"{options.get('glass_blur', 20)}px",
        "mirage-glass-bg-color-dark": f"rgba(86, 94, 88, {glass_alpha_dark:.2f})",
        "mirage-solid-bg-color-dark": options.get("solid_bg_color_dark", "#2d3748"),
        "mirage-paper-bg-color-dark": options.get("paper_bg_color_dark", "#2a2d35"),
        "mirage-floating-bg-color-dark": _hex_to_rgba(options.get("floating_bg_color_dark", "#2a323d"), floating_alpha_dark),
        "primary-background-color": options.get("bg_color_dark", "#0d1117"),
    }
    dark_vars.update({
        "card-background-color": dark_vars["mirage-solid-bg-color-dark"], # Fallback
        "primary-text-color": dark_vars["mirage-primary-text-color"],
        "secondary-text-color": dark_vars["mirage-secondary-text-color"],
        "accent-color": dark_vars["mirage-accent-color"],
        "primary-color": dark_vars["mirage-accent-color"],
    })

    # Light Theme Variables
    glass_alpha_light = (options.get("glass_transparency", 30) / 100) * 2.0
    floating_alpha_light = options.get("floating_opacity", 100) / 100
    light_vars = {
        "mirage-accent-color": options.get("accent_color", "#3b82f6"),
        "mirage-temperature-color": options.get("temperature_color") or "var(--mirage-accent-color)",
        "mirage-weather-color": options.get("weather_color") or "var(--mirage-accent-color)",
        "mirage-humidity-color": options.get("humidity_color") or "var(--mirage-accent-color)",
        "mirage-door-color": options.get("door_color") or "var(--mirage-accent-color)",
        "mirage-primary-text-color": options.get("light_primary_text_color", "#1f2937"),
        "mirage-secondary-text-color": options.get("light_secondary_text_color", "#4b5563"),
        "mirage-border-radius": f"{options.get('border_radius', 16)}px",
        "mirage-border-width": f"{options.get('border_width', 1.0)}px",
        "mirage-separator-width": f"{options.get('separator_width', 1.0)}px",
        "mirage-glass-blur": f"{options.get('glass_blur', 20)}px",
        "mirage-glass-bg-color-light": f"rgba(240, 242, 240, {glass_alpha_light:.2f})",
        "mirage-solid-bg-color-light": options.get("solid_bg_color_light", "#e2e8f0"),
        "mirage-paper-bg-color-light": options.get("paper_bg_color_light", "#ffffff"),
        "mirage-floating-bg-color-light": _hex_to_rgba(options.get("floating_bg_color_light", "#ffffff"), floating_alpha_light),
        "primary-background-color": options.get("bg_color_light", "#f3f4f6"),
    }
    light_vars.update({
        "card-background-color": light_vars["mirage-solid-bg-color-light"], # Fallback
        "primary-text-color": light_vars["mirage-primary-text-color"],
        "secondary-text-color": light_vars["mirage-secondary-text-color"],
        "accent-color": light_vars["mirage-accent-color"],
        "primary-color": light_vars["mirage-accent-color"],
    })

    return {"Mirage Dark": dark_vars, "Mirage Light": light_vars}


async def _apply_theme(hass: HomeAssistant, options: Dict[str, Any]) -> None:
    """Generate and apply the theme."""
    try:
        themes = _generate_theme_config(options)
        await hass.services.async_call("frontend", "set_theme", {"name": "Mirage Dark", "theme": themes["Mirage Dark"]}, blocking=True)
        await hass.services.async_call("frontend", "set_theme", {"name": "Mirage Light", "theme": themes["Mirage Light"]}, blocking=True)
        _LOGGER.debug("Mirage themes reloaded successfully.")
    except Exception as e:
        _LOGGER.error("Failed to set Mirage theme: %s", e)

# --- Integration Setup ---
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Mirage UI from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # Register the frontend card
    card_url = f"/{DOMAIN}/mirage-card.js"
    try:
        await async_register_resource(hass, DOMAIN, "js", card_url, "module")
        _LOGGER.info("Mirage Card registered at %s", card_url)
    except ValueError:
        _LOGGER.warning("Mirage Card resource already registered.")
    except Exception as e:
        _LOGGER.error("Failed to register Mirage Card resource: %s", e)
    
    # Serve the card file
    hass.http.register_static_path(
        f"/{DOMAIN}",
        hass.config.path("custom_components/mirage/www"),
        cache_headers=False,
    )
    
    # --- Register custom services ---
    async def async_handle_apply_preset(call: ServiceCall) -> None:
        """Handle the service call to apply a preset."""
        preset_name = call.data.get("preset_name")
        _LOGGER.info("Service 'mirage.apply_preset' called for preset: %s", preset_name)
        
        # NOTE FOR IMPLEMENTATION:
        # In a real-world scenario, this service would need to load presets
        # that are stored server-side (e.g., in the config entry's storage).
        # Since presets are currently managed client-side in localStorage,
        # this service acts as a placeholder for future server-side preset management.
        # It would fetch the preset settings and then call `_apply_theme`.
        #
        # Example logic:
        # presets = entry.options.get("presets", {})
        # if preset_name in presets:
        #     preset_settings = presets[preset_name]
        #     new_options = {**entry.options, **preset_settings}
        #     await _apply_theme(hass, new_options)
        #     hass.config_entries.async_update_entry(entry, options=new_options)
        #     _LOGGER.info("Successfully applied preset '%s'", preset_name)
        # else:
        #     _LOGGER.warning("Preset '%s' not found.", preset_name)

    hass.services.async_register(DOMAIN, "apply_preset", async_handle_apply_preset)

    # Set up the options update listener
    entry.async_on_unload(entry.add_update_listener(update_listener))

    # Apply the initial theme based on stored options
    await _apply_theme(hass, entry.options)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Unregister services
    hass.services.async_remove(DOMAIN, "apply_preset")
    _LOGGER.info("Unloading Mirage UI integration and services.")
    return True


async def update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    _LOGGER.debug("Mirage UI options have been updated, reloading theme.")
    await _apply_theme(hass, entry.options)
