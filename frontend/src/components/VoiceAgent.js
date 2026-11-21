import React, { useState } from 'react';
import axios from 'axios';

const API = '/api';

function VoiceAgent() {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Click to start voice shopping');

  const handleConnect = async () => {
    if (connected) {
      setConnected(false);
      setStatus('Disconnected. Click to reconnect.');
      return;
    }

    try {
      setStatus('Connecting to VibeCart agent...');
      // Get Agora token from backend
      const res = await axios.post(`${API}/agora/token`, {
        channelName: `vibecart-${Date.now()}`,
        uid: 0,
      });

      if (res.data.success) {
        setConnected(true);
        setStatus('🎙️ Connected! Speak to shop...');
        console.log('Agora token:', res.data.token);
        // In production: use Agora RTC SDK to join channel with this token
        // and connect to the Conversational AI agent
      }
    } catch (err) {
      setStatus('Connection failed. Try again.');
      console.error('Connection error:', err);
    }
  };

  return (
    <div className="voice-agent">
      <div className={`agent-orb ${connected ? 'active' : ''}`} onClick={handleConnect}>
        <span className="orb-icon">{connected ? '🎙️' : '🔇'}</span>
      </div>
      <p className="agent-status">{status}</p>
      <p className="agent-hint">
        {connected
          ? 'Try: "Show me headphones under 5000 rupees"'
          : 'Start a voice conversation with VibeCart AI'}
      </p>
    </div>
  );
}

export default VoiceAgent;
