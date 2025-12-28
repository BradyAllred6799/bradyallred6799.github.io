// script.js

var userResponses = {};
var studentName = '';
var calendarEvent = {};

function startTool() {
    var nameInput = document.getElementById('student-name');
    if (nameInput.value.trim() === '') {
        alert('Please enter your name to continue.');
        nameInput.focus();
        return;
    }
    studentName = nameInput.value.trim();
    document.getElementById('step-welcome').style.display = 'none';
    document.getElementById('step-smartgoal').style.display = 'block';
    updateProgressBar('welcome');
    personalizeMessage();
}

function personalizeMessage() {
    var message = `Hello, ${studentName}! Let's start setting your SMART goal.`;
    document.getElementById('personalized-message').textContent = message;
}

function nextStep(currentStep) {
    // Save current step data
    saveData(currentStep);

    // Hide current step
    document.getElementById('step-' + currentStep).style.display = 'none';

    // Show next step
    var steps = ['smartgoal', 'reality', 'options', 'wayforward'];
    var index = steps.indexOf(currentStep);
    if (index < steps.length - 1) {
        var nextStep = steps[index + 1];
        document.getElementById('step-' + nextStep).style.display = 'block';
        document.getElementById('step-' + nextStep).scrollIntoView({ behavior: 'smooth' });
        updateProgressBar(nextStep);
    }
}

function prevStep(currentStep) {
    // Save current step data
    saveData(currentStep);

    // Hide current step
    document.getElementById('step-' + currentStep).style.display = 'none';

    // Show previous step
    var steps = ['smartgoal', 'reality', 'options', 'wayforward'];
    var index = steps.indexOf(currentStep);
    if (index > 0) {
        var prevStep = steps[index - 1];
        document.getElementById('step-' + prevStep).style.display = 'block';
        document.getElementById('step-' + prevStep).scrollIntoView({ behavior: 'smooth' });
        updateProgressBar(prevStep);
    }
}

function saveData(step) {
    var form = document.getElementById('form-' + step);
    var elements = form.elements;
    for (var i = 0; i < elements.length; i++) {
        var name = elements[i].name;
        var value = elements[i].value;
        if (name) {
            userResponses[name] = value;
        }
    }
}

function finish() {
    // Save data from last step
    saveData('wayforward');

    // Hide current step
    document.getElementById('step-wayforward').style.display = 'none';

    // Generate summary
    generateSummary();

    // Show summary
    document.getElementById('step-summary').style.display = 'block';
    document.getElementById('step-summary').scrollIntoView({ behavior: 'smooth' });

    // Set the current date in the header for printing
    var currentDate = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('print-date').textContent = currentDate.toLocaleDateString(undefined, options);

    // Update achievement badge with student's name
    document.getElementById('student-name-display').textContent = studentName;

    // Update progress bar to 100%
    updateProgressBar('finished');

    // Prepare calendar event details
    prepareCalendarEvent();
}

function generateSummary() {
    var summary = '';
    var questions = {
        // Include only the combined SMART Goal from Step 1
        'smart_goal_combined': 'Your SMART Goal:',

        // Reality step
        'reality1': 'What am I currently doing to accomplish this goal?',
        'reality2': 'What factors are contributing to or slowing down my progress?',
        'reality3': "What isn't working?",
        'reality4': 'What have I already tried to address this situation?',

        // Options step
        'options1': 'What are some possible ways I can achieve this goal?',
        'options2': 'What other options are available to me right now?',
        'options3': "How have other people successfully addressed similar challenges that I'm facing?",

        // Way Forward step
        'wayforward1': 'Which options am I most committed to implementing?',
        'wayforward2': 'What specific actions will I take, and when?',
        'wayforward3': 'How am I going to stay accountable?',
        'wayforward4': 'How will I overcome potential obstacles?',
        'wayforward5': 'What can someone I trust like a family member or friend do to help me stay accountable?'
    };
    for (var key in questions) {
        if (userResponses.hasOwnProperty(key) && userResponses[key].trim() !== '') {
            summary += questions[key] + '\n' + userResponses[key] + '\n\n';
        }
    }
    if (summary === '') {
        summary = 'No responses were provided.';
    }
    document.getElementById('summary-content').textContent = summary;
}

function printSummary() {
    window.print();
}

function restart() {
    // Clear user responses
    userResponses = {};
    studentName = '';
    calendarEvent = {};

    // Reset forms
    var forms = document.getElementsByTagName('form');
    for (var i = 0; i < forms.length; i++) {
        forms[i].reset();
    }

    // Hide all steps except the welcome step
    var steps = ['welcome', 'smartgoal', 'reality', 'options', 'wayforward', 'summary'];
    for (var i = 0; i < steps.length; i++) {
        document.getElementById('step-' + steps[i]).style.display = 'none';
    }

    // Show welcome step
    document.getElementById('step-welcome').style.display = 'block';
    document.getElementById('step-welcome').scrollIntoView({ behavior: 'smooth' });

    // Clear summary content
    document.getElementById('summary-content').textContent = '';

    // Clear the date from the header
    document.getElementById('print-date').textContent = '';

    // Reset progress bar
    updateProgressBar('welcome');
}

function updateProgressBar(step) {
    var steps = ['welcome', 'smartgoal', 'reality', 'options', 'wayforward', 'finished'];
    var index = steps.indexOf(step);
    var progressPercent = (index / (steps.length - 1)) * 100;
    document.getElementById('progress').style.width = progressPercent + '%';
}

function downloadSummary() {
    var summaryText = document.getElementById('summary-content').textContent;
    var blob = new Blob([summaryText], { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'GROW_Model_Summary.txt';
    link.click();
}

function shareSummary() {
    var email = prompt('Enter the email address you want to send the summary to:');
    if (email) {
        var subject = 'My GROW Model Goal Setting Summary';
        var body = document.getElementById('summary-content').textContent;
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
}

function prepareCalendarEvent() {
    // Extract necessary information from user responses
    var title = 'My SMART Goal: ' + (userResponses['smart_goal_combined'] || 'No Title');
    var description = 'Goal Details:\n' + (document.getElementById('summary-content').textContent || '');
    var dueDate = userResponses['smart_timebound'] || '';

    // Parse the due date
    var endDate = parseDate(dueDate);

    // Store event details
    calendarEvent = {
        title: title,
        description: description,
        endDate: endDate
    };
}

function parseDate(dateString) {
    var date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // If parsing fails, use today's date plus one week
        date = new Date();
        date.setDate(date.getDate() + 7);
    }
    return date;
}

function addToGoogleCalendar() {
    var event = calendarEvent;
    if (!event) {
        alert('Event details are not available.');
        return;
    }
    var startDate = formatDateForCalendar(new Date());
    var endDate = formatDateForCalendar(event.endDate);

    var url = 'https://www.google.com/calendar/render?action=TEMPLATE';
    url += '&text=' + encodeURIComponent(event.title);
    url += '&dates=' + startDate + '/' + endDate;
    url += '&details=' + encodeURIComponent(event.description);
    url += '&sf=true&output=xml';

    window.open(url, '_blank');
}

function addToOutlookCalendar() {
    var event = calendarEvent;
    if (!event) {
        alert('Event details are not available.');
        return;
    }
    var startDate = formatDateForOutlook(new Date());
    var endDate = formatDateForOutlook(event.endDate);

    var url = 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent';
    url += '&subject=' + encodeURIComponent(event.title);
    url += '&body=' + encodeURIComponent(event.description);
    url += '&startdt=' + encodeURIComponent(startDate);
    url += '&enddt=' + encodeURIComponent(endDate);

    window.open(url, '_blank');
}

function formatDateForCalendar(date) {
    // Format date as YYYYMMDDTHHMMSSZ
    return date.toISOString().replace(/-|:|\.\d+/g, '');
}

function formatDateForOutlook(date) {
    // Format date as YYYY-MM-DDTHH:MM:SS
    return date.toISOString().split('.')[0];
}

function downloadICS() {
    var event = calendarEvent;
    if (!event) {
        alert('Event details are not available.');
        return;
    }
    var startDate = formatICSDate(new Date());
    var endDate = formatICSDate(event.endDate);

    var icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GROW Model Tool//EN\n';
    icsContent += 'BEGIN:VEVENT\n';
    icsContent += 'UID:' + generateUID() + '\n';
    icsContent += 'DTSTAMP:' + startDate + '\n';
    icsContent += 'DTSTART:' + startDate + '\n';
    icsContent += 'DTEND:' + endDate + '\n';
    icsContent += 'SUMMARY:' + escapeICS(event.title) + '\n';
    icsContent += 'DESCRIPTION:' + escapeICS(event.description) + '\n';
    icsContent += 'END:VEVENT\nEND:VCALENDAR';

    var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'GoalEvent.ics';
    link.click();
}

function formatICSDate(date) {
    // Format date as YYYYMMDDTHHMMSSZ
    return date.toISOString().replace(/-|:|\.\d+/g, '') + 'Z';
}

function generateUID() {
    return 'uid' + Date.now() + '@growmodeltool.com';
}

function escapeICS(text) {
    return text.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
}

// Initialize progress bar
updateProgressBar('welcome');
