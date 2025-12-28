document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('next-button').addEventListener('click', startFirstBlock);
});

let assignmentName = '';
let goals = [];
let notes = '';
let sessionCount = 0;

const workTimer = {
    remainingSeconds: 0,
    isPaused: false,
    interval: null,
};

const breakTimer = {
    remainingSeconds: 0,
    isPaused: false,
    interval: null,
};

function startFirstBlock() {
    assignmentName = document.getElementById('assignment-name').value.trim();
    if (assignmentName === '') {
        showValidationError('assignment-name', 'Please enter the assignment name.');
        return;
    }
    hideValidationError('assignment-name');
    document.getElementById('welcome-message').style.display = 'none';
    document.getElementById('first-block').style.display = 'block';
    document.getElementById('first-goal').focus();
}

function beginFirstBlock() {
    const firstGoal = document.getElementById('first-goal').value.trim();
    if (firstGoal === '') {
        showValidationError('first-goal', 'Please enter your first goal.');
        return;
    }
    hideValidationError('first-goal');
    goals.push(firstGoal);
    document.getElementById('first-block').style.display = 'none';
    document.getElementById('work-session').style.display = 'block';
    document.getElementById('assignment-title').innerText = assignmentName;
    updateCurrentGoal();
    startTimer(25, 'timer', showNextGoalPopup, workTimer);
    document.getElementById('notes').focus();
}

function showGoalsAndNotes() {
    document.getElementById('goals-notes-popup').style.display = 'flex';
    let goalsText = goals.map((goal, index) => `<li>Goal ${index + 1}: ${sanitizeInput(goal)}</li>`).join('');
    notes = document.getElementById('notes').value;
    document.getElementById('goals-notes-content').innerHTML = `
        <h3>Assignment: ${sanitizeInput(assignmentName)}</h3>
        <ul>${goalsText}</ul>
        <h3>Notes:</h3>
        <p>${sanitizeInput(notes)}</p>
    `;
    document.getElementById('goals-notes-popup').focus();
}

function closeGoalsAndNotes() {
    document.getElementById('goals-notes-popup').style.display = 'none';
    document.getElementById('notes').focus();
}

function printGoalsAndNotes() {
    let goalsText = goals.map((goal, index) => `<li>Goal ${index + 1}: ${sanitizeInput(goal)}</li>`).join('');
    notes = document.getElementById('notes').value;
    const printContent = `
        <html>
        <head>
            <title>Print Goals and Notes</title>
            <style>
                body { font-family: 'Lato', sans-serif; padding: 20px; }
                h3 { color: #2d3b45; }
                ul { list-style-type: disc; margin-left: 20px; }
            </style>
        </head>
        <body>
            <h3>Assignment: ${sanitizeInput(assignmentName)}</h3>
            <ul>${goalsText}</ul>
            <h3>Notes:</h3>
            <p>${sanitizeInput(notes)}</p>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    // Removed printWindow.print() and printWindow.close() from here
}

function showNextGoalPopup() {
    sessionCount++;
    document.getElementById('next-goal').value = '';
    if (sessionCount === 3) {
        document.getElementById('three-sessions-popup').style.display = 'flex';
        sessionCount = 0;
        document.getElementById('three-sessions-popup').focus();
    } else {
        document.getElementById('next-goal-popup').style.display = 'flex';
        document.getElementById('next-goal').focus();
    }
}

function continueWork() {
    let nextGoal = '';
    let errorElementId = '';
    if (document.getElementById('next-goal-popup').style.display === 'flex') {
        nextGoal = document.getElementById('next-goal').value.trim();
        errorElementId = 'next-goal';
        if (nextGoal === '') {
            showValidationError(errorElementId, 'Please enter your next goal.');
            return;
        }
        hideValidationError(errorElementId);
        document.getElementById('next-goal-popup').style.display = 'none';
    } else if (document.getElementById('long-continue-work-popup') && document.getElementById('long-continue-work-popup').style.display === 'flex') {
        nextGoal = document.getElementById('long-continue-next-goal').value.trim();
        errorElementId = 'long-continue-next-goal';
        if (nextGoal === '') {
            showValidationError(errorElementId, 'Please enter your next goal.');
            return;
        }
        hideValidationError(errorElementId);
        document.getElementById('long-continue-work-popup').style.display = 'none';
    }
    goals.push(nextGoal);
    document.getElementById('three-sessions-popup').style.display = 'none';
    updateCurrentGoal();
    startTimer(25, 'timer', showNextGoalPopup, workTimer);
    document.getElementById('notes').focus();
}

function takeBreak() {
    const nextGoal = document.getElementById('next-goal').value.trim();
    if (nextGoal === '') {
        showValidationError('next-goal', 'Please enter your next goal.');
        return;
    }
    hideValidationError('next-goal');
    goals.push(nextGoal);
    document.getElementById('next-goal-popup').style.display = 'none';
    document.getElementById('break-popup').style.display = 'flex';
    startTimer(5, 'break-timer', endBreak, breakTimer);
    document.getElementById('break-popup').focus();
}

function takeLongBreak() {
    const nextGoal = document.getElementById('long-break-next-goal').value.trim();
    if (nextGoal === '') {
        showValidationError('long-break-next-goal', 'Please enter your next goal.');
        return;
    }
    hideValidationError('long-break-next-goal');
    goals.push(nextGoal);
    document.getElementById('long-break-popup').style.display = 'none';
    document.getElementById('break-popup').style.display = 'flex';
    startTimer(30, 'break-timer', endBreak, breakTimer);
    document.getElementById('break-popup').focus();
}

function endBreak() {
    document.getElementById('break-popup').style.display = 'none';
    document.getElementById('work-session').style.display = 'block';
    updateCurrentGoal();
    startTimer(25, 'timer', showNextGoalPopup, workTimer);
    document.getElementById('notes').focus();
}

function endSession() {
    document.getElementById('work-session').style.display = 'none';
    document.getElementById('end-session-popup').style.display = 'flex';
    displayEndSessionContent();
    document.getElementById('end-session-popup').focus();
}

function displayEndSessionContent() {
    let goalsText = goals.map((goal, index) => `<li>Goal ${index + 1}: ${sanitizeInput(goal)}</li>`).join('');
    notes = document.getElementById('notes').value;
    document.getElementById('end-session-goals-notes').innerHTML = `
        <h3>Assignment: ${sanitizeInput(assignmentName)}</h3>
        <ul>${goalsText}</ul>
        <h3>Notes:</h3>
        <p>${sanitizeInput(notes)}</p>
    `;
}

function closeEndSessionPopup() {
    document.getElementById('end-session-popup').style.display = 'none';
    resetExercise();
    document.getElementById('welcome-message').focus();
}

function printReflection() {
    const reflection = document.getElementById('reflection').value.trim();
    if (reflection === '') {
        alert('Please enter your reflection before printing.');
        return;
    }
    let goalsText = goals.map((goal, index) => `<li>Goal ${index + 1}: ${sanitizeInput(goal)}</li>`).join('');
    notes = document.getElementById('notes').value;
    const printContent = `
        <html>
        <head>
            <title>Print Reflection</title>
            <style>
                body { font-family: 'Lato', sans-serif; padding: 20px; }
                h3 { color: #2d3b45; }
                ul { list-style-type: disc; margin-left: 20px; }
            </style>
        </head>
        <body>
            <h3>Assignment: ${sanitizeInput(assignmentName)}</h3>
            <ul>${goalsText}</ul>
            <h3>Notes:</h3>
            <p>${sanitizeInput(notes)}</p>
            <h3>Reflection:</h3>
            <p>${sanitizeInput(reflection)}</p>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    // Removed printWindow.print() and printWindow.close() from here
}

function updateCurrentGoal() {
    document.getElementById('current-goal').innerText = `Current Goal: ${goals[goals.length - 1]}`;
}

function startTimer(minutes, elementId, callback, timerObj) {
    timerObj.remainingSeconds = minutes * 60;
    const timerElement = document.getElementById(elementId);
    clearInterval(timerObj.interval);
    timerObj.isPaused = false;
    updateTimerDisplay(timerObj.remainingSeconds, timerElement);

    timerObj.interval = setInterval(() => {
        if (!timerObj.isPaused) {
            if (timerObj.remainingSeconds > 0) {
                timerObj.remainingSeconds--;
                updateTimerDisplay(timerObj.remainingSeconds, timerElement);
            } else {
                clearInterval(timerObj.interval);
                callback();
            }
        }
    }, 1000);
}

function updateTimerDisplay(seconds, timerElement) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerElement.innerText = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function pauseTimer(timerId, buttonId) {
    const timerObj = timerId === 'timer' ? workTimer : breakTimer;
    timerObj.isPaused = !timerObj.isPaused;
    const pauseButton = document.getElementById(buttonId);
    pauseButton.innerText = timerObj.isPaused ? 'Resume' : 'Pause';
    pauseButton.setAttribute('aria-label', timerObj.isPaused ? 'Resume Timer' : 'Pause Timer');
}

function resetTimer() {
    clearInterval(workTimer.interval);
    startTimer(25, 'timer', showNextGoalPopup, workTimer);
    document.getElementById('pause-button').innerText = 'Pause';
    document.getElementById('pause-button').setAttribute('aria-label', 'Pause Timer');
}

function resetBreakTimer() {
    clearInterval(breakTimer.interval);
    const duration = breakTimer.remainingSeconds > 5 * 60 ? 30 : 5;
    startTimer(duration, 'break-timer', endBreak, breakTimer);
    document.getElementById('pause-break-button').innerText = 'Pause';
    document.getElementById('pause-break-button').setAttribute('aria-label', 'Pause Break Timer');
}

function showLongContinueWorkPopup() {
    document.getElementById('three-sessions-popup').style.display = 'none';
    document.getElementById('long-continue-work-popup').style.display = 'flex';
    document.getElementById('long-continue-next-goal').focus();
}

function showLongBreakPopup() {
    document.getElementById('three-sessions-popup').style.display = 'none';
    document.getElementById('long-break-popup').style.display = 'flex';
    document.getElementById('long-break-next-goal').focus();
}

function resetExercise() {
    assignmentName = '';
    goals = [];
    notes = '';
    sessionCount = 0;
    workTimer.isPaused = false;
    breakTimer.isPaused = false;

    clearInterval(workTimer.interval);
    clearInterval(breakTimer.interval);

    document.getElementById('assignment-name').value = '';
    document.getElementById('first-goal').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('next-goal').value = '';
    if (document.getElementById('long-continue-next-goal')) {
        document.getElementById('long-continue-next-goal').value = '';
    }
    if (document.getElementById('long-break-next-goal')) {
        document.getElementById('long-break-next-goal').value = '';
    }
    if (document.getElementById('reflection')) {
        document.getElementById('reflection').value = '';
    }

    document.getElementById('welcome-message').style.display = 'block';
    document.getElementById('first-block').style.display = 'none';
    document.getElementById('work-session').style.display = 'none';
    document.getElementById('goals-notes-popup').style.display = 'none';
    document.getElementById('next-goal-popup').style.display = 'none';
    document.getElementById('break-popup').style.display = 'none';
    document.getElementById('end-session-popup').style.display = 'none';
    if (document.getElementById('three-sessions-popup')) {
        document.getElementById('three-sessions-popup').style.display = 'none';
    }
    if (document.getElementById('long-continue-work-popup')) {
        document.getElementById('long-continue-work-popup').style.display = 'none';
    }
    if (document.getElementById('long-break-popup')) {
        document.getElementById('long-break-popup').style.display = 'none';
    }

    document.getElementById('timer').innerText = '25:00';
    if (document.getElementById('break-timer')) {
        document.getElementById('break-timer').innerText = '5:00';
    }

    if (document.getElementById('pause-button')) {
        document.getElementById('pause-button').innerText = 'Pause';
        document.getElementById('pause-button').setAttribute('aria-label', 'Pause Timer');
    }
    if (document.getElementById('pause-break-button')) {
        document.getElementById('pause-break-button').innerText = 'Pause';
        document.getElementById('pause-break-button').setAttribute('aria-label', 'Pause Break Timer');
    }
}

function showValidationError(elementId, message) {
    const errorElement = document.getElementById(elementId + '-error');
    if (errorElement) {
        errorElement.innerText = message;
    }
}

function hideValidationError(elementId) {
    const errorElement = document.getElementById(elementId + '-error');
    if (errorElement) {
        errorElement.innerText = '';
    }
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
