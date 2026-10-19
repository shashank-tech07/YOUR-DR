export type ViewportMode = 'responsive' | 'mobile' | 'tablet' | 'desktop';

export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  title?: string;
}

export type BookingStatus = 'pending_approval' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  doctorTitle: string;
  consultationType: 'video' | 'audio' | 'second-opinion';
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "10:30 AM"
  chiefComplaint: string;
  additionalNotes: string;
  bookedAt: number; // timestamp in ms
  editDeadline: number; // bookedAt + 30 * 60 * 1000 (30 minutes)
  status: BookingStatus;
  doctorNotes?: string;
  fee: string;
  category?: 'doctor' | 'nutrition' | 'psychiatry' | 'wellness' | 'free_stream';
  vitalsProvided?: {
    bloodPressure?: string;
    heartRate?: string;
  };
}

export type LiveCareSectionId =
  | 'free-doctor-room'
  | 'nutrition'
  | 'psychiatry'
  | 'doctors'
  | 'wellness';

export interface LiveStreamMessage {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  time: string;
  isDoctor?: boolean;
  isQuestion?: boolean;
}

export interface CareSpecialist {
  id: string;
  name: string;
  title: string;
  category: 'nutrition' | 'psychiatry' | 'doctor' | 'wellness';
  specialty: string;
  credentials: string;
  experienceYears: number;
  avatar: string;
  rating: number;
  reviewsCount: number;
  fee: string;
  subscriptionPlan: string;
  availability: string;
  topics: string[];
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  previousInstitution: string;
  specialty: string;
  rating: number;
  consultationFee: string;
  availability: string;
  avatar: string;
  path: string;
}
