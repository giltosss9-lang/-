import { ArrowUpRight } from 'lucide-react';
import { CLUB_INFO, HERO_IMAGE, STUDIO_METRICS } from '../data/barbershop';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onOpenBooking: () => void;
}

export function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-1 sm:py-2">
            <div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-[13px] text-[#C7A3B2] mb-6 sm:mb-8">
                <span>{CLUB_INFO.address}</span>
                <span aria-hidden="true">·</span>
                <span>{CLUB_INFO.district}</span>
                <span aria-hidden="true">·</span>
                <span>{CLUB_INFO.hours}</span>
              </div>

              <h1
                className="font-display font-medium text-[#FDF4F7] tracking-[-0.015em] leading-[1.03] mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 4.3vw, 4.125rem)',
                  textWrap: 'balance',
                }}
              >
                Мужская стрижка как архитектура формы
              </h1>

              <p className="text-[15px] sm:text-base leading-[1.65] text-[#C7A3B2] max-w-md mb-8 sm:mb-10">
                Классическая работа ножницами, королевское бритьё опасной бритвой и персональный подбор ухода в спокойном клубном пространстве.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="h-12 px-7 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF4F7]"
              >
                Записаться к мастеру
              </button>

              <a
                href="#services"
                className="inline-flex items-center gap-1.5 h-12 text-sm font-medium text-[#FDF4F7] hover:text-[#F04E86] transition-colors duration-150 whitespace-nowrap shrink-0 border-b border-[#4A2433] hover:border-[#F04E86]"
              >
                <span>Меню услуг</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[280px] sm:min-h-[380px] lg:min-h-[480px] bg-[#1E0E15] border border-[#3B1D29] overflow-hidden">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Мастер барбершопа HERITAGE выполняет стрижку ножницами в зале клуба"
                fallbackTitle="HERITAGE — Зал стрижек"
                className="w-full h-full aspect-[4/3] lg:aspect-auto lg:h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 border-y border-[#3B1D29]">
          {STUDIO_METRICS.map((metric, idx) => (
            <div
              key={metric.label}
              className={`py-6 sm:py-7 px-4 sm:px-6 ${
                idx % 2 === 1 ? 'border-l border-[#3B1D29]' : ''
              } ${idx >= 2 ? 'border-t lg:border-t-0 lg:border-l border-[#3B1D29]' : ''}`}
            >
              <div className="font-display text-2xl sm:text-3xl font-semibold text-[#FDF4F7] tabular-nums mb-1">
                {metric.value}
              </div>
              <div className="text-xs sm:text-[13px] text-[#C7A3B2]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
