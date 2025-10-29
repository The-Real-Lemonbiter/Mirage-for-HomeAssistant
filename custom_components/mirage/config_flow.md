
"""Config flow for Mirage UI."""
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

DOMAIN = "mirage"

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
    "dark_primary_text_color": "#e5e7eb",
    "dark_secondary_text_color": "#9ca3af",
    "light_primary_text_color": "#1f2937",
    "light_secondary_text_color": "#4b5563",
    "temperature_color": None,
    "weather_color": None,
    "humidity_color": None,
    "door_color": None,
}

def get_schema(options):
    """Generate the options schema."""
    def o(key, default_val=None):
        return options.get(key, DEFAULTS.get(key, default_val))

    # Using description with suggested_value to create optional text fields
    return vol.Schema({
        vol.Required("accent_color", default=o("accent_color")): str,
        vol.Optional("temperature_color", description={"suggested_value": o("temperature_color") or ""}): str,
        vol.Optional("weather_color", description={"suggested_value": o("weather_color") or ""}): str,
        vol.Optional("humidity_color", description={"suggested_value": o("humidity_color") or ""}): str,
        vol.Optional("door_color", description={"suggested_value": o("door_color") or ""}): str,
        
        vol.Required("border_radius", default=o("border_radius")): vol.All(vol.Coerce(int), vol.Range(min=0, max=32)),
        vol.Required("border_width", default=o("border_width")): vol.All(vol.Coerce(float), vol.Range(min=0, max=5)),
        vol.Required("separator_width", default=o("separator_width")): vol.All(vol.Coerce(float), vol.Range(min=0, max=5)),

        vol.Required("card_text_color_mode", default=o("card_text_color_mode")): vol.In(["auto", "light", "dark"]),
        
        vol.Required("glass_blur", default=o("glass_blur")): vol.All(vol.Coerce(int), vol.Range(min=0, max=40)),
        vol.Required("glass_transparency", default=o("glass_transparency")): vol.All(vol.Coerce(int), vol.Range(min=0, max=100)),
        
        vol.Required("solid_bg_color_dark", default=o("solid_bg_color_dark")): str,
        vol.Required("solid_bg_color_light", default=o("solid_bg_color_light")): str,

        vol.Required("paper_bg_color_dark", default=o("paper_bg_color_dark")): str,
        vol.Required("paper_bg_color_light", default=o("paper_bg_color_light")): str,
        
        vol.Required("floating_bg_color_dark", default=o("floating_bg_color_dark")): str,
        vol.Required("floating_bg_color_light", default=o("floating_bg_color_light")): str,
        vol.Required("floating_opacity", default=o("floating_opacity")): vol.All(vol.Coerce(int), vol.Range(min=0, max=100)),
        
        vol.Required("bg_color_dark", default=o("bg_color_dark")): str,
        vol.Required("bg_color_light", default=o("bg_color_light")): str,

        vol.Required("dark_primary_text_color", default=o("dark_primary_text_color")): str,
        vol.Required("dark_secondary_text_color", default=o("dark_secondary_text_color")): str,
        vol.Required("light_primary_text_color", default=o("light_primary_text_color")): str,
        vol.Required("light_secondary_text_color", default=o("light_secondary_text_color")): str,
    })

class MirageConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Mirage UI."""
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Mirage UI", data={}, options=DEFAULTS)

        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return MirageOptionsFlowHandler(config_entry)

class MirageOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle an options flow for Mirage UI."""

    def __init__(self, config_entry: config_entries.ConfigEntry):
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage the options."""
        if user_input is not None:
            # Clean up empty optional color fields so they default to accent color
            for key in ["temperature_color", "weather_color", "humidity_color", "door_color"]:
                if key in user_input and not user_input[key]:
                    user_input[key] = None
            return self.async_create_entry(title="", data=user_input)

        schema = get_schema(self.config_entry.options)
        return self.async_show_form(step_id="init", data_schema=schema)
