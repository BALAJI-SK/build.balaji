export interface Achievement {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  type: 'hackathon' | 'award' | 'certification' | 'honor'
  rank: string
  prize?: string
  color: string
  icon: string
  url?: string
  teammates?: string[]
  project?: string
  location?: string
  participants?: string
}

export const achievements: Achievement[] = [
  {
    id: 'aws-hackathon-2025',
    title: 'AWS Global AI Hackathon 2025',
    issuer: 'Amazon Web Services (AWS) for Telecom · Telecom Infra Project',
    date: 'Nov 2025',
    description:
      'Built "GreenLink Agent: Energy Aware Network Intelligence" — an autonomous AI agent that monitors telecom networks in real-time, puts idle nodes to sleep, and dynamically reroutes traffic to save energy without interrupting connections. Competed against 400+ participants across 68 projects over 3 intense days.',
    type: 'hackathon',
    rank: '2nd Place',
    prize: '🥈 2nd Place',
    color: '#C0C0C0',
    icon: '🏆',
    teammates: ['SAI SHREYAS G H', 'Akarsh N L'],
    project: 'GreenLink Agent: Energy Aware Network Intelligence',
    location: 'Dogpatch Labs, Dublin, Ireland',
    participants: '400+ participants · 68 projects',
  },
  {
    id: 'ai-movie-challenge',
    title: 'AI Movie Making Challenge',
    issuer: 'Give(a)Go · Build Station',
    date: '2025',
    description:
      'Created a 1-minute AI-generated film in just 4 hours using Leonardo.Ai, ElevenLabs, Napkin AI, and Wolfpack Digital. Mentored by Richie Smyth (Director of The Siege of Jadotville), who shared his script as the creative foundation. Won against 27 competing teams.',
    type: 'hackathon',
    rank: '1st Place',
    prize: '🥇 Winner',
    color: '#FFD700',
    icon: '🎬',
    url: 'https://x.com/BalajiS20877995/status/1982580989127016828',
    teammates: ['SAI SHREYAS G H', 'Sai Eeshwar D', 'TEJAS SHIVA KUMAR'],
    project: 'AI Short Film',
    location: 'Build Station, Dublin, Ireland',
    participants: '27 teams',
  },
  {
    id: 'superteam-ideathon',
    title: 'Superteam Ireland × Solana Ideathon',
    issuer: 'Superteam Ireland · Solana',
    date: '2025',
    description:
      'Runners-up at the Superteam Ireland × Solana Ideathon at CHQ Dublin. Conceived and pitched a blockchain product idea within 1 hour of the challenge starting, earning recognition from the Solana ecosystem community.',
    type: 'hackathon',
    rank: 'Runners-Up',
    prize: '🥈 Runners-Up',
    color: '#9945FF',
    icon: '⛓️',
    teammates: ['David Mc Govern', 'Caolán Walsh', 'Pragya Tiwari', 'SAI SHREYAS G H'],
    location: 'CHQ / Dogpatch Labs, Dublin, Ireland',
  },
  {
    id: 'school-first',
    title: 'School First Rank — ICSE Board (Class X)',
    issuer: 'Gnana Jyothi School, Mulbagal',
    date: '2017',
    description:
      'Ranked 1st in school in the Indian Certificate of Secondary Education (ICSE) Class X Board Examinations, conducted by the Council for the Indian School Certificate Examinations (CISCE), New Delhi.',
    type: 'honor',
    rank: '1st in School',
    prize: '🥇 School Topper',
    color: '#FFD700',
    icon: '🎓',
  },
]
