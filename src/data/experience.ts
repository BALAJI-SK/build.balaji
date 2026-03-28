export interface Experience {
  id: string
  company: string
  logo: string
  role: string
  type: string
  period: string
  duration: string
  location: string
  description: string
  bullets: string[]
  metrics: { label: string; value: string }[]
  skills: string[]
  color: string
}

export const experiences: Experience[] = [
  {
    id: 'superteam',
    company: 'Superteam Ireland',
    logo: 'ST',
    role: 'Web3 Developer & Community Member',
    type: 'On-site',
    period: 'Sep 2025 – Present',
    duration: '7 mos',
    location: 'Dublin, Ireland',
    description: 'Active member of the Solana Superteam Ireland community, building AI-driven decentralized applications and contributing to the Irish Web3 ecosystem.',
    bullets: [
      'Building AI-driven decentralized applications (dApps) on Solana',
      'Contributing to the Irish Web3 developer community',
      'Exploring the intersection of AI and decentralized identity (DeFi)',
    ],
    metrics: [],
    skills: ['Solana', 'Web3', 'DeFi', 'AI/dApps', 'TypeScript'],
    color: '#9945FF',
  },
  {
    id: 'tejas',
    company: 'Tejas Networks',
    logo: 'TN',
    role: 'Software Engineer',
    type: 'Full-time · On-site',
    period: 'Sep 2023 – Aug 2025',
    duration: '2 yrs',
    location: 'Bengaluru, India',
    description: 'Modernized legacy hardware validation ecosystems by architecting a multi-tiered diagnostic platform (C++, Go, Flutter), replacing manual Perl workflows with a real-time, high-performance monitoring suite.',
    bullets: [
      'Engineered C++ diagnostic service with pointer-based memory management to interface with FPGAs via I2C, SPI, and PCIe; implemented Virtual Directory (VD) bridge for high-speed hardware data access',
      'Developed Go backend using Goroutines to concurrently manage C++ services across Serial/RS-232, SSH, and HTTPS — transitioning from sequential scripts to a high-concurrency model',
      'Built a Plug-and-Play framework abstracting complex APIs for Intel Quartus, Xilinx Vivado, TI UCD, DediProg loaders, and NI instrumentation into a single JSON-driven control plane',
      'Developed Flutter desktop app using WebSockets and Streams for live telemetry and hardware logs',
      'Launched Debug App mapping real-time failures to resolution docs, improving critical defect detection by 30%',
      'Mentored 4 interns — driving 77% improvement in testing efficiency and 45% hardware validation cost savings',
    ],
    metrics: [
      { label: 'Cycle Time Reduction', value: '4h → 90min' },
      { label: 'Production Yield', value: '82% → 95.6%' },
      { label: 'Daily Executions', value: '500+' },
      { label: 'Accuracy', value: '99.8%' },
      { label: 'Defect Detection', value: '+30%' },
      { label: 'Cost Savings', value: '45%' },
    ],
    skills: ['C++', 'Go', 'Flutter', 'FPGA', 'WebSockets', 'I2C/SPI/PCIe', 'JSON Config'],
    color: '#00D4FF',
  },
  {
    id: 'mckinsey',
    company: 'McKinsey & Company',
    logo: 'McK',
    role: 'Software Engineer Intern',
    type: 'Internship · On-site',
    period: 'Jan 2023 – Jul 2023',
    duration: '7 mos',
    location: 'Bengaluru, India',
    description: 'Developed architecture-building tools and full-stack features that drastically accelerated deployment workflows and delivered 100% backend test coverage.',
    bullets: [
      'Architected a design canvas for generating initial setup code for applications with one-click deployment on AWS EKS and KIND — reducing a 2-week task to 2 days',
      'Built a robust post system: create, edit, delete, location-based recommendations, and user content feed',
      'Achieved 100% backend test coverage alongside comprehensive front-end testing for seamless UX',
    ],
    metrics: [
      { label: 'Task Time Reduction', value: '2 weeks → 2 days' },
      { label: 'Backend Coverage', value: '100%' },
    ],
    skills: ['React.js', 'Node.js', 'Docker', 'Kubernetes', 'AWS EKS', 'Testing'],
    color: '#FF6B35',
  },
]
