# 📝 Todo Summary Assistant

Welcome to **Todo Summary Assistant** – your smart, AI-powered daily task manager! This full-stack web app makes managing todos simple, intelligent, and team-friendly. Whether you're working solo or with a team, this app helps you stay on top of your tasks and even generates summaries you can instantly share on Slack. Let’s dive in! 🚀
live- https://todo-summariser.vercel.app/

---

## 🔍 What is This App?

**Todo Summary Assistant** is more than a simple to-do list. It’s a smart task manager built with modern web technologies that helps you organize your day and uses AI to summarize pending tasks. These summaries can be shared with your team on Slack with just one click — perfect for daily standups or team updates!

---

## ✨ Features at a Glance

- ✅ Add, complete, and delete tasks through a clean, intuitive UI  
- 🧠 Generate AI-powered summaries of your pending tasks  
- 📩 Send task summaries to Slack automatically via webhooks  
- 🎯 Instant feedback for every action (success/failure)  
- 📦 Full-stack architecture with separate client and server  
- 🛠️ Built with React, Tailwind CSS, Node.js, Express, and Supabase  
- 🧠 AI powered by Google Gemini API  
- 💬 Team updates via Slack integration  

---

## 🧱 Tech Stack

| Layer         | Tech                          |
|---------------|-------------------------------|
| Frontend      | React + Tailwind CSS          |
| Backend       | Node.js + Express             |
| Database      | Supabase (PostgreSQL)         |
| AI            | Google Gemini API             |
| Communication | Slack Incoming Webhooks       |

---

## 🚦 How It Works

1. Add todos via the frontend.
2. Backend stores them securely in Supabase.
3. Click a button to:
   - Fetch all pending tasks
   - Summarize them using Gemini AI
   - Instantly post the summary to your Slack channel

Yes, it's that smooth.

---

## 💻 Getting Started

### ✅ Prerequisites

Make sure you have:

- Node.js v18+
- A Supabase account
- Access to Google Gemini API (via Google AI Studio)
- A Slack workspace with webhooks enabled

---

## 🚀 Setup Guide

### 1. Clone the Project

```bash
git clone https://github.com/yourusername/todo-summary-assistant.git
cd todo-summary-assistant
```

### 2. Backend Setup

```bash
cd server
npm install  # or yarn
cp .env.example .env
```

Update `.env` with:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
GEMINI_API_KEY=
SLACK_WEBHOOK_URL=
PORT=3001
```

**Create Supabase Table:**

Paste the following into Supabase’s SQL Editor:

```sql
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable public read access" ON todos FOR SELECT USING (true);
CREATE POLICY "Enable public insert access" ON todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable public update access" ON todos FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable public delete access" ON todos FOR DELETE USING (true);
```

Start the backend:

```bash
npm start  # or yarn start
```

### 3. Frontend Setup

```bash
cd client
npm install  # or yarn
cp .env.example .env
```

Update `.env`:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

Start the frontend:

```bash
npm run dev  # or yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Using the App

- Add todos via input field
- Click to toggle completion
- Delete tasks as needed
- Hit **“Generate Summary & Send to Slack”** to:
  - Use Gemini AI to generate summary
  - Post it directly to your Slack channel

---

## 📡 API Overview

All API endpoints are prefixed with `/api`.

| Method | Endpoint        | Description                              |
|--------|------------------|------------------------------------------|
| GET    | `/todos`        | Fetch all todos                          |
| POST   | `/todos`        | Add a new todo (`{ title: "..." }`)      |
| PUT    | `/todos/:id`    | Update a todo (`{ completed: true/false }`) |
| DELETE | `/todos/:id`    | Delete a todo                            |
| POST   | `/summarize`    | Trigger AI summary and Slack post        |

---

## 🚢 Deployment

### 🌐 Frontend

**Vercel / Netlify Settings:**

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `client/dist`
- Root Directory: `client`
- Add `VITE_API_BASE_URL` env variable pointing to backend URL

### 🔧 Backend

Deploy on Render, Fly.io, or similar.

**Render Settings:**

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:  
  `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `SLACK_WEBHOOK_URL`, `PORT`

Update frontend's `VITE_API_BASE_URL` to match backend URL.

---

## 🤝 Contributing

We welcome contributions!

- 💡 Found a bug? Open an issue.  
- 🚀 Have a feature idea? Let’s discuss it first.  
- 📦 Submitting code? Follow code style and keep it well-documented.

---

## 🛡️ Security & Best Practices

- Use `.env` files for API keys and credentials
- Never hardcode secrets or expose them in public repos
- Supabase uses Row Level Security for safe access control

---

## 💬 Final Thoughts

**Todo Summary Assistant** helps you stay organized and communicate effortlessly with your team. Powered by cutting-edge tech and AI, it’s a smart productivity companion for individuals and teams alike.

**Happy building and task managing!** ✨
