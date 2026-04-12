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

    // --- Stagger reveal elements across the site ---
    const staggerSelectors = [
        '.service-v2-card',
        '.philo-card',
        '.t-step',
        '.cert-item',
        '.v-card',
        '.contact-container'
    ];

    document.querySelectorAll(staggerSelectors.join(', ')).forEach((card, i) => {
        card.classList.add('reveal');
        // Calculate a local delay simply to keep staggered look but not wait forever
        card.style.transitionDelay = `${(i % 5) * 0.1}s`;
    });

    // Re-observe since we just added the class
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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

    // --- EmailJS Contact Form Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // You MUST replace 'YOUR_PUBLIC_KEY_HERE' with your actual public key from the EmailJS dashboard
        emailjs.init("_uDDxsjkpBFsLNtwu");

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // You MUST replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with actual keys
            emailjs.sendForm('service_b0ux1dm', 'template_u0trm58', this)
                .then(function () {
                    btn.textContent = 'Message Sent Successfully!';
                    btn.style.background = '#10B981'; // Premium success green
                    contactForm.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                    }, 4000);
                }, function (error) {
                    console.error('Email failed to send...', error);
                    btn.textContent = 'Failed. Contact Support.';
                    btn.style.background = '#EF4444'; // Premium error red
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                    }, 4000);
                });
        });
    }

});
