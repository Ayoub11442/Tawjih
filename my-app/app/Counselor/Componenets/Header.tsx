import React, { useState, useEffect, memo, useCallback } from 'react';

import {
  ChevronDown, 
   User,
   Menu, X
} from 'lucide-react';

type NavItemChild = { label: string; href: string };

interface NavItem {
  label: string;
  href: string;
  children?: NavItemChild[];
}


// Data
const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  {
    label: 'التوجيه المهني',
    href: '/career-guidance',
    children: [
      { label: 'اختبار الميول', href: '/career-test' },
      { label: 'استشارات مهنية', href: '/consultations' },
      { label: 'مسارات وظيفية', href: '/career-paths' },
    ],
  },
  {
    label: 'التحديات', 
    href: '/challenges',
    children: [
      { label: 'التحديات الحالية', href: '/current-challenges' },
      { label: 'التحديات القادمة', href: '/upcoming-challenges' },
      { label: 'قصص نجاح', href: '/success-stories' },
    ],
  },
  { label: 'المجتمع', href: '/community' },
  { label: 'تواصل معنا', href: '/contact' },
];



// Component for dropdown menu
const DropdownMenu = memo(({ items, isOpen }: { items: NavItemChild[], isOpen: boolean }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!menuItems?.length) return;

    const currentIndex = Array.from(menuItems).findIndex(item => item === document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex + 1 >= menuItems.length ? 0 : currentIndex + 1;
        (menuItems[nextIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex - 1 < 0 ? menuItems.length - 1 : currentIndex - 1;
        (menuItems[prevIndex] as HTMLElement).focus();
        break;
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className={`absolute top-full right-0 w-48 py-2 bg-emerald-50/95 backdrop-blur-md rounded-lg shadow-lg transform transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      role="menu"
      aria-orientation="vertical"
      aria-hidden={!isOpen}
      onKeyDown={handleKeyDown}
    >
      {items?.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="block px-4 py-2 text-sm text-black hover:bg-emerald-100 hover:text-emerald-700 transition-colors duration-150 outline-none focus:bg-emerald-100 focus:text-emerald-700"
          role="menuitem"
          tabIndex={isOpen ? 0 : -1}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
});
DropdownMenu.displayName = 'DropdownMenu';

// Nav item component
const NavItem = memo(({ 
  item, 
  activeDropdown, 
  setActiveDropdown, 
  isMobile = false, 
  closeMenu 
}: { 
  item: NavItem;
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
  isMobile?: boolean;
  closeMenu?: () => void;
}) => {
  const toggleDropdown = useCallback(() => {
    setActiveDropdown(activeDropdown === item.label ? null : item.label);
  }, [activeDropdown, item.label, setActiveDropdown]);

  if (isMobile) {
    return (
      <div className="mb-4">
        {!item.children ? (
          <a
            href={item.href}
            className="w-full flex items-center p-3 text-black hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ) : (
          <>
            <button
              onClick={toggleDropdown}
              className="w-full flex items-center justify-between p-3 text-black hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
              aria-expanded={activeDropdown === item.label}
            >
              {item.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  activeDropdown === item.label ? 'rotate-180' : ''
                }`}
              />
            </button>
            {item.children && activeDropdown === item.label && (
              <div className="pr-4 mt-2 border-r-2 border-emerald-200">
                {item.children.map((child, childIndex) => (
                  <a
                    key={childIndex}
                    href={child.href}
                    className="block p-3 text-sm text-black hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      {!item.children ? (
        <a
          href={item.href}
          className="px-3 py-2 text-black hover:text-emerald-600 transition-colors duration-200"
        >
          {item.label}
        </a>
      ) : (
        <>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 px-3 py-2 text-black hover:text-emerald-600 transition-colors duration-200"
            aria-expanded={activeDropdown === item.label}
            aria-haspopup="true"
          >
            {item.label}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                activeDropdown === item.label ? 'rotate-180' : ''
              }`}
            />
          </button>
          {item.children && (
            <DropdownMenu items={item.children} isOpen={activeDropdown === item.label} />
          )}
        </>
      )}
    </div>
  );
});
NavItem.displayName = 'NavItem';

// Component for header with navigation
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('main-nav');
      if (isMenuOpen && nav && !nav.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [closeMenu]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-emerald-50/90 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav id="main-nav" className="flex items-center justify-between" dir="rtl">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-emerald-600 transition-all hover:scale-105 hover:text-emerald-700">
            Tawjih
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex font-bold text-black items-center space-x-8 mr-4 space-x-reverse">
            {NAV_ITEMS.map((item, index) => (
              <NavItem 
                key={index} 
                item={item} 
                activeDropdown={activeDropdown} 
                setActiveDropdown={setActiveDropdown} 
              />
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center">
            <a
              href="/login"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 hover:shadow-md transition-all duration-200 flex items-center"
            >
              <User className="h-4 w-4 ml-2" />
              <span>تسجيل الدخول</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-black hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors duration-200"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden fixed inset-0 bg-emerald-50/95 backdrop-blur-md z-50 transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-hidden={!isMenuOpen}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center mb-8">
                <a href="/" className="text-2xl font-bold text-emerald-600">
                  Tawjih
                </a>
                <button
                  onClick={closeMenu}
                  className="p-2 text-black hover:text-emerald-600 hover:bg-emerald-100 rounded-full"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {NAV_ITEMS.map((item, index) => (
                  <NavItem 
                    key={index} 
                    item={item} 
                    activeDropdown={activeDropdown} 
                    setActiveDropdown={setActiveDropdown}
                    isMobile={true}
                    closeMenu={closeMenu}
                  />
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <a
                  href="/login"
                  className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg text-center hover:bg-emerald-700 hover:shadow-md transition-all duration-200 flex items-center justify-center"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 ml-2" />
                  <span>تسجيل الدخول</span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
export default memo(Header);