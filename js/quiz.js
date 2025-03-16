const questions = [
    {
        question: "Co to jest HTML?",
        answers: [
            "Język znaczników do tworzenia stron WWW",
            "Język programowania",
            "System zarządzania bazą danych",
            "Protokół internetowy"
        ],
        correct: 0
    },
    {
        question: "Która z pętli nie istnieje w JavaScript?",
        answers: [
            "for",
            "while",
            "repeat until",
            "do while"
        ],
        correct: 2
    },
    // Add more questions here
];

let currentQuestion = 0;
let score = 0;

function displayQuestion() {
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');
    const current = questions[currentQuestion];

    questionEl.textContent = current.question;
    answersEl.innerHTML = '';

    current.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index));
        answersEl.appendChild(button);
    });
}

function checkAnswer(answerIndex) {
    const current = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-button');
    
    buttons.forEach(button => button.disabled = true);
    
    if (answerIndex === current.correct) {
        score++;
        buttons[answerIndex].style.background = '#4ade80';
    } else {
        buttons[answerIndex].style.background = '#f87171';
        buttons[current.correct].style.background = '#4ade80';
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.innerHTML = `
        <h3>Twój wynik: ${score}/${questions.length}</h3>
        <p>Gratulacje! Sprawdź pozostałe sekcje naszej strony.</p>
        <button onclick="resetQuiz()" class="cta-button">Spróbuj ponownie</button>
    `;
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    displayQuestion();
}

// Start the quiz when the page loads
document.addEventListener('DOMContentLoaded', displayQuestion);
