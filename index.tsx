/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { SettingsProvider } from './components/SettingsProvider';
import { SettingsPanel } from './components/SettingsPanel';
import { HAConnection } from './ha-connection';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const urlParams = new URLSearchParams(window.location.search);
const configEntryId = urlParams.get('config_entry_id');

if (!configEntryId) {
    rootElement.innerHTML = `
        <div style="color: red; font-family: sans-serif; padding: 20px;">
            <strong>Error:</strong> Missing 'config_entry_id' in URL. This panel must be opened from the Home Assistant integrations page.
        </div>
    `;
} else {
    const haConnection = new HAConnection(configEntryId);
    
    const AppWrapper = () => {
        return (
            <SettingsProvider haConnection={haConnection}>
                {/* We don't need a close button here as HA provides it */}
                <SettingsPanel isOpen={true} onClose={() => {}} isHaIntegration={true} />
            </SettingsProvider>
        );
    };

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );
}