import React, { useState } from 'react';
import {
  X,
  Video,
  Phone,
  FileCheck2,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';
import { Booking, User } from '../types.ts';
import { DOCTORS } from '../data/mockPatients.ts';

interface NewBookingModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (booking: Booking) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onCreated
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(DOCTORS[0].id);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [date, setDate] = useState<string>(tomorrow);
  const [time, setTime] = useState<string>('11:15 AM');
  const [type, setType] = useState<'video' | 'audio' | 'second-opinion'>('video');
  const [chiefComplaint, setChiefComplaint] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  if (!isOpen) return null;

  const selectedDoctor = DOCTORS.find(d => d.id === selectedDoctorId) || DOCTORS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiefComplaint.trim()) return;

    const now = Date.now();
    const newBooking: Booking = {
      id: `bk-${now}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorTitle: selectedDoctor.title,
      doctorSpecialty: selectedDoctor.specialty,
      doctorAvatar: selectedDoctor.avatar,
      consultationType: type,
      appointmentDate: date,
      appointmentTime: time,
      chiefComplaint,
      additionalNotes,
      bookedAt: now,
      editDeadline: now + 30 * 60 * 1000, // 30 mins grace window
      status: 'pending_approval',
      fee: selectedDoctor.consultationFee,
      vitalsProvided: {
        bloodPressure: '124/82 mmHg',
        heartRate: '72 bpm'
      }
    };

    onCreated(newBooking);
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
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Book an Emeritus Physician</h3>
              <p className="text-[11px] text-slate-400">
                You will have 30 minutes after booking to adjust any details before doctor acceptance.
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Select Doctor */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Select Physician
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
                        ? 'bg-teal-500/15 border-teal-500 text-white ring-1 ring-teal-500/40 shadow-sm'
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
                <span>Video (45m)</span>
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
                <span>Audio (40m)</span>
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
                <span>Second Opinion</span>
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

          {/* Chief Complaint */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Primary Reason for Visit / Symptoms
            </label>
            <textarea
              rows={3}
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Experiencing morning dizziness after taking medications; request doctor review."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Current Medications & Special Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Taking Atorvastatin 20mg, recent lipid panel available."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none"
            />
          </div>

          {/* Footer */}
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
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-600/20 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit Booking Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
