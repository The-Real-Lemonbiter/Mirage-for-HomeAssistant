# Mirage UI für Home Assistant

<p align="center">
  <img src="https://raw.githubusercontent.com/The-Real-Lemonbiter/Mirage-for-HomeAssistant/main/custom_components/mirage/logo.png" alt="Mirage UI Logo" width="128">
</p>

**Träumst du von einem Smart-Home-Dashboard, das nicht nur intelligent, sondern auch atemberaubend ist?**

Der Weg zu einer perfekten Oberfläche in Home Assistant kann komplex sein – Themes, Karten und Konfigurationen müssen oft mühsam aufeinander abgestimmt werden.

**Hier kommt Mirage UI ins Spiel.**

Mirage UI ist nicht nur ein weiteres Theme, sondern ein **komplettes, einheitliches Design-System**, das Schönheit und Einfachheit vereint. Es wurde entwickelt, um dir die volle Kontrolle über das Aussehen deines Dashboards zu geben, ohne dass du tief in YAML-Code eintauchen musst. Verwandle dein Dashboard von einer reinen Schaltzentrale in ein persönliches Meisterwerk.

---

## Features

- **Live-Einstellungs-Panel**: Konfiguriere dein gesamtes Theme über ein interaktives Panel mit **Live-Vorschau** – direkt in den Home Assistant Einstellungen. Kein Raten, kein YAML-Gefummel mehr.
- **Automatischer Tag- & Nachtmodus**: Konfiguriere separate Designs für helle und dunkle Umgebungen. Mirage UI wechselt automatisch mit dem Sonnenstand von Home Assistant.
- **Mehrsprachige Unterstützung**: Die Benutzeroberfläche ist in Englisch, Deutsch, Französisch, Niederländisch, Spanisch, Italienisch, Polnisch und Portugiesisch verfügbar.
- **Zwei Styling-Modi**:
    1.  **Globales Theme**: Einmal einstellen, überall anwenden. Perfekt für ein einheitliches Design.
    2.  **Individuelles Karten-Styling**: Überschreibe das globale Theme für einzelne Karten, um bestimmte Geräte oder Bereiche hervorzuheben.
- **Verschiedene Karten-Stile**: Wähle zwischen `Glas`, `Deckend`, `Papier` und `Schwebend`.
- **Hintergrundbild-Upload**: Lade ganz einfach unterschiedliche Hintergrundbilder für deinen Tag- und Nachtmodus hoch.
- **Vorgaben-System**: Speichere, lade und teile deine Designs mühelos.
- **Import & Export**: Sichere deine Einstellungen oder teile sie mit der Community.
- **Intelligenter Visueller Editor**: Der Karten-Editor zeigt dir die globalen Werte als Platzhalter an, damit du genau siehst, welche Einstellungen du überschreibst.
- **Deaktivierbare Animationen**: Schalte alle UI-Animationen mit einem Klick aus.
- **Benutzerdefinierter Service**: Wechsle dein Theme dynamisch über Automationen mit dem `mirage.apply_preset` Service.
- **Diagnose-Tool**: Lade mit einem Klick einen Bericht deiner aktuellen Theme-Einstellungen herunter.

---

## Wie es funktioniert: Die duale Architektur

Mirage UI bietet dir das Beste aus beiden Welten: Einfachheit und Kontrolle.

1.  **Die Mirage UI Integration (der Kern)**:
    *   Du installierst Mirage UI als **eine einzige Integration** über HACS.
    *   Nach der Installation fügst du die Integration unter `Einstellungen > Geräte & Dienste` hinzu.

2.  **Zentrales Konfigurations-Panel (für das globale Theme)**:
    *   Das globale Erscheinungsbild wird **ausschließlich** im interaktiven Einstellungs-Panel der Integration angepasst. Klicke einfach auf `Konfigurieren`, um die Live-Vorschau zu öffnen.
    *   Deine Einstellungen werden als globale CSS-Variablen bereitgestellt, die von allen Mirage Cards genutzt werden.

3.  **Die Mirage Card (flexibel & anpassungsfähig)**:
    *   **Standardmäßig** übernimmt die Karte automatisch das globale Theme.
    *   **Optional** kannst du jeder Karte ein eigenes `theme`-Objekt in der YAML-Konfiguration mitgeben oder den visuellen Editor verwenden, um sie individuell zu gestalten.

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
2.  Wähle unter **Theme** die Option `Automatisch`. Mirage UI kümmert sich um den Rest.

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
  paper_bg_color_light: '#fef2f2' # Kachel-Hintergrundfarbe für hellen Modus
  card_primary_text_color: '#111827' # Dunkler Text für den Paper-Stil
```

### 3. Passe das globale Theme an
Um die systemweiten Standardeinstellungen zu ändern, gehe zur Konfigurationsseite der Integration:
**Einstellungen > Geräte & Dienste > Mirage UI > Konfigurieren**. Hier öffnet sich das Live-Einstellungs-Panel.

### 4. Nutze den Service in Automationen
Du kannst das globale Mirage Theme dynamisch ändern. Das ist nützlich, um die Atmosphäre deines Dashboards basierend auf Ereignissen anzupassen. Die Vorgaben werden dabei auf dem Server gespeichert, sodass Automationen zuverlässig darauf zugreifen können.

**Beispiel:** Wechsle zum Preset "Movie Time", wenn dein Fernseher eingeschaltet wird.
```yaml
automation:
  - alias: "Mirage Kino-Modus bei Filmstart"
    trigger:
      - platform: state
        entity_id: media_player.wohnzimmer_tv
        to: "playing"
    action:
      - service: mirage.apply_preset
        data:
          preset_name: "Movie Time"
```

Deine Änderungen werden sofort übernommen. Viel Spaß beim Gestalten!

---
---

# Mirage UI for Home Assistant (English)

<p align="center">
  <img src="https://raw.githubusercontent.com/The-Real-Lemonbiter/Mirage-for-HomeAssistant/main/custom_components/mirage/logo.png" alt="Mirage UI Logo" width="128">
</p>

**Ever dreamed of a smart home dashboard that's not just smart, but absolutely stunning?**

The path to a perfect UI in Home Assistant can be complex, often requiring you to juggle separate themes, cards, and configurations to get everything just right.

**This is where Mirage UI comes in.**

Mirage UI isn't just another theme; it's a **complete, unified design system** that brings beauty and simplicity together. It’s built from the ground up to give you full control over your dashboard's appearance, without needing a deep dive into YAML. Transform your dashboard from a mere control center into a personal masterpiece.

---

## Features

- **Live Settings Panel**: Configure your entire theme using an interactive panel with a **live preview**—directly within your Home Assistant settings. No more guesswork, no more YAML-wrangling.
- **Automatic Day & Night Mode**: Configure separate designs for light and dark environments. Mirage UI switches automatically based on Home Assistant's sun state.
- **Multi-Language Support**: The user interface is available in English, German, French, Dutch, Spanish, Italian, Polish, and Portuguese.
- **Two Styling Modes**:
    1.  **Global Theming**: Set it once, apply it everywhere. Perfect for a consistent design.
    2.  **Per-Card Styling**: Override the global theme for individual cards to highlight specific devices or sections.
- **Multiple Card Styles**: Choose between styles like `Glass`, `Solid`, `Paper`, and `Floating`.
- **Background Image Upload**: Easily upload different background images for your day and night modes.
- **Preset System**: Save, load, and share your designs with ease.
- **Import & Export**: Back up your settings or share them with the community.
- **Smarter Visual Editor**: The card editor now displays global values as placeholders, so you know exactly which settings you're overriding.
- **Toggleable Animations**: Disable all UI animations with a single switch.
- **Custom Service**: Change your theme dynamically via automations using the `mirage.apply_preset` service.
- **Diagnostics Tool**: Download a report of your current theme settings with one click.

---

## How It Works: The Dual Architecture

Mirage UI gives you the best of both worlds: simplicity and control.

1.  **The Mirage UI Integration (The Core)**:
    *   You install Mirage UI as **a single integration** via HACS.
    *   After installation, you add the integration under `Settings > Devices & Services`.

2.  **Central Configuration Panel (for Global Theming)**:
    *   The global look and feel is managed **exclusively** in the integration's interactive settings panel. Just click `Configure` to open the live preview UI.
    *   Your settings are provided as global CSS variables used by all Mirage Cards.

3.  **The Mirage Card (Flexible & Adaptive)**:
    *   **By default**, the card automatically inherits the global theme.
    *   **Optionally**, you can give any card its own `theme` object in its YAML config or use the Visual Editor to style it individually.

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
2.  Under **Theme**, select `Auto`. Mirage UI handles the rest.

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
  paper_bg_color_light: '#fef2f2' # Card background color for light mode
  card_primary_text_color: '#111827' # Dark text for paper style
```

### 3. Customize the Global Theme
To change the system-wide default settings, go to the integration's configuration page:
**Settings > Devices & Services > Mirage UI > Configure**. This will open the live settings panel.

### 4. Use the Service in Automations
You can change the global Mirage theme dynamically. This is useful for adapting your dashboard's atmosphere based on events. Presets are stored server-side, so automations can reliably access them.

**Example:** Switch to the "Movie Time" preset when your TV turns on.
```yaml
automation:
  - alias: "Mirage Movie Mode on Play"
    trigger:
      - platform: state
        entity_id: media_player.living_room_tv
        to: "playing"
    action:
      - service: mirage.apply_preset
        data:
          preset_name: "Movie Time"
```

Your changes will apply instantly. Have fun designing!

---

## License

Copyright (c) 2025 Lemonbiter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.