document.addEventListener('DOMContentLoaded', () => {
    'use strict';

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

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

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
            
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    const dropdownLinks = document.querySelectorAll('.dropdown > a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const parentLi = link.parentElement;
                
                if (!parentLi.classList.contains('active')) {
                    e.preventDefault(); 
                    
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
            }
        });
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    const htmlElement = document.documentElement;

    const getPreferredTheme = () => {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    };

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

    applyTheme(getPreferredTheme());

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    const inquiryModal = document.getElementById('inquiry-modal');
    if (inquiryModal) {
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

    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                faqQuestions.forEach(q => {
                    q.setAttribute('aria-expanded', 'false');
                    q.parentElement.classList.remove('active');
                });

                if (!isExpanded) {
                    question.setAttribute('aria-expanded', 'true');
                    question.parentElement.classList.add('active');
                }
            });
        });
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');

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