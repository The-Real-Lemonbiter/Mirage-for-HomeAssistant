#
# Copyright (c) 2025 Lemonbiter
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#

"""The Mirage UI integration."""
from __future__ import annotations

import logging
import os
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, PLATFORMS

_LOGGER = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
#   - async_setup
#   - async_setup_entry
#   - async_unload_entry
#   - generate_theme_yaml
# -----------------------------------------------------------------------------

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Mirage UI component."""
    hass.data.setdefault(DOMAIN, {})

    # Register the frontend card module
    card_path = f"custom_components/{DOMAIN}/www/mirage-card.js"
    if os.path.exists(hass.config.path(card_path)):
        hass.http.register_static_path(
            f"/{DOMAIN}/mirage-card.js",
            hass.config.path(card_path),
        )
        hass.components.frontend.add_extra_js_url(hass, f"/{DOMAIN}/mirage-card.js")
    
    # Register the visual editor module
    editor_path = f"custom_components/{DOMAIN}/www/mirage-card-editor.js"
    if os.path.exists(hass.config.path(editor_path)):
        hass.http.register_static_path(
            f"/{DOMAIN}/mirage-card-editor.js",
            hass.config.path(editor_path),
        )
        hass.components.frontend.add_extra_js_url(hass, f"/{DOMAIN}/mirage-card-editor.js")

    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Mirage UI from a config entry."""
    hass.data[DOMAIN][entry.entry_id] = entry.data
    
    # Add a listener for option updates
    entry.add_update_listener(update_listener)
    
    # Initial theme generation
    await _update_theme(hass, entry)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok

async def update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    await _update_theme(hass, entry)


async def _update_theme(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Generate and write the theme file based on config options."""
    options = entry.options
    yaml_content = generate_theme_yaml(options)
    
    themes_dir = hass.config.path("themes")
    if not os.path.exists(themes_dir):
        try:
            os.makedirs(themes_dir)
        except OSError as e:
            _LOGGER.error(f"Failed to create themes directory: {e}")
            return
        
    theme_file_path = os.path.join(themes_dir, "mirage.yaml")
    
    try:
        with open(theme_file_path, "w", encoding="utf-8") as f:
            f.write(yaml_content)
        
        await hass.services.async_call("frontend", "reload_themes", {})
        _LOGGER.info("Mirage UI theme updated successfully.")

    except Exception as e:
        _LOGGER.error(f"Error writing Mirage UI theme file: {e}")


def generate_theme_yaml(options: dict[str, Any]) -> str:
    """Generates the full mirage.yaml content from the config options."""
    
    def hex_to_rgba(hex_color: str, alpha: float) -> str:
        """Converts a hex color string to an RGBA string."""
        if not isinstance(hex_color, str) or not hex_color.startswith('#'):
            return f"rgba(59, 130, 246, {alpha})" # Fallback color
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = "".join(c * 2 for c in hex_color)
        if len(hex_color) != 6:
            return f"rgba(59, 130, 246, {alpha})" # Fallback for invalid length
        try:
            rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
            return f"rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, {alpha})"
        except ValueError:
            return f"rgba(59, 130, 246, {alpha})" # Fallback on parsing error

    # --- Extract values with defaults from const.py ---
    from .const import DEFAULTS
    
    def get_opt(key: str):
        return options.get(key, DEFAULTS.get(key))

    accent_color = get_opt("accent_color")
    temperature_color = options.get("temperature_color") or accent_color
    weather_color = options.get("weather_color") or accent_color
    humidity_color = options.get("humidity_color") or accent_color
    door_color = options.get("door_color") or accent_color
    
    dark_primary_text = get_opt("dark_primary_text_color")
    dark_secondary_text = get_opt("dark_secondary_text_color")
    light_primary_text = get_opt("light_primary_text_color")
    light_secondary_text = get_opt("light_secondary_text_color")

    border_radius = f'{get_opt("border_radius")}px'
    border_width = f'{get_opt("border_width")}px'
    separator_width = f'{get_opt("separator_width")}px'
    
    glass_blur = f'{get_opt("glass_blur")}px'
    glass_transparency = get_opt("glass_transparency") / 100.0
    glass_bg_dark = f"rgba(86, 94, 88, {glass_transparency * 1.8:.3f})"
    glass_bg_light = f"rgba(240, 242, 240, {glass_transparency * 2.0:.3f})"

    solid_bg_dark = get_opt("solid_bg_color_dark")
    solid_bg_light = get_opt("solid_bg_color_light")
    
    paper_bg_dark = get_opt("paper_bg_color_dark")
    paper_bg_light = get_opt("paper_bg_color_light")
    
    floating_bg_dark_hex = get_opt("floating_bg_color_dark")
    floating_bg_light_hex = get_opt("floating_bg_color_light")
    floating_opacity = get_opt("floating_opacity") / 100.0
    floating_bg_dark = hex_to_rgba(floating_bg_dark_hex, floating_opacity)
    floating_bg_light = hex_to_rgba(floating_bg_light_hex, floating_opacity)
    
    card_text_color_mode = get_opt("card_text_color_mode")
    
    card_primary_text_dark = light_primary_text if card_text_color_mode == "dark" else (dark_primary_text if card_text_color_mode == "light" else dark_primary_text)
    card_secondary_text_dark = light_secondary_text if card_text_color_mode == "dark" else (dark_secondary_text if card_text_color_mode == "light" else dark_secondary_text)
    
    card_primary_text_light = dark_primary_text if card_text_color_mode == "light" else (light_primary_text if card_text_color_mode == "dark" else light_primary_text)
    card_secondary_text_light = dark_secondary_text if card_text_color_mode == "light" else (light_secondary_text if card_text_color_mode == "dark" else light_secondary_text)

    # Note: Background colors for the page itself are handled by lovelace-card-mod, not here.
    # This generator focuses only on the mirage.yaml theme file.

    return f"""#
# Mirage Theme for Home Assistant (Generated by Mirage UI Integration)
# --------------------------------------------------------------------
# DO NOT EDIT THIS FILE MANUALLY.
# Your changes will be overwritten. Use the configuration UI at:
#   Settings > Devices & Services > Mirage UI > [Configure]
# --------------------------------------------------------------------

Mirage Dark:
  # Standard HA variables
  primary-color: "{accent_color}"
  accent-color: "var(--mirage-accent-color)"
  dark-primary-color: "{accent_color}"
  light-primary-color: "{dark_primary_text}"
  primary-text-color: "var(--mirage-primary-text-color)"
  secondary-text-color: "var(--mirage-secondary-text-color)"
  text-primary-color: "#ffffff"
  disabled-text-color: "#6b7280"
  primary-background-color: "{get_opt('bg_color_dark')}"
  secondary-background-color: "#161b22"
  card-background-color: "rgba(31, 41, 55, 0.5)"
  sidebar-background-color: "#161b22"
  sidebar-text-color: "var(--primary-text-color)"
  sidebar-selected-text-color: "var(--text-primary-color)"
  sidebar-selected-icon-color: "var(--primary-color)"
  state-icon-color: "#9ca3af"
  state-icon-active-color: "var(--primary-color)"
  divider-color: "rgba(255, 255, 255, 0.1)"

  # Custom Mirage CSS Variables
  mirage-accent-color: "{accent_color}"
  mirage-temperature-color: "{temperature_color}"
  mirage-weather-color: "{weather_color}"
  mirage-humidity-color: "{humidity_color}"
  mirage-door-color: "{door_color}"
  mirage-primary-text-color: "{dark_primary_text}"
  mirage-secondary-text-color: "{dark_secondary_text}"
  mirage-card-primary-text-color: "{card_primary_text_dark}"
  mirage-card-secondary-text-color: "{card_secondary_text_dark}"
  mirage-border-radius: "{border_radius}"
  mirage-border-width: "{border_width}"
  mirage-separator-width: "{separator_width}"
  mirage-glass-blur: "{glass_blur}"
  mirage-glass-bg-color-dark: "{glass_bg_dark}"
  mirage-glass-border-color-dark: "rgba(255, 255, 255, 0.15)"
  mirage-glass-shadow-dark: "0 8px 24px rgba(0,0,0,0.3)"
  mirage-solid-bg-color-dark: "{solid_bg_dark}"
  mirage-solid-border-color-dark: "rgba(255, 255, 255, 0.1)"
  mirage-solid-shadow-dark: "0 2px 8px rgba(0,0,0,0.3)"
  mirage-paper-bg-color-dark: "{paper_bg_dark}"
  mirage-paper-border-color-dark: "rgba(255, 255, 255, 0.1)"
  mirage-paper-shadow-dark: "0 6px 16px rgba(0,0,0,0.5)"
  mirage-floating-bg-color-dark: "{floating_bg_dark}"
  mirage-floating-shadow-dark: "0 6px 20px rgba(0,0,0,0.3)"

Mirage Light:
  # Standard HA variables
  primary-color: "{accent_color}"
  accent-color: "var(--mirage-accent-color)"
  dark-primary-color: "{light_primary_text}"
  light-primary-color: "{accent_color}"
  primary-text-color: "var(--mirage-primary-text-color)"
  secondary-text-color: "var(--mirage-secondary-text-color)"
  text-primary-color: "#000000"
  disabled-text-color: "#9ca3af"
  primary-background-color: "{get_opt('bg_color_light')}"
  secondary-background-color: "#ffffff"
  card-background-color: "rgba(255, 255, 255, 0.6)"
  sidebar-background-color: "#ffffff"
  sidebar-text-color: "var(--secondary-text-color)"
  sidebar-selected-text-color: "var(--primary-text-color)"
  sidebar-selected-icon-color: "var(--primary-color)"
  state-icon-color: "#6b7280"
  state-icon-active-color: "var(--primary-color)"
  divider-color: "rgba(0, 0, 0, 0.1)"
  
  # Custom Mirage CSS Variables
  mirage-accent-color: "{accent_color}"
  mirage-temperature-color: "{temperature_color}"
  mirage-weather-color: "{weather_color}"
  mirage-humidity-color: "{humidity_color}"
  mirage-door-color: "{door_color}"
  mirage-primary-text-color: "{light_primary_text}"
  mirage-secondary-text-color: "{light_secondary_text}"
  mirage-card-primary-text-color: "{card_primary_text_light}"
  mirage-card-secondary-text-color: "{card_secondary_text_light}"
  mirage-border-radius: "{border_radius}"
  mirage-border-width: "{border_width}"
  mirage-separator-width: "{separator_width}"
  mirage-glass-blur: "{glass_blur}"
  mirage-glass-bg-color-light: "{glass_bg_light}"
  mirage-glass-border-color-light: "rgba(0, 0, 0, 0.1)"
  mirage-glass-shadow-light: "0 8px 24px rgba(0,0,0,0.1)"
  mirage-solid-bg-color-light: "{solid_bg_light}"
  mirage-solid-border-color-light: "rgba(0, 0, 0, 0.08)"
  mirage-solid-shadow-light: "0 2px 8px rgba(0,0,0,0.08)"
  mirage-paper-bg-color-light: "{paper_bg_light}"
  mirage-paper-border-color-light: "rgba(0, 0, 0, 0.08)"
  mirage-paper-shadow-light: "0 4px 12px rgba(0,0,0,0.1)"
  mirage-floating-bg-color-light: "{floating_bg_light}"
  mirage-floating-shadow-light: "0 6px 20px rgba(0,0,0,0.1)"
"""
