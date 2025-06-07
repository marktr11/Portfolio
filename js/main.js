// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Add animation classes when elements come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Handle project cards layout
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    
    function adjustProjectCards() {
        const containerWidth = projectsGrid.offsetWidth;
        const cardWidth = 280; // Fixed card width
        const gap = 32; // 2rem gap
        
        // Calculate number of cards per row
        const cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));
        
        // Adjust grid columns
        projectsGrid.style.gridTemplateColumns = `repeat(${cardsPerRow}, ${cardWidth}px)`;
        
        // Ensure images are properly contained
        projectCards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.objectFit = 'cover';
            }
        });
    }

    // Initial adjustment
    adjustProjectCards();

    // Adjust on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjustProjectCards, 250);
    });

    // Handle image loading
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.onload = function() {
            this.style.opacity = '1';
        };
        
        img.onerror = function() {
            this.src = 'placeholder.png';
            this.alt = 'Image not available';
        };
    });

    // Handle project images orientation
    function handleProjectImages() {
        const projectImages = document.querySelectorAll('.project-image img');
        
        projectImages.forEach(img => {
            // Tạo một ảnh tạm để kiểm tra kích thước thực
            const tempImg = new Image();
            tempImg.src = img.src;
            
            tempImg.onload = function() {
                const parent = img.parentElement;
                // Xóa class cũ nếu có
                parent.classList.remove('portrait', 'landscape');
                
                // Thêm class dựa trên tỷ lệ ảnh
                if (this.width < this.height) {
                    parent.classList.add('portrait');
                } else {
                    parent.classList.add('landscape');
                }
            };
        });
    }

    // Gọi hàm khi trang load xong
    handleProjectImages();

    // Gọi lại khi window resize
    window.addEventListener('resize', () => {
        handleProjectImages();
    });

    // Language Switcher
    let currentLang = 'en';

    function updateLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update language switcher button text to show current language
        const langBtn = document.getElementById('langSwitch');
        langBtn.querySelector('span').textContent = lang.toUpperCase();
    }

    // Initialize language switcher
    document.getElementById('langSwitch').addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'fr' : 'en';
        updateLanguage(newLang);
    });

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function switchTab(tabId) {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to selected button and pane
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize first tab
    switchTab('education');
}); 