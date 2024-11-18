// App.jsx

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import {
  Sun,
  Moon,
  Settings,
  X,
  Check,
  Eye,
  EyeOff,
  Download,
  Upload,
  Share2,
  Heart,
  Palette,
  Sliders,
  RefreshCw,
  Copy,
  Info,
  Search,
  Grid,
  List
} from 'lucide-react';

// Custom Tooltip Components
const TooltipProvider = ({ children }) => children;

const Tooltip = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded whitespace-nowrap">
          {children[1].props.children}
        </div>
      )}
    </div>
  );
};

const TooltipTrigger = ({ children }) => children;
const TooltipContent = ({ children }) => children;

// Custom Alert Component
const Alert = ({ children }) => (
  <div className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded">
    {children}
  </div>
);

const AlertDescription = ({ children }) => (
  <div className="text-sm text-gray-700 flex items-center gap-2">
    {children}
  </div>
);

// Theme Context with enhanced features
const ThemeContext = createContext();

// Extended Font Sizes
const fontSizes = {
  xs: {
    base: '0.75rem',
    heading: '1.25rem'
  },
  small: {
    base: '0.875rem',
    heading: '1.5rem'
  },
  medium: {
    base: '1rem',
    heading: '1.875rem'
  },
  large: {
    base: '1.125rem',
    heading: '2.25rem'
  },
  xl: {
    base: '1.25rem',
    heading: '2.5rem'
  }
};

// Animation Presets
const animations = {
  none: '',
  fade: 'transition-opacity duration-300',
  scale: 'transition-transform duration-300 hover:scale-105',
  bounce: 'transition-transform hover:animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin'
};

// Enhanced Customization Modal
const CustomizationModal = ({ isOpen, onClose }) => {
  const {
    currentTheme,
    setCurrentTheme,
    fontSize,
    setFontSize,
    spacing,
    setSpacing,
    themes,
    animation,
    setAnimation,
    borderRadius,
    setBorderRadius,
    contrast,
    setContrast,
    shadow,
    setShadow
  } = useContext(ThemeContext);

  const [activeTab, setActiveTab] = useState('general');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    fontSize,
    spacing,
    animation,
    borderRadius,
    contrast,
    shadow
  });

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = () => {
    setFontSize(localSettings.fontSize);
    setSpacing(localSettings.spacing);
    setAnimation(localSettings.animation);
    setBorderRadius(localSettings.borderRadius);
    setContrast(localSettings.contrast);
    setShadow(localSettings.shadow);
    onClose();
  };

  const exportSettings = () => {
    const settings = {
      theme: currentTheme,
      ...localSettings
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result);
          setLocalSettings(settings);
          if (settings.theme && themes[settings.theme]) {
            setCurrentTheme(settings.theme);
          }
        } catch (error) {
          console.error('Error importing settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="rounded-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-hidden"
        style={{ 
          backgroundColor: themes[currentTheme].colors.background,
          color: themes[currentTheme].colors.text,
          boxShadow: `0 4px 20px ${themes[currentTheme].colors.primary}40`
        }}
      >
        {/* Modal Header */}
        <div className="p-4 border-b" style={{ borderColor: themes[currentTheme].colors.secondary }}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Customize Theme</h2>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="p-2 rounded-full hover:bg-opacity-80"
                      style={{ backgroundColor: themes[currentTheme].colors.secondary }}
                    >
                      {showAdvanced ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-opacity-80"
                style={{ backgroundColor: themes[currentTheme].colors.secondary }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            {['general', 'typography', 'effects', 'export'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeTab === tab ? themes[currentTheme].colors.primary : themes[currentTheme].colors.secondary,
                  color: activeTab === tab ? '#fff' : themes[currentTheme].colors.text
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Font Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(fontSizes).map(size => (
                    <button
                      key={size}
                      onClick={() => handleChange('fontSize', size)}
                      className="px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: localSettings.fontSize === size ? themes[currentTheme].colors.primary : themes[currentTheme].colors.secondary,
                        color: localSettings.fontSize === size ? '#fff' : themes[currentTheme].colors.text
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Spacing</h3>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={localSettings.spacing}
                  onChange={(e) => handleChange('spacing', Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: themes[currentTheme].colors.primary
                  }}
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>Compact</span>
                  <span>Spacious</span>
                </div>
              </div>

              {showAdvanced && (
                <div>
                  <h3 className="font-semibold mb-2">Border Radius</h3>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={localSettings.borderRadius}
                    onChange={(e) => handleChange('borderRadius', Number(e.target.value))}
                    className="w-full"
                    style={{
                      accentColor: themes[currentTheme].colors.primary
                    }}
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span>Square</span>
                    <span>Round</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Contrast</h3>
                <input
                  type="range"
                  min="80"
                  max="120"
                  value={localSettings.contrast}
                  onChange={(e) => handleChange('contrast', Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: themes[currentTheme].colors.primary
                  }}
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>Lower</span>
                  <span>Higher</span>
                </div>
              </div>

              {showAdvanced && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Animation Style</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(animations).map(anim => (
                        <button
                          key={anim}
                          onClick={() => handleChange('animation', anim)}
                          className={`px-3 py-2 rounded ${animations[anim]}`}
                          style={{
                            backgroundColor: localSettings.animation === anim ? themes[currentTheme].colors.primary : themes[currentTheme].colors.secondary,
                            color: localSettings.animation === anim ? '#fff' : themes[currentTheme].colors.text
                          }}
                        >
                          {anim.charAt(0).toUpperCase() + anim.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Shadow Intensity</h3>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localSettings.shadow}
                      onChange={(e) => handleChange('shadow', Number(e.target.value))}
                      className="w-full"
                      style={{
                        accentColor: themes[currentTheme].colors.primary
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="p-4 rounded"
                  style={{ backgroundColor: themes[currentTheme].colors.secondary }}
                >
                  <h4 className="font-semibold mb-2">Preview Text</h4>
                  <p style={{ 
                    fontSize: fontSizes[localSettings.fontSize].base,
                    filter: `contrast(${localSettings.contrast}%)`
                  }}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>

                <div 
                  className="p-4 rounded"
                  style={{ backgroundColor: themes[currentTheme].colors.secondary }}
                >
                  <h4 className="font-semibold mb-2">Button Preview</h4>
                  <button
                    className={`px-4 py-2 rounded ${animations[localSettings.animation]}`}
                    style={{ 
                      backgroundColor: themes[currentTheme].colors.primary,
                      color: '#fff',
                      borderRadius: `${localSettings.borderRadius}px`,
                      boxShadow: `0 ${localSettings.shadow * 0.02}px ${localSettings.shadow * 0.1}px ${themes[currentTheme].colors.primary}40`
                    }}
                  >
                    Sample Button
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Export/Import Settings</h3>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={exportSettings}
                    className="flex items-center gap-2 px-4 py-2 rounded w-full"
                    style={{ backgroundColor: themes[currentTheme].colors.primary, color: '#fff' }}
                  >
                    <Download className="w-5 h-5" />
                    Export Current Settings
                  </button>
                  
                  <label className="flex items-center gap-2 px-4 py-2 rounded w-full cursor-pointer"
                    style={{ backgroundColor: themes[currentTheme].colors.secondary }}
                  >
                    <Upload className="w-5 h-5" />
                    Import Settings
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Exported settings include your current theme, font size, spacing, and all customization options.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t" style={{ borderColor: themes[currentTheme].colors.secondary }}>
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded"
              style={{ backgroundColor: themes[currentTheme].colors.secondary }}
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: themes[currentTheme].colors.primary }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Theme Grid
const ThemeGrid = () => {
  const { 
    currentTheme, 
    setCurrentTheme, 
    themes,
    animation,
    borderRadius,
    shadow 
  } = useContext(ThemeContext);
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteThemes');
    return saved ? JSON.parse(saved) : [];
  });

  const [sortBy, setSortBy] = useState('name'); // 'name', 'type', 'recent'
  const [recentThemes, setRecentThemes] = useState(() => {
    const saved = localStorage.getItem('recentThemes');
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites and recent themes to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteThemes', JSON.stringify(favorites));
    localStorage.setItem('recentThemes', JSON.stringify(recentThemes));
  }, [favorites, recentThemes]);

  // Update recent themes when changing theme
  useEffect(() => {
    if (currentTheme) {
      setRecentThemes(prev => {
        const newRecent = [currentTheme, ...prev.filter(t => t !== currentTheme)].slice(0, 5);
        return newRecent;
      });
    }
  }, [currentTheme]);

  const toggleFavorite = useCallback((themeKey) => {
    setFavorites(prev => {
      if (prev.includes(themeKey)) {
        return prev.filter(k => k !== themeKey);
      }
      return [...prev, themeKey];
    });
  }, []);

  const filteredThemes = Object.entries(themes)
    .filter(([key, theme]) => {
      const matchesFilter = filter === 'all' || 
                          (filter === 'favorites' && favorites.includes(key)) ||
                          key.startsWith(filter);
      const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          key.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a[1].name.localeCompare(b[1].name);
      }
      if (sortBy === 'type') {
        return a[0].localeCompare(b[0]);
      }
      if (sortBy === 'recent') {
        const aIndex = recentThemes.indexOf(a[0]);
        const bIndex = recentThemes.indexOf(b[0]);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      return 0;
    });

  const copyThemeColors = (theme) => {
    const colorString = JSON.stringify(theme.colors, null, 2);
    navigator.clipboard.writeText(colorString);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-lg font-bold">Choose Your Theme</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg pl-10"
              style={{
                backgroundColor: themes[currentTheme].colors.secondary,
                color: themes[currentTheme].colors.text,
                borderRadius: `${borderRadius}px`,
                boxShadow: `0 ${shadow * 0.02}px ${shadow * 0.1}px ${themes[currentTheme].colors.primary}40`
              }}
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${animation}`}
              style={{
                backgroundColor: view === 'grid' ? themes[currentTheme].colors.primary : themes[currentTheme].colors.secondary,
                color: view === 'grid' ? '#fff' : themes[currentTheme].colors.text,
                borderRadius: `${borderRadius}px`
              }}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${animation}`}
              style={{
                backgroundColor: view === 'list' ? themes[currentTheme].colors.primary : themes[currentTheme].colors.secondary,
                color: view === 'list' ? '#fff' : themes[currentTheme].colors.text,
                borderRadius: `${borderRadius}px`
              }}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex gap-2 flex-wrap">
          {['all', 'light', 'dark', 'special','seasonal',"accent" , "pastel","neutral","gradient","earth", 'favorites'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg ${animation}`}
              style={{
                backgroundColor: filter === type ? themes[currentTheme].colors.primary : themes[currentTheme].colors.secondary,
                color: filter === type ? '#fff' : themes[currentTheme].colors.text,
                borderRadius: `${borderRadius}px`
              }}
            >
              {type === 'favorites' ? (
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" fill={filter === 'favorites' ? '#fff' : 'none'} />
                  <span>Favorites</span>
                </div>
              ) : (
                type.charAt(0).toUpperCase() + type.slice(1)
              )}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg"
          style={{
            backgroundColor: themes[currentTheme].colors.secondary,
            color: themes[currentTheme].colors.text,
            borderRadius: `${borderRadius}px`
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="type">Sort by Type</option>
          <option value="recent">Sort by Recent</option>
        </select>
      </div>

      {/* Theme Grid/List View */}
      <div 
        className={`overflow-y-auto max-h-[70vh] rounded-lg p-4 ${animation}`}
        style={{
          backgroundColor: themes[currentTheme].colors.secondary,
          borderRadius: `${borderRadius}px`
        }}
      >
        <div className={view === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-4"
        }>
          {filteredThemes.map(([key, theme]) => (
            <div
              key={key}
              onClick={() => setCurrentTheme(key)}
              className={`${animation} cursor-pointer`}
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderRadius: `${borderRadius}px`,
                boxShadow: `0 ${shadow * 0.02}px ${shadow * 0.1}px ${themes[currentTheme].colors.primary}40`
              }}
            >
              {view === 'grid' ? (
                <GridViewItem
                  theme={theme}
                  themeKey={key}
                  isActive={currentTheme === key}
                  isFavorite={favorites.includes(key)}
                  onFavorite={() => toggleFavorite(key)}
                  onCopy={() => copyThemeColors(theme)}
                  borderRadius={borderRadius}
                />
              ) : (
                <ListViewItem
                  theme={theme}
                  themeKey={key}
                  isActive={currentTheme === key}
                  isFavorite={favorites.includes(key)}
                  onFavorite={() => toggleFavorite(key)}
                  onCopy={() => copyThemeColors(theme)}
                  borderRadius={borderRadius}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Grid View Item Component
const GridViewItem = ({ theme, themeKey, isActive, isFavorite, onFavorite, onCopy, borderRadius }) => (
  <div className="p-4 space-y-3">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold truncate flex-grow">
        {theme.name}
      </h3>
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className="p-1 rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            className="w-4 h-4"
            fill={isFavorite ? theme.colors.accent : 'none'}
            stroke={theme.colors.accent}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="p-1 rounded-full hover:scale-110 transition-transform"
        >
          <Copy className="w-4 h-4" stroke={theme.colors.accent} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-5 gap-1">
      {Object.entries(theme.colors).map(([colorName, colorValue]) => (
        <div
          key={colorName}
          className="relative group"
          title={`${colorName}: ${colorValue}`}
        >
          <div
            className="w-full h-6 transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: colorValue,
              borderRadius: `${borderRadius}px`
            }}
          />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 
            bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 
            transition-opacity whitespace-nowrap pointer-events-none z-10">
            {colorName}
          </span>
        </div>
      ))}
    </div>

    {isActive && (
      <div className="absolute top-2 right-2">
        <Check className="w-4 h-4" style={{ color: theme.colors.accent }} />
      </div>
    )}
  </div>
);

// List View Item Component
const ListViewItem = ({ theme, themeKey, isActive, isFavorite, onFavorite, onCopy, borderRadius }) => (
  <div className="p-4 flex items-center gap-4">
    <div className="flex-grow">
      <h3 className="font-semibold">{theme.name}</h3>
      <div className="text-sm opacity-75">{themeKey}</div>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {Object.entries(theme.colors).map(([colorName, colorValue]) => (
          <div
            key={colorName}
            className="relative group"
            title={`${colorName}: ${colorValue}`}
          >
            <div
              className="w-6 h-6 transition-transform group-hover:scale-110"
              style={{ 
                backgroundColor: colorValue,
                borderRadius: `${borderRadius}px`
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className="p-1 rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            className="w-4 h-4"
            fill={isFavorite ? theme.colors.accent : 'none'}
            stroke={theme.colors.accent}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="p-1 rounded-full hover:scale-110 transition-transform"
        >
          <Copy className="w-4 h-4" stroke={theme.colors.accent} />
        </button>
      </div>

      {isActive && (
        <Check className="w-4 h-4" style={{ color: theme.colors.accent }} />
      )}
    </div>
  </div>
);

// Header Component
const Header = () => {
  const { 
    isDark, 
    toggleDark, 
    currentTheme, 
    themes,
    animation,
    borderRadius,
    shadow 
  } = useContext(ThemeContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showThemeInfo, setShowThemeInfo] = useState(false);
  
  return (
    <header 
      className={`p-4 flex justify-between items-center ${animation}`}
      style={{
        backgroundColor: themes[currentTheme].colors.secondary,
        color: themes[currentTheme].colors.text,
        borderRadius: `${borderRadius}px`,
        boxShadow: `0 ${shadow * 0.02}px ${shadow * 0.1}px ${themes[currentTheme].colors.primary}40`
      }}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Theme Switcher</h1>
        <button
          onClick={() => setShowThemeInfo(!showThemeInfo)}
          className="p-2 rounded-full hover:bg-opacity-80"
          style={{ 
            backgroundColor: themes[currentTheme].colors.primary,
            borderRadius: `${borderRadius}px`
          }}
        >
          <Info className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 rounded-full hover:bg-opacity-80 ${animation}`}
          style={{ 
            backgroundColor: themes[currentTheme].colors.primary,
            borderRadius: `${borderRadius}px`
          }}
        >
          <Settings className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={toggleDark}
          className={`p-2 rounded-full hover:bg-opacity-80 ${animation}`}
          style={{ 
            backgroundColor: themes[currentTheme].colors.primary,
            borderRadius: `${borderRadius}px`
          }}
        >
          {isDark ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-white" />}
        </button>
      </div>

      <CustomizationModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {showThemeInfo && (
        <div 
          className="absolute top-20 right-4 p-4 rounded-lg z-50"
          style={{
            backgroundColor: themes[currentTheme].colors.background,
            color: themes[currentTheme].colors.text,
            borderRadius: `${borderRadius}px`,
            boxShadow: `0 ${shadow * 0.02}px ${shadow * 0.1}px ${themes[currentTheme].colors.primary}40`
          }}
        >
          <div className="space-y-2">
            <h3 className="font-bold">Current Theme: {themes[currentTheme].name}</h3>
            <div className="text-sm">
              <p>Type: {currentTheme.split(/\d+/)[0]}</p>
              <p>ID: {currentTheme}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// ThemePreview Component
const ThemePreview = ({ theme, animation, borderRadius, shadow }) => {
  const { colors } = theme;

  return (
    <div 
      className={`p-6 rounded-lg ${animation}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderRadius: `${borderRadius}px`,
        boxShadow: `0 ${shadow * 0.02}px ${shadow * 0.1}px ${colors.primary}40`
      }}
    >
      <div className="space-y-6">
        {/* Text Samples */}
        <div className="space-y-2">
          <h3 style={{ color: colors.primary }} className="text-2xl font-bold">
            Sample Heading
          </h3>
          <p className="text-base">
            This is a sample paragraph showing how text appears with this theme.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-lg ${animation}`}
            style={{
              backgroundColor: colors.primary,
              color: '#fff',
              borderRadius: `${borderRadius}px`
            }}
          >
            Primary Button
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${animation}`}
            style={{
              backgroundColor: colors.secondary,
              color: colors.text,
              borderRadius: `${borderRadius}px`
            }}
          >
            Secondary Button
          </button>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <h4 className="font-semibold">Color Palette</h4>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(colors).map(([name, value]) => (
              <div
                key={name}
                className="flex flex-col items-center"
              >
                <div
                  className="w-full h-10 rounded-lg"
                  style={{
                    backgroundColor: value,
                    borderRadius: `${borderRadius}px`
                  }}
                />
                <span className="text-xs mt-1">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Card */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: colors.secondary,
            borderRadius: `${borderRadius}px`
          }}
        >
          <h4 style={{ color: colors.primary }} className="font-semibold">
            Card Example
          </h4>
          <p className="text-sm mt-2">
            This is how a card component would look with this theme.
          </p>
        </div>

        {/* Interactive Elements */}
        <div className="flex flex-wrap gap-4">
          <div
            className={`p-3 rounded-lg cursor-pointer ${animation}`}
            style={{
              backgroundColor: colors.secondary,
              borderRadius: `${borderRadius}px`
            }}
          >
            Hover Me
          </div>
          <div
            className={`p-3 rounded-lg ${animation}`}
            style={{
              backgroundColor: colors.accent,
              color: '#fff',
              borderRadius: `${borderRadius}px`
            }}
          >
            Accent Element
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [themes, setThemes] = useState({});
  const [currentTheme, setCurrentTheme] = useState('light1');
  const [fontSize, setFontSize] = useState('medium');
  const [spacing, setSpacing] = useState(4);
  const [animation, setAnimation] = useState('scale');
  const [borderRadius, setBorderRadius] = useState(8);
  const [contrast, setContrast] = useState(100);
  const [shadow, setShadow] = useState(50);
  const isDark = currentTheme.startsWith('dark');

  const toggleDark = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const totalThemes = themeKeys.length;
    const halfWay = Math.floor(totalThemes / 2);
    
    if (isDark) {
      setCurrentTheme(themeKeys[currentIndex % halfWay]);
    } else {
      setCurrentTheme(themeKeys[halfWay + (currentIndex % halfWay)]);
    }
  };

  // Load all preferences from localStorage
  useEffect(() => {
    const loadPreferences = () => {
      const savedTheme = localStorage.getItem('theme') || 'light1';
      const savedFontSize = localStorage.getItem('fontSize') || 'medium';
      const savedSpacing = Number(localStorage.getItem('spacing')) || 4;
      const savedAnimation = localStorage.getItem('animation') || 'scale';
      const savedBorderRadius = Number(localStorage.getItem('borderRadius')) || 8;
      const savedContrast = Number(localStorage.getItem('contrast')) || 100;
      const savedShadow = Number(localStorage.getItem('shadow')) || 50;

      setCurrentTheme(savedTheme);
      setFontSize(savedFontSize);
      setSpacing(savedSpacing);
      setAnimation(savedAnimation);
      setBorderRadius(savedBorderRadius);
      setContrast(savedContrast);
      setShadow(savedShadow);
    };
    // Fixed fetch URL
    fetch('/themes.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setThemes(data);
        loadPreferences();
      })
      .catch(error => {
        console.error('Error loading themes:', error);
      });
  }, []);

  // Save all preferences to localStorage
  useEffect(() => {
    if (Object.keys(themes).length === 0) return;
    
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('spacing', spacing.toString());
    localStorage.setItem('animation', animation);
    localStorage.setItem('borderRadius', borderRadius.toString());
    localStorage.setItem('contrast', contrast.toString());
    localStorage.setItem('shadow', shadow.toString());
  }, [
    themes,
    currentTheme,
    fontSize,
    spacing,
    animation,
    borderRadius,
    contrast,
    shadow
  ]);

  // Loading state
  if (Object.keys(themes).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p>Loading themes...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setCurrentTheme, 
      isDark, 
      toggleDark,
      fontSize,
      setFontSize,
      spacing,
      setSpacing,
      animation,
      setAnimation,
      borderRadius,
      setBorderRadius,
      contrast,
      setContrast,
      shadow,
      setShadow,
      themes
    }}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: themes[currentTheme].colors.background,
          color: themes[currentTheme].colors.text,
          fontSize: fontSizes[fontSize].base,
          padding: `${spacing * 0.25}rem`
        }}
      >
        <Header />
        <main className="container mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Theme Preview Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h2 className="text-xl font-bold mb-4">Current Theme Preview</h2>
                <ThemePreview 
                  theme={themes[currentTheme]}
                  animation={animation}
                  borderRadius={borderRadius}
                  shadow={shadow}
                />
                
                {/* Quick Actions */}
                <div 
                  className={`mt-4 p-4 rounded-lg ${animation}`}
                  style={{
                    backgroundColor: themes[currentTheme].colors.secondary,
                    borderRadius: `${borderRadius}px`,
                    boxShadow: `0 ${shadow * 0.02}px ${shadow * 0.1}px ${themes[currentTheme].colors.primary}40`
                  }}
                >
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={toggleDark}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${animation}`}
                      style={{
                        backgroundColor: themes[currentTheme].colors.primary,
                        color: '#fff',
                        borderRadius: `${borderRadius}px`
                      }}
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      Toggle Mode
                    </button>
                    <button
                      onClick={() => {
                        const colors = themes[currentTheme].colors;
                        navigator.clipboard.writeText(JSON.stringify(colors, null, 2));
                      }}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${animation}`}
                      style={{
                        backgroundColor: themes[currentTheme].colors.secondary,
                        borderRadius: `${borderRadius}px`
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Copy Colors
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Grid */}
            <div className="lg:col-span-2">
              <ThemeGrid />
            </div>
          </div>
        </main>

        <footer 
          className={`mt-8 p-4 text-center rounded-lg ${animation}`}
          style={{ 
            backgroundColor: themes[currentTheme].colors.secondary,
            borderRadius: `${borderRadius}px`,
            boxShadow: `0 ${shadow * 0.02}px ${shadow * 0.1}px ${themes[currentTheme].colors.primary}40`
          }}
        >
          <p>Theme Switcher Demo - A comprehensive theme management system</p>
          <p>Developed by: Md Shahrier Islam Arham</p>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
