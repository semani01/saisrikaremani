# Project Case Studies

> This document contains detailed descriptions of every project to be featured in the Portfolio Grand Prix DRS zone deep-dives. Each section provides everything needed to build the in-app interactive case study overlay: problem statement, architecture, key decisions, results, tech stack, links, and notes on screenshots/diagrams to create.

---

## 1. PEGASUS Abstractive Summarizer

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| ROUGE-1 | 41.97 |
| ROUGE-2 | 23.48 |
| ROUGE-L | 38.21 |
| BLEU | 42.23 |
| Datasets | arXiv, CNN/DailyMail, XSum |
| Training samples | 40k train / 5k val / 5k test |

### Links

- **GitHub:** https://github.com/semani01/abstractive-summarization
- **Languages:** Jupyter Notebook (95.4%), CSS, JavaScript, Python
- **Release:** v1.0.0 (Jan 2, 2025)

### Problem Statement

The volume of digital content — research papers, news articles, web pages — is overwhelming. Extractive summarization (pulling existing sentences) produces awkward, fragmented summaries. Abstractive summarization (generating new sentences that capture the meaning) produces human-like output but is significantly harder. This project builds a production-ready abstractive summarization system that can handle scientific papers, news, PDFs, and URLs.

### Architecture

```
Input (Text / PDF / URL)
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
  └── Clean interface with text/PDF/URL tabs
```

### Key Technical Decisions

1. **Why PEGASUS over BART, T5, or GPT-3.5?** BART had extractive tendencies and lacked fluency. T5-Large suffered training instability and gradient explosions. GPT-3.5 was too expensive and had token length limits. PEGASUS-XSum's Gap-Sentence Generation pretraining objective is specifically designed for abstractive summarization — it masks entire sentences and learns to regenerate them, which is exactly the task.

2. **Hyperparameter tuning with Optuna.** Rather than manual grid search, used Optuna's Bayesian optimization to find optimal learning rate, batch size, and label smoothing. This automated approach was faster and found better configurations than manual tuning.

3. **Cached model loading for inference speed.** The fine-tuned model is large (~2GB). Loading it on every request would be impractical. Implemented a singleton pattern that loads the model once on Flask startup and keeps it in memory for subsequent requests.

### Results

| Model | Performance Notes |
|-------|------------------|
| BART | Extractive tendencies, lacked fluency |
| GPT-3.5-Turbo | High computation cost, token length limits |
| T5-Large | Training instability, gradient explosions |
| **PEGASUS-XSum** | **Best abstractive performance across all metrics** |

### Screenshots/Diagrams Needed

- [ ] App screenshot (available in GitHub README — the web UI with text input)
- [ ] Model architecture diagram (encoder-decoder with GSG/MLM — available in GitHub README)
- [ ] ROUGE/BLEU comparison bar chart (build as a simple React component)
- [ ] Sample input → output comparison showing a research abstract being summarized

### What I Learned

Building a real inference pipeline taught me more about production ML than any course. The gap between a Jupyter notebook achieving good ROUGE scores and a Flask API that reliably serves predictions to users is enormous — model loading, input validation, error handling, and response formatting all matter.

---

## 2. Colorado Crash Analysis

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| Records | 1.63M+ |
| Features | 80+ |
| Best Model (ID3) | ~99.95% accuracy |
| Random Forest | ~97.5% accuracy |
| Engineered signals | Rush hour, road context, lighting, weather |

### Links

- **GitHub:** https://github.com/semani01/Colorado-Crash-Analysis
- **Language:** Jupyter Notebook

### Problem Statement

Colorado's roads see hundreds of thousands of crashes per year. Understanding what factors drive crash severity (fatal vs. injury vs. property-damage-only) could inform better infrastructure, policy, and emergency response. This project takes 1.63 million crash records with 80+ raw features and builds predictive models that identify the key risk drivers.

### Architecture

```
Raw Data (1.63M records, 80+ columns)
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
  └── Feature importance ranking, risk driver identification
```

### Key Technical Decisions

1. **Feature engineering over more complex models.** The raw 80+ features included many redundant or low-signal columns. Rather than throwing everything into a deep model, spent significant time engineering meaningful signals: is this during rush hour? is the lighting poor? is the road a highway? These domain-informed features improved model performance more than any architecture change.

2. **ID3 vs. Random Forest.** ID3 achieved near-perfect accuracy (~99.95%) which initially seemed suspicious. Careful investigation showed it wasn't overfitting — the engineered features genuinely separated the classes well. Random Forest at ~97.5% provided a more conservative, ensemble-based benchmark.

3. **Held-out evaluation.** Used a strict train/test split with the test set never seen during any feature selection or tuning. This prevents data leakage and gives honest performance estimates.

### Screenshots/Diagrams Needed

- [ ] Feature importance bar chart (top 10 crash severity drivers)
- [ ] Confusion matrix visualization for ID3 and Random Forest
- [ ] Sample of engineered features table
- [ ] Geographic/temporal crash density if available in notebook

### What I Learned

Working with 1.63M records taught me the practical side of big data: memory management, efficient pandas operations, and the importance of doing EDA before modeling. The biggest lesson was that thoughtful feature engineering on a simple model (ID3) can outperform a complex model on raw features.

---

## 3. FloraSense — Crop Disease Detection

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| Images | ~90,000 |
| Classes | 38 (plant diseases) |
| Validation accuracy | >92% |
| Architecture | ResNet50 + InceptionV3 hybrid |
| Regularization | Dropout, weight decay, augmentation |

### Links

- **GitHub:** https://github.com/semani01/Crop-Illness-Analysis
- **Language:** Jupyter Notebook
- **License:** MIT

### Problem Statement

Crop diseases cause massive agricultural losses worldwide. Farmers often lack access to plant pathologists, and disease identification by visual inspection is error-prone. An automated system that can classify diseases from a photo of a leaf would enable faster, cheaper, and more accurate diagnosis — especially in regions with limited agricultural expertise.

### Architecture

```
Input Image (leaf photo)
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
  └── Returns predicted class + confidence score
```

### Key Technical Decisions

1. **Hybrid architecture (ResNet50 + InceptionV3).** Each architecture captures different feature types: ResNet excels at deep residual features through skip connections, while InceptionV3 captures multi-scale features through parallel convolutions at different kernel sizes. Concatenating their feature vectors gives the classifier a richer representation than either alone.

2. **Heavy augmentation to combat overfitting.** With 90k images across 38 classes, some classes had far fewer samples than others. Aggressive augmentation (rotation, zoom, flip, brightness jitter) helped the model generalize instead of memorizing the training set.

3. **Label cleaning before training.** The original dataset had some mislabeled images and duplicates. Spending time on data quality before training improved accuracy more than any hyperparameter change — a recurring lesson in applied ML.

### Screenshots/Diagrams Needed

- [ ] Sample grid of leaf images across different disease classes
- [ ] Training/validation accuracy and loss curves
- [ ] Confusion matrix heatmap for the 38 classes
- [ ] Architecture diagram showing the dual-branch hybrid model
- [ ] Sample inference output showing a leaf image → predicted disease + confidence

### What I Learned

This project crystallized the "data quality > model complexity" principle. The hybrid architecture helped, but the single biggest accuracy boost came from cleaning the labels and augmenting the training data. Also learned that fine-tuning pretrained models (transfer learning) is dramatically more sample-efficient than training from scratch.

---

## 4. AI Stock Picker

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| Models tested | 6 (Linear, Elastic-Net, KNN, SVM, Decision Tree, Random Forest) |
| Best model | Random Forest Regressor |
| Benchmark | S&P 500 |
| Verification | Blockchain-timestamped picks |
| Philosophy | Value investing (Buffett/Munger) |

### Links

- **GitHub:** https://github.com/semani01/AI_Stock_Picker
- **Language:** Jupyter Notebook
- **License:** Apache 2.0

### Problem Statement

During the COVID lockdown, markets swung wildly on headlines, earnings, and global events. The question: is there a structured, data-driven way to look past the noise and identify undervalued stocks? This project builds an end-to-end ML pipeline that collects financial data, engineers features from company fundamentals, trains models to predict one-year forward returns, backtests against the S&P 500, and generates real stock picks — timestamped on the Bitcoin blockchain for verifiable, tamper-proof records.

### Architecture

```
Financial Data Collection
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
  └── Timestamped on Bitcoin blockchain
```

### Key Technical Decisions

1. **Backtesting over single-metric evaluation.** Rather than trusting a single accuracy number, built a backtesting framework that tested each model across multiple historical periods. This simulates real investing conditions where you don't know the future.

2. **User-controlled risk posture.** Built the system to let users balance aggressive vs. defensive portfolios, reflecting the value investing philosophy that different people have different risk tolerances.

3. **Blockchain timestamping.** To prove the picks were made before the holding period (not cherry-picked after the fact), timestamped the stock selections on the Bitcoin blockchain. This is an integrity mechanism, not a crypto feature.

### Screenshots/Diagrams Needed

- [ ] Model comparison table with performance metrics
- [ ] Backtesting returns chart vs. S&P 500 benchmark
- [ ] Feature importance ranking from Random Forest
- [ ] Pipeline flow diagram
- [ ] Blockchain timestamp proof screenshot

### What I Learned

The evaluation loop taught me more than the models themselves. Building a backtesting framework that measures honestly — without data leakage or look-ahead bias — forced me to think like a practitioner, not a student. The project also taught disciplined self-learning: taking an idea from curiosity to a working system through iteration.

---

## 5. Maieutic — AI Socratic Tutor

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| Core AI | Claude API (Anthropic) |
| Architecture | RAG over course materials |
| Key constraint | Socratic method — never gives direct answers |
| Differentiator | Longitudinal weak spot tracking |
| Frontend | React + Vite + Tailwind |
| Backend | Node.js + Express |
| Vector DB | Supabase + pgvector |
| Embedding model | OpenAI text-embedding-3-small |
| Deployed | Vercel (frontend) + Railway (backend) |

### Links

- **GitHub:** https://github.com/semani01/maieutic
- **Live app:** https://ai-professor-office-hours-simulator.vercel.app/
- **Status:** Built and deployed

### Problem Statement

At 11pm the night before an exam, no help exists that actually knows your course. Google is generic. ChatGPT has never read your professor's slides. Reddit gives decontextualized answers. Office hours are tomorrow. This system lets a student upload their actual course materials — lecture slides, notes, syllabus, assignments — and then ask questions. The AI answers exclusively from those materials, referencing the exact week and framing the professor used. Critically, it never gives the student the direct answer — it uses the Socratic method to guide them to the answer themselves.

### What Makes This Different From NotebookLM

NotebookLM's core mechanic is identical: upload documents, ask questions, get answers grounded in your materials. But NotebookLM optimizes for surfacing answers faster. Maieutic's goal is the exact opposite — to create productive friction. The Socratic constraint isn't a feature layered on retrieval; it's a complete inversion of retrieval's value proposition. Additionally, NotebookLM has no memory of struggle — every session starts fresh. Maieutic tracks which topics the student asked about, how many hints they needed, and whether they resolved their confusion across sessions.

### Architecture

```
Student uploads course materials (PDF, PPTX, DOCX)
        │
        ▼
  Document Ingestion Pipeline
  ├── Parse text (pdf-parse, mammoth, pptx-parser)
  ├── Chunk semantically (~500 tokens, respecting slide/section boundaries)
  ├── Embed chunks (OpenAI text-embedding-3-small)
  └── Store in Supabase pgvector with metadata (source file, week/slide number, topic tag)
        │
        ▼
  Student asks a question
        │
        ▼
  RAG Retrieval Layer
  ├── Embed the question
  ├── Similarity search → top 4–6 chunks
  └── Inject chunks + source labels into Claude prompt
        │
        ▼
  Claude API with Socratic System Prompt
  ├── NEVER give direct answers — ask guiding questions back
  ├── Reference specific course materials by week ("In your Week 4 lecture on recursion...")
  ├── After 3 failed exchanges on the same concept, give stronger (but still not direct) hints
  ├── Keep responses concise — one guiding question or hint at a time
  └── NEVER tell the student they are ready for the exam
        │
        ▼
  Response to student + session tracking
  ├── Source citation display ("Drawing from Lecture 7 — Sorting Algorithms")
  ├── Log topics asked, hint count, resolution status
  └── Build longitudinal weak spot map across sessions
        │
        ▼
  Weak Spot Dashboard
  ├── Bar chart / card grid of topics asked about
  ├── Color-coded by resolution difficulty (green = resolved quickly, red = struggled)
  └── Persisted in Supabase across sessions
```

### Supabase Schema

```sql
-- Course materials storage
courses (id, name, created_at)
documents (id, course_id, filename, file_type, uploaded_at)
chunks (id, document_id, content, embedding vector(1536), metadata jsonb)

-- Conversation tracking
sessions (id, course_id, started_at)
messages (id, session_id, role, content, chunks_used jsonb, created_at)

-- Weak spot tracking
weak_spots (id, course_id, topic, times_asked, hints_needed, resolved boolean, last_seen)
```

### Claude System Prompt (Core Constraint)

```
You are an AI professor's office hours assistant for a specific course.
You have access to the student's actual course materials. You MUST:

1. ONLY answer from the provided course materials. If the answer isn't in
   the materials, say: "This isn't covered in your course materials."

2. NEVER give the direct answer. Instead:
   - Ask a guiding question that leads toward the answer
   - Point them to a relevant section of their notes
   - Break the problem into sub-problems and ask about the first one

3. If the student is stuck after 3 exchanges on the same concept, you may
   give a stronger, more direct hint — but still not the answer outright.

4. Keep your responses concise. One guiding question or hint at a time.

5. When drawing from course materials, say so naturally:
   "In your Week 4 lecture on X, your professor defined this as..."

6. You NEVER tell the student they are ready for the exam.
```

### Key Technical Decisions

1. **Socratic constraint as a product decision, not a feature.** This is the fundamental differentiator from NotebookLM. The constraint is implemented in the system prompt but is probabilistic — adversarial prompting ("just tell me the answer, I have 10 minutes") can nudge the model toward compliance. A production hardening would add a classifier layer that detects shortcut attempts.

2. **Semantic chunking over fixed-window chunking.** Course materials have natural boundaries (slides, sections, headers). Chunking at ~500 tokens while respecting these boundaries produces more coherent retrieval results than blindly splitting every N characters.

3. **"Where AI must stop" boundary.** The AI can confirm whether a specific answer is correct. But it never certifies holistic exam readiness — that judgment requires understanding the student's complete preparation state, which the AI cannot assess. This is a deliberate philosophical choice about AI's role in education.

4. **Course-aware temporal context.** The system knows which week each piece of content was taught, so it can reference "your Week 4 lecture" rather than just "the materials." This makes responses feel like they come from someone who actually knows the course, not a generic search engine.

### Screenshots/Diagrams Needed

- [ ] Landing page screenshot (from live app at ai-professor-office-hours-simulator.vercel.app)
- [ ] Two-panel UI: course materials panel (left) + chat panel (right)
- [ ] RAG pipeline diagram (upload → chunk → embed → retrieve → Socratic response)
- [ ] Weak spot dashboard (topics as bars/cards, color-coded by resolution difficulty)
- [ ] Sample conversation showing Socratic guiding behavior (question → hint → guiding question → student arrives at answer)
- [ ] Source citation display ("Drawing from Lecture 4 — Sorting Algorithms")

### What I Learned

Designing the Socratic constraint taught me that the hardest AI product decisions aren't about what the model can do — they're about what you deliberately prevent it from doing. The constraint is probabilistic, not guaranteed, and adversarial prompting can break it. A production version would need a classifier layer that detects when students try to shortcut the constraint. The NotebookLM comparison also taught me how to articulate product differentiation: the overlap is real, but the value proposition is inverted — and being honest about the overlap while sharp about the distinction is more persuasive than pretending the overlap doesn't exist.

---

## 6. Stroke Rehabilitation Analytics Pipeline

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| Role | ML Research Assistant |
| Institution | CU Anschutz Medical Campus |
| Pipeline | Intake → motion capture → IK → optimization |
| Tools | OpenSim, Moco, markerless motion capture |
| Output | Joint-angle and muscle-activation data |
| Impact | Multi-patient batch analysis for clinicians |

### Links

- **GitHub:** Private/institutional (describe architecture, not code)
- **Status:** Ongoing (Sep 2024 – Present)

### Problem Statement

Stroke rehabilitation requires tracking patient movement patterns over time to measure recovery progress. Traditional motion capture (with physical markers attached to the body) is expensive, invasive, and requires specialized lab equipment. This project builds an end-to-end pipeline using phone-based markerless motion capture — patients can be recorded with a smartphone camera — followed by biomechanical modeling to extract joint angles and muscle activations.

### Architecture

```
Volunteer Intake & Recording
  ├── Standardized recording protocol
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
  └── Joint angle extraction from motion data
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
  └── Consistent, reproducible output formats
```

### Key Technical Decisions

1. **Markerless over marker-based motion capture.** The lab's goal is accessibility. Phone-based capture lets patients record at home or in a clinic without expensive equipment. The trade-off is lower precision, which the pipeline compensates for with robust preprocessing and QA checks.

2. **Automated QA/validation checks.** Markerless capture introduces noise. Rather than manually inspecting every frame, built automated checks that flag anomalous joint angles, missing data segments, and frame-to-frame discontinuities. This makes the pipeline reproducible across patients and operators.

3. **Batch processing for clinical usability.** Clinicians need to compare multiple patients efficiently. The pipeline processes patients in batch and generates standardized reports, rather than requiring individual manual runs per patient.

### Screenshots/Diagrams Needed

- [ ] Pipeline flow diagram (intake → capture → IK → Moco → reports)
- [ ] Sample joint-angle time series plot
- [ ] Sample muscle activation heatmap
- [ ] Before/after QA check visualization (noisy vs. cleaned data)
- Note: No actual patient data in screenshots (use synthetic/anonymized data)

### What I Learned

Working in a medical research context taught me that reproducibility matters more than peak accuracy. A pipeline that gives consistent, explainable results across patients is more valuable than one that sometimes gives better numbers but can't be trusted. Also learned the importance of documenting every preprocessing step — in clinical research, if you can't describe exactly what you did, the results are worthless.

---

## 7. Bragify — Performance Review Workflow

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| Role | SDE Intern |
| Duration | Feb 2025 – May 2025 |
| Platform | Slack integration |
| Backend | Node.js / Express / PostgreSQL |
| AI | OpenAI-powered summarization |
| Commands | /log, /track, /generate |

### Links

- **Product:** https://bragify.dev
- **Status:** Production (company product, not open-source)

### Problem Statement

Performance reviews are universally dreaded because nobody remembers what they accomplished six months ago. People either under-report their work or scramble to reconstruct achievements from memory. Bragify solves this by letting users log accomplishments continuously via Slack, then automatically generating structured performance review documents (weekly, quarterly, annual) from those raw updates using LLM-powered summarization.

### Architecture

```
Slack Workspace
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
  └── Annual performance documents
```

### Key Technical Decisions

1. **Slack-native over a standalone app.** People already live in Slack. Building a separate app would mean another tab, another login, another thing to remember. By making Bragify a Slack bot, logging an achievement is a 5-second interruption: `/log shipped the auth module`. The friction is almost zero.

2. **LLM guardrails and fallback behaviors.** LLMs are probabilistic — they sometimes produce malformed output, hallucinate achievements, or break the template format. Built input validation before the LLM call, structured output parsing after, and fallback behaviors (return raw logs with a "generation failed, here are your raw entries" message) so the user never gets an empty response.

3. **Structured formatting over freeform.** The generated documents follow consistent templates (not freeform prose) so that they slot into existing HR processes. The LLM fills in the template sections, not the document structure.

### Screenshots/Diagrams Needed

- [ ] Slack command interaction flow (/log → confirmation → /generate)
- [ ] Sample generated quarterly review document
- [ ] Architecture diagram (Slack → webhook → API → DB → OpenAI → document)
- Note: Use mock data, not actual Bragify customer data

### What I Learned

Building production LLM features taught me that the LLM is the easy part — the hard part is everything around it: input validation, error handling, rate limiting, fallback behaviors, and template consistency. Users don't care how clever the AI is if it fails 5% of the time. Reliability engineering for LLM-powered features is an underappreciated skill.

---

## 8. Samsung R&D — Image/Video Inpainting Pipeline

### Quick Stats (for DRS compact card)

| Metric | Value |
|--------|-------|
| Role | Project Intern |
| Institution | Samsung R&D Institute India |
| Duration | Jun 2021 – Feb 2022 |
| Framework | PyTorch |
| Architecture | U-Net inpainting + optical flow |
| Metrics | SSIM, temporal coherence |

### Links

- **GitHub:** Private/institutional
- **Status:** Completed (proprietary Samsung work)

### Problem Statement

Removing unwanted objects from images and videos (inpainting) is a core problem in computer vision. For images, the challenge is filling the removed region with plausible content. For video, the additional challenge is temporal coherence — the filled region must look consistent across frames, not flicker or warp. This project built an end-to-end pipeline that handles detection, masking, inpainting, and evaluation for both images and video.

### Architecture

```
Input Image / Video
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
  └── Ensure temporal coherence (no flickering)
        │
        ▼
  Evaluation
  ├── SSIM (structural similarity)
  └── Frame-to-frame temporal coherence metric
```

### Key Technical Decisions

1. **Optical flow for video coherence.** Naive frame-by-frame inpainting produces temporal artifacts (flickering, warping). By estimating optical flow between frames and using it to guide the inpainting network, the filled regions remain consistent as the camera or objects move.

2. **U-Net architecture.** The encoder-decoder structure with skip connections preserves both high-level semantics (what should fill the region) and low-level details (texture, edges). This balance is critical for visually convincing inpainting.

3. **Automated preprocessing pipeline.** Samsung's production environment required processing large volumes of images and video. Built automated OpenCV/FFmpeg preprocessing so that raw inputs could be batch-processed without manual intervention.

### Screenshots/Diagrams Needed

- [ ] Before/after inpainting comparison (image with object removed)
- [ ] U-Net architecture diagram with skip connections
- [ ] Optical flow visualization between video frames
- Note: Use generic examples, not proprietary Samsung data

### What I Learned

Working at Samsung R&D taught me what "production-style" means in industry: automated preprocessing, batch processing, standardized evaluation metrics, and code that other engineers can maintain. The gap between a research prototype and a production pipeline is significant — the research solves the ML problem, but production solves the engineering problem.

---

## Screenshots & Diagrams TODO

When building Phase 5 (DRS zones), collect or create the following assets and store them in `/public/images/projects/`:

### Per Project

| Project | Priority Assets |
|---------|----------------|
| PEGASUS | App screenshot (from GitHub), architecture diagram, ROUGE comparison chart |
| Colorado Crash | Feature importance chart, confusion matrix, data pipeline diagram |
| FloraSense | Leaf image grid, accuracy curves, hybrid architecture diagram |
| AI Stock Picker | Backtesting chart, model comparison table, pipeline diagram |
| Maieutic | Chat UI wireframe, RAG pipeline diagram, weak spot dashboard mockup |
| Stroke Rehab | Pipeline diagram, sample joint-angle plot (synthetic data) |
| Bragify | Slack command flow, architecture diagram, sample generated doc |
| Samsung | Before/after inpainting, U-Net diagram, optical flow viz |

### Architecture Diagrams

These should be built as React/SVG components within the case study overlays — not static images. This way they're interactive (hoverable nodes, clickable for detail) and demonstrate your frontend skills as part of the portfolio itself.

---

*This document is the content source for Phase 5 of the Portfolio Grand Prix roadmap. Claude Code should reference this when building the CaseStudyOverlay components.*
