// Zmodyfikowana inicjalizacja AOS dla lepszej wydajności na mobile
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 400, // Szybsze animacje na mobile
        once: true,
        offset: window.innerWidth < 768 ? 20 : 50,
        delay: window.innerWidth < 768 ? 0 : 50,
        disable: window.innerWidth < 380
    });

    tsParticles.load("hero-particles", {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle" },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": { "enable": false }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": { "enable": false }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": { "enable": false }
            }
        },
        "interactivity": {
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    });
});

// Dostosowanie Typed.js dla urządzeń mobilnych
new Typed('#hero-title', {
    strings: ['Zostań Programistą', 'Twórz Aplikacje', 'Rozwijaj Się z Nami'],
    typeSpeed: window.innerWidth < 768 ? 30 : 50,
    backSpeed: window.innerWidth < 768 ? 20 : 30,
    backDelay: window.innerWidth < 768 ? 1500 : 2000,
    loop: true
});

// Optymalizacja GSAP dla mobile
gsap.registerPlugin(ScrollTrigger);
const isMobile = window.innerWidth < 768;

// Zmodyfikowany parallax effect
gsap.to("#hero-background", {
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: isMobile ? 0.5 : true
    },
    y: isMobile ? 100 : 200
});

// Update Swiper configuration for better mobile experience
const projectSlider = new Swiper('.project-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    breakpoints: {
        480: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 25
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30
        }
    }
});

// Optymalizacja animacji statystyk dla mobile
const stats = [
    { element: '#projects-count', end: 50 },
    { element: '#students-count', end: 120 },
    { element: '#success-rate', end: 95 }
];

stats.forEach(stat => {
    const counter = { value: 0 };
    
    gsap.to(counter, {
        value: stat.end,
        duration: isMobile ? 1 : 2,
        scrollTrigger: {
            trigger: stat.element,
            start: "top center+=100",
            toggleActions: "play none none reverse"
        },
        onUpdate: () => {
            document.querySelector(stat.element).textContent = 
                Math.round(counter.value);
        }
    });
});

// Dostosowanie nawigacji na mobile
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollTop = window.scrollY;
    
    // Zabezpieczenie przed zbyt częstym wykonywaniem
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show navbar
            navbar.style.transform = 'translateY(0)';
            navbar.style.background = currentScrollTop > 50 ? 
                'rgba(255, 255, 255, 0.98)' : 
                'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = currentScrollTop > 50 ? 
                '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        }
        lastScrollTop = currentScrollTop;
    }, isMobile ? 100 : 0); // Dodanie debounce dla mobile
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = isMobile ? 40 : 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            // Płynniejsze scrollowanie na mobile
            const duration = 800;
            const start = window.scrollY;
            const distance = offsetPosition - start;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Funkcja ease-out dla płynniejszego ruchu
                const ease = t => t * (2 - t);
                
                window.scrollTo(0, start + (distance * ease(progress)));

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
            
            // Zamknij mobile menu jeśli jest otwarte
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenuBtn.click();
            }
        }
    });
});

// Enhanced Footer Interaction
const footer = document.querySelector('.footer');
const footerPreview = document.querySelector('.footer-preview');
const footerContent = document.querySelector('.footer-content');
const expandFooter = document.querySelector('.expand-footer');

// Zmienna do śledzenia czy można scrollować wewnątrz stopki
let isScrollingFooter = false;

// Obsługa scrollowania wewnątrz stopki
footerContent.addEventListener('touchstart', (e) => {
    const footerContentHeight = footerContent.scrollHeight;
    const footerVisibleHeight = footerContent.clientHeight;
    
    // Sprawdź czy zawartość wymaga scrollowania
    if (footerContentHeight > footerVisibleHeight) {
        isScrollingFooter = true;
        e.stopPropagation(); // Zapobiega propagacji do głównej stopki
    }
}, { passive: true });

footerContent.addEventListener('touchmove', (e) => {
    if (isScrollingFooter) {
        e.stopPropagation(); // Pozwól na naturalne scrollowanie contentu
    }
}, { passive: false });

footerContent.addEventListener('touchend', () => {
    isScrollingFooter = false;
});

// Zmodyfikowana obsługa touchstart dla stopki
footer.addEventListener('touchstart', (e) => {
    if (isScrollingFooter) return; // Nie rozpoczynaj gestu jeśli scrollujemy content
    
    footerTouchStartY = e.touches[0].clientY;
    footerDragging = true;
    footer.style.transition = 'none';
}, { passive: true });

// Zmodyfikowana obsługa touchmove dla stopki
footer.addEventListener('touchmove', (e) => {
    if (isScrollingFooter || !footerDragging) return;
    
    footerTouchEndY = e.touches[0].clientY;
    const diff = footerTouchEndY - footerTouchStartY;
    
    // Sprawdź kierunek przewijania
    if (footer.classList.contains('expanded')) {
        // Jeśli stopka jest rozwinięta, pozwól na scroll w dół
        if (diff > 0) {
            e.preventDefault();
            const newTransform = Math.min(diff, footer.offsetHeight);
            footer.style.transform = `translateY(${newTransform}px)`;
        }
    } else {
        // Jeśli stopka jest zwinięta, pozwól na scroll w górę
        if (diff < 0) {
            e.preventDefault();
            const newTransform = Math.max(diff, -footer.offsetHeight);
            footer.style.transform = `translateY(${newTransform}px)`;
        }
    }
}, { passive: false });

// Zmodyfikowana funkcja toggleFooter
function toggleFooter() {
    const wasExpanded = footer.classList.contains('expanded');
    
    footer.classList.toggle('expanded');
    
    if (!wasExpanded) {
        footerContent.scrollTop = 0;
        if (isMobile) {
            document.body.style.overflow = 'hidden';
        }
    } else {
        document.body.style.overflow = '';
    }
    
    footer.setAttribute('aria-expanded', (!wasExpanded).toString());
    expandFooter.setAttribute('aria-label', wasExpanded ? 'Rozwiń stopkę' : 'Zwiń stopkę');
}

// Clear any existing event listeners
footerPreview.replaceWith(footerPreview.cloneNode(true));
expandFooter.replaceWith(expandFooter.cloneNode(true));

// Re-assign elements after cloning
const newFooterPreview = document.querySelector('.footer-preview');
const newExpandFooter = document.querySelector('.expand-footer');

// Add event listeners
newFooterPreview.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFooter();
});

newExpandFooter.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFooter();
});

// Close footer when clicking outside
document.addEventListener('click', (e) => {
    if (!footer.contains(e.target) && footer.classList.contains('expanded')) {
        toggleFooter();
    }
});

// Dodaj obsługę scrollowania kółkiem myszy w rozwiniętej stopce
footerContent.addEventListener('wheel', (e) => {
    if (footer.classList.contains('expanded')) {
        const scrollTop = footerContent.scrollTop;
        const scrollHeight = footerContent.scrollHeight;
        const height = footerContent.clientHeight;

        // Zapobiegaj przewijaniu strony, gdy jesteśmy na górze lub dole contentu
        if ((scrollTop === 0 && e.deltaY < 0) || 
            (scrollTop + height >= scrollHeight && e.deltaY > 0)) {
            e.preventDefault();
        }
    }
}, { passive: false });

// Zmodyfikuj zamykanie po kliknięciu poza stopką
document.addEventListener('click', (e) => {
    if (!footer.contains(e.target) && 
        footer.classList.contains('expanded')) {
        toggleFooter();
    }
});

// Kliknięcie w dowolne miejsce w stopce
footerPreview.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFooter();
});

// Kliknięcie w rozwinięte elementy stopki nie powinno jej zwijać
footer.querySelector('.footer-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Obsługa kliknięcia przycisku rozwijania
expandFooter.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFooter();
});

// Ulepszona obsługa footer na mobile
let footerTouchStartY = 0;
let footerTouchEndY = 0;
let footerDragging = false;

footer.addEventListener('touchstart', (e) => {
    footerTouchStartY = e.touches[0].clientY;
    footerDragging = true;
    footer.style.transition = 'none';
}, { passive: true });

footer.addEventListener('touchmove', (e) => {
    if (!footerDragging) return;
    
    footerTouchEndY = e.touches[0].clientY;
    const diff = footerTouchEndY - footerTouchStartY;
    
    if (Math.abs(diff) > 10) {
        e.preventDefault();
        const newTransform = Math.max(0, Math.min(diff, footer.offsetHeight));
        footer.style.transform = `translateY(${newTransform}px)`;
    }
}, { passive: false });

footer.addEventListener('touchend', () => {
    footerDragging = false;
    footer.style.transition = 'transform 0.3s ease-out';
    
    const diff = footerTouchEndY - footerTouchStartY;
    if (diff > 50) {
        footer.classList.remove('expanded');
    } else if (diff < -50) {
        footer.classList.add('expanded');
    }
    
    footer.style.transform = '';
});

// Funkcja przełączania stopki
function toggleFooter() {
    footer.classList.toggle('expanded');
    
    if (footer.classList.contains('expanded')) {
        footer.setAttribute('aria-expanded', 'true');
        expandFooter.setAttribute('aria-label', 'Zwiń stopkę');
    } else {
        footer.setAttribute('aria-expanded', 'false');
        expandFooter.setAttribute('aria-label', 'Rozwiń stopkę');
    }
}

// Zamykanie po kliknięciu poza stopką
document.addEventListener('click', (e) => {
    if (!footer.contains(e.target) && footer.classList.contains('expanded')) {
        footer.classList.remove('expanded');
    }
});

// Obsługa klawiatury (dostępność)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && footer.classList.contains('expanded')) {
        footer.classList.remove('expanded');
    }
});

// Mobile menu handling
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    let menuScrollPosition = 0;
    
    mobileMenuBtn.addEventListener('click', () => {
        const isOpening = !mobileMenu.classList.contains('active');
        
        if (isOpening) {
            menuScrollPosition = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${menuScrollPosition}px`;
            document.body.style.width = '100%';
        } else {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, menuScrollPosition);
        }
        
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Add touch detection
document.documentElement.className += (('ontouchstart' in document.documentElement) ? ' touch' : ' no-touch');

// Dostosowanie rozmiaru contentu dla mobile
if (isMobile) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.minHeight = 'auto';
        section.style.padding = '40px 20px';
    });

    // Zmniejsz rozmiary fontów na mobile
    document.documentElement.style.setProperty('--h1-size', '28px');
    document.documentElement.style.setProperty('--h2-size', '24px');
    document.documentElement.style.setProperty('--h3-size', '20px');
    document.documentElement.style.setProperty('--p-size', '16px');
}

// Zmodyfikowana obsługa footer dla mobile
function toggleFooter() {
    const wasExpanded = footer.classList.contains('expanded');
    
    footer.classList.toggle('expanded');
    
    if (!wasExpanded) {
        footerContent.scrollTop = 0;
        if (isMobile) {
            // Na mobile, zostaw możliwość scrollowania body
            footer.style.height = '80vh';
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
        } else {
            document.body.style.overflow = 'hidden';
        }
    } else {
        if (isMobile) {
            footer.style.height = '';
            footer.style.position = '';
        }
        document.body.style.overflow = '';
    }
    
    footer.setAttribute('aria-expanded', (!wasExpanded).toString());
    expandFooter.setAttribute('aria-label', wasExpanded ? 'Rozwiń stopkę' : 'Zwiń stopkę');
}

// Dostosowanie contentu footera dla mobile
if (isMobile) {
    footerContent.style.maxHeight = '75vh';
    footerContent.style.overflow = 'auto';
    footerContent.style.WebkitOverflowScrolling = 'touch';
}

// Initialize Locomotive Scroll for smooth section-based scrolling
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: !isMobile, // Wyłącz smooth scroll na mobile
    multiplier: isMobile ? 1 : 0.8,
    lerp: isMobile ? 1 : 0.1, // Linear interpolation - natychmiastowa reakcja na mobile
    smartphone: {
        smooth: false,
        getDirection: true,
        touchMultiplier: 2
    },
    tablet: {
        smooth: false,
        getDirection: true,
        touchMultiplier: 2
    },
    class: 'is-revealed',
    reloadOnContextChange: true,
    touchMultiplier: 2,
    smoothMobile: false
});

// Popraw zachowanie scrollowania na mobile
if (isMobile) {
    // Nasłuchuj zdarzeń scroll
    scroll.on('scroll', (args) => {
        // Zapobiegaj przewijaniu podczas animacji
        if (args.scroll.y < 0 || args.scroll.y > args.limit.y) {
            args.scroll.y = Math.min(Math.max(args.scroll.y, 0), args.limit.y);
        }
    });

    // Reset scroll position przy zmianie orientacji
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            scroll.update();
        }, 100);
    });
}

// Zaktualizuj scroll przy zmianie rozmiaru okna
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        scroll.update();
    }, 250);
});

// Inicjalizacja sekcji
function initSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.setAttribute('data-scroll-section', '');
        section.style.minHeight = isMobile ? '100vh' : `${window.innerHeight}px`;
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSections();
    scroll.update();
    
    // Aktualizuj scroll po załadowaniu wszystkich obrazów
    window.addEventListener('load', () => {
        scroll.update();
    });
});

// Calculate and set section heights
function setSectionHeights() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.minHeight = `${window.innerHeight}px`;
        section.style.overflow = 'hidden';
    });
}

// Utility functions for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize section snapping
function initSectionSnapping() {
    const sections = document.querySelectorAll('section');
    let currentSection = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchStartTime = 0;
    let lastTouchY = 0;
    let lastTouchTime = 0;
    
    const scrollToSection = (index, duration = isMobile ? 700 : 1000) => {
        if (isScrolling) return;
        isScrolling = true;
        
        const targetSection = sections[index];
        scroll.scrollTo(targetSection, {
            duration: duration,
            easing: isMobile ? [0.23, 0.75, 0.32, 1] : [0.25, 0.00, 0.35, 1.00],
            callback: () => {
                setTimeout(() => {
                    isScrolling = false;
                    currentSection = index;
                }, 50); // Small delay to prevent immediate scrolling
            }
        });
    };

    // Optimized touch handling
    const touchStart = throttle((e) => {
        if (isScrolling) {
            isScrolling = false;
            scroll.stop();
        }
        touchStartY = e.touches[0].clientY;
        lastTouchY = touchStartY;
        touchStartTime = Date.now();
        lastTouchTime = touchStartTime;
    }, 16);

    const touchMove = throttle((e) => {
        const currentY = e.touches[0].clientY;
        const currentTime = Date.now();
        const deltaY = currentY - lastTouchY;
        const deltaTime = currentTime - lastTouchTime;
        
        // Calculate velocity (pixels per millisecond)
        const velocity = deltaY / (deltaTime || 16);
        
        lastTouchY = currentY;
        lastTouchTime = currentTime;
        
        return { velocity, deltaY };
    }, 16);

    const touchEnd = debounce((e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const totalDelta = touchEndY - touchStartY;
        const timeElapsed = Date.now() - touchStartTime;
        
        // Calculate swipe speed and distance thresholds
        const speed = Math.abs(totalDelta / timeElapsed);
        const isQuickSwipe = speed > 0.5;
        const isLongSwipe = Math.abs(totalDelta) > 100;
        
        if (isQuickSwipe || isLongSwipe) {
            if (totalDelta < 0 && currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1, isQuickSwipe ? 500 : 700);
            } else if (totalDelta > 0 && currentSection > 0) {
                scrollToSection(currentSection - 1, isQuickSwipe ? 500 : 700);
            } else {
                scrollToSection(currentSection, 300);
            }
        }
    }, 100);

    // Optimized wheel handling for desktop
    const handleWheel = throttle((e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            scrollToSection(currentSection - 1);
        }
    }, 100);

    if (isMobile) {
        window.addEventListener('touchstart', touchStart, { passive: true });
        window.addEventListener('touchmove', touchMove, { passive: true });
        window.addEventListener('touchend', touchEnd, { passive: true });
    } else {
        window.addEventListener('wheel', handleWheel, { passive: false });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setSectionHeights();
    initSectionSnapping();
    
    // Update heights on resize
    window.addEventListener('resize', setSectionHeights);
});

// Modify section styles for better mobile visibility
if (isMobile) {
    document.querySelectorAll('section').forEach(section => {
        section.style.minHeight = '100vh'; // Use minHeight instead of fixed height
        // Removed overflow and position styles to prevent content being cut off
    });
}

// [NOWY FRAGMENT] Lazy Loading obrazków
const images = document.querySelectorAll('img.lazy');
const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
        }
    });
});
images.forEach(img => imgObserver.observe(img));
