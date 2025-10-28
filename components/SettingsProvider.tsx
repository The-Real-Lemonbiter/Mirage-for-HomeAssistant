/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * NOTE ON ARCHITECTURE:
 * This component simulates how settings would be managed in a real Home Assistant environment.
 * All `useState` calls below represent values that would be stored server-side in
 * Home Assistant "helper" entities (e.g., `input_number.mirage_border_radius`, 
 * `input_text.mirage_accent_color`).
 * The localStorage usage here is a stand-in for that server-side persistence.
 */
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import type { Theme, CardStyle, SettingsContextType, TextColors, FontStyle, Preset, SettingsState, CardTextColorMode, Language } from '../types';

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
const DEFAULTS: SettingsState = {
    theme: 'dark',
    cardStyle: 'glass',
    transparency: 30,
    blurIntensity: 20,
    solidColorDark: '#2d3748',
    solidColorLight: '#e2e8f0',
    paperColorDark: '#2a2d35',
    paperColorLight: '#ffffff',
    floatingOpacity: 100,
    floatingColorDark: '#2a323d',
    floatingColorLight: '#ffffff',
    borderThickness: 1,
    separatorThickness: 1,
    borderRadius: 16,
    accentColor: '#3b82f6',
    darkThemeTextColors: {
        primary: '#e5e7eb',
        secondary: '#9ca3af',
    },
    lightThemeTextColors: {
        primary: '#1f2937',
        secondary: '#4b5563',
    },
    cardTextColorMode: 'auto',
    temperatureColor: null,
    weatherColor: null,
    humidityColor: null,
    doorColor: null,
    bgColorDark: '#0d1117',
    bgColorLight: '#f3f4f6',
    customBgDark: null,
    customBgLight: null,
    font: 'system',
    animationsEnabled: true,
    language: 'en',
};

const DEFAULT_PRESETS_STRUCTURE = [
  {
    key: 'mirage_default',
    isDefault: true,
    settings: {
      cardStyle: 'glass',
      transparency: 30,
      blurIntensity: 20,
      borderRadius: 16,
      borderThickness: 1,
      separatorThickness: 1,
      accentColor: '#3b82f6',
      cardTextColorMode: 'auto',
    }
  },
  {
    key: 'pure_glass',
    isDefault: true,
    settings: {
      cardStyle: 'glass',
      transparency: 25,
      blurIntensity: 30,
      borderThickness: 0,
      separatorThickness: 0,
      borderRadius: 24,
      cardTextColorMode: 'light',
    }
  },
  {
    key: 'minimalist_solid',
    isDefault: true,
    settings: {
      cardStyle: 'solid',
      solidColorDark: '#2d3748',
      solidColorLight: '#e2e8f0',
      borderRadius: 8,
      borderThickness: 1,
      separatorThickness: 1,
      cardTextColorMode: 'dark',
    }
  }
// Fix: Add 'as const' to enforce literal types for properties like 'cardStyle',
// making it compatible with the 'Preset' type definition.
] as const;

// Translations are embedded directly to avoid async loading issues in the preview environment.
const translationsMap: { [key in Language]: { [key: string]: string } } = {
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
      "darkThemePageImage": "Dark Theme Page Image", "darkThemePageColor": "Dark Theme Page Color",
      "lightThemePageImage": "Light Theme Page Image", "lightThemePageColor": "Light Theme Page Color",
      "uploadImage": "Upload Image", "localImageSelected": "Local Image Selected", "change": "Change", "clear": "Clear",
      "bgNote": "Note: An uploaded image will always take precedence over a page background color.", "advanced": "Advanced",
      "export": "Export", "import": "Import", "settingsCopied": "Settings copied to clipboard!",
      "pasteSettingsPrompt": "Paste your Mirage UI settings string:", "importError": "Invalid settings format. Could not import.",
      "resetToDefaults": "Reset to Defaults", "language": "Language", "primary": "Primary", "secondary": "Secondary",
      "undoPresetLoadTooltip": "Revert to state before loading a preset",
      "presetMirageDefault": "Mirage Default", "presetPureGlass": "Pure Glass", "presetMinimalistSolid": "Minimalist Solid"
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
      "darkThemePageImage": "Seiten-Hintergrundbild (Dunkel)", "darkThemePageColor": "Seiten-Hintergrundfarbe (Dunkel)",
      "lightThemePageImage": "Seiten-Hintergrundbild (Hell)", "lightThemePageColor": "Seiten-Hintergrundfarbe (Hell)",
      "uploadImage": "Bild hochladen", "localImageSelected": "Lokales Bild ausgewählt", "change": "Ändern", "clear": "Löschen",
      "bgNote": "Hinweis: Ein hochgeladenes Bild hat immer Vorrang vor einer Seitenhintergrundfarbe.", "advanced": "Erweitert",
      "export": "Exportieren", "import": "Importieren", "settingsCopied": "Einstellungen in die Zwischenablage kopiert!",
      "pasteSettingsPrompt": "Fügen Sie Ihre Mirage UI Einstellungs-Zeichenfolge ein:", "importError": "Ungültiges Einstellungsformat. Import fehlgeschlagen.",
      "resetToDefaults": "Auf Standard zurücksetzen", "language": "Sprache", "primary": "Primär", "secondary": "Sekundär",
      "undoPresetLoadTooltip": "Auf den Zustand vor dem Laden der Vorgabe zurücksetzen",
      "presetMirageDefault": "Mirage Standard", "presetPureGlass": "Pures Glas", "presetMinimalistSolid": "Minimalistisch Deckend"
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
      "darkThemePageImage": "Image de fond de page (Thème sombre)", "darkThemePageColor": "Couleur de fond de page (Thème sombre)",
      "lightThemePageImage": "Image de fond de page (Thème clair)", "lightThemePageColor": "Couleur de fond de page (Thème clair)",
      "uploadImage": "Télécharger une image", "localImageSelected": "Image locale sélectionnée", "change": "Changer", "clear": "Effacer",
      "bgNote": "Remarque : Une image téléchargée prévaudra toujours sur la couleur de fond de la page.", "advanced": "Avancé",
      "export": "Exporter", "import": "Importer", "settingsCopied": "Paramètres copiés dans le presse-papiers !",
      "pasteSettingsPrompt": "Collez votre chaîne de paramètres de l'interface Mirage :", "importError": "Format de paramètres non valide. L'importation a échoué.",
      "resetToDefaults": "Réinitialiser les paramètres par défaut", "language": "Langue", "primary": "Primaire", "secondary": "Secondaire",
      "undoPresetLoadTooltip": "Revenir à l'état avant de charger le préréglage",
      "presetMirageDefault": "Mirage Défaut", "presetPureGlass": "Verre Pur", "presetMinimalistSolid": "Solide Minimaliste"
    }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State management for all settings
    const [theme, setTheme] = useState<Theme>(DEFAULTS.theme);
    const [cardStyle, setCardStyle] = useState<CardStyle>(DEFAULTS.cardStyle);
    const [transparency, setTransparency] = useState<number>(DEFAULTS.transparency);
    const [blurIntensity, setBlurIntensity] = useState<number>(DEFAULTS.blurIntensity);
    const [solidColorDark, setSolidColorDark] = useState<string>(DEFAULTS.solidColorDark);
    const [solidColorLight, setSolidColorLight] = useState<string>(DEFAULTS.solidColorLight);
    const [paperColorDark, setPaperColorDark] = useState<string>(DEFAULTS.paperColorDark);
    const [paperColorLight, setPaperColorLight] = useState<string>(DEFAULTS.paperColorLight);
    const [floatingOpacity, setFloatingOpacity] = useState<number>(DEFAULTS.floatingOpacity);
    const [floatingColorDark, setFloatingColorDark] = useState<string>(DEFAULTS.floatingColorDark);
    const [floatingColorLight, setFloatingColorLight] = useState<string>(DEFAULTS.floatingColorLight);
    const [borderThickness, setBorderThickness] = useState<number>(DEFAULTS.borderThickness);
    const [separatorThickness, setSeparatorThickness] = useState<number>(DEFAULTS.separatorThickness);
    const [borderRadius, setBorderRadius] = useState<number>(DEFAULTS.borderRadius);
    const [accentColor, setAccentColor] = useState<string>(DEFAULTS.accentColor);
    const [temperatureColor, setTemperatureColor] = useState<string | null>(DEFAULTS.temperatureColor);
    const [weatherColor, setWeatherColor] = useState<string | null>(DEFAULTS.weatherColor);
    const [humidityColor, setHumidityColor] = useState<string | null>(DEFAULTS.humidityColor);
    const [doorColor, setDoorColor] = useState<string | null>(DEFAULTS.doorColor);
    const [darkThemeTextColors, setDarkThemeTextColors] = useState<TextColors>(DEFAULTS.darkThemeTextColors);
    const [lightThemeTextColors, setLightThemeTextColors] = useState<TextColors>(DEFAULTS.lightThemeTextColors);
    const [cardTextColorMode, setCardTextColorMode] = useState<CardTextColorMode>(DEFAULTS.cardTextColorMode);
    const [bgColorDark, setBgColorDark] = useState<string>(DEFAULTS.bgColorDark);
    const [bgColorLight, setBgColorLight] = useState<string>(DEFAULTS.bgColorLight);
    const [customBgDark, setCustomBgDark] = useState<string | null>(DEFAULTS.customBgDark);
    const [customBgLight, setCustomBgLight] = useState<string | null>(DEFAULTS.customBgLight);
    const [font, setFont] = useState<FontStyle>(DEFAULTS.font);
    const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(DEFAULTS.animationsEnabled);
    const [presets, setPresets] = useState<Preset[]>([]);
    
    const [language, setLanguage] = useState<Language>(() => {
        const savedLang = localStorage.getItem('mirage_language');
        if (savedLang && ['en', 'de', 'fr'].includes(savedLang)) {
            return savedLang as Language;
        }
        const browserLang = navigator.language.split('-')[0];
        if (['de', 'fr'].includes(browserLang)) {
            return browserLang as Language;
        }
        return DEFAULTS.language;
    });
    
    // The translation function
    const t = useCallback((key: string, replacements?: { [key: string]: string }): string => {
        const translations = translationsMap[language] || translationsMap.en;
        let translation = translations[key] || key;
        if (replacements) {
            Object.entries(replacements).forEach(([placeholder, value]) => {
                translation = translation.replace(`{${placeholder}}`, value);
            });
        }
        return translation;
    }, [language]);
    
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

    const setters: Record<keyof SettingsState, Function> = {
      theme: setTheme, cardStyle: setCardStyle, transparency: setTransparency, blurIntensity: setBlurIntensity,
      solidColorDark: setSolidColorDark, solidColorLight: setSolidColorLight, paperColorDark: setPaperColorDark, paperColorLight: setPaperColorLight,
      floatingOpacity: setFloatingOpacity, floatingColorDark: setFloatingColorDark,
      floatingColorLight: setFloatingColorLight, borderThickness: setBorderThickness, separatorThickness: setSeparatorThickness,
      borderRadius: setBorderRadius, accentColor: setAccentColor, temperatureColor: setTemperatureColor,
      weatherColor: setWeatherColor, humidityColor: setHumidityColor, doorColor: setDoorColor,
      darkThemeTextColors: setDarkThemeTextColors, lightThemeTextColors: setLightThemeTextColors,
      cardTextColorMode: setCardTextColorMode,
      bgColorDark: setBgColorDark, bgColorLight: setBgColorLight, customBgDark: setCustomBgDark,
      customBgLight: setCustomBgLight, font: setFont, animationsEnabled: setAnimationsEnabled, language: setLanguage
    };
    
    // Load presets from localStorage on initial render
    useEffect(() => {
        try {
            const storedPresets = localStorage.getItem('mirage_custom_presets');
            let customPresets = storedPresets ? JSON.parse(storedPresets) : [];
            // Add key property for backward compatibility
            customPresets = customPresets.map((p: any) => ({ ...p, key: p.key || p.name }));
            setPresets([...DEFAULT_PRESETS, ...customPresets]);
        } catch (error) {
            console.error("Failed to parse presets from localStorage", error);
            setPresets([...DEFAULT_PRESETS]);
        }
    }, [DEFAULT_PRESETS]);
    
    const applyPreset = useCallback((preset: Preset) => {
        Object.entries(preset.settings).forEach(([key, value]) => {
            const setter = setters[key as keyof SettingsState];
            if (setter && value !== undefined) {
                setter(value);
            }
        });
    }, []);
    
    const resetSettings = useCallback(() => {
        applyPreset({key: 'defaults', name: 'Defaults', settings: DEFAULTS as Partial<SettingsState>});
    }, [applyPreset]);

    const getCurrentSettings = (): SettingsState => ({
      theme, cardStyle, transparency, blurIntensity, solidColorDark, solidColorLight, paperColorDark, paperColorLight,
      floatingOpacity, floatingColorDark, floatingColorLight,
      borderThickness, separatorThickness, borderRadius, accentColor, temperatureColor, weatherColor,
      humidityColor, doorColor, darkThemeTextColors, lightThemeTextColors, cardTextColorMode, bgColorDark, bgColorLight, 
      customBgDark, customBgLight, font, animationsEnabled, language
    });

    const savePreset = (name: string) => {
      const trimmedName = name.trim();
      const newPreset: Preset = { key: trimmedName, name: trimmedName, settings: getCurrentSettings() };
      const newPresets = [...presets.filter(p => !p.isDefault && p.key !== trimmedName), newPreset];
      
      setPresets([...DEFAULT_PRESETS, ...newPresets]);
      localStorage.setItem('mirage_custom_presets', JSON.stringify(newPresets.map(({key, name, settings}) => ({key, name, settings}))));
    };

    const deletePreset = (key: string) => {
        const newPresets = presets.filter(p => p.key !== key && !p.isDefault);
        setPresets([...DEFAULT_PRESETS, ...newPresets]);
        localStorage.setItem('mirage_custom_presets', JSON.stringify(newPresets.map(({key, name, settings}) => ({key, name, settings}))));
    };

    const exportSettings = () => {
      return JSON.stringify(getCurrentSettings(), null, 2);
    };

    const importSettings = (settingsString: string) => {
      try {
        const settings = JSON.parse(settingsString);
        // Basic validation
        if (typeof settings === 'object' && settings !== null && 'cardStyle' in settings) {
          applyPreset({ key: 'imported', name: 'Imported', settings });
          return true;
        }
        return false;
      } catch (e) {
        console.error("Failed to import settings:", e);
        return false;
      }
    };

    // Apply CSS variables to the root element whenever a setting changes.
    useEffect(() => {
        const root = document.documentElement;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        
        const currentText = theme === 'dark' ? darkThemeTextColors : lightThemeTextColors;
        root.style.setProperty('--mirage-accent-color', accentColor);
        root.style.setProperty('--mirage-temperature-color', temperatureColor || accentColor);
        root.style.setProperty('--mirage-weather-color', weatherColor || accentColor);
        root.style.setProperty('--mirage-humidity-color', humidityColor || accentColor);
        root.style.setProperty('--mirage-door-color', doorColor || accentColor);
        
        root.style.setProperty('--mirage-primary-text-color', currentText.primary);
        root.style.setProperty('--mirage-secondary-text-color', currentText.secondary);
        
        let effectiveCardTextColorMode = cardTextColorMode;
        if (effectiveCardTextColorMode === 'auto') {
            effectiveCardTextColorMode = theme === 'dark' ? 'light' : 'dark';
        }
        const cardText = effectiveCardTextColorMode === 'light' ? DEFAULTS.darkThemeTextColors : DEFAULTS.lightThemeTextColors;

        root.style.setProperty('--mirage-card-primary-text-color', cardText.primary);
        root.style.setProperty('--mirage-card-secondary-text-color', cardText.secondary);

        root.style.setProperty('--mirage-border-radius', `${borderRadius}px`);
        root.style.setProperty('--mirage-border-width', `${borderThickness}px`);
        root.style.setProperty('--mirage-separator-width', `${separatorThickness}px`);

        // Glass Style
        const glassAlpha = transparency / 100;
        root.style.setProperty('--mirage-glass-blur', `${blurIntensity}px`);
        root.style.setProperty('--mirage-glass-bg-color-dark', `rgba(86, 94, 88, ${glassAlpha * 1.8})`);
        root.style.setProperty('--mirage-glass-bg-color-light', `rgba(240, 242, 240, ${glassAlpha * 2})`);
        root.style.setProperty('--mirage-glass-border-color-dark', 'rgba(255, 255, 255, 0.15)');
        root.style.setProperty('--mirage-glass-border-color-light', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--mirage-glass-shadow-dark', `0 8px 24px rgba(0,0,0,0.3)`);
        root.style.setProperty('--mirage-glass-shadow-light', `0 8px 24px rgba(0,0,0,0.1)`);
        
        // Solid Style
        root.style.setProperty('--mirage-solid-bg-color-dark', solidColorDark);
        root.style.setProperty('--mirage-solid-bg-color-light', solidColorLight);
        root.style.setProperty('--mirage-solid-border-color-dark', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--mirage-solid-border-color-light', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--mirage-solid-shadow-dark', `0 2px 8px rgba(0,0,0,0.3)`);
        root.style.setProperty('--mirage-solid-shadow-light', `0 2px 8px rgba(0,0,0,0.08)`);
        
        // Paper Style
        root.style.setProperty('--mirage-paper-bg-color-dark', paperColorDark);
        root.style.setProperty('--mirage-paper-bg-color-light', paperColorLight);
        root.style.setProperty('--mirage-paper-border-color-dark', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--mirage-paper-border-color-light', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--mirage-paper-shadow-dark', `0 6px 16px rgba(0,0,0,0.5)`);
        root.style.setProperty('--mirage-paper-shadow-light', `0 4px 12px rgba(0,0,0,0.1)`);

        // Floating Style
        const floatingAlpha = floatingOpacity / 100;
        root.style.setProperty('--mirage-floating-bg-color-dark', hexToRgba(floatingColorDark, floatingAlpha));
        root.style.setProperty('--mirage-floating-bg-color-light', hexToRgba(floatingColorLight, floatingAlpha));
        root.style.setProperty('--mirage-floating-shadow-dark', `0 6px 20px rgba(0,0,0,0.3)`);
        root.style.setProperty('--mirage-floating-shadow-light', `0 6px 20px rgba(0,0,0,0.1)`);
        
        // Slider thumb
        root.style.setProperty('--mirage-slider-thumb-bg-color', hexToRgba(accentColor, 0.7));

    }, [
        theme, cardStyle, transparency, blurIntensity, solidColorDark, solidColorLight, paperColorDark, paperColorLight,
        floatingOpacity, floatingColorDark, floatingColorLight, borderThickness, separatorThickness, borderRadius, 
        accentColor, temperatureColor, weatherColor, humidityColor, doorColor, darkThemeTextColors, 
        lightThemeTextColors, cardTextColorMode
    ]);
    
    const value: SettingsContextType = {
        theme, setTheme, cardStyle, setCardStyle, transparency, setTransparency, blurIntensity, setBlurIntensity,
        solidColorDark, setSolidColorDark, solidColorLight, setSolidColorLight, paperColorDark, setPaperColorDark, paperColorLight, setPaperColorLight,
        floatingOpacity, setFloatingOpacity, floatingColorDark, setFloatingColorDark,
        floatingColorLight, setFloatingColorLight, borderThickness, setBorderThickness, separatorThickness, setSeparatorThickness,
        borderRadius, setBorderRadius, accentColor, setAccentColor, temperatureColor, setTemperatureColor, weatherColor, setWeatherColor,
        humidityColor, setHumidityColor, doorColor, setDoorColor, darkThemeTextColors, setDarkThemeTextColors,
        lightThemeTextColors, setLightThemeTextColors, cardTextColorMode, setCardTextColorMode,
        bgColorDark, setBgColorDark, bgColorLight, setBgColorLight,
        customBgDark, setCustomBgDark, customBgLight, setCustomBgLight,
        font, setFont, animationsEnabled, setAnimationsEnabled, language, setLanguage,
        resetSettings,
        t,
        currentTextColors: theme === 'dark' ? darkThemeTextColors : lightThemeTextColors,
        presets, applyPreset, savePreset, deletePreset,
        exportSettings, importSettings
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