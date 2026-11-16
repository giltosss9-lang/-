import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
}

const NAV_LINKS = [
  { href: '#services', label: 'Услуги' },
  { href: '#masters', label: 'Мастера' },
  { href: '#club', label: 'Клуб' },
  { href: '#map', label: 'Карта' },
];

export function Header({ onOpenBooking }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#14090E]/95 backdrop-blur-md border-b border-[#3B1D29]">
      <div className="max-w-[1280px] mx-auto h-full px-5 sm:px-8 flex items-center justify-between gap-8">
        <a
          href="#"
          className="font-display text-2xl font-semibold tracking-[0.08em] text-[#FDF4F7] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F04E86]"
        >
          HERITAGE
        </a>

        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#C7A3B2]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 hover:text-[#FDF4F7] transition-colors duration-150 whitespace-nowrap shrink-0 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-[#F04E86] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F04E86]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenBooking}
            className="h-10 px-5 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF4F7]"
          >
            Записаться
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="md:hidden flex items-center justify-center w-11 h-11 text-[#FDF4F7] border border-[#3B1D29] hover:border-[#F04E86] transition-colors duration-150 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#14090E] border-b border-[#3B1D29] px-5 py-4">
          <nav aria-label="Мобильная навигация" className="flex flex-col divide-y divide-[#2B141E]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 text-base font-medium text-[#FDF4F7] hover:text-[#F04E86] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
