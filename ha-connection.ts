/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { SettingsState } from './types';

// This is a simplified version of the HA connection logic.
// In a real scenario, you'd import these types from home-assistant-js-websocket.
type HAConnectionObj = {
    subscribeMessage: (callback: (message: any) => void, subscribeMessage: any) => Promise<any>;
    sendMessagePromise: (message: any) => Promise<any>;
    close: () => void;
    // Simulate the hass object being available after connection
    hass: {
        language: string;
    }
};

// This function is expected to be available in the context of the HA frontend
declare function getAuth(options: { hassUrl?: string }): Promise<{
    wsUrl: string;
    accessToken: string;
    expired: boolean;
    expires: number;
    // ... and other properties
}>;

declare function createConnection(options: { auth: any }): Promise<HAConnectionObj>;

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export class HAConnection {
    private connection: HAConnectionObj | null = null;
    private configEntryId: string;

    constructor(configEntryId: string) {
        this.configEntryId = configEntryId;
    }

    private async connect(): Promise<HAConnectionObj> {
        if (this.connection) {
            return this.connection;
        }

        try {
            // Fix: Pass an empty object to getAuth as per its declaration.
            const auth = await getAuth({});
            this.connection = await createConnection({ auth });
            return this.connection;
        } catch (err) {
            console.error("Failed to connect to Home Assistant WebSocket", err);
            throw new Error("Could not establish connection with Home Assistant.");
        }
    }

    public async getSettings(): Promise<any> {
        const conn = await this.connect();
        try {
            const result = await conn.sendMessagePromise({
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
        const conn = await this.connect();
        // In a real HA environment, the hass object is available on the connection.
        // We simulate this behavior here.
        return conn.hass?.language || 'en';
    }

    public async updateSettings(settings: SettingsState): Promise<void> {
        const conn = await this.connect();
        try {
            await conn.sendMessagePromise({
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
        const conn = await this.connect();
        const fileData = await fileToBase64(file);
        try {
            const result = await conn.sendMessagePromise({
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