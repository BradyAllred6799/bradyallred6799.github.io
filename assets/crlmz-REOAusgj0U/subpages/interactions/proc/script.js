'use strict';

// Step 1: Move to Step 2 after acknowledging stress
document.getElementById('nextToStep2').addEventListener('click', function () {
    const stressText = document.getElementById('stressInput').value.trim();
    if (stressText === '') {
        alert('Please write down what is causing you stress.');
        document.getElementById('stressInput').focus();
    } else {
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        document.getElementById('startCountdown').focus();
    }
});

// Step 2: Start the countdown
document.getElementById('startCountdown').addEventListener('click', function () {
    let count = 5;
    document.getElementById('countdownDisplay').textContent = count;
    const countdownInterval = setInterval(function () {
        count--;
        if (count > 0) {
            document.getElementById('countdownDisplay').textContent = count;
        } else {
            clearInterval(countdownInterval);
            document.getElementById('countdownDisplay').textContent = '';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'block';
            document.getElementById('actionPlan').focus();
        }
    }, 1000);
});

// Step 3: Proceed to Step 4 after writing the action plan
document.getElementById('nextToStep4').addEventListener('click', function () {
    const actionPlanText = document.getElementById('actionPlan').value.trim();
    if (actionPlanText === '') {
        alert('Please write down what you will do.');
        document.getElementById('actionPlan').focus();
    } else {
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step4').style.display = 'block';
        document.getElementById('startTimer').focus();
    }
});

// Step 4: Start the five-minute timer with pause functionality
let timerInterval;
let timeLeft = 300; // 5 minutes in seconds
let isPaused = false;

document.getElementById('startTimer').addEventListener('click', function () {
    document.getElementById('startTimer').style.display = 'none';
    document.getElementById('pauseTimer').style.display = 'inline-block';
    startTimer();
});

document.getElementById('pauseTimer').addEventListener('click', function () {
    if (isPaused) {
        document.getElementById('pauseTimer').textContent = 'Pause Timer';
        isPaused = false;
        startTimer();
    } else {
        document.getElementById('pauseTimer').textContent = 'Resume Timer';
        isPaused = true;
        clearInterval(timerInterval);
    }
});

function startTimer() {
    timerInterval = setInterval(function () {
        if (!isPaused) {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            document.getElementById('timerDisplay').textContent =
                (minutes < 10 ? '0' + minutes : minutes) + ':' +
                (seconds < 10 ? '0' + seconds : seconds);
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                document.getElementById('timerDisplay').textContent = '00:00';
                document.getElementById('step4').style.display = 'none';
                document.getElementById('completionMessage').style.display = 'block';
                document.getElementById('completion-heading').focus();
            }
        }
    }, 1000);
}
