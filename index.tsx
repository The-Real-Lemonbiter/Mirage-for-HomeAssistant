/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This entrypoint is now only used for the standalone preview mode,
// which is loaded via index.html. The Home Assistant settings panel
// has its own loader inside mirage-options.html, which imports
// components directly.

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
} else {
    // This indicates the script might be running in a context without a #root div,
    // like the HA config panel. We let mirage-options.html handle the rendering.
    console.log("Mirage UI script loaded. Standalone root element not found, assuming integration mode.");
}
