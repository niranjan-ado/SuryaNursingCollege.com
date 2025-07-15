/**
 * =================================================================
 * JAVASCRIPT FOR SURYA NURSING EDUCATIONAL COLLEGE
 * -----------------------------------------------------------------
 * This file is structured to be modular and future-proof.
 * Each piece of functionality is wrapped in its own function.
 * The main DOMContentLoaded event listener at the bottom initializes
 * everything, ensuring the page is ready before any code runs.
 *
 * TABLE OF CONTENTS
 * -----------------
 * 1. CORE WEBSITE FUNCTIONALITY
 *    - initMobileMenu()
 *    - initStickyHeader()      (IMPROVED: Performance via throttling)
 *    - initScrollAnimations()
 *    - initCurrentYear()
 *    - initAccordions()        (REVISED: To handle all accordion types)
 *    - initTabs()
 *
 * 2. ADVANCED & DYNAMIC FEATURES
 *    - initAnimatedCounters()  (IMPROVED: Smoother animation with rAF)
 *    - initGeminiChat()
 *    - initCarousel()          (IMPROVED: Now responsive to window resize)
 *
 * 3. INITIALIZATION
 *    - DOMContentLoaded event listener
 * =================================================================
 */

/**
 * 1. CORE WEBSITE FUNCTIONALITY
 * These functions power the basic user experience across the site.
 */

/**
 * Handles the mobile navigation menu toggle.
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const body = document.body;

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Makes the header sticky and styled on scroll, using throttling for performance.
 */
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let isThrottled = false;
    const throttleScroll = () => {
        if (isThrottled) return;
        isThrottled = true;
        
        setTimeout(() => {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                isThrottled = false;
            });
        }, 100); // Run this check at most every 100ms
    };

    window.addEventListener('scroll', throttleScroll);
}

/**
 * Initializes Intersection Observer for smooth scroll-in animations.
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * Sets the current year in the footer copyright.
 */
function initCurrentYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Handles all accordion functionality (like FAQs and syllabus accordions).
 * Closes other open items within the same group when a new one is opened.
 */
function initAccordions() {
    // UPDATED: Now selects both .faq-container and .syllabus-accordion
    const accordionContainers = document.querySelectorAll('.faq-container, .syllabus-accordion');

    accordionContainers.forEach(container => {
        container.addEventListener('click', (e) => {
            const questionButton = e.target.closest('.faq-question');
            if (!questionButton) return;

            const currentItem = questionButton.closest('.faq-item');
            const wasActive = currentItem.classList.contains('active');

            // This logic ensures only one item in a group is open at a time.
            container.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // If the clicked item was not already active, open it.
            if (!wasActive) {
                currentItem.classList.add('active');
            }
        });
    });
}

/**
 * Handles all tab functionality (like on syllabus pages).
 */
function initTabs() {
    const tabsContainers = document.querySelectorAll('.tabs-container');
    tabsContainers.forEach(tabsContainer => {
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');

        if (tabButtons.length === 0 || tabContents.length === 0) return;

        tabsContainer.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab-button');
            if (!tabButton) return;
            
            const tabId = tabButton.dataset.tab;
            const targetContent = document.getElementById(tabId);
            
            if (!targetContent) return;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tabButton.classList.add('active');
            targetContent.classList.add('active');
        });
    });
}


/**
 * 2. ADVANCED & DYNAMIC FEATURES
 */

/**
 * Animates numbers from 0 to a target value using requestAnimationFrame.
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.animated-counter');
    if (counters.length === 0) return;

    const animateCounter = (counter, target) => {
        const duration = 2000; // 2 seconds
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(progress * target);
            
            counter.textContent = currentValue;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.textContent = target; // Ensure it ends on the exact target
            }
        };
        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

/**
 * Handles the logic for the AI Chat Widget.
 */
function initGeminiChat() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWidget = document.getElementById('chat-widget');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatToggleBtn || !chatWidget || !chatForm || !chatMessages) return;

    chatToggleBtn.addEventListener('click', () => chatWidget.classList.add('visible'));
    closeChatBtn.addEventListener('click', () => chatWidget.classList.remove('visible'));

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = chatInput.value.trim();
        if (!userInput) return;

        addMessage(userInput, 'user-message');
        chatInput.value = '';
        chatInput.disabled = true;
        chatSendBtn.disabled = true;

        setTimeout(() => {
            const botResponse = getGeminiResponse(userInput);
            addMessage(botResponse, 'ai-message');
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.focus();
        }, 1200);
    });

    function addMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', type);
        messageElement.innerHTML = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getGeminiResponse(input) {
        const lowerInput = input.toLowerCase();
        if (/admission|apply|process|criteria/.test(lowerInput)) return "Our admission is based on the J.C.E.C.E.B. entrance test. You can find detailed eligibility for each program on our <a href='courses.html'>Courses page</a>.";
        if (/course|program|anm|gnm|bsc/.test(lowerInput)) return "We offer three main programs: a 2-year ANM diploma, a 3-year GNM diploma, and a 4-year B.Sc. Nursing degree. You can see details for all of them on our <a href='courses.html'>Courses page</a>.";
        if (/syllabus/.test(lowerInput)) return "You can find links to the full, detailed syllabus for each program on our <a href='courses.html'>Courses page</a>.";
        if (/hostel|accommodation/.test(lowerInput)) return "Yes, we have secure hostel facilities for our students on campus, creating a safe and focused learning environment.";
        if (/contact|phone|email|address/.test(lowerInput)) return "You can reach us at +91-9264197981 or suryanursingeducationalcollege@gmail.com. All our details are on the <a href='contact.html'>Contact page</a>.";
        if (/fee|fees|cost|scholarship|payment/.test(lowerInput)) return "For specific and up-to-date information on our fee structure, payment options, and any available scholarships, it is best to contact our admissions office directly. You can find their details on our <a href='contact.html'>Contact page</a>.";
        if (/hello|hi|hey/.test(lowerInput)) return "Hello! How can I assist you today? You can ask me about our courses, admission process, or syllabus.";
        return "That's a great question. For more detailed information, I recommend reaching out to our expert team via our <a href='contact.html'>Contact page</a>. They will be happy to assist you!";
    }
}

/**
 * Initializes and manages all carousels, now with resize handling.
 */
function initCarousel() {
    const carousels = document.querySelectorAll('[data-carousel-id]');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button--right');
        const prevButton = carousel.querySelector('.carousel-button--left');
        const dotsNav = carousel.querySelector('.carousel-nav');

        if (!track || slides.length === 0 || !nextButton || !prevButton || !dotsNav) return;

        let currentSlideIndex = 0;
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-indicator');
            if (index === 0) dot.classList.add('current-slide');
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (targetIndex) => {
            const targetSlide = slides[targetIndex];
            track.style.transform = 'translateX(-' + targetSlide.offsetLeft + 'px)';
            
            slides.forEach((s, i) => s.classList.toggle('current-slide', i === targetIndex));
            dots.forEach((d, i) => d.classList.toggle('current-slide', i === targetIndex));
            
            currentSlideIndex = targetIndex;
        };

        prevButton.addEventListener('click', () => {
            const targetIndex = (currentSlideIndex === 0) ? slides.length - 1 : currentSlideIndex - 1;
            moveToSlide(targetIndex);
        });

        nextButton.addEventListener('click', () => {
            const targetIndex = (currentSlideIndex === slides.length - 1) ? 0 : currentSlideIndex + 1;
            moveToSlide(targetIndex);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button.carousel-indicator');
            if (!targetDot) return;
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            moveToSlide(targetIndex);
        });

        // IMPROVEMENT: Add a debounced resize handler to fix alignment issues.
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const currentSlide = slides[currentSlideIndex];
                track.style.transition = 'none'; // Disable transition for instant snap
                track.style.transform = 'translateX(-' + currentSlide.offsetLeft + 'px)';
                setTimeout(() => track.style.transition = '', 50); // Re-enable after snap
            }, 250);
        });
    });
}


/**
 * 3. INITIALIZATION
 * Waits for the HTML to be fully loaded, then calls all initialization functions.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Core functions - run on every page
    initMobileMenu();
    initStickyHeader();
    initScrollAnimations();
    initCurrentYear();
    initAccordions();
    initTabs();

    // Advanced functions - will only execute if their target elements exist
    initAnimatedCounters();
    initGeminiChat();
    initCarousel();

    console.log("Surya Nursing College scripts initialized successfully.");
});