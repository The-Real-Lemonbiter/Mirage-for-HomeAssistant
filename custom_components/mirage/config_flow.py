#
# Copyright (c) 2025 Lemonbiter
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#

"""Config flow for Mirage UI integration."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, OptionsFlow, ConfigEntry
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.selector import (
    ColorSelector,
    ColorSelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    SelectSelector,
    SelectSelectorConfig,
)

from .const import DOMAIN, DEFAULTS

def get_opt(handler: OptionsFlow, key: str) -> Any:
    """Get value from options flow or default."""
    return handler.options.get(key, DEFAULTS.get(key))


class MirageConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Mirage UI."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Handle the initial setup step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Mirage UI", data={}, options={})

        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Get the options flow for this handler."""
        return MirageOptionsFlowHandler(config_entry)


class MirageOptionsFlowHandler(OptionsFlow):
    """Handle an options flow for Mirage UI."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry
        self.options = dict(config_entry.options)

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Manage the theme options."""
        if user_input is not None:
            # Filter out empty strings for optional color fields
            cleaned_input = {
                k: v for k, v in user_input.items() 
                if not (k.endswith("_color") and k != "accent_color" and v == "")
            }
            self.options.update(cleaned_input)
            return self.async_create_entry(title="", data=self.options)

        # Define the schema for the configuration UI, organized by sections.
        schema = vol.Schema({
            # --- General Colors ---
            vol.Required("accent_color", default=get_opt(self, "accent_color")): ColorSelector(ColorSelectorConfig(mode="hex")),
            
            # --- Appearance ---
            vol.Required("border_radius", default=get_opt(self, "border_radius")): NumberSelector(
                NumberSelectorConfig(min=0, max=40, step=1, mode="slider", unit_of_measurement="px")
            ),
            vol.Required("border_width", default=get_opt(self, "border_width")): NumberSelector(
                NumberSelectorConfig(min=0, max=5, step=0.5, mode="slider", unit_of_measurement="px")
            ),
            vol.Required("separator_width", default=get_opt(self, "separator_width")): NumberSelector(
                NumberSelectorConfig(min=0, max=5, step=0.5, mode="slider", unit_of_measurement="px")
            ),
            
            # --- Card Text Color ---
            vol.Required("card_text_color_mode", default=get_opt(self, "card_text_color_mode")): SelectSelector(
                SelectSelectorConfig(
                    options=["auto", "light", "dark"],
                    mode="dropdown",
                    translation_key="card_text_color_mode"
                )
            ),
            
            # --- Glass Style ---
            vol.Required("glass_blur", default=get_opt(self, "glass_blur")): NumberSelector(
                NumberSelectorConfig(min=0, max=50, step=1, mode="slider", unit_of_measurement="px")
            ),
            vol.Required("glass_transparency", default=get_opt(self, "glass_transparency")): NumberSelector(
                NumberSelectorConfig(min=0, max=100, step=1, mode="slider", unit_of_measurement="%")
            ),
            
            # --- Solid Style ---
            vol.Required("solid_bg_color_dark", default=get_opt(self, "solid_bg_color_dark")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("solid_bg_color_light", default=get_opt(self, "solid_bg_color_light")): ColorSelector(ColorSelectorConfig(mode="hex")),

            # --- Paper Style ---
            vol.Required("paper_bg_color_dark", default=get_opt(self, "paper_bg_color_dark")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("paper_bg_color_light", default=get_opt(self, "paper_bg_color_light")): ColorSelector(ColorSelectorConfig(mode="hex")),
            
            # --- Floating Style ---
            vol.Required("floating_bg_color_dark", default=get_opt(self, "floating_bg_color_dark")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("floating_bg_color_light", default=get_opt(self, "floating_bg_color_light")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("floating_opacity", default=get_opt(self, "floating_opacity")): NumberSelector(
                NumberSelectorConfig(min=0, max=100, step=1, mode="slider", unit_of_measurement="%")
            ),

            # --- Page Background ---
            vol.Required("bg_color_dark", default=get_opt(self, "bg_color_dark")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("bg_color_light", default=get_opt(self, "bg_color_light")): ColorSelector(ColorSelectorConfig(mode="hex")),
            
            # --- Entity-Specific Colors ---
            vol.Optional("temperature_color", description={"suggested_value": get_opt(self, "temperature_color") or ""}): str,
            vol.Optional("weather_color", description={"suggested_value": get_opt(self, "weather_color") or ""}): str,
            vol.Optional("humidity_color", description={"suggested_value": get_opt(self, "humidity_color") or ""}): str,
            vol.Optional("door_color", description={"suggested_value": get_opt(self, "door_color") or ""}): str,
            
            # --- Global Text Colors ---
            vol.Required("dark_primary_text_color", default=get_opt(self, "dark_primary_text_color")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("dark_secondary_text_color", default=get_opt(self, "dark_secondary_text_color")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("light_primary_text_color", default=get_opt(self, "light_primary_text_color")): ColorSelector(ColorSelectorConfig(mode="hex")),
            vol.Required("light_secondary_text_color", default=get_opt(self, "light_secondary_text_color")): ColorSelector(ColorSelectorConfig(mode="hex")),
        })
        
        return self.async_show_form(
            step_id="init",
            data_schema=schema,
            # This allows using translations from strings.json for a cleaner UI
            # e.g., "config.options.step.init.data.accent_color": "Accent Color"
            # and a description:
            # "config.options.step.init.data_description.temperature_color": "Leave blank to use the main accent color."
            # These would need to be added to a `strings.json` file.
        )
