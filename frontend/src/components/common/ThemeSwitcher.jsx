import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme, themes } from '../../context/ThemeContext';
import { FaPalette, FaSun, FaMoon, FaCheck, FaTimes } from 'react-icons/fa';

const ThemeSwitcher = ({ isCollapsed, inNavbar }) => {
  const { theme, currentTheme, switchTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside (for navbar mode)
  useEffect(() => {
    if (inNavbar) {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [inNavbar]);

  const lightThemes = Object.entries(themes).filter(([_, t]) => t.type === 'light');
  const darkThemes = Object.entries(themes).filter(([_, t]) => t.type === 'dark');

  // Theme list content (shared between modal and dropdown)
  const ThemeContent = () => (
    <>
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ 
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
      >
        <div>
          <h3 className="font-bold text-sm">Choose Theme</h3>
          <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            {isDark ? 'Dark mode active' : 'Light mode active'}
          </p>
        </div>
        {!inNavbar && (
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors"
            style={{ color: theme.colors.textSecondary }}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Light Themes */}
      <div className="p-2">
        <p 
          className="px-2 py-1 text-xs font-semibold uppercase flex items-center gap-2"
          style={{ color: theme.colors.textSecondary }}
        >
          <FaSun className="text-amber-500" />
          Light Themes
        </p>
        {lightThemes.map(([key, t]) => (
          <button
            key={key}
            onClick={() => {
              switchTheme(key);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-black/5"
            style={{
              backgroundColor: currentTheme === key ? theme.colors.borderLight : 'transparent',
              color: theme.colors.text
            }}
          >
            <span className="text-xl">{t.icon}</span>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{t.name}</p>
            </div>
            <div className="flex gap-1">
              {[t.colors.primary, t.colors.secondary, t.colors.accent].map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {currentTheme === key && (
              <FaCheck className="text-green-500" />
            )}
          </button>
        ))}
      </div>

      {/* Dark Themes */}
      <div className="p-2 border-t" style={{ borderColor: theme.colors.border }}>
        <p 
          className="px-2 py-1 text-xs font-semibold uppercase flex items-center gap-2"
          style={{ color: theme.colors.textSecondary }}
        >
          <FaMoon className="text-purple-500" />
          Dark Themes
        </p>
        {darkThemes.map(([key, t]) => (
          <button
            key={key}
            onClick={() => {
              switchTheme(key);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-black/5"
            style={{
              backgroundColor: currentTheme === key ? theme.colors.borderLight : 'transparent',
              color: theme.colors.text
            }}
          >
            <span className="text-xl">{t.icon}</span>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{t.name}</p>
            </div>
            <div className="flex gap-1">
              {[t.colors.primary, t.colors.secondary, t.colors.accent].map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {currentTheme === key && (
              <FaCheck className="text-green-500" />
            )}
          </button>
        ))}
      </div>
    </>
  );

  // Modal for sidebar (uses portal to render at body level)
  const ThemeModal = () => {
    if (!isOpen || inNavbar) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto sidebar-scrollbar animate-fadeIn"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ThemeContent />
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
        style={{
          backgroundColor: inNavbar 
            ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)') 
            : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
          color: inNavbar && !isDark ? 'white' : theme.colors.text
        }}
        title="Change Theme"
      >
        <FaPalette className="text-lg" />
        <span className={`text-sm font-medium ${isCollapsed ? 'hidden' : 'hidden md:inline'}`}>Theme</span>
        {!isCollapsed && <span className="text-lg">{theme.icon}</span>}
      </button>

      {/* Dropdown for navbar (absolute positioning) */}
      {isOpen && inNavbar && (
        <div 
          className="absolute top-full mt-2 right-0 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto sidebar-scrollbar"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <ThemeContent />
        </div>
      )}

      {/* Modal for sidebar */}
      <ThemeModal />
    </div>
  );
};

export default ThemeSwitcher;
