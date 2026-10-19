import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Edit3,
  Eye,
  Plus,
  Video,
  Phone,
  FileCheck2,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Booking, User } from '../types.ts';
import { DOCTORS } from '../data/mockPatients.ts';
import { EditBookingModal } from './EditBookingModal.tsx';
import { NewBookingModal } from './NewBookingModal.tsx';

interface BookingPortalProps {
  currentUser: User;
  bookings: Booking[];
  onUpdateBooking: (updated: Booking) => void;
  onAddBooking: (newBooking: Booking) => void;
  onAcceptBooking: (bookingId: string) => void;
  onOpenSideViewDoctor: (doctorPath: string) => void;
  onStartVirtualCall: (booking: Booking) => void;
}

export const BookingPortal: React.FC<BookingPortalProps> = ({
  currentUser,
  bookings,
  onUpdateBooking,
  onAddBooking,
  onAcceptBooking,
  onOpenSideViewDoctor,
  onStartVirtualCall
}) => {
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<Booking | null>(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState<boolean>(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Active Pending Booking (the most recent pending one)
  const pendingBooking = bookings.find(b => b.status === 'pending_approval');
  
  // Dynamic countdown timer for the pending booking
  const [remainingSecs, setRemainingSecs] = useState<number>(0);

  useEffect(() => {
    if (!pendingBooking) {
      setRemainingSecs(0);
      return;
    }

    const updateTimer = () => {
      const left = Math.max(0, Math.floor((pendingBooking.editDeadline - Date.now()) / 1000));
      setRemainingSecs(left);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [pendingBooking]);

  const minutesLeft = Math.floor(remainingSecs / 60);
  const secondsLeft = remainingSecs % 60;
  const canEdit = remainingSecs > 0 && pendingBooking?.status === 'pending_approval';

  // Filtered history list
  const filteredBookings = bookings.filter(b => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'pending') return b.status === 'pending_approval';
    if (historyFilter === 'accepted') return b.status === 'accepted';
    if (historyFilter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-slate-100 p-4 md:p-6 space-y-6">
      {/* Front Page Greeting & Quick Action Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Welcome, {currentUser.name}
              </h1>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                currentUser.role === 'doctor'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
              }`}>
                {currentUser.role === 'doctor' ? 'Emeritus Physician' : 'Patient Account'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Your unhurried telehealth dashboard connected to YourDr. platform.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewBookingOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* SECTION 1: PENDING DOCTOR ACCEPTANCE & 30-MIN EDIT WINDOW */}
      {pendingBooking ? (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 -ml-5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Status: Pending Doctor Acceptance
                </span>
                <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
                  • Booking ID: {pendingBooking.id}
                </span>
              </div>
            </div>

            {/* 30-Minute Grace Window Indicator */}
            <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
              canEdit
                ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {canEdit
                  ? `30-Min Edit Window: ${minutesLeft}m ${secondsLeft.toString().padStart(2, '0')}s remaining`
                  : 'Edit Window Expired (Locked for Review)'}
              </span>
            </div>
          </div>

          {/* Booking Content Details */}
          <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Doctor Column */}
            <div className="flex items-start gap-3.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <img
                src={pendingBooking.doctorAvatar}
                alt={pendingBooking.doctorName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500/50 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-teal-400">Selected Physician</span>
                <h3 className="text-sm font-bold text-white truncate">{pendingBooking.doctorName}</h3>
                <p className="text-xs text-slate-300">{pendingBooking.doctorSpecialty}</p>
                <p className="text-[11px] text-slate-400 mt-1">{pendingBooking.doctorTitle}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {pendingBooking.fee}
                </span>
              </div>
            </div>

            {/* Appointment Schedule Column */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Appointment Schedule</span>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{pendingBooking.appointmentDate} at {pendingBooking.appointmentTime}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                {pendingBooking.consultationType === 'video' ? (
                  <Video className="w-3.5 h-3.5 text-teal-400" />
                ) : pendingBooking.consultationType === 'audio' ? (
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="capitalize">{pendingBooking.consultationType} Unhurried Consultation</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                45-minute focused session dedicated to unhurried listening and clinical review.
              </p>
            </div>

            {/* Clinical Concerns Column */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400">Chief Complaint & Symptoms</span>
                <span className="text-[10px] text-slate-400 font-mono">For Doctor Review</span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-900 p-2 rounded-lg border border-slate-800">
                "{pendingBooking.chiefComplaint}"
              </p>
              {pendingBooking.additionalNotes && (
                <div className="text-[11px] text-slate-400 truncate">
                  <span className="font-semibold text-slate-300">Notes:</span> {pendingBooking.additionalNotes}
                </div>
              )}
            </div>
          </div>

          {/* Action Row: Edit, View Payload, and Doctor Acceptance */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Edit Button with 30-min window check */}
              <button
                onClick={() => setSelectedBookingForEdit(pendingBooking)}
                disabled={!canEdit}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  canEdit
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                title={canEdit ? 'Edit any booking detail within 30 minutes' : '30-minute edit period has passed'}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{canEdit ? 'Edit Booking (30-Min Window)' : 'Edit Locked (30m Expired)'}</span>
              </button>

              {/* View exact submitted details for doctor approval */}
              <button
                onClick={() => setExpandedDetailsId(
                  expandedDetailsId === pendingBooking.id ? null : pendingBooking.id
                )}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
              >
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  {expandedDetailsId === pendingBooking.id
                    ? 'Hide Submission Details'
                    : 'Show Details Chosen for Doctor Approval'}
                </span>
              </button>
            </div>

            {/* Doctor Review & Acceptance Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAcceptBooking(pendingBooking.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {currentUser.role === 'doctor'
                    ? 'Accept & Confirm Consultation'
                    : 'Simulate Doctor Acceptance'}
                </span>
              </button>
            </div>
          </div>

          {/* Expanded Submission Payload Drawer */}
          {expandedDetailsId === pendingBooking.id && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Exact Record Transmitted for Doctor Approval</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Transmitted at: {new Date(pendingBooking.bookedAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                  <span className="text-white font-semibold">{pendingBooking.patientName}</span>
                  <span className="text-[11px] text-slate-400 block">{pendingBooking.patientEmail}</span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Requested Physician</span>
                  <span className="text-teal-300 font-semibold">{pendingBooking.doctorName}</span>
                  <span className="text-[11px] text-slate-400 block">{pendingBooking.doctorSpecialty}</span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Slot & Format</span>
                  <span className="text-white font-semibold">{pendingBooking.appointmentDate} • {pendingBooking.appointmentTime}</span>
                  <span className="text-[11px] text-teal-400 block capitalize">{pendingBooking.consultationType} visit</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Clinical Chief Complaint & Symptoms:
                </span>
                <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                  {pendingBooking.chiefComplaint}
                </p>
                {pendingBooking.additionalNotes && (
                  <p className="text-slate-400 text-[11px] mt-2 pt-2 border-t border-slate-800">
                    <strong className="text-slate-300">Patient Notes:</strong> {pendingBooking.additionalNotes}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No pending booking state */
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Pending Bookings</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All your appointment requests have been processed. You can book an unhurried consultation with any retired specialist right now.
          </p>
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Doctor Consultation</span>
          </button>
        </div>
      )}

      {/* SECTION 2: BOOKING HISTORY */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Consultation Booking History</span>
            </h2>
            <p className="text-xs text-slate-400">
              Complete log of your booked appointments, active statuses, and post-visit doctor notes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'pending', 'accepted', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setHistoryFilter(tab)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition ${
                  historyFilter === tab
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* History Cards List */}
        <div className="space-y-3">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((bk) => (
              <div
                key={bk.id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 rounded-xl p-4 transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={bk.doctorAvatar}
                      alt={bk.doctorName}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{bk.doctorName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          bk.status === 'pending_approval'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : bk.status === 'accepted'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-700/30 border-slate-600 text-slate-300'
                        }`}>
                          {bk.status === 'pending_approval' ? 'Pending Approval' : bk.status === 'accepted' ? 'Confirmed & Active' : 'Completed'}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-400 font-medium">{bk.doctorSpecialty}</p>
                      <p className="text-xs text-slate-300 mt-1">
                        <span className="font-semibold">{bk.appointmentDate}</span> at {bk.appointmentTime} ({bk.consultationType} visit)
                      </p>
                    </div>
                  </div>

                  {/* Right side actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {bk.status === 'accepted' && (
                      <button
                        onClick={() => onStartVirtualCall(bk)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Launch Visit</span>
                      </button>
                    )}

                    {bk.status === 'pending_approval' && (
                      <button
                        onClick={() => setSelectedBookingForEdit(bk)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Chief Complaint snippet */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-300">
                  <span className="text-slate-400 font-semibold">Chief Complaint:</span> {bk.chiefComplaint}
                </div>

                {/* Doctor notes if completed */}
                {bk.doctorNotes && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold text-teal-400 uppercase block mb-0.5">
                      Doctor Post-Visit Summary:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{bk.doctorNotes}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No bookings found matching filter "{historyFilter}".
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: EMERITUS DOCTOR ROSTER */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>Browse Emeritus Physicians</span>
            </h2>
            <p className="text-xs text-slate-400">
              Retired department chiefs and senior professors available for unhurried consultations.
            </p>
          </div>

          <button
            onClick={() => onOpenSideViewDoctor('https://your-doctor-nine.vercel.app/#doctors')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            <span>View on Side View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-teal-500/40 transition group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-teal-500 transition shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition truncate">
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-slate-300">{doc.title}</p>
                  <p className="text-[10px] text-teal-400 font-medium mt-0.5">{doc.specialty}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {doc.experienceYears} Years Clinical Experience • {doc.previousInstitution}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">{doc.consultationFee}</span>
                <button
                  onClick={() => setIsNewBookingOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-xs font-bold border border-teal-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Booking Modal */}
      {selectedBookingForEdit && (
        <EditBookingModal
          booking={selectedBookingForEdit}
          isOpen={true}
          onClose={() => setSelectedBookingForEdit(null)}
          onSave={(updated) => {
            onUpdateBooking(updated);
            setSelectedBookingForEdit(null);
          }}
        />
      )}

      {/* New Booking Modal */}
      <NewBookingModal
        currentUser={currentUser}
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onCreated={(newBooking) => {
          onAddBooking(newBooking);
        }}
      />
    </div>
  );
};
