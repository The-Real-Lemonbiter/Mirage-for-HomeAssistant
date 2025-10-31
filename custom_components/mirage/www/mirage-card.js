
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
        if (!config || !config.entity) {
            throw new Error('You must specify an entity in your card configuration.');
        }
        this._config = config;
        this.render();
    }

    set hass(hass) {
        this._hass = hass;
        if (this.shadowRoot) {
            this.render();
        }
    }
    
    _callService(domain, service, data) {
        if (!this._hass) return;
        this._hass.callService(domain, service, data);
    }
    
    _hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    render() {
        if (!this.shadowRoot) return;

        const entityId = this._config.entity;
        const stateObj = this._hass ? this._hass.states[entityId] : undefined;
        let contentHtml = '';
        
        // NOTE: Full translations are managed in `components/SettingsProvider.tsx`.
        // This card component runs isolated in Lovelace and cannot access the React context directly.
        // For now, we use a simple English fallback. A future update might involve passing
        // translations from the backend to make the card fully multilingual.
        const t = (key) => ({
            brightness: 'Brightness',
            temperature: 'Temperature',
            color: 'Color',
            effect: 'Effect'
        }[key] || key);

        if (!stateObj) {
            contentHtml = `<p class="warning">Entity not available: ${entityId}</p>`;
        } else {
            const domain = entityId.split('.')[0];
            const friendlyName = stateObj.attributes.friendly_name || entityId;

            switch (domain) {
                case 'light': {
                    const isLightOn = stateObj.state === 'on';
                    const attributes = stateObj.attributes;
                    const colorModes = attributes.supported_color_modes || [];

                    const supportsBrightness = colorModes.some(mode => ['brightness', 'color_temp', 'hs', 'rgb', 'rgbw', 'rgbww', 'xy', 'white'].includes(mode));
                    const supportsColorTemp = colorModes.includes('color_temp');
                    const supportsColor = colorModes.some(mode => ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].includes(mode));
                    const supportsEffects = attributes.effect_list && attributes.effect_list.length > 0;

                    let advancedControlsHtml = '';
                    if (isLightOn) {
                        if (supportsBrightness) {
                            advancedControlsHtml += `
                                <div class="control-row">
                                    <span class="control-label">${t('brightness')}</span>
                                    <input type="range" class="control-slider" min="1" max="100" .value="${attributes.brightness ? Math.round(attributes.brightness / 2.55) : 0}" id="brightness-slider">
                                </div>
                            `;
                        }
                        if (supportsColorTemp && attributes.min_mireds && attributes.max_mireds) {
                             advancedControlsHtml += `
                                <div class="control-row">
                                    <span class="control-label">${t('temperature')}</span>
                                    <input type="range" class="control-slider" min="${attributes.min_mireds}" max="${attributes.max_mireds}" .value="${attributes.color_temp || 0}" id="colortemp-slider">
                                </div>
                            `;
                        }
                        if (supportsColor) {
                            advancedControlsHtml += `
                                <div class="control-row">
                                    <span class="control-label">${t('color')}</span>
                                    <input type="color" class="control-color" value="${attributes.rgb_color ? `#${attributes.rgb_color.map(c => c.toString(16).padStart(2, '0')).join('')}` : '#ffffff'}" id="color-picker">
                                </div>
                            `;
                        }
                        if (supportsEffects) {
                            advancedControlsHtml += `
                                <div class="control-row">
                                    <span class="control-label">${t('effect')}</span>
                                    <select class="control-select" id="effect-select">
                                        ${attributes.effect_list.map(effect => `
                                            <option value="${effect}" ${attributes.effect === effect ? 'selected' : ''}>${effect}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            `;
                        }
                    }

                    contentHtml = `
                        <div class="entity-row" @click="${() => this._callService('light', 'toggle', { entity_id: entityId })}">
                            <div class="icon-name-container">
                                <svg class="entity-icon ${isLightOn ? 'is-on' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                                <span class="entity-name">${friendlyName}</span>
                            </div>
                            <div class="toggle-switch ${isLightOn ? 'is-on' : ''}">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                        ${advancedControlsHtml ? `<div class="advanced-controls ${isLightOn ? 'visible' : ''}">${advancedControlsHtml}</div>` : ''}
                    `;
                    break;
                }
                
                default:
                    contentHtml = `
                        <p>Entity: ${entityId}</p>
                        <p class="entity-state">State: ${stateObj.state}</p>
                        <p style="color: var(--mirage-accent-color); margin-top: 8px;">This is a fallback for an unsupported entity.</p>
                    `;
                    break;
            }
        }
        
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
                    overflow-wrap: break-word;
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
                .warning {
                    color: #fbbf24; /* amber-400 */
                }
                .entity-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    padding: 4px 0;
                    gap: 16px;
                }
                .icon-name-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                    min-width: 0;
                }
                .entity-icon {
                    width: 24px;
                    height: 24px;
                    color: var(--mirage-card-primary-text-color, var(--primary-text-color));
                    opacity: 0.4;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }
                .entity-icon.is-on {
                    color: var(--mirage-accent-color);
                    opacity: 1;
                }
                .entity-name {
                    color: var(--mirage-card-primary-text-color, var(--primary-text-color));
                    overflow-wrap: break-word;
                }
                .toggle-switch {
                    position: relative;
                    width: 48px;
                    height: 28px;
                    border-radius: 14px;
                    transition: background-color 0.3s ease-in-out;
                    background-color: rgba(127, 127, 127, 0.2);
                    flex-shrink: 0;
                }
                :host-context(body:not(.dark)) .toggle-switch {
                     background-color: rgba(0, 0, 0, 0.05);
                }
                .toggle-switch.is-on {
                    background-color: var(--mirage-accent-color);
                }
                .toggle-thumb {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    background-color: #fff;
                    transition: transform 0.3s ease-in-out;
                }
                .toggle-switch.is-on .toggle-thumb {
                    transform: translateX(20px);
                }
                .advanced-controls {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.5s ease-in-out, margin-top 0.5s ease-in-out, opacity 0.5s ease-in-out;
                    opacity: 0;
                    margin-top: 0;
                }
                .advanced-controls.visible {
                    max-height: 300px; /* Adjust as needed */
                    opacity: 1;
                    margin-top: 16px;
                }
                .control-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }
                .control-label {
                    color: var(--mirage-card-secondary-text-color, var(--secondary-text-color));
                    font-size: 14px;
                    overflow-wrap: break-word;
                    padding-right: 8px;
                }
                .control-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 60%;
                    height: 6px;
                    background: rgba(127, 127, 127, 0.2);
                    border-radius: 3px;
                    outline: none;
                }
                .control-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: var(--mirage-accent-color);
                    cursor: pointer;
                    border-radius: 50%;
                }
                .control-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: var(--mirage-accent-color);
                    cursor: pointer;
                    border-radius: 50%;
                }
                .control-color {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    width: 40px;
                    height: 28px;
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                }
                .control-color::-webkit-color-swatch-wrapper { padding: 0; }
                .control-color::-webkit-color-swatch { 
                    border-radius: 6px;
                    border: 1px solid var(--_mirage-current-separator-color);
                }
                .control-select {
                    background-color: rgba(127, 127, 127, 0.1);
                    color: var(--mirage-card-primary-text-color);
                    border: 1px solid var(--_mirage-current-separator-color);
                    border-radius: 6px;
                    padding: 4px 8px;
                    font-size: 14px;
                }
            </style>
            <div class="mirage-card-base" style-type="${cardStyle}">
                <div class="card-header">
                    ${this._config.title || 'Mirage Card'}
                </div>
                <div class="card-content">
                   ${contentHtml}
                </div>
            </div>
        `;
        
        // Add event listeners after render
        const brightnessSlider = this.shadowRoot.querySelector('#brightness-slider');
        if (brightnessSlider) {
            brightnessSlider.addEventListener('change', (e) => this._callService('light', 'turn_on', { entity_id: entityId, brightness_pct: e.target.value }));
        }

        const colortempSlider = this.shadowRoot.querySelector('#colortemp-slider');
        if (colortempSlider) {
            colortempSlider.addEventListener('change', (e) => this._callService('light', 'turn_on', { entity_id: entityId, color_temp: e.target.value }));
        }
        
        const colorPicker = this.shadowRoot.querySelector('#color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                const rgb = this._hexToRgb(e.target.value);
                if (rgb) {
                    this._callService('light', 'turn_on', { entity_id: entityId, rgb_color: rgb });
                }
            });
        }
        
        const effectSelect = this.shadowRoot.querySelector('#effect-select');
        if (effectSelect) {
            effectSelect.addEventListener('change', (e) => this._callService('light', 'turn_on', { entity_id: entityId, effect: e.target.value }));
        }
    }

    getCardSize() { return 3; }

    static async getConfigElement() {
        await import("./mirage-card-editor.js");
        return document.createElement("mirage-card-editor");
    }

    static getStubConfig() {
        return {
            title: "My Light",
            entity: "light.bed_light",
            theme: {}
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