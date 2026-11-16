import { useState } from 'react';
import {
  CRAFT_STANDARDS,
  SERVICE_CATEGORIES,
  SERVICES,
  SHAVE_RITUAL_IMAGE,
  ServiceCategory,
  ServiceItem,
  formatRub,
} from '../data/barbershop';
import { ResilientImage } from './ResilientImage';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('haircuts');

  const filteredServices = SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-16 sm:py-24 border-b border-[#3B1D29]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <p className="text-[13px] text-[#C7A3B2] mb-2">
              Индивидуальный подбор формы и ухода
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#FDF4F7] leading-[1.1]"
              style={{ textWrap: 'balance' }}
            >
              01. Меню услуг
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Категории услуг"
            className="flex flex-wrap items-center gap-1 p-1 bg-[#1E0E15] border border-[#3B1D29] self-start lg:self-auto"
          >
            {SERVICE_CATEGORIES.map((category) => {
              const isActive = category.id === activeCategory;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={`h-10 px-4 text-xs sm:text-[13px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F04E86] ${
                    isActive
                      ? 'bg-[#C81E5A] text-[#FFF8FA] font-semibold'
                      : 'text-[#C7A3B2] hover:text-[#FDF4F7]'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t border-[#3B1D29]">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group py-7 border-b border-[#3B1D29] flex flex-col justify-between gap-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-medium text-[#FDF4F7] group-hover:text-[#F04E86] transition-colors duration-150">
                  {service.name}
                </h3>
                <span className="font-sans text-lg font-semibold text-[#FDF4F7] tabular-nums whitespace-nowrap shrink-0">
                  {formatRub(service.priceRub)}
                </span>
              </div>

              <p className="text-sm leading-[1.6] text-[#C7A3B2]">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#C7A3B2] tabular-nums">
                  Длительность · {service.durationMin} мин
                </span>

                <button
                  type="button"
                  onClick={() => onSelectService(service)}
                  className="h-10 px-4 text-xs font-medium text-[#FDF4F7] border border-[#4A2433] hover:border-[#F04E86] hover:text-[#F04E86] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F04E86]"
                >
                  Выбрать услугу
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          id="standards"
          className="mt-20 sm:mt-24 pt-16 border-t border-[#3B1D29] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch"
        >
          <div className="lg:col-span-5">
            <div className="h-full min-h-[280px] sm:min-h-[360px] bg-[#1E0E15] border border-[#3B1D29] overflow-hidden">
              <ResilientImage
                src={SHAVE_RITUAL_IMAGE}
                alt="Инструменты для традиционного влажного бритья: опасная бритва, помазок из барсучьего ворса, масло сандала и горячее полотенце"
                fallbackTitle="Ритуал королевского бритья"
                className="w-full h-full aspect-[4/3] lg:aspect-auto lg:h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="mb-8">
              <p className="text-[13px] text-[#C7A3B2] mb-2">
                Стандарты работы и безопасность
              </p>
              <h3
                className="font-display text-3xl sm:text-4xl font-medium text-[#FDF4F7] leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Детали, которые отличают ремесло от потокового салона
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
              {CRAFT_STANDARDS.map((item) => (
                <div key={item.index} className="pt-4 border-t border-[#3B1D29]">
                  <div className="text-xs font-medium text-[#F04E86] tabular-nums mb-2">
                    {item.index}.
                  </div>
                  <h4 className="text-base font-semibold text-[#FDF4F7] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-[1.6] text-[#C7A3B2]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
