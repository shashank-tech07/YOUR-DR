import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Calendar,
  Video,
  Phone,
  FileCheck2,
  Save
} from 'lucide-react';
import { Booking } from '../types.ts';
import { DOCTORS } from '../data/mockPatients.ts';

interface EditBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Booking) => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(booking.doctorId);
  const [date, setDate] = useState<string>(booking.appointmentDate);
  const [time, setTime] = useState<string>(booking.appointmentTime);
  const [type, setType] = useState<'video' | 'audio' | 'second-opinion'>(booking.consultationType);
  const [chiefComplaint, setChiefComplaint] = useState<string>(booking.chiefComplaint);
  const [additionalNotes, setAdditionalNotes] = useState<string>(booking.additionalNotes);

  const [remainingSecs, setRemainingSecs] = useState<number>(() => {
    return Math.max(0, Math.floor((booking.editDeadline - Date.now()) / 1000));
  });

  useEffect(() => {
    setSelectedDoctorId(booking.doctorId);
    setDate(booking.appointmentDate);
    setTime(booking.appointmentTime);
    setType(booking.consultationType);
    setChiefComplaint(booking.chiefComplaint);
    setAdditionalNotes(booking.additionalNotes);
  }, [booking]);

  useEffect(() => {
    const timer = setInterval(() => {
      const left = Math.max(0, Math.floor((booking.editDeadline - Date.now()) / 1000));
      setRemainingSecs(left);
    }, 1000);
    return () => clearInterval(timer);
  }, [booking.editDeadline]);

  if (!isOpen) return null;

  const isExpired = remainingSecs <= 0;
  const minutesLeft = Math.floor(remainingSecs / 60);
  const secondsLeft = remainingSecs % 60;
  const selectedDoctor = DOCTORS.find(d => d.id === selectedDoctorId) || DOCTORS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) return;

    const updated: Booking = {
      ...booking,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorAvatar: selectedDoctor.avatar,
      doctorTitle: selectedDoctor.title,
      fee: selectedDoctor.consultationFee,
      appointmentDate: date,
      appointmentTime: time,
      consultationType: type,
      chiefComplaint,
      additionalNotes
    };

    onSave(updated);
    onClose();
  };

  const timeSlots = [
    '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
    '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM', '04:30 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Edit Booking for Doctor Review</h3>
              <p className="text-[11px] text-slate-400">
                You can adjust any detail within the initial 30-minute grace window.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 30-Minute Timer Alert Banner */}
        <div className={`p-3 border-b flex items-center justify-between gap-3 ${
          isExpired
            ? 'bg-rose-950/40 border-rose-800 text-rose-300'
            : 'bg-teal-950/40 border-teal-800 text-teal-200'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isExpired ? 'text-rose-400' : 'text-teal-400 animate-pulse'}`} />
            <span className="text-xs font-semibold">
              {isExpired
                ? '30-Minute Edit Window Expired — Booking is locked for doctor review.'
                : '30-Minute Grace Window Active'}
            </span>
          </div>

          {!isExpired && (
            <div className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold">
              {minutesLeft}m {secondsLeft.toString().padStart(2, '0')}s remaining
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Select Doctor */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Assigned Emeritus Physician
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DOCTORS.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500 text-white shadow-sm ring-1 ring-teal-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{doc.name}</div>
                      <div className="text-[10px] text-teal-400 font-medium truncate">{doc.specialty}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{doc.consultationFee}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consultation Type */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Consultation Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('video')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  type === 'video'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-teal-400" />
                <span>Unhurried Video (45m)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('audio')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  type === 'audio'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audio Call (40m)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('second-opinion')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  type === 'second-opinion'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Second Opinion Review</span>
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Appointment Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Preferred Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chief Complaint / Symptoms */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Chief Health Complaint / Symptoms for Doctor Review
            </label>
            <textarea
              rows={3}
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Describe what you want the doctor to evaluate..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none"
            />
          </div>

          {/* Additional Notes / Current Meds */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Current Medications & Special Notes for Physician
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Taking Lisinopril 10mg, recent blood work available..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none"
            />
          </div>

          {/* Summary Preview Box */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Submitted for Doctor Approval:
            </div>
            <div className="text-slate-200">
              <span className="font-semibold">{selectedDoctor.name}</span> on{' '}
              <span className="font-semibold text-teal-300">{date} at {time}</span> ({type} consultation)
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isExpired}
              className={`px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-lg ${
                isExpired
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update & Submit for Doctor Approval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
