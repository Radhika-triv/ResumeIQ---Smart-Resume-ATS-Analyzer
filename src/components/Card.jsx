import React from 'react';

/**
 * Reusable Card component featuring premium glassmorphism designs.
 *
 * @param {Object} props
 * @param {string} [props.title] - Optional title for the card
 * @param {string} [props.description] - Optional subtext/description
 * @param {React.ReactNode} [props.headerIcon] - Optional Lucide icon for the card header
 * @param {boolean} [props.interactive=false] - Enables lift & border glow on hover
 * @param {React.ReactNode} [props.actions] - Optional action components aligned in header
 */
export default function Card({
  children,
  title,
  description,
  headerIcon: Icon,
  interactive = false,
  actions,
  className = '',
  ...rest
}) {
  const baseClasses = 'glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300';
  const hoverClasses = interactive ? 'glass-panel-hover gradient-border-glow' : 'gradient-border-glow';
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...rest}
    >
      {/* Visual background ambient light */}
      {interactive && (
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-indigo/10 blur-[80px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-brand-indigo/20" />
      )}

      {/* Card Header */}
      {(title || Icon || actions) && (
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo shadow-inner">
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-semibold text-white tracking-tight leading-tight">{title}</h3>}
              {description && <p className="text-xs text-gray-400 mt-1 font-medium">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="relative z-10 text-gray-300 text-sm font-sans leading-relaxed">
        {children}
      </div>
    </div>
  );
}
