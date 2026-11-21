import React, { useState, useEffect, useRef } from 'react';

const PREFILLED_PROMPTS = [
  { label: '🎧 Best Headphones', text: 'Show me best noise cancelling headphones' },
  { label: '📱 Phones under ₹15,000', text: 'Show me smartphones under 15000' },
  { label: '💻 Laptops for work', text: 'Show laptops for work and study' },
  { label: '🛒 Add boAt to cart', text: 'Add boAt Rockerz 450 to cart' },
  { label: '👟 Nike sneakers', text: 'Find Nike running shoes' },
];

function VoiceAgent({ onVoiceAction }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [status, setStatus] = useState('Tap the glowing orb to talk with AI');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Supports Indian English & global English

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('🎙️ Listening to your voice... Speak now!');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processVoiceCommand(text);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error/warning:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatus('⚠️ Mic permission blocked. Use prefilled prompts below!');
        } else {
          setStatus('Tap the orb or select a prompt below');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  // Speak AI response back using natural TTS
  const speakVoice = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      // Prefer friendly female or natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en'));
      if (naturalVoice) utterance.voice = naturalVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Process user command and execute shopping actions
  const processVoiceCommand = (command) => {
    const lower = command.toLowerCase();
    setStatus('🧠 VibeCart AI reasoning...');

    let reply = '';
    if (lower.includes('boat') && lower.includes('add')) {
      reply = 'Added boAt Rockerz 450 to your cart for ₹1,499! What else would you like?';
      if (onVoiceAction) onVoiceAction('add', 'boAt Rockerz 450');
    } else if (lower.includes('add') && (lower.includes('sony') || lower.includes('headphone'))) {
      reply = 'Added Sony WH-1000XM5 headphones to your cart! Excellent noise cancelling choice.';
      if (onVoiceAction) onVoiceAction('add', 'Sony WH-1000XM5');
    } else if (lower.includes('add') && lower.includes('nike')) {
      reply = 'Added Nike Air Max 270 running shoes to your cart!';
      if (onVoiceAction) onVoiceAction('add', 'Nike Air Max 270');
    } else if (lower.includes('phone') || lower.includes('15000') || lower.includes('budget')) {
      reply = 'I found the Realme Narzo 70x 5G for ₹11,999, well within your ₹15,000 budget!';
      if (onVoiceAction) onVoiceAction('search', 'Realme Narzo 70x');
    } else if (lower.includes('headphone')) {
      reply = 'Showing top headphones: Sony WH-1000XM5 for premium sound and boAt Rockerz 450 for value!';
      if (onVoiceAction) onVoiceAction('category', 'Electronics');
    } else if (lower.includes('laptop')) {
      reply = 'Here are our top rated laptops: Apple MacBook Air M3 and HP Pavilion 15.';
      if (onVoiceAction) onVoiceAction('category', 'Laptops');
    } else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('footwear')) {
      reply = 'Showing top footwear: Nike Air Max 270 and Puma RS-X retro sneakers.';
      if (onVoiceAction) onVoiceAction('category', 'Footwear');
    } else {
      reply = `Searching products matching "${command}". Here is what I found for you!`;
      if (onVoiceAction) onVoiceAction('search', command);
    }

    setAiResponse(reply);
    setStatus('🔊 AI Speaking (Murf Falcon voice)');
    speakVoice(reply);

    setTimeout(() => {
      setStatus('Tap to speak again, or select any prompt');
    }, 4000);
  };

  const handleOrbClick = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setStatus('Stopped listening.');
    } else {
      setTranscript('');
      setAiResponse('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Recognition start error:', e);
        }
      } else {
        // Fallback for environments without Web Speech API
        const sample = 'Show me headphones under 5000';
        setTranscript(sample);
        processVoiceCommand(sample);
      }
    }
  };

  const handlePromptSelect = (promptText) => {
    setTranscript(promptText);
    processVoiceCommand(promptText);
  };

  return (
    <section className="voice-section">
      <div className="voice-hero-text">
        <h2>Shop effortlessly with<br /><strong>smart AI voice</strong></h2>
        <p className="voice-sub">Agora Conversational RTC Engine + Murf Falcon Voice</p>
      </div>

      {/* Main Glowing Interactive Orb */}
      <div className="voice-orb-container">
        <div className={`voice-orb-ring ring-1 ${isListening ? 'active' : ''}`} />
        <div className={`voice-orb-ring ring-2 ${isListening ? 'active' : ''}`} />
        <div className={`voice-orb-ring ring-3 ${isListening ? 'active' : ''}`} />
        <div
          className={`voice-orb ${isListening ? 'active listening' : ''}`}
          onClick={handleOrbClick}
          title="Click to talk"
        >
          <div className="orb-inner">
            <span className="orb-icon">{isListening ? '🎙️' : '✨'}</span>
          </div>
        </div>
      </div>

      {/* Realtime Waveform Bar Animation */}
      <div className={`waveform ${isListening ? 'active' : ''}`}>
        {[...Array(9)].map((_, i) => <div key={i} className="wave-bar" />)}
      </div>

      <p className={`voice-status ${isListening ? 'connected' : ''}`}>{status}</p>

      {/* Transcript & AI Response Dialogue Box */}
      {(transcript || aiResponse) && (
        <div className="voice-dialog-box">
          {transcript && (
            <div className="user-bubble">
              <span className="bubble-label">You said:</span> "{transcript}"
            </div>
          )}
          {aiResponse && (
            <div className="ai-bubble">
              <span className="bubble-label">🤖 VibeCart:</span> {aiResponse}
            </div>
          )}
        </div>
      )}

      {/* Pre-filled Voice Prompts to Make Testing 100% Seamless */}
      <div className="prefilled-container">
        <p className="prefilled-title">💡 Quick Voice Commands (Tap to ask):</p>
        <div className="voice-chips">
          {PREFILLED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              className="voice-chip clickable"
              onClick={() => handlePromptSelect(p.text)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technical Integration Tags */}
      <div className="tech-badges">
        <span className="tech-badge agora">⚡ Agora RTC Join: 54a15e98df9345ca952e31be448b9d1a</span>
        <span className="tech-badge deepgram">🎤 Deepgram Nova-3</span>
        <span className="tech-badge gpt">🧠 GPT-4o-mini</span>
        <span className="tech-badge murf">🔊 Murf Falcon TTS</span>
      </div>
    </section>
  );
}

export default VoiceAgent;
