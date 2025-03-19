const gameLevels = [
    {
        question: "Co oznacza skrót HTML?",
        mainQuestion: "Poziom 1",
        options: [
            "HyperText Markup Language",
            "HighText Markup Language",
            "Hyper Transfer Markup Language",
            "High Transfer Markup Language"
        ],
        correctAnswer: 0,
        movement: 60,
        hint: "HTML jest podstawowym językiem znaczników dla stron internetowych"
    },
    {
        question: "Co to jest zmienna w programowaniu?",
        mainQuestion: "Poziom 2",
        options: [
            "To funkcja, która wykonuje operacje matematyczne",
            "To miejsce w pamięci, gdzie przechowywana jest wartość",
            "To typ danych, który przechowuje tekst",
            "To blok kodu, który wykonuje określoną czynność"
        ],
        correctAnswer: 1,
        movement: 60,
        hint: "Zmienne przechowują wartości, które mogą się zmieniać w czasie działania programu"
    },
    {
        question: "Jaki jest cel stosowania pętli w programowaniu?",
        mainQuestion: "Poziom 3",
        options: [
            "Wykonanie kodu raz",
            "Pętla pozwala na wielokrotne wykonanie tego samego kodu",
            "Stworzenie funkcji",
            "Sprawdzenie warunku logicznego"
        ],
        correctAnswer: 1,
        movement: 60,
        hint: "Pętla umożliwia wielokrotne wykonywanie tego samego fragmentu kodu"
    },
    {
        question: "Jakie dane przechowujemy za pomocą typu Boolean?",
        mainQuestion: "Poziom 4",
        options: [
            "Liczby zmiennoprzecinkowe",
            "Tekstowe ciągi znaków",
            "Prawda lub fałsz",
            "Liczby całkowite"
        ],
        correctAnswer: 2,
        movement: 60,
        hint: "Typ Boolean przechowuje jedynie dwie wartości: prawda (true) lub fałsz (false)"
    },
    {
        question: "Do czego służy SQL?",
        mainQuestion: "Poziom 5",
        options: [
            "Do tworzenia aplikacji internetowych",
            "Do zarządzania bazami danych",
            "Do tworzenia gier komputerowych",
            "Do programowania systemów operacyjnych"
        ],
        correctAnswer: 1,
        movement: 60,
        hint: "SQL (Structured Query Language) służy do zarządzania bazami danych"
    }
];

class Game {
    constructor() {
        this.currentLevel = 0;
        this.totalMovement = 0;
        this.setupGameElements();
        this.initGame();
        this.addTransitionEndListener();
    }

    setupGameElements() {
        const elements = {
            character: document.querySelector('.game-character'),
            optionsContainer: document.querySelector('.code-options'),
            messageElement: document.getElementById('game-message'),
            levelIndicator: document.getElementById('current-level'),
            progressDots: document.querySelectorAll('.progress-dot'),
            questionElement: document.querySelector('.game-question')
        };

        // Log what elements were not found
        Object.entries(elements).forEach(([name, element]) => {
            if (!element || (name === 'progressDots' && !element.length)) {
                console.warn(`Element not found: ${name}`);
            }
        });

        // Assign found elements
        Object.assign(this, elements);

        // Only return false if critical elements are missing
        if (!elements.character || !elements.optionsContainer) {
            console.error('Critical game elements missing');
            return false;
        }

        return true;
    }

    initGame() {
        this.totalMovement = 0;
        if (this.character) {
            this.character.style.transform = 'translateX(0)';
        }
        this.loadLevel(this.currentLevel);
        this.updateProgress();
    }

    loadLevel(levelIndex) {
        if (levelIndex >= gameLevels.length) return;
        
        const level = gameLevels[levelIndex];
        
        // Aktualizuj pytania
        const mainQuestionElement = document.querySelector('.game-main-question');
        const subQuestionElement = document.querySelector('.game-sub-question');
        
        if (mainQuestionElement) {
            mainQuestionElement.textContent = level.mainQuestion;
        }
        
        if (subQuestionElement) {
            subQuestionElement.textContent = level.question;
        }

        // Reset character position and opacity
        if (this.character) {
            this.character.style.transform = 'translateX(0)';
            this.character.style.opacity = '1';
        }
        
        if (this.optionsContainer) {
            this.optionsContainer.innerHTML = '';
            level.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'code-option col';
                button.textContent = option;
                button.addEventListener('click', () => this.checkAnswer(index));
                this.optionsContainer.appendChild(button);
            });
        }
    }

    checkAnswer(selectedIndex) {
        const level = gameLevels[this.currentLevel];
        const buttons = document.querySelectorAll('.code-option');
        
        buttons.forEach(button => {
            button.disabled = true;
        });
        
        if (selectedIndex === level.correctAnswer) {
            this.showMessage('Świetnie! Prawidłowa odpowiedź!', 'success');
            buttons[selectedIndex].classList.add('correct');
            this.totalMovement += level.movement;
            this.animateCharacter();
            this.markProgress(this.currentLevel);
            
            setTimeout(() => {
                if (this.currentLevel < gameLevels.length - 1) {
                    this.currentLevel++;
                    this.loadLevel(this.currentLevel);
                    this.updateProgress();
                    buttons.forEach(button => button.disabled = false);
                } else {
                    // Zmodyfikowana sekwencja końcowa
                    setTimeout(() => {
                        this.character.style.transform = `translateX(${window.innerWidth - 100}px)`;
                        this.character.style.opacity = '0';
                        setTimeout(() => {
                            this.showGameComplete();
                        }, 1000);
                    }, 500);
                }
            }, 1500);
        } else {
            this.showMessage('Spróbuj jeszcze raz!', 'error');
            buttons[selectedIndex].classList.add('wrong');
            
            setTimeout(() => {
                buttons.forEach(button => {
                    button.disabled = false;
                    button.classList.remove('wrong');
                });
            }, 1500);
        }
    }

    animateCharacter() {
        if (this.character) {
            // Dodaj efekt skoku podczas ruchu
            this.character.style.transform = `translateX(${this.totalMovement}px) translateY(-10px)`;
            setTimeout(() => {
                this.character.style.transform = `translateX(${this.totalMovement}px)`;
            }, 150);
        }
    }

    showMessage(text, type) {
        if (this.messageElement) {
            this.messageElement.textContent = text;
            this.messageElement.className = `game-message ${type} show`;
            setTimeout(() => {
                this.messageElement.classList.remove('show');
            }, 2000);
        }
    }

    updateProgress() {
        if (this.levelIndicator) {
            this.levelIndicator.textContent = this.currentLevel + 1;
        }
        
        this.progressDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentLevel);
        });
    }

    markProgress(level) {
        if (this.progressDots[level]) {
            this.progressDots[level].classList.add('completed');
        }
    }

    showGameComplete() {
        const gameContainer = document.querySelector('.game-container');
        
        // Fade out existing content
        gameContainer.style.opacity = '0';
        
        setTimeout(() => {
            gameContainer.innerHTML = `
                <div class="game-complete">
                    <h2 style="font-size: 2rem; margin-bottom: 1.5rem;">Gratulacje! 🎉</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 1rem; opacity: 0.9;">
                        Świetnie się spisałeś! Udowodniłeś, że masz już podstawową wiedzę o programowaniu.
                    </p>
                    <p style="font-size: 1.1rem; margin-bottom: 2rem; color: var(--primary-color);">
                        Dołącz do nas i rozwiń swoje umiejętności!
                    </p>
                    <a href="https://zs1.lublin.eu" class="cta-button" target="_blank">
                        Odwiedź naszą szkołę
                    </a>
                </div>
            `;
            gameContainer.style.opacity = '1';
        }, 300);
    }

    // Nowa metoda resetująca grę
    restartGame() {
        this.currentLevel = 0;
        this.totalMovement = 0;
        if (this.character) {
            this.character.style.transform = 'translateX(0)';
            this.character.style.opacity = '1';
        }
        if (this.messageElement) {
            this.messageElement.textContent = '';
            this.messageElement.className = 'game-message';
        }
        this.loadLevel(this.currentLevel);
        this.updateProgress();
    }

    addTransitionEndListener() {
        if (this.character) {
            this.character.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'transform' && this.currentLevel === gameLevels.length) {
                    this.character.style.transform += ' scale(0)';
                    setTimeout(() => {
                        this.showGameComplete();
                    }, 500);
                }
            });
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
