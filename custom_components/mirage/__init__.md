

"""The Mirage UI integration."""
from __future__ import annotations
import logging
import os
import shutil
import base64
from typing import Any, Dict

from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.config_entries import ConfigEntry
import voluptuous as vol
from homeassistant.components.lovelace import async_register_resource

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
    night_config = options.get("night", {})
    day_config = options.get("day", {})

    # Dark Theme Variables
    glass_alpha_dark = (night_config.get("transparency", 30) / 100) * 1.8
    floating_alpha_dark = night_config.get("floatingOpacity", 100) / 100
    dark_vars = {
        "mirage-accent-color": night_config.get("accentColor", "#3b82f6"),
        "mirage-temperature-color": night_config.get("temperatureColor") or "var(--mirage-accent-color)",
        "mirage-weather-color": night_config.get("weatherColor") or "var(--mirage-accent-color)",
        "mirage-humidity-color": night_config.get("humidityColor") or "var(--mirage-accent-color)",
        "mirage-door-color": night_config.get("doorColor") or "var(--mirage-accent-color)",
        "mirage-primary-text-color": night_config.get("pageTextColor", {}).get("primary", "#e5e7eb"),
        "mirage-secondary-text-color": night_config.get("pageTextColor", {}).get("secondary", "#9ca3af"),
        "mirage-border-radius": f"{night_config.get('borderRadius', 16)}px",
        "mirage-border-width": f"{night_config.get('borderThickness', 1.0)}px",
        "mirage-separator-width": f"{night_config.get('separatorThickness', 1.0)}px",
        "mirage-glass-blur": f"{night_config.get('blurIntensity', 20)}px",
        "mirage-glass-bg-color-dark": f"rgba(86, 94, 88, {glass_alpha_dark:.2f})",
        "mirage-solid-bg-color-dark": night_config.get("solidColor", "#2d3748"),
        "mirage-paper-bg-color-dark": night_config.get("paperColor", "#2a2d35"),
        "mirage-floating-bg-color-dark": _hex_to_rgba(night_config.get("floatingColor", "#2a323d"), floating_alpha_dark),
        "primary-background-color": night_config.get("bgColor", "#0d1117"),
    }

    # Light Theme Variables
    glass_alpha_light = (day_config.get("transparency", 30) / 100) * 2.0
    floating_alpha_light = day_config.get("floatingOpacity", 100) / 100
    light_vars = {
        "mirage-accent-color": day_config.get("accentColor", "#3b82f6"),
        "mirage-temperature-color": day_config.get("temperatureColor") or "var(--mirage-accent-color)",
        "mirage-weather-color": day_config.get("weatherColor") or "var(--mirage-accent-color)",
        "mirage-humidity-color": day_config.get("humidityColor") or "var(--mirage-accent-color)",
        "mirage-door-color": day_config.get("doorColor") or "var(--mirage-accent-color)",
        "mirage-primary-text-color": day_config.get("pageTextColor", {}).get("primary", "#1f2937"),
        "mirage-secondary-text-color": day_config.get("pageTextColor", {}).get("secondary", "#4b5563"),
        "mirage-border-radius": f"{day_config.get('borderRadius', 16)}px",
        "mirage-border-width": f"{day_config.get('borderThickness', 1.0)}px",
        "mirage-separator-width": f"{day_config.get('separatorThickness', 1.0)}px",
        "mirage-glass-blur": f"{day_config.get('blurIntensity', 20)}px",
        "mirage-glass-bg-color-light": f"rgba(240, 242, 240, {glass_alpha_light:.2f})",
        "mirage-solid-bg-color-light": day_config.get("solidColor", "#e2e8f0"),
        "mirage-paper-bg-color-light": day_config.get("paperColor", "#ffffff"),
        "mirage-floating-bg-color-light": _hex_to_rgba(day_config.get("floatingColor", "#ffffff"), floating_alpha_light),
        "primary-background-color": day_config.get("bgColor", "#f3f4f6"),
    }
    
    return {"Mirage Dark": dark_vars, "Mirage Light": light_vars}


async def _apply_theme(hass: HomeAssistant, options: Dict[str, Any]) -> None:
    """Generate and apply the theme."""
    try:
        themes = _generate_theme_config(options)
        # Apply the theme using the frontend service
        await hass.services.async_call("frontend", "set_theme", {"name": "Mirage Dark", "mode": "dark", **themes["Mirage Dark"]}, blocking=True)
        await hass.services.async_call("frontend", "set_theme", {"name": "Mirage Light", "mode": "light", **themes["Mirage Light"]}, blocking=True)
        # Reload themes service call to make sure the frontend picks up the changes
        await hass.services.async_call("frontend", "reload_themes", {}, blocking=True)
        _LOGGER.debug("Mirage themes reloaded successfully.")
    except Exception as e:
        _LOGGER.error("Failed to set Mirage theme: %s", e)

# --- WebSocket API Handlers ---
@callback
def async_register_websocket_handlers(hass: HomeAssistant, entry: ConfigEntry):
    """Register WebSocket handlers for the settings panel."""

    @callback
    def get_settings(hass: HomeAssistant, connection, msg):
        """Handle request for current settings."""
        connection.send_result(msg["id"], entry.options)
    
    @callback
    def get_language(hass: HomeAssistant, connection, msg):
        """Handle request for HA language."""
        connection.send_result(msg["id"], hass.config.language)

    @callback
    async def update_settings(hass: HomeAssistant, connection, msg):
        """Handle settings update from the panel."""
        new_options = msg["settings"]
        hass.config_entries.async_update_entry(entry, options=new_options)
        connection.send_result(msg["id"], {"success": True})

    @callback
    async def upload_image(hass: HomeAssistant, connection, msg):
        """Handle background image upload."""
        try:
            image_data_b64 = msg["file_data"].split(",")[1]
            image_data = base64.b64decode(image_data_b64)
            file_name = msg["file_name"]
            
            www_dir = hass.config.path("www")
            mirage_dir = os.path.join(www_dir, "mirage_backgrounds")
            
            await hass.async_add_executor_job(os.makedirs, mirage_dir, exist_ok=True)
                
            file_path = os.path.join(mirage_dir, file_name)
            
            def write_file():
                with open(file_path, "wb") as f:
                    f.write(image_data)
            
            await hass.async_add_executor_job(write_file)
                
            public_url = f"/local/mirage_backgrounds/{file_name}"
            _LOGGER.info(f"Mirage background image saved to {public_url}")
            connection.send_result(msg["id"], {"success": True, "url": public_url})
        except Exception as e:
            _LOGGER.error(f"Failed to upload image: {e}")
            connection.send_error(msg["id"], "upload_failed", str(e))

    hass.components.websocket_api.async_register_command(
        "mirage/get_settings", get_settings,
        vol.Schema({"type": "mirage/get_settings"})
    )
    hass.components.websocket_api.async_register_command(
        "mirage/get_language", get_language,
        vol.Schema({"type": "mirage/get_language"})
    )
    hass.components.websocket_api.async_register_command(
        "mirage/update_settings", update_settings,
        vol.Schema({"type": vol.All("mirage/update_settings"), "settings": dict})
    )
    hass.components.websocket_api.async_register_command(
        "mirage/upload_image", upload_image,
        vol.Schema({
            "type": vol.All("mirage/upload_image"),
            "file_name": str,
            "file_data": str,
        })
    )

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Mirage UI from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # Register the static path for the configuration panel and other www assets.
    # This makes files in `custom_components/mirage/www` available at `/mirage_static`.
    static_path_url = "/mirage_static"
    static_path_dir = hass.config.path(f"custom_components/{DOMAIN}/www")
    hass.http.async_register_static_path(static_path_url, static_path_dir, cache_headers=False)

    # Register the Mirage Card Lovelace resource using the modern helper
    resource_url = f"{static_path_url}/mirage-card.js"
    _LOGGER.debug("Ensuring Mirage Card Lovelace resource is registered: %s", resource_url)
    await async_register_resource(hass, resource_url, "module")

    # Register the custom settings panel, pointing to the URL provided by the static path.
    # Home Assistant will automatically use this for the options flow.
    hass.components.frontend.async_register_webcomponent(
        "config-panel-mirage",
        f"{static_path_url}/mirage-options.html"
    )
    
    # Register the WebSocket handlers
    async_register_websocket_handlers(hass, entry)
    
    async def async_handle_apply_preset(call: ServiceCall) -> None:
        """Handle the service call to apply a preset."""
        # This can be implemented further to handle server-side presets
        pass
    hass.services.async_register(DOMAIN, "apply_preset", async_handle_apply_preset)

    entry.async_on_unload(entry.add_update_listener(update_listener))
    await _apply_theme(hass, entry.options)
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    hass.services.async_remove(DOMAIN, "apply_preset")
    # In a real scenario, you'd also unregister the websocket handlers and webcomponent
    _LOGGER.info("Unloading Mirage UI integration.")
    return True

async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle removal of an integration instance."""
    _LOGGER.info("Removing Mirage UI integration and cleaning up resources.")

    # 1. Remove background images directory
    mirage_bg_dir = hass.config.path("www", "mirage_backgrounds")
    if await hass.async_add_executor_job(os.path.isdir, mirage_bg_dir):
        try:
            await hass.async_add_executor_job(shutil.rmtree, mirage_bg_dir)
            _LOGGER.debug(f"Removed background image directory: {mirage_bg_dir}")
        except Exception as e:
            _LOGGER.error(f"Error removing background directory: {e}")

    # 2. Reset the themes to empty to effectively delete them
    try:
        await hass.services.async_call("frontend", "set_theme", {"name": "Mirage Dark", "mode": "dark"}, blocking=True)
        await hass.services.async_call("frontend", "set_theme", {"name": "Mirage Light", "mode": "light"}, blocking=True)
        await hass.services.async_call("frontend", "reload_themes", {}, blocking=True)
        _LOGGER.debug("Cleared Mirage Dark and Mirage Light themes.")
    except Exception as e:
        _LOGGER.error(f"Error clearing themes: {e}")


async def update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    _LOGGER.debug("Mirage UI options updated, reloading theme.")
    await _apply_theme(hass, entry.options)
