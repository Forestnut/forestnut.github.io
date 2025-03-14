document.addEventListener('DOMContentLoaded', () => {
    const sections = ['hero', 'stats', 'technologies', 'projects', 'demo'];
    const sectionElements = sections.map(id => document.getElementById(id));
    const sectionDots = document.querySelector('.section-indicator');
    let isScrolling = false;
    let currentSection = 0;

    // Create dots
    sectionDots.innerHTML = sections.map((section, index) => `
        <div class="section-dot ${index === 0 ? 'active' : ''}" data-section="${section}"></div>
    `).join('');

    const navDots = document.querySelectorAll('.section-dot');

    // Intersection Observer to track which section is currently visible
    const observer = new IntersectionObserver((entries) => {
        if (isScrolling) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = sections.indexOf(entry.target.id);
                if (index !== -1) {
                    currentSection = index;
                    updateDots(index);
                }
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe all sections
    sectionElements.forEach(section => observer.observe(section));

    function updateDots(index) {
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index].classList.add('active');
    }

    function scrollToSection(index) {
        if (isScrolling) return;
        
        isScrolling = true;
        currentSection = index;

        const duration = isMobile ? 700 : 1000; // Shorter duration on mobile

        sectionElements[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        updateDots(index);
        
        // Adjust timeout for mobile
        setTimeout(() => {
            isScrolling = false;
        }, duration + 100);
    }

    // Handle mouse wheel
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const targetSection = Math.min(Math.max(currentSection + direction, 0), sections.length - 1);
        
        if (targetSection !== currentSection) {
            scrollToSection(targetSection);
        }
    }, { passive: false });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            const nextSection = Math.min(currentSection + 1, sections.length - 1);
            if (nextSection !== currentSection) {
                scrollToSection(nextSection);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            const nextSection = Math.max(currentSection - 1, 0);
            if (nextSection !== currentSection) {
                scrollToSection(nextSection);
            }
        }
    });

    // Handle dot clicks
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentSection !== index) {
                scrollToSection(index);
            }
        });
    });

    // Initialize with first section
    updateDots(0);

    // Touch handling variables
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    const minSwipeDistance = 50; // Minimalna odległość przesunięcia
    const maxSwipeTime = 300; // Maksymalny czas przesunięcia (ms)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Touch event handlers
    document.addEventListener('touchstart', (e) => {
        if (isScrolling) return;
        
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (isScrolling) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const swipeDistance = touchEndY - touchStartY;
        const swipeTime = touchEndTime - touchStartTime;

        // Sprawdź czy gest był wystarczająco szybki i długi
        if (Math.abs(swipeDistance) >= minSwipeDistance && swipeTime <= maxSwipeTime) {
            const direction = swipeDistance > 0 ? -1 : 1;
            const targetSection = Math.min(Math.max(currentSection + direction, 0), sections.length - 1);
            
            if (targetSection !== currentSection) {
                scrollToSection(targetSection);
            }
        }
    }, { passive: true });

    // Add touch feedback for dots
    if (isMobile) {
        navDots.forEach(dot => {
            dot.addEventListener('touchstart', () => {
                dot.style.transform = 'scale(1.2)';
            });
            
            dot.addEventListener('touchend', () => {
                dot.style.transform = '';
            });
        });
    }

    // Navbar visibility handling
    let lastScrollY = window.scrollY;
    let scrollDirection = 'up';
    let ticking = false;
    
    function handleNavbarVisibility() {
        if (window.innerWidth > 768) return; // Only for mobile
        
        const currentScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        // Determine scroll direction
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        // Show/hide navbar based on scroll direction and position
        if (scrollDirection === 'down' && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavbarVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Show navbar when touching top of screen
    document.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientY < 50) {
            document.querySelector('.navbar').classList.remove('hidden');
        }
    }, { passive: true });
});
