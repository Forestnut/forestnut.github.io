const gameLevels = [
    {
        question: "Jakim językiem programowania zaczniemy naszą przygodę?",
        mainQuestion: "Poziom 1: Początek przygody z programowaniem",
        options: [
            "Java - zaawansowany język obiektowy",
            "HTML - podstawowy język stron WWW",
            "Python - złożony język skryptowy",
            "C++ - niskopoziomowy język"
        ],
        correctAnswer: 1,
        movement: 100,
        hint: "Wybierz najbardziej podstawowy język do tworzenia stron internetowych"
    },
    {
        question: "Który język wykorzystamy do stylizacji strony?",
        mainQuestion: "Poziom 2: Dodajemy style do naszej strony",
        options: [
            "JavaScript - do interakcji",
            "CSS - do stylizacji",
            "PHP - do backendu",
            "SQL - do baz danych"
        ],
        correctAnswer: 1,
        movement: 100,
        hint: "CSS jest odpowiedzialny za wygląd stron WWW"
    },
    {
        question: "Co dodamy, aby strona była interaktywna?",
        mainQuestion: "Poziom 3: Czas na interaktywność",
        options: [
            "Więcej HTML",
            "JavaScript",
            "Więcej CSS",
            "XML"
        ],
        correctAnswer: 1,
        movement: 100,
        hint: "JavaScript pozwala na tworzenie interaktywnych elementów"
    },
    {
        question: "Jaki framework JavaScript wybierzemy?",
        mainQuestion: "Poziom 4: Wybieramy framework",
        options: [
            "Angular - złożony framework",
            "React - popularny framework",
            "Vue - prosty framework",
            "Svelte - nowy framework"
        ],
        correctAnswer: 1,
        movement: 100,
        hint: "React jest obecnie najpopularniejszym frameworkiem"
    },
    {
        question: "Czego użyjemy do przechowywania danych?",
        mainQuestion: "Poziom 5: Baza danych",
        options: [
            "Pliki tekstowe",
            "MongoDB - baza NoSQL",
            "MySQL - baza SQL",
            "Firebase - baza czasu rzeczywistego"
        ],
        correctAnswer: 2,
        movement: 100,
        hint: "MySQL jest świetnym wyborem na początek przygody z bazami danych"
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
                    // Animacja końcowa
                    this.character.style.transform = `translateX(${window.innerWidth - 100}px)`;
                    setTimeout(() => {
                        this.character.style.opacity = '0';
                        this.showGameComplete();
                    }, 1000);
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
                if (e.propertyName === 'transform' && this.currentLevel === gameLevels.length - 1) {
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
