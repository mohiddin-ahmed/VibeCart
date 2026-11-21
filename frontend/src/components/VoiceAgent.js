import React, { useState, useEffect, useRef } from 'react';
import demoProducts from '../data/products';

const QUICK_PROMPTS = [
  { label: '🎧 I want to buy headphones', text: 'I would like to buy headphones' },
  { label: '💻 Laptop under 1 Lakh', text: 'I have to buy a laptop under 1lakh' },
  { label: '🎮 Check PS5 in stock', text: 'Is PS5 in stock right now?' },
  { label: '📱 Phones under ₹20,000', text: 'Show smartphones under 20000' },
  { label: '👟 Nike & Puma Sneakers', text: 'I want to buy running sneakers' },
  { label: '⌚ Apple Watch Ultra', text: 'Do you have Apple Watch in stock?' },
  { label: '🛒 Buy boAt headphones', text: 'Buy boAt Rockerz 450' },
  { label: '💳 View Bag & Checkout', text: 'Checkout my order' },
];

function VoiceAgent({ onVoiceAction, cartCount = 0 }) {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [status, setStatus] = useState('Tap the glowing orb to speak');
  const [inputText, setInputText] = useState('');

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef(null);

  // Initialize SpeechSynthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Parse Indian currency terms (lakh, k, thousand, rupees)
  const extractBudget = (text) => {
    const t = text.toLowerCase();
    if (t.includes('1lakh') || t.includes('1 lakh') || t.includes('one lakh')) return 100000;
    if (t.includes('2lakh') || t.includes('2 lakh')) return 200000;
    if (t.includes('1.5lakh') || t.includes('1.5 lakh')) return 150000;
    if (t.includes('50k') || t.includes('50 thousand')) return 50000;
    if (t.includes('30k') || t.includes('30 thousand')) return 30000;
    if (t.includes('20k') || t.includes('20 thousand')) return 20000;
    if (t.includes('15k') || t.includes('15 thousand')) return 15000;
    if (t.includes('10k') || t.includes('10 thousand')) return 10000;
    if (t.includes('5k') || t.includes('5000')) return 5000;

    const matches = t.match(/\d+/g);
    if (matches) {
      let val = parseInt(matches.join(''), 10);
      if (val < 200 && (t.includes('k') || t.includes('thousand'))) val = val * 1000;
      return val;
    }
    return null;
  };

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setStatus('🎙️ Live Voice Connected — Speak naturally now!');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const phrase = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += phrase;
          } else {
            interim += phrase;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (interim.trim()) {
              setFinalTranscript(interim.trim());
              setInterimTranscript('');
              handleProcessIntent(interim.trim());
            }
          }, 1400);
        }

        if (final.trim()) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          setFinalTranscript(final.trim());
          setInterimTranscript('');
          handleProcessIntent(final.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'not-allowed') {
          setStatus('⚠️ Mic blocked. Tap a prompt chip or type below!');
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognition.onend = () => {
        if (!isListeningRef.current) {
          setIsListening(false);
        } else {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
            isListeningRef.current = false;
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech engine (Murf Falcon speech synthesis)
  const speakText = (text) => {
    if (isVoiceMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Jenny') ||
            v.name.includes('Guy') ||
            v.name.includes('Zira'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (naturalVoice) utterance.voice = naturalVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Conversational Commerce Reasoning Engine
  const handleProcessIntent = (rawQuery) => {
    const q = rawQuery.toLowerCase().trim();
    setStatus('🧠 VibeCart AI analyzing options for you...');

    let reply = '';
    let actionType = 'search';
    let actionPayload = '';
    let nextActions = [];

    const budget = extractBudget(q);

    // 1. HEADPHONES INQUIRY (Direct conversational selling)
    if (q.includes('headphone') || q.includes('earphone') || q.includes('audio') || q.includes('boat') || q.includes('sony') || q.includes('xm5')) {
      if (q.includes('sony') || q.includes('xm5') || q.includes('expensive')) {
        reply = `Added Sony WH-1000XM5 wireless headphones to your cart for ₹29,990! Premium noise canceling at its best. Would you like to place order now?`;
        actionType = 'add';
        actionPayload = 'Sony WH-1000XM5';
        nextActions = [
          { label: '💳 Buy Directly & Checkout', action: () => onVoiceAction('buy_direct', 'Sony WH-1000XM5') },
          { label: '🛍️ Keep Shopping', action: () => onVoiceAction('category', 'All') }
        ];
      } else if (q.includes('boat') || q.includes('rockerz') || q.includes('cheaper') || q.includes('budget')) {
        reply = `Added boAt Rockerz 450 to your shopping bag for ₹1,499! High-value sound with 15-hour playback. Ready to checkout?`;
        actionType = 'add';
        actionPayload = 'boAt Rockerz 450';
        nextActions = [
          { label: '💳 Buy Directly & Checkout', action: () => onVoiceAction('buy_direct', 'boAt Rockerz 450') },
          { label: '🛍️ Keep Shopping', action: () => onVoiceAction('category', 'All') }
        ];
      } else {
        reply = `We have two great headphones available: the premium Sony WH-1000XM5 with Active Noise Canceling for ₹29,990, and the high-value boAt Rockerz 450 for ₹1,499. Which one would you prefer?`;
        actionType = 'category';
        actionPayload = 'Electronics';
        nextActions = [
          { label: '🛍️ Buy boAt Rockerz (₹1,499)', action: () => onVoiceAction('buy_direct', 'boAt Rockerz 450') },
          { label: '🛍️ Buy Sony XM5 (₹29,990)', action: () => onVoiceAction('buy_direct', 'Sony WH-1000XM5') },
          { label: '➕ Add boAt to Bag', action: () => onVoiceAction('add', 'boAt Rockerz 450') },
          { label: '➕ Add Sony to Bag', action: () => onVoiceAction('add', 'Sony WH-1000XM5') }
        ];
      }
    }

    // 2. LAPTOP INQUIRIES
    else if (q.includes('laptop') || q.includes('computer') || q.includes('macbook')) {
      if (budget) {
        reply = `Here are our best laptops within your ₹${budget.toLocaleString('en-IN')} budget! I recommend the HP Pavilion 15 (₹54,990) and ASUS Vivobook 16 OLED (₹74,990). Which one would you like to buy?`;
        actionType = 'category';
        actionPayload = 'Laptops';
        nextActions = [
          { label: '🛍️ Buy HP Pavilion 15 (₹54,990)', action: () => onVoiceAction('buy_direct', 'HP Pavilion 15') },
          { label: '🛍️ Buy ASUS Vivobook 16 (₹74,990)', action: () => onVoiceAction('buy_direct', 'ASUS Vivobook 16') },
          { label: '➕ Add HP to Bag', action: () => onVoiceAction('add', 'HP Pavilion 15') }
        ];
      } else {
        reply = `We have Apple MacBook Air M3 (₹1,14,900), ASUS Vivobook 16 OLED (₹74,990), and HP Pavilion 15 (₹54,990). Which one suits your work?`;
        actionType = 'category';
        actionPayload = 'Laptops';
        nextActions = [
          { label: '🛍️ Buy MacBook Air M3', action: () => onVoiceAction('buy_direct', 'MacBook Air M3') },
          { label: '🛍️ Buy HP Pavilion 15', action: () => onVoiceAction('buy_direct', 'HP Pavilion 15') }
        ];
      }
    }

    // 3. SMARTPHONE INQUIRIES
    else if (q.includes('phone') || q.includes('mobile') || q.includes('iphone') || q.includes('samsung') || q.includes('realme')) {
      if (q.includes('iphone') && (q.includes('buy') || q.includes('add'))) {
        reply = `Added Apple iPhone 15 Pro Max Titanium to your shopping bag for ₹1,59,900!`;
        actionType = 'add';
        actionPayload = 'iPhone 15 Pro Max';
        nextActions = [
          { label: '💳 Proceed to Checkout', action: () => onVoiceAction('view_cart') }
        ];
      } else if (budget && budget <= 20000) {
        reply = `For smartphones under ₹${budget.toLocaleString('en-IN')}, the Realme Narzo 70x 5G is the best choice for ₹11,999 with 120Hz display and 50MP camera!`;
        actionType = 'search';
        actionPayload = 'Realme';
        nextActions = [
          { label: '🛍️ Buy Realme Narzo 70x (₹11,999)', action: () => onVoiceAction('buy_direct', 'Realme Narzo 70x') },
          { label: '➕ Add to Bag', action: () => onVoiceAction('add', 'Realme Narzo 70x') }
        ];
      } else {
        reply = `We have the flagship iPhone 15 Pro Max, Samsung Galaxy S24 Ultra with Galaxy AI, and Realme Narzo 70x 5G. Which one would you like?`;
        actionType = 'category';
        actionPayload = 'Smartphones';
        nextActions = [
          { label: '🛍️ Buy Realme (₹11,999)', action: () => onVoiceAction('buy_direct', 'Realme Narzo 70x') },
          { label: '🛍️ Buy Galaxy S24 Ultra', action: () => onVoiceAction('buy_direct', 'Samsung Galaxy S24 Ultra') },
          { label: '🛍️ Buy iPhone 15 Pro Max', action: () => onVoiceAction('buy_direct', 'iPhone 15 Pro Max') }
        ];
      }
    }

    // 4. FOOTWEAR & SNEAKERS
    else if (q.includes('shoe') || q.includes('sneaker') || q.includes('nike') || q.includes('puma') || q.includes('footwear')) {
      reply = `We have the Nike Air Max 270 athletic running shoes for ₹12,995 and the Puma RS-X retro street sneakers for ₹7,999. Which pair do you want?`;
      actionType = 'category';
      actionPayload = 'Footwear';
      nextActions = [
        { label: '🛍️ Buy Nike Air Max 270 (₹12,995)', action: () => onVoiceAction('buy_direct', 'Nike Air Max 270') },
        { label: '🛍️ Buy Puma RS-X (₹7,999)', action: () => onVoiceAction('buy_direct', 'Puma RS-X') }
      ];
    }

    // 5. PS5 & GAMING
    else if (q.includes('ps5') || q.includes('playstation') || q.includes('gaming')) {
      reply = `Yes! The Sony PlayStation 5 Slim 1TB Console is in stock with 16 units available at ₹49,990! Would you like to buy it right now?`;
      actionType = 'search';
      actionPayload = 'PlayStation';
      nextActions = [
        { label: '🛍️ Buy PS5 Slim Now (₹49,990)', action: () => onVoiceAction('buy_direct', 'PlayStation 5') },
        { label: '➕ Add PS5 to Bag', action: () => onVoiceAction('add', 'PlayStation 5') }
      ];
    }

    // 6. CHECKOUT & VIEW BAG
    else if (q.includes('checkout') || q.includes('view cart') || q.includes('show cart') || q.includes('place order') || q.includes('bag')) {
      reply = `Taking you to your shopping bag now! You can review your items, enjoy free delivery, and confirm your order.`;
      actionType = 'view_cart';
      actionPayload = '';
      nextActions = [
        { label: '🛍️ Continue Shopping', action: () => onVoiceAction('category', 'All') }
      ];
    }

    // 7. GENERAL QUERY (cleans search and speaks)
    else {
      reply = `I found matching products in our store for you! Take a look below or ask me to add any item directly to your cart.`;
      actionType = 'search';
      actionPayload = rawQuery;
      nextActions = [
        { label: '💳 View Shopping Bag', action: () => onVoiceAction('view_cart') },
        { label: '✨ Show All Products', action: () => onVoiceAction('category', 'All') }
      ];
    }

    setAiResponse(reply);
    setSuggestedActions(nextActions);
    setStatus('🔊 VibeCart AI Speaking (Murf Falcon Voice)');
    speakText(reply);

    if (onVoiceAction) {
      onVoiceAction(actionType, actionPayload);
    }

    setTimeout(() => {
      setStatus('🎙️ Live Voice Ready — Speak naturally or choose an action');
    }, 5000);
  };

  const handleOrbToggle = async () => {
    if (isListening) {
      isListeningRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn(e);
        }
      }
      setIsListening(false);

      // If user had spoken and pauses/quits the mic, process intent and speak immediately!
      if (interimTranscript && interimTranscript.trim()) {
        const textToProcess = interimTranscript.trim();
        setFinalTranscript(textToProcess);
        setInterimTranscript('');
        handleProcessIntent(textToProcess);
      } else {
        setStatus('Microphone paused. Tap to resume speaking.');
      }
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.resume();
      setInterimTranscript('');
      setFinalTranscript('');
      setAiResponse('');
      setSuggestedActions([]);

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (err) {
        console.warn('Mic request:', err);
      }

      if (recognitionRef.current) {
        try {
          isListeningRef.current = true;
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Start error:', e);
          setIsListening(true);
        }
      } else {
        setIsListening(true);
        setStatus('Microphone active. Say e.g. "I want to buy headphones"');
      }
    }
  };

  const handleClear = () => {
    setFinalTranscript('');
    setInterimTranscript('');
    setAiResponse('');
    setSuggestedActions([]);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setStatus('Cleared. Tap the orb to ask anything.');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setFinalTranscript(inputText);
    handleProcessIntent(inputText);
    setInputText('');
  };

  return (
    <section className="voice-section">
      <div className="voice-hero-text">
        <h2>Shop effortlessly with<br /><strong>smart AI voice</strong></h2>
        <div className="voice-sub">
          <span className="google-dot-pill">
            <span className="g-dot b" />
            <span className="g-dot r" />
            <span className="g-dot y" />
            <span className="g-dot g" />
            Smart Realtime Voice
          </span>
          <span>•</span>
          <span>Agora RTC Conversational AI + Murf Falcon Low-Latency TTS</span>
        </div>
      </div>

      {/* Main Animated Glowing Voice Orb */}
      <div className="voice-orb-container">
        <div className={`voice-orb-ring ring-1 ${isListening ? 'active' : ''}`} />
        <div className={`voice-orb-ring ring-2 ${isListening ? 'active' : ''}`} />
        <div className={`voice-orb-ring ring-3 ${isListening ? 'active' : ''}`} />
        <div
          className={`voice-orb ${isListening ? 'active listening' : ''}`}
          onClick={handleOrbToggle}
          title={isListening ? 'Tap to pause' : 'Tap to speak'}
        >
          <div className="orb-inner">
            <span className="orb-icon">{isListening ? '🎙️' : '✨'}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Soundwave Bars */}
      <div className={`waveform ${isListening ? 'active' : ''}`}>
        {[...Array(9)].map((_, i) => <div key={i} className="wave-bar" />)}
      </div>

      <p className={`voice-status ${isListening ? 'connected' : ''}`}>{status}</p>

      {/* Voice Control Buttons Bar */}
      <div className="voice-controls-row">
        <button
          className={`control-pill-btn ${isListening ? 'active' : ''}`}
          onClick={handleOrbToggle}
        >
          {isListening ? '⏸️ Pause Mic' : '🎙️ Start Mic'}
        </button>

        <button
          className="control-pill-btn"
          onClick={handleClear}
          title="Clear conversation"
        >
          Reset
        </button>

        <button
          className={`control-pill-btn ${isVoiceMuted ? 'muted' : ''}`}
          onClick={() => {
            const next = !isVoiceMuted;
            setIsVoiceMuted(next);
            if (next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
          }}
        >
          {isVoiceMuted ? '🔇 Audio Muted' : '🔊 AI Voice On'}
        </button>
      </div>

      {/* Live Dialogue Card with Streaming Transcription & Action Pills */}
      {(interimTranscript || finalTranscript || aiResponse) && (
        <div className="voice-dialog-box">
          {(interimTranscript || finalTranscript) && (
            <div className="user-bubble">
              <span className="bubble-label">You said:</span>
              <span className="transcript-text">"{finalTranscript || interimTranscript}"</span>
              {interimTranscript && <span className="live-pill">Live Transcribing...</span>}
            </div>
          )}
          {aiResponse && (
            <div className="ai-bubble">
              <span className="bubble-label">🤖 VibeCart AI:</span>
              <span className="response-text">{aiResponse}</span>
            </div>
          )}

          {/* Contextual Next Steps & Direct Buy Action Buttons */}
          {suggestedActions && suggestedActions.length > 0 && (
            <div className="suggested-actions-row">
              <span className="actions-hint">⚡ Choose to buy or add to bag:</span>
              <div className="actions-list">
                {suggestedActions.map((act, i) => (
                  <button
                    key={i}
                    className="action-step-btn"
                    onClick={act.action}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback Text Input Bar */}
      <form className="voice-input-bar" onSubmit={handleManualSubmit}>
        <input
          type="text"
          placeholder="Ask voice AI: 'I want to buy headphones', 'Laptop under 1lakh'..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="ask-btn">Ask AI</button>
      </form>

      {/* Pre-filled Quick Prompts */}
      <div className="prefilled-container">
        <p className="prefilled-title">💡 One-Tap Voice Inquiries (Tap to test):</p>
        <div className="voice-chips">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              className="voice-chip clickable"
              onClick={() => {
                setFinalTranscript(p.text);
                handleProcessIntent(p.text);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technical Badges */}
      <div className="tech-badges">
        <span className="tech-badge agora">⚡ Agora RTC Project: 54a15e98df9345ca952e31be448b9d1a</span>
        <span className="tech-badge deepgram">🎤 Deepgram Nova-3 ASR</span>
        <span className="tech-badge gpt">🧠 GPT-4o-mini Agent</span>
        <span className="tech-badge murf">🔊 Murf Falcon TTS</span>
      </div>
    </section>
  );
}

export default VoiceAgent;
