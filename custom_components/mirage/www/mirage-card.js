/**
 * Mirage Card for Home Assistant
 * ------------------------------------------------
 * This file is automatically provided by the 'Mirage UI' integration.
 * It's the frontend component for the `mirage-card` you use in your dashboards.
 *
 * How it works (Dual Mode):
 *
 * 1. Global Theming (Default):
 *    - If you DON'T provide a `theme:` block in the card's YAML config, this
 *      card will inherit all its styles from the global Mirage Theme.
 *    - The global theme is managed in Settings > Devices & Services > Mirage UI.
 *
 * 2. Per-Card Styling (Advanced):
 *    - If you DO provide a `theme:` block in the card's YAML, this card
 *      will use those settings to style itself, ignoring the global theme.
 *    - This allows you to have a globally consistent look, with specific cards
 *      customized for special purposes.
 *    - You can use the Visual Editor in Lovelace to configure this easily.
 */
class MirageCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._config = {};
    }

    setConfig(config) {
        if (!config) {
            throw new Error('Invalid configuration');
        }
        this._config = config;
        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        if (this.shadowRoot) {
            const entityStateElement = this.shadowRoot.querySelector('.entity-state');
            if (entityStateElement && this._config.entity && hass.states[this._config.entity]) {
                entityStateElement.textContent = `State: ${hass.states[this._config.entity].state}`;
            }
        }
    }

    render() {
        if (!this.shadowRoot) return;

        const entityId = this._config.entity || 'Not specified';
        const entityState = (this._hass && this._hass.states && this._hass.states[entityId])
            ? this._hass.states[entityId].state
            : 'N/A';

        // Check if there's a per-card theme config
        const hasLocalTheme = this._config.theme && Object.keys(this._config.theme).length > 0;
        
        let localStyles = '';
        if (hasLocalTheme) {
            const theme = this._config.theme;
            const styleMap = {
                '--mirage-accent-color': theme.accent_color,
                '--mirage-card-primary-text-color': theme.card_primary_text_color,
                '--mirage-card-secondary-text-color': theme.card_secondary_text_color,
                '--mirage-border-radius': theme.border_radius ? `${theme.border_radius}px` : undefined,
                '--mirage-border-width': theme.border_width ? `${theme.border_width}px` : undefined,
                '--mirage-separator-width': theme.separator_width ? `${theme.separator_width}px` : undefined,
            };
            
            // Add style-specific properties
            const cardStyle = theme.card_style || 'glass';
            
            if (cardStyle === 'glass') {
                 styleMap['--mirage-glass-blur'] = theme.glass_blur ? `${theme.glass_blur}px` : undefined;
                 styleMap['--mirage-glass-bg-color-dark'] = theme.glass_bg_color_dark;
                 styleMap['--mirage-glass-bg-color-light'] = theme.glass_bg_color_light;
            } else if (cardStyle === 'solid') {
                styleMap['--mirage-solid-bg-color-dark'] = theme.solid_bg_color_dark;
                styleMap['--mirage-solid-bg-color-light'] = theme.solid_bg_color_light;
            } else if (cardStyle === 'paper') {
                styleMap['--mirage-paper-bg-color-dark'] = theme.paper_bg_color_dark;
                styleMap['--mirage-paper-bg-color-light'] = theme.paper_bg_color_light;
            } else if (cardStyle === 'floating') {
                styleMap['--mirage-floating-bg-color-dark'] = theme.floating_bg_color_dark;
                styleMap['--mirage-floating-bg-color-light'] = theme.floating_bg_color_light;
            }

            localStyles = Object.entries(styleMap)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${key}: ${value};`)
                .join(' ');
        }
        
        const cardStyle = (this._config.theme && this._config.theme.card_style) ? this._config.theme.card_style : 'var(--mirage-card-style, glass)';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    ${localStyles}
                    
                    /* Intermediate variables for dark mode (default) */
                    --_mirage-current-glass-bg: var(--mirage-glass-bg-color-dark);
                    --_mirage-current-glass-border: var(--mirage-glass-border-color-dark);
                    --_mirage-current-glass-shadow: var(--mirage-glass-shadow-dark);

                    --_mirage-current-solid-bg: var(--mirage-solid-bg-color-dark);
                    --_mirage-current-solid-border: var(--mirage-solid-border-color-dark);
                    --_mirage-current-solid-shadow: var(--mirage-solid-shadow-dark);
                    
                    --_mirage-current-paper-bg: var(--mirage-paper-bg-color-dark);
                    --_mirage-current-paper-border: var(--mirage-paper-border-color-dark);
                    --_mirage-current-paper-shadow: var(--mirage-paper-shadow-dark);

                    --_mirage-current-floating-bg: var(--mirage-floating-bg-color-dark);
                    --_mirage-current-floating-shadow: var(--mirage-floating-shadow-dark);

                    --_mirage-current-separator-color: var(--mirage-glass-border-color-dark);
                }

                :host-context(body:not(.dark)) {
                    /* Override intermediate variables for light mode */
                    --_mirage-current-glass-bg: var(--mirage-glass-bg-color-light);
                    --_mirage-current-glass-border: var(--mirage-glass-border-color-light);
                    --_mirage-current-glass-shadow: var(--mirage-glass-shadow-light);

                    --_mirage-current-solid-bg: var(--mirage-solid-bg-color-light);
                    --_mirage-current-solid-border: var(--mirage-solid-border-color-light);
                    --_mirage-current-solid-shadow: var(--mirage-solid-shadow-light);

                    --_mirage-current-paper-bg: var(--mirage-paper-bg-color-light);
                    --_mirage-current-paper-border: var(--mirage-paper-border-color-light);
                    --_mirage-current-paper-shadow: var(--mirage-paper-shadow-light);

                    --_mirage-current-floating-bg: var(--mirage-floating-bg-color-light);
                    --_mirage-current-floating-shadow: var(--mirage-floating-shadow-light);
                    
                    --_mirage-current-separator-color: var(--mirage-glass-border-color-light);
                }

                .mirage-card-base {
                    border-radius: var(--mirage-border-radius);
                    transition: all 0.3s ease;
                    overflow: hidden;
                    border-style: solid;
                }

                /* Unified Style Definitions */
                .mirage-card-base[style-type="glass"] {
                    backdrop-filter: var(--mirage-glass-blur);
                    -webkit-backdrop-filter: var(--mirage-glass-blur);
                    border-width: var(--mirage-border-width);
                    background-color: var(--_mirage-current-glass-bg);
                    border-color: var(--_mirage-current-glass-border);
                    box-shadow: var(--_mirage-current-glass-shadow);
                }

                .mirage-card-base[style-type="solid"] {
                    border-width: var(--mirage-border-width);
                    background-color: var(--_mirage-current-solid-bg);
                    border-color: var(--_mirage-current-solid-border);
                    box-shadow: var(--_mirage-current-solid-shadow);
                }
                
                .mirage-card-base[style-type="paper"] {
                    border-width: var(--mirage-border-width);
                    background-color: var(--_mirage-current-paper-bg);
                    border-color: var(--_mirage-current-paper-border);
                    box-shadow: var(--_mirage-current-paper-shadow);
                }

                .mirage-card-base[style-type="floating"] {
                    border-width: 0;
                    background-color: var(--_mirage-current-floating-bg);
                    box-shadow: var(--_mirage-current-floating-shadow);
                }

                .card-header {
                    padding: 16px;
                    font-weight: 500;
                    border-bottom-style: solid;
                    color: var(--mirage-card-primary-text-color, var(--primary-text-color));
                    border-bottom-width: var(--mirage-separator-width);
                    border-bottom-color: var(--_mirage-current-separator-color);
                }
                
                .mirage-card-base[style-type="floating"] .card-header {
                    border-bottom-width: 0px;
                }

                .card-content {
                    padding: 16px;
                    color: var(--mirage-card-secondary-text-color, var(--secondary-text-color));
                }
                .entity-state {
                    color: var(--mirage-card-primary-text-color, var(--primary-text-color));
                    font-weight: bold;
                }
            </style>
            <div class="mirage-card-base" style-type="${cardStyle}">
                <div class="card-header">
                    ${this._config.title || 'Mirage Card'}
                </div>
                <div class="card-content">
                    <p>Entity: ${entityId}</p>
                    <p class="entity-state">State: ${entityState}</p>
                    <p style="color: var(--mirage-accent-color); margin-top: 8px;">This text uses the accent color.</p>
                </div>
            </div>
        `;
    }

    getCardSize() { return 3; }

    static async getConfigElement() {
        await import("./mirage-card-editor.js");
        return document.createElement("mirage-card-editor");
    }

    static getStubConfig() {
        return {
            title: "My Mirage Card",
            entity: "sun.sun",
            theme: {
                card_style: "glass",
                accent_color: "#3b82f6"
            }
        };
    }
}

customElements.define('mirage-card', MirageCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "mirage-card",
  name: "Mirage Card",
  preview: true,
  description: "A versatile card that is styled by the central Mirage UI integration or can be styled individually."
});