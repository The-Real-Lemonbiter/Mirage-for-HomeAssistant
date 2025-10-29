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
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const urlParams = new URLSearchParams(window.location.search);
const configEntryId = urlParams.get('config_entry_id');
const root = ReactDOM.createRoot(rootElement);

if (!configEntryId) {
    // This is the standalone preview mode. Render the main App dashboard.
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
} else {
    // This is the Home Assistant integration settings panel.
    const haConnection = new HAConnection(configEntryId);
    
    const SettingsWrapper = () => {
        return (
            <SettingsProvider haConnection={haConnection}>
                {/* We don't need a close button here as HA provides it */}
                <SettingsPanel isOpen={true} onClose={() => {}} isHaIntegration={true} />
            </SettingsProvider>
        );
    };

    root.render(
      <React.StrictMode>
        <SettingsWrapper />
      </React.StrictMode>
    );
}