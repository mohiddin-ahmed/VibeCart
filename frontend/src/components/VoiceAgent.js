import React, { useState } from 'react';

function VoiceAgent() {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Tap the orb to start voice shopping');

  const handleConnect = () => {
    if (connected) {
      setConnected(false);
      setStatus('Disconnected. Tap to reconnect.');
      return;
    }
    setStatus('Connecting to Agora AI Agent...');
    setTimeout(() => {
      setConnected(true);
      setStatus('🎙️ Listening... speak now');
    }, 1200);
  };

  return (
    <section className="voice-section">
      <div className="voice-hero-text">
        <h2>Shop effortlessly with<br /><strong>smart AI voice</strong></h2>
        <p className="voice-sub">Powered by Agora Conversational AI + Murf Falcon TTS</p>
      </div>

      <div className="voice-orb-container">
        <div className={`voice-orb-ring ring-1 ${connected ? 'active' : ''}`} />
        <div className={`voice-orb-ring ring-2 ${connected ? 'active' : ''}`} />
        <div className={`voice-orb-ring ring-3 ${connected ? 'active' : ''}`} />
        <div className={`voice-orb ${connected ? 'active' : ''}`} onClick={handleConnect}>
          <div className="orb-inner">
            <span className="orb-icon">{connected ? '🎙️' : '🎧'}</span>
          </div>
        </div>
      </div>

      <div className={`waveform ${connected ? 'active' : ''}`}>
        {[...Array(9)].map((_, i) => <div key={i} className="wave-bar" />)}
      </div>

      <p className={`voice-status ${connected ? 'connected' : ''}`}>{status}</p>

      <div className="voice-chips">
        <span className="voice-chip">💬 "Show me phones under ₹15000"</span>
        <span className="voice-chip">💬 "Compare headphones"</span>
        <span className="voice-chip">💬 "Add Nike shoes to cart"</span>
      </div>

      <div className="tech-badges">
        <span className="tech-badge agora">⚡ Agora RTC</span>
        <span className="tech-badge deepgram">🎤 Deepgram STT</span>
        <span className="tech-badge gpt">🧠 GPT-4o</span>
        <span className="tech-badge murf">🔊 Murf TTS</span>
      </div>
    </section>
  );
}

export default VoiceAgent;
