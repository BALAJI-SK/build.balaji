export interface SkillCategory {
  id: string
  label: string
  icon: string
  color: string
  skills: { name: string; level: 'expert' | 'proficient' | 'familiar' }[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'ai-ml',
    label: 'AI / ML',
    icon: '🧠',
    color: '#00D4FF',
    skills: [
      { name: 'Python', level: 'expert' },
      { name: 'Scikit-learn', level: 'proficient' },
      { name: 'TensorFlow', level: 'proficient' },
      { name: 'PyTorch', level: 'proficient' },
      { name: 'LLM / Claude', level: 'proficient' },
      { name: 'FastAPI', level: 'expert' },
      { name: 'Pandas', level: 'expert' },
      { name: 'Jupyter', level: 'expert' },
      { name: 'NLP', level: 'proficient' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems',
    icon: '⚙️',
    color: '#FF6B35',
    skills: [
      { name: 'C++', level: 'expert' },
      { name: 'Go / Goroutines', level: 'expert' },
      { name: 'FPGA / PCIe', level: 'proficient' },
      { name: 'I2C / SPI', level: 'proficient' },
      { name: 'Linux', level: 'proficient' },
      { name: 'Shell', level: 'proficient' },
      { name: 'Serial / RS-232', level: 'proficient' },
    ],
  },
  {
    id: 'web',
    label: 'Web',
    icon: '🌐',
    color: '#00D4FF',
    skills: [
      { name: 'TypeScript', level: 'proficient' },
      { name: 'React', level: 'expert' },
      { name: 'Node.js', level: 'proficient' },
      { name: 'REST APIs', level: 'expert' },
      { name: 'WebSockets', level: 'proficient' },
      { name: 'HTML / CSS', level: 'proficient' },
      { name: 'JavaScript', level: 'expert' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: '📱',
    color: '#54C5F8',
    skills: [
      { name: 'Flutter', level: 'expert' },
      { name: 'Dart', level: 'expert' },
      { name: 'Firebase', level: 'proficient' },
      { name: 'Android (Java)', level: 'proficient' },
      { name: 'Streams / Bloc', level: 'proficient' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps / Cloud',
    icon: '☁️',
    color: '#FF6B35',
    skills: [
      { name: 'Docker', level: 'expert' },
      { name: 'Kubernetes', level: 'proficient' },
      { name: 'AWS EKS', level: 'proficient' },
      { name: 'Git / GitHub', level: 'expert' },
      { name: 'GitLab CI/CD', level: 'proficient' },
      { name: 'KIND', level: 'familiar' },
      { name: 'Linux Admin', level: 'proficient' },
    ],
  },
  {
    id: 'web3',
    label: 'Web3',
    icon: '⛓️',
    color: '#9945FF',
    skills: [
      { name: 'Solana', level: 'proficient' },
      { name: 'DeFi', level: 'proficient' },
      { name: 'dApps', level: 'proficient' },
      { name: 'Helius RPC', level: 'familiar' },
      { name: 'NFT / Tokens', level: 'familiar' },
      { name: 'Web3 Identity', level: 'proficient' },
    ],
  },
]
