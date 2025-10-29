
"""Config flow for Mirage UI."""
import voluptuous as vol
from typing import Any, Dict, Optional
import logging

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.schema_attribute_validator import cv_string
import homeassistant.helpers.config_validation as cv

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Default values are derived from the frontend's SettingsProvider.tsx to ensure consistency.
DEFAULTS = {
    "accent_color": "#3b82f6",
    "border_radius": 16,
    "border_width": 1.0,
    "separator_width": 1.0,
    "card_text_color_mode": "auto",
    "glass_blur": 20,
    "glass_transparency": 30,
    "solid_bg_color_dark": "#2d3748",
    "solid_bg_color_light": "#e2e8f0",
    "paper_bg_color_dark": "#2a2d35",
    "paper_bg_color_light": "#ffffff",
    "floating_bg_color_dark": "#2a323d",
    "floating_bg_color_light": "#ffffff",
    "floating_opacity": 100,
    "bg_color_dark": "#0d1117",
    "bg_color_light": "#f3f4f6",
    "temperature_color": "",
    "weather_color": "",
    "humidity_color": "",
    "door_color": "",
    "dark_primary_text_color": "#e5e7eb",
    "dark_secondary_text_color": "#9ca3af",
    "light_primary_text_color": "#1f2937",
    "light_secondary_text_color": "#4b5563",
}

def get_options_schema(options: Optional[Dict[str, Any]] = None) -> vol.Schema:
    """Return the schema for the options flow."""
    options = options or {}
    
    def default(key):
        return options.get(key, DEFAULTS[key])

    return vol.Schema({
        vol.Optional("accent_color", default=default("accent_color")): cv_string,
        vol.Optional("border_radius", default=default("border_radius")): vol.All(vol.Coerce(int), vol.Range(min=0, max=32)),
        vol.Optional("border_width", default=default("border_width")): vol.All(vol.Coerce(float), vol.Range(min=0, max=5)),
        vol.Optional("separator_width", default=default("separator_width")): vol.All(vol.Coerce(float), vol.Range(min=0, max=5)),
        vol.Optional("card_text_color_mode", default=default("card_text_color_mode")): vol.In(["auto", "light", "dark"]),
        
        # Glass style
        vol.Optional("glass_blur", default=default("glass_blur")): vol.All(vol.Coerce(int), vol.Range(min=0, max=40)),
        vol.Optional("glass_transparency", default=default("glass_transparency")): vol.All(vol.Coerce(int), vol.Range(min=0, max=100)),
        
        # Solid style
        vol.Optional("solid_bg_color_dark", default=default("solid_bg_color_dark")): cv_string,
        vol.Optional("solid_bg_color_light", default=default("solid_bg_color_light")): cv_string,

        # Paper style
        vol.Optional("paper_bg_color_dark", default=default("paper_bg_color_dark")): cv_string,
        vol.Optional("paper_bg_color_light", default=default("paper_bg_color_light")): cv_string,

        # Floating style
        vol.Optional("floating_bg_color_dark", default=default("floating_bg_color_dark")): cv_string,
        vol.Optional("floating_bg_color_light", default=default("floating_bg_color_light")): cv_string,
        vol.Optional("floating_opacity", default=default("floating_opacity")): vol.All(vol.Coerce(int), vol.Range(min=0, max=100)),

        # Page background
        vol.Optional("bg_color_dark", default=default("bg_color_dark")): cv_string,
        vol.Optional("bg_color_light", default=default("bg_color_light")): cv_string,

        # Optional entity colors
        vol.Optional("temperature_color", default=default("temperature_color")): cv_string,
        vol.Optional("weather_color", default=default("weather_color")): cv_string,
        vol.Optional("humidity_color", default=default("humidity_color")): cv_string,
        vol.Optional("door_color", default=default("door_color")): cv_string,

        # Text colors
        vol.Optional("dark_primary_text_color", default=default("dark_primary_text_color")): cv_string,
        vol.Optional("dark_secondary_text_color", default=default("dark_secondary_text_color")): cv_string,
        vol.Optional("light_primary_text_color", default=default("light_primary_text_color")): cv_string,
        vol.Optional("light_secondary_text_color", default=default("light_secondary_text_color")): cv_string,
    })


class MirageConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Mirage UI."""

    VERSION = 1

    async def async_step_user(self, user_input: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Mirage UI", data={})

        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: config_entries.ConfigEntry) -> "MirageOptionsFlow":
        """Get the options flow for this handler."""
        return MirageOptionsFlow(config_entry)


class MirageOptionsFlow(config_entries.OptionsFlow):
    """Handle an options flow for Mirage UI."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Manage the options."""
        if user_input is not None:
            _LOGGER.debug("Mirage UI options updated: %s", user_input)
            return self.async_create_entry(title="", data=user_input)

        schema = get_options_schema(self.config_entry.options)

        return self.async_show_form(
            step_id="init",
            data_schema=schema,
        )
