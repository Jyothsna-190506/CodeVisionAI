# CodeVision AI — Intelligent Full-Stack Code Analysis, Visualization and Learning Platform

> **Understand • Analyze • Visualize • Improve Code**

CodeVision AI is a production-grade, advanced full-stack AI platform built to analyze, simulate, evaluate, visualize, and optimize source code across Python, C++, Java, JavaScript, TypeScript, Go, Rust, and more.

---

## 🚀 Key Features

* **Multi-Language Monaco Code Editor**: Syntax highlighting, auto-formatting, sample templates, and file upload across 16+ languages.
* **11-Domain Comprehensive Analysis Suite**:
  1. **Executive Overview**: Complexity summaries, execution conclusions, and primary algorithmic characteristics.
  2. **AI Step-by-Step Simulation**: Line-by-line runtime trace, variable heap/stack memory tracking, and mutation highlights.
  3. **Metrics & Transparent Quality Score**: Cyclomatic complexity, nesting depth, LOC metrics, and clear mathematical formulas.
  4. **Categorized Bug Detection**: Static analysis & AI security audits for infinite loops, unhandled nulls/exceptions, resource leaks, and logic bugs with suggested fixes.
  5. **Automated Optimizations**: Side-by-side refactoring diffs, expected asymptotic improvements, and memory savings.
  6. **Flowchart Generation**: React Flow & SVG control-flow decision branches, loop nodes, and process pipelines.
  7. **AST Hierarchy Visualizer**: Real Abstract Syntax Tree parser with line locations, token types, and collapsible structures.
  8. **Function Call Graph**: Caller/callee dependency graphs with invocation counts and external linkage indicators.
  9. **Unit Test Case Generator**: Normal, boundary, edge, invalid, and exception stress scenarios with runnable test code.
  10. **Similar Code & RAG Search**: Algorithmic pattern matching against standard algorithmic datasets with similarity scores.
  11. **Project-Aware AI Code Chat**: Context-injected assistant persisting conversations in MongoDB Atlas.
* **Exportable Reports**: One-click downloadable PDF and HTML code audit reports with branding.
* **Full Project Management (CRUD)**: Create, duplicate, favorite, tag, search, and delete persistent repositories.
* **Database-Driven Dashboard**: Live statistics, KPI cards, analyses over time, quality score distributions, and project language breakdowns.
* **Audit History Trail**: User action tracking and analysis logs with filtering and deletion.
* **Role-Based Authentication & Security**:
  * JWT Bearer Token authentication & bcrypt password hashing
  * Multi-tier roles (`USER` & `ADMIN`)
  * Data isolation enforcing strict user ownership
  * Helmet headers, CORS policies, and rate limiters
* **Admin Governance Console**: Manage user accounts, role escalations, activation toggles, ecosystem analytics, and system audit logs.

---

## 🛠️ Technology Stack

### Frontend
* **React 18** with **TypeScript** & **Vite**
* **Tailwind CSS** & **Framer Motion**
* **Monaco Editor** (`@monaco-editor/react`)
* **React Router v6**
* **Recharts** (Area, Bar, Radar, and Line charts)
* **Lucide React** icons & **Axios**

### Backend
* **Node.js** & **Express.js** (ES Modules)
* **MongoDB Atlas** with **Mongoose**
* **JWT** (`jsonwebtoken`) & **Bcrypt.js**
* **Babel Parser** (`@babel/parser`, `@babel/traverse`) for AST
* **PDFKit** for PDF report generation
* **Helmet**, **CORS**, and **express-rate-limit**
* **Multi-Provider AI Service**: Groq, OpenRouter, and Ollama support with built-in fallbacks

---

## 📁 Repository Structure

```text
codevision-ai/
├── client/                     # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI & editor controls
│   │   ├── context/            # AuthContext & state management
│   │   ├── layouts/            # AppLayout with sidebar & header
│   │   ├── pages/              # Dashboard, Projects, Editor, Analysis, Auth, Admin, etc.
│   │   ├── services/           # apiClient & full REST endpoints
│   │   ├── types/              # Domain TypeScript interfaces
│   │   └── App.tsx             # Route definitions
│   ├── Dockerfile
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (MongoDB Atlas connection)
│   ├── controllers/            # Auth, User, Project, Analysis, Chat, Report, Admin
│   ├── middleware/             # Auth, Admin, RateLimiter, ErrorHandler
│   ├── models/                 # User, Project, Analysis, AnalysisResult, History, ChatMessage, Report
│   ├── routes/                 # Modular API routes
│   ├── scripts/                # seedAdmin.js
│   ├── services/               # AST, Bugs, Complexity, Flowchart, AI, Tests, Reports
│   ├── test/                   # testRunner.js integration suite
│   ├── Dockerfile
│   └── server.js
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

### Backend Configuration (`server/.env`)

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Credentials
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/codevision?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# AI Inference (Groq, OpenRouter, or Ollama)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
AI_MODEL=llama-3.3-70b-versatile

# Seed Admin Account
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@codevision.ai
ADMIN_PASSWORD=AdminPassword123!
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
npm install
npm run seed:admin   # Seeds the initial administrator account
npm start            # Starts the Express API server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev          # Starts the Vite development server on http://localhost:5173
```

### 3. Automated Integration Testing

```bash
cd server
npm test             # Executes all 10 end-to-end test suites against MongoDB Atlas
```

---

## 🔒 Security Architecture

1. **Strict Data Isolation**: Every database query enforces ownership (`userId: req.user.id`).
2. **Credential Sanitization**: Passwords are automatically hashed with salted bcrypt rounds and excluded from queries.
3. **No Direct Database Access**: Frontend communicates solely with Express REST API over JWT.
4. **Rate Limiting**: Defends authentication endpoints and AI generation against brute force and DDoS.

---

## 📜 License

MIT License © 2026 CodeVision AI.
