import React, { useState, useEffect, useRef } from 'react';
import demoProducts from '../data/products';

const QUICK_PROMPTS = [
  { label: '💻 Laptop under 1 Lakh', text: 'I have to buy a laptop under 1lakh' },
  { label: '🎧 Sony vs boAt Headphones', text: 'Compare Sony and boAt headphones' },
  { label: '🎮 Check PS5 Availability', text: 'Is PS5 in stock right now?' },
  { label: '📱 Phones under ₹20,000', text: 'Show smartphones under 20000' },
  { label: '👟 Nike & Puma Sneakers', text: 'Show athletic running sneakers' },
  { label: '⌚ Apple Watch Ultra', text: 'Do you have Apple Watch in stock?' },
  { label: '🛒 Add boAt to cart', text: 'Add boAt Rockerz 450 to my cart' },
  { label: '💳 View Cart & Checkout', text: 'Show my cart and checkout' },
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
        }

        if (final.trim()) {
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

  // Text-To-Speech engine (Murf Falcon speech playback)
  const speakText = (text) => {
    if (isVoiceMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.lang.startsWith('en')
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    window.speechSynthesis.speak(utterance);
  };

  // AI Shopping Conversational Brain
  const handleProcessIntent = (rawQuery) => {
    const q = rawQuery.toLowerCase().trim();
    setStatus('🧠 VibeCart AI analyzing catalog & pricing...');

    let reply = '';
    let actionType = 'search';
    let actionPayload = '';
    let nextActions = [];

    const budget = extractBudget(q);

    // 1. CHECKOUT & VIEW CART INTENTS
    if (q.includes('checkout') || q.includes('view cart') || q.includes('show cart') || q.includes('my cart') || q.includes('place order') || q.includes('bag')) {
      reply = `Taking you to your shopping bag! You can review your items, apply delivery discounts, and confirm your order.`;
      actionType = 'view_cart';
      actionPayload = '';
      nextActions = [
        { label: '🛍️ Continue Shopping', action: () => onVoiceAction('category', 'All') }
      ];
    }

    // 2. LAPTOP & COMPUTER INQUIRIES WITH BUDGET (e.g. "laptop under 1lakh")
    else if (q.includes('laptop') || q.includes('computer') || q.includes('macbook')) {
      if (budget) {
        const matchingLaptops = demoProducts.filter(
          (p) => p.category === 'Laptops' && p.price <= budget
        );

        if (matchingLaptops.length > 0) {
          const names = matchingLaptops.map((l) => `${l.name} for ₹${l.price.toLocaleString('en-IN')}`).join(' and ');
          reply = `Here are our best laptops within your ₹${budget.toLocaleString('en-IN')} budget! I found ${names}. You can say "Add HP Pavilion" or tap below.`;
          actionType = 'category';
          actionPayload = 'Laptops';
          nextActions = matchingLaptops.map(item => ({
            label: `+ Add ${item.brand} (₹${item.price.toLocaleString('en-IN')})`,
            action: () => onVoiceAction('add', item.name)
          }));
        } else {
          reply = `For laptops under ₹${budget.toLocaleString('en-IN')}, check out the HP Pavilion 15 (₹54,990) and ASUS Vivobook 16 OLED (₹74,990).`;
          actionType = 'category';
          actionPayload = 'Laptops';
          nextActions = [
            { label: '+ Add HP Pavilion 15', action: () => onVoiceAction('add', 'HP Pavilion 15') },
            { label: '+ Add ASUS Vivobook 16', action: () => onVoiceAction('add', 'ASUS Vivobook 16') }
          ];
        }
      } else {
        reply = `Here are our high-performance laptops: Apple MacBook Air M3, ASUS Vivobook 16 OLED, and HP Pavilion 15. Tap below to add to bag.`;
        actionType = 'category';
        actionPayload = 'Laptops';
        nextActions = [
          { label: '+ Add MacBook Air M3', action: () => onVoiceAction('add', 'MacBook Air M3') },
          { label: '+ Add HP Pavilion 15', action: () => onVoiceAction('add', 'HP Pavilion 15') }
        ];
      }
    }

    // 3. ADD TO CART INTENTS (Handles multi-item shopping!)
    else if (q.includes('add') || q.includes('buy') || q.includes('order')) {
      const target = demoProducts.find(
        (p) =>
          q.includes(p.name.toLowerCase()) ||
          q.includes(p.brand.toLowerCase()) ||
          (p.name.toLowerCase().includes('boat') && q.includes('boat')) ||
          (p.name.toLowerCase().includes('sony') && q.includes('sony')) ||
          (p.name.toLowerCase().includes('nike') && q.includes('nike')) ||
          (p.name.toLowerCase().includes('ps5') && q.includes('ps5')) ||
          (p.name.toLowerCase().includes('iphone') && q.includes('iphone')) ||
          (p.name.toLowerCase().includes('macbook') && q.includes('macbook')) ||
          (p.name.toLowerCase().includes('asus') && q.includes('asus')) ||
          (p.name.toLowerCase().includes('puma') && q.includes('puma')) ||
          (p.name.toLowerCase().includes('watch') && q.includes('watch')) ||
          (p.name.toLowerCase().includes('hp') && q.includes('hp'))
      );

      if (target) {
        reply = `Added ${target.name} to your shopping bag for ₹${target.price.toLocaleString('en-IN')}! You can keep talking to add more items, or say "Checkout" when ready.`;
        actionType = 'add';
        actionPayload = target.name;
        nextActions = [
          { label: '💳 Proceed to Checkout', action: () => onVoiceAction('view_cart') },
          { label: '🎧 Keep Shopping', action: () => onVoiceAction('category', 'All') }
        ];
      } else {
        reply = `I searched for "${rawQuery}". Here are matching products you can add to cart.`;
        actionType = 'search';
        actionPayload = q;
      }
    }

    // 4. AVAILABILITY & STOCK CHECKS
    else if (q.includes('available') || q.includes('in stock') || q.includes('have') || q.includes('is there')) {
      const target = demoProducts.find(
        (p) =>
          q.includes(p.name.toLowerCase()) ||
          q.includes(p.brand.toLowerCase()) ||
          q.includes(p.category.toLowerCase()) ||
          (q.includes('ps5') && p.name.includes('PlayStation')) ||
          (q.includes('playstation') && p.name.includes('PlayStation')) ||
          (q.includes('watch') && p.name.includes('Watch')) ||
          (q.includes('iphone') && p.name.includes('iPhone')) ||
          (q.includes('phone') && p.category === 'Smartphones') ||
          (q.includes('laptop') && p.category === 'Laptops') ||
          (q.includes('headphone') && p.category === 'Electronics')
      );

      if (target) {
        reply = `Yes! ${target.name} is in stock with ${target.stock} units available at ₹${target.price.toLocaleString('en-IN')}. Rated ${target.rating} stars!`;
        actionType = 'search';
        actionPayload = target.name;
        nextActions = [
          { label: `+ Add ${target.name} to Bag`, action: () => onVoiceAction('add', target.name) }
        ];
      } else {
        reply = `I checked our inventory. We have top electronics, smartphones, laptops, and footwear available right now!`;
        actionType = 'category';
        actionPayload = 'All';
      }
    }

    // 5. BUDGET GENERAL SEARCH (e.g. "phones under 20000")
    else if (budget) {
      if (q.includes('phone') || q.includes('mobile')) {
        reply = `For smartphones under ₹${budget.toLocaleString('en-IN')}, I recommend the Realme Narzo 70x 5G for ₹11,999 with 120Hz display and 50MP camera!`;
        actionType = 'search';
        actionPayload = 'Realme';
        nextActions = [
          { label: '+ Add Realme Narzo 70x', action: () => onVoiceAction('add', 'Realme Narzo 70x') }
        ];
      } else if (q.includes('headphone')) {
        reply = `For headphones under ₹${budget.toLocaleString('en-IN')}, boAt Rockerz 450 is ₹1,499 with 15-hour battery!`;
        actionType = 'search';
        actionPayload = 'boAt';
        nextActions = [
          { label: '+ Add boAt Rockerz 450', action: () => onVoiceAction('add', 'boAt Rockerz 450') }
        ];
      } else {
        const matches = demoProducts.filter((p) => p.price <= budget);
        reply = `Found ${matches.length} products within your ₹${budget.toLocaleString('en-IN')} budget!`;
        actionType = 'category';
        actionPayload = 'All';
      }
    }

    // 6. COMPARISON ("Compare Sony and boAt")
    else if (q.includes('compare') || q.includes('vs') || q.includes('difference')) {
      reply = `Comparing Sony WH-1000XM5 (₹29,990, 4.8★ with Active Noise Canceling) versus boAt Rockerz 450 (₹1,499, 4.2★ budget wireless). Both are in stock!`;
      actionType = 'category';
      actionPayload = 'Electronics';
      nextActions = [
        { label: '+ Add boAt (₹1,499)', action: () => onVoiceAction('add', 'boAt Rockerz 450') },
        { label: '+ Add Sony (₹29,990)', action: () => onVoiceAction('add', 'Sony WH-1000XM5') }
      ];
    }

    // 7. BRANDS & CATEGORIES
    else if (q.includes('sony')) {
      reply = `Showing Sony: WH-1000XM5 Noise Canceling Headphones and PlayStation 5 Slim!`;
      actionType = 'search';
      actionPayload = 'Sony';
    } else if (q.includes('apple') || q.includes('iphone') || q.includes('macbook')) {
      reply = `Showing Apple devices: iPhone 15 Pro Max, MacBook Air M3, and Apple Watch Ultra 2!`;
      actionType = 'search';
      actionPayload = 'Apple';
    } else if (q.includes('headphone') || q.includes('audio')) {
      reply = `Showing top headphones from Sony and boAt. Both in stock!`;
      actionType = 'category';
      actionPayload = 'Electronics';
    } else if (q.includes('phone') || q.includes('mobile')) {
      reply = `Showing smartphones: iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, and Realme Narzo 70x 5G!`;
      actionType = 'category';
      actionPayload = 'Smartphones';
    } else if (q.includes('shoe') || q.includes('sneaker') || q.includes('nike') || q.includes('puma')) {
      reply = `Showing footwear: Nike Air Max 270 (₹12,995) and Puma RS-X retro sneakers (₹7,999)!`;
      actionType = 'category';
      actionPayload = 'Footwear';
    } else {
      reply = `I searched for "${rawQuery}". Here are matching items from our store catalog!`;
      actionType = 'search';
      actionPayload = rawQuery;
    }

    setAiResponse(reply);
    setSuggestedActions(nextActions);
    setStatus('🔊 VibeCart AI Speaking (Murf Falcon Voice)');
    speakText(reply);

    if (onVoiceAction) {
      onVoiceAction(actionType, actionPayload);
    }

    setTimeout(() => {
      setStatus('🎙️ Live Voice Ready — Keep talking or tap an action below');
    }, 5000);
  };

  const handleOrbToggle = async () => {
    if (isListening) {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn(e);
        }
      }
      setIsListening(false);
      setStatus('Microphone paused. Tap to resume speaking.');
    } else {
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
        setStatus('Microphone active. Say e.g. "Buy a laptop under 1 lakh"');
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
        <p className="voice-sub">Agora RTC Conversational AI + Murf Falcon Low-Latency Speech Synthesis</p>
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

      {/* Real-time Dynamic Waveform Bars */}
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
          ⏹️ Reset
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

          {/* Contextual Next Steps / Instant Action Buttons */}
          {suggestedActions && suggestedActions.length > 0 && (
            <div className="suggested-actions-row">
              <span className="actions-hint">Suggested next action:</span>
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
          placeholder="Ask voice AI: 'I have to buy a laptop under 1lakh', 'Do you have PS5?'..."
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
