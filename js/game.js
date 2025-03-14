const gameLevels = [
    {
        question: "Jak przesunąć postać o 100px w prawo?",
        options: [
            "character.style.left = '100px'",
            "character.style.transform = 'translateX(100px)'",
            "character.move(100)",
            "character.left += 100"
        ],
        correctAnswer: 1
    },
    {
        question: "Jak zmienić kolor postaci na niebieski?",
        options: [
            "character.color = 'blue'",
            "character.style.backgroundColor = 'blue'",
            "character.setColor('blue')",
            "character.fill = 'blue'"
        ],
        correctAnswer: 1
    },
    // Dodaj więcej poziomów tutaj...
];

class Game {
    constructor() {
        this.currentLevel = 0;
        this.character = document.querySelector('.game-character');
        this.optionsContainer = document.querySelector('.code-options');
        this.messageElement = document.getElementById('game-message');
        this.levelIndicator = document.getElementById('current-level');
        this.progressDots = document.querySelectorAll('.progress-dot');
        
        this.initGame();
    }

    initGame() {
        this.loadLevel(this.currentLevel);
        this.updateProgress();
    }

    loadLevel(levelIndex) {
        const level = gameLevels[levelIndex];
        this.optionsContainer.innerHTML = '';
        
        level.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'code-option';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(index));
            this.optionsContainer.appendChild(button);
        });

        // Reset character position
        this.character.style.transform = 'translateX(0)';
    }

    checkAnswer(selectedIndex) {
        const level = gameLevels[this.currentLevel];
        
        if (selectedIndex === level.correctAnswer) {
            this.showMessage('Świetnie! Prawidłowa odpowiedź!', 'success');
            this.animateCharacter();
            this.markProgress(this.currentLevel);
            
            setTimeout(() => {
                if (this.currentLevel < gameLevels.length - 1) {
                    this.currentLevel++;
                    this.loadLevel(this.currentLevel);
                    this.updateProgress();
                } else {
                    this.showGameComplete();
                }
            }, 1500);
        } else {
            this.showMessage('Spróbuj jeszcze raz!', 'error');
        }
    }

    animateCharacter() {
        this.character.style.transform = 'translateX(200px)';
    }

    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `game-message show ${type}`;
        setTimeout(() => {
            this.messageElement.classList.remove('show');
        }, 2000);
    }

    updateProgress() {
        this.levelIndicator.textContent = this.currentLevel + 1;
    }

    markProgress(level) {
        this.progressDots[level].classList.add('completed');
    }

    showGameComplete() {
        this.optionsContainer.innerHTML = '';
        this.showMessage('Gratulacje! Ukończyłeś wszystkie poziomy!', 'success');
        // Możesz dodać tutaj dodatkowe efekty lub akcje po ukończeniu gry
    }
}

// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.getElementById('mainNav');
const navbarHeight = navbar.offsetHeight;
let isNavbarVisible = true;
let hideNavbarTimeout;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show navbar when scrolling up
    if (scrollTop < lastScrollTop) {
        if (!isNavbarVisible) {
            navbar.classList.remove('navbar-hidden');
            isNavbarVisible = true;
        }
        clearTimeout(hideNavbarTimeout);
        
        // Hide navbar after 3 seconds of no upward scrolling
        hideNavbarTimeout = setTimeout(() => {
            if (scrollTop > navbarHeight) {
                navbar.classList.add('navbar-hidden');
                isNavbarVisible = false;
            }
        }, 3000);
    } 
    // Hide navbar when scrolling down
    else if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
        navbar.classList.add('navbar-hidden');
        isNavbarVisible = false;
    }
    
    lastScrollTop = scrollTop;
});

// Inicjalizacja gry po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
