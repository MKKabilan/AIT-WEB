/* ================================================
   ASSUREINFO TECHNOLOGIES — JAVASCRIPT
   Premium Corporate Website Interactions
   ================================================ */

(function() {
    'use strict';

    // ============================================
    // 1. UTILITY FUNCTIONS
    // ============================================
    const select = (el, scope = document) => scope.querySelector(el);
    const selectAll = (el, scope = document) => Array.from(scope.querySelectorAll(el));

    // ============================================
    // 2. NAVBAR SCROLL EFFECT & SCROLL PROGRESS
    // ============================================
    const navbar = select('#navbar');
    const scrollProgress = select('#scrollProgress');
    const backToTop = select('#backToTop');
    
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Navbar Shrink
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Scroll Progress Bar
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
        
        // Back to top button visibility
        if (backToTop) {
            if (scrollTop > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============================================
    // 3. MOBILE MENU TOGGLE
    // ============================================
    const navToggle = select('#navToggle');
    const navMenu = select('#navMenu');
    const mobileOverlay = select('#mobileOverlay');

    const toggleMenu = (open) => {
        const isActive = open !== undefined ? open : !navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active', isActive);
        navToggle.classList.toggle('active', isActive);
        mobileOverlay.classList.toggle('active', isActive);
        navToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    if (navToggle) {
        navToggle.addEventListener('click', () => toggleMenu());
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Close mobile menu when a link is clicked
    selectAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu(false);
            navToggle.focus();
        }
    });

    // ============================================
    // 4. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
    // ============================================
    const reveals = selectAll('.reveal');

    if ('IntersectionObserver' in window && reveals.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.12
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('reveal--visible'));
    }

    // ============================================
    // 5. RIPPLE EFFECT FOR BUTTONS
    // ============================================
    const rippleButtons = selectAll('[data-ripple]');

    const createRipple = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        
        // Calculate size and position
        const size = Math.max(rect.width, rect.height);
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left - size / 2;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top - size / 2;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Append and remove
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    };

    rippleButtons.forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // ============================================
    // 6. BACKGROUND PARALLAX EFFECT
    // ============================================
    const blobBlue = select('#blobBlue');
    const blobOrange = select('#blobOrange');
    
    let ticking = false;

    const updateParallax = () => {
        const scrollY = window.pageYOffset;
        
        if (blobBlue) {
            // Move blue blob slightly slower than scroll
            blobBlue.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
        }
        if (blobOrange) {
            // Move orange blob slightly faster than scroll
            blobOrange.style.transform = `translate3d(0, ${scrollY * -0.1}px, 0)`;
        }
        
        ticking = false;
    };

    const requestParallaxUpdate = () => {
        if (!ticking && !prefersReducedMotion) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }

    // ============================================
    // 7. BACK TO TOP BUTTON
    // ============================================
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            if (prefersReducedMotion) {
                window.scrollTo(0, 0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ============================================
    // 8. SMOOTH SCROLL FOR INTERNAL ANCHORS
    // ============================================
    // Note: CSS handles basic scroll-behavior: smooth, 
    // but this ensures it works consistently and allows offset for navbar if needed.
    selectAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignore if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = select(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight + 20;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ============================================
    // 9. INITIALIZE ON DOM LOAD
    // ============================================
    // Trigger initial scroll check in case page loads at a scrolled position
    handleScroll();

})();