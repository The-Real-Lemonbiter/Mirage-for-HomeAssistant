/**
 * Copyright (c) 2024 Lemonbiter
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
    SaveIcon, TrashIcon, ExportIcon, ImportIcon, CardStackIcon, TextIcon as CardTextIcon, LanguageIcon
} from './icons';
import { CardStyle, FontStyle, Preset, CardTextColorMode, SettingsState, Language } from '../types';

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
  setColor: (color: string | null) => void;
  accentColor: string;
}> = ({ label, color, setColor, accentColor }) => {
  const isUsingAccent = color === null;
  return (
    <div className="flex items-center justify-between py-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isUsingAccent}
          onChange={() => setColor(isUsingAccent ? accentColor : null)}
          className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-300">{label}</span>
      </label>
      <input
        type="color"
        value={color || accentColor}
        onChange={(e) => setColor(e.target.value)}
        disabled={isUsingAccent}
        className={`h-8 w-10 rounded-md ${isUsingAccent ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );
};

const TextColorPreview: React.FC<{ mode: CardTextColorMode, theme: 'light' | 'dark', t: (key: string) => string }> = ({ mode, theme, t }) => {
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
    const { 
      theme, cardStyle, accentColor, t,
      customBgDark, customBgLight, bgColorDark, bgColorLight 
    } = useSettings();

    const previewStyle: React.CSSProperties = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const bgImage = theme === 'dark' ? customBgDark : customBgLight;
    const bgColor = theme === 'dark' ? bgColorDark : bgColorLight;

    if (bgImage) {
        previewStyle.backgroundImage = `url(${bgImage})`;
    } else {
        previewStyle.backgroundColor = bgColor;
    }

    return (
        <div className="p-4 transition-colors" style={previewStyle}>
             <h3 className="mb-4 text-sm font-medium tracking-wider text-center" style={{color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', textShadow: '0 1px 2px rgba(0,0,0,0.2)'}}>{t('livePreview')}</h3>
            <MirageCard title={t('previewCardTitle')} theme={theme} cardStyle={cardStyle}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <LightbulbIcon className="w-6 h-6" style={{color: accentColor}} />
                          <span style={{color: 'var(--mirage-card-primary-text-color)'}}>{t('example')}</span>
                        </div>
                        <ToggleSwitch isOn={true} onToggle={()=>{}} theme={theme} accentColor={accentColor} />
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomBg(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = '';
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
          <p className="text-sm text-gray-400 truncate font-mono" title={customBg.startsWith('data:image') ? t('localImageSelected') : customBg}>
            {t('localImageSelected')}
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
    const settings = useSettings();
    const { presets, applyPreset, savePreset, deletePreset, t } = settings;
    
    const [selectedPresetName, setSelectedPresetName] = useState<string>(presets[0]?.name || '');
    const [newPresetName, setNewPresetName] = useState('');
    const [prePresetState, setPrePresetState] = useState<Partial<SettingsState> | null>(null);

    const defaultPresets = useMemo(() => presets.filter(p => p.isDefault), [presets]);
    const customPresets = useMemo(() => presets.filter(p => !p.isDefault), [presets]);

    const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetName = e.target.value;
        const preset = presets.find(p => p.name === presetName);

        if (preset) {
            if (!prePresetState) {
                const {
                    presets: _p, applyPreset: _ap, savePreset: _sp, deletePreset: _dp, exportSettings: _es, 
                    importSettings: _is, resetSettings: _rs, currentTextColors: _ctc, t: _t, ...currentState
                } = settings;
                Object.keys(currentState).forEach(key => {
                  if (key.startsWith('set')) delete (currentState as any)[key];
                });
                setPrePresetState(currentState as Partial<SettingsState>);
            }
            
            applyPreset(preset);
            setSelectedPresetName(presetName);
        }
    };

    const handleUndo = () => {
        if (prePresetState) {
            applyPreset({ name: 'Reverted State', settings: prePresetState });
            setPrePresetState(null);
            setSelectedPresetName(presets[0]?.name || '');
        }
    };
    
    const handleSave = () => {
        if (newPresetName.trim()) {
            savePreset(newPresetName.trim());
            setNewPresetName('');
        }
    };
    
    return (
        <div className="bg-black/20 p-4 rounded-lg space-y-4">
             <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300 block">{t('loadPreset')}</label>
                 <div className="flex items-center space-x-2">
                    <select
                        value={selectedPresetName}
                        onChange={handlePresetSelect}
                        className="w-full bg-gray-700 border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <optgroup label={t('defaultPresets')}>
                            {defaultPresets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </optgroup>
                        {customPresets.length > 0 && <optgroup label={t('myPresets')}>
                            {customPresets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </optgroup>}
                    </select>
                    {prePresetState && (
                         <button onClick={handleUndo} className="upload-btn !px-4 whitespace-nowrap" title="Revert to state before loading a preset">{t('undo')}</button>
                    )}
                 </div>
                 {customPresets.find(p => p.name === selectedPresetName) && (
                     <button onClick={() => deletePreset(selectedPresetName)} className="text-xs text-red-400 hover:text-red-300 transition-colors w-full text-right pr-1">
                       {t('deletePreset', { presetName: selectedPresetName })}
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

export const SettingsPanel: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const settings = useSettings();
    const { t, language, setLanguage } = settings;

    const sliderClass = "w-32 accent-blue-500";
    const sliderValueClass = "text-sm text-gray-300 font-mono w-12 text-right";

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black/60' : 'pointer-events-none opacity-0'}`} onClick={onClose}>
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#1e2128] text-gray-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-lg font-semibold">{t('configTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5"/>
                    </button>
                </header>
                
                <SettingsPreview />

                <div className="p-4 overflow-y-auto flex-grow">
                    <SectionHeader title={t('language')} />
                    <div className="bg-black/20 p-2 rounded-lg">
                      <SettingRow icon={LanguageIcon} label={t('language')}>
                          <div className="flex items-center p-1 rounded-md bg-white/5">
                              <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm rounded ${language === 'en' ? 'bg-gray-200 text-black' : 'text-gray-300'}`}>EN</button>
                              <button onClick={() => setLanguage('de')} className={`px-3 py-1 text-sm rounded ${language === 'de' ? 'bg-gray-200 text-black' : 'text-gray-300'}`}>DE</button>
                              <button onClick={() => setLanguage('fr')} className={`px-3 py-1 text-sm rounded ${language === 'fr' ? 'bg-gray-200 text-black' : 'text-gray-300'}`}>FR</button>
                          </div>
                      </SettingRow>
                    </div>

                    <SectionHeader title={t('presets')}/>
                    <PresetsManager />

                    <SectionHeader title={t('theme')}/>
                    <div className="bg-black/20 p-2 rounded-lg">
                      <SettingRow icon={settings.theme === 'light' ? SunIcon : MoonIcon} label={t('mode')}>
                          <div className="flex items-center p-1 rounded-md bg-white/5">
                              <button onClick={() => settings.setTheme('light')} className={`px-3 py-1 text-sm rounded ${settings.theme === 'light' ? 'bg-gray-200 text-black' : 'text-gray-300'}`}>{t('light')}</button>
                              <button onClick={() => settings.setTheme('dark')} className={`px-3 py-1 text-sm rounded ${settings.theme === 'dark' ? 'bg-gray-600 text-white' : 'text-gray-300'}`}>{t('dark')}</button>
                          </div>
                      </SettingRow>
                    </div>

                    <SectionHeader title={t('cardStyle')}/>
                    <div className="grid grid-cols-4 gap-2">
                        <StyleButton label={t('glass')} icon={StyleGlassIcon} isActive={settings.cardStyle === 'glass'} onClick={() => settings.setCardStyle('glass')} />
                        <StyleButton label={t('solid')} icon={StyleSolidIcon} isActive={settings.cardStyle === 'solid'} onClick={() => settings.setCardStyle('solid')} />
                        <StyleButton label={t('paper')} icon={StylePaperIcon} isActive={settings.cardStyle === 'paper'} onClick={() => settings.setCardStyle('paper')} />
                        <StyleButton label={t('floating')} icon={StyleFloatingIcon} isActive={settings.cardStyle === 'floating'} onClick={() => settings.setCardStyle('floating')} />
                    </div>
                    
                    {settings.cardStyle === 'glass' && (
                        <div className="mt-2 bg-black/20 p-2 rounded-lg">
                            <SettingRow icon={BlurIcon} label={t('blurIntensity')}><input type="range" className={sliderClass} min="0" max="40" value={settings.blurIntensity} onChange={(e) => settings.setBlurIntensity(Number(e.target.value))} /><span className={sliderValueClass}>{settings.blurIntensity}px</span></SettingRow>
                            <SettingRow icon={ContrastIcon} label={t('transparency')}><input type="range" className={sliderClass} min="0" max="100" value={settings.transparency} onChange={(e) => settings.setTransparency(Number(e.target.value))} /><span className={sliderValueClass}>{settings.transparency}%</span></SettingRow>
                        </div>
                    )}
                    {settings.cardStyle === 'solid' && (
                         <div className="mt-2 bg-black/20 p-2 rounded-lg">
                            <SettingRow icon={ContrastIcon} label={t('grayness')}><input type="range" className={sliderClass} min="0" max="100" value={settings.solidGrayscale} onChange={(e) => settings.setSolidGrayscale(Number(e.target.value))} /><span className={sliderValueClass}>{settings.solidGrayscale}%</span></SettingRow>
                        </div>
                    )}
                    {settings.cardStyle === 'floating' && (
                         <div className="mt-2 bg-black/20 p-2 rounded-lg">
                            <SettingRow icon={ColorPaletteIcon} label={t('backgroundColor')}><input type="color" value={settings.theme === 'dark' ? settings.floatingColorDark : settings.floatingColorLight} onChange={(e) => settings.theme === 'dark' ? settings.setFloatingColorDark(e.target.value) : settings.setFloatingColorLight(e.target.value)} className="h-8 w-10 rounded-md" /></SettingRow>
                            <SettingRow icon={ContrastIcon} label={t('opacity')}><input type="range" className={sliderClass} min="0" max="100" value={settings.floatingOpacity} onChange={(e) => settings.setFloatingOpacity(Number(e.target.value))} /><span className={sliderValueClass}>{settings.floatingOpacity}%</span></SettingRow>
                        </div>
                    )}
                    
                    <SectionHeader title={t('appearance')}/>
                     <div className="bg-black/20 p-2 rounded-lg divide-y divide-white/5">
                        <SettingRow icon={BorderRadiusIcon} label={t('borderRadius')}><input type="range" className={sliderClass} min="0" max="32" value={settings.borderRadius} onChange={(e) => settings.setBorderRadius(Number(e.target.value))} /><span className={sliderValueClass}>{settings.borderRadius}px</span></SettingRow>
                        <SettingRow icon={BorderIcon} label={t('borderWidth')}><input type="range" className={sliderClass} min="0" max="4" step="0.5" value={settings.borderThickness} onChange={(e) => settings.setBorderThickness(Number(e.target.value))} /><span className={sliderValueClass}>{settings.borderThickness}px</span></SettingRow>
                        <SettingRow icon={SeparatorIcon} label={t('separatorWidth')}><input type="range" className={sliderClass} min="0" max="4" step="0.5" value={settings.separatorThickness} onChange={(e) => settings.setSeparatorThickness(Number(e.target.value))} /><span className={sliderValueClass}>{settings.separatorThickness}px</span></SettingRow>
                        
                        <VerticalSetting icon={CardTextIcon} label={t('cardTextColor')}>
                            <TextColorPreview mode={settings.cardTextColorMode} theme={settings.theme} t={t} />
                            <div className="flex-1 flex items-center p-1 rounded-md bg-white/5">
                                <SegmentedControlButton onClick={() => settings.setCardTextColorMode('auto')} isActive={settings.cardTextColorMode === 'auto'}>{t('auto')}</SegmentedControlButton>
                                <SegmentedControlButton onClick={() => settings.setCardTextColorMode('light')} isActive={settings.cardTextColorMode === 'light'}>{t('light')}</SegmentedControlButton>
                                <SegmentedControlButton onClick={() => settings.setCardTextColorMode('dark')} isActive={settings.cardTextColorMode === 'dark'}>{t('dark')}</SegmentedControlButton>
                            </div>
                        </VerticalSetting>

                        <VerticalSetting icon={FontIcon} label={t('fontStyle')}>
                            <div className="w-full flex items-center p-1 rounded-md bg-white/5">
                                <SegmentedControlButton onClick={() => settings.setFont('system')} isActive={settings.font === 'system'}>{t('system')}</SegmentedControlButton>
                                <SegmentedControlButton onClick={() => settings.setFont('serif')} isActive={settings.font === 'serif'}>{t('serif')}</SegmentedControlButton>
                                <SegmentedControlButton onClick={() => settings.setFont('monospace')} isActive={settings.font === 'monospace'}>{t('mono')}</SegmentedControlButton>
                            </div>
                        </VerticalSetting>

                        <SettingRow icon={AnimationIcon} label={t('animations')}><ToggleSwitch isOn={settings.animationsEnabled} onToggle={() => settings.setAnimationsEnabled(!settings.animationsEnabled)} theme={settings.theme as 'dark'|'light'} accentColor={settings.accentColor} /></SettingRow>
                    </div>
                    
                     <SectionHeader title={t('colors')}/>
                     <div className="bg-black/20 p-2 rounded-lg">
                        <SettingRow icon={ColorPaletteIcon} label={t('accentColor')}><input type="color" value={settings.accentColor} onChange={(e) => settings.setAccentColor(e.target.value)} className="h-8 w-10 rounded-md" /></SettingRow>
                        <CustomColorInput label={t('temperature')} color={settings.temperatureColor} setColor={settings.setTemperatureColor} accentColor={settings.accentColor} />
                        <CustomColorInput label={t('weather')} color={settings.weatherColor} setColor={settings.setWeatherColor} accentColor={settings.accentColor} />
                        <CustomColorInput label={t('humidity')} color={settings.humidityColor} setColor={settings.setHumidityColor} accentColor={settings.accentColor} />
                        <CustomColorInput label={t('door')} color={settings.doorColor} setColor={settings.setDoorColor} accentColor={settings.accentColor} />
                    </div>

                    <SectionHeader title={t('backgrounds')}/>
                     <div className="bg-black/20 p-4 rounded-lg space-y-4">
                        <BackgroundImageControl label={t('darkThemeBgImage')} customBg={settings.customBgDark} setCustomBg={settings.setCustomBgDark} t={t} />
                        <SettingRow icon={ColorPaletteIcon} label={t('darkThemeBgColor')}>
                            <input 
                                type="color" 
                                value={settings.bgColorDark} 
                                onChange={(e) => settings.setBgColorDark(e.target.value)} 
                                className="h-8 w-10 rounded-md"
                            />
                        </SettingRow>
                        <div className="border-t border-white/10 !my-2"></div>
                        <BackgroundImageControl label={t('lightThemeBgImage')} customBg={settings.customBgLight} setCustomBg={settings.setCustomBgLight} t={t} />
                        <SettingRow icon={ColorPaletteIcon} label={t('lightThemeBgColor')}>
                            <input
                                type="color"
                                value={settings.bgColorLight}
                                onChange={(e) => settings.setBgColorLight(e.target.value)}
                                className="h-8 w-10 rounded-md"
                            />
                        </SettingRow>
                        <p className="text-xs text-gray-500 pt-2 text-center">{t('bgNote')}</p>
                    </div>

                    <SectionHeader title={t('advanced')} />
                    <div className="bg-black/20 p-2 rounded-lg flex items-center justify-center space-x-4">
                        <button onClick={() => {
                            navigator.clipboard.writeText(settings.exportSettings());
                            alert(t('settingsCopied'));
                        }} className="flex items-center space-x-2 upload-btn">
                            <ExportIcon className="w-5 h-5" /><span>{t('export')}</span>
                        </button>
                         <button onClick={() => {
                            const data = prompt(t('pasteSettingsPrompt'));
                            if (data) {
                                if (!settings.importSettings(data)) {
                                    alert(t('importError'));
                                }
                            }
                         }} className="flex items-center space-x-2 upload-btn">
                             <ImportIcon className="w-5 h-5" /><span>{t('import')}</span>
                         </button>
                    </div>
                </div>
                <footer className="p-4 border-t border-white/10 flex-shrink-0">
                    <button
                        onClick={settings.resetSettings}
                        className="w-full py-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 transition-colors font-medium"
                    >
                        {t('resetToDefaults')}
                    </button>
                </footer>
            </div>
        </div>
    );
};