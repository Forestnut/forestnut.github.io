document.addEventListener('DOMContentLoaded', () => {
    const sections = ['hero', 'stats', 'technologies', 'projects', 'game'];
    const sectionElements = sections.map(id => document.getElementById(id));
    const sectionDots = document.querySelector('.section-indicator');
    let isScrolling = false;
    let currentSection = 0;
    let lastWheelTime = Date.now();
    const wheelDelay = 1000; // Minimalny czas między scrollowaniami (1 sekunda)

    // Create dots
    sectionDots.innerHTML = sections.map((section, index) => `
        <div class="section-dot ${index === 0 ? 'active' : ''}" data-section="${section}"></div>
    `).join('');

    const navDots = document.querySelectorAll('.section-dot');

    function updateDots(index) {
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index]?.classList.add('active');
    }

    // Uproszczona funkcja scrollowania
    function scrollToSection(index) {
        if (isScrolling || index === currentSection) return;
        
        isScrolling = true;
        currentSection = index;
        
        const targetSection = sectionElements[index];
        if (targetSection) {
            const isMobile = window.innerWidth <= 768;
            const duration = isMobile ? 700 : 1000;
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateDots(index);
            
            // Dostosuj czas blokady scrollowania dla mobile
            setTimeout(() => {
                isScrolling = false;
            }, duration + 1000);
        }
    }

    // Handle dot clicks
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => scrollToSection(index));
    });

    // Zmodyfikowany Observer z obsługą nawbara
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = sections.indexOf(entry.target.id);
                if (index !== -1) {
                    currentSection = index;
                    updateDots(index);
                    
                    // Obsługa widoczności nawbara
                    const navbar = document.querySelector('.navbar');
                    if (entry.target.id === 'hero') {
                        navbar.style.transform = 'translateY(0)';
                    } else {
                        navbar.style.transform = 'translateY(-100%)';
                    }
                }
            }
        });
    }, { threshold: 0.2 }); // Zmniejszone z 0.5 na 0.2

    sectionElements.forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    });

    // Poprawiona obsługa wheel
    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling || wheelTimeout) {
            return;
        }
        
        const direction = Math.sign(e.deltaY);
        
        if (direction > 0 && currentSection < sections.length - 1) {
            scrollToSection(currentSection + 1);
        } else if (direction < 0 && currentSection > 0) {
            scrollToSection(currentSection - 1);
        }

        wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
        }, 1500);
    }, { passive: false });

    // Dodanie zmiennych dla obsługi dotyku
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    const touchDelay = 500;
    let lastTouchTime = 0;

    // Obsługa dotyku
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        // Zapobiegaj domyślnemu scrollowaniu
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const currentTime = Date.now();

        // Sprawdź czy minął wystarczający czas od ostatniego dotknięcia
        if (currentTime - lastTouchTime < touchDelay) {
            return;
        }

        // Oblicz odległość i kierunek przesunięcia
        const swipeDistance = touchStartY - touchEndY;
        const isValidSwipe = Math.abs(swipeDistance) > minSwipeDistance && touchDuration < maxSwipeTime;

        if (isValidSwipe && !isScrolling) {
            if (swipeDistance > 0 && currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            } else if (swipeDistance < 0 && currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
            lastTouchTime = currentTime;
        }
    }, { passive: true });

    // Initialize
    window.scrollTo(0, 0);
    updateDots(0);
});
