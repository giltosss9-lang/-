import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { CLUB_INFO, CLUB_INTERIOR_IMAGE } from '../data/barbershop';
import { ResilientImage } from './ResilientImage';

interface ClubSectionProps {
  onOpenBooking: () => void;
}

export function ClubSection({ onOpenBooking }: ClubSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CLUB_INFO.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="club" className="py-16 sm:py-24">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="mb-10 sm:mb-12">
          <p className="text-[13px] text-[#C7A3B2] mb-2">
            Интерьер и график работы
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#FDF4F7] leading-[1.1]"
            style={{ textWrap: 'balance' }}
          >
            03. Пространство и визит
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 relative bg-[#1E0E15] border border-[#3B1D29] overflow-hidden">
            <ResilientImage
              src={CLUB_INTERIOR_IMAGE}
              alt="Интерьер мужского барбершопа HERITAGE в Москве: тёмный дуб, латунные зеркала и винтажные кресла"
              fallbackTitle="Интерьер клуба HERITAGE"
              className="w-full h-full aspect-[16/9] lg:aspect-auto lg:h-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14090E]/85 via-[#14090E]/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[13px] text-[#FDF4F7]">
              <span>Главный зал · Малый Козихинский пер., 12</span>
              <span className="text-[#FF73A3]">Шесть рабочих мест</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1E0E15] border border-[#3B1D29] p-6 sm:p-8 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div>
                <div className="text-xs text-[#C7A3B2] mb-1">Адрес клуба</div>
                <div className="text-base font-medium text-[#FDF4F7]">
                  {CLUB_INFO.address}
                </div>
                <div className="text-xs text-[#C7A3B2] mt-1">
                  {CLUB_INFO.district} · 6 минут от м. Маяковская
                </div>
              </div>

              <div className="pt-5 border-t border-[#3B1D29]">
                <div className="text-xs text-[#C7A3B2] mb-1">Время работы</div>
                <div className="text-base font-medium text-[#FDF4F7] tabular-nums">
                  {CLUB_INFO.hours}
                </div>
              </div>

              <div className="pt-5 border-t border-[#3B1D29]">
                <div className="text-xs text-[#C7A3B2] mb-1">Телефон ресепшена</div>
                <a
                  href={CLUB_INFO.phoneHref}
                  className="text-base font-medium text-[#FDF4F7] hover:text-[#F04E86] transition-colors tabular-nums"
                >
                  {CLUB_INFO.phone}
                </a>
              </div>

              <div className="pt-5 border-t border-[#3B1D29]">
                <div className="text-xs text-[#C7A3B2] mb-1">Парковка</div>
                <div className="text-sm text-[#F3DEE6]">
                  {CLUB_INFO.parking}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full h-12 px-6 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF4F7]"
              >
                Забронировать визит
              </button>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#FDF4F7] bg-[#29131D] border border-[#4A2433] hover:border-[#F04E86] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F04E86]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#F04E86]" />
                    <span>Адрес скопирован</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C7A3B2]" />
                    <span>Скопировать адрес</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
