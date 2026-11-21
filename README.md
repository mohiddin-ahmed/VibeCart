# VibeCart - AI Voice Shopping Assistant 🛒🎙️

An intelligent voice-powered shopping assistant built with **Agora Conversational AI**, enabling customers to discover, compare, and purchase products through natural voice conversations.

## 🏗️ Architecture

```
Customer (Voice) → Agora RTC → ASR (Deepgram Nova-3) → LLM (GPT-4o-mini) → TTS (Minimax) → Voice Response
                                                              ↕
                                                     VibeCart Backend API
                                                    (Products, Cart, Orders)
```

## 🚀 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Voice Platform** | Agora Conversational AI Agent Studio |
| **ASR (Speech-to-Text)** | Deepgram Nova-3 |
| **LLM (AI Brain)** | OpenAI GPT-4o-mini |
| **TTS (Text-to-Speech)** | Minimax speech-2.8-turbo |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Frontend** | React.js |
| **Auth** | JWT + Agora Token |

## 📁 Project Structure

```
Agora/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Product.js         # Product schema
│   │   ├── Cart.js            # Cart schema
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── products.js        # Product search & listing APIs
│   │   ├── cart.js            # Cart management APIs
│   │   └── agora.js           # Agora token & webhook APIs
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── utils/
│       └── agoraToken.js      # Agora RTC token generator
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   ├── VoiceAgent.js  # Voice agent component
│       │   ├── ProductCard.js # Product display
│       │   └── CartView.js    # Cart display
│       ├── pages/
│       │   └── Home.js        # Main page
│       └── styles/
│           └── App.css
├── docs/
│   └── SETUP.md               # Setup instructions
├── .env.example
├── .gitignore
└── README.md
```

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/vibecart.git
cd vibecart

# Backend
cd backend
npm install
cp ../.env.example .env   # Fill in your keys
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### 2. Configure Environment

Copy `.env.example` to `backend/.env` and fill in:

```env
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
OPENAI_API_KEY=your_openai_key
MONGODB_URI=mongodb://localhost:27017/vibecart
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Configure Agora Agent

1. Go to [Agora Console](https://console.agora.io)
2. Open **Agents** → Select **VibeCart Baby Agent**
3. Models tab: ASR=Deepgram Nova-3, LLM=GPT-4o-mini, TTS=Minimax
4. Actions tab: Connect backend API endpoints
5. Test → Publish

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/search?q=` | Search products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/cart/add` | Add item to cart |
| GET | `/api/cart/:userId` | View cart |
| DELETE | `/api/cart/remove/:itemId` | Remove from cart |
| POST | `/api/cart/checkout` | Checkout |
| POST | `/api/agora/token` | Generate Agora RTC token |
| POST | `/api/agora/webhook` | Agora agent webhook |

## 🎯 Features

- 🎙️ **Voice-first shopping** — browse and buy using natural speech
- 🔍 **Smart product search** — AI understands intent and finds matching products
- 💰 **Budget-aware** — respects customer's budget constraints
- 🛒 **Cart management** — add, remove, and checkout via voice
- 🌐 **Multilingual** — supports English and Hindi
- ⚡ **Real-time** — powered by Agora's low-latency RTC infrastructure

## 📄 License

MIT License
