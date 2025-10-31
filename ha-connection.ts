/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { SettingsState } from './types';

// Define a basic type for the hass object for better type safety.
// In a real environment, this would be imported from Home Assistant's types.
type HassObject = {
    callWS: <T>(msg: { type: string, [key: string]: any }) => Promise<T>;
    language: string;
};

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export class HAConnection {
    private hass: HassObject;
    private configEntryId: string;

    constructor(hass: HassObject, configEntryId: string) {
        if (!hass || !hass.callWS) {
            throw new Error("A valid Home Assistant 'hass' object must be provided.");
        }
        this.hass = hass;
        this.configEntryId = configEntryId;
    }

    public async getSettings(): Promise<any> {
        try {
            const result = await this.hass.callWS({
                type: 'mirage/get_settings',
                config_entry_id: this.configEntryId,
            });
            return result || {};
        } catch (error) {
            console.error('Error fetching Mirage settings:', error);
            return {};
        }
    }
    
    public async getLanguage(): Promise<string> {
        // The language is directly available on the hass object.
        return Promise.resolve(this.hass.language || 'en');
    }

    public async updateSettings(settings: SettingsState): Promise<void> {
        try {
            await this.hass.callWS({
                type: 'mirage/update_settings',
                config_entry_id: this.configEntryId,
                settings: settings,
            });
        } catch (error) {
            console.error('Error updating Mirage settings:', error);
            throw error;
        }
    }

    public async uploadImage(file: File): Promise<{ url: string }> {
        const fileData = await fileToBase64(file);
        try {
            const result = await this.hass.callWS<{ url: string }>({
                type: 'mirage/upload_image',
                file_name: file.name,
                file_data: fileData,
            });
            return result;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}
