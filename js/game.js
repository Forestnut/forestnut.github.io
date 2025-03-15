const gameLevels = [
    {
        question: "Jak przesunąć postać o 100px w prawo?",
        options: [
            "character.style.left = '100px'",
            "character.style.transform = 'translateX(100px)'",
            "character.move(100)",
            "character.left += 100"
        ],
        correctAnswer: 1,
        movement: 100
    },
    {
        question: "Jak przesunąć postać o kolejne 150px?",
        options: [
            "character.right = '150px'",
            "character.style.transform = 'translateX(250px)'",
            "character.style.marginLeft = '150px'",
            "character.position = 150"
        ],
        correctAnswer: 1,
        movement: 150
    },
    {
        question: "Final: Jak dotrzeć do celu?",
        options: [
            "character.style.right = '0'",
            "character.style.transform = 'translateX(400px)'",
            "character.moveToEnd()",
            "character.style.left = 'auto'"
        ],
        correctAnswer: 1,
        movement: 200
    }
];

class Game {
    constructor() {
        this.currentLevel = 0;
        this.totalMovement = 0;
        this.character = document.querySelector('.game-character');
        this.optionsContainer = document.querySelector('.code-options');
        this.messageElement = document.getElementById('game-message');
        this.levelIndicator = document.getElementById('current-level');
        this.progressDots = document.querySelectorAll('.progress-dot');
        
        this.initGame();
    }

    initGame() {
        // Reset character position
        this.totalMovement = 0;
        this.character.style.transform = 'translateX(0)';
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
    }

    checkAnswer(selectedIndex) {
        const level = gameLevels[this.currentLevel];
        const buttons = document.querySelectorAll('.code-option');
        
        buttons.forEach(button => {
            button.disabled = true;
            button.style.pointerEvents = 'none';
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
                } else {
                    this.showGameComplete();
                }
            }, 1500);
        } else {
            this.showMessage('Spróbuj jeszcze raz!', 'error');
            buttons[selectedIndex].classList.add('wrong');
            
            setTimeout(() => {
                buttons.forEach(button => {
                    button.disabled = false;
                    button.style.pointerEvents = 'auto';
                    button.classList.remove('wrong');
                });
            }, 1500);
        }
    }

    animateCharacter() {
        this.character.style.transform = `translateX(${this.totalMovement}px)`;
    }

    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `game-message ${type} show`;
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
        this.optionsContainer.innerHTML = `
            <div class="game-complete">
                <h3>Gratulacje! Ukończyłeś wszystkie poziomy!</h3>
                <button onclick="new Game()" class="restart-button">Zagraj ponownie</button>
            </div>
        `;
        this.showMessage('Brawo! Dotarłeś do celu!', 'success');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
