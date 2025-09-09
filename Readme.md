# 🎫 AI Ticket System  

An AI-powered ticket management platform that automatically analyses, classifies, and assigns support tickets to the right moderators or admins.  
Built with **Node.js**, **Express**, **MongoDB**, **Inngest**, and **Google Gemini** for AI analysis.


![AI Ticket System Screenshot](./client/public/Screenshot%202025-09-10%20021710.png)
![AI Ticket System Screenshot](./client/public/Screenshot%202025-09-10%20021557.png)

---

## 🚀 Live Demo  
**Web App:** [ai-ticket-system-client.vercel.app](https://ai-ticket-system-client.vercel.app/)  
 

---

## ✨ Features  

- **AI-Driven Ticket Analysis**  
  Uses Google Gemini (or your AI agent) to automatically evaluate tickets and extract:
  - Priority  
  - Helpful notes  
  - Related skills  

- **Smart Assignment**  
  - Assigns tickets to moderators matching the AI-detected skills  
  - Falls back to any moderator, then any admin, then a default email  

- **Automated Email Notifications**  
  - Sends an email to the assigned moderator when a new ticket is created  

- **Realtime Processing with Inngest**  
  - Serverless event functions handle ticket creation events  
  - Reliable retries and logging  

- **Clean Dashboard (Client App)**  
  - Users can create tickets  
  - Moderators can view and manage assigned tickets  

---

## 🛠️ Tech Stack  

- **Backend:** Node.js, Express, Inngest Functions  
- **Database:** MongoDB + Mongoose  
- **Auth:** (if you use Clerk or similar, mention here)  
- **AI:** Google Gemini / custom AI Agent  
- **Email:** Nodemailer / custom mailSender  
- **Hosting:** Vercel for client, server deployed separately  
