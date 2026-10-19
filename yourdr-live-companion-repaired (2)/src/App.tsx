import { useState, useEffect } from 'react';
import {
  Stethoscope,
  Home,
  Calendar,
  Radio,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_BOOKINGS } from './data/initialBookings.ts';
import { Booking, User, CareSpecialist } from './types.ts';
import { SideViewFrame } from './components/SideViewFrame.tsx';
import { LoginGate } from './components/LoginGate.tsx';
import { BookingPortal } from './components/BookingPortal.tsx';
import { LiveCareHub } from './components/LiveCareHub.tsx';

type MainTab = 'home' | 'portal' | 'live-hub';

export default function App() {
  // Authentication state: starts NULL so everyone MUST log in first!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem('yourdr_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Bookings state (persisted in localStorage)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('yourdr_patient_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Default active tab: Home (Live Side View of your-doctor-nine.vercel.app as the Home Page!)
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [targetUrl, setTargetUrl] = useState<string>('/home-portal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync bookings to localStorage
  useEffect(() => {
    localStorage.setItem('yourdr_patient_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('yourdr_auth_user', JSON.stringify(user));
    setToastMessage(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('yourdr_auth_user');
  };

  // Booking updates
  const handleUpdateBooking = (updated: Booking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    setToastMessage('Booking details updated and re-submitted for doctor approval.');
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setToastMessage('New booking requested. 30-minute edit window is now active.');
  };

  const handleBookSpecialist = (
    specialist: CareSpecialist,
    consultationType: 'video' | 'audio',
    date: string,
    time: string,
    complaint: string
  ) => {
    if (!currentUser) return;
    const now = Date.now();
    const newBooking: Booking = {
      id: `bk-${now}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      doctorId: specialist.id,
      doctorName: specialist.name,
      doctorTitle: specialist.title,
      doctorSpecialty: specialist.specialty,
      doctorAvatar: specialist.avatar,
      consultationType,
      appointmentDate: date,
      appointmentTime: time,
      chiefComplaint: complaint,
      additionalNotes: `Booked via Live Care Hub (${specialist.category.toUpperCase()}). Subscription Care Pass applied.`,
      bookedAt: now,
      editDeadline: now + 30 * 60 * 1000, // 30-min grace window
      status: 'pending_approval',
      fee: specialist.fee,
      category: specialist.category,
      vitalsProvided: {
        bloodPressure: '128/82 mmHg',
        heartRate: '70 bpm'
      }
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveTab('portal'); // Take directly to bookings to see pending state & 30-min timer
    setToastMessage(`Booking created with ${specialist.name}! Pending state & 30-min edit window active.`);
  };

  const handleAcceptBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'accepted',
          doctorNotes: 'Doctor has reviewed your medical profile and confirmed your appointment time.'
        };
      }
      return b;
    }));
    setToastMessage('Appointment request accepted and confirmed by doctor!');
  };

  const handleNavigateHomeTarget = (url: string) => {
    setTargetUrl(url);
    setActiveTab('home');
    setToastMessage(`Navigated Home view to: ${url.replace('https://your-doctor-nine.vercel.app', '') || '/'}`);
  };

  // If user is not authenticated, show mandatory Login Gate
  if (!currentUser) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Main Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 z-30">
        {/* Brand & Connected Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">YourDr.</span>
                <span className="text-[10px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  Platform
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Connected: <span className="text-teal-400 font-mono">your-doctor-nine.vercel.app</span>
              </p>
            </div>
          </div>
        </div>

        {/* 3 Main Navigation Tabs: Home (in front), Live Care Hub, and My Bookings & Approvals (in the last) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'home'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-teal-300" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('live-hub')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition relative ${
              activeTab === 'live-hub'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Live Care Hub (5 Rooms)</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'portal'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Bookings & Approvals</span>
          </button>
        </div>

        {/* Right Section: User Profile & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500/50"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.name}</div>
              <div className="text-[10px] text-teal-400 font-medium capitalize">{currentUser.role}</div>
            </div>

            {/* Explicit Sign Out Button */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-teal-950/90 backdrop-blur border border-teal-500/40 text-teal-200 px-3.5 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Screen Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' ? (
          /* TAB 1: SIDE VIEW AS THE HOME PAGE */
          <div className="w-full h-full bg-slate-950">
            <SideViewFrame
              currentUrl={targetUrl}
              onUrlChange={(url) => setTargetUrl(url)}
              isExpanded={true}
            />
          </div>
        ) : activeTab === 'portal' ? (
          /* TAB 2: MY BOOKINGS & APPROVALS (Pending State, 30-min Grace Window, History) */
          <div className="w-full h-full bg-slate-900">
            <BookingPortal
              currentUser={currentUser}
              bookings={bookings}
              onUpdateBooking={handleUpdateBooking}
              onAddBooking={handleAddBooking}
              onAcceptBooking={handleAcceptBooking}
              onOpenSideViewDoctor={handleNavigateHomeTarget}
              onStartVirtualCall={() => {
                setActiveTab('live-hub');
                setToastMessage('Opened Live Care Hub to begin your session.');
              }}
            />
          </div>
        ) : (
          /* TAB 3: FANCY LIVE CARE HUB (5 Rooms: Free Doctor Live Room, Nutrition, Psychiatry, Doctors, Wellness) */
          <div className="w-full h-full bg-slate-950">
            <LiveCareHub
              currentUser={currentUser}
              onBookSpecialist={handleBookSpecialist}
              onNavigateSideView={handleNavigateHomeTarget}
            />
          </div>
        )}
      </main>
    </div>
  );
}
