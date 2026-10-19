import { CareSpecialist, LiveStreamMessage } from '../types.ts';

export const CARE_SPECIALISTS: CareSpecialist[] = [
  // --- SECTION 1: NUTRITION & DIETARY CARE ---
  {
    id: 'nutr-01',
    name: 'Maya Lin, MS, RD, CDCES',
    title: 'Lead Clinical Dietitian & Diabetes Educator',
    category: 'nutrition',
    specialty: 'Metabolic Health, Cardiac Diet & Diabetes Nutrition',
    credentials: 'MS in Clinical Nutrition (Columbia Univ), Board Certified CDCES',
    experienceYears: 16,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.97,
    reviewsCount: 312,
    fee: '$45 / 40-min 1-on-1 Nutrition Visit',
    subscriptionPlan: 'Nutrition Care Pass: $39/month (2 Visits + Custom Meal Plans)',
    availability: 'Slots available Today at 02:30 PM',
    topics: ['Low-Sodium Heart Diet', 'Glycemic Index Control', 'Anti-Inflammatory Nutrition', 'Renal-Friendly Meal Plans']
  },
  {
    id: 'nutr-02',
    name: 'Julian Vance, CNS, LDN',
    title: 'Integrative Nutrition & Gut Health Specialist',
    category: 'nutrition',
    specialty: 'Senior Micronutrient Absorption & Digestive Wellness',
    credentials: 'Certified Nutrition Specialist, Former Brigham & Women\'s Dietitian',
    experienceYears: 19,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    rating: 4.93,
    reviewsCount: 248,
    fee: '$40 / 40-min 1-on-1 Nutrition Visit',
    subscriptionPlan: 'Nutrition Care Pass: $39/month (2 Visits + Custom Meal Plans)',
    availability: 'Slots available Tomorrow at 10:00 AM',
    topics: ['Microbiome Diversity', 'Sarcopenia & Protein Needs', 'Joint Comfort Foods', 'Hydration & Electrolytes']
  },

  // --- SECTION 2: PSYCHIATRIST & MENTAL HEALTH CARE ---
  {
    id: 'psych-01',
    name: 'Dr. Marcus Thorne, MD',
    title: 'Senior Adult & Geriatric Psychiatrist',
    category: 'psychiatry',
    specialty: 'Late-Life Anxiety, Mood Support & Cognitive Resilience',
    credentials: 'MD (Harvard Medical School), Board Certified in Adult & Geriatric Psychiatry',
    experienceYears: 28,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.99,
    reviewsCount: 420,
    fee: '$85 / 50-min Tele-Psychiatry Consultation',
    subscriptionPlan: 'Mental Wellbeing Pass: $69/month (Monthly Clinical Review + Unlimited Messaging)',
    availability: 'Available Today at 03:15 PM',
    topics: ['Unhurried Grief & Transition Support', 'Medication Management Review', 'Sleep Architecture', 'Caregiver Burnout']
  },
  {
    id: 'psych-02',
    name: 'Dr. Sarah Al-Khatib, PsyD, LCSW',
    title: 'Clinical Psychologist & Behavioral Medicine Director',
    category: 'psychiatry',
    specialty: 'Chronic Illness Coping, Mindfulness & Emotional Equilibrium',
    credentials: 'Doctorate in Clinical Psychology (UCLA), Certified CBT & ACT Practitioner',
    experienceYears: 22,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 4.96,
    reviewsCount: 389,
    fee: '$75 / 50-min Psychotherapy Session',
    subscriptionPlan: 'Mental Wellbeing Pass: $69/month (Monthly Clinical Review + Unlimited Messaging)',
    availability: 'Available Tomorrow at 11:30 AM',
    topics: ['Coping with Pain & Illness', 'Mindfulness for Stress Reduction', 'Family Dynamics', 'Compassionate Self-Care']
  },

  // --- SECTION 3: BOOK YOUR PROFESSIONAL DOCTOR ---
  {
    id: 'doc-01',
    name: 'Dr. Arthur Sterling, MD, FACC',
    title: 'Emeritus Chief of Cardiology (Johns Hopkins)',
    category: 'doctor',
    specialty: 'Cardiovascular Care, Hypertension & Geriatric Heart Health',
    credentials: '38 Years Experience, Fellow of American College of Cardiology',
    experienceYears: 38,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    rating: 4.98,
    reviewsCount: 614,
    fee: '$65 / 45-min Unhurried Visit',
    subscriptionPlan: 'VIP Physician Pass: $59/month (Priority Booking + 30-min Grace Window + Direct Review)',
    availability: 'Slots available Today at 10:30 AM',
    topics: ['Unhurried Cardiac Review', 'BP Spike Evaluation', 'Holistic Medication Audit', 'Second Opinions']
  },
  {
    id: 'doc-02',
    name: 'Dr. Eleanor Vance, MD',
    title: 'Senior Clinical Director (Ret. Mass General)',
    category: 'doctor',
    specialty: 'Internal Medicine & Complex Chronic Care Management',
    credentials: '34 Years Clinical Practice, Former Chief of Outpatient Medicine',
    experienceYears: 34,
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02638531?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    reviewsCount: 528,
    fee: '$60 / 45-min Unhurried Visit',
    subscriptionPlan: 'VIP Physician Pass: $59/month (Priority Booking + 30-min Grace Window + Direct Review)',
    availability: 'Slots available Today in 25 min',
    topics: ['Multi-System Wellness', 'Polypharmacy Reduction', 'Thyroid & Diabetes Reviews', 'Preventive Longevity']
  },
  {
    id: 'doc-03',
    name: 'Dr. Raymond Chen, MD, PhD',
    title: 'Former Professor of Neurology (UCSF)',
    category: 'doctor',
    specialty: 'Cognitive Health, Sleep Neurology & Tremor Evaluation',
    credentials: '41 Years Experience, Published Neurologist & Senior Educator',
    experienceYears: 41,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    rating: 4.99,
    reviewsCount: 489,
    fee: '$75 / 50-min Comprehensive Visit',
    subscriptionPlan: 'VIP Physician Pass: $59/month (Priority Booking + 30-min Grace Window + Direct Review)',
    availability: 'Slots available Tomorrow at 01:30 PM',
    topics: ['Memory & Focus Assessments', 'Sleep Apnea Follow-ups', 'Peripheral Neuropathy', 'Brain Vitality']
  },

  // --- SECTION 4: WELLNESS & SENIOR LONGEVITY COACHING ---
  {
    id: 'well-01',
    name: 'Dr. Hannah Greenfield, PT, DPT',
    title: 'Doctor of Physical Therapy & Mobility Coach',
    category: 'wellness',
    specialty: 'Fall Prevention, Joint Ergonomics & Safe Senior Strength',
    credentials: 'Doctor of Physical Therapy, Certified Senior Fitness Specialist',
    experienceYears: 15,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    rating: 4.94,
    reviewsCount: 215,
    fee: '$35 / 35-min Mobility Session',
    subscriptionPlan: 'Longevity Care Pass: $29/month (Weekly Group Mobility + Home Exercise Audits)',
    availability: 'Available Today at 04:00 PM',
    topics: ['Balance & Core Strength', 'Knee & Hip Safe Stretches', 'Home Ergonomics', 'Gentle Posture Alignment']
  }
];

export const INITIAL_LIVE_MESSAGES: LiveStreamMessage[] = [
  {
    id: 'msg-1',
    user: 'Dr. Arthur Sterling, MD',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    text: 'Welcome everyone to today’s Free Open Consultation Room! Today we are discussing blood pressure morning surges and questions on blood pressure monitors. Feel free to type questions in the chat or raise your hand to speak!',
    time: '10:02 AM',
    isDoctor: true
  },
  {
    id: 'msg-2',
    user: 'Harold J. (Viewer)',
    text: 'Doctor Sterling, is it normal for BP to be 15 points higher immediately after waking up versus afternoon?',
    time: '10:04 AM',
    isQuestion: true
  },
  {
    id: 'msg-3',
    user: 'Dr. Arthur Sterling, MD',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    text: 'Excellent question Harold. Yes, that is known as the early morning circadian surge due to cortisol and sympathetic activation. However, if it exceeds 140/90 consistently, we may look at medication timing.',
    time: '10:05 AM',
    isDoctor: true
  },
  {
    id: 'msg-4',
    user: 'Clara O. (Viewer)',
    text: 'Thank you for hosting this free live room! Doctors usually rush in 7 minutes, having 45 minutes of open doctor Q&A is a breath of fresh air.',
    time: '10:07 AM'
  },
  {
    id: 'msg-5',
    user: 'Dr. Eleanor Vance, MD',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02638531?auto=format&fit=crop&w=400&q=80',
    text: 'Joining in as co-host! I will be taking questions on managing osteoarthritis stiffness without over-relying on NSAIDs.',
    time: '10:09 AM',
    isDoctor: true
  }
];
