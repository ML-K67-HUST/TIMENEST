// Store user answers
const userAnswers = {
    q0: null,
    q1: null,
    q2: [],
    q3: null,
    q4: null,
};

// Current question tracking
let currentQuestion = 1;
const totalQuestions = 5;

// Update progress
function updateProgress() {
    const progressPercent = ((currentQuestion - 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    
    // Update steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentQuestion) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentQuestion) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Check occupation field
function checkOccupation() {
    const occupation = document.getElementById('occupation').value.trim();
    userAnswers.q0 = occupation;
    document.getElementById('nextBtn1').disabled = occupation === '';
}

// Select occupation from suggestion
function selectOccupation(occupation) {
    document.getElementById('occupation').value = occupation;
    userAnswers.q0 = occupation;
    document.getElementById('nextBtn1').disabled = false;
}

// Select an option
function selectOption(element, questionNumber, multiSelect = false) {
    const questionKey = 'q' + (questionNumber - 1);
    const value = element.getAttribute('data-value');

    if (multiSelect) {
        // For multi-select (e.g., question 3)
        if (!Array.isArray(userAnswers[questionKey])) {
            userAnswers[questionKey] = [];
        }

        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            userAnswers[questionKey] = userAnswers[questionKey].filter(item => item !== value);
        } else {
            element.classList.add('selected');
            userAnswers[questionKey].push(value);
        }

        // Update button label
        const btn = document.getElementById('nextBtn' + questionNumber);
        btn.innerText = userAnswers[questionKey].length > 0 ? 'Next' : 'Skip';
    } else {
        // Single select (radio-style)
        const options = document.querySelectorAll(`#question${questionNumber} .option`);
        options.forEach(opt => opt.classList.remove('selected'));

        element.classList.add('selected');
        userAnswers[questionKey] = value;

        // Update button label
        const btn = document.getElementById('nextBtn' + questionNumber);
        if (btn) {
            btn.innerText = 'Next';
        }
    }
}

// Go to next question
function nextQuestion(questionNumber) {
    if (questionNumber < totalQuestions) {
        document.getElementById('question' + questionNumber).classList.add('hidden');
        document.getElementById('question' + (questionNumber + 1)).classList.remove('hidden');
        currentQuestion = questionNumber + 1;
        updateProgress();
        updateButtonText(currentQuestion);
        window.scrollTo(0, 0);
    }
}



// Go to previous question
function prevQuestion(questionNumber) {
    if (questionNumber > 1) {
        document.getElementById('question' + questionNumber).classList.add('hidden');
        document.getElementById('question' + (questionNumber - 1)).classList.remove('hidden');
        currentQuestion = questionNumber - 1;
        updateProgress();
        updateButtonText(currentQuestion);
        window.scrollTo(0, 0);
    }
}

function updateButtonText(questionNumber) {
    const questionKey = 'q' + (questionNumber - 1);
    const btn = document.getElementById('nextBtn' + questionNumber);

    if (!btn) return;

    const answer = userAnswers[questionKey];
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        btn.innerText = 'Skip';
    } else {
        btn.innerText = 'Next';
    }
}

// Submit answers
function submitAnswers() {
    // Here you would typically send the answers to your server
    console.log('User answers:', userAnswers);
    
    // Show completion screen
    document.getElementById('question5').classList.add('hidden');
    document.getElementById('completion').classList.remove('hidden');
    document.getElementById('progressFill').style.width = '100%';
    
    // Mark all steps as completed
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.add('completed');
        step.classList.remove('active');
    });
    
    // In a real application, you'd save these preferences to user settings
    // and use them to customize the user experience
}

// Redirect to dashboard
function goToDashboard() {
    // In a real app, this would redirect to your dashboard

    window.location.href = `/calendar?username=${encodeURIComponent(USERNAME)}&userid=${encodeURIComponent(USERID)}`;
    // For demo, just reload
    // window.location.reload();
    // alert("In a real application, you would now be redirected to your personalized dashboard!");
}

// Initialize
updateProgress();