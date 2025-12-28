// Initialize elements and variables
const headingContainer = document.getElementById('headingContainer');
const addHeadingButton = document.getElementById('addHeadingButton');

// Counter for unique IDs
let headingInputCounter = 0;

// Function to show the desired step
function showStep(stepId) {
    console.log("Navigating to:", stepId);
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(stepId).style.display = 'block';
}

// Initialize Intro page visibility
document.addEventListener('DOMContentLoaded', () => {
    showStep('intro');
});

// Function to add a heading input field in Step 1
function addHeadingInput(value) {
    const headingDiv = document.createElement('div');
    headingDiv.className = 'heading-input-group';

    // Increment the counter and create a unique ID
    headingInputCounter++;
    const inputId = 'heading-input-' + headingInputCounter;

    const label = document.createElement('label');
    label.setAttribute('for', inputId);
    label.textContent = 'Heading or Bold Word';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter a heading or bold word';
    input.className = 'heading-input';
    input.id = inputId;
    input.value = value;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';
    deleteButton.className = 'delete-heading-button';

    deleteButton.addEventListener('click', () => {
        headingContainer.removeChild(headingDiv);
        removeHeadingFromLocalStorage(input.value.trim());
    });

    headingDiv.appendChild(label);
    headingDiv.appendChild(input);
    headingDiv.appendChild(deleteButton);
    headingContainer.appendChild(headingDiv);
}

// Event listener for "Add Heading" button in Step 1
addHeadingButton.addEventListener('click', () => {
    addHeadingInput('');
});

// Function to populate Step 1 with saved headings
function populateStep1() {
    let savedHeadings = JSON.parse(localStorage.getItem('headings')) || [];
    headingContainer.innerHTML = '';
    headingInputCounter = 0; // Reset the counter
    savedHeadings.forEach(heading => {
        addHeadingInput(heading);
    });
}

// Function to remove a heading and associated data from localStorage
function removeHeadingFromLocalStorage(heading) {
    if (!heading) return;

    let headings = JSON.parse(localStorage.getItem('headings')) || [];
    headings = headings.filter(h => h !== heading);
    localStorage.setItem('headings', JSON.stringify(headings));

    let questions = JSON.parse(localStorage.getItem('questions')) || {};
    delete questions[heading];
    localStorage.setItem('questions', JSON.stringify(questions));

    let answers = JSON.parse(localStorage.getItem('answers')) || {};
    delete answers[heading];
    localStorage.setItem('answers', JSON.stringify(answers));
}

// Event delegation for Next and Back buttons
document.body.addEventListener('click', (event) => {
    // Handle Next Step buttons
    const nextButton = event.target.closest('.nextStepButton');
    if (nextButton) {
        const nextStepId = nextButton.getAttribute('data-next');

        if (nextStepId === 'step1') {
            // Moving from Intro to Step 1
            showStep('step1');
        } else if (nextStepId === 'step2') {
            // Moving from Step 1 to Step 2
            const headingInputs = document.querySelectorAll('.heading-input');
            let headings = [];
            headingInputs.forEach(input => {
                if (input.value.trim()) {
                    headings.push(input.value.trim());
                }
            });
            console.log("Headings saved:", headings);
            localStorage.setItem('headings', JSON.stringify(headings));
            populateStep2();
            showStep('step2');
        } else if (nextStepId === 'step3') {
            // Moving from Step 2 to Step 3
            const questionInputs = document.querySelectorAll('.question-input');
            let headings = JSON.parse(localStorage.getItem('headings')) || [];
            let questions = {};

            questionInputs.forEach((input, index) => {
                const heading = headings[index];
                if (heading) {
                    questions[heading] = input.value.trim();
                }
            });
            console.log("Questions saved before moving to Step 3:", questions);
            localStorage.setItem('questions', JSON.stringify(questions));
            populateStep3();
            showStep('step3');
        } else if (nextStepId === 'step4') {
            // Moving from Step 3 to Step 4
            showStep('step4');
            handleRelateTextarea();
        }
        return; // Prevent further processing
    }

    // Handle Back buttons
    const backButton = event.target.closest('.backStepButton');
    if (backButton) {
        const backStepId = backButton.getAttribute('data-back');
        if (backStepId === 'intro') {
            showStep('intro');
        } else if (backStepId === 'step1') {
            populateStep1();
            showStep('step1');
        } else if (backStepId === 'step2') {
            populateStep2();
            showStep('step2');
        } else if (backStepId === 'step3') {
            populateStep3();
            showStep('step3');
        }
        return; // Prevent further processing
    }
});

// Function to populate Step 2 with headings and question inputs
function populateStep2() {
    const tBody = document.getElementById('tBody');
    tBody.innerHTML = '';
    let headings = JSON.parse(localStorage.getItem('headings')) || [];
    let questions = JSON.parse(localStorage.getItem('questions')) || {};

    headings.forEach((heading, index) => {
        const row = document.createElement('tr');

        const headingCell = document.createElement('td');
        headingCell.textContent = heading;

        const questionCell = document.createElement('td');

        // Create a label for the question input
        const questionLabel = document.createElement('label');
        const inputId = 'question-input-' + index;
        questionLabel.setAttribute('for', inputId);
        questionLabel.textContent = 'Question for ' + heading;

        const questionInput = document.createElement('input');
        questionInput.type = 'text';
        questionInput.placeholder = 'Turn this into a question';
        questionInput.className = 'question-input';
        questionInput.id = inputId;

        if (questions[heading]) {
            questionInput.value = questions[heading];
        }

        // Save the question to localStorage on input change
        questionInput.addEventListener('input', () => {
            saveQuestion(heading, questionInput.value);
        });

        questionCell.appendChild(questionLabel);
        questionCell.appendChild(questionInput);
        row.appendChild(headingCell);
        row.appendChild(questionCell);
        tBody.appendChild(row);
    });
}

// Function to save a question to localStorage
function saveQuestion(heading, question) {
    let questions = JSON.parse(localStorage.getItem('questions')) || {};
    questions[heading] = question;
    localStorage.setItem('questions', JSON.stringify(questions));
}

// Function to populate Step 3 with questions and answer inputs
function populateStep3() {
    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = '';
    let questions = JSON.parse(localStorage.getItem('questions')) || {};
    let answers = JSON.parse(localStorage.getItem('answers')) || {};

    let index = 0;
    for (let heading in questions) {
        if (questions[heading].trim() !== "") {
            index++;
            const div = document.createElement('div');
            const questionText = document.createElement('p');
            questionText.textContent = `Q: ${questions[heading]}`;

            const answerContainer = document.createElement('div');
            answerContainer.className = 'answer-container';

            // Create a label for the textarea
            const answerLabel = document.createElement('label');
            const textareaId = 'answer-textarea-' + index;
            answerLabel.setAttribute('for', textareaId);
            answerLabel.textContent = 'Your Answer';

            const answerInput = document.createElement('textarea');
            answerInput.placeholder = 'Type your answer here...';
            answerInput.id = textareaId;

            const answerDisplay = document.createElement('div');
            answerDisplay.className = 'answer-display';

            // Load saved answer if it exists
            if (answers[heading]) {
                answerInput.value = answers[heading];
                answerDisplay.textContent = answers[heading];
            }

            // Attach autoResize function
            answerInput.addEventListener('input', function() {
                autoResize(this);
                saveAnswer(heading, this.value);
                answerDisplay.textContent = this.value;
            });

            // Call autoResize initially
            autoResize(answerInput);

            answerContainer.appendChild(answerLabel);
            answerContainer.appendChild(answerInput);
            answerContainer.appendChild(answerDisplay);
            div.appendChild(questionText);
            div.appendChild(answerContainer);
            questionsContainer.appendChild(div);
        }
    }
}

// Function to save an answer to localStorage
function saveAnswer(heading, answer) {
    let answers = JSON.parse(localStorage.getItem('answers')) || {};
    answers[heading] = answer;
    localStorage.setItem('answers', JSON.stringify(answers));
}

// Function to handle the relate textarea in Step 4
function handleRelateTextarea() {
    const relateTextarea = document.getElementById('relate');
    const relateDisplay = document.getElementById('relateDisplay');

    // Load saved content if any
    let relateContent = localStorage.getItem('relateContent') || '';
    relateTextarea.value = relateContent;
    relateDisplay.textContent = relateContent;

    relateTextarea.addEventListener('input', function() {
        autoResize(this);
        relateDisplay.textContent = this.value;
        localStorage.setItem('relateContent', this.value);
    });

    // Call autoResize initially
    autoResize(relateTextarea);
}

// Function to automatically resize a textarea based on content
function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set height to fit content
}

// Final Step: Print functionality
document.getElementById('printButton').addEventListener('click', () => {
    window.print();
});
