import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - 6 themes (2 dark, 4 light)
export const themes = {
  // LIGHT THEMES
  oceanBreeze: {
    name: 'Ocean Breeze',
    type: 'light',
    icon: '🌊',
    colors: {
      primary: '#0284C7',        // sky-600
      primaryHover: '#0369A1',   // sky-700
      secondary: '#06B6D4',      // cyan-500
      accent: '#14B8A6',         // teal-500
      background: '#F0F9FF',     // sky-50
      surface: '#FFFFFF',
      surfaceHover: '#F0F9FF',
      text: '#0C4A6E',           // sky-900
      textSecondary: '#0369A1',  // sky-700
      textMuted: '#7DD3FC',      // sky-300
      border: '#BAE6FD',         // sky-200
      borderLight: '#E0F2FE',    // sky-100
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradient: 'from-sky-500 via-cyan-500 to-teal-500',
      cardGradient: 'from-sky-100 to-cyan-50',
      headerGradient: 'from-sky-600 via-cyan-600 to-teal-600',
      loginGradient: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 50%, #14B8A6 100%)',
      sidebarGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%)',
      navHoverGradient: 'linear-gradient(90deg, rgba(2, 132, 199, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)'
    }
  },
  
  lavenderDream: {
    name: 'Lavender Dream',
    type: 'light',
    icon: '💜',
    colors: {
      primary: '#7C3AED',        // violet-600
      primaryHover: '#6D28D9',   // violet-700
      secondary: '#A855F7',      // purple-500
      accent: '#EC4899',         // pink-500
      background: '#FAF5FF',     // purple-50
      surface: '#FFFFFF',
      surfaceHover: '#FAF5FF',
      text: '#4C1D95',           // violet-900
      textSecondary: '#6D28D9',  // violet-700
      textMuted: '#C4B5FD',      // violet-300
      border: '#DDD6FE',         // violet-200
      borderLight: '#EDE9FE',    // violet-100
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradient: 'from-violet-500 via-purple-500 to-pink-500',
      cardGradient: 'from-violet-100 to-purple-50',
      headerGradient: 'from-violet-600 via-purple-600 to-pink-600',
      loginGradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
      sidebarGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%)',
      navHoverGradient: 'linear-gradient(90deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
    }
  },
  
  mintFresh: {
    name: 'Mint Fresh',
    type: 'light',
    icon: '🌿',
    colors: {
      primary: '#059669',        // emerald-600
      primaryHover: '#047857',   // emerald-700
      secondary: '#10B981',      // emerald-500
      accent: '#14B8A6',         // teal-500
      background: '#ECFDF5',     // emerald-50
      surface: '#FFFFFF',
      surfaceHover: '#ECFDF5',
      text: '#064E3B',           // emerald-900
      textSecondary: '#047857',  // emerald-700
      textMuted: '#6EE7B7',      // emerald-300
      border: '#A7F3D0',         // emerald-200
      borderLight: '#D1FAE5',    // emerald-100
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      cardGradient: 'from-emerald-100 to-teal-50',
      headerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      loginGradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #14B8A6 100%)',
      sidebarGradient: 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)',
      navHoverGradient: 'linear-gradient(90deg, rgba(5, 150, 105, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
    }
  },
  
  // DARK THEMES
  sunsetOrange: {
    name: 'Ember Night',
    type: 'dark',
    icon: '🔥',
    colors: {
      primary: '#F97316',        // orange-500
      primaryHover: '#EA580C',   // orange-600
      secondary: '#FB923C',      // orange-400
      accent: '#FBBF24',         // amber-400
      background: '#1A0F0A',     // custom dark orange-brown
      surface: '#251710',        // custom dark surface
      surfaceHover: '#2F1E15',   // custom hover
      text: '#FFEDD5',           // orange-100
      textSecondary: '#FB923C',  // orange-400
      textMuted: '#9A3412',      // orange-800
      border: '#431407',         // orange-950
      borderLight: '#7C2D12',    // orange-900
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      gradient: 'from-orange-600 via-amber-600 to-yellow-600',
      cardGradient: 'from-orange-900/50 to-amber-900/30',
      headerGradient: 'from-orange-900 via-amber-900 to-yellow-900',
      loginGradient: 'linear-gradient(135deg, #1A0F0A 0%, #431407 30%, #7C2D12 60%, #EA580C 100%)',
      sidebarGradient: 'linear-gradient(180deg, #251710 0%, #1A0F0A 100%)',
      navHoverGradient: 'linear-gradient(90deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)'
    }
  },
  midnightPurple: {
    name: 'Midnight Purple',
    type: 'dark',
    icon: '🔮',
    colors: {
      primary: '#A855F7',        // purple-500
      primaryHover: '#9333EA',   // purple-600
      secondary: '#C084FC',      // purple-400
      accent: '#E879F9',         // fuchsia-400
      background: '#0F0A1A',     // custom dark purple
      surface: '#1A1025',        // custom dark surface
      surfaceHover: '#251636',   // custom hover
      text: '#F3E8FF',           // purple-100
      textSecondary: '#C084FC',  // purple-400
      textMuted: '#6B21A8',      // purple-800
      border: '#3B0764',         // purple-950
      borderLight: '#581C87',    // purple-900
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      cardGradient: 'from-purple-900/50 to-fuchsia-900/30',
      headerGradient: 'from-purple-900 via-fuchsia-900 to-pink-900',
      loginGradient: 'linear-gradient(135deg, #1A1025 0%, #3B0764 30%, #581C87 60%, #7C3AED 100%)',
      sidebarGradient: 'linear-gradient(180deg, #1A1025 0%, #0F0A1A 100%)',
      navHoverGradient: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)'
    }
  },
  
  darkForest: {
    name: 'Dark Forest',
    type: 'dark',
    icon: '🌲',
    colors: {
      primary: '#22C55E',        // green-500
      primaryHover: '#16A34A',   // green-600
      secondary: '#4ADE80',      // green-400
      accent: '#2DD4BF',         // teal-400
      background: '#0A1410',     // custom dark green
      surface: '#0F1F17',        // custom dark surface
      surfaceHover: '#162920',   // custom hover
      text: '#DCFCE7',           // green-100
      textSecondary: '#4ADE80',  // green-400
      textMuted: '#166534',      // green-800
      border: '#14532D',         // green-900
      borderLight: '#166534',    // green-800
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      cardGradient: 'from-green-900/50 to-emerald-900/30',
      headerGradient: 'from-green-900 via-emerald-900 to-teal-900',
      loginGradient: 'linear-gradient(135deg, #0A1410 0%, #14532D 30%, #166534 60%, #22C55E 100%)',
      sidebarGradient: 'linear-gradient(180deg, #0F1F17 0%, #0A1410 100%)',
      navHoverGradient: 'linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
    }
  }
};

// Create context
const ThemeContext = createContext();

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Get saved theme from localStorage or default to lavenderDream
    const saved = localStorage.getItem('fithum-theme');
    return saved && themes[saved] ? saved : 'lavenderDream';
  });

  const theme = themes[currentTheme];

  // Save theme preference when changed
  useEffect(() => {
    localStorage.setItem('fithum-theme', currentTheme);
    
    // Apply theme to document root for global CSS access
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set data-theme attribute for CSS selectors
    root.setAttribute('data-theme', theme.type);
    
    // Set scrollbar colors based on theme
    root.style.setProperty('--scrollbar-thumb', `${theme.colors.primary}60`);
    root.style.setProperty('--scrollbar-thumb-hover', `${theme.colors.primary}90`);
    
    // Set body background
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
  }, [currentTheme, theme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleDarkMode = () => {
    const currentType = theme.type;
    const otherThemes = Object.entries(themes).filter(([_, t]) => t.type !== currentType);
    if (otherThemes.length > 0) {
      setCurrentTheme(otherThemes[0][0]);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentTheme, 
      themes, 
      switchTheme, 
      toggleDarkMode,
      isDark: theme.type === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
