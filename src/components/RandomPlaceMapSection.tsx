import { useCallback, useEffect, useState } from 'react';
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
} from '@vis.gl/react-google-maps';
import { Compass, ExternalLink, MapPin, RotateCcw } from 'lucide-react';

interface CoordinatePair {
  lat: number;
  lng: number;
}

// Numeric geographic bounding boxes across populated landmasses (no place names or addresses)
const LANDMASS_BOUNDS: { latMin: number; latMax: number; lngMin: number; lngMax: number }[] = [
  { latMin: 36.5, latMax: 59.5, lngMin: -8.5, lngMax: 37.5 },
  { latMin: 25.5, latMax: 48.5, lngMin: -122.5, lngMax: -71.0 },
  { latMin: 22.5, latMax: 42.5, lngMin: 102.0, lngMax: 140.5 },
  { latMin: -36.5, latMax: -6.0, lngMin: -71.5, lngMax: -39.0 },
  { latMin: -37.0, latMax: -16.0, lngMin: 116.0, lngMax: 151.5 },
];

function generateRandomCoordinate(): CoordinatePair {
  const box = LANDMASS_BOUNDS[Math.floor(Math.random() * LANDMASS_BOUNDS.length)];
  const lat = Number((box.latMin + Math.random() * (box.latMax - box.latMin)).toFixed(4));
  const lng = Number((box.lngMin + Math.random() * (box.lngMax - box.lngMin)).toFixed(4));
  return { lat, lng };
}

function formatCoordinate(value: number, positiveDir: string, negativeDir: string): string {
  const dir = value >= 0 ? positiveDir : negativeDir;
  return `${Math.abs(value).toFixed(4)}° ${dir}`;
}

interface InnerMapViewProps {
  point: CoordinatePair;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

function InnerMapView({ point, zoom, onZoomChange }: InnerMapViewProps) {
  const map = useMap();
  const status = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  useEffect(() => {
    if (map) {
      map.panTo(point);
    }
  }, [map, point]);

  const handleCameraChanged = useCallback(
    (ev: { detail: { zoom: number } }) => {
      onZoomChange(Math.round(ev.detail.zoom));
    },
    [onZoomChange]
  );

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1E0E15] p-8 text-center">
        <MapPin className="w-7 h-7 text-[#F04E86] mb-3" />
        <p className="text-sm font-medium text-[#FDF4F7] mb-1">
          Не удалось загрузить карту Google Maps
        </p>
        <p className="text-xs text-[#C7A3B2] max-w-sm">
          Проверьте подключение к сети или настройки ключа Google Maps Platform.
        </p>
      </div>
    );
  }

  return (
    <GoogleMap
      defaultCenter={point}
      defaultZoom={zoom}
      zoom={zoom}
      mapId="DEMO_MAP_ID"
      gestureHandling="greedy"
      onCameraChanged={handleCameraChanged}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      <AdvancedMarker
        ref={markerRef}
        position={point}
        onClick={() => setInfoOpen(true)}
        title="Случайная точка на карте"
      >
        <Pin background="#C81E5A" borderColor="#14090E" glyphColor="#FFF8FA" scale={1.15} />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)} maxWidth={240}>
          <div className="text-[#14090E] py-0.5">
            <div className="text-xs font-semibold mb-1">Случайная точка на карте</div>
            <div className="text-[11px] font-mono tabular-nums text-[#4A2433]">
              {formatCoordinate(point.lat, 'с.ш.', 'ю.ш.')}
              <br />
              {formatCoordinate(point.lng, 'в.д.', 'з.д.')}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export function RandomPlaceMapSection() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [point, setPoint] = useState<CoordinatePair>(() => generateRandomCoordinate());
  const [zoom, setZoom] = useState<number>(11);

  const handleGenerateRandom = () => {
    setPoint(generateRandomCoordinate());
    setZoom(11);
  };

  const handleResetZoom = () => {
    setZoom(11);
  };

  const mapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;

  return (
    <section id="map" className="py-16 sm:py-24 border-t border-[#3B1D29]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="text-[13px] text-[#C7A3B2] mb-2">
              Интерактивный глобус на базе Google Maps
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#FDF4F7] leading-[1.1]"
              style={{ textWrap: 'balance' }}
            >
              04. Карта случайного места
            </h2>
          </div>

          <button
            type="button"
            onClick={handleGenerateRandom}
            className="h-11 px-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FFF8FA] bg-[#C81E5A] hover:bg-[#DF2B6B] transition-colors duration-150 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF4F7]"
          >
            <Compass className="w-4 h-4" />
            <span>Случайное место</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 h-[400px] sm:h-[460px] lg:h-[500px] bg-[#1E0E15] border border-[#3B1D29] overflow-hidden">
            {apiKey ? (
              <APIProvider apiKey={apiKey} libraries={['marker']} language="ru" region="RU">
                <InnerMapView point={point} zoom={zoom} onZoomChange={setZoom} />
              </APIProvider>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="w-7 h-7 text-[#F04E86] mb-3" />
                <p className="text-sm font-medium text-[#FDF4F7] mb-1">
                  Ключ Google Maps не задан
                </p>
                <p className="text-xs text-[#C7A3B2] max-w-sm">
                  Добавьте переменную окружения VITE_GOOGLE_MAPS_API_KEY для отображения интерактивной карты.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-[#1E0E15] border border-[#3B1D29] p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <div className="text-xs text-[#C7A3B2] mb-1">Текущие координаты</div>
                <div className="font-display text-2xl font-medium text-[#FDF4F7] tabular-nums">
                  {formatCoordinate(point.lat, 'с.ш.', 'ю.ш.')}
                </div>
                <div className="font-display text-2xl font-medium text-[#FDF4F7] tabular-nums">
                  {formatCoordinate(point.lng, 'в.д.', 'з.д.')}
                </div>
              </div>

              <div className="pt-5 border-t border-[#3B1D29] grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#C7A3B2] mb-1">Десятичная широта</div>
                  <div className="text-sm font-medium text-[#FDF4F7] tabular-nums">
                    {point.lat}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#C7A3B2] mb-1">Десятичная долгота</div>
                  <div className="text-sm font-medium text-[#FDF4F7] tabular-nums">
                    {point.lng}
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-[#3B1D29]">
                <div className="text-xs text-[#C7A3B2] mb-1">Масштаб карты</div>
                <div className="text-sm font-medium text-[#FDF4F7] tabular-nums">
                  Уровень {zoom} из 21
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleResetZoom}
                className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#FDF4F7] bg-[#29131D] border border-[#4A2433] hover:border-[#F04E86] transition-colors duration-150 whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#C7A3B2]" />
                <span>Сбросить масштаб</span>
              </button>

              <a
                href={mapsExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#F04E86] border border-[#4A2433] hover:border-[#F04E86] transition-colors duration-150 whitespace-nowrap"
              >
                <span>Открыть в Google Картах</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
