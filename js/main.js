// =========================================
// Header Scroll Effect (Intersection Observer)
// =========================================
const s = document.createElement('div');
s.style.position = 'absolute';
s.style.top = '0';
s.style.width = '100%';
s.style.height = '1px';
s.style.pointerEvents = 'none';
s.style.visibility = 'hidden';
document.body.prepend(s);

const h = document.getElementById('header');
if (h) {
    const ho = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) {
            h.classList.add('scrolled');
        } else {
            h.classList.remove('scrolled');
        }
    }, { threshold: 0, rootMargin: '0px' });
    ho.observe(s);
}

// =========================================
// Scroll Reveal Animations
// =========================================
const ro = new IntersectionObserver((es, o) => {
    es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
            o.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// =========================================
// Dynamic Copyright Year
// =========================================
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// =========================================
// Mobile Menu Toggle
// =========================================
const mt = document.getElementById('menu-toggle');
const nl = document.getElementById('nav-links');
const im = document.querySelector('.icon-menu');
const ic = document.querySelector('.icon-close');

if (mt && nl) {
    mt.addEventListener('click', () => {
        const a = nl.classList.toggle('active');
        mt.setAttribute('aria-expanded', a);
        
        // Added safety checks here in case icons are missing on certain pages
        if (im) im.style.display = a ? 'none' : 'block';
        if (ic) ic.style.display = a ? 'block' : 'none';
        
        document.body.style.overflow = a ? 'hidden' : '';
    });
}

// =========================================
// Mobile Dropdown Handling
// =========================================
document.querySelectorAll('.dropdown > a').forEach(d => {
    d.addEventListener('click', e => {
        if (window.innerWidth <= 768) {
            const p = d.parentElement;
            
            // If the menu is NOT active yet, prevent navigation and open it
            if (!p.classList.contains('active')) {
                e.preventDefault(); 
                p.classList.add('active');
                const m = p.querySelector('.dropdown-menu');
                if (m) m.style.display = 'flex';
            } 
            // If it IS active, we let the click happen normally so they can navigate
        }
    });
});

// =========================================
// Dark/Light Theme Toggle
// =========================================
const tt = document.getElementById('theme-toggle');
const dI = document.querySelector('.dark-icon');
const lI = document.querySelector('.light-icon');
const de = document.documentElement;

const st = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const at = (t) => {
    de.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (t === 'dark') {
        if (dI) dI.style.display = 'none';
        if (lI) lI.style.display = 'block';
    } else {
        if (dI) dI.style.display = 'block';
        if (lI) lI.style.display = 'none';
    }
};

at(st());

if (tt) {
    tt.addEventListener('click', () => {
        at(de.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
}

// =========================================
// Modal Outside Click Close
// =========================================
const m = document.getElementById('inquiry-modal');
if (m) {
    m.addEventListener('click', e => {
        const r = m.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
            m.close();
        }
    });
}

// =========================================
// FAQ Accordion Toggle
// =========================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        
        // Also toggle an 'active' class on the parent item for easier CSS targeting if needed
        question.parentElement.classList.toggle('active', !isExpanded);
    });
});

// =========================================
// High-Performance Tab System
// =========================================
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active classes from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Find and show corresponding content
            const targetId = button.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}