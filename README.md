<div align="center">
  <h1 align="center">CollabIDE</h1>
  <p align="center">
    A real-time, multi-user collaborative code editor built for seamless pair programming and remote teamwork.
  </p>
  <p align="center">
   
  </p>
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black?style=flat-square&logo=socket.io)](https://socket.io/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

</div>

<br/>

<p align="center">
  <img width="1919" height="932" alt="image" src="https://github.com/user-attachments/assets/c074b108-ac56-4c32-b9f1-e182000e3019" alt="The CollabIDE real-time editor showcasing its dark theme, with a live cursor from another user in the code, and a terminal panel displaying successful code execution." />

</p>

## 🌟 Why CollabIDE?

As a developer, I've always been fascinated by real-time applications. I wanted to build a project that would challenge me to go beyond typical CRUD apps and dive deep into **WebSockets**, **complex state management**, and **modern authentication patterns**. CollabIDE is the result—a tool built from the ground up to practice and showcase these advanced skills in a practical, real-world application.

## 🎯 Key Features

-   **⚡ Real-time Collaboration:** Instant synchronization of code, cursors, and selections across all participants using Socket.IO.
-   **👨‍💻 Multi-User Editor:** Powered by **Monaco Editor** (the engine behind VS Code) for a familiar, feature-rich coding experience.
-   **💬 Integrated Chat:** A dedicated chat panel for seamless communication without leaving the coding environment.
-   **🔐 Dual Authentication:** Secure and flexible user auth with two distinct flows:
    -   **Custom JWT:** For traditional email and password sign-ins.
    -   **OAuth 2.0:** For one-click login with Google & GitHub via NextAuth.js.
-   **🖥️ Code Execution:** Run code snippets directly in the app and view the output in a built-in terminal.
-   **📂 File & Session Management:** A full-featured dashboard to create, manage, and join public or private coding sessions.
-   **🌐 Live Preview:** Instantly render a live preview for web development files (HTML, CSS, JS).
-   **🎁 Export to Zip:** Download the entire session's files, including a README, as a zip archive.

## 🛠️ Tech Stack & Architecture

This project uses a modern, monolithic architecture with a clear separation between the frontend, backend API, and real-time server components.

| Area          | Technologies                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | **Next.js 14** (App Router), **React**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** |
| **Backend** | **Next.js API Routes**, **Node.js** |
| **Real-time** | **Socket.IO** (integrated with a custom Node.js server)                                                                            |
| **Database** | **PostgreSQL** with **Prisma ORM** for type-safe database access.                                                                  |
| **Auth** | **NextAuth.js**, **JWT**, **bcrypt.js** |
| **Deployment**| **Vercel** |

## 💡 Challenges & Learnings

Building CollabIDE was a fantastic learning experience. Here are some of the key challenges I tackled:

1.  **Real-time State Synchronization:** The biggest challenge was ensuring a seamless, low-latency experience. Synchronizing code, cursor positions, and participant statuses across multiple clients without conflicts required careful state management on both the server and client, using techniques like **debouncing events**, **using refs to prevent re-renders**, and designing a robust Socket.IO event architecture.

2.  **Monaco Editor Integration:** Integrating Monaco (which has an imperative API) into React's declarative world was complex. I learned how to manage its lifecycle, create custom themes, and carefully handle remote vs. local changes to prevent infinite update loops and maintain a single source of truth for file content.

3.  **Unified Authentication:** Engineering a system that gracefully handles both my custom JWT flow and NextAuth.js OAuth providers was a deep dive into modern auth patterns. I built a custom API endpoint to exchange a NextAuth session for an application-specific JWT, creating a unified authentication context for the entire application, including the WebSocket server.

## 🏃‍♀️ Getting Started

To get a local copy up and running, follow these steps.

### **Prerequisites**

-   Node.js (v18.x or later)
-   npm or yarn
-   A running PostgreSQL database instance

### **Local Setup**

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/VatsalUmrania/collabide.git
    cd collabide
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in the root directory by copying the example:
    ```sh
    cp .env.example .env
    ```
    Now, open `.env` and fill in the required values (see the table in the previous response for details).

4.  **Sync the Database**
    This command uses Prisma to sync your schema with your PostgreSQL database.
    ```sh
    npx prisma db push
    ```

5.  **Run the Development Server**
    ```sh
    npm run dev
    ```
    The application will be live at `http://localhost:3000`.

## 🚀 Future Roadmap

This project has a lot of potential for expansion. Here are some features I'm considering for the future:

-   [ ] **Containerized Code Execution:** Move the code execution feature into isolated Docker containers for enhanced security and resource management.
-   [ ] **Unit & E2E Testing:** Implement a comprehensive testing suite with Jest, React Testing Library, and Playwright.
-   [ ] **Editor Themes:** Allow users to select from a variety of editor themes and persist their preferences.
-   [ ] **Git Integration:** Add basic Git functionality to clone a repository into a session.
-   [ ] **Terminal Integration:** Implement a fully interactive terminal within the session.

## License

This project is open-source and distributed under the **MIT License**. See the `LICENSE` file for more information.
