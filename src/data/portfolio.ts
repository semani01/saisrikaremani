/**
 * portfolio.ts — Master content file for Portfolio Grand Prix
 * All resume content lives here. Components and the race engineer chatbot
 * pull from this single source of truth.
 *
 * GitHub/LeetCode stats are placeholders — they get hydrated at build time
 * via /lib/github.ts and /lib/leetcode.ts (Phase 9).
 */

import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  GitHubStats,
  LeetCodeStats,
} from '@/types'

// ─── Education ────────────────────────────────────────────────────────────────

export const education: EducationItem[] = [
  {
    id: 'cu-denver-ms',
    degree: 'MS Computer Science',
    school: 'University of Colorado Denver',
    gpa: 3.77,
    startYear: 2023,
    endYear: 2025,
    coursework: [
      'NLP & Generative AI',
      'Social Networks',
      'Computer Vision',
      'Deep Learning',
      'Computational Motor Control',
      'Algorithm Design',
      'Big Data Science',
    ],
    highlights: [
      'GPA 3.77',
      'ML Research Assistant at CU Anschutz Medical Campus',
      'ISA President — led community building and events',
    ],
  },
  {
    id: 'kl-university-btech',
    degree: 'BTech Computer Science',
    school: 'KL University',
    gpa: 9.6,
    startYear: 2019,
    endYear: 2023,
    coursework: [
      'Data Structures & Algorithms',
      'Machine Learning',
      'Database Systems',
      'Operating Systems',
      'Computer Networks',
    ],
    highlights: [
      'GPA 9.6 / 10',
      'Data Science Club — co-founder & president',
      'College Radio — lead RJ',
    ],
  },
]

// ─── Experience ───────────────────────────────────────────────────────────────

export const experience: ExperienceItem[] = [
  {
    id: 'cu-anschutz-ml',
    role: 'ML Research Assistant',
    company: 'CU Anschutz Medical Campus',
    startDate: 'Sep 2024',
    endDate: 'Present',
    description:
      'Building an end-to-end stroke rehabilitation analytics pipeline using markerless motion capture and biomechanical modeling to extract joint angles and muscle activations for clinical research.',
    techStack: ['OpenSim', 'Moco', 'Python', 'markerless motion capture', 'biomechanical modeling'],
    highlights: [
      'Designed automated QA/validation checks for motion capture data',
      'Built batch reporting pipeline for multi-patient clinical comparison',
      'Implemented OpenSim inverse kinematics + Moco optimization',
    ],
  },
  {
    id: 'bragify-sde',
    role: 'SDE Intern',
    company: 'Bragify',
    startDate: 'Feb 2025',
    endDate: 'May 2025',
    description:
      'Built Slack-native performance review workflow. Users log achievements via /log, /track, and /generate commands; OpenAI-powered summarization generates structured weekly/quarterly/annual review documents.',
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Slack API', 'OpenAI API', 'webhooks'],
    highlights: [
      'Implemented /log, /track, /generate Slack slash commands',
      'Built LLM guardrails and fallback behaviors for reliable output',
      'Designed structured template-based output format for HR processes',
    ],
  },
  {
    id: 'samsung-rd',
    role: 'Project Intern',
    company: 'Samsung R&D Institute India',
    startDate: 'Jun 2021',
    endDate: 'Feb 2022',
    description:
      'Built an image/video inpainting pipeline using U-Net architecture and optical flow for temporal coherence. Automated preprocessing pipeline handled batch volumes of images and video for production use.',
    techStack: ['PyTorch', 'U-Net', 'optical flow', 'OpenCV', 'FFmpeg', 'Python'],
    highlights: [
      'Built U-Net encoder-decoder with skip connections for inpainting',
      'Added optical flow guidance for video temporal coherence',
      'Automated batch preprocessing pipeline for production scale',
    ],
  },
  {
    id: 'isa-president',
    role: 'ISA President',
    company: 'University of Colorado Denver',
    startDate: '2023',
    endDate: '2025',
    description:
      'Led the International Student Association — organized community events, built cross-cultural connections, and represented international students in university governance.',
    techStack: [],
    highlights: [
      'Organized campus-wide cultural events and community initiatives',
      'Represented 200+ international students in university governance',
    ],
  },
]

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: ProjectItem[] = [
  {
    id: 'pegasus',
    name: 'PEGASUS Abstractive Summarizer',
    domain: 'Machine Learning / NLP',
    summary: 'Production-ready abstractive summarization system with Flask API + web UI',
    quickStats: [
      { label: 'ROUGE-1', value: '41.97', color: 'green' },
      { label: 'BLEU', value: '42.23', color: 'amber' },
      { label: 'ROUGE-L', value: '38.21', color: 'blue' },
    ],
    techStack: ['Python', 'PyTorch', 'HuggingFace', 'PEGASUS-XSum', 'Flask', 'Optuna', 'PyPDF2'],
    githubUrl: 'https://github.com/semani01/abstractive-summarization',
    caseStudy: {
      problemStatement:
        'The volume of digital content — research papers, news articles, web pages — is overwhelming. Extractive summarization (pulling existing sentences) produces awkward, fragmented summaries. Abstractive summarization (generating new sentences that capture the meaning) produces human-like output but is significantly harder. This project builds a production-ready abstractive summarization system that handles scientific papers, news, PDFs, and URLs.',
      architecture: `Input (Text / PDF / URL)
        │
        ▼
  Preprocessing Layer
  ├── PyPDF2 (PDF extraction)
  ├── BeautifulSoup (URL scraping)
  └── Tokenizer (HuggingFace Pegasus, max 1024 tokens)
        │
        ▼
  PEGASUS-XSum Model
  ├── Encoder: processes input tokens
  ├── Decoder: generates summary tokens
  └── Pretrained with Gap-Sentence Generation (GSG) + MLM
        │
        ▼
  Flask REST API
  ├── /summarize (POST) — text input
  ├── /summarize-pdf (POST) — file upload
  └── /summarize-url (POST) — URL input
        │
        ▼
  Web UI (HTML/CSS/JS)
  └── Clean interface with text/PDF/URL tabs`,
      keyDecisions: [
        {
          title: 'PEGASUS over BART, T5, or GPT-3.5',
          body: "BART had extractive tendencies and lacked fluency. T5-Large suffered training instability. GPT-3.5 was expensive with token limits. PEGASUS-XSum's Gap-Sentence Generation pretraining is specifically designed for abstractive summarization — it masks entire sentences and learns to regenerate them.",
        },
        {
          title: 'Optuna for hyperparameter tuning',
          body: "Used Optuna's Bayesian optimization instead of manual grid search to find optimal learning rate, batch size, and label smoothing. Faster and found better configurations.",
        },
        {
          title: 'Cached model loading',
          body: 'The fine-tuned model is ~2GB. Implemented a singleton pattern that loads the model once on Flask startup and keeps it in memory — making inference fast without reload overhead.',
        },
      ],
      results:
        'ROUGE-1: 41.97 | ROUGE-2: 23.48 | ROUGE-L: 38.21 | BLEU: 42.23. Outperformed BART, T5-Large, and GPT-3.5-Turbo on abstractive quality across arXiv, CNN/DailyMail, and XSum datasets.',
      whatILearned:
        'Building a real inference pipeline taught me more about production ML than any course. The gap between a Jupyter notebook achieving good ROUGE scores and a Flask API that reliably serves predictions is enormous — model loading, input validation, error handling, and response formatting all matter.',
      screenshotsNeeded: [
        'App screenshot (web UI with text input)',
        'Model architecture diagram (encoder-decoder with GSG/MLM)',
        'ROUGE/BLEU comparison bar chart',
        'Sample input → output comparison',
      ],
    },
  },
  {
    id: 'colorado-crash',
    name: 'Colorado Crash Analysis',
    domain: 'Data Science / Machine Learning',
    summary: '1.63M crash records — feature-engineered severity prediction with 99.95% accuracy',
    quickStats: [
      { label: 'Records', value: '1.63M+', color: 'amber' },
      { label: 'ID3 Acc', value: '99.95%', color: 'green' },
      { label: 'Features', value: '80+', color: 'blue' },
    ],
    techStack: ['Python', 'Pandas', 'Scikit-learn', 'NumPy', 'Matplotlib', 'Seaborn'],
    githubUrl: 'https://github.com/semani01/Colorado-Crash-Analysis',
    caseStudy: {
      problemStatement:
        "Colorado's roads see hundreds of thousands of crashes per year. Understanding what factors drive crash severity (fatal vs. injury vs. property-damage-only) could inform better infrastructure, policy, and emergency response. This project takes 1.63 million crash records with 80+ raw features and builds predictive models that identify the key risk drivers.",
      architecture: `Raw Data (1.63M records, 80+ columns)
        │
        ▼
  Data Cleaning & Encoding
  ├── Handle missing values
  ├── Encode categorical variables
  └── Remove duplicates and anomalies
        │
        ▼
  Feature Engineering
  ├── Rush hour indicator
  ├── Road context (highway vs. residential)
  ├── Lighting conditions
  ├── Weather conditions
  └── Temporal features (day of week, month, time)
        │
        ▼
  Model Training & Benchmarking
  ├── ID3 Decision Tree → ~99.95%
  ├── Random Forest → ~97.5%
  └── Held-out test set evaluation
        │
        ▼
  Analysis & Insights
  └── Feature importance ranking, risk driver identification`,
      keyDecisions: [
        {
          title: 'Feature engineering over model complexity',
          body: 'Instead of throwing raw features at a deep model, engineered domain-informed signals: rush hour indicator, lighting conditions, road context. These boosted performance more than any architecture change.',
        },
        {
          title: 'ID3 vs. Random Forest',
          body: "ID3 achieved ~99.95% which initially seemed suspicious. Careful investigation showed it wasn't overfitting — the engineered features genuinely separated the classes. Random Forest at ~97.5% provided a conservative ensemble benchmark.",
        },
        {
          title: 'Strict held-out evaluation',
          body: 'Used a strict train/test split with the test set never touched during feature selection or tuning. Prevents data leakage and gives honest performance estimates.',
        },
      ],
      results:
        'ID3 Decision Tree: ~99.95% accuracy. Random Forest: ~97.5% accuracy. Top crash severity drivers identified: lighting conditions, road type, rush hour, weather.',
      whatILearned:
        'Working with 1.63M records taught me the practical side of big data: memory management, efficient pandas operations, and the importance of EDA before modeling. The biggest lesson: thoughtful feature engineering on a simple model can outperform a complex model on raw features.',
      screenshotsNeeded: [
        'Feature importance bar chart (top 10 crash severity drivers)',
        'Confusion matrix for ID3 and Random Forest',
        'Sample engineered features table',
        'Temporal crash density visualization',
      ],
    },
  },
  {
    id: 'florasense',
    name: 'FloraSense — Crop Disease Detection',
    domain: 'Computer Vision / Deep Learning',
    summary: 'Hybrid ResNet50 + InceptionV3 classifier — 92%+ accuracy across 38 plant disease classes',
    quickStats: [
      { label: 'Accuracy', value: '92%+', color: 'green' },
      { label: 'Classes', value: '38', color: 'amber' },
      { label: 'Images', value: '~90k', color: 'blue' },
    ],
    techStack: ['Python', 'PyTorch', 'TensorFlow', 'ResNet50', 'InceptionV3', 'Transfer Learning'],
    githubUrl: 'https://github.com/semani01/Crop-Illness-Analysis',
    caseStudy: {
      problemStatement:
        'Crop diseases cause massive agricultural losses worldwide. Farmers often lack access to plant pathologists, and visual disease identification is error-prone. An automated system that classifies diseases from a leaf photo enables faster, cheaper, and more accurate diagnosis — especially in regions with limited agricultural expertise.',
      architecture: `Input Image (leaf photo)
        │
        ▼
  Data Augmentation
  ├── Random rotation, zoom, flip
  ├── Brightness/contrast jitter
  └── Training set expansion
        │
        ▼
  Hybrid CNN Feature Extraction
  ├── ResNet50 branch (deep residual features)
  ├── InceptionV3 branch (multi-scale features)
  └── Concatenated feature vectors
        │
        ▼
  Classification Head
  ├── Dense layers with dropout
  ├── Batch normalization
  └── Softmax output (38 classes)
        │
        ▼
  Inference Script
  └── Returns predicted class + confidence score`,
      keyDecisions: [
        {
          title: 'Hybrid architecture (ResNet50 + InceptionV3)',
          body: 'ResNet excels at deep residual features through skip connections; InceptionV3 captures multi-scale features through parallel convolutions at different kernel sizes. Concatenating their feature vectors gives the classifier a richer representation than either alone.',
        },
        {
          title: 'Heavy augmentation to combat class imbalance',
          body: 'With 90k images across 38 classes, some classes had far fewer samples. Aggressive augmentation helped the model generalize instead of memorizing the training set.',
        },
        {
          title: 'Label cleaning before training',
          body: 'The original dataset had mislabeled images and duplicates. Spending time on data quality before training improved accuracy more than any hyperparameter change.',
        },
      ],
      results:
        '>92% validation accuracy across 38 disease classes. Hybrid architecture outperformed either branch alone. Strong generalization on held-out test set.',
      whatILearned:
        'This project crystallized the "data quality > model complexity" principle. The hybrid architecture helped, but the single biggest accuracy boost came from cleaning the labels and augmenting the training data. Transfer learning is dramatically more sample-efficient than training from scratch.',
      screenshotsNeeded: [
        'Sample grid of leaf images across disease classes',
        'Training/validation accuracy and loss curves',
        'Confusion matrix heatmap (38 classes)',
        'Dual-branch hybrid architecture diagram',
        'Sample inference: leaf image → predicted disease + confidence',
      ],
    },
  },
  {
    id: 'ai-stock-picker',
    name: 'AI Stock Picker',
    domain: 'Machine Learning / Finance',
    summary: '6-model ML pipeline for stock return prediction — blockchain-verified picks vs S&P 500',
    quickStats: [
      { label: 'Models', value: '6', color: 'green' },
      { label: 'Best', value: 'RF', color: 'amber' },
      { label: 'Verified', value: 'BTC ₿', color: 'purple' },
    ],
    techStack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Random Forest', 'Blockchain'],
    githubUrl: 'https://github.com/semani01/AI_Stock_Picker',
    caseStudy: {
      problemStatement:
        'During the COVID lockdown, markets swung wildly. The question: is there a structured, data-driven way to identify undervalued stocks? This project builds an ML pipeline that collects financial data, engineers features from company fundamentals, trains models to predict one-year forward returns, backtests against the S&P 500, and generates real picks — timestamped on the Bitcoin blockchain for verifiable, tamper-proof records.',
      architecture: `Financial Data Collection
  ├── Historical financial statements
  └── Annual stock price returns
        │
        ▼
  Feature Engineering
  ├── Revenue growth, P/E ratio, book value
  ├── Fundamental financial metrics → feature matrix (X)
  └── 1-year forward return → target variable (y)
        │
        ▼
  Model Training & Evaluation
  ├── Linear Regression (baseline)
  ├── Elastic-Net (regularized)
  ├── KNN (similarity-based)
  ├── SVM Regressor (margin-based)
  ├── Decision Tree (interpretable)
  └── Random Forest (ensemble, winner)
        │
        ▼
  Backtesting Framework
  ├── Multi-period historical backtests
  ├── S&P 500 benchmark comparison
  └── Statistical significance testing
        │
        ▼
  Stock Picks (2020 & 2021)
  └── Timestamped on Bitcoin blockchain`,
      keyDecisions: [
        {
          title: 'Backtesting over single-metric evaluation',
          body: 'Built a backtesting framework that tested each model across multiple historical periods instead of trusting a single accuracy number. Simulates real investing conditions where you do not know the future.',
        },
        {
          title: 'User-controlled risk posture',
          body: 'Built the system to let users balance aggressive vs. defensive portfolios, reflecting value investing philosophy that different people have different risk tolerances.',
        },
        {
          title: 'Blockchain timestamping for integrity',
          body: 'To prove picks were made before the holding period (not cherry-picked after), timestamped stock selections on the Bitcoin blockchain. An integrity mechanism, not a crypto feature.',
        },
      ],
      results:
        'Random Forest outperformed all 5 other models. Backtested portfolio beat S&P 500 benchmark across multiple historical periods. 2020 and 2021 picks verifiably timestamped on Bitcoin blockchain.',
      whatILearned:
        'The evaluation loop taught me more than the models. Building a backtesting framework that measures honestly — without data leakage or look-ahead bias — forced me to think like a practitioner. Also learned disciplined self-study: taking an idea from curiosity to a working system through iteration.',
      screenshotsNeeded: [
        'Model comparison table with performance metrics',
        'Backtesting returns chart vs. S&P 500 benchmark',
        'Feature importance from Random Forest',
        'Pipeline flow diagram',
        'Blockchain timestamp proof screenshot',
      ],
    },
  },
  {
    id: 'maieutic',
    name: 'Maieutic — AI Socratic Tutor',
    domain: 'Generative AI / RAG / Full-Stack',
    summary: 'RAG over course materials + Claude API — never gives direct answers, tracks weak spots across sessions',
    quickStats: [
      { label: 'Core AI', value: 'Claude', color: 'purple' },
      { label: 'Vector DB', value: 'pgvector', color: 'blue' },
      { label: 'Deployed', value: 'Live ✓', color: 'green' },
    ],
    techStack: ['React', 'Node.js', 'Express', 'Supabase', 'pgvector', 'Claude API', 'OpenAI Embeddings', 'RAG'],
    githubUrl: 'https://github.com/semani01/maieutic',
    liveUrl: 'https://ai-professor-office-hours-simulator.vercel.app/',
    caseStudy: {
      problemStatement:
        "At 11pm the night before an exam, no help exists that actually knows your course. Google is generic. ChatGPT has never read your professor's slides. This system lets students upload their actual course materials and ask questions. The AI answers exclusively from those materials — critically, it never gives the direct answer, using the Socratic method to guide students to the answer themselves.",
      architecture: `Student uploads course materials (PDF, PPTX, DOCX)
        │
        ▼
  Document Ingestion Pipeline
  ├── Parse text (pdf-parse, mammoth, pptx-parser)
  ├── Chunk semantically (~500 tokens)
  ├── Embed chunks (OpenAI text-embedding-3-small)
  └── Store in Supabase pgvector + metadata (week, topic)
        │
        ▼
  Student asks a question
        │
        ▼
  RAG Retrieval
  ├── Embed the question
  ├── Similarity search → top 4–6 chunks
  └── Inject chunks + source labels into Claude prompt
        │
        ▼
  Claude API with Socratic System Prompt
  ├── NEVER give direct answers — ask guiding questions
  ├── Reference specific course materials by week
  ├── After 3 failed exchanges: give stronger hints
  └── Keep responses concise — one hint at a time
        │
        ▼
  Response + Session Tracking
  ├── Source citation display
  ├── Log topics asked, hint count, resolution status
  └── Longitudinal weak spot map across sessions`,
      keyDecisions: [
        {
          title: 'Socratic constraint as a product decision',
          body: "The constraint is the fundamental differentiator from NotebookLM. NotebookLM optimizes for surfacing answers faster. Maieutic's goal is the exact opposite — productive friction. It's a complete inversion of retrieval's value proposition.",
        },
        {
          title: 'Semantic chunking over fixed-window',
          body: 'Course materials have natural boundaries (slides, sections, headers). Chunking at ~500 tokens while respecting these boundaries produces more coherent retrieval than blindly splitting every N characters.',
        },
        {
          title: 'Course-aware temporal context',
          body: 'The system knows which week each piece of content was taught, so it can reference "your Week 4 lecture" rather than just "the materials." Responses feel like they come from someone who actually knows the course.',
        },
      ],
      results:
        'Deployed and live at ai-professor-office-hours-simulator.vercel.app. Full RAG pipeline with Supabase pgvector, longitudinal weak spot tracking across sessions, and source citation for every response.',
      whatILearned:
        "Designing the Socratic constraint taught me that the hardest AI product decisions aren't about what the model can do — they're about what you deliberately prevent it from doing. The constraint is probabilistic, not guaranteed, and adversarial prompting can break it. A production version would need a classifier layer detecting shortcut attempts.",
      screenshotsNeeded: [
        'Landing page screenshot (from live app)',
        'Two-panel UI: materials (left) + chat (right)',
        'RAG pipeline diagram',
        'Weak spot dashboard (topics color-coded by resolution)',
        'Sample Socratic conversation',
      ],
    },
  },
  {
    id: 'stroke-rehab',
    name: 'Stroke Rehabilitation Analytics Pipeline',
    domain: 'ML Research / Biomechanics',
    summary: 'End-to-end pipeline: phone-based motion capture → OpenSim IK → Moco optimization → clinical batch reports',
    quickStats: [
      { label: 'Institution', value: 'CU Med', color: 'blue' },
      { label: 'Tools', value: 'OpenSim', color: 'amber' },
      { label: 'Status', value: 'Active', color: 'green' },
    ],
    techStack: ['Python', 'OpenSim', 'Moco', 'markerless motion capture', 'biomechanical modeling'],
    caseStudy: {
      problemStatement:
        'Stroke rehabilitation requires tracking patient movement over time to measure recovery. Traditional motion capture (with physical markers) is expensive and requires specialized lab equipment. This project builds a pipeline using phone-based markerless motion capture, then biomechanical modeling to extract joint angles and muscle activations for clinician reporting.',
      architecture: `Volunteer Intake & Recording
  ├── Standardized protocol
  └── Phone-based markerless motion capture
        │
        ▼
  Preprocessing & QA
  ├── Standardized preprocessing steps
  ├── Automated QA/validation checks
  └── Instrumented runs for repeatability
        │
        ▼
  OpenSim Inverse Kinematics
  ├── Skeleton model fitting
  └── Joint angle extraction
        │
        ▼
  Moco Optimization
  ├── Muscle-tendon dynamics modeling
  └── Muscle activation estimation
        │
        ▼
  Batch Reporting for Clinicians
  ├── Target joints/muscles with activation values
  ├── Multi-patient comparison
  └── Consistent, reproducible output formats`,
      keyDecisions: [
        {
          title: 'Markerless over marker-based capture',
          body: "The lab's goal is accessibility. Phone-based capture lets patients record at home or in a clinic without expensive equipment. The trade-off is lower precision, compensated by robust preprocessing and QA.",
        },
        {
          title: 'Automated QA/validation checks',
          body: 'Markerless capture introduces noise. Automated checks flag anomalous joint angles, missing data segments, and frame-to-frame discontinuities — making the pipeline reproducible across patients and operators.',
        },
        {
          title: 'Batch processing for clinical usability',
          body: 'Clinicians need to compare multiple patients efficiently. The pipeline processes patients in batch and generates standardized reports rather than requiring individual manual runs.',
        },
      ],
      results:
        'Ongoing research at CU Anschutz. Pipeline handles full patient workflow from intake to batch clinical reports. Automated QA reduces manual data review time significantly.',
      whatILearned:
        'Working in medical research taught me that reproducibility matters more than peak accuracy. A pipeline that gives consistent, explainable results across patients is more valuable than one that sometimes gives better numbers but cannot be trusted. If you cannot describe exactly what you did, the results are worthless.',
      screenshotsNeeded: [
        'Pipeline flow diagram (use synthetic/anonymized data)',
        'Sample joint-angle time series plot',
        'Sample muscle activation heatmap',
        'Before/after QA check visualization',
      ],
    },
  },
  {
    id: 'bragify',
    name: 'Bragify — Performance Review Workflow',
    domain: 'Full-Stack / LLM Product Engineering',
    summary: 'Slack-native achievement logging → AI-generated performance reviews via /log, /track, /generate',
    quickStats: [
      { label: 'Platform', value: 'Slack', color: 'amber' },
      { label: 'Backend', value: 'Node.js', color: 'blue' },
      { label: 'AI', value: 'OpenAI', color: 'green' },
    ],
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Slack API', 'OpenAI API', 'webhooks'],
    liveUrl: 'https://bragify.dev',
    caseStudy: {
      problemStatement:
        'Performance reviews are universally dreaded because nobody remembers what they accomplished six months ago. Bragify lets users log accomplishments continuously via Slack, then automatically generates structured performance review documents (weekly, quarterly, annual) using LLM-powered summarization.',
      architecture: `Slack Workspace
  ├── /log "shipped the auth module"
  ├── /track (view logged achievements)
  └── /generate quarterly
        │
        ▼
  Node.js / Express Backend
  ├── Webhook receiver for Slack commands
  ├── Input validation & sanitization
  ├── PostgreSQL storage (achievements, users, teams)
  └── LLM guardrails & fallback behaviors
        │
        ▼
  OpenAI Summarization
  ├── Structured prompt with achievement context
  ├── Template-based output formatting
  └── Error-tolerant generation with fallbacks
        │
        ▼
  Generated Documents
  ├── Weekly summaries
  ├── Quarterly reviews
  └── Annual performance documents`,
      keyDecisions: [
        {
          title: 'Slack-native over a standalone app',
          body: 'People already live in Slack. Building a separate app means another tab, another login, another thing to remember. By making Bragify a Slack bot, logging is a 5-second interruption with near-zero friction.',
        },
        {
          title: 'LLM guardrails and fallback behaviors',
          body: 'LLMs sometimes produce malformed output or break template format. Built input validation before the LLM call, structured output parsing after, and fallback behaviors (return raw logs if generation fails) so the user never gets an empty response.',
        },
        {
          title: 'Structured formatting over freeform',
          body: 'Generated documents follow consistent templates so they slot into existing HR processes. The LLM fills in template sections, not the document structure.',
        },
      ],
      results:
        'Production company product at bragify.dev. Slack slash commands (/log, /track, /generate) deployed and in use. OpenAI-powered summarization with structured template output and reliable fallback behaviors.',
      whatILearned:
        'Building production LLM features taught me that the LLM is the easy part — the hard part is everything around it: input validation, error handling, rate limiting, fallback behaviors, and template consistency. Reliability engineering for LLM-powered features is an underappreciated skill.',
      screenshotsNeeded: [
        'Slack command interaction flow (/log → confirmation → /generate)',
        'Sample generated quarterly review (mock data)',
        'Architecture diagram',
      ],
    },
  },
  {
    id: 'samsung-inpainting',
    name: 'Samsung R&D — Image/Video Inpainting',
    domain: 'Computer Vision / Deep Learning',
    summary: 'U-Net inpainting pipeline with optical flow for video temporal coherence — built at Samsung R&D',
    quickStats: [
      { label: 'Architecture', value: 'U-Net', color: 'blue' },
      { label: 'Metric', value: 'SSIM', color: 'green' },
      { label: 'Company', value: 'Samsung', color: 'amber' },
    ],
    techStack: ['PyTorch', 'U-Net', 'optical flow', 'OpenCV', 'FFmpeg', 'Python'],
    caseStudy: {
      problemStatement:
        'Removing unwanted objects from images and videos (inpainting) is a core computer vision problem. For video, the additional challenge is temporal coherence — the filled region must look consistent across frames, not flicker or warp. This project built an end-to-end pipeline handling detection, masking, inpainting, and evaluation for both images and video.',
      architecture: `Input Image / Video
        │
        ▼
  Object Detection & Masking
  ├── Detect target objects
  └── Generate binary mask of regions to fill
        │
        ▼
  Preprocessing
  ├── OpenCV frame extraction (video)
  ├── FFmpeg format handling
  └── Automated data preparation
        │
        ▼
  U-Net Inpainting Network
  ├── Encoder: extract context from surrounding pixels
  ├── Decoder: reconstruct the masked region
  └── Skip connections for fine detail preservation
        │
        ▼
  Video: Optical Flow Guidance
  ├── Estimate motion between frames
  ├── Propagate inpainting across frames
  └── Ensure temporal coherence
        │
        ▼
  Evaluation
  ├── SSIM (structural similarity)
  └── Frame-to-frame temporal coherence metric`,
      keyDecisions: [
        {
          title: 'Optical flow for video coherence',
          body: 'Naive frame-by-frame inpainting produces temporal artifacts (flickering, warping). By estimating optical flow between frames and using it to guide the inpainting network, filled regions remain consistent as the camera or objects move.',
        },
        {
          title: 'U-Net skip connections',
          body: 'The encoder-decoder structure with skip connections preserves both high-level semantics (what should fill the region) and low-level details (texture, edges). Critical balance for visually convincing inpainting.',
        },
        {
          title: 'Automated batch preprocessing',
          body: "Samsung's production environment required processing large volumes of images and video. Built automated OpenCV/FFmpeg preprocessing so raw inputs could be batch-processed without manual intervention.",
        },
      ],
      results:
        'Production-scale inpainting pipeline deployed at Samsung R&D. SSIM and temporal coherence metrics used for evaluation. Handled batch volumes of images and video automatically.',
      whatILearned:
        'Working at Samsung R&D taught me what "production-style" means: automated preprocessing, batch processing, standardized evaluation metrics, and code other engineers can maintain. The research solves the ML problem; production solves the engineering problem.',
      screenshotsNeeded: [
        'Before/after inpainting comparison (generic example, not Samsung data)',
        'U-Net architecture diagram with skip connections',
        'Optical flow visualization between frames',
      ],
    },
  },
]

// ─── Skills ───────────────────────────────────────────────────────────────────
// Proficiency values match the engine mode bars in full_telemetry.html mockup

export const skills: SkillItem[] = [
  { id: 'deep-learning', label: 'Deep Learning', category: 'ml', proficiency: 92 },
  { id: 'nlp-transformers', label: 'NLP / Transformers', category: 'ml', proficiency: 88 },
  { id: 'computer-vision', label: 'Computer Vision', category: 'ml', proficiency: 85 },
  { id: 'rag-embeddings', label: 'RAG / Embeddings', category: 'ml', proficiency: 78 },
  { id: 'fullstack-dev', label: 'Full-Stack Dev', category: 'fullstack', proficiency: 75 },
  { id: 'mlops-docker', label: 'MLOps / Docker', category: 'mlops', proficiency: 65 },
  { id: 'cloud', label: 'Cloud (AWS/GCP/Azure)', category: 'cloud', proficiency: 58 },
  { id: 'data-science', label: 'Data Science & Viz', category: 'data', proficiency: 80 },
]

// ─── External Data (hydrated at build time) ───────────────────────────────────

export const githubStats: GitHubStats = {
  totalRepos: 28,
  totalStars: 0,       // fetched at build time
  topLanguages: [
    { name: 'Python', percentage: 65 },
    { name: 'JavaScript', percentage: 20 },
    { name: 'TypeScript', percentage: 10 },
    { name: 'Java', percentage: 5 },
  ],
  commitFrequency: 0,  // fetched at build time
}

export const leetcodeStats: LeetCodeStats = {
  totalSolved: 0,      // fetched at build time
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  streak: 0,
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contact = {
  email: 'esrikar01@gmail.com',
  github: 'https://github.com/semani01',
  linkedin: 'https://linkedin.com/in/saisrikaremani',
  location: 'Austin, TX',
  name: 'Sai Srikar Emani',
  title: 'ML Engineer / Full-Stack Developer',
}
