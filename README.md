📝 Todo Summary Assistant- https://todo-summariser.vercel.app/
Welcome to Todo Summary Assistant – your smart, AI-powered daily task manager! This full-stack web app makes managing todos simple, intelligent, and team-friendly. Whether you're working solo or with a team, this app helps you stay on top of your tasks and even generates summaries you can instantly share on Slack. Let’s dive in! 🚀

🔍 What is This App?
Todo Summary Assistant is more than a simple to-do list. It’s a smart task manager built with modern web technologies that not only helps you organize your day but also uses AI to summarize your pending tasks. These summaries can be shared with your team on Slack with just one click — perfect for daily standups or team updates!

✨ Features at a Glance
Here’s what you get out of the box:

✅ Add, complete, and delete tasks through a clean, intuitive UI

🧠 Generate AI-powered summaries of your pending tasks

📩 Send task summaries to Slack automatically via webhooks

🎯 Instant feedback for every action (success/failure)

📦 Full-stack architecture with separate client and server

🛠️ Built with React, Tailwind CSS, Node.js, Express, and Supabase

🧠 AI powered by Google Gemini API

💬 Team updates via Slack integration

🧱 Tech Stack
Layer	Tech
Frontend	React + Tailwind CSS
Backend	Node.js + Express
Database	Supabase (PostgreSQL)
AI	Google Gemini API
Communication	Slack Incoming Webhooks

🚦 How It Works
You add todos via the frontend.

The backend stores them securely in Supabase.

When you're ready, click a button to:

Fetch all pending tasks

Summarize them using Gemini AI

Instantly post the summary to your Slack channel

Yes, it's that smooth.

💻 Getting Started
✅ Prerequisites
Make sure you have:

Node.js v18+

A Supabase account (for your PostgreSQL database)

Access to Google Gemini API (via Google AI Studio)

A Slack workspace (where you can add webhooks)

🚀 Setup Guide
1. Clone the Project
bash
Copy
Edit
git clone https://github.com/yourusername/todo-summary-assistant.git
cd todo-summary-assistant
2. Backend Setup
bash
Copy
Edit
cd server
npm install  # or yarn
cp .env.example .env
Now update your .env file with:

SUPABASE_URL

SUPABASE_ANON_KEY

GEMINI_API_KEY

SLACK_WEBHOOK_URL

PORT (default: 3001)

🔧 Set up the Database in Supabase

Paste this into Supabase’s SQL Editor:

sql
Copy
Edit
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
Start the backend:

bash
Copy
Edit
npm start  # or yarn start
3. Frontend Setup
bash
Copy
Edit
cd client
npm install  # or yarn
cp .env.example .env
Update your .env with:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:3001/api
Start the frontend:

bash
Copy
Edit
npm run dev  # or yarn dev
Visit http://localhost:5173 in your browser — you're live!

🧪 Using the App
Add todos with the input field + button

Click a todo to mark it complete/incomplete

Delete any task you no longer need

Hit “Generate Summary & Send to Slack” to:

Let Gemini analyze your tasks

Send the summary directly to your Slack channel

📡 API Overview
All endpoints are prefixed with /api.

Method	Endpoint	Description
GET	/todos	Fetch all todos
POST	/todos	Add a new todo ({ title: "..." })
PUT	/todos/:id	Update a todo ({ completed: true/false })
DELETE	/todos/:id	Delete a todo
POST	/summarize	Trigger AI summary and Slack post

🚢 Deployment
🌐 Frontend
You can deploy it on Vercel or Netlify.

Vercel:

Framework: Vite

Build Command: npm run build

Output Directory: client/dist

Root Directory: client

Add env variable VITE_API_BACKEND_URL pointing to your backend URL

Netlify:

Same settings as Vercel

🔧 Backend
Platforms like Render, Fly.io, or Vercel serverless work great.

Render Setup:

Root Directory: server

Build Command: npm install

Start Command: npm start

Environment Variables: SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, SLACK_WEBHOOK_URL, PORT

Then, update your frontend’s VITE_API_BASE_URL to the live backend URL.

🤝 Contributing
We welcome contributions! Here’s how you can help:

💡 Found a bug? Open an issue.

🚀 Have a feature idea? Let’s discuss it first.

📦 Submitting code? Please follow our code style and keep things clean and well-documented.

🛡️ Security & Best Practices
API keys and credentials are managed through .env files — never hardcode them.

Don’t expose your secrets in public repos.

The app uses Row Level Security on Supabase for safe access control.

💬 Final Thoughts
Todo Summary Assistant helps you stay organized and communicate effortlessly with your team. Powered by cutting-edge tech and AI, it’s a smart productivity companion for individuals and teams alike.

Happy building and task managing! ✨
