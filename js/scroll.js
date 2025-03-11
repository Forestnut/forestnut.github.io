document.addEventListener('DOMContentLoaded', () => {
    const sections = ['hero', 'profile', 'projects', 'demo']; // Usuń 'footer' z tablicy
    const sectionDots = document.querySelector('.section-indicator');
    const scrollContainer = document.querySelector('.scroll-container');
    let isScrolling = false;
    let currentSection = 0;
    let lastScrollTop = 0;
    
    // Create dots
    sectionDots.innerHTML = sections.map((section, index) => `
        <div class="section-dot ${index === 0 ? 'active' : ''}" data-section="${section}"></div>
    `).join('');

    const navDots = document.querySelectorAll('.section-dot');

    function updateDots(index) {
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index].classList.add('active');
    }

    function scrollToSection(index) {
        if (isScrolling) return;
        
        isScrolling = true;
        currentSection = index;
        
        const targetSection = document.getElementById(sections[index]);
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        updateDots(index);
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // Obsługa przewijania kółkiem myszy
    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextSection = Math.min(Math.max(currentSection + direction, 0), sections.length - 1);
        
        if (nextSection !== currentSection) {
            scrollToSection(nextSection);
        }
    }, { passive: false });

    // Obsługa klawiszy strzałek
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

    // Obsługa kliknięcia w kropkę
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentSection !== index) {
                scrollToSection(index);
            }
        });
    });

    // W obsłudze scrollowania usuń specjalną logikę dla stopki
    scrollContainer.addEventListener('scroll', () => {
        if (isScrolling) return;

        const st = scrollContainer.scrollTop;
        const vh = window.innerHeight;
        const currentIndex = Math.round(st / vh);
        
        if (currentSection !== currentIndex && currentIndex < sections.length) {
            currentSection = currentIndex;
            updateDots(currentIndex);
        }
        
        lastScrollTop = st;
    });

    // Inicjalna aktualizacja kropek
    updateDots(0);
});
