/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

/* ===== TEXT ANIMATION SYSTEM ===== */
function initTextAnimations() {
  // --- Tier 1: Character-by-character (high importance) ---
  document.querySelectorAll('[data-animate="chars"]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      if (char === ' ') {
        span.className = 'anim-char anim-space';
        span.innerHTML = '&nbsp;';
      } else if (char === '&') {
        span.className = 'anim-char anim-ampersand';
        span.textContent = char;
      } else {
        span.className = 'anim-char';
        span.textContent = char;
      }
      span.style.transitionDelay = `${i * 65}ms`;
      span.style.animationDelay = `${i * 65 + 400}ms`;
      el.appendChild(span);
    });
  });

  // --- Tier 2: Word-by-word (medium importance) ---
  document.querySelectorAll('[data-animate="words"]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    text.split(/\s+/).forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'anim-word';
      span.textContent = word;
      span.style.transitionDelay = `${i * 160}ms`;
      el.appendChild(span);
      // Add space between words
      if (i < text.split(/\s+/).length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  });

  // --- Tier 3: Line-by-line (low importance) ---
  document.querySelectorAll('[data-animate="lines"]').forEach(el => {
    // Split on <br> or newlines
    const html = el.innerHTML;
    const lines = html.split(/<br\s*\/?>/gi).map(l => l.trim()).filter(l => l);
    el.innerHTML = '';
    lines.forEach((line, i) => {
      const span = document.createElement('span');
      span.className = 'anim-line';
      span.innerHTML = line;
      span.style.transitionDelay = `${i * 300}ms`;
      el.appendChild(span);
    });
  });

  // --- Observer: trigger animations on scroll ---
  const animEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // only once
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

  animEls.forEach(el => {
    // Hero elements animate immediately (already in view on load)
    if (el.closest('.hero')) {
      const delay = parseInt(el.dataset.animDelay || '0', 10);
      setTimeout(() => el.classList.add('animated'), delay);
    } else {
      observer.observe(el);
    }
  });
}

/* ===== BOKEH PARTICLES ===== */
function initBokeh() {
  const canvas = document.getElementById('bokeh-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = [
    'rgba(201,168,76,', 'rgba(245,198,170,', 'rgba(232,180,184,',
    'rgba(255,249,240,', 'rgba(232,212,139,'
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.2 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    };
  }

  for (let i = 0; i < 50; i++) particles.push(createParticle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      ctx.beginPath();
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      gradient.addColorStop(0, p.color + a + ')');
      gradient.addColorStop(1, p.color + '0)');
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== SPARKLE CANVAS ===== */
function initSparkles() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let sparkles = [];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createSparkle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      alpha: 0,
      maxAlpha: Math.random() * 0.8 + 0.2,
      fadeIn: true,
      speed: Math.random() * 0.015 + 0.005,
      dy: -(Math.random() * 0.3 + 0.1),
    };
  }

  for (let i = 0; i < 40; i++) sparkles.push(createSparkle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparkles.forEach((s, i) => {
      if (s.fadeIn) {
        s.alpha += s.speed;
        if (s.alpha >= s.maxAlpha) s.fadeIn = false;
      } else {
        s.alpha -= s.speed;
        if (s.alpha <= 0) {
          sparkles[i] = createSparkle();
          return;
        }
      }
      s.y += s.dy;

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#C9A84C';
      ctx.beginPath();
      // Star shape
      const spikes = 4;
      const outerR = s.size;
      const innerR = s.size * 0.4;
      for (let j = 0; j < spikes * 2; j++) {
        const r = j % 2 === 0 ? outerR : innerR;
        const angle = (j * Math.PI) / spikes - Math.PI / 2;
        const px = s.x + Math.cos(angle) * r;
        const py = s.y + Math.sin(angle) * r;
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== COUNTDOWN (FLIP CLOCK) ===== */
function initCountdown() {
  const target = new Date('2026-07-04T19:00:00+05:30').getTime();

  function flipTo(el, newVal) {
    const str = String(newVal).padStart(2, '0');
    const current = el.getAttribute('data-value');
    if (current === str) return;

    const topHalf = el.querySelector('.flip-clock-top span');
    const bottomHalf = el.querySelector('.flip-clock-bottom span');
    const flapTop = el.querySelector('.flip-clock-flap-top span');
    const flapBottom = el.querySelector('.flip-clock-flap-bottom span');

    // Set up: flap-top shows old value (falls away), top shows new value behind it
    flapTop.textContent = current;
    topHalf.textContent = str;
    // bottom shows old value, flap-bottom will reveal new value
    bottomHalf.textContent = current;
    flapBottom.textContent = str;

    // Remove old animation class, trigger reflow, add it back
    el.classList.remove('flipping');
    void el.offsetWidth;
    el.classList.add('flipping');

    // After animation, reset for next flip
    setTimeout(() => {
      el.classList.remove('flipping');
      topHalf.textContent = str;
      bottomHalf.textContent = str;
      flapTop.textContent = str;
      flapBottom.textContent = str;
      // Reset flap transforms
      el.querySelector('.flip-clock-flap-top').style.transform = 'rotateX(0deg)';
      el.querySelector('.flip-clock-flap-bottom').style.transform = 'rotateX(90deg)';
      // Clear inline styles so CSS takes over next time
      setTimeout(() => {
        el.querySelector('.flip-clock-flap-top').style.transform = '';
        el.querySelector('.flip-clock-flap-bottom').style.transform = '';
      }, 50);
    }, 900);

    el.setAttribute('data-value', str);
  }

  function update() {
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    flipTo(document.getElementById('cd-days'), d);
    flipTo(document.getElementById('cd-hours'), h);
    flipTo(document.getElementById('cd-minutes'), m);
    flipTo(document.getElementById('cd-seconds'), s);
  }

  // Initialize immediately with correct values (no animation on first load)
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const initVals = {
    'cd-days': Math.floor(diff / 86400000),
    'cd-hours': Math.floor((diff % 86400000) / 3600000),
    'cd-minutes': Math.floor((diff % 3600000) / 60000),
    'cd-seconds': Math.floor((diff % 60000) / 1000),
  };
  Object.entries(initVals).forEach(([id, val]) => {
    const el = document.getElementById(id);
    const str = String(val).padStart(2, '0');
    el.setAttribute('data-value', str);
    el.querySelectorAll('span').forEach(s => s.textContent = str);
  });

  setInterval(update, 1000);
}

/* ===== GALLERY ===== */
function initGallery() {
  const carousel = document.getElementById('gallery-carousel');
  const dotsContainer = document.getElementById('gallery-dots');
  if (!carousel || !dotsContainer) return;

  const items = carousel.querySelectorAll('.gallery-item');
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.onclick = () => {
      items[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.gallery-dot');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(items).indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { root: carousel, threshold: 0.6 });
  items.forEach(item => observer.observe(item));
}

/* ===== RSVP ===== */

function selectAttending(value) {
  document.getElementById('rsvp-attending').value = value;
  document.getElementById('attend-yes').classList.toggle('selected', value === 'yes');
  document.getElementById('attend-no').classList.toggle('selected', value === 'no');
}

async function handleRSVP(e) {
  e.preventDefault();
  const name = document.getElementById('rsvp-name').value.trim();
  const guestsRaw = document.getElementById('rsvp-guests').value;
  const attending = document.getElementById('rsvp-attending').value;

  if (!name || !guestsRaw || !attending) {
    alert('Please fill in all fields');
    return false;
  }

  const btn = document.getElementById('btn-submit');
  btn.textContent = 'Sending...';
  btn.classList.add('loading');

  try {

    const payload = { name, guests: guestsRaw, attending };

    // >>>>>> PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL HERE <<<<<<
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw27NPeYoXFFEurpr3Z7baA6pLPLVmKzggd_WhhabDmW44W9PSMLDh4U1Q9LX_k3B-WGw/exec';

    // if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    //   // Fallback preview mode
    //   console.warn('Apps Script URL not configured — simulating success.');
    //   await new Promise(r => setTimeout(r, 1500));
    //   document.getElementById('rsvp-form-el').style.display = 'none';
    //   document.getElementById('form-success').style.display = 'block';
    //   return false;
    // }

    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (result.status === 'success') {
      document.getElementById('rsvp-form-el').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (err) {
    console.error('RSVP error:', err);
    alert('Something went wrong. Please try again.');
    btn.textContent = 'Send RSVP';
    btn.classList.remove('loading');
  }
  return false;
}

/* ===== MUSIC ===== */
function initMusic() {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;

  // Create audio context for generated music
  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;
  let oscillators = [];

  function createMusic() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.12;
    gainNode.connect(audioCtx.destination);

    // Soft pad sound (simulating flute + piano ambient)
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 293.66, 369.99];
    let noteIndex = 0;

    function playNote() {
      if (!isPlaying) return;

      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      const freq = notes[noteIndex % notes.length];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.8);
      noteGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3.5);

      osc.connect(noteGain);
      noteGain.connect(gainNode);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 3.5);

      // Add harmonic
      const osc2 = audioCtx.createOscillator();
      const noteGain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);
      noteGain2.gain.setValueAtTime(0, audioCtx.currentTime);
      noteGain2.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.5);
      noteGain2.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3);
      osc2.connect(noteGain2);
      noteGain2.connect(gainNode);
      osc2.start(audioCtx.currentTime);
      osc2.stop(audioCtx.currentTime + 3);

      noteIndex++;
      setTimeout(playNote, 2800);
    }

    playNote();
  }

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      isPlaying = true;
      btn.classList.add('playing');
      if (!audioCtx) {
        createMusic();
      } else {
        audioCtx.resume();
      }
    } else {
      isPlaying = false;
      btn.classList.remove('playing');
      if (audioCtx) audioCtx.suspend();
    }
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initTextAnimations();
  initScrollReveal();
  initBokeh();
  initSparkles();
  initCountdown();
  initGallery();
  initMusic();
});
