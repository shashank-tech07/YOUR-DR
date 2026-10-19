import { DoctorProfile } from '../types.ts';

export const DOCTORS: DoctorProfile[] = [
  {
    id: 'dr-sterling',
    name: 'Dr. Arthur Sterling, MD, FACC',
    title: 'Emeritus Chief of Cardiology',
    experienceYears: 38,
    previousInstitution: 'Johns Hopkins Hospital',
    specialty: 'Cardiovascular Care & Geriatric Health',
    rating: 4.98,
    consultationFee: '$65 / 45-min unhurried visit',
    availability: 'Available Now',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    path: '/#doctors'
  },
  {
    id: 'dr-vance',
    name: 'Dr. Eleanor Vance, MD',
    title: 'Senior Clinical Director (Ret.)',
    experienceYears: 34,
    previousInstitution: 'Massachusetts General Hospital',
    specialty: 'Internal Medicine & Chronic Care Management',
    rating: 4.95,
    consultationFee: '$60 / 45-min unhurried visit',
    availability: 'Next slot in 20 min',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02638531?auto=format&fit=crop&w=400&q=80',
    path: '/#doctors'
  },
  {
    id: 'dr-chen',
    name: 'Dr. Raymond Chen, MD, PhD',
    title: 'Former Professor of Neurology',
    experienceYears: 41,
    previousInstitution: 'UCSF Medical Center',
    specialty: 'Cognitive Health & Neuro-geriatrics',
    rating: 4.99,
    consultationFee: '$75 / 50-min comprehensive visit',
    availability: 'Available Today',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    path: '/#doctors'
  },
  {
    id: 'dr-al-mansoor',
    name: 'Dr. Soraya Al-Mansoor, MD',
    title: 'Retired Head of Rheumatology',
    experienceYears: 32,
    previousInstitution: 'Mayo Clinic Health System',
    specialty: 'Arthritis, Autoimmune & Joint Mobility',
    rating: 4.96,
    consultationFee: '$65 / 45-min unhurried visit',
    availability: 'In Consultation',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    path: '/#doctors'
  }
];

