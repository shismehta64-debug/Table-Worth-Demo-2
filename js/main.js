document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor (desktop only) ---
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');

    if (cursorOuter && cursorInner) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorInner.style.left = mouseX + 'px';
            cursorInner.style.top = mouseY + 'px';
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursorOuter.style.left = cursorX + 'px';
            cursorOuter.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        document.querySelectorAll('a, button, .menu-card-v2, .service-v2-card, .philo-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // --- Preloader ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transition = 'opacity 0.6s ease';
                setTimeout(() => preloader.style.display = 'none', 600);
            }, 1200);
        }
    });

    // --- Navbar scroll state ---
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-item, .nav-contact-btn').forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Reveal on Scroll (using CSS .reveal class) ---
    // Add .reveal and optional .reveal-delay-N to elements in HTML
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    // --- Stagger service cards ---
    document.querySelectorAll('.service-v2-card').forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${i * 0.08}s`;
    });

    // Re-observe service cards since we just added the class
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-v2-card').forEach(el => serviceObserver.observe(el));

    // --- Stat counter animation ---
    const animateValue = (el, start, end, duration) => {
        const range = end - start;
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(start + range * eased) + '+';
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const counters = document.querySelectorAll('.m-num, .stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.replace('+', '');
                const end = parseInt(text, 10);
                if (!isNaN(end)) animateValue(el, 0, end, 1800);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));

});
