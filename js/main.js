document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* =========================================
       1. High-Performance Header Scroll Effect
       ========================================= */
    // We create an invisible 1px watcher element at the very top of the page.
    // When this element scrolls out of view, we know the user has scrolled down.
    const scrollWatcher = document.createElement('div');
    scrollWatcher.style.position = 'absolute';
    scrollWatcher.style.top = '0';
    scrollWatcher.style.width = '100%';
    scrollWatcher.style.height = '1px';
    scrollWatcher.style.pointerEvents = 'none';
    scrollWatcher.style.visibility = 'hidden';
    document.body.prepend(scrollWatcher);

    const header = document.getElementById('header');
    if (header) {
        const headerObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { threshold: 0, rootMargin: '0px' });
        
        headerObserver.observe(scrollWatcher);
    }

    /* =========================================
       2. Scroll Reveal Animations
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once for better performance
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* =========================================
       3. Dynamic Copyright Year
       ========================================= */
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* =========================================
       4. Mobile Navigation Toggle
       ========================================= */
    const menuToggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const iconMenu = document.querySelector('.icon-menu');
    const iconClose = document.querySelector('.icon-close');

    if (menuToggleBtn && navLinks) {
        menuToggleBtn.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggleBtn.setAttribute('aria-expanded', isActive);
            
            if (iconMenu) iconMenu.style.display = isActive ? 'none' : 'block';
            if (iconClose) iconClose.style.display = isActive ? 'block' : 'none';
            
            // Prevent background scrolling when mobile menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    /* =========================================
       5. Mobile Dropdown Handling
       ========================================= */
    const dropdownLinks = document.querySelectorAll('.dropdown > a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only apply this logic on mobile/tablet views
            if (window.innerWidth <= 768) {
                const parentLi = link.parentElement;
                
                // If the menu is NOT active yet, prevent navigation and open the dropdown
                if (!parentLi.classList.contains('active')) {
                    e.preventDefault(); 
                    
                    // Close other open dropdowns (optional accordion-style behavior)
                    document.querySelectorAll('.dropdown.active').forEach(activeDropdown => {
                        if (activeDropdown !== parentLi) {
                            activeDropdown.classList.remove('active');
                            activeDropdown.querySelector('a').setAttribute('aria-expanded', 'false');
                        }
                    });

                    parentLi.classList.add('active');
                    link.setAttribute('aria-expanded', 'true');
                    
                    const dropdownMenu = parentLi.querySelector('.dropdown-menu');
                    if (dropdownMenu) dropdownMenu.style.display = 'flex';
                } 
                // If it IS active, the second tap will follow the link naturally
            }
        });
    });

    /* =========================================
       6. Dark/Light Theme Toggle
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    const htmlElement = document.documentElement;

    // Get current theme from localStorage or system preference
    const getPreferredTheme = () => {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    };

    // Apply the theme and update icons
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            if (darkIcon) darkIcon.style.display = 'none';
            if (lightIcon) lightIcon.style.display = 'block';
        } else {
            if (darkIcon) darkIcon.style.display = 'block';
            if (lightIcon) lightIcon.style.display = 'none';
        }
    };

    // Initialize theme on load
    applyTheme(getPreferredTheme());

    // Listen for toggle clicks
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    /* =========================================
       7. Native Modal Handling (Backdrop Click)
       ========================================= */
    const inquiryModal = document.getElementById('inquiry-modal');
    if (inquiryModal) {
        // Close modal when clicking outside the dialog box (on the ::backdrop)
        inquiryModal.addEventListener('click', (e) => {
            const dialogDimensions = inquiryModal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left || 
                e.clientX > dialogDimensions.right || 
                e.clientY < dialogDimensions.top || 
                e.clientY > dialogDimensions.bottom
            ) {
                inquiryModal.close();
            }
        });
    }

    /* =========================================
       8. FAQ Accordion Toggle
       ========================================= */
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQs (optional, remove if you want multiple open at once)
                faqQuestions.forEach(q => {
                    q.setAttribute('aria-expanded', 'false');
                    q.parentElement.classList.remove('active');
                });

                // Toggle the clicked one
                if (!isExpanded) {
                    question.setAttribute('aria-expanded', 'true');
                    question.parentElement.classList.add('active');
                }
            });
        });
    }

    /* =========================================
       9. High-Performance Tab System
       ========================================= */
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
                if (targetId) {
                    const targetContent = document.getElementById(targetId);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                }
            });
        });
    }
});