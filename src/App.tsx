import { useEffect, useState } from 'react';
import { BookingDrawer } from './components/BookingDrawer';
import { ChatBotWidget } from './components/ChatBotWidget';
import { ClubSection } from './components/ClubSection';
import { DirectionsSection } from './components/DirectionsSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MastersSection } from './components/MastersSection';
import { RandomPlaceMapSection } from './components/RandomPlaceMapSection';
import { ServicesSection } from './components/ServicesSection';
import { BarberMaster, ServiceItem } from './data/barbershop';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);
  const [preselectedMaster, setPreselectedMaster] = useState<BarberMaster | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleOpenGeneralBooking = () => {
    setPreselectedService(null);
    setPreselectedMaster(null);
    setBookingOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setPreselectedService(service);
    setPreselectedMaster(null);
    setBookingOpen(true);
  };

  const handleSelectMaster = (master: BarberMaster) => {
    setPreselectedMaster(master);
    setPreselectedService(null);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#14090E] text-[#FDF4F7] flex flex-col">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Header onOpenBooking={handleOpenGeneralBooking} />

      <main className="flex-1">
        <Hero onOpenBooking={handleOpenGeneralBooking} />
        <ServicesSection onSelectService={handleSelectService} />
        <MastersSection onSelectMaster={handleSelectMaster} />
        <ClubSection onOpenBooking={handleOpenGeneralBooking} />
        <RandomPlaceMapSection />
        <DirectionsSection />
      </main>

      <Footer />

      <BookingDrawer
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialService={preselectedService}
        initialMaster={preselectedMaster}
      />

      <ChatBotWidget onOpenBooking={handleOpenGeneralBooking} />
    </div>
  );
}
