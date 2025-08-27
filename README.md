# 🚀 CollabIDE - Real-Time Collaborative Code Editor

<div align="center">
  
![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-blue?style=for-the-badge&logo=typescript)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7.0-white?style=for-the-badge&logo=socket.io&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

<br/>

🔗 [Live Demo](https://collabide.vercel.app/) • 📚 [Documentation](https://docs.collabide.dev/) • 🐛 [Issues](https://github.com/yourusername/collabide/issues) • 💬 [Discussions](https://github.com/yourusername/collabide/discussions)

</div>

---

## 🎯 Overview

**CollabIDE** is a modern, real-time collaborative coding environment built with powerful web technologies. It offers a seamless, VS Code-like experience in the browser with live synchronization, multi-language support, and interactive collaboration tools.

### Perfect for:
- 👨‍🎓 Students working on group projects  
- 👩‍💻 Developers doing pair programming  
- 🏫 Educators conducting live coding sessions  
- 🚀 Remote teams collaborating in real-time  

---

## ✨ Features

| Feature | Description | Status |
|--------|-------------|--------|
| 🔄 Real-time Sync | Live collaborative editing with conflict resolution | ✅ Active |
| 👥 Multi-user Sessions | Public/private collaborative coding sessions | ✅ Active |
| 💬 Integrated Chat | Built-in team communication | ✅ Active |
| 🎨 Monaco Editor | Browser-based VS Code experience | ✅ Active |
| 🔐 Secure Auth | JWT-based authentication with email verification | ✅ Active |
| 📝 Multi-language Support | C++, Python, JavaScript, HTML, CSS | ✅ Active |
| 👁️ Live Cursors | Real-time cursor tracking and selections | ✅ Active |
| 🏗️ Session Management | Easily create, join, manage sessions | ✅ Active |
| 💾 Auto-save | Automatic session state saving | ✅ Active |
| 📱 Responsive UI | Fully optimized for desktop, tablet, and mobile | ✅ Active |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.1** — React framework with App Router
- **TypeScript 5.6.0** — Static typing
- **Tailwind CSS 3.4.0** — Utility-first CSS framework
- **Monaco Editor 4.5.0** — Code editor engine from VS Code
- **Socket.io Client 4.7.0** — WebSocket communication
- **Framer Motion 11.0.0** — Animation and transitions
- **React Hook Form** — Modern form handling
- **Zustand** — Lightweight state management

### Backend
- **Next.js API Routes** — Serverless functions
- **Prisma 6.0.0** — Type-safe database ORM
- **PostgreSQL** — Relational database
- **Socket.io Server** — Real-time WebSocket support
- **JWT Authentication** — Token-based security
- **bcryptjs 2.4.3** — Password hashing
- **Nodemailer 6.9.0** — Email sending
- **Zod 3.22.0** — Schema validation

### Dev & Testing
- **Jest** — Unit testing
- **Cypress** — E2E testing
- **ESLint** — Code linting
- **Prettier** — Code formatting
- **Husky** — Git hooks

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 12
- Mailtrap or SMTP credentials (for dev emails)

---

### 🔧 Installation

```bash
# 1. Clone the Repository
git clone https://github.com/vatsalumrania/collabide.git
cd collabide

# 2. Install Dependencies
npm install
```


⚙️ Environment Setup
Create a .env file in the root directory and add the following:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/collabide"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_REFRESH_SECRET="your-refresh-token-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email (Mailtrap Example)
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="your-mailtrap-username"
SMTP_PASS="your-mailtrap-password"
FROM_EMAIL="noreply@noreply.com"
```

🗃️ Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npm run db:seed
```
▶️ Run Development Server
```bash
npm run dev
# or
yarn dev
```
Visit: http://localhost:3000


🎮 Usage Example
---
Start a New Collaborative Session
Login/Register

Create or join a coding room

Start editing and invite others via session link

See real-time cursor movements, code updates, and chat messages

🐛 Known Issues
⚠️ Socket connection may lag on slow networks

📁 Optimization needed for large file handling

📱 Cursor sync improvements on mobile screens


🙌 Acknowledgements
---
🖊️ Monaco Editor — The core of the editor experience

🔌 Socket.io — Real-time collaboration magic

⚛️ Next.js — Robust full-stack framework


💖 All contributors and open-source communities
---