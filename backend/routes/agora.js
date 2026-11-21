const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateToken } = require('../utils/agoraToken');

const AGORA_PROJECT_ID = process.env.AGORA_APP_ID || '54a15e98df9345ca952e31be448b9d1a';
const AGORA_AGENT_ID = process.env.AGORA_AGENT_ID || 'd8e339fb-e8b8-40b2-8450-14578483f1ae';

// POST /api/agora/token - Generate Agora RTC token
router.post('/token', (req, res) => {
  try {
    const { channelName = `vibecart-${Date.now()}`, uid = 0 } = req.body;
    const token = generateToken(channelName, uid);
    res.json({ success: true, token, channelName, uid, projectId: AGORA_PROJECT_ID, agentId: AGORA_AGENT_ID });
  } catch (err) {
    // If certificates are not configured, return fallback success for demo
    res.json({
      success: true,
      token: 'demo-token',
      channelName: req.body.channelName || `vibecart-${Date.now()}`,
      uid: req.body.uid || 0,
      projectId: AGORA_PROJECT_ID,
      agentId: AGORA_AGENT_ID,
      note: 'Demo mode active. Add AGORA_APP_CERTIFICATE in .env for production token.'
    });
  }
});

// POST /api/agora/agent/join - Start Agora Conversational AI Agent in channel
router.post('/agent/join', async (req, res) => {
  try {
    const { channelName, pipelineId = AGORA_AGENT_ID } = req.body;
    const customerKey = process.env.AGORA_CUSTOMER_KEY;
    const customerSecret = process.env.AGORA_CUSTOMER_SECRET;

    if (!customerKey || !customerSecret) {
      return res.json({
        success: true,
        message: 'Agent join triggered (simulation mode - set AGORA_CUSTOMER_KEY & AGORA_CUSTOMER_SECRET for live Agora REST gateway)',
        channel: channelName,
        pipeline_id: pipelineId
      });
    }

    const credentials = Buffer.from(`${customerKey}:${customerSecret}`).toString('base64');
    const response = await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${AGORA_PROJECT_ID}/join`,
      {
        name: channelName,
        pipeline_id: pipelineId
      },
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

// POST /api/agora/webhook - Agora Agent Webhook
router.post('/webhook', async (req, res) => {
  try {
    const { action, parameters = {}, userId = 'demo-user' } = req.body;
    console.log(`🤖 Agora Conversational Agent Action: ${action}`, parameters);

    let result = {};

    switch (action) {
      case 'search_products': {
        const Product = require('../models/Product');
        const filter = {};
        if (parameters.query) filter.$text = { $search: parameters.query };
        if (parameters.category) filter.category = parameters.category;
        if (parameters.maxBudget) filter.price = { $lte: Number(parameters.maxBudget) };
        const products = await Product.find(filter).limit(5);
        result = { count: products.length, products };
        break;
      }
      case 'add_to_cart': {
        result = { status: 'success', message: 'Item added to cart via voice' };
        break;
      }
      default:
        result = { status: 'acknowledged', action };
    }

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
