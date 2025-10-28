#
# Copyright (c) 2025 Lemonbiter
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#

"""Constants for the Mirage UI integration."""

DOMAIN = "mirage"
PLATFORMS = []

# Default values for the theme options, mirroring the frontend preview defaults.
# This ensures consistency when the theme is first generated.
DEFAULTS = {
    "accent_color": "#3b82f6",
    "temperature_color": None,
    "weather_color": None,
    "humidity_color": None,
    "door_color": None,
    
    "dark_primary_text_color": "#e5e7eb",
    "dark_secondary_text_color": "#9ca3af",
    "light_primary_text_color": "#1f2937",
    "light_secondary_text_color": "#4b5563",
    
    "border_radius": 16,
    "border_width": 1,
    "separator_width": 1,
    
    "glass_blur": 20,
    "glass_transparency": 30,
    
    "solid_bg_color_dark": "#2d3748",
    "solid_bg_color_light": "#e2e8f0",
    
    "paper_bg_color_dark": "#2a2d35",
    "paper_bg_color_light": "#ffffff",
    
    "floating_bg_color_dark": "#2a323d",
    "floating_bg_color_light": "#ffffff",
    "floating_opacity": 100,
    
    "card_text_color_mode": "auto",
    
    "bg_color_dark": "#0d1117",
    "bg_color_light": "#f3f4f6",
}
