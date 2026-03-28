export interface SkillCategory {
  id: string
  label: string
  icon: string
  color: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'ai-ml',
    label: 'AI / ML',
    icon: '🧠',
    color: '#00D4FF',
    skills: ['Python', 'FastAPI', 'Pandas', 'Scikit-learn', 'PyTorch', 'TensorFlow', 'LLM / Claude', 'NLP', 'Jupyter'],
  },
  {
    id: 'systems',
    label: 'Systems',
    icon: '⚙️',
    color: '#FF6B35',
    skills: ['C++', 'Go / Goroutines', 'FPGA / PCIe', 'I2C / SPI', 'Linux', 'Shell', 'Serial / RS-232'],
  },
  {
    id: 'web',
    label: 'Web',
    icon: '🌐',
    color: '#00D4FF',
    skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'REST APIs', 'WebSockets', 'HTML / CSS'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: '📱',
    color: '#54C5F8',
    skills: ['Flutter', 'Dart', 'Firebase', 'Android (Java)', 'Streams / Bloc'],
  },
  {
    id: 'devops',
    label: 'DevOps / Cloud',
    icon: '☁️',
    color: '#FF6B35',
    skills: ['Docker', 'Kubernetes', 'AWS EKS', 'Git / GitHub', 'GitLab CI/CD', 'Linux Admin'],
  },
  {
    id: 'web3',
    label: 'Web3',
    icon: '⛓️',
    color: '#9945FF',
    skills: ['Solana', 'DeFi', 'dApps', 'Helius RPC', 'NFT / Tokens', 'Web3 Identity'],
  },
]
