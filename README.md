# Mirage UI für Home Assistant

Mirage UI ist eine elegante, moderne und umfassend konfigurierbare Benutzeroberfläche für Home Assistant. Inspiriert von Glassmorphism, bietet sie dir ein wunderschönes und intuitives Erlebnis zur Steuerung deines Smart Homes.

Dieses Paket ist eine einzige, vereinheitlichte **Integration**, die alles Notwendige mitbringt:
- Ein dynamisches **Mirage Theme** (im hellen und dunklen Modus).
- Eine vielseitige **Mirage Card** zur Anzeige deiner Geräte.
- Eine benutzerfreundliche **Konfigurations-Oberfläche** direkt in Home Assistant, mit der du das globale Aussehen anpassen kannst.

---

## Features

- **Zwei Styling-Modi**:
    1.  **Globales Theme**: Einmal einstellen, überall anwenden. Perfekt für ein einheitliches Design.
    2.  **Individuelles Karten-Styling**: Überschreibe das globale Theme für einzelne Karten, um bestimmte Geräte oder Bereiche hervorzuheben.
- **Vier Karten-Stile**: Wähle zwischen `Glass`, `Solid`, `Paper` und `Floating`.
- **Umfassende Anpassung**: Passe Farben, Ränder, Radien, Unschärfe und mehr über ein Live-Vorschau-Panel an.
- **Visueller Editor**: Konfiguriere deine individuellen Karten direkt im Lovelace-Editor – ganz ohne YAML.
- **Preset-System**: Speichere, lade und teile deine Designs mühelos.
- **Import & Export**: Sichere deine Einstellungen oder teile sie mit der Community.
- **Eigene Hintergründe**: Lade unterschiedliche Hintergrundbilder für dein helles und dunkles Theme hoch.

---

## Wie es funktioniert: Die duale Architektur

Mirage UI bietet dir das Beste aus beiden Welten: Einfachheit und Kontrolle.

1.  **Die Mirage UI Integration (der Kern)**:
    *   Du installierst Mirage UI als **eine einzige Integration** über HACS.
    *   Nach der Installation fügst du die Integration unter `Einstellungen > Geräte & Dienste` hinzu.

2.  **Zentrales Konfigurations-Panel (für das globale Theme)**:
    *   Das globale Erscheinungsbild wird **ausschließlich** auf der Konfigurationsseite der Integration angepasst. Diese Einstellungen gelten für dein gesamtes Home Assistant.
    *   Deine Einstellungen werden als globale CSS-Variablen bereitgestellt.

3.  **Die Mirage Card (flexibel & anpassungsfähig)**:
    *   **Standardmäßig** übernimmt die Karte automatisch das globale Theme. Du musst nichts weiter tun.
    *   **Optional** kannst du jeder Karte ein eigenes `theme`-Objekt in der YAML-Konfiguration mitgeben oder den visuellen Editor verwenden, um sie individuell zu gestalten. Diese lokalen Einstellungen überschreiben dann das globale Theme nur für diese eine Karte.

---

## Installation (über HACS)

1.  Öffne den **HACS**-Bereich in deinem Home Assistant.
2.  Gehe zu **Integrationen** und klicke auf den großen `+`-Button.
3.  Suche nach "**Mirage UI**" und installiere es.
4.  **Starte Home Assistant neu**, wenn du dazu aufgefordert wirst.

## Einrichtung

1.  Gehe zu **Einstellungen > Geräte & Dienste**.
2.  Klicke auf **"+ Integration hinzufügen"** und suche nach "**Mirage UI**".
3.  Folge den Anweisungen. Die Integration richtet alles automatisch ein.

## Aktivierung & Nutzung

### 1. Aktiviere das globale Theme
1.  Gehe zu deinem **Benutzerprofil** (klicke auf deinen Namen in der Seitenleiste).
2.  Wähle unter **Theme** entweder `Mirage Dark` oder `Mirage Light` aus.

### 2. Nutze die Karte

#### Einfache Nutzung (verwendet globales Theme)
```yaml
type: custom:mirage-card
title: Wohnzimmer
entity: light.wohnzimmer_licht
# Kein 'theme'-Block hier, also wird das globale Theme verwendet.
```

#### Fortgeschrittene Nutzung (individuelles Styling)
Du kannst Stile direkt im visuellen Editor anpassen oder per YAML.

```yaml
type: custom:mirage-card
title: Sicherheits-Info
entity: binary_sensor.haustuer
theme:
  card_style: paper # Überschreibt den globalen Stil
  accent_color: '#e11d48' # Rote Akzentfarbe, nur für diese Karte
  border_radius: 8
  card_primary_text_color: '#111827' # Dunkler Text für den Paper-Stil
```

### 3. Passe das globale Theme an
Um die systemweiten Standardeinstellungen zu ändern, gehe zur Konfigurationsseite der Integration:
**Einstellungen > Geräte & Dienste > Mirage UI > Konfigurieren**.

Deine Änderungen werden sofort übernommen. Viel Spaß beim Gestalten!

---
---

# Mirage UI for Home Assistant (English)

Mirage UI is a sleek, modern, and highly configurable user interface for Home Assistant. Inspired by glassmorphism, it provides a beautiful and intuitive experience for controlling your smart home.

This package is a single, unified **integration** that provides:
- A dynamic **Mirage Theme** (in dark and light modes).
- A versatile **Mirage Card** for displaying your entities.
- A user-friendly **Configuration UI** within Home Assistant to customize the global appearance.

---

## Features

- **Two Styling Modes**:
    1.  **Global Theming**: Set it once, apply it everywhere. Perfect for a consistent design.
    2.  **Per-Card Styling**: Override the global theme for individual cards to highlight specific devices or sections.
- **Four Card Styles**: Choose between `Glass`, `Solid`, `Paper`, and `Floating`.
- **Deep Customization**: Adjust colors, borders, radius, blur, and more via a live-preview UI panel.
- **Visual Editor**: Configure your individual cards directly in the Lovelace editor—no YAML required.
- **Preset System**: Save, load, and share your designs with ease.
- **Import & Export**: Back up your settings or share them with the community.
- **Custom Backgrounds**: Upload different background images for your light and dark themes.

---

## How It Works: The Dual Architecture

Mirage UI gives you the best of both worlds: simplicity and control.

1.  **The Mirage UI Integration (The Core)**:
    *   You install Mirage UI as **a single integration** via HACS.
    *   After installation, you add the integration under `Settings > Devices & Services`.

2.  **Central Configuration Panel (for Global Theming)**:
    *   The global look and feel is managed **exclusively** on the integration's configuration page. These settings apply to your entire Home Assistant instance.
    *   Your settings are provided as global CSS variables.

3.  **The Mirage Card (Flexible & Adaptive)**:
    *   **By default**, the card automatically inherits the global theme. No extra configuration needed.
    *   **Optionally**, you can give any card its own `theme` object in its YAML config or use the Visual Editor to style it individually. These local settings will override the global theme for that specific card only.

---

## Installation (HACS)

1.  Navigate to the **HACS** section in your Home Assistant.
2.  Go to **Integrations** and click the big '`+`' button.
3.  Search for "**Mirage UI**" and install it.
4.  **Restart Home Assistant** as prompted.

## Setup

1.  Go to **Settings > Devices & Services**.
2.  Click **"+ Add Integration"** and search for "**Mirage UI**".
3.  Follow the on-screen instructions. The integration sets up everything automatically.

## Activation & Usage

### 1. Activate the Global Theme
1.  Navigate to your **User Profile** (click your name in the bottom-left sidebar).
2.  Under **Theme**, select `Mirage Dark` or `Mirage Light`.

### 2. Use the Card

#### Basic Usage (Inherits Global Theme)
```yaml
type: custom:mirage-card
title: Living Room
entity: light.living_room_lights
# No 'theme' block here, so it uses the global theme.
```

#### Advanced Usage (Per-Card Styling)
You can customize styles directly in the visual editor or via YAML.

```yaml
type: custom:mirage-card
title: Security Alert
entity: binary_sensor.front_door
theme:
  card_style: paper # Overrides the global style
  accent_color: '#e11d48' # Red accent, just for this card
  border_radius: 8
  card_primary_text_color: '#111827' # Dark text for paper style
```

### 3. Customize the Global Theme
To change the system-wide default settings, go to the integration's configuration page:
**Settings > Devices & Services > Mirage UI > Configure**.

Your changes will apply instantly. Have fun designing!

---

## License

Copyright (c) 2024 Lemonbiter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, to a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a-following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.