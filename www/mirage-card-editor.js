/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { LitElement, html, css } from "https://unpkg.com/lit-element@^3/lit-element.js?module";

class MirageCardEditor extends LitElement {
    static get properties() {
        return {
            hass: {},
            _config: {},
        };
    }

    setConfig(config) {
        this._config = config;
    }

    _getThemeValue(key, defaultValue = '') {
        if (this._config && this._config.theme && this._config.theme[key] !== undefined) {
            return this._config.theme[key];
        }
        return defaultValue;
    }

    _valueChanged(e) {
        if (!this._config) return;

        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const key = target.dataset.key;
        const isThemeProp = target.dataset.isTheme === 'true';

        const newConfig = { ...this._config };

        if (isThemeProp) {
            if (!newConfig.theme) newConfig.theme = {};
            if (target.type === 'number' || target.type === 'range') value = Number(value);
            if (value === "" || value === null) {
                delete newConfig.theme[key];
            } else {
                newConfig.theme[key] = value;
            }
        } else {
            newConfig[key] = value;
        }

        this.dispatchEvent(new CustomEvent('config-changed', {
            bubbles: true,
            composed: true,
            detail: { config: newConfig },
        }));
    }

    render() {
        if (!this.hass) {
            return html``;
        }

        const cardStyle = this._getThemeValue('card_style', 'glass');

        const styleOptions = {
            'glass': [
                { key: 'glass_blur', label: 'Blur Intensity', type: 'range', min: 0, max: 40, unit: 'px' },
                { key: 'glass_bg_color_dark', label: 'BG Color (Dark)', type: 'color' },
                { key: 'glass_bg_color_light', label: 'BG Color (Light)', type: 'color' },
            ],
            'solid': [
                { key: 'solid_bg_color_dark', label: 'BG Color (Dark)', type: 'color' },
                { key: 'solid_bg_color_light', label: 'BG Color (Light)', type: 'color' },
            ],
            'paper': [
                 { key: 'paper_bg_color_dark', label: 'BG Color (Dark)', type: 'color' },
                 { key: 'paper_bg_color_light', label: 'BG Color (Light)', type: 'color' },
            ],
            'floating': [
                { key: 'floating_bg_color_dark', label: 'BG Color (Dark)', type: 'color' },
                { key: 'floating_bg_color_light', label: 'BG Color (Light)', type: 'color' },
            ]
        };

        return html`
            <div class="card-config">
                <div class="section">
                    <input
                        class="value-input"
                        placeholder="Title"
                        .value="${this._config.title || ''}"
                        @input="${this._valueChanged}"
                        data-key="title"
                    />
                    <input
                        class="value-input"
                        placeholder="Entity"
                        .value="${this._config.entity || ''}"
                        @input="${this._valueChanged}"
                        data-key="entity"
                    />
                </div>

                <div class="section">
                    <h3 class="section-title">Theme Overrides</h3>
                    <p class="help-text">Overrides global theme for this card only. Leave fields blank to use global settings.</p>

                    <div class="row">
                        <label for="card_style">Card Style</label>
                        <select id="card_style" .value="${cardStyle}" @change="${this._valueChanged}" data-key="card_style" data-is-theme="true">
                            <option value="glass">Glass</option>
                            <option value="solid">Solid</option>
                            <option value="paper">Paper</option>
                            <option value="floating">Floating</option>
                        </select>
                    </div>

                    ${(styleOptions[cardStyle] || []).map(opt => this._renderInput(opt))}
                </div>

                <div class="section">
                    <h3 class="section-title">Appearance</h3>
                    ${this._renderInput({ key: 'border_radius', label: 'Border Radius', type: 'range', min: 0, max: 32, unit: 'px' })}
                    ${this._renderInput({ key: 'border_width', label: 'Border Width', type: 'range', min: 0, max: 5, step: 0.5, unit: 'px' })}
                    ${this._renderInput({ key: 'separator_width', label: 'Separator Width', type: 'range', min: 0, max: 5, step: 0.5, unit: 'px' })}
                </div>

                <div class="section">
                    <h3 class="section-title">Colors</h3>
                    ${this._renderInput({ key: 'accent_color', label: 'Accent Color', type: 'color' })}
                    ${this._renderInput({ key: 'card_primary_text_color', label: 'Primary Text', type: 'color' })}
                    ${this._renderInput({ key: 'card_secondary_text_color', label: 'Secondary Text', type: 'color' })}
                </div>
            </div>
        `;
    }

    _renderInput(option) {
        const value = this._getThemeValue(option.key);
        
        switch (option.type) {
            case 'color':
                return html`
                    <div class="row">
                        <label>${option.label}</label>
                        <input
                            type="color"
                            .value="${value || '#ffffff'}"
                            @input="${this._valueChanged}"
                            data-key="${option.key}"
                            data-is-theme="true"
                        />
                    </div>`;
            case 'range':
                return html`
                    <div class="row">
                        <label>${option.label}</label>
                        <div class="range-container">
                             <input
                                type="range"
                                .value="${value || option.min}"
                                min="${option.min}"
                                max="${option.max}"
                                step="${option.step || 1}"
                                @input="${this._valueChanged}"
                                data-key="${option.key}"
                                data-is-theme="true"
                            />
                            <span>${value || 'auto'}${option.unit}</span>
                        </div>
                    </div>`;
            default:
                return '';
        }
    }

    static get styles() {
        return css`
            .card-config {
                padding: 8px;
            }
            .section {
                margin-top: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--divider-color);
            }
            .section:last-child {
                border-bottom: none;
            }
            .section-title {
                margin: 0 0 8px 0;
                font-weight: 500;
                color: var(--primary-text-color);
            }
            .help-text {
                font-size: 12px;
                color: var(--secondary-text-color);
                margin-bottom: 12px;
            }
            .row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            label, .value-input {
                color: var(--primary-text-color);
            }
            .value-input, select {
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid var(--divider-color);
                background-color: var(--secondary-background-color);
                color: var(--primary-text-color);
                box-sizing: border-box;
                margin-bottom: 8px;
            }
            input[type="color"] {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                width: 40px;
                height: 40px;
                background-color: transparent;
                border: none;
                cursor: pointer;
            }
            input[type="color"]::-webkit-color-swatch-wrapper {
                padding: 0;
            }
            input[type="color"]::-webkit-color-swatch {
                border-radius: 4px;
                border: 1px solid var(--divider-color);
            }
            .range-container {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .range-container span {
                font-family: monospace;
                min-width: 50px;
                text-align: right;
            }
        `;
    }
}

customElements.define("mirage-card-editor", MirageCardEditor);