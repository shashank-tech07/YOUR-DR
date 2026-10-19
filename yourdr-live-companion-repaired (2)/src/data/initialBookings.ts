import { Booking } from '../types.ts';

const NOW = Date.now();
// 10 minutes ago, so 20 minutes remain on the 30-minute edit grace window!
const TEN_MINS_AGO = NOW - 10 * 60 * 1000;
const THREE_DAYS_AGO = NOW - 3 * 24 * 60 * 60 * 1000;
const TWO_WEEKS_AGO = NOW - 14 * 24 * 60 * 60 * 1000;

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-current-001',
    patientId: 'user-pt-001',
    patientName: 'Eleanor Higgins',
    patientEmail: 'eleanor.higgins@example.com',
    doctorId: 'dr-sterling',
    doctorName: 'Dr. Arthur Sterling, MD, FACC',
    doctorTitle: 'Emeritus Chief of Cardiology (Johns Hopkins)',
    doctorSpecialty: 'Cardiovascular Care & Geriatric Health',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    consultationType: 'video',
    appointmentDate: new Date(NOW + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    appointmentTime: '10:30 AM',
    chiefComplaint: 'Morning blood pressure spikes averaging 138/88 and mild bilateral knee stiffness.',
    additionalNotes: 'Currently taking Lisinopril 10mg daily. Would like to discuss adjusting timing or lifestyle modifications.',
    bookedAt: TEN_MINS_AGO,
    editDeadline: TEN_MINS_AGO + 30 * 60 * 1000, // 20 mins remaining
    status: 'pending_approval',
    fee: '$65 / 45-min unhurried visit',
    vitalsProvided: {
      bloodPressure: '134/86 mmHg',
      heartRate: '68 bpm'
    }
  },
  {
    id: 'bk-past-002',
    patientId: 'user-pt-001',
    patientName: 'Eleanor Higgins',
    patientEmail: 'eleanor.higgins@example.com',
    doctorId: 'dr-vance',
    doctorName: 'Dr. Eleanor Vance, MD',
    doctorTitle: 'Senior Clinical Director (Ret. Mass General)',
    doctorSpecialty: 'Internal Medicine & Chronic Care Management',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813571-638f02638531?auto=format&fit=crop&w=400&q=80',
    consultationType: 'video',
    appointmentDate: new Date(THREE_DAYS_AGO).toISOString().split('T')[0],
    appointmentTime: '02:00 PM',
    chiefComplaint: 'Routine blood panel review & thyroid follow-up.',
    additionalNotes: 'Reviewed TSH and Lipid panels. Regimen confirmed stable.',
    bookedAt: THREE_DAYS_AGO - 3600 * 1000,
    editDeadline: THREE_DAYS_AGO - 1800 * 1000,
    status: 'completed',
    doctorNotes: 'TSH is 2.1 mIU/L (euthyroid). Continue current levothyroxine 50mcg. Routine repeat in 6 months.',
    fee: '$60 / 45-min unhurried visit'
  },
  {
    id: 'bk-past-003',
    patientId: 'user-pt-001',
    patientName: 'Eleanor Higgins',
    patientEmail: 'eleanor.higgins@example.com',
    doctorId: 'dr-chen',
    doctorName: 'Dr. Raymond Chen, MD, PhD',
    doctorTitle: 'Former Professor of Neurology (UCSF)',
    doctorSpecialty: 'Cognitive Health & Sleep Quality',
    doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    consultationType: 'audio',
    appointmentDate: new Date(TWO_WEEKS_AGO).toISOString().split('T')[0],
    appointmentTime: '11:00 AM',
    chiefComplaint: 'Sleep onset restlessness and occasional evening fatigue.',
    additionalNotes: 'Discussed sleep hygiene protocols without escalating sedative medications.',
    bookedAt: TWO_WEEKS_AGO - 3600 * 1000,
    editDeadline: TWO_WEEKS_AGO - 1800 * 1000,
    status: 'completed',
    doctorNotes: 'Recommended morning daylight exposure and evening blue light reduction. Sleep latency improved.',
    fee: '$75 / 50-min comprehensive visit'
  }
];
