export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  language: string
  stack: string[]
  url: string
  category: string
  featured: boolean
  metrics?: string[]
  color: string
  icon: string
}

export const projects: Project[] = [
  {
    id: 'greencode',
    name: 'GreenCode Optimizer',
    tagline: 'AI-powered sustainable code optimization',
    description: 'An AI tool leveraging GitLab Duo and Anthropic Claude to analyze codebases for energy efficiency and sustainability. Comes with 75 passing tests and automated CI pipeline integration.',
    language: 'Python',
    stack: ['Python', 'Anthropic Claude', 'GitLab Duo', 'CI/CD'],
    url: 'https://github.com/BALAJI-SK/GreenCode-Optimizer',
    category: 'AI / LLM',
    featured: true,
    metrics: ['75 passing tests', 'MIT Licensed', 'CI/CD integrated'],
    color: '#39FF14',
    icon: '🌱',
  },
  {
    id: 'lette',
    name: 'Lette AI',
    tagline: 'Intelligent property management OS',
    description: 'Full-stack AI operating system for property managers. Reads every email, knows every tenant, tracks patterns, and surfaces 5 clear priorities from 100 messages in under a minute.',
    language: 'Python',
    stack: ['FastAPI', 'Python', 'NLP', 'AI', 'LLM'],
    url: 'https://github.com/BALAJI-SK/rental_email_classifcation',
    category: 'AI / Product',
    featured: true,
    metrics: ['100 msgs → 5 priorities', '<1 min processing', 'AI-drafted responses'],
    color: '#00D4FF',
    icon: '🏠',
  },
  {
    id: 'agent2',
    name: 'Agent-2',
    tagline: 'Web2/Web3 DeFi identity aggregator',
    description: 'High-performance FastAPI microservice aggregating GitHub, StackOverflow, and Solana Web3 activity into a unified reputation score for DeFi credit scoring systems.',
    language: 'Python',
    stack: ['FastAPI', 'Python', 'Solana', 'Helius RPC', 'Web3'],
    url: 'https://github.com/BALAJI-SK/agent-2',
    category: 'Web3 / AI',
    featured: true,
    metrics: ['GitHub + StackOverflow + Solana', 'DeFi credit scoring', 'NFT verification'],
    color: '#9945FF',
    icon: '⛓️',
  },
  {
    id: 'retrofit',
    name: 'Irish Home Retrofit Prediction',
    tagline: 'ML-powered BER energy rating prediction',
    description: 'Machine learning project predicting Irish home energy ratings (BER) using physical and efficiency drivers from the SEAI dataset. Processed 1.35 million rows with careful feature engineering.',
    language: 'Jupyter Notebook',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'ML', 'SEAI Data'],
    url: 'https://github.com/BALAJI-SK/irish-home-retrofit-prediction',
    category: 'ML / Data Science',
    featured: false,
    metrics: ['1.35M row dataset', '215 → 45 features (leakage-safe)', 'BER prediction'],
    color: '#FF6B35',
    icon: '🏡',
  },
  {
    id: 'solas',
    name: 'Solas-Eatzz',
    tagline: 'Eat. Earn. Explore. — Irish local economy platform',
    description: 'TypeScript platform initiative to stimulate local economic activity across Irish towns and rural communities. "Solas" (Irish for "light") — combining local business discovery with community engagement.',
    language: 'TypeScript',
    stack: ['TypeScript', 'React', 'Node.js'],
    url: 'https://github.com/BALAJI-SK/Solas-Eatzz',
    category: 'Full-Stack',
    featured: false,
    metrics: ['Local economy focus', 'Irish communities', 'Earn & Explore model'],
    color: '#00D4FF',
    icon: '☘️',
  },
  {
    id: 'rhythm',
    name: 'The Immutable Rhythm',
    tagline: 'Testing a 19th-century market prediction model',
    description: "Validates the Benner Cycle — Samuel Benner's 1875 market prediction model — using S&P 500, FTSE 100, and Bitcoin data. Examines whether 150-year-old market patterns still hold predictive power.",
    language: 'Jupyter Notebook',
    stack: ['Python', 'Pandas', 'Matplotlib', 'Financial Data', 'Statistics'],
    url: 'https://github.com/BALAJI-SK/The-Immutable-Rhythm-Testing-a-19th-Century-Market-Prediction-Model',
    category: 'Data Science / Research',
    featured: false,
    metrics: ['S&P 500, FTSE 100, Bitcoin', 'Benner Cycle (1875)', 'Multi-market analysis'],
    color: '#FFD700',
    icon: '📈',
  },
  {
    id: 'college-space',
    name: 'College Space',
    tagline: 'Full Flutter mobile app for campus life',
    description: 'A comprehensive Flutter mobile application with Firebase backend for college students. Features splash screen, real-time data, authentication, and campus resource management.',
    language: 'Dart',
    stack: ['Flutter', 'Dart', 'Firebase', 'Android Studio'],
    url: 'https://github.com/BALAJI-SK/College-Space',
    category: 'Mobile',
    featured: false,
    metrics: ['Flutter + Firebase', 'Real-time updates', 'Full mobile lifecycle'],
    color: '#54C5F8',
    icon: '📱',
  },
  {
    id: 'ddos',
    name: 'DDoS Detection System',
    tagline: 'SDN-based network attack detection',
    description: 'Software-Defined Networking project for detecting and mitigating DDoS attacks using Mininet network emulation. Implements real-time traffic analysis on virtual SDN infrastructure.',
    language: 'Python',
    stack: ['Python', 'Mininet', 'SDN', 'OpenFlow', 'Linux'],
    url: 'https://github.com/BALAJI-SK/DDoS-Detection',
    category: 'Network Security',
    featured: false,
    metrics: ['SDN + OpenFlow', 'Real-time traffic analysis', 'Mininet simulation'],
    color: '#FF4444',
    icon: '🛡️',
  },
]
