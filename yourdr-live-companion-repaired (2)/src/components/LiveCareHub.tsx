import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Users,
  Video,
  Mic,
  Hand,
  Heart,
  Send,
  Sparkles,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Unlock,
  CreditCard,
  Plus,
  MessageSquare,
  Stethoscope,
  Smile
} from 'lucide-react';
import { LiveCareSectionId, CareSpecialist, LiveStreamMessage, User } from '../types.ts';
import { CARE_SPECIALISTS, INITIAL_LIVE_MESSAGES } from '../data/careSpecialists.ts';

interface LiveCareHubProps {
  currentUser: User;
  onBookSpecialist: (specialist: CareSpecialist, consultationType: 'video' | 'audio', date: string, time: string, complaint: string) => void;
  onNavigateSideView: (url: string) => void;
}

export const LiveCareHub: React.FC<LiveCareHubProps> = ({
  currentUser,
  onBookSpecialist,
  onNavigateSideView
}) => {
  const [activeSection, setActiveSection] = useState<LiveCareSectionId>('free-doctor-room');

  // Free Live Room state
  const [messages, setMessages] = useState<LiveStreamMessage[]>(INITIAL_LIVE_MESSAGES);
  const [chatInput, setChatInput] = useState<string>('');
  const [isQuestion, setIsQuestion] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [reactionsCount, setReactionsCount] = useState<number>(342);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(158);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Subscriptions state (persisted or toggleable by user)
  const [subscribedSections, setSubscribedSections] = useState<Record<string, boolean>>({
    'nutrition': false,
    'psychiatry': false,
    'doctors': true, // VIP doctor pass active by default for demonstration
    'wellness': false
  });

  // Booking specialist modal state
  const [bookingModalSpecialist, setBookingModalSpecialist] = useState<CareSpecialist | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState<string>('02:30 PM');
  const [bookingType, setBookingType] = useState<'video' | 'audio'>('video');
  const [bookingComplaint, setBookingComplaint] = useState<string>('');
  const [bookingSuccessToast, setBookingSuccessToast] = useState<string | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (activeSection === 'free-doctor-room') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeSection]);

  // Periodic simulated live viewer fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5 - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveStreamMessage = {
      id: `msg-${Date.now()}`,
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuestion: isQuestion
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsQuestion(false);

    // If marked as question, doctor simulates an answer in 3 seconds
    if (isQuestion) {
      setTimeout(() => {
        const docReply: LiveStreamMessage = {
          id: `reply-${Date.now()}`,
          user: 'Dr. Arthur Sterling, MD',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
          text: `Great question, ${currentUser.name}! In our unhurried approach, we always recommend tracking baseline symptoms before medication changes. I will review this in detail on today's free broadcast.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDoctor: true
        };
        setMessages(prev => [...prev, docReply]);
      }, 3500);
    }
  };

  const handleSendReaction = (_emoji: string) => {
    setReactionsCount(prev => prev + 1);
    const newHeart = { id: Date.now() + Math.random(), left: 20 + Math.random() * 60 };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  const toggleSubscription = (sectionId: string, planName: string) => {
    const current = subscribedSections[sectionId] || false;
    setSubscribedSections(prev => ({ ...prev, [sectionId]: !current }));
    setBookingSuccessToast(
      !current
        ? `Successfully subscribed to ${planName}! Unlimited access unlocked.`
        : `Subscription cancelled for ${planName}.`
    );
    setTimeout(() => setBookingSuccessToast(null), 3500);
  };

  const handleOpenBookingModal = (specialist: CareSpecialist) => {
    setBookingModalSpecialist(specialist);
    setBookingComplaint('');
    if (specialist.category === 'nutrition') {
      setBookingComplaint('Requesting personalized metabolic diet and glycemic control plan.');
    } else if (specialist.category === 'psychiatry') {
      setBookingComplaint('Seeking unhurried consultation regarding stress, sleep architecture, and mood support.');
    } else if (specialist.category === 'wellness') {
      setBookingComplaint('Mobility screening and safe home exercise plan for joint preservation.');
    } else {
      setBookingComplaint('Cardiac review for morning blood pressure spikes.');
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalSpecialist) return;

    onBookSpecialist(
      bookingModalSpecialist,
      bookingType,
      bookingDate,
      bookingTime,
      bookingComplaint
    );

    setBookingSuccessToast(
      `Appointment requested with ${bookingModalSpecialist.name}! You have a 30-minute grace window to edit details.`
    );
    setBookingModalSpecialist(null);
    setTimeout(() => setBookingSuccessToast(null), 4000);
  };

  // Section configs
  const sections = [
    {
      id: 'free-doctor-room' as LiveCareSectionId,
      label: 'Free Doctor Live Room',
      badge: '100% FREE',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      icon: Radio,
      desc: 'Free open live consultations, public Q&A and health town halls hosted by retired doctors.'
    },
    {
      id: 'nutrition' as LiveCareSectionId,
      label: 'Nutrition & Diet Care',
      badge: 'Subscription Pass',
      badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      icon: Sparkles,
      desc: '1-on-1 registered clinical dietitians, customized meal plans, and metabolic coaching.'
    },
    {
      id: 'psychiatry' as LiveCareSectionId,
      label: 'Psychiatry & Mental Health',
      badge: 'Subscription Pass',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      icon: Smile,
      desc: 'Licensed psychiatrists and psychotherapists for thoughtful, confidential emotional care.'
    },
    {
      id: 'doctors' as LiveCareSectionId,
      label: 'Book Professional Doctor',
      badge: 'VIP Care Pass',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      icon: Stethoscope,
      desc: 'Unhurried 45-minute virtual consultations with veteran emeritus physicians.'
    },
    {
      id: 'wellness' as LiveCareSectionId,
      label: 'Wellness & Longevity',
      badge: 'Subscription Pass',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: Heart,
      desc: 'Physical therapists and longevity coaches for senior mobility, balance, and vitality.'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Toast Notification */}
      {bookingSuccessToast && (
        <div className="fixed top-16 right-5 z-50 bg-teal-950/95 border border-teal-500/50 text-teal-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{bookingSuccessToast}</span>
        </div>
      )}

      {/* 5-Section Header Navigation Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2.5 overflow-x-auto shrink-0 z-10">
        <div className="flex items-center gap-2 min-w-max">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  isActive
                    ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/20'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-400'}`} />
                <span>{sec.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                  isActive ? 'bg-white/20 text-white border-white/30' : sec.badgeColor
                }`}>
                  {sec.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: FREE LIVE ROOM BY DOCTORS (100% FREE) */}
      {activeSection === 'free-doctor-room' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Broadcast Stage (Left / Center) */}
          <div className="flex-1 flex flex-col bg-slate-950 p-4 overflow-y-auto space-y-4">
            {/* Live Video Stage */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-video max-h-[460px] flex items-center justify-center group">
              {/* Host Stream Visual */}
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
                alt="Dr. Arthur Sterling Hosting Live"
                className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition duration-700"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 pointer-events-none" />

              {/* Floating Live Indicator & Free Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg shadow-rose-600/30">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>LIVE BROADCAST</span>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 shadow">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% FREE FOR EVERYONE</span>
                </div>
              </div>

              {/* Top Right: Viewer count & Audio wave */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-slate-700 text-slate-200 text-xs font-medium">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{viewerCount} Watching</span>
                </div>
              </div>

              {/* Floating Hearts Animation Container */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {floatingHearts.map((h) => (
                  <div
                    key={h.id}
                    style={{ left: `${h.left}%` }}
                    className="absolute bottom-12 text-2xl animate-float-heart"
                  >
                    ❤️
                  </div>
                ))}
              </div>

              {/* Bottom Video Controls & Doctor Info */}
              <div className="absolute bottom-3 inset-x-3 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 z-10">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                    alt="Dr. Sterling"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-400"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Dr. Arthur Sterling, MD, FACC</span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30">Host</span>
                    </div>
                    <p className="text-[11px] text-teal-300 font-medium">
                      Topic: Morning Blood Pressure Surges & Senior Heart Wellness
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Raise Hand Button */}
                  <button
                    onClick={() => {
                      setIsHandRaised(!isHandRaised);
                      setBookingSuccessToast(
                        !isHandRaised
                          ? 'Hand raised! The doctor will invite you to speak shortly.'
                          : 'Hand lowered.'
                      );
                      setTimeout(() => setBookingSuccessToast(null), 3000);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      isHandRaised
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <Hand className="w-3.5 h-3.5" />
                    <span>{isHandRaised ? 'Hand Raised' : 'Raise Hand to Ask'}</span>
                  </button>

                  {/* Reaction Heart Button */}
                  <button
                    onClick={() => handleSendReaction('❤️')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{reactionsCount}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Doctor Free Open Consultation Schedule */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <span>Upcoming 100% Free Live Doctor Streams</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Open community broadcasts hosted by retired physicians for public health Q&A.
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Always Free
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                    TODAY
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Managing Knee & Joint Stiffness Without Pills</h4>
                    <p className="text-[11px] text-slate-400">Host: Dr. Soraya Al-Mansoor, MD (Rheumatology)</p>
                    <div className="text-[10px] text-teal-400 font-mono mt-1">Today at 04:30 PM EST • 45 mins</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                    TOMORROW
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sleep Quality & Memory Retention in Seniors</h4>
                    <p className="text-[11px] text-slate-400">Host: Dr. Raymond Chen, MD, PhD (Neurology)</p>
                    <div className="text-[10px] text-teal-400 font-mono mt-1">Tomorrow at 10:00 AM EST • 50 mins</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Chat & Doctor Q&A Stream */}
          <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-80 lg:h-full">
            {/* Chat Header */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white">Live Doctor Q&A Stream</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
            </div>

            {/* Chat Messages Scroll */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl text-xs space-y-1 transition ${
                    m.isDoctor
                      ? 'bg-teal-950/60 border border-teal-500/40 text-teal-100'
                      : m.isQuestion
                      ? 'bg-amber-950/50 border border-amber-500/30 text-amber-100'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      {m.isDoctor && <Stethoscope className="w-3 h-3 text-teal-400 inline" />}
                      <span className={m.isDoctor ? 'text-teal-300' : 'text-slate-300'}>{m.user}</span>
                      {m.isDoctor && (
                        <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1 rounded font-normal">MD</span>
                      )}
                      {m.isQuestion && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-normal">Question</span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{m.text}</p>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} className="p-2.5 bg-slate-950 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isQuestion}
                    onChange={(e) => setIsQuestion(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-0"
                  />
                  <span className={isQuestion ? 'text-amber-300 font-semibold' : ''}>
                    Ask as Clinical Question
                  </span>
                </label>
                <span className="text-[10px] text-teal-400">Free to participate</span>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={isQuestion ? 'Type your medical question for the doctor...' : 'Send a friendly message...'}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTIONS 2, 3, 4, 5: SUBSCRIPTION & BOOKING PASS CARE SECTIONS */}
      {activeSection !== 'free-doctor-room' && (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Subscription Banner */}
          {(() => {
            const secInfo = sections.find(s => s.id === activeSection);
            const isSubscribed = subscribedSections[activeSection] || false;
            return (
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{secInfo?.label}</h2>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isSubscribed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isSubscribed ? 'Active Care Pass Unlocked' : 'Subscription Booking Pass'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl">
                    {secInfo?.desc} All bookings include our trademark 30-minute grace edit window and pending clinician acceptance.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => toggleSubscription(activeSection, secInfo?.label || 'Care Pass')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg ${
                      isSubscribed
                        ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
                        : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isSubscribed ? 'Manage Subscription' : 'Activate Monthly Care Pass'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Specialists List for this Category */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Available Specialists & Clinicians
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select a licensed specialist below to book a comprehensive 1-on-1 virtual visit.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateSideView('https://your-doctor-nine.vercel.app/#doctors')}
                className="text-[11px] text-teal-400 hover:text-teal-300 font-medium transition cursor-pointer"
              >
                View on Platform Side View &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CARE_SPECIALISTS
                .filter(spec => {
                  if (activeSection === 'nutrition') return spec.category === 'nutrition';
                  if (activeSection === 'psychiatry') return spec.category === 'psychiatry';
                  if (activeSection === 'doctors') return spec.category === 'doctor';
                  if (activeSection === 'wellness') return spec.category === 'wellness';
                  return true;
                })
                .map((specialist) => (
                  <div
                    key={specialist.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-teal-500/50 transition group shadow-lg"
                  >
                    <div>
                      {/* Top Info */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={specialist.avatar}
                          alt={specialist.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-teal-500 transition shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition truncate">
                            {specialist.name}
                          </h4>
                          <p className="text-xs text-slate-300">{specialist.title}</p>
                          <p className="text-[11px] text-teal-400 font-medium mt-0.5">{specialist.specialty}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{specialist.credentials}</p>
                        </div>
                      </div>

                      {/* Clinical Topics Covered */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {specialist.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action & Pricing */}
                    <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-emerald-400">{specialist.fee}</div>
                        <div className="text-[10px] text-slate-400">{specialist.availability}</div>
                      </div>

                      <button
                        onClick={() => handleOpenBookingModal(specialist)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book Session</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalSpecialist && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={bookingModalSpecialist.avatar}
                  alt={bookingModalSpecialist.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/50"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Book {bookingModalSpecialist.name}
                  </h3>
                  <p className="text-[11px] text-teal-400">{bookingModalSpecialist.specialty}</p>
                </div>
              </div>

              <button
                onClick={() => setBookingModalSpecialist(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* 30-Min Grace Notice */}
            <div className="p-3 bg-teal-950/40 border-b border-teal-800 text-teal-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                30-Minute Grace Guarantee: You can modify or edit all booking details for 30 minutes after submission.
              </span>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-5 space-y-4">
              {/* Consultation Format */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Consultation Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('video')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      bookingType === 'video'
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-teal-400" />
                    <span>Unhurried Video (45m)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('audio')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      bookingType === 'audio'
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dedicated Audio Call</span>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Chief Complaint / Goals */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Primary Goals or Symptoms for Specialist Review
                </label>
                <textarea
                  rows={3}
                  required
                  value={bookingComplaint}
                  onChange={(e) => setBookingComplaint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none"
                  placeholder="Describe your health goals or symptoms..."
                />
              </div>

              {/* Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs font-bold text-emerald-400">{bookingModalSpecialist.fee}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalSpecialist(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/20"
                  >
                    Confirm & Submit for Review
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
