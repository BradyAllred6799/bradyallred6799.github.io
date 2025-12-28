let currentStep = 1;
const totalSteps = 4;
const data = {
    needs: []
};

// Show a specific step
function showStep(step) {
    for (let i = 1; i <= totalSteps; i++) {
        const stepDiv = document.getElementById('step-' + i);
        if (stepDiv) {
            stepDiv.classList.remove('active');
            stepDiv.style.display = 'none';
        }
    }
    const activeStep = document.getElementById('step-' + step);
    if (activeStep) {
        activeStep.classList.add('active');
        activeStep.style.display = 'block';
        // Move focus to the heading of the active step
        const heading = activeStep.querySelector('h2');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    }
}

// Move to the next step
function nextStep() {
    console.log(`Attempting to move from Step ${currentStep} to Step ${currentStep + 1}`);
    if (currentStep === 1) {
        if (!collectNeeds()) {
            console.log('Failed to collect needs.');
            return;
        }
        // After collecting needs in Step 1, initialize helper sections
        setupHelperContainers();
        // Automatically add one helper input per need to get started
        data.needs.forEach((item, needIndex) => addHelperForNeed(needIndex));

    } else if (currentStep === 2) {
        if (!collectHelpers()) {
            console.log('Failed to collect helpers.');
            return;
        }
        // After collecting helpers in Step 2, generate plan inputs for Step 3
        generatePlansInputs();
    } else if (currentStep === 3) {
        if (!collectPlans()) {
            console.log('Failed to collect plans.');
            return;
        }
        // After collecting plans in Step 3, proceed to Step 4
    }
    if (currentStep < totalSteps) {
        currentStep++;
        console.log(`Moving to Step ${currentStep}`);
        showStep(currentStep);
    }
}

// Move to the previous step
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        console.log(`Moving back to Step ${currentStep}`);
        showStep(currentStep);
    }
}

// Add a new need input field in Step 1
function addNeed() {
    const needsContainer = document.getElementById('needs-container');
    const needCount = needsContainer.children.length;
    const needGroup = document.createElement('div');
    needGroup.className = 'need-group';

    const label = document.createElement('label');
    label.setAttribute('for', `need-${needCount}`);
    label.textContent = `Need ${needCount + 1}:`;
    needGroup.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `need-${needCount}`;
    input.name = `need-${needCount}`;
    input.placeholder = 'Enter your need here...';
    input.setAttribute('aria-required', 'true');
    needGroup.appendChild(input);

    needsContainer.appendChild(needGroup);
    console.log(`Added Need ${needCount + 1}`);
}

// Collect needs from Step 1
function collectNeeds() {
    const needsContainer = document.getElementById('needs-container');
    const needGroups = needsContainer.getElementsByClassName('need-group');
    console.log(`Collecting needs. Total needs found: ${needGroups.length}`);
    if (needGroups.length === 0) {
        alert('Please add at least one need.');
        return false;
    }
    data.needs = []; // Reset data
    for (let i = 0; i < needGroups.length; i++) {
        const input = needGroups[i].querySelector('input');
        const needText = input.value.trim();
        console.log(`Need ${i + 1} text: "${needText}"`);
        if (!needText) {
            alert(`Please fill out need ${i + 1}.`);
            return false;
        }
        data.needs.push({
            need: needText,
            helpers: []
        });
    }
    return true;
}

// Setup helper containers in Step 2 based on needs
function setupHelperContainers() {
    const helpersContainer = document.getElementById('helpers-container');
    helpersContainer.innerHTML = ''; // Clear previous content
    data.needs.forEach((item, needIndex) => {
        const needHelperSection = document.createElement('div');
        needHelperSection.className = 'need-helper-section';

        const needHeading = document.createElement('h3');
        needHeading.textContent = `Helpers for "${item.need}":`;
        needHelperSection.appendChild(needHeading);

        const specificHelpersContainer = document.createElement('div');
        specificHelpersContainer.id = `helpers-container-${needIndex}`;
        needHelperSection.appendChild(specificHelpersContainer);

        const addHelperButton = document.createElement('button');
        addHelperButton.type = 'button';
        addHelperButton.className = 'add-button';
        addHelperButton.textContent = `Add Helper for "${item.need}"`;
        addHelperButton.setAttribute('aria-label', `Add a helper for "${item.need}"`);
        addHelperButton.onclick = () => addHelperForNeed(needIndex);
        needHelperSection.appendChild(addHelperButton);

        helpersContainer.appendChild(needHelperSection);
        console.log(`Setup helpers container for Need ${needIndex + 1}: "${item.need}"`);
    });
}

// Add a new helper input field for a specific need in Step 2
function addHelperForNeed(needIndex) {
    const helpersContainer = document.getElementById(`helpers-container-${needIndex}`);
    const helperCount = helpersContainer.children.length;
    const helperGroup = document.createElement('div');
    helperGroup.className = 'helper-group';

    const label = document.createElement('label');
    label.setAttribute('for', `helper-${needIndex}-${helperCount}`);
    label.textContent = `Helper ${helperCount + 1} for "${data.needs[needIndex].need}":`;
    helperGroup.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `helper-${needIndex}-${helperCount}`;
    input.name = `helper-${needIndex}-${helperCount}`;
    input.placeholder = 'Enter helper name here...';
    input.setAttribute('aria-required', 'true');
    helperGroup.appendChild(input);

    helpersContainer.appendChild(helperGroup);
    console.log(`Added Helper ${helperCount + 1} for Need ${needIndex + 1}: "${data.needs[needIndex].need}"`);
}

// Collect helpers from Step 2
function collectHelpers() {
    for (let needIndex = 0; needIndex < data.needs.length; needIndex++) {
        const item = data.needs[needIndex];
        const helpersContainer = document.getElementById(`helpers-container-${needIndex}`);
        if (!helpersContainer) {
            alert(`Helpers container for need "${item.need}" not found.`);
            return false;
        }
        const helperGroups = helpersContainer.querySelectorAll('.helper-group');
        console.log(`Need ${needIndex + 1}: "${item.need}" has ${helperGroups.length} helpers.`);
        if (helperGroups.length === 0) {
            alert(`Please add at least one helper for "${item.need}".`);
            return false;
        }
        item.helpers = []; // Reset helpers
        for (let j = 0; j < helperGroups.length; j++) {
            const input = helperGroups[j].querySelector('input');
            if (!input) {
                alert(`Helper input not found for need "${item.need}" in helper ${j + 1}.`);
                return false;
            }
            const helperText = input.value.trim();
            console.log(`Helper ${j + 1} for need "${item.need}": "${helperText}"`);
            if (!helperText) {
                alert(`Please fill out helper ${j + 1} for "${item.need}".`);
                return false;
            }
            item.helpers.push(helperText);
        }
    }
    return true;
}

// Collect plans from Step 3
function collectPlans() {
    const plansContainer = document.getElementById('plans-container');
    const resourceEntries = plansContainer.getElementsByClassName('resource-entry');
    console.log(`Collecting plans. Total resources found: ${resourceEntries.length}`);
    
    if (resourceEntries.length === 0) {
        alert('No resources found. Please ensure you have helpers in Step 2.');
        return false;
    }
    
    // Initialize plans array for each need
    data.needs.forEach((item) => {
        item.plans = [];
    });
    
    for (let i = 0; i < resourceEntries.length; i++) {
        const entry = resourceEntries[i];
        const needIndex = parseInt(entry.getAttribute('data-need-index'));
        const helperIndex = parseInt(entry.getAttribute('data-helper-index'));
        const helperName = data.needs[needIndex].helpers[helperIndex];

        const planText = entry.querySelector('textarea').value.trim();
        const date = entry.querySelector(`input[name="date-${needIndex}-${helperIndex}"]`).value;
        const time = entry.querySelector(`input[name="time-${needIndex}-${helperIndex}"]`).value;

        console.log(`Plan for "${helperName}": "${planText}", Date: "${date}", Time: "${time}"`);

        if (!planText || !date || !time) {
            alert(`Please complete all fields for helper "${helperName}".`);
            console.log(`Validation failed for helper "${helperName}".`);
            return false;
        }

        // Store the plan details
        data.needs[needIndex].plans[helperIndex] = {
            helper: helperName,
            plan: planText,
            date: date,
            time: time
        };
    }

    return true;
}

// Generate plan input fields based on helpers for Step 3
function generatePlansInputs() {
    const plansContainer = document.getElementById('plans-container');
    plansContainer.innerHTML = ''; // Clear previous content
    data.needs.forEach((item, needIndex) => {
        item.helpers.forEach((helper, helperIndex) => {
            const resourceGroup = document.createElement('div');
            resourceGroup.className = 'resource-entry';
            resourceGroup.setAttribute('data-need-index', needIndex);
            resourceGroup.setAttribute('data-helper-index', helperIndex);

            // Remove Resource Button
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'remove-resource-button';
            removeButton.textContent = 'Remove';
            removeButton.setAttribute('aria-label', `Remove resource for "${helper}"`);
            removeButton.onclick = () => removeResource(resourceGroup);
            resourceGroup.appendChild(removeButton);

            // Helper Label
            const helperLabel = document.createElement('label');
            helperLabel.setAttribute('for', `plan-${needIndex}-${helperIndex}`);
            helperLabel.textContent = `Plan to ask "${helper}":`;
            resourceGroup.appendChild(helperLabel);

            // Plan Textarea
            const planTextarea = document.createElement('textarea');
            planTextarea.id = `plan-${needIndex}-${helperIndex}`;
            planTextarea.name = `plan-${needIndex}-${helperIndex}`;
            planTextarea.rows = 3;
            planTextarea.placeholder = 'Describe your plan here...';
            planTextarea.setAttribute('aria-required', 'true');
            resourceGroup.appendChild(planTextarea);

            // Date Input
            const dateLabel = document.createElement('label');
            dateLabel.setAttribute('for', `date-${needIndex}-${helperIndex}`);
            dateLabel.textContent = 'Date:';
            resourceGroup.appendChild(dateLabel);

            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.id = `date-${needIndex}-${helperIndex}`;
            dateInput.name = `date-${needIndex}-${helperIndex}`;
            dateInput.setAttribute('aria-required', 'true');
            resourceGroup.appendChild(dateInput);

            // Time Input
            const timeLabel = document.createElement('label');
            timeLabel.setAttribute('for', `time-${needIndex}-${helperIndex}`);
            timeLabel.textContent = 'Time:';
            resourceGroup.appendChild(timeLabel);

            const timeInput = document.createElement('input');
            timeInput.type = 'time';
            timeInput.id = `time-${needIndex}-${helperIndex}`;
            timeInput.name = `time-${needIndex}-${helperIndex}`;
            timeInput.setAttribute('aria-required', 'true');
            resourceGroup.appendChild(timeInput);

            // Calendar Buttons
            const calendarButtonsDiv = document.createElement('div');
            calendarButtonsDiv.className = 'calendar-buttons';

            // Google Calendar Button
            const googleButton = document.createElement('button');
            googleButton.type = 'button';
            googleButton.className = 'calendar-button';
            googleButton.textContent = 'Add to Google Calendar';
            // Pass the resourceGroup element to the function
            googleButton.onclick = () => addToGoogleCalendar(resourceGroup);
            calendarButtonsDiv.appendChild(googleButton);

            // iCal Download Button
            const iCalButton = document.createElement('button');
            iCalButton.type = 'button';
            iCalButton.className = 'calendar-button';
            iCalButton.textContent = 'Download iCal Event';
            // Pass the resourceGroup element to the function
            iCalButton.onclick = () => downloadICal(resourceGroup);
            calendarButtonsDiv.appendChild(iCalButton);

            resourceGroup.appendChild(calendarButtonsDiv);

            plansContainer.appendChild(resourceGroup);
            console.log(`Generated plan input for Helper "${helper}" in Need "${item.need}"`);
        });
    });
}

// Remove a resource entry
function removeResource(resourceGroup) {
    const needIndex = parseInt(resourceGroup.getAttribute('data-need-index'));
    const helperIndex = parseInt(resourceGroup.getAttribute('data-helper-index'));
    // Remove from DOM
    const plansContainer = document.getElementById('plans-container');
    plansContainer.removeChild(resourceGroup);
    // Remove from data
    if (data.needs[needIndex].plans) {
        delete data.needs[needIndex].plans[helperIndex];
    }
    console.log(`Removed plan for Helper ${helperIndex + 1} in Need ${needIndex + 1}`);
}

// Add event to Google Calendar
function addToGoogleCalendar(resourceGroup) {
    // Retrieve needIndex and helperIndex from the resourceGroup's data attributes
    const needIndex = parseInt(resourceGroup.getAttribute('data-need-index'));
    const helperIndex = parseInt(resourceGroup.getAttribute('data-helper-index'));

    const helperName = data.needs[needIndex].helpers[helperIndex];
    console.log(`Adding to Google Calendar for Helper "${helperName}"`);

    // Retrieve plan details directly from the DOM
    const planTextarea = resourceGroup.querySelector('textarea');
    const dateInput = resourceGroup.querySelector(`input[name="date-${needIndex}-${helperIndex}"]`);
    const timeInput = resourceGroup.querySelector(`input[name="time-${needIndex}-${helperIndex}"]`);

    const planText = planTextarea.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    console.log(`Plan Text: "${planText}", Date: "${date}", Time: "${time}"`);

    // Validate inputs
    if (!planText || !date || !time) {
        alert(`Please complete all fields for helper "${helperName}".`);
        console.log('Validation failed: Missing plan details.');
        return;
    }

    const eventTitle = encodeURIComponent(`Reach out to ${helperName}`);
    const eventDescription = encodeURIComponent(planText);
    const eventLocation = encodeURIComponent('');
    const eventStart = new Date(`${date}T${time}:00`);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // 1-hour event

    // Format dates as YYYYMMDDTHHMMSS
    const formatDateForGoogle = (date) => {
        const pad = (num) => num.toString().padStart(2, '0');
        return date.getFullYear().toString() +
            pad(date.getMonth() + 1) +
            pad(date.getDate()) + 'T' +
            pad(date.getHours()) +
            pad(date.getMinutes()) +
            pad(date.getSeconds());
    };

    const startStr = formatDateForGoogle(eventStart);
    const endStr = formatDateForGoogle(eventEnd);

    // Construct Google Calendar URL without 'output=xml'
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startStr}/${endStr}&details=${eventDescription}&location=${eventLocation}`;

    console.log(`Google Calendar URL: ${googleCalendarUrl}`);

    // Open Google Calendar in a new tab
    window.open(googleCalendarUrl, '_blank');

    // Optional: Notify the user
    alert('Event successfully added to Google Calendar!');
}

// Download iCal (.ics) file
function downloadICal(resourceGroup) {
    // Retrieve needIndex and helperIndex from the resourceGroup's data attributes
    const needIndex = parseInt(resourceGroup.getAttribute('data-need-index'));
    const helperIndex = parseInt(resourceGroup.getAttribute('data-helper-index'));

    const helperName = data.needs[needIndex].helpers[helperIndex];
    console.log(`Downloading iCal for Helper "${helperName}"`);

    // Retrieve plan details directly from the DOM
    const planTextarea = resourceGroup.querySelector('textarea');
    const dateInput = resourceGroup.querySelector(`input[name="date-${needIndex}-${helperIndex}"]`);
    const timeInput = resourceGroup.querySelector(`input[name="time-${needIndex}-${helperIndex}"]`);

    const planText = planTextarea.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    console.log(`Plan Text: "${planText}", Date: "${date}", Time: "${time}"`);

    // Validate inputs
    if (!planText || !date || !time) {
        alert(`Please complete all fields for helper "${helperName}".`);
        console.log('Validation failed: Missing plan details.');
        return;
    }

    const eventTitle = `Reach out to ${helperName}`;
    const eventDescription = planText;
    const eventLocation = '';
    const eventStart = new Date(`${date}T${time}:00`);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // 1-hour event

    const pad = (num) => num.toString().padStart(2, '0');

    const formatDate = (date) => {
        return date.getUTCFullYear().toString() +
            pad(date.getUTCMonth() + 1) +
            pad(date.getUTCDate()) + 'T' +
            pad(date.getUTCHours()) +
            pad(date.getUTCMinutes()) +
            pad(date.getUTCSeconds()) + 'Z';
    };

    const icsContent =
        `BEGIN:VCALENDAR\r\n` +
        `VERSION:2.0\r\n` +
        `PRODID:-//Your Company//Help Seeking Assistant//EN\r\n` +
        `BEGIN:VEVENT\r\n` +
        `UID:${Date.now()}@yourcompany.com\r\n` +
        `DTSTAMP:${formatDate(new Date())}\r\n` +
        `DTSTART:${formatDate(eventStart)}\r\n` +
        `DTEND:${formatDate(eventEnd)}\r\n` +
        `SUMMARY:${eventTitle}\r\n` +
        `DESCRIPTION:${eventDescription}\r\n` +
        `LOCATION:${eventLocation}\r\n` +
        `END:VEVENT\r\n` +
        `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventTitle}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional: Notify the user
    alert('iCal event downloaded successfully!');
}

// Collect evaluation responses from Step 4 (Optional Enhancement)
function collectEvaluations() {
    const evalForm = document.getElementById('evaluation-form');
    if (!evalForm) {
        console.log('Evaluation form not found.');
        return true; // Proceed without evaluations if form doesn't exist
    }
    const evaluations = {};
    for (let i = 1; i <=4; i++) {
        const response = evalForm.querySelector(`#eval-${i}`).value.trim();
        if (!response) {
            alert(`Please answer evaluation question ${i}.`);
            console.log(`Evaluation question ${i} is not answered.`);
            return false;
        }
        evaluations[`eval${i}`] = response;
    }
    data.evaluations = evaluations;
    console.log('Collected evaluation responses:', evaluations);
    return true;
}

// Generate summary for printing
function generateSummary() {
    const summaryContent = document.getElementById('summary-content');
    summaryContent.innerHTML = ''; // Clear previous content

    data.needs.forEach((item, index) => {
        const needSection = document.createElement('div');
        needSection.className = 'summary-section';

        const needTitle = document.createElement('h3');
        needTitle.textContent = `Need ${index + 1}: ${item.need}`;
        needSection.appendChild(needTitle);

        // Helpers and Plans
        const helpersList = document.createElement('ul');
        item.helpers.forEach((helper, hIndex) => {
            const plan = item.plans[hIndex];
            const helperItem = document.createElement('li');
            helperItem.innerHTML = `
                <strong>Helper:</strong> ${helper}<br>
                <strong>Plan:</strong> ${plan ? plan.plan : 'No plan provided.'}<br>
                <strong>Date & Time:</strong> ${plan ? `${plan.date} at ${plan.time}` : 'N/A'}
            `;
            helpersList.appendChild(helperItem);
        });
        needSection.appendChild(helpersList);

        summaryContent.appendChild(needSection);
    });

    // Include Step 4: Evaluate the Help
    if (data.evaluations) {
        const step4Section = document.createElement('div');
        step4Section.className = 'summary-section';

        const step4Title = document.createElement('h3');
        step4Title.textContent = `Step 4: Evaluate the Help`;
        step4Section.appendChild(step4Title);

        const evaluationsList = document.createElement('ul');
        for (let i = 1; i <=4; i++) {
            const evalItem = document.createElement('li');
            evalItem.innerHTML = `<strong>Q${i}:</strong> ${data.evaluations[`eval${i}`]}`;
            evaluationsList.appendChild(evalItem);
        }
        step4Section.appendChild(evaluationsList);

        summaryContent.appendChild(step4Section);
    }
}

// Show the summary and Step 4 for printing
function printPDF() {
    if (currentStep !== totalSteps) {
        alert('Please complete all steps before printing.');
        return;
    }

    // Generate summary content
    generateSummary();

    // Show the summary section
    const summaryDiv = document.getElementById('summary');
    if (summaryDiv) {
        summaryDiv.style.display = 'block';
    }

    // Delay to ensure the summary is rendered
    setTimeout(() => {
        window.print();
        // Hide the summary after printing
        if (summaryDiv) {
            summaryDiv.style.display = 'none';
        }
    }, 500);
}

// Keyboard Navigation Enhancements
document.addEventListener('keydown', function (event) {
    // Allow navigation with Enter key on buttons
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'BUTTON') {
            activeElement.click();
            event.preventDefault();
        }
    }
});

// Initialize Step 1 with one need input on page load
document.addEventListener('DOMContentLoaded', () => {
    addNeed();
});
