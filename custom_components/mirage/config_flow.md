
"""Config flow for Mirage UI."""
import voluptuous as vol
from typing import Any, Dict, Optional
import logging

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

class MirageConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Mirage UI."""
    VERSION = 1

    async def async_step_user(self, user_input: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Handle the initial setup step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            # Create the entry with empty data. All settings are managed in the options flow.
            return self.async_create_entry(title="Mirage UI", data={}, options={})

        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: config_entries.ConfigEntry) -> "MirageOptionsFlow":
        """Get the options flow for this handler."""
        return MirageOptionsFlow(config_entry)


class MirageOptionsFlow(config_entries.OptionsFlow):
    """
    Handle an options flow for Mirage UI.
    This options flow is a placeholder that signals Home Assistant to load the
    custom frontend panel for configuration. The actual UI is defined in the
    React application located in the /www directory.
    """

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Show a placeholder form, which HA replaces with the custom UI."""
        # By returning an empty schema, we tell Home Assistant's frontend to take over
        # and load our custom UI, which is served via the static path registered
        # in __init__.py. This is the modern and correct way to handle a UI-based
        # options flow.
        return self.async_show_form(step_id="init", data_schema=None)
