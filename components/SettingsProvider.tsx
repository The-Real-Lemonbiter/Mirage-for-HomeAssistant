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

// Fix: Export useSettings hook to be used in other components.
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

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
      "configTitle": "Mirage UI Configuration", "livePreview": "Live Preview", "previewCardTitle": "Card Preview",
      "previewCardContent": "This is a preview of your current settings.", "example": "Example", "presets": "Presets",
      "loadPreset": "Load Preset", "defaultPresets": "Default Presets", "myPresets": "My Presets", "undo": "Undo",
      "deletePreset": "Delete \"{presetName}\"", "saveCurrentStyle": "Save as Preset", "newPresetPlaceholder": "New preset name...",
      "save": "Save", "theme": "Theme", "mode": "Mode", "light": "Light", "dark": "Dark", "cardStyle": "Card Style",
      "glass": "Glass", "solid": "Solid", "paper": "Paper", "floating": "Floating", "blurIntensity": "Blur Intensity",
      "transparency": "Transparency", "cardColor": "Card Color", "opacity": "Opacity",
      "appearance": "Appearance", "borderRadius": "Corner Radius", "borderWidth": "Border Width", "separatorWidth": "Separator Width",
      "cardTextColor": "Card Text Color", "auto": "Auto", "fontStyle": "Font Style", "system": "System", "serif": "Serif",
      "mono": "Mono", "animations": "Animations", "colors": "Colors", "accentColor": "Accent Color",
      "temperature": "Temperature", "weather": "Weather", "humidity": "Humidity", "door": "Door", "pageBackground": "Page Background",
      "backgroundImage": "Background Image", "backgroundColor": "Background Color",
      "uploadImage": "Upload Image", "localImageSelected": "Local Image Selected", "change": "Change", "clear": "Remove",
      "bgNote": "Note: An uploaded image will always take precedence over a page background color.", "advanced": "Advanced",
      "export": "Export", "import": "Import", "settingsCopied": "Settings copied to clipboard!",
      "pasteSettingsPrompt": "Paste configuration code:", "importError": "Invalid settings format. Could not import.",
      "resetToDefaults": "Reset to Defaults", "language": "Language", "primary": "Primary", "secondary": "Secondary",
      "undoPresetLoadTooltip": "Revert to state before loading a preset",
      "presetMirageDefault": "Mirage Default", "presetPureGlass": "Pure Glass", "presetMinimalistSolid": "Minimalist Solid",
      "dayTab": "Day", "nightTab": "Night", "generalTab": "General",
      "resetDaySettings": "Reset Day Settings", "resetNightSettings": "Reset Night Settings", "resetGeneralSettings": "Reset General Settings",
      "saveSettings": "Save Settings", "settingsSaved": "Settings Saved!",
      "brightness": "Brightness", "color": "Color", "effect": "Effect"
    },
    de: {
      "configTitle": "Mirage UI Konfiguration", "livePreview": "Live-Vorschau", "previewCardTitle": "Kartenvorschau",
      "previewCardContent": "Dies ist eine Vorschau Ihrer aktuellen Einstellungen.", "example": "Beispiel", "presets": "Vorgaben",
      "loadPreset": "Vorgabe laden", "defaultPresets": "Standardvorgaben", "myPresets": "Meine Vorgaben", "undo": "Rückgängig",
      "deletePreset": "\"{presetName}\" löschen", "saveCurrentStyle": "Als Vorgabe speichern", "newPresetPlaceholder": "Name der neuen Vorgabe...",
      "save": "Speichern", "theme": "Theme", "mode": "Modus", "light": "Hell", "dark": "Dunkel", "cardStyle": "Kartenstil",
      "glass": "Glas", "solid": "Deckend", "paper": "Papier", "floating": "Schwebend", "blurIntensity": "Unschärfe",
      "transparency": "Transparenz", "cardColor": "Kartenfarbe", "opacity": "Deckkraft",
      "appearance": "Erscheinungsbild", "borderRadius": "Eckenradius", "borderWidth": "Randbreite", "separatorWidth": "Trennerbreite",
      "cardTextColor": "Textfarbe (Karte)", "auto": "Auto", "fontStyle": "Schriftart", "system": "System", "serif": "Serif",
      "mono": "Mono", "animations": "Animationen", "colors": "Farben", "accentColor": "Akzentfarbe",
      "temperature": "Temperatur", "weather": "Wetter", "humidity": "Feuchtigkeit", "door": "Tür", "pageBackground": "Seitenhintergrund",
      "backgroundImage": "Hintergrundbild", "backgroundColor": "Hintergrundfarbe",
      "uploadImage": "Bild hochladen", "localImageSelected": "Lokales Bild ausgewählt", "change": "Ändern", "clear": "Entfernen",
      "bgNote": "Hinweis: Ein hochgeladenes Bild hat immer Vorrang vor einer Hintergrundfarbe.", "advanced": "Erweitert",
      "export": "Exportieren", "import": "Importieren", "settingsCopied": "Einstellungen in die Zwischenablage kopiert!",
      "pasteSettingsPrompt": "Konfigurationscode einfügen:", "importError": "Ungültiges Einstellungsformat. Import fehlgeschlagen.",
      "resetToDefaults": "Auf Standard zurücksetzen", "language": "Sprache", "primary": "Primär", "secondary": "Sekundär",
      "undoPresetLoadTooltip": "Zustand vor dem Laden einer Vorgabe wiederherstellen",
      "presetMirageDefault": "Mirage Standard", "presetPureGlass": "Reines Glas", "presetMinimalistSolid": "Minimalistisch Deckend",
      "dayTab": "Tag", "nightTab": "Nacht", "generalTab": "Allgemein",
      "resetDaySettings": "Tag-Einstellungen zurücksetzen", "resetNightSettings": "Nacht-Einstellungen zurücksetzen", "resetGeneralSettings": "Allgemeine Einstellungen zurücksetzen",
      "saveSettings": "Einstellungen speichern", "settingsSaved": "Einstellungen gespeichert!",
      "brightness": "Helligkeit", "color": "Farbe", "effect": "Effekt"
    },
    fr: {
      "configTitle": "Configuration de Mirage UI", "livePreview": "Aperçu en direct", "previewCardTitle": "Aperçu de la carte",
      "previewCardContent": "Ceci est un aperçu de vos paramètres actuels.", "example": "Exemple", "presets": "Préréglages",
      "loadPreset": "Charger un préréglage", "defaultPresets": "Préréglages par défaut", "myPresets": "Mes préréglages", "undo": "Annuler",
      "deletePreset": "Supprimer \"{presetName}\"", "saveCurrentStyle": "Enregistrer comme préréglage", "newPresetPlaceholder": "Nom du nouveau préréglage...",
      "save": "Enregistrer", "theme": "Thème", "mode": "Mode", "light": "Clair", "dark": "Sombre", "cardStyle": "Style de carte",
      "glass": "Verre", "solid": "Solide", "paper": "Papier", "floating": "Flottant", "blurIntensity": "Intensité du flou",
      "transparency": "Transparence", "cardColor": "Couleur de la carte", "opacity": "Opacité",
      "appearance": "Apparence", "borderRadius": "Rayon des coins", "borderWidth": "Largeur de bordure", "separatorWidth": "Largeur du séparateur",
      "cardTextColor": "Couleur du texte", "auto": "Auto", "fontStyle": "Police", "system": "Système", "serif": "Serif",
      "mono": "Mono", "animations": "Animations", "colors": "Couleurs", "accentColor": "Couleur d'accent",
      "temperature": "Température", "weather": "Météo", "humidity": "Humidité", "door": "Porte", "pageBackground": "Arrière-plan",
      "backgroundImage": "Image de fond", "backgroundColor": "Couleur de fond",
      "uploadImage": "Télécharger une image", "localImageSelected": "Image locale sélectionnée", "change": "Changer", "clear": "Retirer",
      "bgNote": "Note : Une image téléchargée prévaudra toujours sur une couleur de fond.", "advanced": "Avancé",
      "export": "Exporter", "import": "Importer", "settingsCopied": "Paramètres copiés dans le presse-papiers !",
      "pasteSettingsPrompt": "Collez le code de configuration :", "importError": "Format des paramètres invalide. Importation impossible.",
      "resetToDefaults": "Réinitialiser", "language": "Langue", "primary": "Primaire", "secondary": "Secondaire",
      "undoPresetLoadTooltip": "Revenir à l'état avant de charger un préréglage",
      "presetMirageDefault": "Mirage par défaut", "presetPureGlass": "Verre Pur", "presetMinimalistSolid": "Solide Minimaliste",
      "dayTab": "Jour", "nightTab": "Nuit", "generalTab": "Général",
      "resetDaySettings": "Réinitialiser les paramètres de jour", "resetNightSettings": "Réinitialiser les paramètres de nuit", "resetGeneralSettings": "Réinitialiser les paramètres généraux",
      "saveSettings": "Enregistrer les paramètres", "settingsSaved": "Paramètres enregistrés !",
      "brightness": "Luminosité", "color": "Couleur", "effect": "Effet"
    },
    nl: {
      "configTitle": "Mirage UI Configuratie", "livePreview": "Live Voorbeeld", "previewCardTitle": "Kaartvoorbeeld",
      "previewCardContent": "Dit is een voorbeeld van uw huidige instellingen.", "example": "Voorbeeld", "presets": "Voorinstellingen",
      "loadPreset": "Voorinstelling laden", "defaultPresets": "Standaard Voorinstellingen", "myPresets": "Mijn Voorinstellingen", "undo": "Ongedaan maken",
      "deletePreset": "\"{presetName}\" verwijderen", "saveCurrentStyle": "Opslaan als Voorinstelling", "newPresetPlaceholder": "Nieuwe naam voorinstelling...",
      "save": "Opslaan", "theme": "Thema", "mode": "Modus", "light": "Licht", "dark": "Donker", "cardStyle": "Kaartstijl",
      "glass": "Glas", "solid": "Solide", "paper": "Papier", "floating": "Zwevend", "blurIntensity": "Vervaging",
      "transparency": "Transparantie", "cardColor": "Kaartkleur", "opacity": "Dekking",
      "appearance": "Uiterlijk", "borderRadius": "Hoekradius", "borderWidth": "Randbreedte", "separatorWidth": "Scheidingsbreedte",
      "cardTextColor": "Tekstkleur Kaart", "auto": "Auto", "fontStyle": "Lettertype", "system": "Systeem", "serif": "Serif",
      "mono": "Mono", "animations": "Animaties", "colors": "Kleuren", "accentColor": "Accentkleur",
      "temperature": "Temperatuur", "weather": "Weer", "humidity": "Vochtigheid", "door": "Deur", "pageBackground": "Achtergrond",
      "backgroundImage": "Achtergrondafbeelding", "backgroundColor": "Achtergrondkleur",
      "uploadImage": "Afbeelding uploaden", "localImageSelected": "Lokale afbeelding geselecteerd", "change": "Wijzigen", "clear": "Verwijderen",
      "bgNote": "Let op: Een geüploade afbeelding heeft altijd voorrang op een achtergrondkleur.", "advanced": "Geavanceerd",
      "export": "Exporteren", "import": "Importeren", "settingsCopied": "Instellingen gekopieerd naar klembord!",
      "pasteSettingsPrompt": "Plak configuratiecode:", "importError": "Ongeldig instellingenformaat. Importeren mislukt.",
      "resetToDefaults": "Standaardinstellingen herstellen", "language": "Taal", "primary": "Primair", "secondary": "Secundair",
      "undoPresetLoadTooltip": "Terugkeren naar staat voor het laden van een voorinstelling",
      "presetMirageDefault": "Mirage Standaard", "presetPureGlass": "Puur Glas", "presetMinimalistSolid": "Minimalistisch Solide",
      "dayTab": "Dag", "nightTab": "Nacht", "generalTab": "Algemeen",
      "resetDaySettings": "Daginstellingen herstellen", "resetNightSettings": "Nachtinstellingen herstellen", "resetGeneralSettings": "Algemene instellingen herstellen",
      "saveSettings": "Instellingen opslaan", "settingsSaved": "Instellingen opgeslagen!",
      "brightness": "Helderheid", "color": "Kleur", "effect": "Effect"
    },
    es: {
      "configTitle": "Configuración de Mirage UI", "livePreview": "Vista Previa", "previewCardTitle": "Vista de Tarjeta",
      "previewCardContent": "Esta es una vista previa de su configuración actual.", "example": "Ejemplo", "presets": "Preajustes",
      "loadPreset": "Cargar Preajuste", "defaultPresets": "Preajustes Predeterminados", "myPresets": "Mis Preajustes", "undo": "Deshacer",
      "deletePreset": "Eliminar \"{presetName}\"", "saveCurrentStyle": "Guardar como Preajuste", "newPresetPlaceholder": "Nombre del nuevo preajuste...",
      "save": "Guardar", "theme": "Tema", "mode": "Modo", "light": "Claro", "dark": "Oscuro", "cardStyle": "Estilo de Tarjeta",
      "glass": "Cristal", "solid": "Sólido", "paper": "Papel", "floating": "Flotante", "blurIntensity": "Intensidad de Desenfoque",
      "transparency": "Transparencia", "cardColor": "Color de Tarjeta", "opacity": "Opacidad",
      "appearance": "Apariencia", "borderRadius": "Radio de Esquina", "borderWidth": "Ancho de Borde", "separatorWidth": "Ancho del Separador",
      "cardTextColor": "Color del Texto", "auto": "Auto", "fontStyle": "Fuente", "system": "Sistema", "serif": "Serif",
      "mono": "Mono", "animations": "Animaciones", "colors": "Colores", "accentColor": "Color de Acento",
      "temperature": "Temperatura", "weather": "Clima", "humidity": "Humedad", "door": "Puerta", "pageBackground": "Fondo de Página",
      "backgroundImage": "Imagen de Fondo", "backgroundColor": "Color de Fondo",
      "uploadImage": "Subir Imagen", "localImageSelected": "Imagen Local Seleccionada", "change": "Cambiar", "clear": "Quitar",
      "bgNote": "Nota: Una imagen subida siempre tendrá prioridad sobre el color de fondo.", "advanced": "Avanzado",
      "export": "Exportar", "import": "Importar", "settingsCopied": "¡Configuración copiada al portapapeles!",
      "pasteSettingsPrompt": "Pegue el código de configuración:", "importError": "Formato de configuración no válido. No se pudo importar.",
      "resetToDefaults": "Restablecer a Valores Predeterminados", "language": "Idioma", "primary": "Primario", "secondary": "Secundario",
      "undoPresetLoadTooltip": "Revertir al estado anterior a cargar un preajuste",
      "presetMirageDefault": "Mirage Predeterminado", "presetPureGlass": "Cristal Puro", "presetMinimalistSolid": "Sólido Minimalista",
      "dayTab": "Día", "nightTab": "Noche", "generalTab": "General",
      "resetDaySettings": "Restablecer Ajustes de Día", "resetNightSettings": "Restablecer Ajustes de Noche", "resetGeneralSettings": "Restablecer Ajustes Generales",
      "saveSettings": "Guardar Ajustes", "settingsSaved": "¡Ajustes Guardados!",
      "brightness": "Brillo", "color": "Color", "effect": "Efecto"
    },
    it: {
      "configTitle": "Configurazione Mirage UI", "livePreview": "Anteprima Live", "previewCardTitle": "Anteprima Scheda",
      "previewCardContent": "Questa è un'anteprima delle impostazioni correnti.", "example": "Esempio", "presets": "Predefiniti",
      "loadPreset": "Carica Predefinito", "defaultPresets": "Predefiniti di Default", "myPresets": "I Miei Predefiniti", "undo": "Annulla",
      "deletePreset": "Elimina \"{presetName}\"", "saveCurrentStyle": "Salva come Predefinito", "newPresetPlaceholder": "Nome nuovo predefinito...",
      "save": "Salva", "theme": "Tema", "mode": "Modalità", "light": "Chiaro", "dark": "Scuro", "cardStyle": "Stile Scheda",
      "glass": "Vetro", "solid": "Solido", "paper": "Carta", "floating": "Fluttuante", "blurIntensity": "Intensità Sfocatura",
      "transparency": "Trasparenza", "cardColor": "Colore Scheda", "opacity": "Opacità",
      "appearance": "Aspetto", "borderRadius": "Raggio Angoli", "borderWidth": "Spessore Bordo", "separatorWidth": "Spessore Separatore",
      "cardTextColor": "Colore Testo", "auto": "Auto", "fontStyle": "Carattere", "system": "Sistema", "serif": "Serif",
      "mono": "Mono", "animations": "Animazioni", "colors": "Colori", "accentColor": "Colore d'Accento",
      "temperature": "Temperatura", "weather": "Meteo", "humidity": "Umidità", "door": "Porta", "pageBackground": "Sfondo Pagina",
      "backgroundImage": "Immagine di Sfondo", "backgroundColor": "Colore di Sfondo",
      "uploadImage": "Carica Immagine", "localImageSelected": "Immagine Locale Selezionata", "change": "Cambia", "clear": "Rimuovi",
      "bgNote": "Nota: Un'immagine caricata avrà sempre la precedenza sul colore di sfondo.", "advanced": "Avanzate",
      "export": "Esporta", "import": "Importa", "settingsCopied": "Impostazioni copiate negli appunti!",
      "pasteSettingsPrompt": "Incolla codice di configurazione:", "importError": "Formato impostazioni non valido. Impossibile importare.",
      "resetToDefaults": "Ripristina Predefiniti", "language": "Lingua", "primary": "Primario", "secondary": "Secondario",
      "undoPresetLoadTooltip": "Torna allo stato precedente al caricamento di un predefinito",
      "presetMirageDefault": "Mirage Default", "presetPureGlass": "Vetro Puro", "presetMinimalistSolid": "Solido Minimalista",
      "dayTab": "Giorno", "nightTab": "Notte", "generalTab": "Generale",
      "resetDaySettings": "Ripristina Impostazioni Giorno", "resetNightSettings": "Ripristina Impostazioni Notte", "resetGeneralSettings": "Ripristina Impostazioni Generali",
      "saveSettings": "Salva Impostazioni", "settingsSaved": "Impostazioni Salvate!",
      "brightness": "Luminosità", "color": "Colore", "effect": "Effetto"
    },
    pl: {
      "configTitle": "Konfiguracja Mirage UI", "livePreview": "Podgląd na Żywo", "previewCardTitle": "Podgląd Karty",
      "previewCardContent": "To jest podgląd twoich bieżących ustawień.", "example": "Przykład", "presets": "Ustawienia",
      "loadPreset": "Wczytaj Ustawienie", "defaultPresets": "Domyślne Ustawienia", "myPresets": "Moje Ustawienia", "undo": "Cofnij",
      "deletePreset": "Usuń \"{presetName}\"", "saveCurrentStyle": "Zapisz jako Ustawienie", "newPresetPlaceholder": "Nazwa nowego ustawienia...",
      "save": "Zapisz", "theme": "Motyw", "mode": "Tryb", "light": "Jasny", "dark": "Ciemny", "cardStyle": "Styl Karty",
      "glass": "Szkło", "solid": "Pełny", "paper": "Papier", "floating": "Pływający", "blurIntensity": "Intensywność Rozmycia",
      "transparency": "Przezroczystość", "cardColor": "Kolor Karty", "opacity": "Nieprzezroczystość",
      "appearance": "Wygląd", "borderRadius": "Promień Narożnika", "borderWidth": "Szerokość Ramki", "separatorWidth": "Szerokość Separatora",
      "cardTextColor": "Kolor Tekstu", "auto": "Auto", "fontStyle": "Czcionka", "system": "Systemowa", "serif": "Szeryfowa",
      "mono": "Mono", "animations": "Animacje", "colors": "Kolory", "accentColor": "Kolor Akcentu",
      "temperature": "Temperatura", "weather": "Pogoda", "humidity": "Wilgotność", "door": "Drzwi", "pageBackground": "Tło Strony",
      "backgroundImage": "Obraz Tła", "backgroundColor": "Kolor Tła",
      "uploadImage": "Prześlij Obraz", "localImageSelected": "Wybrano Lokalny Obraz", "change": "Zmień", "clear": "Usuń",
      "bgNote": "Uwaga: Przesłany obraz zawsze będzie miał pierwszeństwo przed kolorem tła.", "advanced": "Zaawansowane",
      "export": "Eksportuj", "import": "Importuj", "settingsCopied": "Ustawienia skopiowane do schowka!",
      "pasteSettingsPrompt": "Wklej kod konfiguracji:", "importError": "Nieprawidłowy format ustawień. Import nie powiódł się.",
      "resetToDefaults": "Resetuj do Domyślnych", "language": "Język", "primary": "Główny", "secondary": "Pomocniczy",
      "undoPresetLoadTooltip": "Cofnij do stanu przed wczytaniem ustawienia",
      "presetMirageDefault": "Domyślny Mirage", "presetPureGlass": "Czyste Szkło", "presetMinimalistSolid": "Pełny Minimalistyczny",
      "dayTab": "Dzień", "nightTab": "Noc", "generalTab": "Ogólne",
      "resetDaySettings": "Resetuj Ustawienia Dnia", "resetNightSettings": "Resetuj Ustawienia Nocy", "resetGeneralSettings": "Resetuj Ustawienia Ogólne",
      "saveSettings": "Zapisz Ustawienia", "settingsSaved": "Ustawienia Zapisane!",
      "brightness": "Jasność", "color": "Kolor", "effect": "Efekt"
    },
    pt: {
      "configTitle": "Configuração do Mirage UI", "livePreview": "Pré-visualização", "previewCardTitle": "Pré-visualização do Cartão",
      "previewCardContent": "Esta é uma pré-visualização das suas configurações atuais.", "example": "Exemplo", "presets": "Predefinições",
      "loadPreset": "Carregar Predefinição", "defaultPresets": "Predefinições Padrão", "myPresets": "Minhas Predefinições", "undo": "Desfazer",
      "deletePreset": "Apagar \"{presetName}\"", "saveCurrentStyle": "Salvar como Predefinição", "newPresetPlaceholder": "Nome da nova predefinição...",
      "save": "Salvar", "theme": "Tema", "mode": "Modo", "light": "Claro", "dark": "Escuro", "cardStyle": "Estilo do Cartão",
      "glass": "Vidro", "solid": "Sólido", "paper": "Papel", "floating": "Flutuante", "blurIntensity": "Intensidade do Desfoque",
      "transparency": "Transparência", "cardColor": "Cor do Cartão", "opacity": "Opacidade",
      "appearance": "Aparência", "borderRadius": "Raio do Canto", "borderWidth": "Largura da Borda", "separatorWidth": "Largura do Separador",
      "cardTextColor": "Cor do Texto", "auto": "Auto", "fontStyle": "Fonte", "system": "Sistema", "serif": "Serif",
      "mono": "Mono", "animations": "Animações", "colors": "Cores", "accentColor": "Cor de Destaque",
      "temperature": "Temperatura", "weather": "Tempo", "humidity": "Umidade", "door": "Porta", "pageBackground": "Fundo da Página",
      "backgroundImage": "Imagem de Fundo", "backgroundColor": "Cor de Fundo",
      "uploadImage": "Carregar Imagem", "localImageSelected": "Imagem Local Selecionada", "change": "Mudar", "clear": "Remover",
      "bgNote": "Nota: Uma imagem carregada terá sempre precedência sobre a cor de fundo da página.", "advanced": "Avançado",
      "export": "Exportar", "import": "Importar", "settingsCopied": "Configurações copiadas para a área de transferência!",
      "pasteSettingsPrompt": "Cole o código de configuração:", "importError": "Formato de configurações inválido. Não foi possível importar.",
      "resetToDefaults": "Repor Predefinições", "language": "Idioma", "primary": "Primário", "secondary": "Secundário",
      "undoPresetLoadTooltip": "Reverter para o estado anterior ao carregamento de uma predefinição",
      "presetMirageDefault": "Mirage Padrão", "presetPureGlass": "Vidro Puro", "presetMinimalistSolid": "Sólido Minimalista",
      "dayTab": "Dia", "nightTab": "Noite", "generalTab": "Geral",
      "resetDaySettings": "Repor Configurações de Dia", "resetNightSettings": "Repor Configurações de Noite", "resetGeneralSettings": "Repor Configurações Gerais",
      "saveSettings": "Salvar Configurações", "settingsSaved": "Configurações Salvas!",
      "brightness": "Brilho", "color": "Cor", "effect": "Efeito"
    }
};

interface SettingsProviderProps {
  children: React.ReactNode;
  haConnection?: HAConnection;
}

// FIX: The component was not returning a JSX element, causing a type error. The original file was also truncated.
// This completed version implements all necessary logic and provides a valid return value.
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
            const storedPresets = localStorage.getItem('mirage_presets');
            if (storedPresets) {
                const customPresets = JSON.parse(storedPresets);
                setPresets([...DEFAULT_PRESETS, ...customPresets]);
            } else {
                setPresets(DEFAULT_PRESETS);
            }
        } catch (e) {
            console.error("Could not parse presets from local storage", e);
            setPresets(DEFAULT_PRESETS);
        }
    }, [DEFAULT_PRESETS]);

    useEffect(() => {
        // Keep edit mode in sync with the current theme
        setActiveEditMode(theme === 'light' ? 'day' : 'night');
    }, [theme]);
    
    const activeThemeConfig = useMemo((): ThemeConfig => {
        if (!settings) return DEFAULTS[activeEditMode];
        return settings[activeEditMode];
    }, [settings, activeEditMode]);

    const LIGHT_TEXT: TextColors = { primary: '#1f2937', secondary: '#4b5563' };
    const DARK_TEXT: TextColors = { primary: '#e5e7eb', secondary: '#9ca3af' };
    
    const currentTextColors = useMemo((): TextColors => {
        if (!settings) return theme === 'dark' ? DARK_TEXT : LIGHT_TEXT;
        return settings[theme === 'light' ? 'day' : 'night'].pageTextColor;
    }, [settings, theme]);

    const updateActiveThemeConfig = useCallback((key: keyof ThemeConfig, value: any) => {
        setSettings(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [activeEditMode]: {
                    ...prev[activeEditMode],
                    [key]: value,
                },
            };
        });
    }, [activeEditMode]);

    const updateGeneralSetting = useCallback((key: keyof GeneralSettings, value: any) => {
        setSettings(prev => {
            if (!prev) return null;
            return {
                ...prev,
                general: {
                    ...prev.general,
                    [key]: value,
                },
            };
        });
    }, []);
    
    const resetSettings = useCallback((mode: 'day' | 'night' | 'general' | 'all') => {
        setSettings(prev => {
            if (!prev) return DEFAULTS;
            const newSettings = { ...prev };
            if (mode === 'day' || mode === 'all') newSettings.day = DEFAULTS.day;
            if (mode === 'night' || mode === 'all') newSettings.night = DEFAULTS.night;
            if (mode === 'general' || mode === 'all') newSettings.general = DEFAULTS.general;
            return newSettings;
        });
    }, []);
    
    const applyPreset = useCallback((preset: Preset) => {
        setSettings(prev => {
            if (!prev) return null;
            const newSettings = {
                day: { ...prev.day, ...(preset.settings.day || {}) },
                night: { ...prev.night, ...(preset.settings.night || {}) },
                general: { ...prev.general, ...(preset.settings.general || {}) },
            };
            return newSettings;
        });
    }, []);

    const savePreset = useCallback((name: string) => {
        if (!settings) return;
        const newPreset: Preset = {
            key: `custom_${Date.now()}`,
            name,
            settings: {
                day: settings.day,
                night: settings.night,
                general: settings.general,
            },
        };
        const customPresets = presets.filter(p => !p.isDefault);
        const newCustomPresets = [...customPresets, newPreset];
        localStorage.setItem('mirage_presets', JSON.stringify(newCustomPresets));
        setPresets([...DEFAULT_PRESETS, ...newCustomPresets]);
    }, [settings, presets, DEFAULT_PRESETS]);

    const deletePreset = useCallback((key: string) => {
        const newCustomPresets = presets.filter(p => !p.isDefault && p.key !== key);
        localStorage.setItem('mirage_presets', JSON.stringify(newCustomPresets));
        setPresets([...DEFAULT_PRESETS, ...newCustomPresets]);
    }, [presets, DEFAULT_PRESETS]);

    const exportSettings = useCallback((): string => {
        return settings ? JSON.stringify(settings, null, 2) : '';
    }, [settings]);

    const importSettings = useCallback((settingsString: string): boolean => {
        try {
            const imported = JSON.parse(settingsString);
            if (imported.day && imported.night && imported.general) {
                const merged = {
                    day: { ...DEFAULTS.day, ...imported.day },
                    night: { ...DEFAULTS.night, ...imported.night },
                    general: { ...DEFAULTS.general, ...imported.general },
                };
                setSettings(merged);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Failed to import settings", e);
            return false;
        }
    }, []);

    const saveSettingsToHA = useCallback(async () => {
        if (haConnection && settings) {
            await haConnection.updateSettings(settings);
        }
    }, [haConnection, settings]);

    const uploadBackgroundImage = useCallback(async (file: File): Promise<string | null> => {
        if (haConnection) {
            try {
                const { url } = await haConnection.uploadImage(file);
                return url;
            } catch (e) {
                console.error("Image upload failed", e);
                return null;
            }
        }
        return URL.createObjectURL(file);
    }, [haConnection]);

    const value = useMemo(() => ({
        settings, theme, setTheme, activeEditMode, setActiveEditMode, activeThemeConfig,
        currentTextColors, updateActiveThemeConfig, updateGeneralSetting, resetSettings,
        t, haLanguage, setHaLanguage, presets, applyPreset, savePreset, deletePreset,
        exportSettings, importSettings, saveSettingsToHA, uploadBackgroundImage, haConnection
    }), [
        settings, theme, activeEditMode, activeThemeConfig, currentTextColors, updateActiveThemeConfig,
        updateGeneralSetting, resetSettings, t, haLanguage, presets, applyPreset, savePreset,
        deletePreset, exportSettings, importSettings, saveSettingsToHA, uploadBackgroundImage, haConnection
    ]);
    
    useEffect(() => {
        if (!settings) return;

        const config = settings[theme === 'light' ? 'day' : 'night'];
        const root = document.documentElement;
        
        const cardTextColorConfig = settings[config.cardTextColorMode === 'auto' ? (theme === 'light' ? 'day' : 'night') : (config.cardTextColorMode === 'light' ? 'night' : 'day')];

        const variablesToSet = {
            '--mirage-accent-color': config.accentColor,
            '--mirage-border-radius': `${config.borderRadius}px`,
            '--mirage-border-width': `${config.borderThickness}px`,
            '--mirage-separator-width': `${config.separatorThickness}px`,
            '--mirage-card-style': config.cardStyle,

            '--mirage-glass-blur': `blur(${config.blurIntensity}px)`,
            '--mirage-glass-bg-color-dark': hexToRgba(settings.night.solidColor, settings.night.transparency / 100),
            '--mirage-glass-bg-color-light': hexToRgba(settings.day.solidColor, settings.day.transparency / 100),
            '--mirage-glass-border-color-dark': 'rgba(255, 255, 255, 0.1)',
            '--mirage-glass-border-color-light': 'rgba(0, 0, 0, 0.1)',
            '--mirage-glass-shadow-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            '--mirage-glass-shadow-light': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',

            '--mirage-solid-bg-color-dark': settings.night.solidColor,
            '--mirage-solid-bg-color-light': settings.day.solidColor,
            '--mirage-solid-border-color-dark': 'rgba(255, 255, 255, 0.15)',
            '--mirage-solid-border-color-light': 'rgba(0, 0, 0, 0.15)',
            '--mirage-solid-shadow-dark': '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
            '--mirage-solid-shadow-light': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',

            '--mirage-paper-bg-color-dark': settings.night.paperColor,
            '--mirage-paper-bg-color-light': settings.day.paperColor,
            '--mirage-paper-border-color-dark': 'rgba(255, 255, 255, 0.1)',
            '--mirage-paper-border-color-light': 'rgba(0, 0, 0, 0.1)',
            '--mirage-paper-shadow-dark': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            '--mirage-paper-shadow-light': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',

            '--mirage-floating-bg-color-dark': hexToRgba(settings.night.floatingColor, settings.night.floatingOpacity / 100),
            '--mirage-floating-bg-color-light': hexToRgba(settings.day.floatingColor, settings.day.floatingOpacity / 100),
            '--mirage-floating-shadow-dark': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            '--mirage-floating-shadow-light': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',

            '--mirage-card-primary-text-color': cardTextColorConfig.pageTextColor.primary,
            '--mirage-card-secondary-text-color': cardTextColorConfig.pageTextColor.secondary,
        };

        Object.entries(variablesToSet).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                root.style.setProperty(key, value.toString());
            }
        });

    }, [settings, theme]);

    if (!settings) {
        // Render a loading state or null while settings are being fetched
        return null;
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
