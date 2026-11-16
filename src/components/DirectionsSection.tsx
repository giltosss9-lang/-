import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Car, ExternalLink, Footprints, LocateFixed, Navigation, TrainFront } from 'lucide-react';
import { CLUB_INFO } from '../data/barbershop';

type TravelModeType = 'DRIVING' | 'WALKING' | 'TRANSIT';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface RouteSummary {
  distanceMeters: number;
  durationMillis: number;
  originLocation: LatLngLiteral | null;
  destinationLocation: LatLngLiteral | null;
}

const TRAVEL_MODES: { id: TravelModeType; label: string; icon: 'car' | 'walk' | 'transit' }[] = [
  { id: 'DRIVING', label: 'На авто', icon: 'car' },
  { id: 'WALKING', label: 'Пешком', icon: 'walk' },
  { id: 'TRANSIT', label: 'Транспорт', icon: 'transit' },
];

const DESTINATION_QUERY = 'Малый Козихинский переулок, 12, Москва';

function formatDurationRu(durationMillis: number): string {
  const totalMinutes = Math.max(1, Math.round(durationMillis / 60000));
  if (totalMinutes < 60) {
    return `${totalMinutes} мин`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
}

function formatDistanceRu(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} м`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} км`;
}

function extractLatLng(loc: unknown): LatLngLiteral | null {
  if (!loc || typeof loc !== 'object') return null;
  const candidate = loc as {
    lat?: number | (() => number);
    lng?: number | (() => number);
    latLng?: { lat?: number | (() => number); lng?: number | (() => number) };
  };
  const source = candidate.latLng ?? candidate;
  const latVal = typeof source.lat === 'function' ? source.lat() : source.lat;
  const lngVal = typeof source.lng === 'function' ? source.lng() : source.lng;
  if (typeof latVal === 'number' && typeof lngVal === 'number') {
    return { lat: latVal, lng: lngVal };
  }
  return null;
}

interface RouteMapContentProps {
  origin: LatLngLiteral | string;
  travelMode: TravelModeType;
  onRouteComputed: (summary: RouteSummary | null) => void;
  onRouteLoadingChange: (loading: boolean) => void;
  onRouteError: (msg: string | null) => void;
}

interface PolylineInstance {
  setOptions: (options: { strokeColor?: string; strokeOpacity?: number; strokeWeight?: number }) => void;
  setMap: (map: unknown | null) => void;
}

function RouteMapContent({
  origin,
  travelMode,
  onRouteComputed,
  onRouteLoadingChange,
  onRouteError,
}: RouteMapContentProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const status = useApiLoadingStatus();
  const polylinesRef = useRef<PolylineInstance[]>([]);

  const [originMarkerRef, originMarker] = useAdvancedMarkerRef();
  const [destMarkerRef, destMarker] = useAdvancedMarkerRef();
  const [originPoint, setOriginPoint] = useState<LatLngLiteral | null>(
    typeof origin === 'string' ? null : origin
  );
  const [destPoint, setDestPoint] = useState<LatLngLiteral | null>(null);
  const [activeInfo, setActiveInfo] = useState<'origin' | 'dest' | null>('origin');

  useEffect(() => {
    if (!routesLib || !map || !origin) return;

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    onRouteError(null);
    onRouteLoadingChange(true);

    const request = {
      origin,
      destination: DESTINATION_QUERY,
      travelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
    };

    let cancelled = false;

    (routesLib.Route as unknown as {
      computeRoutes: (req: typeof request) => Promise<{
        routes?: Array<{
          distanceMeters?: number;
          durationMillis?: number;
          viewport?: Parameters<typeof map.fitBounds>[0];
          path?: unknown[];
          legs?: Array<{ startLocation?: unknown; endLocation?: unknown }>;
          createPolylines: () => PolylineInstance[];
        }>;
      }>;
    })
      .computeRoutes(request)
      .then(({ routes }) => {
        if (cancelled) return;
        onRouteLoadingChange(false);

        if (!routes || routes.length === 0) {
          onRouteError('Не удалось построить маршрут от указанной точки до барбершопа.');
          onRouteComputed(null);
          return;
        }

        const primaryRoute = routes[0];
        const newPolylines = primaryRoute.createPolylines();
        newPolylines.forEach((polyline) => {
          polyline.setOptions({
            strokeColor: '#F04E86',
            strokeOpacity: 0.95,
            strokeWeight: 5,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        const leg = primaryRoute.legs?.[0];
        const pathStart =
          primaryRoute.path && primaryRoute.path.length > 0
            ? extractLatLng(primaryRoute.path[0])
            : null;
        const pathEnd =
          primaryRoute.path && primaryRoute.path.length > 0
            ? extractLatLng(primaryRoute.path[primaryRoute.path.length - 1])
            : null;

        const resolvedOrigin =
          (typeof origin !== 'string' ? origin : null) ??
          extractLatLng(leg?.startLocation) ??
          pathStart;
        const resolvedDest = extractLatLng(leg?.endLocation) ?? pathEnd;

        setOriginPoint(resolvedOrigin);
        setDestPoint(resolvedDest);

        onRouteComputed({
          distanceMeters: primaryRoute.distanceMeters ?? 0,
          durationMillis: primaryRoute.durationMillis ?? 0,
          originLocation: resolvedOrigin,
          destinationLocation: resolvedDest,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        onRouteLoadingChange(false);
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('QuotaExceeded')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onRouteError(
          'Не удалось рассчитать маршрут через Google Maps Routes API. Проверьте точку отправления или попробуйте другой способ передвижения.'
        );
        onRouteComputed(null);
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, origin, travelMode, onRouteComputed, onRouteLoadingChange, onRouteError]);

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1E0E15] p-8 text-center">
        <Navigation className="w-7 h-7 text-[#F04E86] mb-3" />
        <p className="text-sm font-medium text-[#FDF4F7] mb-1">
          Ошибка загрузки Google Maps
        </p>
        <p className="text-xs text-[#C7A3B2]">
          Проверьте подключение к интернету или параметры API-ключа.
        </p>
      </div>
    );
  }

  const initialCenter: LatLngLiteral =
    typeof origin !== 'string'
      ? origin
      : originPoint ?? { lat: 55.763, lng: 37.595 };

  return (
    <GoogleMap
      defaultCenter={initialCenter}
      defaultZoom={12}
      mapId="DEMO_MAP_ID"
      gestureHandling="greedy"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      {originPoint && (
        <AdvancedMarker
          ref={originMarkerRef}
          position={originPoint}
          onClick={() => setActiveInfo('origin')}
          title="Ваше местоположение"
        >
          <Pin background="#FDF4F7" borderColor="#C81E5A" glyphColor="#C81E5A" scale={1.1} />
        </AdvancedMarker>
      )}

      {destPoint && (
        <AdvancedMarker
          ref={destMarkerRef}
          position={destPoint}
          onClick={() => setActiveInfo('dest')}
          title="HERITAGE — Барбершоп"
        >
          <Pin background="#C81E5A" borderColor="#14090E" glyphColor="#FFF8FA" scale={1.2} />
        </AdvancedMarker>
      )}

      {activeInfo === 'origin' && originMarker && originPoint && (
        <InfoWindow anchor={originMarker} onCloseClick={() => setActiveInfo(null)} maxWidth={220}>
          <div className="text-[#14090E] py-0.5">
            <div className="text-xs font-semibold">Вы находитесь здесь</div>
            <div className="text-[11px] font-mono tabular-nums text-[#4A2433] mt-0.5">
              {originPoint.lat.toFixed(4)}, {originPoint.lng.toFixed(4)}
            </div>
          </div>
        </InfoWindow>
      )}

      {activeInfo === 'dest' && destMarker && destPoint && (
        <InfoWindow anchor={destMarker} onCloseClick={() => setActiveInfo(null)} maxWidth={240}>
          <div className="text-[#14090E] py-0.5">
            <div className="text-xs font-semibold">HERITAGE Барбершоп</div>
            <div className="text-[11px] text-[#4A2433] mt-0.5">{CLUB_INFO.address}</div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export function DirectionsSection() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [origin, setOrigin] = useState<LatLngLiteral | string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [travelMode, setTravelMode] = useState<TravelModeType>('DRIVING');
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const requestCurrentLocation = () => {
    setIsOpen(true);
    setGeoError(null);
    setRouteError(null);

    if (!navigator.geolocation) {
      setGeoError(
        'Ваш браузер не поддерживает геолокацию. Укажите начальный адрес ниже вручную.'
      );
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setOrigin({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        });
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError(
            'Доступ к геолокации запрещён. Разрешите определение местоположения в браузере или введите точку отправления вручную.'
          );
        } else {
          setGeoError(
            'Не удалось автоматически определить координаты. Введите ваш адрес отправления ниже.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleManualOriginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = manualAddress.trim();
    if (trimmed.length < 3) {
      setGeoError('Введите корректный адрес отправления (минимум 3 символа).');
      return;
    }
    setGeoError(null);
    setRouteError(null);
    setOrigin(trimmed);
  };

  const originQueryValue =
    typeof origin === 'string'
      ? origin
      : origin
        ? `${origin.lat},${origin.lng}`
        : '';

  const googleMapsDirUrl = originQueryValue
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originQueryValue)}&destination=${encodeURIComponent(DESTINATION_QUERY)}&travelmode=${travelMode.toLowerCase()}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION_QUERY)}`;

  return (
    <section id="directions" className="py-16 sm:py-20 border-t border-[#3B1D29] bg-[#170A10]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[13px] text-[#C7A3B2] mb-2">
              Персональный маршрут до {CLUB_INFO.address}
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-medium text-[#FDF4F7] leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Как добраться до клуба прямо сейчас
            </h2>
          </div>

          <button
            type="button"
            onClick={requestCurrentLocation}
            disabled={locating}
            className="h-12 px-8 inline-flex items-center justify-center gap-2.5 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] disabled:opacity-60 transition-colors duration-150 whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF4F7]"
          >
            <Navigation className="w-4 h-4" />
            <span>{locating ? 'Определяем местоположение...' : 'Direction'}</span>
          </button>
        </div>

        {isOpen && (
          <div className="mt-10 pt-10 border-t border-[#3B1D29] space-y-6">
            {geoError && (
              <div
                role="alert"
                className="p-4 bg-[#29131D] border border-[#C81E5A] text-xs sm:text-sm text-[#FDF4F7]"
              >
                {geoError}
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#1E0E15] border border-[#3B1D29] self-start">
                {TRAVEL_MODES.map((mode) => {
                  const isActive = mode.id === travelMode;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTravelMode(mode.id)}
                      className={`h-10 px-4 inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#C81E5A] text-[#FFF8FA] font-semibold'
                          : 'text-[#C7A3B2] hover:text-[#FDF4F7]'
                      }`}
                    >
                      {mode.icon === 'car' && <Car className="w-4 h-4" />}
                      {mode.icon === 'walk' && <Footprints className="w-4 h-4" />}
                      {mode.icon === 'transit' && <TrainFront className="w-4 h-4" />}
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <form
                onSubmit={handleManualOriginSubmit}
                className="flex items-center gap-2 w-full lg:w-auto"
              >
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Или введите адрес отправления..."
                  aria-label="Адрес отправления"
                  className="flex-1 lg:w-72 h-11 px-3.5 text-sm text-[#FDF4F7] placeholder:text-[#8E6878] bg-[#1E0E15] border border-[#4A2433] focus:border-[#F04E86] focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-11 px-4 text-xs font-medium text-[#FDF4F7] bg-[#29131D] border border-[#4A2433] hover:border-[#F04E86] hover:text-[#F04E86] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Построить
                </button>
              </form>
            </div>

            {origin ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 h-[400px] sm:h-[460px] bg-[#1E0E15] border border-[#3B1D29] overflow-hidden">
                  {apiKey ? (
                    <APIProvider
                      apiKey={apiKey}
                      libraries={['marker', 'routes']}
                      language="ru"
                      region="RU"
                    >
                      <RouteMapContent
                        origin={origin}
                        travelMode={travelMode}
                        onRouteComputed={setRouteSummary}
                        onRouteLoadingChange={setRouteLoading}
                        onRouteError={setRouteError}
                      />
                    </APIProvider>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-sm text-[#C7A3B2]">
                      Ключ Google Maps API не задан.
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 bg-[#1E0E15] border border-[#3B1D29] p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs text-[#C7A3B2] mb-1">Ваше местоположение</div>
                      <div className="text-sm font-medium text-[#FDF4F7] tabular-nums">
                        {typeof origin === 'string'
                          ? origin
                          : `${origin.lat.toFixed(4)}° с.ш., ${origin.lng.toFixed(4)}° в.д.`}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#3B1D29]">
                      <div className="text-xs text-[#C7A3B2] mb-1">Точка назначения</div>
                      <div className="text-sm font-medium text-[#FDF4F7]">
                        HERITAGE · {CLUB_INFO.address}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#3B1D29]">
                      {routeLoading ? (
                        <div className="text-sm text-[#C7A3B2]">
                          Рассчитываем маршрут и время в пути...
                        </div>
                      ) : routeError ? (
                        <div className="text-xs text-[#FF85AE] leading-[1.5]">
                          {routeError}
                        </div>
                      ) : routeSummary ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-[#C7A3B2] mb-1">Время в пути</div>
                            <div className="font-display text-3xl font-semibold text-[#F04E86] tabular-nums">
                              {formatDurationRu(routeSummary.durationMillis)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#C7A3B2] mb-1">Расстояние</div>
                            <div className="font-display text-3xl font-semibold text-[#FDF4F7] tabular-nums">
                              {formatDistanceRu(routeSummary.distanceMeters)}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={requestCurrentLocation}
                      className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#FDF4F7] bg-[#29131D] border border-[#4A2433] hover:border-[#F04E86] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <LocateFixed className="w-4 h-4 text-[#F04E86]" />
                      <span>Обновить мою геопозицию</span>
                    </button>

                    <a
                      href={googleMapsDirUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#F04E86] border border-[#4A2433] hover:border-[#F04E86] transition-colors whitespace-nowrap"
                    >
                      <span>Открыть навигатор в Google Картах</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#1E0E15] border border-[#3B1D29] text-center text-sm text-[#C7A3B2]">
                {locating
                  ? 'Запрашиваем ваши текущие координаты...'
                  : 'Разрешите доступ к геолокации или введите ваш адрес отправления выше, чтобы построить маршрут и узнать время в пути.'}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
