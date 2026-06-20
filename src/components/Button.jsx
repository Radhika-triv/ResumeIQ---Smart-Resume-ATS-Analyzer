import React from 'react';

/**
 * Reusable Button component with premium designs and animations.
 *
 * @param {Object} props
 * @param {string} [props.variant='primary'] - 'primary' | 'secondary' | 'glass' | 'outline' | 'danger' | 'success'
 * @param {string} [props.size='md'] - 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} [props.icon] - Optional Lucide icon component
 * @param {string} [props.iconPosition='left'] - 'left' | 'right'
 * @param {boolean} [props.fullWidth=false] - Whether button should take full width
 * @param {boolean} [props.loading=false] - Displays a loading spinner
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props.rest - Other standard button HTML attributes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...rest
}) {
  // Base classes for consistent sizing and transitions
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  // Variant mappings matching our premium design system
  const variants = {
    primary: 'gradient-bg text-white shadow-lg shadow-brand-indigo/20 hover:shadow-brand-indigo/35 hover:brightness-110',
    secondary: 'bg-dark-800 border border-dark-700 text-gray-200 hover:bg-dark-700 hover:text-white',
    glass: 'glass-panel text-white hover:bg-dark-900/80 hover:border-brand-indigo/30 shadow-sm',
    outline: 'bg-transparent border border-gray-600 text-gray-300 hover:border-brand-indigo hover:text-white',
    danger: 'bg-red-600/90 border border-red-500/30 text-white shadow-lg shadow-red-600/10 hover:bg-red-500',
    success: 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/10 hover:brightness-110',
  };

  // Size mapping
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  // Compose classes
  const widthClass = fullWidth ? 'w-full' : '';
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  return (
    <button
      disabled={disabled || loading}
      className={buttonClasses}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <span className="mr-2 inline-flex items-center"><Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} /></span>
      )}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex items-center"><Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} /></span>
      )}
    </button>
  );
}
