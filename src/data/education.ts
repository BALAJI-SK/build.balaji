export interface Education {
  id: string
  institution: string
  logo: string
  degree: string
  field: string
  period: string
  grade?: string
  grade_label?: string
  location: string
  highlights: string[]
  skills: string[]
  color: string
  current: boolean
}

export const education: Education[] = [
  {
    id: 'dcu',
    institution: 'Dublin City University',
    logo: 'DCU',
    degree: 'MSc in Computing',
    field: 'Artificial Intelligence',
    period: 'Sep 2025 – Sep 2026',
    location: 'Dublin, Ireland',
    highlights: [
      'Core Machine Learning & Deep Learning',
      'Artificial Intelligence Foundations',
      'Data Engineering & Analytics',
      'Research Methods in Computing',
    ],
    skills: ['ML', 'AI', 'Python', 'Data Engineering', 'Research'],
    color: '#00D4FF',
    current: true,
  },
  {
    id: 'bms',
    institution: 'B. M. S. College of Engineering',
    logo: 'BMS',
    degree: 'Bachelor of Technology',
    field: 'Computer Science',
    period: 'Aug 2019 – Jul 2023',
    grade: '8.58 / 10.0',
    grade_label: 'First Class with Distinction',
    location: 'Bengaluru, India',
    highlights: [
      'Data Structures & Algorithms',
      'Operating Systems & Networks',
      'Artificial Intelligence & Machine Learning',
      'Big Data Analytics',
      'Object Oriented Modeling & Design',
    ],
    skills: ['C++', 'Java', 'AI', 'ML', 'DSA', 'Networks', 'OOP'],
    color: '#FF6B35',
    current: false,
  },
  {
    id: 'school',
    institution: 'Gnana Jyothi School, Mulbagal',
    logo: 'GJS',
    degree: 'Indian Certificate of Secondary Education (ICSE)',
    field: 'Class X — Science & Mathematics',
    period: '2017',
    grade: 'School First Rank',
    grade_label: 'Ranked 1st in School · CISCE Board',
    location: 'Mulbagal, Karnataka, India',
    highlights: [
      'Ranked 1st in school — ICSE Class X Board Examinations',
      'Council for the Indian School Certificate Examinations (CISCE), New Delhi',
      'Mathematics, Science & Computer Science',
    ],
    skills: ['Mathematics', 'Science', 'Computer Science'],
    color: '#FFD700',
    current: false,
  },
]
