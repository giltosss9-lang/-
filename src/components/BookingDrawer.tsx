import { useEffect, useMemo, useState, FormEvent } from 'react';
import { CalendarPlus, CheckCircle2, X } from 'lucide-react';
import {
  BarberMaster,
  CLUB_INFO,
  MASTERS,
  SERVICES,
  ServiceItem,
  formatRub,
} from '../data/barbershop';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialService: ServiceItem | null;
  initialMaster: BarberMaster | null;
}

interface DayOption {
  iso: string;
  shortLabel: string;
  fullLabel: string;
}

function buildNextSevenDays(): DayOption[] {
  const result: DayOption[] = [];
  const base = new Date();
  const weekdayFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });
  const dayMonthFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
  const fullFmt = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const shortLabel =
      i === 0
        ? `Сегодня, ${dayMonthFmt.format(d)}`
        : i === 1
          ? `Завтра, ${dayMonthFmt.format(d)}`
          : `${weekdayFmt.format(d)}, ${dayMonthFmt.format(d)}`;

    result.push({
      iso,
      shortLabel,
      fullLabel: fullFmt.format(d),
    });
  }
  return result;
}

export function BookingDrawer({
  isOpen,
  onClose,
  initialService,
  initialMaster,
}: BookingDrawerProps) {
  const days = useMemo(() => buildNextSevenDays(), []);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [selectedMasterId, setSelectedMasterId] = useState<string>(MASTERS[0].id);
  const [selectedDayIso, setSelectedDayIso] = useState<string>(days[0].iso);
  const [selectedSlot, setSelectedSlot] = useState<string>(MASTERS[0].availableSlots[1]);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedDrink, setSelectedDrink] = useState(CLUB_INFO.drinks[0]);
  const [errorText, setErrorText] = useState('');
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setSelectedServiceId(initialService.id);
    }
    if (initialMaster) {
      setSelectedMasterId(initialMaster.id);
      setSelectedSlot(initialMaster.availableSlots[0]);
    }
    setConfirmationCode(null);
    setErrorText('');
  }, [initialService, initialMaster, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const activeMaster = MASTERS.find((m) => m.id === selectedMasterId) || MASTERS[0];
  const activeDay = days.find((d) => d.iso === selectedDayIso) || days[0];

  const handleMasterChange = (masterId: string) => {
    setSelectedMasterId(masterId);
    const nextMaster = MASTERS.find((m) => m.id === masterId) || MASTERS[0];
    if (!nextMaster.availableSlots.includes(selectedSlot)) {
      setSelectedSlot(nextMaster.availableSlots[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = guestName.trim();
    const phoneDigits = guestPhone.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      setErrorText('Пожалуйста, укажите ваше имя.');
      return;
    }
    if (phoneDigits.length < 10) {
      setErrorText('Введите корректный номер телефона (минимум 10 цифр).');
      return;
    }

    setErrorText('');
    const code = `HR-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationCode(code);
  };

  const handleDownloadCalendar = () => {
    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const start = new Date(`${selectedDayIso}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
    const end = new Date(start.getTime() + activeService.durationMin * 60000);

    const fmtIcs = (date: Date) =>
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HERITAGE Barbershop//RU',
      'BEGIN:VEVENT',
      `UID:${confirmationCode || 'heritage-booking'}@heritage.moscow`,
      `DTSTAMP:${fmtIcs(new Date())}`,
      `DTSTART:${fmtIcs(start)}`,
      `DTEND:${fmtIcs(end)}`,
      `SUMMARY:HERITAGE — ${activeService.name}`,
      `DESCRIPTION:Мастер: ${activeMaster.name}. Напиток: ${selectedDrink}. Бронь ${confirmationCode}.`,
      `LOCATION:${CLUB_INFO.address}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `heritage-${confirmationCode || 'visit'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div className="relative z-10 w-full max-w-xl h-full bg-[#170A10] border-l border-[#3B1D29] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#3B1D29] shrink-0">
          <div>
            <h2
              id="booking-drawer-title"
              className="font-display text-2xl sm:text-3xl font-medium text-[#FDF4F7]"
            >
              Онлайн-запись в клуб
            </h2>
            <p className="text-xs text-[#C7A3B2] mt-0.5">
              {CLUB_INFO.address} · без предоплаты
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно записи"
            className="w-11 h-11 flex items-center justify-center text-[#C7A3B2] hover:text-[#FDF4F7] border border-[#3B1D29] hover:border-[#F04E86] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmationCode ? (
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-[#F04E86] mb-4">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="text-sm font-semibold">
                  Бронирование подтверждено · № {confirmationCode}
                </span>
              </div>

              <h3 className="font-display text-3xl text-[#FDF4F7] mb-3">
                Ждём вас, {guestName.trim()}
              </h3>
              <p className="text-sm text-[#C7A3B2] leading-[1.6] mb-8">
                Напоминание отправлено на номер {guestPhone}. При необходимости скорректировать время, пожалуйста, сообщите администратору за 3 часа до визита.
              </p>

              <div className="bg-[#1E0E15] border border-[#3B1D29] divide-y divide-[#3B1D29]">
                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#C7A3B2]">Услуга</span>
                  <span className="text-sm font-medium text-[#FDF4F7] text-right">
                    {activeService.name}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#C7A3B2]">Мастер</span>
                  <span className="text-sm font-medium text-[#FDF4F7] text-right">
                    {activeMaster.name}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#C7A3B2]">Дата и время</span>
                  <span className="text-sm font-medium text-[#FDF4F7] tabular-nums text-right">
                    {activeDay.fullLabel}, {selectedSlot}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#C7A3B2]">Комплимент</span>
                  <span className="text-sm font-medium text-[#FDF4F7] text-right">
                    {selectedDrink}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#C7A3B2]">Стоимость визита</span>
                  <span className="text-base font-semibold text-[#F04E86] tabular-nums">
                    {formatRub(activeService.priceRub)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="w-full h-12 px-6 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] transition-colors cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Добавить в календарь</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmationCode(null)}
                className="w-full h-11 px-6 text-xs font-medium text-[#FDF4F7] bg-[#29131D] border border-[#4A2433] hover:border-[#F04E86] transition-colors cursor-pointer"
              >
                Оформить ещё одну запись
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-7"
          >
            <div>
              <label
                htmlFor="booking-service"
                className="block text-xs font-medium text-[#C7A3B2] mb-2"
              >
                01. Услуга
              </label>
              <select
                id="booking-service"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full h-12 px-4 text-sm text-[#FDF4F7] bg-[#1E0E15] border border-[#4A2433] focus:border-[#F04E86] focus:outline-none"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatRub(s.priceRub)} ({s.durationMin} мин)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#C7A3B2] mb-2">
                02. Мастер
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {MASTERS.map((m) => {
                  const isSelected = m.id === selectedMasterId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMasterChange(m.id)}
                      className={`p-3 text-left border transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#2E131F] border-[#F04E86]'
                          : 'bg-[#1E0E15] border-[#3B1D29] hover:border-[#5C2D40]'
                      }`}
                    >
                      <div className="text-sm font-medium text-[#FDF4F7] truncate">
                        {m.name}
                      </div>
                      <div className="text-xs text-[#C7A3B2] mt-0.5 truncate">
                        {m.role}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#C7A3B2] mb-2">
                03. Дата визита
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {days.slice(0, 4).map((d) => {
                  const isSelected = d.iso === selectedDayIso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDayIso(d.iso)}
                      className={`h-10 px-3 text-xs font-medium border transition-colors duration-150 truncate cursor-pointer ${
                        isSelected
                          ? 'bg-[#C81E5A] text-[#FFF8FA] border-[#C81E5A] font-semibold'
                          : 'bg-[#1E0E15] text-[#FDF4F7] border-[#3B1D29] hover:border-[#F04E86]'
                      }`}
                    >
                      {d.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#C7A3B2] mb-2">
                04. Свободное время ({activeMaster.name})
              </span>
              <div className="flex flex-wrap gap-2">
                {activeMaster.availableSlots.map((slot) => {
                  const isSelected = slot === selectedSlot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`h-10 px-4 text-xs font-medium tabular-nums border transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#C81E5A] text-[#FFF8FA] border-[#C81E5A] font-semibold'
                          : 'bg-[#1E0E15] text-[#FDF4F7] border-[#3B1D29] hover:border-[#F04E86]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label
                  htmlFor="guest-name"
                  className="block text-xs font-medium text-[#C7A3B2] mb-1.5"
                >
                  Ваше имя
                </label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Александр"
                  className="w-full h-11 px-3.5 text-sm text-[#FDF4F7] placeholder:text-[#8E6878] bg-[#1E0E15] border border-[#4A2433] focus:border-[#F04E86] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="guest-phone"
                  className="block text-xs font-medium text-[#C7A3B2] mb-1.5"
                >
                  Телефон
                </label>
                <input
                  id="guest-phone"
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full h-11 px-3.5 text-sm text-[#FDF4F7] placeholder:text-[#8E6878] bg-[#1E0E15] border border-[#4A2433] focus:border-[#F04E86] focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="guest-drink"
                className="block text-xs font-medium text-[#C7A3B2] mb-1.5"
              >
                Комплимент к визиту
              </label>
              <select
                id="guest-drink"
                value={selectedDrink}
                onChange={(e) => setSelectedDrink(e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#FDF4F7] bg-[#1E0E15] border border-[#4A2433] focus:border-[#F04E86] focus:outline-none"
              >
                {CLUB_INFO.drinks.map((drink) => (
                  <option key={drink} value={drink}>
                    {drink}
                  </option>
                ))}
              </select>
            </div>

            {errorText && (
              <div
                role="alert"
                className="px-4 py-3 text-xs font-medium text-[#FDF4F7] bg-[#3B1020] border border-[#C81E5A]"
              >
                Ошибка: {errorText}
              </div>
            )}

            <div className="pt-4 border-t border-[#3B1D29] flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#C7A3B2]">Итого к оплате в клубе</div>
                <div className="text-lg font-semibold text-[#FDF4F7] tabular-nums">
                  {formatRub(activeService.priceRub)} · {activeService.durationMin} мин
                </div>
              </div>

              <button
                type="submit"
                className="h-12 px-7 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Подтвердить запись
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
