"""Mirage UI Integration for Home Assistant."""
import logging
import voluptuous as vol

from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)

DOMAIN = "mirage"

CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)

PLATFORMS = []

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Mirage UI component."""
    hass.data.setdefault(DOMAIN, {})
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Mirage UI from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.options

    # Register the theme stubs. They get populated by the update_listener.
    hass.components.frontend.async_register_theme("Mirage Dark", {})
    hass.components.frontend.async_register_theme("Mirage Light", {})


    # Register the Lovelace card resource
    # The actual registration happens in frontend.py, which we need to create.
    # For now, let's assume it gets loaded.
    hass.async_create_task(
        hass.helpers.discovery.async_load_platform('frontend', DOMAIN, {}, entry)
    )

    # This listener will update the theme when options are changed.
    entry.async_on_unload(entry.add_update_listener(update_listener))

    # Apply the initial theme settings
    await update_theme(hass, entry)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    hass.data[DOMAIN].pop(entry.entry_id)
    # Themes and frontend resources are not easily unregistered.
    # A restart of Home Assistant is the cleanest way to remove them.
    return True

async def update_listener(hass: HomeAssistant, entry: ConfigEntry):
    """Handle options update."""
    _LOGGER.debug("Mirage UI options updated. Reloading theme.")
    await update_theme(hass, entry)

def hex_to_rgba(hex_color, alpha):
    """Convert hex to rgba."""
    if not hex_color or not isinstance(hex_color, str) or not hex_color.startswith('#'):
        return f"rgba(59, 130, 246, {alpha})" # Fallback
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = "".join([c*2 for c in hex_color])
    if len(hex_color) != 6:
        return f"rgba(59, 130, 246, {alpha})" # Fallback
    
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return f"rgba({r}, {g}, {b}, {alpha})"

async def update_theme(hass: HomeAssistant, entry: ConfigEntry):
    """Dynamically update the Mirage theme."""
    opts = entry.options

    def o(key, default):
        return opts.get(key, default)

    accent_color = o("accent_color", "#3b82f6")

    card_text_color_mode = o("card_text_color_mode", "auto")
    
    # Determine text colors based on mode
    dark_text_colors = {"primary": "#1f2937", "secondary": "#4b5563"}
    light_text_colors = {"primary": "#e5e7eb", "secondary": "#9ca3af"}
    
    dark_theme_card_text = light_text_colors if card_text_color_mode in ("auto", "light") else dark_text_colors
    light_theme_card_text = dark_text_colors if card_text_color_mode in ("auto", "dark") else light_text_colors

    dark_theme = {
        "primary-color": accent_color,
        "accent-color": "var(--mirage-accent-color)",
        "primary-background-color": o("bg_color_dark", "#0d1117"),
        "primary-text-color": "var(--mirage-primary-text-color)",
        "secondary-text-color": "var(--mirage-secondary-text-color)",
        "card-background-color": "rgba(31, 41, 55, 0.5)",
        
        "mirage-accent-color": accent_color,
        "mirage-temperature-color": o("temperature_color", None) or accent_color,
        "mirage-weather-color": o("weather_color", None) or accent_color,
        "mirage-humidity-color": o("humidity_color", None) or accent_color,
        "mirage-door-color": o("door_color", None) or accent_color,
        
        "mirage-primary-text-color": o("dark_primary_text_color", "#e5e7eb"),
        "mirage-secondary-text-color": o("dark_secondary_text_color", "#9ca3af"),
        "mirage-card-primary-text-color": dark_theme_card_text["primary"],
        "mirage-card-secondary-text-color": dark_theme_card_text["secondary"],
        
        "mirage-border-radius": f"{o('border_radius', 16)}px",
        "mirage-border-width": f"{o('border_width', 1)}px",
        "mirage-separator-width": f"{o('separator_width', 1)}px",

        "mirage-glass-blur": f"{o('glass_blur', 20)}px",
        "mirage-glass-bg-color-dark": f"rgba(86, 94, 88, {o('glass_transparency', 30) / 100 * 1.8})",
        "mirage-glass-border-color-dark": "rgba(255, 255, 255, 0.15)",
        "mirage-glass-shadow-dark": "0 8px 24px rgba(0,0,0,0.3)",

        "mirage-solid-bg-color-dark": o("solid_bg_color_dark", "#2d3748"),
        "mirage-solid-border-color-dark": "rgba(255, 255, 255, 0.1)",
        "mirage-solid-shadow-dark": "0 2px 8px rgba(0,0,0,0.3)",

        "mirage-paper-bg-color-dark": o("paper_bg_color_dark", "#2a2d35"),
        "mirage-paper-border-color-dark": "rgba(255, 255, 255, 0.1)",
        "mirage-paper-shadow-dark": "0 6px 16px rgba(0,0,0,0.5)",

        "mirage-floating-bg-color-dark": hex_to_rgba(o("floating_bg_color_dark", "#2a323d"), o("floating_opacity", 100) / 100),
        "mirage-floating-shadow-dark": "0 6px 20px rgba(0,0,0,0.3)",
    }

    light_theme = {
        "primary-color": accent_color,
        "accent-color": "var(--mirage-accent-color)",
        "primary-background-color": o("bg_color_light", "#f3f4f6"),
        "primary-text-color": "var(--mirage-primary-text-color)",
        "secondary-text-color": "var(--mirage-secondary-text-color)",
        "card-background-color": "rgba(255, 255, 255, 0.6)",

        "mirage-accent-color": accent_color,
        "mirage-temperature-color": o("temperature_color", None) or accent_color,
        "mirage-weather-color": o("weather_color", None) or accent_color,
        "mirage-humidity-color": o("humidity_color", None) or accent_color,
        "mirage-door-color": o("door_color", None) or accent_color,
        
        "mirage-primary-text-color": o("light_primary_text_color", "#1f2937"),
        "mirage-secondary-text-color": o("light_secondary_text_color", "#4b5563"),
        "mirage-card-primary-text-color": light_theme_card_text["primary"],
        "mirage-card-secondary-text-color": light_theme_card_text["secondary"],

        "mirage-border-radius": f"{o('border_radius', 16)}px",
        "mirage-border-width": f"{o('border_width', 1)}px",
        "mirage-separator-width": f"{o('separator_width', 1)}px",

        "mirage-glass-blur": f"{o('glass_blur', 20)}px",
        "mirage-glass-bg-color-light": f"rgba(240, 242, 240, {o('glass_transparency', 30) / 100 * 2})",
        "mirage-glass-border-color-light": "rgba(0, 0, 0, 0.1)",
        "mirage-glass-shadow-light": "0 8px 24px rgba(0,0,0,0.1)",

        "mirage-solid-bg-color-light": o("solid_bg_color_light", "#e2e8f0"),
        "mirage-solid-border-color-light": "rgba(0, 0, 0, 0.08)",
        "mirage-solid-shadow-light": "0 2px 8px rgba(0,0,0,0.08)",

        "mirage-paper-bg-color-light": o("paper_bg_color_light", "#ffffff"),
        "mirage-paper-border-color-light": "rgba(0, 0, 0, 0.08)",
        "mirage-paper-shadow-light": "0 4px 12px rgba(0,0,0,0.1)",

        "mirage-floating-bg-color-light": hex_to_rgba(o("floating_bg_color_light", "#ffffff"), o("floating_opacity", 100) / 100),
        "mirage-floating-shadow-light": "0 6px 20px rgba(0,0,0,0.1)",
    }

    hass.services.async_call(
        "frontend", "set_theme", {"name": "Mirage Dark", "mode": "dark", **dark_theme}, blocking=False
    )
    hass.services.async_call(
        "frontend", "set_theme", {"name": "Mirage Light", "mode": "light", **light_theme}, blocking=False
    )
