import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

/**
 * Custom themed dialog component for confirmations and alerts
 * 
 * Usage:
 * <ThemedDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   onConfirm={handleConfirm}  // Optional - makes it a confirm dialog
 *   title="Confirm Action"
 *   message="Are you sure you want to proceed?"
 *   type="warning" // 'warning' | 'success' | 'error' | 'info'
 *   confirmText="Yes, proceed"
 *   cancelText="Cancel"
 * />
 */

const ThemedDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure?',
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const { theme, isDark } = useTheme();

  if (!isOpen) return null;

  const icons = {
    warning: FaExclamationTriangle,
    success: FaCheckCircle,
    error: FaTimesCircle,
    info: FaInfoCircle
  };

  const iconColors = {
    warning: '#F59E0B',
    success: '#10B981',
    error: '#EF4444',
    info: theme.colors.primary
  };

  const Icon = icons[type] || icons.warning;
  const iconColor = iconColors[type] || iconColors.warning;

  const isConfirmDialog = typeof onConfirm === 'function';

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      {/* Dialog */}
      <div 
        className="relative w-full max-w-md rounded-2xl shadow-2xl transform transition-all animate-fade-in"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full transition-colors hover:bg-opacity-10"
          style={{ color: theme.colors.textSecondary }}
        >
          <FaTimes />
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon className="text-3xl" style={{ color: iconColor }} />
          </div>

          {/* Title */}
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            {title}
          </h3>

          {/* Message */}
          <p 
            className="mb-6"
            style={{ color: theme.colors.textSecondary }}
          >
            {message}
          </p>

          {/* Buttons */}
          <div className={`flex gap-3 ${isConfirmDialog ? 'justify-center' : 'justify-center'}`}>
            {isConfirmDialog && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f1f5f9',
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ 
                background: type === 'error' 
                  ? '#EF4444' 
                  : type === 'warning'
                  ? '#F59E0B'
                  : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                boxShadow: `0 4px 15px ${iconColor}30`
              }}
            >
              {isConfirmDialog ? confirmText : 'OK'}
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ThemedDialog;
