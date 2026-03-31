export interface NeuralNode {
  id: string;
  icon: string;
  label: string;
  type: 'input' | 'achieve' | 'like' | 'output' | 'default';
  title: string;
  tag: string;
  tagColor: string;
  desc: string;
  content: string;
}

export interface NeuralLayer {
  id: string;
  label: string;
  x: number; // percentage position
  nodes: NeuralNode[];
}

export const NEURAL_LAYERS: NeuralLayer[] = [
  {
    id: 'input', label: 'INPUT', x: 8,
    nodes: [
      {
        id: 'me', icon: '⬡', label: 'YOU', type: 'input',
        title: 'Who is Balaji?',
        tag: 'ABOUT ME', tagColor: '#00d4ff',
        desc: 'Full Stack Builder obsessed with crafting products that live at the intersection of great engineering and great experience.',
        content: `
          <div class="stat-row">
            <div class="stat-box"><div class="stat-num" style="color:#00d4ff">3+</div><div class="stat-lbl">Years Exp</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#a78bfa">8+</div><div class="stat-lbl">Projects</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#10b981">MSc</div><div class="stat-lbl">AI @ DCU</div></div>
          </div>
          <div class="panel-item"><div class="item-title">🧠 Philosophy</div><div class="item-sub">I don't just write code. I engineer experiences — fast, scalable, and built to last.</div></div>
          <div class="panel-item"><div class="item-title">📍 Based in Dublin, Ireland</div><div class="item-sub">Open to remote, hybrid, or relocation for the right opportunity.</div></div>
          <div class="panel-item"><div class="item-title">🎯 Currently</div><div class="item-sub">MSc AI student at DCU &nbsp;·&nbsp; Building Web3 dApps at Superteam Ireland &nbsp;·&nbsp; Open to SWE roles</div></div>
        `
      }
    ]
  },
  {
    id: 'social', label: 'SOCIAL', x: 20,
    nodes: [
      {
        id: 'github', icon: '⌥', label: 'GitHub', type: 'default',
        title: 'GitHub', tag: 'CODE', tagColor: '#00d4ff',
        desc: 'Where my code lives. Real projects, real impact.',
        content: `
          <div class="panel-item">
            <div class="item-title">Profile</div>
            <a href="https://github.com/BALAJI-SK" target="_blank" rel="noopener" class="node-link">↗ github.com/BALAJI-SK</a>
            <div class="item-sub" style="margin-top:8px">8+ repos &nbsp;·&nbsp; Active contributor &nbsp;·&nbsp; Open source</div>
          </div>
          <div class="panel-item"><div class="item-title">Top Languages</div><div class="item-sub">
            <span class="badge badge-blue">Python</span><span class="badge badge-purple">TypeScript</span><span class="badge badge-green">Go</span><span class="badge badge-blue">C++</span><span class="badge badge-yellow">Dart</span>
          </div></div>
          <div class="panel-item">
            <div class="item-title">Notable Repos</div>
            <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">
              <a href="https://github.com/BALAJI-SK/GreenCode-Optimizer" target="_blank" rel="noopener" class="node-link">↗ GreenCode Optimizer</a>
              <a href="https://github.com/BALAJI-SK/rental_email_classifcation" target="_blank" rel="noopener" class="node-link">↗ Lette AI</a>
              <a href="https://github.com/BALAJI-SK/agent-2" target="_blank" rel="noopener" class="node-link">↗ Agent-2</a>
            </div>
          </div>
        `
      },
      {
        id: 'linkedin', icon: '◈', label: 'LinkedIn', type: 'default',
        title: 'LinkedIn', tag: 'CONNECT', tagColor: '#00d4ff',
        desc: 'Professional network. Building in public.',
        content: `
          <div class="panel-item">
            <div class="item-title">Profile</div>
            <a href="https://www.linkedin.com/in/s-k-balaji/" target="_blank" rel="noopener" class="node-link">↗ linkedin.com/in/balaji-sk</a>
            <div class="item-sub" style="margin-top:8px">Actively posting about AI/ML, Web3, and building in public. Open to connect.</div>
          </div>
        `
      },
      {
        id: 'twitter', icon: '◇', label: 'Twitter/X', type: 'default',
        title: 'Twitter / X', tag: 'THOUGHTS', tagColor: '#00d4ff',
        desc: 'Building in public. Sharing learnings.',
        content: `
          <div class="panel-item">
            <div class="item-title">Handle</div>
            <a href="https://x.com/balaji_sk" target="_blank" rel="noopener" class="node-link">↗ @balaji_sk on X / Twitter</a>
            <div class="item-sub" style="margin-top:8px">Sharing AI/ML experiments, Web3 projects, and engineering insights.</div>
          </div>
        `
      }
    ]
  },
  {
    id: 'achieve', label: 'ACHIEVEMENTS', x: 34,
    nodes: [
      {
        id: 'rank1', icon: '🥇', label: 'Academic', type: 'achieve',
        title: '🥇 Academic Excellence', tag: 'ACHIEVEMENT', tagColor: '#f59e0b',
        desc: 'First Class with Distinction — BMS College of Engineering. Now pursuing MSc AI at DCU Dublin.',
        content: `
          <div class="panel-item"><div class="item-title">🎓 MSc Computing (AI) — DCU</div><div class="item-sub">Sep 2025 – Sep 2026 · Dublin City University, Ireland<br/>Core ML, Deep Learning, AI Foundations, Data Engineering</div></div>
          <div class="panel-item"><div class="item-title">🏆 B.Tech CS — BMS College of Engineering</div><div class="item-sub">2019–2023 · CGPA: 8.58/10 · First Class with Distinction<br/>DSA, OS, AI/ML, Big Data Analytics, OOP</div></div>
          <div class="panel-item"><div class="item-title">📚 Specializations</div><div class="item-sub"><span class="badge badge-yellow">AI/ML</span><span class="badge badge-yellow">Distributed Systems</span><span class="badge badge-yellow">Big Data</span><span class="badge badge-yellow">Networks</span></div></div>
        `
      },
      {
        id: 'hackwin', icon: '⚡', label: 'Hackathons', type: 'achieve',
        title: '⚡ Hackathon & Open Source', tag: 'ACHIEVEMENT', tagColor: '#f59e0b',
        desc: 'Built AI tools, Web3 apps, and ML systems. Shipped real products under pressure.',
        content: `
          <div class="stat-row">
            <div class="stat-box"><div class="stat-num" style="color:#f59e0b">8+</div><div class="stat-lbl">Projects</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#f59e0b">75</div><div class="stat-lbl">Tests CI/CD</div></div>
          </div>
          <div class="panel-item"><div class="item-title">🌱 GreenCode Optimizer — Hackathon</div><div class="item-sub">AI-powered code sustainability tool using Anthropic Claude & GitLab Duo. 75 passing tests, CI/CD integrated.</div></div>
          <div class="panel-item"><div class="item-title">🏠 Lette AI — Product Build</div><div class="item-sub">AI OS for property managers. 100 emails → 5 priorities in under 1 minute.</div></div>
          <div class="panel-item"><div class="item-title">Skills Under Pressure</div><div class="item-sub"><span class="badge badge-yellow">Speed</span><span class="badge badge-yellow">MVP Thinking</span><span class="badge badge-yellow">Pitching</span><span class="badge badge-yellow">Shipping</span></div></div>
        `
      },
      {
        id: 'leet', icon: '⬟', label: 'DSA', type: 'achieve',
        title: '⬟ Problem Solving', tag: 'DSA', tagColor: '#f59e0b',
        desc: 'Strong CS fundamentals — DSA, systems programming, and distributed systems.',
        content: `
          <div class="panel-item"><div class="item-title">Core Strengths</div><div class="item-sub">
            <span class="badge badge-blue">C++</span><span class="badge badge-blue">Go</span><span class="badge badge-blue">Python</span><span class="badge badge-blue">Algorithms</span>
          </div></div>
          <div class="panel-item"><div class="item-title">Strong Topics</div><div class="item-sub"><span class="badge badge-green">Graphs</span><span class="badge badge-green">DP</span><span class="badge badge-green">Trees</span><span class="badge badge-green">Concurrency</span><span class="badge badge-green">Systems</span></div></div>
          <div class="panel-item"><div class="item-title">Applied At Scale</div><div class="item-sub">500+ daily executions at Tejas Networks · 99.8% accuracy · Goroutine concurrency in production</div></div>
        `
      }
    ]
  },
  {
    id: 'experience', label: 'EXPERIENCE', x: 48,
    nodes: [
      {
        id: 'exp1', icon: '◉', label: 'Work', type: 'default',
        title: '💼 Work Experience', tag: 'WORK', tagColor: '#00d4ff',
        desc: 'Real-world engineering across hardware, enterprise consulting, and Web3.',
        content: `
          <div class="panel-item">
            <div class="item-title">⛓️ Web3 Developer — Superteam Ireland</div>
            <div class="item-sub">Sep 2025 – Present · Dublin, Ireland<br/>Building AI-driven dApps on Solana. Contributing to Irish Web3 ecosystem.</div>
            <div style="margin-top:8px"><span class="badge badge-purple">Solana</span><span class="badge badge-purple">Web3</span><span class="badge badge-purple">DeFi</span><span class="badge badge-purple">TypeScript</span></div>
          </div>
          <div class="panel-item">
            <div class="item-title">⚙️ Software Engineer — Tejas Networks</div>
            <div class="item-sub">Sep 2023 – Aug 2025 · 2 yrs · Bengaluru, India<br/>C++ diagnostics for FPGAs via I2C/SPI/PCIe · Go backend (Goroutines) · Flutter desktop app · Reduced cycle time 4h → 90min</div>
            <div style="margin-top:8px"><span class="badge badge-blue">C++</span><span class="badge badge-blue">Go</span><span class="badge badge-blue">Flutter</span><span class="badge badge-blue">FPGA</span></div>
          </div>
          <div class="panel-item">
            <div class="item-title">🏢 SWE Intern — McKinsey & Company</div>
            <div class="item-sub">Jan 2023 – Jul 2023 · 7 mos · Bengaluru, India<br/>AWS EKS one-click deployment canvas · 2-week task → 2 days · 100% backend test coverage</div>
            <div style="margin-top:8px"><span class="badge badge-green">React.js</span><span class="badge badge-green">Node.js</span><span class="badge badge-green">Docker</span><span class="badge badge-green">Kubernetes</span><span class="badge badge-green">AWS EKS</span></div>
          </div>
        `
      },
      {
        id: 'edu', icon: '◎', label: 'Education', type: 'default',
        title: '🎓 Education', tag: 'ACADEMIC', tagColor: '#00d4ff',
        desc: 'Strong CS foundation — BMS College of Engineering & Dublin City University.',
        content: `
          <div class="panel-item">
            <div class="item-title">MSc Computing (AI) — Dublin City University</div>
            <div class="item-sub">Sep 2025 – Sep 2026 · Dublin, Ireland<br/>ML · Deep Learning · AI Foundations · Data Engineering · Research Methods</div>
            <div style="margin-top:8px"><span class="badge badge-blue">ML</span><span class="badge badge-blue">AI</span><span class="badge badge-blue">Python</span><span class="badge badge-blue">Research</span></div>
          </div>
          <div class="panel-item">
            <div class="item-title">B.Tech Computer Science — BMS College of Engineering</div>
            <div class="item-sub">Aug 2019 – Jul 2023 · CGPA: 8.58/10 · First Class with Distinction · Bengaluru, India</div>
            <div style="margin-top:8px"><span class="badge badge-purple">C++</span><span class="badge badge-purple">Java</span><span class="badge badge-purple">DSA</span><span class="badge badge-purple">Networks</span><span class="badge badge-purple">OOP</span></div>
          </div>
        `
      }
    ]
  },
  {
    id: 'projects', label: 'PROJECTS', x: 62,
    nodes: [
      {
        id: 'proj1', icon: '◆', label: 'AI Projects', type: 'default',
        title: '🚀 Featured Projects', tag: 'PROJECTS', tagColor: '#00d4ff',
        desc: 'AI tools, Web3 apps, and ML systems — built for real problems.',
        content: `
          <div class="panel-item">
            <div class="item-title">🌱 GreenCode Optimizer</div>
            <div class="item-sub">AI-powered sustainable code analysis using Anthropic Claude & GitLab Duo. 75 passing tests · CI/CD integrated · MIT Licensed.</div>
            <div style="margin-top:8px"><span class="badge badge-green">Python</span><span class="badge badge-green">Claude API</span><span class="badge badge-green">GitLab CI</span></div>
            <a href="https://github.com/BALAJI-SK/GreenCode-Optimizer" target="_blank" rel="noopener" class="node-link node-link-green" style="margin-top:10px">↗ View on GitHub</a>
          </div>
          <div class="panel-item">
            <div class="item-title">🏠 Lette AI</div>
            <div class="item-sub">Full-stack AI OS for property managers. 100 messages → 5 priorities in under 1 minute. AI-drafted responses.</div>
            <div style="margin-top:8px"><span class="badge badge-blue">FastAPI</span><span class="badge badge-blue">Python</span><span class="badge badge-blue">NLP</span><span class="badge badge-blue">LLM</span></div>
            <a href="https://github.com/BALAJI-SK/rental_email_classifcation" target="_blank" rel="noopener" class="node-link" style="margin-top:10px">↗ View on GitHub</a>
          </div>
          <div class="panel-item">
            <div class="item-title">⛓️ Agent-2</div>
            <div class="item-sub">Web2/Web3 DeFi identity aggregator — GitHub + StackOverflow + Solana → unified reputation score for DeFi credit scoring.</div>
            <div style="margin-top:8px"><span class="badge badge-purple">FastAPI</span><span class="badge badge-purple">Solana</span><span class="badge badge-purple">Helius RPC</span><span class="badge badge-purple">Web3</span></div>
            <a href="https://github.com/BALAJI-SK/agent-2" target="_blank" rel="noopener" class="node-link node-link-purple" style="margin-top:10px">↗ View on GitHub</a>
          </div>
        `
      },
      {
        id: 'proj2', icon: '◇', label: 'More Projects', type: 'default',
        title: '⚙️ More Projects', tag: 'PROJECTS', tagColor: '#00d4ff',
        desc: 'ML research, mobile apps, data science, and network security.',
        content: `
          <div class="panel-item">
            <div class="item-title">🏡 Irish Home Retrofit Prediction</div>
            <div class="item-sub">ML model predicting BER energy ratings from 1.35M row SEAI dataset. 215 → 45 features (leakage-safe).</div>
            <a href="https://github.com/BALAJI-SK/irish-home-retrofit-prediction" target="_blank" rel="noopener" class="node-link" style="margin-top:8px">↗ View on GitHub</a>
          </div>
          <div class="panel-item">
            <div class="item-title">📱 College Space — Flutter App</div>
            <div class="item-sub">Full Flutter + Firebase mobile app for campus life. Real-time data, auth, and resource management.</div>
            <a href="https://github.com/BALAJI-SK/College-Space" target="_blank" rel="noopener" class="node-link" style="margin-top:8px">↗ View on GitHub</a>
          </div>
          <div class="panel-item">
            <div class="item-title">📈 The Immutable Rhythm</div>
            <div class="item-sub">Validates Benner's 1875 market prediction model against S&P 500, FTSE 100, and Bitcoin data.</div>
            <a href="https://github.com/BALAJI-SK/The-Immutable-Rhythm-Testing-a-19th-Century-Market-Prediction-Model" target="_blank" rel="noopener" class="node-link" style="margin-top:8px">↗ View on GitHub</a>
          </div>
          <div class="panel-item">
            <div class="item-title">🛡️ DDoS Detection System</div>
            <div class="item-sub">SDN-based detection using Mininet + OpenFlow. Real-time traffic analysis on virtual SDN infrastructure.</div>
            <a href="https://github.com/BALAJI-SK/DDoS-Detection" target="_blank" rel="noopener" class="node-link" style="margin-top:8px">↗ View on GitHub</a>
          </div>
        `
      }
    ]
  },
  {
    id: 'likes', label: 'WHAT I LIKE', x: 76,
    nodes: [
      {
        id: 'anime', icon: '🍃', label: 'Naruto', type: 'like',
        title: '🍃 Anime & Stories', tag: 'INTERESTS', tagColor: '#10b981',
        desc: 'Naruto is my all-time favorite — the message of hard work beating talent hits different.',
        content: `
          <div class="panel-item"><div class="item-title">🍃 Naruto Fan</div><div class="item-sub">"I never give up. That's my ninja way." — This is also my engineering philosophy. Persistence over talent, every time.</div></div>
          <div class="panel-item"><div class="item-title">📺 Other Favorites</div><div class="item-sub">Attack on Titan · Death Note · One Piece · Demon Slayer</div></div>
          <div class="panel-item"><div class="item-title">Why this matters</div><div class="item-sub">Every great anime has a story arc — so does every great product. I bring narrative thinking to everything I build.</div></div>
        `
      },
      {
        id: 'sports', icon: '🏓', label: 'Table Tennis', type: 'like',
        title: '🏓 Table Tennis', tag: 'INTERESTS', tagColor: '#10b981',
        desc: 'Fast reflexes, quick decisions — TT is basically system design IRL.',
        content: `
          <div class="panel-item"><div class="item-title">🏓 Competitive Player</div><div class="item-sub">College TT team. District-level tournaments. Represent my department.</div></div>
          <div class="panel-item"><div class="item-title">What TT taught me</div><div class="item-sub">Speed of thought · Adapting to opponents · Staying calm under pressure — all directly applicable to coding sprints and debugging.</div></div>
        `
      },
      {
        id: 'tech', icon: '⛓', label: 'Web3 & AI', type: 'like',
        title: '⛓️ Tech I Geek Out On', tag: 'INTERESTS', tagColor: '#10b981',
        desc: 'Solana, AI/ML, Three.js — technologies that feel like magic.',
        content: `
          <div class="panel-item"><div class="item-title">⛓️ Blockchain & Web3</div><div class="item-sub">Building AI-driven dApps on Solana at Superteam Ireland. Exploring DeFi identity and on-chain reputation systems.</div></div>
          <div class="panel-item"><div class="item-title">🤖 AI/ML</div><div class="item-sub">MSc AI at DCU. Fine-tuning LLMs, building RAG pipelines, and shipping AI-native products like GreenCode & Lette AI.</div></div>
          <div class="panel-item"><div class="item-title">🎨 Three.js & WebGL</div><div class="item-sub">Love making the web feel alive. This portfolio is proof.</div></div>
          <div class="panel-item"><div class="item-title">🎵 Music While Coding</div><div class="item-sub">Lo-fi hip hop · Anime OSTs · Phonk — the holy trinity of focus.</div></div>
        `
      }
    ]
  },
  {
    id: 'output', label: 'OUTPUT', x: 91,
    nodes: [
      {
        id: 'connect', icon: '⬡', label: 'HIRE ME', type: 'output',
        title: '🎯 Output: Hire Balaji', tag: 'CONNECT', tagColor: '#ec4899',
        desc: "You've run inference on me. The prediction is clear.",
        content: `
          <div style="text-align:center; margin-bottom:20px">
            <div style="font-size:48px; margin-bottom:8px">🎯</div>
            <div style="font-size:13px; color:var(--muted)">Confidence: <span style="color:#10b981; font-weight:700">98.7%</span></div>
            <div style="font-size:11px; color:var(--muted); margin-top:4px">Model output: <em style="color:#ec4899">Strong Hire</em></div>
          </div>
          <div class="panel-item"><div class="item-title">📧 Email</div><div class="item-sub">skbalajimbl1@gmail.com</div></div>
          <div class="panel-item"><div class="item-title">📍 Location</div><div class="item-sub">Dublin, Ireland · Open to Remote / Relocation</div></div>
          <div class="panel-item"><div class="item-title">⏱️ Response Time</div><div class="item-sub">Within 24 hours, always.</div></div>
          <div class="panel-item"><div class="item-title">✅ Available For</div><div class="item-sub"><span class="badge badge-pink">Full-time SWE</span><span class="badge badge-pink">AI/ML Roles</span><span class="badge badge-pink">Web3 Projects</span><span class="badge badge-pink">Consulting</span></div></div>
          <button class="connect-btn" onclick="window.location.href='mailto:skbalajimbl1@gmail.com'">⚡ Send Signal — Let's Connect</button>
          <button class="connect-btn" style="margin-top:8px; background: linear-gradient(135deg,#0077b5,#00a0dc)" onclick="window.open('https://www.linkedin.com/in/s-k-balaji/','_blank')">◈ Connect on LinkedIn</button>
          <button class="connect-btn" style="margin-top:8px; background: linear-gradient(135deg,#1a1a2e,#16213e); border:1px solid rgba(255,255,255,0.1)" onclick="window.open('https://github.com/BALAJI-SK','_blank')">⌥ GitHub Profile</button>
        `
      }
    ]
  }
];
