# VibeCart Setup Guide

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Agora Account with Conversational AI enabled

## Step 1: Agora Console Setup

1. Go to [console.agora.io](https://console.agora.io)
2. Create/select project → copy **App ID** and **App Certificate**
3. Navigate to **Agents** → Create new agent
4. Configure:
   - **Name**: VibeCart Shopping Agent
   - **ASR**: Deepgram Nova-3
   - **LLM**: OpenAI GPT-4o-mini
   - **TTS**: Minimax speech-2.8-turbo (Voice: English Radiant Girl)
5. Set the system prompt (see README)
6. Under **Actions**, add webhook URL: `https://your-server.com/api/agora/webhook`

## Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in root:
```env
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_certificate
OPENAI_API_KEY=your_openai_key
MONGODB_URI=mongodb://localhost:27017/vibecart
JWT_SECRET=your_secret
PORT=5000
```

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm start
```

## Step 3: Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## Step 4: Connect Agora Agent to Backend

In Agora Console → Actions tab:
- Add webhook URL: `http://your-deployed-server/api/agora/webhook`
- Configure actions: `search_products`, `check_availability`, `add_to_cart`, `view_cart`

## Step 5: Test

1. Click **Test** in Agora Console
2. Speak: "Show me headphones under 5000 rupees"
3. Verify the agent responds with product recommendations
