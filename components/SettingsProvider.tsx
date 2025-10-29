/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import type { Theme, SettingsContextType, TextColors, Preset, SettingsState, EditMode, ThemeConfig, GeneralSettings } from '../types';
import type { HAConnection } from '../ha-connection';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const hexToRgba = (hex: string, alpha: number): string => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        return `rgba(59, 130, 246, ${alpha})`;
    }
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const n = parseInt(`0x${c.join('')}`);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// Default Theme Settings
const DEFAULTS_NIGHT: ThemeConfig = {
    cardStyle: 'glass',
    transparency: 30,
    blurIntensity: 20,
    solidColor: '#2d3748',
    paperColor: '#2a2d35',
    floatingOpacity: 100,
    floatingColor: '#2a323d',
    borderThickness: 1,
    separatorThickness: 1,
    borderRadius: 16,
    accentColor: '#3b82f6',
    pageTextColor: { primary: '#e5e7eb', secondary: '#9ca3af' },
    cardTextColorMode: 'auto',
    temperatureColor: null,
    weatherColor: null,
    humidityColor: null,
    doorColor: null,
    bgColor: '#0d1117',
    customBg: null,
};

const DEFAULTS_DAY: ThemeConfig = {
    cardStyle: 'glass',
    transparency: 30,
    blurIntensity: 20,
    solidColor: '#e2e8f0',
    paperColor: '#ffffff',
    floatingOpacity: 100,
    floatingColor: '#ffffff',
    borderThickness: 1,
    separatorThickness: 1,
    borderRadius: 16,
    accentColor: '#3b82f6',
    pageTextColor: { primary: '#1f2937', secondary: '#4b5563' },
    cardTextColorMode: 'auto',
    temperatureColor: null,
    weatherColor: null,
    humidityColor: null,
    doorColor: null,
    bgColor: '#f3f4f6',
    customBg: null,
};

const DEFAULTS_GENERAL: GeneralSettings = {
    font: 'system',
    animationsEnabled: true,
};

const DEFAULTS: SettingsState = {
  night: DEFAULTS_NIGHT,
  day: DEFAULTS_DAY,
  general: DEFAULTS_GENERAL,
};

const DEFAULT_PRESETS_STRUCTURE = [
  {
    key: 'mirage_default',
    isDefault: true,
    settings: {
      day: { cardStyle: 'glass', transparency: 30, blurIntensity: 20, borderRadius: 16, borderThickness: 1, separatorThickness: 1, accentColor: '#3b82f6', cardTextColorMode: 'auto' },
      night: { cardStyle: 'glass', transparency: 30, blurIntensity: 20, borderRadius: 16, borderThickness: 1, separatorThickness: 1, accentColor: '#3b82f6', cardTextColorMode: 'auto' },
    }
  },
  {
    key: 'pure_glass',
    isDefault: true,
    settings: {
      day: { cardStyle: 'glass', transparency: 25, blurIntensity: 30, borderThickness: 0, separatorThickness: 0, borderRadius: 24, cardTextColorMode: 'dark' },
      night: { cardStyle: 'glass', transparency: 25, blurIntensity: 30, borderThickness: 0, separatorThickness: 0, borderRadius: 24, cardTextColorMode: 'light' },
    }
  },
  {
    key: 'minimalist_solid',
    isDefault: true,
    settings: {
      day: { cardStyle: 'solid', solidColor: '#e2e8f0', borderRadius: 8, borderThickness: 1, separatorThickness: 1, cardTextColorMode: 'dark' },
      night: { cardStyle: 'solid', solidColor: '#2d3748', borderRadius: 8, borderThickness: 1, separatorThickness: 1, cardTextColorMode: 'light' },
    }
  }
] as const;


// Translations are embedded directly to avoid async loading issues in the preview environment.
const translationsMap: { [key: string]: { [key: string]: string } } = {
    en: {
      "configTitle": "Mirage UI Configuration", "livePreview": "Mirage Live Preview", "previewCardTitle": "Mirage Card Preview",
      "previewCardContent": "This is a preview of your current settings.", "example": "Example", "presets": "Presets",
      "loadPreset": "Load Preset", "defaultPresets": "Default Presets", "myPresets": "My Presets", "undo": "Undo",
      "deletePreset": "Delete \"{presetName}\"", "saveCurrentStyle": "Save Current Style", "newPresetPlaceholder": "New preset name...",
      "save": "Save", "theme": "Theme", "mode": "Mode", "light": "Light", "dark": "Dark", "cardStyle": "Card Style",
      "glass": "Glass", "solid": "Solid", "paper": "Paper", "floating": "Floating", "blurIntensity": "Blur Intensity",
      "transparency": "Transparency", "cardColor": "Card Background Color", "opacity": "Opacity",
      "appearance": "Appearance", "borderRadius": "Border Radius", "borderWidth": "Border Width", "separatorWidth": "Separator Width",
      "cardTextColor": "Card Text Color", "auto": "Auto", "fontStyle": "Font Style", "system": "System", "serif": "Serif",
      "mono": "Mono", "animations": "Animations", "colors": "Colors", "accentColor": "Accent Color",
      "temperature": "Temperature", "weather": "Weather", "humidity": "Humidity", "door": "Door", "pageBackground": "Page Background",
      "backgroundImage": "Background Image", "backgroundColor": "Background Color",
      "uploadImage": "Upload Image", "localImageSelected": "Local Image Selected", "change": "Change", "clear": "Clear",
      "bgNote": "Note: An uploaded image will always take precedence over a page background color.", "advanced": "Advanced",
      "export": "Export", "import": "Import", "settingsCopied": "Settings copied to clipboard!",
      "pasteSettingsPrompt": "Paste your Mirage UI settings string:", "importError": "Invalid settings format. Could not import.",
      "resetToDefaults": "Reset to Defaults", "language": "Language", "primary": "Primary", "secondary": "Secondary",
      "undoPresetLoadTooltip": "Revert to state before loading a preset",
      "presetMirageDefault": "Mirage Default", "presetPureGlass": "Pure Glass", "presetMinimalistSolid": "Minimalist Solid",
      "dayTab": "☀️ Light / Day", "nightTab": "🌙 Dark / Night", "generalTab": "⚙️ General",
      "resetDaySettings": "Reset Day Settings", "resetNightSettings": "Reset Night Settings", "resetGeneralSettings": "Reset General Settings",
      "saveSettings": "Save Settings", "settingsSaved": "Settings Saved!",
      "generateWithAi": "Generate with AI", "aiPromptPlaceholder": "e.g., a cozy, warm theme for winter...", "generate": "Generate"
    },
    de: {
      "configTitle": "Mirage UI Konfiguration", "livePreview": "Mirage Live-Vorschau", "previewCardTitle": "Mirage Card Vorschau",
      "previewCardContent": "Dies ist eine Vorschau Ihrer aktuellen Einstellungen.", "example": "Beispiel", "presets": "Vorgaben",
      "loadPreset": "Vorgabe laden", "defaultPresets": "Standardvorgaben", "myPresets": "Meine Vorgaben", "undo": "Rückgängig",
      "deletePreset": "Vorgabe \"{presetName}\" löschen", "saveCurrentStyle": "Als Vorgabe speichern", "newPresetPlaceholder": "Name für neue Vorgabe...",
      "save": "Speichern", "theme": "Theme", "mode": "Modus", "light": "Hell", "dark": "Dunkel", "cardStyle": "Kartenstil",
      "glass": "Glas", "solid": "Deckend", "paper": "Papier", "floating": "Schwebend", "blurIntensity": "Unschärfe",
      "transparency": "Transparenz", "cardColor": "Kachel-Hintergrundfarbe", "opacity": "Deckkraft",
      "appearance": "Erscheinungsbild", "borderRadius": "Randradius", "borderWidth": "Randbreite", "separatorWidth": "Trennerbreite",
      "cardTextColor": "Karten-Textfarbe", "auto": "Auto", "fontStyle": "Schriftart", "system": "System", "serif": "Serif",
      "mono": "Mono", "animations": "Animationen", "colors": "Farben", "accentColor": "Akzentfarbe",
      "temperature": "Temperatur", "weather": "Wetter", "humidity": "Feuchtigkeit", "door": "Tür", "pageBackground": "Seitenhintergrund",
      "backgroundImage": "Hintergrundbild", "backgroundColor": "Hintergrundfarbe",
      "uploadImage": "Bild hochladen", "localImageSelected": "Lokales Bild ausgewählt", "change": "Ändern", "clear": "Löschen",
      "bgNote": "Hinweis: Ein hochgeladenes Bild hat immer Vorrang vor einer Seitenhintergrundfarbe.", "advanced": "Erweitert",
      "export": "Exportieren", "import": "Importieren", "settingsCopied": "Einstellungen in die Zwischenlage kopiert!",
      "pasteSettingsPrompt": "Fügen Sie Ihre Mirage UI Einstellungs-Zeichenfolge ein:", "importError": "Ungültiges Einstellungsformat. Import fehlgeschlagen.",
      "resetToDefaults": "Auf Standard zurücksetzen", "language": "Sprache", "primary": "Primär", "secondary": "Sekundär",
      "undoPresetLoadTooltip": "Auf den Zustand vor dem Laden der Vorgabe zurücksetzen",
      "presetMirageDefault": "Mirage Standard", "presetPureGlass": "Pures Glas", "presetMinimalistSolid": "Minimalistisch Deckend",
      "dayTab": "☀️ Hell / Tag", "nightTab": "🌙 Nacht / Dunkel", "generalTab": "⚙️ Allgemein",
      "resetDaySettings": "Tag-Einstellungen zurücksetzen", "resetNightSettings": "Nacht-Einstellungen zurücksetzen", "resetGeneralSettings": "Allgemeine Einstellungen zurücksetzen",
      "saveSettings": "Einstellungen Speichern", "settingsSaved": "Einstellungen Gespeichert!",
      "generateWithAi": "Mit KI generieren", "aiPromptPlaceholder": "z.B. ein gemütliches, warmes Thema für den Winter...", "generate": "Generieren"
    },
    fr: {
      "configTitle": "Configuration de l'interface Mirage", "livePreview": "Aperçu en direct de Mirage", "previewCardTitle": "Aperçu de la carte Mirage",
      "previewCardContent": "Ceci est un aperçu de vos paramètres actuels.", "example": "Exemple", "presets": "Préréglages",
      "loadPreset": "Charger un préréglage", "defaultPresets": "Préréglages par défaut", "myPresets": "Mes préréglages", "undo": "Annuler",
      "deletePreset": "Supprimer \"{presetName}\"", "saveCurrentStyle": "Enregistrer le style actuel", "newPresetPlaceholder": "Nom du nouveau préréglage...",
      "save": "Enregistrer", "theme": "Thème", "mode": "Mode", "light": "Clair", "dark": "Sombre", "cardStyle": "Style de carte",
      "glass": "Verre", "solid": "Solide", "paper": "Papier", "floating": "Flottant", "blurIntensity": "Intensité du flou",
      "transparency": "Transparence", "cardColor": "Couleur de fond de la carte", "opacity": "Opacité",
      "appearance": "Apparence", "borderRadius": "Rayon de la bordure", "borderWidth": "Largeur de la bordure", "separatorWidth": "Largeur du séparateur",
      "cardTextColor": "Couleur du texte de la carte", "auto": "Auto", "fontStyle": "Style de police", "system": "Système", "serif": "Serif",
      "mono": "Mono", "animations": "Animations", "colors": "Couleurs", "accentColor": "Couleur d'accentuation",
      "temperature": "Température", "weather": "Météo", "humidity": "Humidité", "door": "Porte", "pageBackground": "Arrière-plan de la page",
      "backgroundImage": "Image de fond", "backgroundColor": "Couleur de fond",
      "uploadImage": "Télécharger une image", "localImageSelected": "Image locale sélectionnée", "change": "Changer", "clear": "Effacer",
      "bgNote": "Remarque : Une image téléchargée prévaudra toujours sur la couleur de fond de la page.", "advanced": "Avancé",
      "export": "Exporter", "import": "Importer", "settingsCopied": "Paramètres copiés dans le presse-papiers !",
      "pasteSettingsPrompt": "Collez votre chaîne de paramètres de l'interface Mirage :", "importError": "Format de paramètres non valide. L'importation a échoué.",
      "resetToDefaults": "Réinitialiser les paramètres par défaut", "language": "Langue", "primary": "Primaire", "secondary": "Secondaire",
      "undoPresetLoadTooltip": "Revenir à l'état avant de charger le préréglage",
      "presetMirageDefault": "Mirage Défaut", "presetPureGlass": "Verre Pur", "presetMinimalistSolid": "Solide Minimaliste",
      "dayTab": "☀️ Clair / Jour", "nightTab": "🌙 Sombre / Nuit", "generalTab": "⚙️ Général",
      "resetDaySettings": "Réinitialiser les paramètres de jour", "resetNightSettings": "Réinitialiser les paramètres de nuit", "resetGeneralSettings": "Réinitialiser les paramètres généraux",
      "saveSettings": "Sauvegarder les paramètres", "settingsSaved": "Paramètres sauvegardés !",
      "generateWithAi": "Générer avec l'IA", "aiPromptPlaceholder": "ex: un thème chaud et cosy pour l'hiver...", "generate": "Générer"
    },
    nl: {
        "configTitle": "Mirage UI Configuratie", "livePreview": "Mirage Live Voorbeeld", "previewCardTitle": "Mirage Kaart Voorbeeld", "previewCardContent": "Dit is een voorbeeld van uw huidige instellingen.", "example": "Voorbeeld", "presets": "Voorinstellingen", "loadPreset": "Voorinstelling Laden", "defaultPresets": "Standaard Voorinstellingen", "myPresets": "Mijn Voorinstellingen", "undo": "Ongedaan maken", "deletePreset": "Verwijder \"{presetName}\"", "saveCurrentStyle": "Huidige Stijl Opslaan", "newPresetPlaceholder": "Naam nieuwe voorinstelling...", "save": "Opslaan", "theme": "Thema", "mode": "Modus", "light": "Licht", "dark": "Donker", "cardStyle": "Kaartstijl", "glass": "Glas", "solid": "Solide", "paper": "Papier", "floating": "Zwevend", "blurIntensity": "Vervagingsintensiteit", "transparency": "Transparantie", "cardColor": "Achtergrondkleur Kaart", "opacity": "Dekking", "appearance": "Uiterlijk", "borderRadius": "Randradius", "borderWidth": "Randbreedte", "separatorWidth": "Scheidingsbreedte", "cardTextColor": "Tekstkleur Kaart", "auto": "Auto", "fontStyle": "Lettertype", "system": "Systeem", "serif": "Serif", "mono": "Mono", "animations": "Animaties", "colors": "Kleuren", "accentColor": "Accentkleur", "temperature": "Temperatuur", "weather": "Weer", "humidity": "Vochtigheid", "door": "Deur", "pageBackground": "Pagina-achtergrond", "backgroundImage": "Achtergrondafbeelding", "backgroundColor": "Achtergrondkleur", "uploadImage": "Afbeelding Uploaden", "localImageSelected": "Lokale Afbeelding Geselecteerd", "change": "Wijzigen", "clear": "Wissen", "bgNote": "Let op: Een geüploade afbeelding heeft altijd voorrang op een achtergrondkleur.", "advanced": "Geavanceerd", "export": "Exporteren", "import": "Importeren", "settingsCopied": "Instellingen gekopieerd naar klembord!", "pasteSettingsPrompt": "Plak uw Mirage UI instellingenreeks:", "importError": "Ongeldig instellingenformaat. Importeren mislukt.", "resetToDefaults": "Terugzetten naar Standaard", "language": "Taal", "primary": "Primair", "secondary": "Secundair", "undoPresetLoadTooltip": "Herstel naar de staat vóór het laden van een voorinstelling", "presetMirageDefault": "Mirage Standaard", "presetPureGlass": "Puur Glas", "presetMinimalistSolid": "Minimalistisch Solide", "dayTab": "☀️ Licht / Dag", "nightTab": "🌙 Donker / Nacht", "generalTab": "⚙️ Algemeen", "resetDaySettings": "Daginstellingen Resetten", "resetNightSettings": "Nachtinstellingen Resetten", "resetGeneralSettings": "Algemene Instellingen Resetten", "saveSettings": "Instellingen Opslaan", "settingsSaved": "Instellingen Opgeslagen!",
        "generateWithAi": "Genereer met AI", "aiPromptPlaceholder": "bijv. een gezellig, warm thema voor de winter...", "generate": "Genereer"
    },
    es: {
        "configTitle": "Configuración de Mirage UI", "livePreview": "Vista Previa en Vivo de Mirage", "previewCardTitle": "Vista Previa de Tarjeta Mirage", "previewCardContent": "Esta es una vista previa de su configuración actual.", "example": "Ejemplo", "presets": "Preajustes", "loadPreset": "Cargar Preajuste", "defaultPresets": "Preajustes Predeterminados", "myPresets": "Mis Preajustes", "undo": "Deshacer", "deletePreset": "Eliminar \"{presetName}\"", "saveCurrentStyle": "Guardar Estilo Actual", "newPresetPlaceholder": "Nombre del nuevo preajuste...", "save": "Guardar", "theme": "Tema", "mode": "Modo", "light": "Claro", "dark": "Oscuro", "cardStyle": "Estilo de Tarjeta", "glass": "Cristal", "solid": "Sólido", "paper": "Papel", "floating": "Flotante", "blurIntensity": "Intensidad de Desenfoque", "transparency": "Transparencia", "cardColor": "Color de Fondo de Tarjeta", "opacity": "Opacidad", "appearance": "Apariencia", "borderRadius": "Radio del Borde", "borderWidth": "Ancho del Borde", "separatorWidth": "Ancho del Separador", "cardTextColor": "Color del Texto de Tarjeta", "auto": "Auto", "fontStyle": "Estilo de Fuente", "system": "Sistema", "serif": "Serif", "mono": "Mono", "animations": "Animaciones", "colors": "Colores", "accentColor": "Color de Acento", "temperature": "Temperatura", "weather": "Clima", "humidity": "Humedad", "door": "Puerta", "pageBackground": "Fondo de Página", "backgroundImage": "Imagen de Fondo", "backgroundColor": "Color de Fondo", "uploadImage": "Subir Imagen", "localImageSelected": "Imagen Local Seleccionada", "change": "Cambiar", "clear": "Limpiar", "bgNote": "Nota: Una imagen subida siempre tendrá prioridad sobre un color de fondo de página.", "advanced": "Avanzado", "export": "Exportar", "import": "Importar", "settingsCopied": "¡Configuración copiada al portapapeles!", "pasteSettingsPrompt": "Pegue su cadena de configuración de Mirage UI:", "importError": "Formato de configuración no válido. No se pudo importar.", "resetToDefaults": "Restablecer a Predeterminados", "language": "Idioma", "primary": "Primario", "secondary": "Secundario", "undoPresetLoadTooltip": "Revertir al estado anterior a la carga de un preajuste", "presetMirageDefault": "Mirage Predeterminado", "presetPureGlass": "Cristal Puro", "presetMinimalistSolid": "Sólido Minimalista", "dayTab": "☀️ Claro / Día", "nightTab": "🌙 Oscuro / Noche", "generalTab": "⚙️ General", "resetDaySettings": "Restablecer Ajustes de Día", "resetNightSettings": "Restablecer Ajustes de Noche", "resetGeneralSettings": "Restablecer Ajustes Generales", "saveSettings": "Guardar Ajustes", "settingsSaved": "¡Ajustes Guardados!",
        "generateWithAi": "Generar con IA", "aiPromptPlaceholder": "ej. un tema acogedor y cálido para el invierno...", "generate": "Generar"
    },
    it: {
        "configTitle": "Configurazione Mirage UI", "livePreview": "Anteprima Live Mirage", "previewCardTitle": "Anteprima Scheda Mirage", "previewCardContent": "Questa è un'anteprima delle tue impostazioni attuali.", "example": "Esempio", "presets": "Preimpostazioni", "loadPreset": "Carica Preimpostazione", "defaultPresets": "Preimpostazioni Predefinite", "myPresets": "Le Mie Preimpostazioni", "undo": "Annulla", "deletePreset": "Elimina \"{presetName}\"", "saveCurrentStyle": "Salva Stile Attuale", "newPresetPlaceholder": "Nome nuova preimpostazione...", "save": "Salva", "theme": "Tema", "mode": "Modalità", "light": "Chiaro", "dark": "Scuro", "cardStyle": "Stile Scheda", "glass": "Vetro", "solid": "Solido", "paper": "Carta", "floating": "Fluttuante", "blurIntensity": "Intensità Sfocatura", "transparency": "Trasparenza", "cardColor": "Colore Sfondo Scheda", "opacity": "Opacità", "appearance": "Aspetto", "borderRadius": "Raggio Bordo", "borderWidth": "Spessore Bordo", "separatorWidth": "Spessore Separatore", "cardTextColor": "Colore Testo Scheda", "auto": "Auto", "fontStyle": "Stile Carattere", "system": "Sistema", "serif": "Serif", "mono": "Mono", "animations": "Animazioni", "colors": "Colori", "accentColor": "Colore d'Accento", "temperature": "Temperatura", "weather": "Meteo", "humidity": "Umidità", "door": "Porta", "pageBackground": "Sfondo Pagina", "backgroundImage": "Immagine di Sfondo", "backgroundColor": "Colore di Sfondo", "uploadImage": "Carica Immagine", "localImageSelected": "Immagine Locale Selezionata", "change": "Cambia", "clear": "Pulisci", "bgNote": "Nota: Un'immagine caricata avrà sempre la precedenza sul colore di sfondo della pagina.", "advanced": "Avanzate", "export": "Esporta", "import": "Importa", "settingsCopied": "Impostazioni copiate negli appunti!", "pasteSettingsPrompt": "Incolla la tua stringa di impostazioni di Mirage UI:", "importError": "Formato impostazioni non valido. Impossibile importare.", "resetToDefaults": "Ripristina Predefiniti", "language": "Lingua", "primary": "Primario", "secondary": "Secondario", "undoPresetLoadTooltip": "Ripristina lo stato precedente al caricamento di una preimpostazione", "presetMirageDefault": "Mirage Predefinito", "presetPureGlass": "Puro Vetro", "presetMinimalistSolid": "Solido Minimalista", "dayTab": "☀️ Chiaro / Giorno", "nightTab": "🌙 Scuro / Notte", "generalTab": "⚙️ Generale", "resetDaySettings": "Ripristina Impostazioni Giorno", "resetNightSettings": "Ripristina Impostazioni Notte", "resetGeneralSettings": "Ripristina Impostazioni Generali", "saveSettings": "Salva Impostazioni", "settingsSaved": "Impostazioni Salvate!",
        "generateWithAi": "Genera con IA", "aiPromptPlaceholder": "es. un tema accogliente e caldo per l'inverno...", "generate": "Genera"
    },
    pl: {
        "configTitle": "Konfiguracja Mirage UI", "livePreview": "Podgląd na Żywo Mirage", "previewCardTitle": "Podgląd Karty Mirage", "previewCardContent": "To jest podgląd Twoich bieżących ustawień.", "example": "Przykład", "presets": "Ustawienia Wstępne", "loadPreset": "Wczytaj Ustawienie", "defaultPresets": "Domyślne Ustawienia", "myPresets": "Moje Ustawienia", "undo": "Cofnij", "deletePreset": "Usuń \"{presetName}\"", "saveCurrentStyle": "Zapisz Bieżący Styl", "newPresetPlaceholder": "Nazwa nowego ustawienia...", "save": "Zapisz", "theme": "Motyw", "mode": "Tryb", "light": "Jasny", "dark": "Ciemny", "cardStyle": "Styl Karty", "glass": "Szkło", "solid": "Pełny", "paper": "Papier", "floating": "Pływający", "blurIntensity": "Intensywność Rozmycia", "transparency": "Przezroczystość", "cardColor": "Kolor Tła Karty", "opacity": "Nieprzezroczystość", "appearance": "Wygląd", "borderRadius": "Promień Narożnika", "borderWidth": "Szerokość Ramki", "separatorWidth": "Szerokość Separatora", "cardTextColor": "Kolor Tekstu Karty", "auto": "Auto", "fontStyle": "Styl Czcionki", "system": "Systemowa", "serif": "Szeryfowa", "mono": "Monospace", "animations": "Animacje", "colors": "Kolory", "accentColor": "Kolor Akcentu", "temperature": "Temperatura", "weather": "Pogoda", "humidity": "Wilgotność", "door": "Drzwi", "pageBackground": "Tło Strony", "backgroundImage": "Obraz Tła", "backgroundColor": "Kolor Tła", "uploadImage": "Prześlij Obraz", "localImageSelected": "Wybrano Lokalny Obraz", "change": "Zmień", "clear": "Wyczyść", "bgNote": "Uwaga: Przesłany obraz zawsze będzie miał pierwszeństwo przed kolorem tła strony.", "advanced": "Zaawansowane", "export": "Eksportuj", "import": "Importuj", "settingsCopied": "Ustawienia skopiowane do schowka!", "pasteSettingsPrompt": "Wklej swój ciąg ustawień Mirage UI:", "importError": "Nieprawidłowy format ustawień. Import nie powiódł się.", "resetToDefaults": "Resetuj do Domyślnych", "language": "Język", "primary": "Główny", "secondary": "Drugorzędny", "undoPresetLoadTooltip": "Przywróć stan sprzed wczytania ustawienia wstępnego", "presetMirageDefault": "Mirage Domyślny", "presetPureGlass": "Czyste Szkło", "presetMinimalistSolid": "Minimalistyczny Pełny", "dayTab": "☀️ Jasny / Dzień", "nightTab": "🌙 Ciemny / Noc", "generalTab": "⚙️ Ogólne", "resetDaySettings": "Resetuj Ustawienia Dnia", "resetNightSettings": "Resetuj Ustawienia Nocy", "resetGeneralSettings": "Resetuj Ustawienia Ogólne", "saveSettings": "Zapisz Ustawienia", "settingsSaved": "Ustawienia Zapisane!",
        "generateWithAi": "Generuj z AI", "aiPromptPlaceholder": "np. przytulny, ciepły motyw na zimę...", "generate": "Generuj"
    },
    pt: {
        "configTitle": "Configuração do Mirage UI", "livePreview": "Pré-visualização ao Vivo do Mirage", "previewCardTitle": "Pré-visualização do Cartão Mirage", "previewCardContent": "Esta é uma pré-visualização das suas configurações atuais.", "example": "Exemplo", "presets": "Predefinições", "loadPreset": "Carregar Predefinição", "defaultPresets": "Predefinições Padrão", "myPresets": "Minhas Predefinições", "undo": "Desfazer", "deletePreset": "Eliminar \"{presetName}\"", "saveCurrentStyle": "Guardar Estilo Atual", "newPresetPlaceholder": "Nome da nova predefinição...", "save": "Guardar", "theme": "Tema", "mode": "Modo", "light": "Claro", "dark": "Escuro", "cardStyle": "Estilo do Cartão", "glass": "Vidro", "solid": "Sólido", "paper": "Papel", "floating": "Flutuante", "blurIntensity": "Intensidade do Desfoque", "transparency": "Transparência", "cardColor": "Cor de Fundo do Cartão", "opacity": "Opacidade", "appearance": "Aparência", "borderRadius": "Raio da Borda", "borderWidth": "Largura da Borda", "separatorWidth": "Largura do Separador", "cardTextColor": "Cor do Texto do Cartão", "auto": "Auto", "fontStyle": "Estilo da Fonte", "system": "Sistema", "serif": "Serif", "mono": "Mono", "animations": "Animações", "colors": "Cores", "accentColor": "Cor de Destaque", "temperature": "Temperatura", "weather": "Tempo", "humidity": "Humidade", "door": "Porta", "pageBackground": "Fundo da Página", "backgroundImage": "Imagem de Fundo", "backgroundColor": "Cor de Fundo", "uploadImage": "Carregar Imagem", "localImageSelected": "Imagem Local Selecionada", "change": "Alterar", "clear": "Limpar", "bgNote": "Nota: Uma imagem carregada terá sempre precedência sobre a cor de fundo da página.", "advanced": "Avançado", "export": "Exportar", "import": "Importar", "settingsCopied": "Configurações copiadas para a área de transferência!", "pasteSettingsPrompt": "Cole a sua cadeia de configurações do Mirage UI:", "importError": "Formato de configurações inválido. Não foi possível importar.", "resetToDefaults": "Repor Padrões", "language": "Idioma", "primary": "Primário", "secondary": "Secundário", "undoPresetLoadTooltip": "Reverter para o estado anterior ao carregamento da predefinição", "presetMirageDefault": "Mirage Padrão", "presetPureGlass": "Vidro Puro", "presetMinimalistSolid": "Sólido Minimalista", "dayTab": "☀️ Claro / Dia", "nightTab": "🌙 Escuro / Noite", "generalTab": "⚙️ Geral", "resetDaySettings": "Repor Configurações de Dia", "resetNightSettings": "Repor Configurações de Noite", "resetGeneralSettings": "Repor Configurações Gerais", "saveSettings": "Guardar Configurações", "settingsSaved": "Configurações Guardadas!",
        "generateWithAi": "Gerar com IA", "aiPromptPlaceholder": "ex: um tema acolhedor e quente para o inverno...", "generate": "Gerar"
    }
};

interface SettingsProviderProps {
  children: React.ReactNode;
  haConnection?: HAConnection;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children, haConnection }) => {
    const [settings, setSettings] = useState<SettingsState | null>(null);
    const [theme, setTheme] = useState<Theme>('dark');
    const [activeEditMode, setActiveEditMode] = useState<EditMode>('night');
    const [presets, setPresets] = useState<Preset[]>([]);
    const [haLanguage, setHaLanguage] = useState<string>('en');

    useEffect(() => {
        const fetchSettingsAndLanguage = async () => {
            if (haConnection) {
                const [fetchedSettings, lang] = await Promise.all([
                    haConnection.getSettings(),
                    haConnection.getLanguage(),
                ]);
                
                const merged = {
                    day: { ...DEFAULTS.day, ...(fetchedSettings.day || {}) },
                    night: { ...DEFAULTS.night, ...(fetchedSettings.night || {}) },
                    general: { ...DEFAULTS.general, ...(fetchedSettings.general || {}) },
                };
                setSettings(merged);
                setHaLanguage(lang);

            } else {
                // Fallback for standalone preview
                setSettings(DEFAULTS);
                // Attempt to use browser language for preview
                const browserLang = navigator.language.split('-')[0];
                setHaLanguage(translationsMap[browserLang] ? browserLang : 'en');
            }
        };
        fetchSettingsAndLanguage();
    }, [haConnection]);
    
    const t = useCallback((key: string, replacements?: { [key: string]: string }): string => {
        const lang = haLanguage.split('-')[0]; // Use base language (e.g., 'de' from 'de-DE')
        const translations = translationsMap[lang] || translationsMap.en;
        let translation = translations[key] || key;
        if (replacements) {
            Object.entries(replacements).forEach(([placeholder, value]) => {
                translation = translation.replace(`{${placeholder}}`, value);
            });
        }
        return translation;
    }, [haLanguage]);
    
    const DEFAULT_PRESETS: Preset[] = useMemo(() => {
        const nameMap: { [key: string]: string } = {
            'mirage_default': 'presetMirageDefault',
            'pure_glass': 'presetPureGlass',
            'minimalist_solid': 'presetMinimalistSolid'
        };
        return DEFAULT_PRESETS_STRUCTURE.map(p => ({
            ...p,
            name: t(nameMap[p.key]),
        }));
    }, [t]);

     useEffect(() => {
        try {
            // For now, presets are still managed in local storage as they are user-specific
            const storedPresets = localStorage.getItem('mirage_custom_presets');
            let customPresets = storedPresets ? JSON.parse(storedPresets) : [];
            customPresets = customPresets.map((p: any) => ({ ...p, key: p.key || p.name }));
            setPresets([...DEFAULT_PRESETS, ...customPresets]);
        } catch (error) {
            console.error("Failed to parse presets from localStorage", error);
            setPresets([...DEFAULT_PRESETS]);
        }
    }, [DEFAULT_PRESETS]);

    const updateActiveThemeConfig = useCallback((key: keyof ThemeConfig, value: any) => {
        if (!settings) return;
        setSettings(prev => prev ? ({
            ...prev,
            [activeEditMode]: {
                ...prev[activeEditMode],
                [key]: value
            }
        }) : null);
    }, [activeEditMode, settings]);

    const updateGeneralSetting = useCallback((key: keyof GeneralSettings, value: any) => {
        if (!settings) return;
        setSettings(prev => prev ? ({
            ...prev,
            general: {
                ...prev.general,
                [key]: value
            }
        }) : null);
    }, [settings]);
    
    const applyPreset = useCallback((preset: Preset) => {
        if (!settings) return;
        setSettings(prev => {
            if (!prev) return null;
            const newSettings = { ...prev };
            if (preset.settings.day) {
                newSettings.day = { ...prev.day, ...preset.settings.day };
            }
            if (preset.settings.night) {
                newSettings.night = { ...prev.night, ...preset.settings.night };
            }
            if (preset.settings.general) {
                newSettings.general = { ...prev.general, ...preset.settings.general };
            }
            return newSettings;
        });
    }, [settings]);
    
    const resetSettings = useCallback((mode: 'day' | 'night' | 'general' | 'all') => {
        if (mode === 'all') {
            setSettings(DEFAULTS);
        } else {
            setSettings(prev => prev ? ({
                ...prev,
                [mode]: DEFAULTS[mode]
            }) : null);
        }
    }, []);

    const savePreset = (name: string) => {
      if (!settings) return;
      const trimmedName = name.trim();
      const newPreset: Preset = { key: trimmedName, name: trimmedName, settings: { day: settings.day, night: settings.night, general: settings.general } };
      const customPresets = presets.filter(p => !p.isDefault);
      const existingIndex = customPresets.findIndex(p => p.key === trimmedName);
      
      if (existingIndex > -1) {
        customPresets[existingIndex] = newPreset;
      } else {
        customPresets.push(newPreset);
      }
      
      setPresets([...DEFAULT_PRESETS, ...customPresets]);
      localStorage.setItem('mirage_custom_presets', JSON.stringify(customPresets.map(({key, name, settings}) => ({key, name, settings}))));
    };

    const deletePreset = (key: string) => {
        const newPresets = presets.filter(p => p.key !== key && !p.isDefault);
        setPresets([...DEFAULT_PRESETS, ...newPresets]);
        localStorage.setItem('mirage_custom_presets', JSON.stringify(newPresets.map(({key, name, settings}) => ({key, name, settings}))));
    };

    const exportSettings = () => {
      if (!settings) return "";
      return JSON.stringify(settings, null, 2);
    };

    const importSettings = (settingsString: string) => {
      try {
        const imported = JSON.parse(settingsString);
        if (typeof imported === 'object' && imported !== null && 'day' in imported && 'night' in imported) {
          setSettings(prev => prev ? ({
              day: { ...prev.day, ...imported.day },
              night: { ...prev.night, ...imported.night },
              general: { ...prev.general, ...imported.general },
          }) : null);
          return true;
        }
        return false;
      } catch (e) {
        console.error("Failed to import settings:", e);
        return false;
      }
    };
    
    const saveSettingsToHA = async () => {
        if (haConnection && settings) {
            await haConnection.updateSettings(settings);
        }
    };

    const uploadBackgroundImage = async (file: File): Promise<string | null> => {
        if (haConnection) {
            try {
                const result = await haConnection.uploadImage(file);
                return result.url;
            } catch (error) {
                console.error("Upload failed:", error);
                alert(`Upload failed: ${error}`);
                return null;
            }
        }
        // Fallback for standalone preview: use local blob URL
        return URL.createObjectURL(file);
    };

    // Apply CSS variables to the root element whenever a setting changes.
    useEffect(() => {
        if (!settings) return;
        const root = document.documentElement;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        
        const activeConfig = theme === 'dark' ? settings.night : settings.day;
        
        root.style.setProperty('--mirage-accent-color', activeConfig.accentColor);
        root.style.setProperty('--mirage-temperature-color', activeConfig.temperatureColor || activeConfig.accentColor);
        root.style.setProperty('--mirage-weather-color', activeConfig.weatherColor || activeConfig.accentColor);
        root.style.setProperty('--mirage-humidity-color', activeConfig.humidityColor || activeConfig.accentColor);
        root.style.setProperty('--mirage-door-color', activeConfig.doorColor || activeConfig.accentColor);
        
        root.style.setProperty('--mirage-primary-text-color', activeConfig.pageTextColor.primary);
        root.style.setProperty('--mirage-secondary-text-color', activeConfig.pageTextColor.secondary);
        
        let effectiveCardTextColorMode = activeConfig.cardTextColorMode;
        if (effectiveCardTextColorMode === 'auto') {
            effectiveCardTextColorMode = theme === 'dark' ? 'light' : 'dark';
        }
        const cardText = effectiveCardTextColorMode === 'light' ? DEFAULTS.night.pageTextColor : DEFAULTS.day.pageTextColor;

        root.style.setProperty('--mirage-card-primary-text-color', cardText.primary);
        root.style.setProperty('--mirage-card-secondary-text-color', cardText.secondary);

        root.style.setProperty('--mirage-border-radius', `${activeConfig.borderRadius}px`);
        root.style.setProperty('--mirage-border-width', `${activeConfig.borderThickness}px`);
        root.style.setProperty('--mirage-separator-width', `${activeConfig.separatorThickness}px`);

        // Glass Style
        const glassAlpha = activeConfig.transparency / 100;
        root.style.setProperty('--mirage-glass-blur', `blur(${activeConfig.blurIntensity}px)`);
        root.style.setProperty('--mirage-glass-bg-color-dark', `rgba(86, 94, 88, ${glassAlpha * 1.8})`);
        root.style.setProperty('--mirage-glass-bg-color-light', `rgba(240, 242, 240, ${glassAlpha * 2})`);
        root.style.setProperty('--mirage-glass-border-color-dark', 'rgba(255, 255, 255, 0.15)');
        root.style.setProperty('--mirage-glass-border-color-light', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--mirage-glass-shadow-dark', `0 8px 24px rgba(0,0,0,0.3)`);
        root.style.setProperty('--mirage-glass-shadow-light', `0 8px 24px rgba(0,0,0,0.1)`);
        
        // Solid Style
        root.style.setProperty('--mirage-solid-bg-color-dark', settings.night.solidColor);
        root.style.setProperty('--mirage-solid-bg-color-light', settings.day.solidColor);
        root.style.setProperty('--mirage-solid-border-color-dark', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--mirage-solid-border-color-light', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--mirage-solid-shadow-dark', `0 2px 8px rgba(0,0,0,0.3)`);
        root.style.setProperty('--mirage-solid-shadow-light', `0 2px 8px rgba(0,0,0,0.08)`);
        
        // Paper Style
        root.style.setProperty('--mirage-paper-bg-color-dark', settings.night.paperColor);
        root.style.setProperty('--mirage-paper-bg-color-light', settings.day.paperColor);
        root.style.setProperty('--mirage-paper-border-color-dark', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--mirage-paper-border-color-light', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--mirage-paper-shadow-dark', `0 6px 16px rgba(0,0,0,0.5)`);
        root.style.setProperty('--mirage-paper-shadow-light', `0 4px 12px rgba(0,0,0,0.1)`);

        // Floating Style
        const floatingAlphaDark = settings.night.floatingOpacity / 100;
        const floatingAlphaLight = settings.day.floatingOpacity / 100;
        root.style.setProperty('--mirage-floating-bg-color-dark', hexToRgba(settings.night.floatingColor, floatingAlphaDark));
        root.style.setProperty('--mirage-floating-bg-color-light', hexToRgba(settings.day.floatingColor, floatingAlphaLight));
        root.style.setProperty('--mirage-floating-shadow-dark', `0 6px 20px rgba(0,0,0,0.3)`);
        root.style.setProperty('--mirage-floating-shadow-light', `0 6px 20px rgba(0,0,0,0.1)`);
        
        root.style.setProperty('--mirage-slider-thumb-bg-color', hexToRgba(activeConfig.accentColor, 0.7));

    }, [theme, settings]);
    
    const activeThemeConfig = useMemo(() => {
        if (!settings) return theme === 'dark' ? DEFAULTS.night : DEFAULTS.day;
        return theme === 'dark' ? settings.night : settings.day;
    }, [theme, settings]);

    if (!settings) {
        return <div>Loading settings...</div>;
    }

    const value: SettingsContextType = {
        theme, 
        setTheme,
        settings,
        activeEditMode,
        setActiveEditMode,
        activeThemeConfig,
        currentTextColors: activeThemeConfig.pageTextColor,
        updateActiveThemeConfig,
        updateGeneralSetting,
        resetSettings,
        t,
        haLanguage,
        setHaLanguage,
        presets, 
        applyPreset, 
        savePreset, 
        deletePreset,
        exportSettings, 
        importSettings,
        saveSettingsToHA,
        uploadBackgroundImage,
        haConnection: haConnection || null,
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};