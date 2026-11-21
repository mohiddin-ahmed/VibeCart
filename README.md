# VibeCart — AI Voice Shopping Assistant 🛒🎙️

> **AI Accelerator Hub: A Personalized AI Solution | KNOTiC Hackathon Round 3**
> Built with **Agora Conversational AI Agent**, **Murf Falcon TTS**, and **Agentic Tool Calling Workflows**.

---

## 🏆 Project Submission Overview

| Requirement | Details |
|---|---|
| **Project Name** | **VibeCart — Conversational Voice Commerce Agent** |
| **Problem Statement** | *Personalized Conversational Shopping & Voice Commerce Accessibility*: E-commerce search suffers from choice paralysis, tedious filter clicking, and accessibility barriers. Shoppers need a natural, real-time voice shopping guide that understands intent, constraints, budget, and executes purchases autonomously. |
| **GitHub Repository** | [https://github.com/mohiddin-ahmed/VibeCart](https://github.com/mohiddin-ahmed/VibeCart) |
| **Demo / Live Link** | [https://vibecart.vercel.app](https://github.com/mohiddin-ahmed/VibeCart) / Agora Agent Studio Live Preview |
| **Voice Infrastructure** | **Agora Conversational AI Engine** (Sub-second RTC audio stream, bidirectional voice) |
| **Speech-to-Text (ASR)** | **Deepgram Nova-3** (High-accuracy multilingual transcription) |
| **LLM Agent Brain** | **OpenAI GPT-4o-mini** (Context-aware shopping orchestrator) |
| **Voice Synthesis (TTS)** | **Murf AI Falcon TTS / Minimax** (Ultra-low latency, expressive, natural voice output) |
| **Agentic Actions** | Tool-calling workflows for search, catalog comparison, inventory check, and cart checkout |

---

## 🚀 Key Technical Highlights & Integrations

### 1. Agora Conversational AI Integration
- Uses **Agora RTC Audio Channels** for ultra-low latency (<300ms) full-duplex human-to-agent communication.
- Agora Agent Studio orchestrates speech capture, turn detection, interruption handling, and dynamic audio streaming back to the client.
- Dynamic RTC token generator implemented in Node.js backend using `agora-access-token`.

### 2. Murf AI Falcon TTS Integration
- Configured as the high-fidelity speech generation voice synthesis engine.
- Falcon TTS generates ultra-low latency conversational streaming responses, ensuring the AI shopper sounds human, empathetic, and engaging.
- Custom speech parameters tuned for clarity in noisy environments and bilingual support (English & Hindi).

### 3. Agentic Workflows & Tool Actions
The agent is not just a chatbot—it is an **agentic shopping assistant** that invokes backend functional tools:
1. `search_products(query, category, maxBudget)`: Retrieves live matching items ranked by semantic similarity and price.
2. `check_availability(productId)`: Validates real-time inventory counts before suggesting an item.
3. `compare_products(productIds)`: Compares specs, ratings, and value-for-money tradeoffs.
4. `add_to_cart(userId, productId, quantity)`: Modifies the user's active shopping session.
5. `checkout(userId)`: Verifies stock deduction and generates order confirmation.

```
Shopper Voice ➔ Agora RTC ➔ Deepgram ASR ➔ Agent Brain (GPT-4o) ➔ Tool Actions (API)
                                                                           ↓
Shopper Audio  Agora RTC  Murf Falcon TTS  Decision & Voice Response 
```

---

## 📱 User Experience & UI/UX Features
- **Modern Dark Glassmorphism**: Clean visual hierarchy inspired by top consumer apps.
- **Interactive Voice Orb**: Real-time breathing and audio wave visualization responding to microphone states.
- **Dynamic Category & Search Filters**: Instant responsive catalog view across Electronics, Smartphones, Laptops, Footwear, and Apparel.
- **Live Cart & Order Summary**: Real-time state tracking with one-click checkout.
- **Mobile First Design**: Fully responsive across mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack Architecture

- **Frontend**: React 18, Glassmorphic CSS3, Responsive Grid, Agora Web SDK
- **Backend API**: Node.js, Express, RESTful tool endpoints
- **Database**: MongoDB with Mongoose Schema & Full-text search index
- **Deployment**: Vercel Multi-Service project configuration (`vercel.json`)

---

## ⚙️ Running Locally

```bash
# 1. Clone repository
git clone https://github.com/mohiddin-ahmed/VibeCart.git
cd VibeCart

# 2. Setup Backend
cd backend
npm install
node utils/seed.js # seeds sample catalog
npm start

# 3. Setup Frontend (in separate terminal)
cd ../frontend
npm install
npm start
```

---

## 📄 License
MIT © 2026 Mohiddin Ahmed
