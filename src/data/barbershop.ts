export type ServiceCategory = 'haircuts' | 'shave' | 'rituals' | 'care';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  name: string;
  durationMin: number;
  priceRub: number;
  description: string;
}

export interface BarberMaster {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  specialty: string;
  bio: string;
  image: string;
  availableSlots: string[];
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  service: string;
  quote: string;
}

export const HERO_IMAGE = '/src/assets/images/hero_barber_craft_1794830029721.jpg';
export const SHAVE_RITUAL_IMAGE = '/src/assets/images/ritual_hot_towel_shave_1794830030859.jpg';
export const CLUB_INTERIOR_IMAGE = '/src/assets/images/interior_club_lounge_1794830031106.jpg';

export const SERVICE_CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'haircuts', label: 'Стрижки' },
  { id: 'shave', label: 'Борода и бритьё' },
  { id: 'rituals', label: 'Комплексы' },
  { id: 'care', label: 'Уход и тонирование' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'classic-cut',
    category: 'haircuts',
    name: 'Архитектурная мужская стрижка',
    durationMin: 60,
    priceRub: 4200,
    description: 'Точный подбор формы по анатомии черепа, работа ножницами Hikari, мытьё и укладка.',
  },
  {
    id: 'long-hair-cut',
    category: 'haircuts',
    name: 'Стрижка удлинённых волос',
    durationMin: 75,
    priceRub: 4800,
    description: 'Градуировка и текстурирование без машинки с сохранением естественной динамики.',
  },
  {
    id: 'executive-cut',
    category: 'haircuts',
    name: 'Стрижка от шеф-барбера',
    durationMin: 75,
    priceRub: 5600,
    description: 'Персональная сессия у ведущего мастера с детальной доработкой контуров опасной бритвой.',
  },
  {
    id: 'clipper-fade',
    category: 'haircuts',
    name: 'Спортивный фейд и окантовка',
    durationMin: 45,
    priceRub: 3400,
    description: 'Чистый плавный переход от нуля, точная геометрия висков и затылка.',
  },
  {
    id: 'royal-shave',
    category: 'shave',
    name: 'Королевское бритьё опасной бритвой',
    durationMin: 60,
    priceRub: 3900,
    description: 'Трёхэтапное распаривание горячими полотенцами, взбитая пена, масло сандала и холодный компресс.',
  },
  {
    id: 'beard-modeling',
    category: 'shave',
    name: 'Моделирование бороды и усов',
    durationMin: 45,
    priceRub: 3100,
    description: 'Построение строгих линий щёк и шеи опасным лезвием, смягчение бальзамом Truefitt & Hill.',
  },
  {
    id: 'beard-express',
    category: 'shave',
    name: 'Коррекция формы бороды',
    durationMin: 30,
    priceRub: 2400,
    description: 'Поддержание симметрии и чистых контуров между основными визитами.',
  },
  {
    id: 'signature-duo',
    category: 'rituals',
    name: 'Клубный ритуал «Heritage»',
    durationMin: 105,
    priceRub: 7200,
    description: 'Архитектурная стрижка, моделирование бороды с распариванием и восстанавливающий уход кожи головы.',
  },
  {
    id: 'father-son',
    category: 'rituals',
    name: 'Отец и сын',
    durationMin: 90,
    priceRub: 6800,
    description: 'Две параллельные или последовательные классические стрижки в приватной зоне клуба.',
  },
  {
    id: 'before-event',
    category: 'rituals',
    name: 'Подготовка к деловому приёму',
    durationMin: 90,
    priceRub: 6500,
    description: 'Стрижка, королевское бритьё, маска с древесным углём и финальная укладка.',
  },
  {
    id: 'grey-blending',
    category: 'care',
    name: 'Камуфляж седины волос или бороды',
    durationMin: 35,
    priceRub: 2900,
    description: 'Деликатное безаммиачное тонирование без эффекта отросших корней за 15 минут.',
  },
  {
    id: 'black-mask',
    category: 'care',
    name: 'Детокс-уход лица с чёрной маской',
    durationMin: 40,
    priceRub: 2800,
    description: 'Распаривание, глубокое очищение пор и успокаивающая сыворотка с экстрактом эвкалипта.',
  },
  {
    id: 'scalp-spa',
    category: 'care',
    name: 'Спа-терапия кожи головы',
    durationMin: 30,
    priceRub: 2500,
    description: 'Пилинг, тонизирующий массаж и ампульное питание с мятой и розмарином.',
  },
];

export const MASTERS: BarberMaster[] = [
  {
    id: 'artem-sokolov',
    name: 'Артём Соколов',
    role: 'Шеф-барбер',
    experienceYears: 12,
    specialty: 'Классика ножницами · Удлинённые формы',
    bio: 'Выпускник лондонской академии Vidal Sassoon. Специализируется на естественных формах, которые держат геометрию до шести недель без сложной укладки.',
    image: '/src/assets/images/master_barber_artem_1794830031088.jpg',
    availableSlots: ['10:30', '12:00', '14:30', '17:00', '19:30'],
  },
  {
    id: 'dmitry-vorontsov',
    name: 'Дмитрий Воронцов',
    role: 'Старший барбер',
    experienceYears: 8,
    specialty: 'Деловые стрижки · Чистый фейд',
    bio: 'Отточил технику точных переходов и строгой окантовки. Создаёт выверенные силуэты для тех, кто ценит безупречность каждой линии.',
    image: '/src/assets/images/master_barber_dmitry_1794830032691.jpg',
    availableSlots: ['11:00', '13:00', '15:30', '18:00', '20:30'],
  },
  {
    id: 'ilya-gromov',
    name: 'Илья Громов',
    role: 'Мастер бритья и бороды',
    experienceYears: 14,
    specialty: 'Королевское бритьё · Архитектура бороды',
    bio: 'Хранитель традиционной техники работы опасным клинком. Превращает бритьё и коррекцию бороды в спокойный восстановительный ритуал.',
    image: '/src/assets/images/master_barber_ilya_1794830033126.jpg',
    availableSlots: ['10:00', '12:30', '15:00', '17:30', '20:00'],
  },
];

export const STUDIO_METRICS = [
  { value: '12 лет', label: 'практики на Патриарших' },
  { value: '60 мин', label: 'регламент одного визита' },
  { value: '4.9 / 5', label: 'оценка по 1 400+ отзывам' },
  { value: '100%', label: 'медицинская стерилизация' },
];

export const CRAFT_STANDARDS = [
  {
    index: '01',
    title: 'Японская сталь и точность геометрии',
    detail: 'Работаем ножницами ручной ковки Hikari и одноразовыми лезвиями Feather, подбирая угол среза под рост волос.',
  },
  {
    index: '02',
    title: 'Трёхступенчатая стерилизация',
    detail: 'Каждый инструмент проходит ультразвуковую очистку и автоклавирование в крафт-пакетах с вскрытием при госте.',
  },
  {
    index: '03',
    title: 'Косметика Truefitt & Hill',
    detail: 'Английские масла до бритья, бальзамы без парабенов и матовые глины с нейтральными древесными нотами.',
  },
  {
    index: '04',
    title: 'Приватная атмосфера без суеты',
    detail: 'Дистанция между креслами 2,4 метра, плотная звукоизоляция и комплимент из барной карты к каждому визиту.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    author: 'Константин Беляев',
    role: 'Управляющий партнёр, юридическая практика «Беляев и Партнёры»',
    service: 'Стрижка от шеф-барбера',
    quote: 'Хожу к Артёму четвёртый год. Главный показатель уровня — даже спустя четыре недели после визита стрижка ложится аккуратно без единого укладочного средства.',
  },
  {
    id: 't2',
    author: 'Максим Румянцев',
    role: 'Архитектор, бюро «Монолит»',
    service: 'Клубный ритуал «Heritage»',
    quote: 'Редкое место в центре, где тихо и нет показного пафоса. За полтора часа перед важной презентацией приводят в порядок и голову, и мысли.',
  },
  {
    id: 't3',
    author: 'Сергей Демидов',
    role: 'Директор по инвестициям',
    service: 'Королевское бритьё и моделирование бороды',
    quote: 'У меня чувствительная кожа, поэтому раньше избегал опасной бритвы. После ритуала у Ильи с тремя полотенцами и маслом сандала ни разу не было раздражения.',
  },
];

export const CLUB_INFO = {
  brand: 'HERITAGE',
  address: 'Москва, Малый Козихинский пер., 12',
  district: 'Патриаршие пруды',
  hours: 'Ежедневно, 10:00 — 22:00',
  phone: '+7 (495) 000-12-40',
  phoneHref: 'tel:+74950001240',
  parking: 'Закрытая парковка во дворе по номеру авто',
  drinks: ['Двойной эспрессо', 'Американо', 'Односолодовый виски 12 лет', 'Чай улун', 'Вода без газа'],
};

export function formatRub(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₽`;
}
