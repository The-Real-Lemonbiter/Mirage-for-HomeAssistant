/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import React, { useState, useMemo } from 'react';
import { useSettings } from './SettingsProvider';
import { MirageCard } from './MirageCard';
import { ToggleSwitch } from './ToggleSwitch';
import { 
    SunIcon, MoonIcon, StyleGlassIcon, StyleSolidIcon, StyleFloatingIcon, StylePaperIcon,
    BlurIcon, ContrastIcon, BorderIcon, BorderRadiusIcon, SeparatorIcon, 
    ColorPaletteIcon, UploadIcon, XIcon, LightbulbIcon, FontIcon, AnimationIcon,
    SaveIcon, TrashIcon, ExportIcon, ImportIcon, LanguageIcon, SettingsIcon
} from './icons';
import { SettingsState, EditMode } from '../types';

// A simple row for sliders and toggles where label and control are on the same line.
const SettingRow: React.FC<{ icon: React.ElementType, label: string, children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
    <div className="flex items-center justify-between py-3 gap-4">
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-200">{label}</span>
        </div>
        <div className="flex items-center space-x-2 justify-end">
            {children}
        </div>
    </div>
);

// A row for complex controls where the label is stacked above the control to prevent UI issues with long text.
const VerticalSetting: React.FC<{ icon: React.ElementType, label: string, children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
    <div className="py-3">
        <div className="flex items-center space-x-3 mb-2">
            <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-200">{label}</span>
        </div>
        <div className="flex items-center space-x-2 w-full">
            {children}
        </div>
    </div>
);

// A flexible, full-width button for use in segmented controls.
const SegmentedControlButton: React.FC<{ onClick: () => void, isActive: boolean, children: React.ReactNode }> = ({ onClick, isActive, children }) => (
    <button 
        onClick={onClick} 
        className={`flex-1 text-center py-1.5 text-sm rounded transition-colors ${isActive ? 'bg-gray-200 text-black font-medium' : 'text-gray-300 hover:bg-white/10'}`}
    >
        {children}
    </button>
);

const StyleButton: React.FC<{ label: string, icon: React.ElementType, isActive: boolean, onClick: () => void }> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-2 rounded-lg w-full h-full transition-colors duration-200 ${isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
    >
        <Icon className="w-8 h-8" />
        <div className="flex flex-col items-center mt-1 leading-tight">
            <span className="text-xs text-gray-400">Mirage</span>
            <span className="text-xs font-bold">{label}</span>
        </div>
    </button>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="mt-6 mb-2 text-sm font-medium text-gray-500 tracking-wider uppercase">{title}</h3>
);

const CustomColorInput: React.FC<{
  label: string;
  color: string | null;
  onColorChange: (color: string | null) => void;
  accentColor: string;
}> = ({ label, color, onColorChange, accentColor }) => {
  const isUsingAccent = color === null;
  return (
    <div className="flex items-center justify-between py-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isUsingAccent}
          onChange={() => onColorChange(isUsingAccent ? accentColor : null)}
          className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-300">{label}</span>
      </label>
      <input
        type="color"
        value={color || accentColor}
        onChange={(e) => onColorChange(e.target.value)}
        disabled={isUsingAccent}
        className={`h-8 w-10 rounded-md ${isUsingAccent ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );
};

const TextColorPreview: React.FC<{ mode: 'auto' | 'light' | 'dark', theme: 'light' | 'dark', t: (key: string) => string }> = ({ mode, theme, t }) => {
    const lightColor = { primary: '#e5e7eb', secondary: '#9ca3af' };
    const darkColor = { primary: '#1f2937', secondary: '#4b5563' };
    
    let effectiveMode = mode;
    if (effectiveMode === 'auto') {
        effectiveMode = theme === 'dark' ? 'light' : 'dark';
    }

    const colors = effectiveMode === 'light' ? lightColor : darkColor;

    return (
        <div
            className="w-20 h-14 rounded-md p-2 flex flex-col justify-center bg-gradient-to-r from-gray-800 via-gray-500 to-gray-200 border border-white/10"
            title="Preview of text color on a mixed background"
        >
            <p className="text-sm font-bold leading-tight" style={{ color: colors.primary, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{t('primary')}</p>
            <p className="text-xs leading-tight" style={{ color: colors.secondary, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{t('secondary')}</p>
        </div>
    );
};

const SettingsPreview: React.FC = () => {
    const { theme, activeThemeConfig, t } = useSettings();

    const previewStyle: React.CSSProperties = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    if (activeThemeConfig.customBg) {
        previewStyle.backgroundImage = `url(${activeThemeConfig.customBg})`;
    } else {
        previewStyle.backgroundColor = activeThemeConfig.bgColor;
    }

    return (
        <div className="p-4 transition-colors" style={previewStyle}>
             <h3 className="mb-4 text-sm font-medium tracking-wider text-center" style={{color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', textShadow: '0 1px 2px rgba(0,0,0,0.2)'}}>{t('livePreview')}</h3>
            <MirageCard title={t('previewCardTitle')} theme={theme} cardStyle={activeThemeConfig.cardStyle}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <LightbulbIcon className="w-6 h-6" style={{color: activeThemeConfig.accentColor}} />
                          <span style={{color: 'var(--mirage-card-primary-text-color)'}}>{t('example')}</span>
                        </div>
                        <ToggleSwitch isOn={true} onToggle={()=>{}} theme={theme} accentColor={activeThemeConfig.accentColor} />
                    </div>
                    <p className="text-sm" style={{color: 'var(--mirage-card-secondary-text-color)'}}>
                        {t('previewCardContent')}
                    </p>
                </div>
            </MirageCard>
        </div>
    );
};

const BackgroundImageControl: React.FC<{
  label: string;
  customBg: string | null;
  setCustomBg: (bg: string | null) => void;
  t: (key: string) => string;
}> = ({ label, customBg, setCustomBg, t }) => {
  const { uploadBackgroundImage } = useSettings();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newUrl = await uploadBackgroundImage(file);
      if (newUrl) {
          setCustomBg(newUrl);
      }
    }
    if (event.target) event.target.value = ''; // Reset file input
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-300 mb-2 block">{label}</label>
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      {!customBg ? (
        <button onClick={handleUploadClick} className="upload-btn w-full flex items-center justify-center space-x-2">
          <UploadIcon className="w-5 h-5" />
          <span>{t('uploadImage')}</span>
        </button>
      ) : (
        <div className="bg-gray-700/50 rounded-md p-2 flex items-center justify-between">
          <p className="text-sm text-gray-400 truncate font-mono" title={customBg}>
            {customBg.split('/').pop()}
          </p>
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            <button onClick={handleUploadClick} className="upload-btn !py-1 !px-2 text-xs">{t('change')}</button>
            <button onClick={() => setCustomBg(null)} className="clear-btn !py-1 !px-2 text-xs">{t('clear')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

const PresetsManager: React.FC = () => {
    const { settings, presets, applyPreset, savePreset, deletePreset, t } = useSettings();
    
    const [selectedPresetKey, setSelectedPresetKey] = useState<string>('mirage_default');
    const [newPresetName, setNewPresetName] = useState('');
    const [prePresetState, setPrePresetState] = useState<Partial<SettingsState> | null>(null);

    const defaultPresets = useMemo(() => presets.filter(p => p.isDefault), [presets]);
    const customPresets = useMemo(() => presets.filter(p => !p.isDefault), [presets]);

    const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetKey = e.target.value;
        const preset = presets.find(p => p.key === presetKey);

        if (preset) {
            if (!prePresetState) {
                setPrePresetState(JSON.parse(JSON.stringify(settings)));
            }
            applyPreset(preset);
            setSelectedPresetKey(presetKey);
        }
    };

    const handleUndo = () => {
        if (prePresetState) {
            applyPreset({ key: 'reverted', name: 'Reverted State', settings: prePresetState });
            setPrePresetState(null);
            setSelectedPresetKey('mirage_default');
        }
    };
    
    const handleSave = () => {
        if (newPresetName.trim()) {
            savePreset(newPresetName.trim());
            setNewPresetName('');
        }
    };
    
    const selectedCustomPreset = customPresets.find(p => p.key === selectedPresetKey);

    return (
        <div className="bg-black/20 p-4 rounded-lg space-y-4">
             <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300 block">{t('loadPreset')}</label>
                 <div className="flex items-center space-x-2">
                    <select
                        value={selectedPresetKey}
                        onChange={handlePresetSelect}
                        className="w-full bg-gray-700 border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <optgroup label={t('defaultPresets')}>
                            {defaultPresets.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
                        </optgroup>
                        {customPresets.length > 0 && <optgroup label={t('myPresets')}>
                            {customPresets.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
                        </optgroup>}
                    </select>
                    {prePresetState && (
                         <button onClick={handleUndo} className="upload-btn !px-4 whitespace-nowrap" title={t('undoPresetLoadTooltip')}>{t('undo')}</button>
                    )}
                 </div>
                 {selectedCustomPreset && (
                     <button onClick={() => deletePreset(selectedPresetKey)} className="text-xs text-red-400 hover:text-red-300 transition-colors w-full text-right pr-1">
                       {t('deletePreset', { presetName: selectedCustomPreset.name })}
                     </button>
                 )}
            </div>

            <div className="space-y-2">
                 <label htmlFor="preset-name" className="text-sm font-medium text-gray-300 block">{t('saveCurrentStyle')}</label>
                 <div className="flex space-x-2">
                    <input
                        id="preset-name"
                        type="text"
                        value={newPresetName}
                        onChange={e => setNewPresetName(e.target.value)}
                        placeholder={t('newPresetPlaceholder')}
                        className="w-full bg-gray-700 border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button onClick={handleSave} className="upload-btn !px-4 !bg-blue-600/50 hover:!bg-blue-600/70 text-white flex items-center space-x-2" disabled={!newPresetName.trim()}>
                      <SaveIcon className="w-4 h-4" /> 
                      <span>{t('save')}</span>
                    </button>
                 </div>
            </div>
        </div>
    );
};


const ThemeSettings: React.FC<{ mode: EditMode }> = ({ mode }) => {
    const { settings, t, updateActiveThemeConfig, theme } = useSettings();
    const config = settings![mode];
    
    const sliderClass = "w-32 accent-blue-500";
    const sliderValueClass = "text-sm text-gray-300 font-mono w-12 text-right";

    return (
        <>
            <SectionHeader title={t('cardStyle')}/>
            <div className="grid grid-cols-4 gap-2">
                <StyleButton label={t('glass')} icon={StyleGlassIcon} isActive={config.cardStyle === 'glass'} onClick={() => updateActiveThemeConfig('cardStyle', 'glass')} />
                <StyleButton label={t('solid')} icon={StyleSolidIcon} isActive={config.cardStyle === 'solid'} onClick={() => updateActiveThemeConfig('cardStyle', 'solid')} />
                <StyleButton label={t('paper')} icon={StylePaperIcon} isActive={config.cardStyle === 'paper'} onClick={() => updateActiveThemeConfig('cardStyle', 'paper')} />
                <StyleButton label={t('floating')} icon={StyleFloatingIcon} isActive={config.cardStyle === 'floating'} onClick={() => updateActiveThemeConfig('cardStyle', 'floating')} />
            </div>
            
            {config.cardStyle === 'glass' && (
                <div className="mt-2 bg-black/20 p-2 rounded-lg">
                    <SettingRow icon={BlurIcon} label={t('blurIntensity')}><input type="range" className={sliderClass} min="0" max="40" value={config.blurIntensity} onChange={(e) => updateActiveThemeConfig('blurIntensity', Number(e.target.value))} /><span className={sliderValueClass}>{config.blurIntensity}px</span></SettingRow>
                    <SettingRow icon={ContrastIcon} label={t('transparency')}><input type="range" className={sliderClass} min="0" max="100" value={config.transparency} onChange={(e) => updateActiveThemeConfig('transparency', Number(e.target.value))} /><span className={sliderValueClass}>{config.transparency}%</span></SettingRow>
                </div>
            )}
            {config.cardStyle === 'solid' && (
                    <div className="mt-2 bg-black/20 p-2 rounded-lg">
                    <SettingRow icon={ColorPaletteIcon} label={t('cardColor')}>
                        <input type="color" value={config.solidColor} onChange={(e) => updateActiveThemeConfig('solidColor', e.target.value)} className="h-8 w-10 rounded-md" />
                    </SettingRow>
                </div>
            )}
            {config.cardStyle === 'paper' && (
                    <div className="mt-2 bg-black/20 p-2 rounded-lg">
                    <SettingRow icon={ColorPaletteIcon} label={t('cardColor')}>
                        <input type="color" value={config.paperColor} onChange={(e) => updateActiveThemeConfig('paperColor', e.target.value)} className="h-8 w-10 rounded-md" />
                    </SettingRow>
                </div>
            )}
            {config.cardStyle === 'floating' && (
                    <div className="mt-2 bg-black/20 p-2 rounded-lg">
                    <SettingRow icon={ColorPaletteIcon} label={t('cardColor')}><input type="color" value={config.floatingColor} onChange={(e) => updateActiveThemeConfig('floatingColor', e.target.value)} className="h-8 w-10 rounded-md" /></SettingRow>
                    <SettingRow icon={ContrastIcon} label={t('opacity')}><input type="range" className={sliderClass} min="0" max="100" value={config.floatingOpacity} onChange={(e) => updateActiveThemeConfig('floatingOpacity', Number(e.target.value))} /><span className={sliderValueClass}>{config.floatingOpacity}%</span></SettingRow>
                </div>
            )}
            
            <SectionHeader title={t('appearance')}/>
                <div className="bg-black/20 p-2 rounded-lg divide-y divide-white/5">
                <SettingRow icon={BorderRadiusIcon} label={t('borderRadius')}><input type="range" className={sliderClass} min="0" max="32" value={config.borderRadius} onChange={(e) => updateActiveThemeConfig('borderRadius', Number(e.target.value))} /><span className={sliderValueClass}>{config.borderRadius}px</span></SettingRow>
                <SettingRow icon={BorderIcon} label={t('borderWidth')}><input type="range" className={sliderClass} min="0" max="4" step="0.5" value={config.borderThickness} onChange={(e) => updateActiveThemeConfig('borderThickness', Number(e.target.value))} /><span className={sliderValueClass}>{config.borderThickness}px</span></SettingRow>
                <SettingRow icon={SeparatorIcon} label={t('separatorWidth')}><input type="range" className={sliderClass} min="0" max="4" step="0.5" value={config.separatorThickness} onChange={(e) => updateActiveThemeConfig('separatorThickness', Number(e.target.value))} /><span className={sliderValueClass}>{config.separatorThickness}px</span></SettingRow>
                <VerticalSetting icon={ContrastIcon} label={t('cardTextColor')}>
                    <TextColorPreview mode={config.cardTextColorMode} theme={theme} t={t} />
                    <div className="flex-1 flex items-center p-1 rounded-md bg-white/5">
                        <SegmentedControlButton onClick={() => updateActiveThemeConfig('cardTextColorMode', 'auto')} isActive={config.cardTextColorMode === 'auto'}>{t('auto')}</SegmentedControlButton>
                        <SegmentedControlButton onClick={() => updateActiveThemeConfig('cardTextColorMode', 'light')} isActive={config.cardTextColorMode === 'light'}>{t('light')}</SegmentedControlButton>
                        <SegmentedControlButton onClick={() => updateActiveThemeConfig('cardTextColorMode', 'dark')} isActive={config.cardTextColorMode === 'dark'}>{t('dark')}</SegmentedControlButton>
                    </div>
                </VerticalSetting>
            </div>
            
            <SectionHeader title={t('colors')}/>
            <div className="bg-black/20 p-2 rounded-lg">
                <SettingRow icon={ColorPaletteIcon} label={t('accentColor')}><input type="color" value={config.accentColor} onChange={(e) => updateActiveThemeConfig('accentColor', e.target.value)} className="h-8 w-10 rounded-md" /></SettingRow>
                <CustomColorInput label={t('temperature')} color={config.temperatureColor} onColorChange={(c) => updateActiveThemeConfig('temperatureColor', c)} accentColor={config.accentColor} />
                <CustomColorInput label={t('weather')} color={config.weatherColor} onColorChange={(c) => updateActiveThemeConfig('weatherColor', c)} accentColor={config.accentColor} />
                <CustomColorInput label={t('humidity')} color={config.humidityColor} onColorChange={(c) => updateActiveThemeConfig('humidityColor', c)} accentColor={config.accentColor} />
                <CustomColorInput label={t('door')} color={config.doorColor} onColorChange={(c) => updateActiveThemeConfig('doorColor', c)} accentColor={config.accentColor} />
            </div>

            <SectionHeader title={t('pageBackground')}/>
                <div className="bg-black/20 p-4 rounded-lg space-y-4">
                <BackgroundImageControl label={t('backgroundImage')} customBg={config.customBg} setCustomBg={(c) => updateActiveThemeConfig('customBg', c)} t={t} />
                <SettingRow icon={ColorPaletteIcon} label={t('backgroundColor')}>
                    <input type="color" value={config.bgColor} onChange={(e) => updateActiveThemeConfig('bgColor', e.target.value)} className="h-8 w-10 rounded-md" />
                </SettingRow>
                <p className="text-xs text-gray-500 pt-2 text-center">{t('bgNote')}</p>
            </div>
        </>
    );
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isHaIntegration?: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, isHaIntegration = false }) => {
    const { t, settings, updateGeneralSetting, resetSettings, exportSettings, importSettings, setActiveEditMode, setTheme, saveSettingsToHA, haLanguage, setHaLanguage } = useSettings();
    const [activeTab, setActiveTab] = useState<'day' | 'night' | 'general'>('night');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    
    const handleTabClick = (tab: 'day' | 'night' | 'general') => {
        setActiveTab(tab);
        if (tab === 'day') {
            setActiveEditMode('day');
            setTheme('light');
        } else if (tab === 'night') {
            setActiveEditMode('night');
            setTheme('dark');
        }
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        await saveSettingsToHA();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };
    
    if (!settings) return null; // Or a loading spinner
    
    const activeTabClasses = 'bg-gray-200 text-black font-semibold';
    const inactiveTabClasses = 'text-gray-300 hover:bg-white/10';
    const tabBaseClasses = 'flex-1 flex items-center justify-center space-x-2 py-2 text-sm rounded-md transition-colors';

    const panelContent = (
      <div
          className={`h-full bg-[#1e2128] text-gray-200 shadow-2xl flex flex-col`}
      >
          <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <h2 className="text-lg font-semibold">{t('configTitle')}</h2>
              {!isHaIntegration && (
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <XIcon className="w-5 h-5"/>
                </button>
              )}
          </header>
          
          <SettingsPreview />
          
          <nav className="flex items-center p-1 mx-4 mt-4 rounded-lg bg-black/20 flex-shrink-0">
              <button onClick={() => handleTabClick('day')} className={`${tabBaseClasses} ${activeTab === 'day' ? activeTabClasses : inactiveTabClasses}`}>
                <SunIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">{t('dayTab')}</span>
              </button>
              <button onClick={() => handleTabClick('night')} className={`${tabBaseClasses} ${activeTab === 'night' ? activeTabClasses : inactiveTabClasses}`}>
                <MoonIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">{t('nightTab')}</span>
              </button>
              <button onClick={() => handleTabClick('general')} className={`${tabBaseClasses} ${activeTab === 'general' ? activeTabClasses : inactiveTabClasses}`}>
                 <SettingsIcon className="w-4 h-4" />
                 <span className="whitespace-nowrap">{t('generalTab')}</span>
              </button>
          </nav>

          <div className="p-4 overflow-y-auto flex-grow">
              {activeTab === 'day' && <ThemeSettings mode="day" />}
              {activeTab === 'night' && <ThemeSettings mode="night" />}

              {activeTab === 'general' && (
                  <>
                      <SectionHeader title={t('presets')}/>
                      <PresetsManager />

                      <SectionHeader title={t('appearance')} />
                      <div className="bg-black/20 p-2 rounded-lg divide-y divide-white/5">
                          <VerticalSetting icon={FontIcon} label={t('fontStyle')}>
                              <div className="w-full flex items-center p-1 rounded-md bg-white/5">
                                  <SegmentedControlButton onClick={() => updateGeneralSetting('font', 'system')} isActive={settings.general.font === 'system'}>{t('system')}</SegmentedControlButton>
                                  <SegmentedControlButton onClick={() => updateGeneralSetting('font', 'serif')} isActive={settings.general.font === 'serif'}>{t('serif')}</SegmentedControlButton>
                                  <SegmentedControlButton onClick={() => updateGeneralSetting('font', 'monospace')} isActive={settings.general.font === 'monospace'}>{t('mono')}</SegmentedControlButton>
                              </div>
                          </VerticalSetting>
                          <SettingRow icon={AnimationIcon} label={t('animations')}><ToggleSwitch isOn={settings.general.animationsEnabled} onToggle={() => updateGeneralSetting('animationsEnabled', !settings.general.animationsEnabled)} theme={useSettings().theme} accentColor={settings.night.accentColor} /></SettingRow>
                          {!isHaIntegration && (
                            <SettingRow icon={LanguageIcon} label={t('language')}>
                                <select
                                    value={haLanguage}
                                    onChange={(e) => setHaLanguage(e.target.value)}
                                    className="bg-gray-700 border-gray-600 rounded-md text-sm py-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="en">English</option>
                                    <option value="de">Deutsch</option>
                                    <option value="fr">Français</option>
                                    <option value="nl">Nederlands</option>
                                    <option value="es">Español</option>
                                    <option value="it">Italiano</option>
                                    <option value="pl">Polski</option>
                                    <option value="pt">Português</option>
                                </select>
                            </SettingRow>
                          )}
                      </div>

                      <SectionHeader title={t('advanced')} />
                      <div className="bg-black/20 p-2 rounded-lg flex items-center justify-center space-x-4">
                          <button onClick={() => { navigator.clipboard.writeText(exportSettings()); alert(t('settingsCopied')); }} className="flex items-center space-x-2 upload-btn">
                              <ExportIcon className="w-5 h-5" /><span>{t('export')}</span>
                          </button>
                          <button onClick={() => {
                              const data = prompt(t('pasteSettingsPrompt'));
                              if (data) { if (!importSettings(data)) { alert(t('importError')); } }
                          }} className="flex items-center space-x-2 upload-btn">
                              <ImportIcon className="w-5 h-5" /><span>{t('import')}</span>
                          </button>
                      </div>

                      <SectionHeader title={t('resetToDefaults')} />
                      <div className="space-y-2">
                          <button onClick={() => resetSettings('day')} className="w-full py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors text-sm">{t('resetDaySettings')}</button>
                          <button onClick={() => resetSettings('night')} className="w-full py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors text-sm">{t('resetNightSettings')}</button>
                          <button onClick={() => resetSettings('general')} className="w-full py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors text-sm">{t('resetGeneralSettings')}</button>
                      </div>
                  </>
              )}
          </div>

          {isHaIntegration && (
             <footer className="p-4 border-t border-white/10 flex-shrink-0">
                <button onClick={handleSave} className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors duration-200 flex items-center justify-center ${
                    saveStatus === 'saved' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
                }`}
                disabled={saveStatus === 'saving'}
                >
                    {saveStatus === 'idle' && t('saveSettings')}
                    {saveStatus === 'saving' && '...'}
                    {saveStatus === 'saved' && t('settingsSaved')}
                </button>
             </footer>
          )}
      </div>
    );
    
    if (isHaIntegration) {
      return panelContent;
    }

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black/60' : 'pointer-events-none opacity-0'}`} onClick={onClose}>
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
              {panelContent}
            </div>
        </div>
    );
};
