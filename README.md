📑 Transcript Project

A web-based project for generating, editing, and sharing meeting transcripts seamlessly. It extracts content from uploaded files (DOCX, PDF), summarizes conversations, and allows users to share transcripts via email.

🚀 Features

📂 Upload transcripts in DOCX or PDF format

🤖 AI-powered summarization of meetings

✏️ Edit summaries before sharing

📧 Send transcripts via email directly from the app

🎨 Clean, responsive UI with TailwindCSS

🛠 Tech Stack
Frontend

⚛️ React.js – UI rendering

🎨 TailwindCSS – Styling and layout

📬 Axios / Fetch API – API communication

Backend

🌐 Next.js (App Router) – API routes and server-side logic

✉️ Nodemailer – Email functionality

📦 Mammoth.js – DOCX text extraction

📑 pdf2json – PDF content extraction

AI & Processing

🤖 LLM API (Gemini/OpenAI/Groq) – Transcript summarization

⚙️ Installation

Clone the repo and install dependencies:
```
git clone https://github.com/your-username/transcript-project.git
cd transcript-project
npm install
```
Run in development mode:
```
npm run dev
```

📧 Email Configuration

Create a .env.local file and add your mail credentials:
```
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password_or_app_key
EMAIL_SERVICE=gmail
```

📂 Project Structure
```
transcript-project/
│── app/                  # Next.js App Router files
│   ├── api/              # API routes (upload, summarize, send mail)
│   ├── model/            # AI model integration
│── components/           # Reusable UI components
│── public/               # Static assets
│── styles/               # Global styles
│── package.json          # Dependencies
```

🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.