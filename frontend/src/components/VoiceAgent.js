import React, { useState } from 'react';
import axios from 'axios';

const API = '/api';

function VoiceAgent() {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Tap to start voice shopping');

  const handleConnect = async () => {
    if (connected) {
      setConnected(false);
      setStatus('Disconnected. Tap to reconnect.');
      return;
    }

    try {
      setStatus('Connecting to VibeCart AI...');
      const res = await axios.post(`${API}/agora/token`, {
        channelName: `vibecart-${Date.now()}`,
        uid: 0,
      });

      if (res.data.success) {
        setConnected(true);
        setStatus('Listening... speak now');
        console.log('Agora token:', res.data.token);
      }
    } catch (err) {
      setStatus('Connection failed. Tap to retry.');
      console.error('Connection error:', err);
    }
  };

  return (
    <section className="voice-section">
      <div className="voice-hero-text">
        <h2>Shop effortlessly with <strong>smart AI</strong></h2>
      </div>

      <div className="voice-orb-container">
        <div className="voice-orb-rings" />
        <div className={`voice-orb ${connected ? 'active' : ''}`} onClick={handleConnect}>
          <span className="orb-icon">{connected ? '🎙️' : '🎧'}</span>
        </div>
      </div>

      <div className={`waveform ${connected ? 'active' : ''}`}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="wave-bar" />
        ))}
      </div>

      <p className={`voice-status ${connected ? 'connected' : ''}`}>{status}</p>
      <span className="voice-hint">
        {connected ? '💬 "Show me headphones under ₹5000"' : '🎧 Start talking to shop with AI'}
      </span>
    </section>
  );
}

export default VoiceAgent;
