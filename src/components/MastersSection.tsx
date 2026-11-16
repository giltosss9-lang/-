import { BarberMaster, MASTERS, TESTIMONIALS } from '../data/barbershop';
import { ResilientImage } from './ResilientImage';

interface MastersSectionProps {
  onSelectMaster: (master: BarberMaster) => void;
}

export function MastersSection({ onSelectMaster }: MastersSectionProps) {
  return (
    <section id="masters" className="py-16 sm:py-24 border-b border-[#3B1D29]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[13px] text-[#C7A3B2] mb-2">
              Команда с подтверждённой школой и опытом
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#FDF4F7] leading-[1.1]"
              style={{ textWrap: 'balance' }}
            >
              02. Мастера клуба
            </h2>
          </div>

          <p className="text-sm text-[#C7A3B2] max-w-sm leading-[1.6]">
            Каждый мастер ведёт не более шести визитов в день, чтобы уделять достаточно времени форме и деталям.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MASTERS.map((master) => (
            <article
              key={master.id}
              className="group flex flex-col justify-between bg-[#1E0E15] border border-[#3B1D29]"
            >
              <div>
                <div className="aspect-[3/4] overflow-hidden bg-[#170A10] border-b border-[#3B1D29]">
                  <ResilientImage
                    src={master.image}
                    alt={`${master.name} — ${master.role} барбершопа HERITAGE`}
                    fallbackTitle={master.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="p-6 pb-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#C7A3B2] mb-2">
                    <span>{master.role}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{master.experienceYears} лет практики</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-[28px] font-medium text-[#FDF4F7] mb-2">
                    {master.name}
                  </h3>

                  <p className="text-xs font-medium text-[#F04E86] mb-3">
                    {master.specialty}
                  </p>

                  <p className="text-sm leading-[1.6] text-[#C7A3B2]">
                    {master.bio}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4">
                <button
                  type="button"
                  onClick={() => onSelectMaster(master)}
                  className="w-full h-11 px-5 text-sm font-medium text-[#FDF4F7] bg-[#29131D] border border-[#4A2433] hover:border-[#F04E86] hover:text-[#F04E86] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F04E86]"
                >
                  Записаться к мастеру
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 sm:mt-24 pt-16 border-t border-[#3B1D29]">
          <div className="mb-10">
            <p className="text-[13px] text-[#C7A3B2] mb-2">
              Впечатления постоянных гостей
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#FDF4F7]">
              Доверие, проверенное годами
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.id}
                className="flex flex-col justify-between pt-6 border-t border-[#3B1D29]"
              >
                <p className="text-[15px] leading-[1.65] text-[#F3DEE6] mb-6">
                  «{item.quote}»
                </p>

                <footer>
                  <div className="text-sm font-semibold text-[#FDF4F7]">
                    {item.author}
                  </div>
                  <div className="text-xs text-[#C7A3B2] mt-0.5">
                    {item.role}
                  </div>
                  <div className="text-xs text-[#F04E86] mt-2">
                    {item.service}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
