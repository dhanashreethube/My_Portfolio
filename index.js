/* ==========================================================================
   INITIALIZE ICONS & CORE FUNCTIONALITY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all components
    initScrollProgress();
    initStickyNavbar();
    initMobileMenu();
    initScrollReveal();
    initTypewriter();
    initContactForm();
});

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
    const progressEl = document.getElementById('scroll-progress');
    if (!progressEl) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        progressEl.style.width = scrolled + '%';
    });
}

/* ==========================================================================
   STICKY NAVBAR & ACTIVE SCROLL SPY
   ========================================================================== */
function initStickyNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    if (!navbar) return;

    // Sticky Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        highlightNavLinks();
    });

    // Active Section Link Highlighter
    function highlightNavLinks() {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 200; // offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Initial highlight run
    highlightNavLinks();
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuIcon = document.getElementById('menu-icon');

    if (!hamburgerBtn || !navMenu) return;

    // Toggle menu visibility
    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        
        // Update menu icon
        if (isOpen) {
            menuIcon.setAttribute('data-lucide', 'x');
        } else {
            menuIcon.setAttribute('data-lucide', 'menu');
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuIcon.setAttribute('data-lucide', 'menu');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
}

/* ==========================================================================
   SCROLL-TRIGGERED ENTRANCE ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    // Config options
    const observerOptions = {
        root: null, // use screen viewport
        rootMargin: '0px 0px -8% 0px', // trigger slightly before element reaches bottom
        threshold: 0.1 // 10% of element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing after it has animated in once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* ==========================================================================
   HERO TEXT CYCLING ANIMATION (TYPEWRITER STYLE)
   ========================================================================== */
function initTypewriter() {
    const typewriterText = document.getElementById('typewriter-text');
    if (!typewriterText) return;

    const words = ["Frontend Developer", "React Specialist", "Full Stack Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typewriterText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deleting
        } else {
            // Add character
            typewriterText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing
        }

        // Handle word completion transitions
        if (!isDeleting && charIndex === currentWord.length) {
            // Word finished typing - pause
            typingSpeed = 2200; // wait 2.2 seconds
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Word deleted - switch to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // brief pause before starting next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start Typewriter
    setTimeout(type, 1000);
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success-message');
    const resetBtn = document.getElementById('form-reset-btn');

    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Fetch inputs for visual feedback
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Perform basic validation
        if (!name || !email || !subject || !message) return;

        // Visual feedback logic (fade out form, slide up thank you)
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            successMsg.classList.add('show');
        }, 300);
    });

    // Reset Form button action
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            successMsg.classList.remove('show');
            setTimeout(() => {
                form.reset();
                form.style.display = 'flex';
                form.style.opacity = '1';
            }, 400);
        });
    }
}
