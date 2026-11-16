import { CLUB_INFO } from '../data/barbershop';

export function Footer() {
  return (
    <footer className="border-t border-[#3B1D29] bg-[#0D0509]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <a
            href="#"
            className="font-display text-2xl font-semibold tracking-[0.08em] text-[#FDF4F7]"
          >
            {CLUB_INFO.brand}
          </a>
          <p className="text-xs text-[#C7A3B2] mt-2">
            {CLUB_INFO.address} · {CLUB_INFO.hours}
          </p>
        </div>

        <nav aria-label="Навигация в подвале" className="flex flex-wrap items-center gap-6 text-xs text-[#C7A3B2]">
          <a href="#services" className="hover:text-[#FDF4F7] transition-colors">
            Услуги и цены
          </a>
          <a href="#standards" className="hover:text-[#FDF4F7] transition-colors">
            Стандарты
          </a>
          <a href="#masters" className="hover:text-[#FDF4F7] transition-colors">
            Мастера
          </a>
          <a href="#club" className="hover:text-[#FDF4F7] transition-colors">
            Контакты
          </a>
          <a href="#map" className="hover:text-[#FDF4F7] transition-colors">
            Карта
          </a>
          <a href={CLUB_INFO.phoneHref} className="text-[#FDF4F7] hover:text-[#F04E86] transition-colors tabular-nums">
            {CLUB_INFO.phone}
          </a>
        </nav>

        <div className="text-xs text-[#8E6878]">
          © 2026 {CLUB_INFO.brand}. Москва.
        </div>
      </div>
    </footer>
  );
}
