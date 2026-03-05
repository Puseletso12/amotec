/* ── Navbar: transparent → solid on scroll ─────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile hamburger menu ──────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
});

// Close menu when a link is tapped
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ── Scroll reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Portfolio filter ───────────────────────────────────────── */
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.port-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
    });
  });
});

/* ── AI Project Generator ───────────────────────────────────── */
const genInput   = document.getElementById('gen-input');
const genBtn     = document.getElementById('gen-btn');
const genLoading = document.getElementById('gen-loading');
const genResult  = document.getElementById('gen-result');
const genText    = document.getElementById('gen-result-text');

// Enable button only when there is input
genInput.addEventListener('input', () => {
  genBtn.disabled = genInput.value.trim().length < 3;
});

genBtn.addEventListener('click', async () => {
  const prompt = genInput.value.trim();
  if (!prompt) return;

  // UI: loading state
  genBtn.disabled = true;
  genResult.classList.remove('show');
  genLoading.classList.add('show');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a creative director at Amotec Solutions, a digital media production agency based in South Africa. Given a project idea, write a punchy 3-4 sentence creative concept. Then recommend 2-3 services from this list: Photography, Videography, Video Production, Livestreaming, Social Media Marketing, Social Media Management, Marketing & Advertising, Public Relations, Graphic Design, Marketing Consultancy. Keep the tone bold, cinematic, and professional.`,
        messages: [{ role: 'user', content: `Project idea: ${prompt}` }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || 'Unable to generate a concept right now. Please try again.';
    genText.textContent = text;
    genResult.classList.add('show');
  } catch {
    genText.textContent = 'Something went wrong. Please check your connection and try again.';
    genResult.classList.add('show');
  } finally {
    genLoading.classList.remove('show');
    genBtn.disabled = false;
  }
});

// Allow Enter key to trigger
genInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !genBtn.disabled) genBtn.click();
});

/* ── Contact form ───────────────────────────────────────────── */
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const submitBtn = e.target.querySelector('.btn-red[type="submit"]');
  const original  = submitBtn.innerHTML;

  submitBtn.textContent = '✓ Message Sent!';
  submitBtn.style.background = '#1a7a3a';

  setTimeout(() => {
    submitBtn.innerHTML = original;
    submitBtn.style.background = '';
    e.target.reset();
  }, 3500);
});