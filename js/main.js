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
 *    - initStickyHeader()
 *    - initScrollAnimations()
 *    - initCurrentYear()
 *    - initFaqAccordion()      (Revised for better UX & centralization)
 *
 * 2. ADVANCED & FUTURE-PROOF FEATURES
 *    - initAnimatedCounters()
 *    - initGeminiChat()        (Revised for better UX & centralization)
 *    - initCarousel()          (NEW: Centralized for Facilities page)
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

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
            // Set ARIA attribute for accessibility
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Use .closest('a') for more robust click detection.
        // This ensures the menu closes even if the click is on an element inside the link.
        navLinks.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Makes the header sticky and styled on scroll.
 */
function initStickyHeader() {
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Initializes Intersection Observer for smooth scroll-in animations.
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Adjust threshold if elements reveal too early/late

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
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
 * Handles the FAQ/Accordion functionality.
 * This will work for any element with class .faq-item and a .faq-question button inside.
 * It closes other open items when a new one is opened.
 */
function initFaqAccordion() {
    // Select all accordion containers (e.g., .faq-container or .syllabus-accordion)
    const accordionContainers = document.querySelectorAll('.faq-container, .syllabus-accordion');

    accordionContainers.forEach(container => {
        container.addEventListener('click', (e) => {
            // Check if the clicked element or its parent is an .faq-question button
            const questionButton = e.target.closest('.faq-question');
            if (questionButton) {
                const item = questionButton.closest('.faq-item');
                const wasActive = item.classList.contains('active');

                // Close all other FAQ items within the same container
                container.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item) { // Only close if it's not the clicked item
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle the clicked item
                if (!wasActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    });

    // Handle Tab functionality on pages like bsc-nursing-syllabus.html and anm-syllabus.html
    const tabsContainers = document.querySelectorAll('.tabs-container');
    tabsContainers.forEach(tabsContainer => {
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');

        if (tabButtons.length > 0 && tabContents.length > 0) {
            tabsContainer.addEventListener('click', (e) => {
                if (e.target.matches('.tab-button')) {
                    const tabId = e.target.dataset.tab;
                    
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));

                    e.target.classList.add('active');
                    document.getElementById(tabId).classList.add('active');
                }
            });
        }
    });
}


/**
 * 2. ADVANCED & FUTURE-PROOF FEATURES
 * These functions are ready for when you build out new pages and features.
 */

/**
 * Animates numbers from 0 to a target value when they scroll into view.
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.animated-counter');
    if (counters.length > 0) {
        const speed = 200; // Lower number is faster

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target'); // Convert to number
                    
                    // Handle percentage symbol if present in data-target string
                    const isPercentage = counter.textContent.includes('%');

                    const updateCount = () => {
                        let currentCount = +counter.innerText.replace('%', ''); // Remove % for calculation
                        const increment = target / speed;

                        if (currentCount < target) {
                            counter.innerText = Math.ceil(currentCount + increment) + (isPercentage ? '%' : '');
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target + (isPercentage ? '%' : ''); // Ensure it ends on the exact target
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

        counters.forEach(counter => counterObserver.observe(counter));
    }
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
    const chatMessages = document.getElementById('chat-messages'); // Get chat messages container

    if (chatToggleBtn && chatWidget && chatForm && chatMessages) {
        chatToggleBtn.addEventListener('click', () => chatWidget.classList.add('visible'));
        
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => chatWidget.classList.remove('visible'));
        }

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userInput = chatInput.value.trim();

            if (userInput) {
                // Add user message to UI
                addMessage(userInput, 'user-message');
                
                // Clear input and disable form for better UX while waiting for response
                chatInput.value = '';
                chatInput.disabled = true;
                chatSendBtn.disabled = true;

                // Simulate AI thinking and get response
                setTimeout(() => {
                    const botResponse = getGeminiResponse(userInput);
                    addMessage(botResponse, 'ai-message');
                    // Re-enable the form after response
                    chatInput.disabled = false;
                    chatSendBtn.disabled = false;
                    chatInput.focus(); // Focus input for next message
                }, 1500); // Simulate network delay
            }
        });
    }

    // Helper function to add messages to the chat UI
    function addMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', type);
        messageElement.innerHTML = text; // Use innerHTML to render links
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    // This is a SIMULATED Gemini response function.
    // In a real application, this would make an API call to a backend or a Gemini API.
    function getGeminiResponse(input) {
        const lowerInput = input.toLowerCase();

        if (/admission|apply|process|criteria/.test(lowerInput)) {
            return "Our admission is based on the J.C.E.C.E.B. entrance test. You can find detailed eligibility for each program on our <a href='courses.html'>Courses page</a>.";
        } else if (/course|program|anm|gnm|bsc/.test(lowerInput)) {
            return "We offer three main programs: a 2-year ANM diploma, a 3-year GNM diploma, and a 4-year B.Sc. Nursing degree. You can see details for all of them on our <a href='courses.html'>Courses page</a>.";
        } else if (/syllabus/.test(lowerInput)) {
            return "You can find links to the full, detailed syllabus for each program on our <a href='courses.html'>Courses page</a>.";
        } else if (/hostel|accommodation/.test(lowerInput)) {
            return "Yes, we have secure hostel facilities for our students on campus, creating a safe and focused learning environment.";
        } else if (/contact|phone|email|address/.test(lowerInput)) {
            return "You can reach us at +91-9264197981 or suryanursingeducationalcollege@gmail.com. All our details are on the <a href='contact.html'>Contact page</a>.";
        } else if (/fee|fees|cost|scholarship|payment/.test(lowerInput)) {
            // This is the "advanced" question fallback
            return "For specific and up-to-date information on our fee structure, payment options, and any available scholarships, it is best to contact our admissions office directly. You can find their details on our <a href='contact.html'>Contact page</a>.";
        } else if (/hello|hi|hey/.test(lowerInput)) {
            return "Hello! How can I assist you today? You can ask me about our courses, admission process, or syllabus.";
        } else {
            // Default fallback for anything else
            return "That's a great question. For more detailed information, I recommend reaching out to our expert team via our <a href='contact.html'>Contact page</a>. They will be happy to assist you!";
        }
    }
}

/**
 * Initializes and manages all carousels on the page.
 */
function initCarousel() {
    const carousels = document.querySelectorAll('[data-carousel-id]');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button--right');
        const prevButton = carousel.querySelector('.carousel-button--left');
        const dotsNav = carousel.querySelector('.carousel-nav');

        if (!track || !slides.length || !nextButton || !prevButton || !dotsNav) {
            console.warn('Carousel elements not found for carousel:', carousel);
            return; // Skip if essential elements are missing
        }

        let currentSlideIndex = 0; // Keep track of the current slide index

        // Create dots for navigation
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-indicator');
            if (index === 0) dot.classList.add('current-slide');
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);

        // Function to update current slide and dots
        const updateCarouselDisplay = (targetIndex) => {
            const targetSlide = slides[targetIndex];
            track.style.transform = 'translateX(-' + (targetSlide.offsetLeft) + 'px)';

            // Update slide classes
            slides.forEach((slide, index) => {
                if (index === targetIndex) {
                    slide.classList.add('current-slide');
                } else {
                    slide.classList.remove('current-slide');
                }
            });
            
            // Update dot classes
            dots.forEach((dot, index) => {
                if (index === targetIndex) {
                    dot.classList.add('current-slide');
                } else {
                    dot.classList.remove('current-slide');
                }
            });

            currentSlideIndex = targetIndex; // Update the index tracker
        };

        // When I click left, move slides to the left
        prevButton.addEventListener('click', () => {
            let targetIndex = currentSlideIndex - 1;
            if (targetIndex < 0) {
                targetIndex = slides.length - 1; // Loop to the last slide
            }
            updateCarouselDisplay(targetIndex);
        });

        // When I click right, move slides to the right
        nextButton.addEventListener('click', () => {
            let targetIndex = currentSlideIndex + 1;
            if (targetIndex >= slides.length) {
                targetIndex = 0; // Loop to the first slide
            }
            updateCarouselDisplay(targetIndex);
        });

        // When I click the nav indicators, move to that slide
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button.carousel-indicator'); // Ensure click is on an indicator button
            if (!targetDot) return; // Ignore clicks not on a button

            const targetIndex = dots.findIndex(dot => dot === targetDot);
            updateCarouselDisplay(targetIndex);
        });
    });
}


/**
 * 3. INITIALIZATION
 * This is the main entry point. It waits for the HTML document to be fully
 * loaded and parsed, then calls all the initialization functions.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Core functions - run on every page
    initMobileMenu();
    initStickyHeader();
    initScrollAnimations();
    initCurrentYear();
    initFaqAccordion(); // Handles both FAQ and Syllabus accordions/tabs

    // Advanced functions - will only execute if their target elements exist on the page
    initAnimatedCounters();
    initGeminiChat();
    initCarousel(); // Initialize all carousels found

    console.log("Surya Nursing College scripts initialized successfully.");
});