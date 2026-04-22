import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';

export type NavLink = {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

export type FloatingNavVariant = 'glass' | 'solid' | 'transparent';

export interface FloatingNavProps {
  logo: ReactNode;
  brandName?: string;
  links: NavLink[];
  rightSlot?: ReactNode;
  mobileFooterSlot?: ReactNode;
  variant?: FloatingNavVariant;
  scrollThreshold?: number;
  className?: string;
}

const containerBase =
  'mx-auto max-w-6xl flex items-center justify-between h-14 px-5 rounded-full transition-[background,backdrop-filter,box-shadow,border-color] duration-300 ease-out';

const variantClasses: Record<FloatingNavVariant, string> = {
  glass:
    'bg-[var(--glass-bg,rgba(255,255,255,0.65))] border border-[var(--glass-border,rgba(0,0,0,0.08))] shadow-[var(--glass-shadow,0_2px_8px_rgba(0,0,0,0.06))]',
  solid:
    'bg-[var(--bg)] border border-[var(--border)] shadow-[var(--shadow-sm,0_1px_3px_rgba(0,0,0,0.08))]',
  transparent:
    'bg-transparent border border-transparent',
};

const scrolledClasses =
  'bg-[var(--glass-bg,rgba(255,255,255,0.65))] border-[var(--glass-border,rgba(0,0,0,0.08))] shadow-[var(--glass-shadow,0_2px_8px_rgba(0,0,0,0.06))]';

const linkBase =
  'text-[13px] font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary,#0891b2)] rounded';

const linkIdle = 'text-[var(--text-2)] hover:text-[var(--text)]';
const linkActive = 'text-[var(--text)]';

const mobileLinkBase =
  'w-full text-left min-h-[44px] px-3 py-3 text-[15px] font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary,#0891b2)]';

const mobileLinkIdle = 'text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)]';
const mobileLinkActive = 'text-[var(--text)] bg-[var(--nav-active,var(--hover-bg))]';

export function FloatingNav({
  logo,
  brandName,
  links,
  rightSlot,
  mobileFooterSlot,
  variant = 'glass',
  scrollThreshold = 20,
  className = '',
}: FloatingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== 'transparent') return;
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant, scrollThreshold]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const isGlassy =
    variant === 'glass' || variant === 'solid' || (variant === 'transparent' && scrolled);

  const containerVariantClass =
    variant === 'transparent' && scrolled
      ? scrolledClasses
      : variantClasses[variant];

  const containerStyle =
    isGlassy && variant !== 'solid'
      ? { backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' }
      : undefined;

  const handleLinkClick = (link: NavLink) => {
    if (link.onClick) link.onClick();
    setMobileOpen(false);
  };

  const renderLink = (link: NavLink, idx: number, mobile = false) => {
    const classes = mobile
      ? `${mobileLinkBase} ${link.active ? mobileLinkActive : mobileLinkIdle}`
      : `${linkBase} ${link.active ? linkActive : linkIdle}`;

    if (link.href) {
      return (
        <a
          key={`${link.label}-${idx}`}
          href={link.href}
          className={classes}
          onClick={() => setMobileOpen(false)}
          aria-current={link.active ? 'page' : undefined}
        >
          {link.label}
        </a>
      );
    }

    return (
      <button
        key={`${link.label}-${idx}`}
        type="button"
        onClick={() => handleLinkClick(link)}
        className={classes}
        aria-current={link.active ? 'page' : undefined}
      >
        {link.label}
      </button>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3 ${className}`}
    >
      <nav
        aria-label="Main navigation"
        className={`${containerBase} ${containerVariantClass}`}
        style={containerStyle}
      >
        {/* Logo + brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex items-center shrink-0">{logo}</span>
          {brandName ? (
            <span className="text-base font-semibold tracking-tight text-[var(--text)] truncate">
              {brandName}
            </span>
          ) : null}
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link, idx) => renderLink(link, idx, false))}
        </div>

        {/* Right slot + mobile toggle */}
        <div className="flex items-center gap-2">
          {rightSlot ? (
            <div className="hidden md:flex items-center gap-2">{rightSlot}</div>
          ) : null}
          {rightSlot ? (
            <div className="md:hidden flex items-center gap-2">{rightSlot}</div>
          ) : null}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary,#0891b2)]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="floating-nav-mobile-drawer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="floating-nav-mobile-drawer"
        ref={drawerRef}
        className={`md:hidden mx-auto max-w-6xl mt-2 overflow-hidden rounded-2xl border transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen
            ? 'max-h-[80vh] opacity-100 border-[var(--glass-border,rgba(0,0,0,0.08))]'
            : 'max-h-0 opacity-0 border-transparent pointer-events-none'
        }`}
        style={
          mobileOpen
            ? {
                background: 'var(--glass-bg, rgba(255,255,255,0.92))',
                backdropFilter: 'blur(20px) saturate(140%)',
                WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                boxShadow: 'var(--glass-shadow, 0 8px 24px rgba(0,0,0,0.10))',
              }
            : undefined
        }
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {links.map((link, idx) => renderLink(link, idx, true))}
          {mobileFooterSlot ? (
            <div className="mt-2 pt-3 border-t border-[var(--border)] flex flex-col gap-2">
              {mobileFooterSlot}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default FloatingNav;
