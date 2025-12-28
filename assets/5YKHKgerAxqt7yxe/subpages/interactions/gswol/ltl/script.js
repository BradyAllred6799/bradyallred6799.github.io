// Define the steps and their respective questions
const steps = [
    {
        title: "Why You Learn",
        image: "images/WHYPencil.png", // Ensure correct path
        fields: [
            {
                label: "Write down your top three reasons for wanting to learn or improve your education.",
                type: "textarea",
                id: "why-reasons"
            },
            {
                label: "In one or two sentences, explain how learning aligns with your long-term vision for yourself.",
                type: "textarea",
                id: "why-purpose"
            }
        ],
        growthMindsetPhrases: [
            "Every setback is a setup for a stronger comeback.",
            "Embrace challenges as opportunities to uncover deeper motivations.",
            "Failures refine your purpose and strengthen your resolve."
        ]
    },
    {
        title: "When You Learn",
        image: "images/WHENPencil.png", // Ensure correct path
        fields: [
            {
                label: "Reflect on your most productive times of day or week.",
                type: "textarea",
                id: "when-productive"
            },
            {
                label: "Map out a typical week and identify specific blocks of time to dedicate to learning or studying.",
                type: "schedule", // Changed from "textarea" to "schedule"
                id: "when-schedule"
            },
            {
                label: "What steps can you take to shift your schedule or habits to align with your most productive times?",
                type: "textarea",
                id: "when-adjustments"
            }
        ],
        growthMindsetPhrases: [
            "Adjusting your schedule after a setback leads to better productivity.",
            "Each challenge in your routine teaches you more about your optimal learning times.",
            "Learning when to persevere and when to adapt enhances your growth."
        ]
    },
    {
        title: "Where You Learn",
        image: "images/WHEREPencil.png", // Ensure correct path
        fields: [
            {
                label: "List three specific locations (physical or digital) where you feel most focused and motivated.",
                type: "textarea",
                id: "where-locations"
            },
            {
                label: "What common challenges arise in these spaces, and how can you minimize them?",
                type: "textarea",
                id: "where-distractions"
            },
            {
                label: "Choose one new study space to try this week and evaluate its effectiveness.",
                type: "textarea",
                id: "where-new-space"
            }
        ],
        growthMindsetPhrases: [
            "Transforming distractions into learning moments strengthens your focus.",
            "A supportive environment turns challenges into growth opportunities.",
            "Choosing new study spaces after setbacks fosters resilience."
        ]
    },
    {
        title: "How You Learn",
        image: "images/HOWPencil.png", // Ensure correct path
        fields: [
            {
                label: "Identify your preferred learning methods (e.g., visual aids, hands-on practice, group discussions).",
                type: "textarea",
                id: "how-methods"
            },
            {
                label: "How will you combine your preferred methods to tackle a current learning challenge or goal?",
                type: "textarea",
                id: "how-strategy"
            }
        ],
        growthMindsetPhrases: [
            "Using diverse learning methods helps you navigate and learn from failures.",
            "Strategizing your approach turns mistakes into valuable lessons.",
            "Every failed attempt is a step closer to mastering your learning techniques."
        ]
    }
];

let currentStep = 0;
let scheduleData = {}; // To store scheduled time blocks

// Function to create a step's HTML
function createStepHTML(step, index) {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');
    if (index === 0) stepDiv.classList.add('active');

    // Step Content Wrapper
    const stepContentDiv = document.createElement('div');
    stepContentDiv.classList.add('step-content');

    // Image
    const img = document.createElement('img');
    img.src = step.image;
    img.alt = `${step.title} Illustration`;
    stepContentDiv.appendChild(img);

    // Content Wrapper
    const contentDiv = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = step.title;
    contentDiv.appendChild(title);

    // Add Growth Mindset Phrases
    if (step.growthMindsetPhrases && step.growthMindsetPhrases.length > 0) {
        const phraseDiv = document.createElement('div');
        phraseDiv.classList.add('growth-mindset-phrase');
        // Randomly select a phrase to display
        const randomIndex = Math.floor(Math.random() * step.growthMindsetPhrases.length);
        phraseDiv.textContent = step.growthMindsetPhrases[randomIndex];
        contentDiv.appendChild(phraseDiv);
    }

    step.fields.forEach(field => {
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label; // Instructional text as label
        contentDiv.appendChild(label);

        if (field.type === "textarea") {
            const textarea = document.createElement('textarea');
            textarea.id = field.id;
            // Removed placeholder
            textarea.rows = 4;
            contentDiv.appendChild(textarea);
        } else if (field.type === "text") {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = field.id;
            // Removed placeholder
            contentDiv.appendChild(input);
        } else if (field.type === "schedule") {
            // Create Schedule Builder UI
            const scheduleDiv = document.createElement('div');
            scheduleDiv.classList.add('schedule-builder');
            scheduleDiv.id = field.id;

            const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            daysOfWeek.forEach(day => {
                const dayBlock = document.createElement('div');
                dayBlock.classList.add('day-block');

                const dayLabel = document.createElement('label');
                dayLabel.textContent = day;
                dayLabel.setAttribute('for', `${field.id}-${day}`);
                dayBlock.appendChild(dayLabel);

                const timeBlocksDiv = document.createElement('div');
                timeBlocksDiv.classList.add('time-blocks');
                timeBlocksDiv.id = `${field.id}-${day}-blocks`;

                dayBlock.appendChild(timeBlocksDiv);

                const addTimeBtn = document.createElement('button');
                addTimeBtn.type = 'button';
                addTimeBtn.classList.add('add-time-btn');
                addTimeBtn.textContent = 'Add Time';
                addTimeBtn.addEventListener('click', () => addTimeBlock(field.id, day));
                dayBlock.appendChild(addTimeBtn);

                scheduleDiv.appendChild(dayBlock);
            });

            contentDiv.appendChild(scheduleDiv);
        }
    });

    stepContentDiv.appendChild(contentDiv);
    stepDiv.appendChild(stepContentDiv);

    return stepDiv;
}

// Function to add a time block for a specific day
function addTimeBlock(fieldId, day) {
    const timeBlocksDiv = document.getElementById(`${fieldId}-${day}-blocks`);

    const timeEntryDiv = document.createElement('div');
    timeEntryDiv.classList.add('time-entry');

    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'time';
    startTimeInput.required = true;
    startTimeInput.placeholder = 'Start Time';
    timeEntryDiv.appendChild(startTimeInput);

    const endTimeInput = document.createElement('input');
    endTimeInput.type = 'time';
    endTimeInput.required = true;
    endTimeInput.placeholder = 'End Time';
    timeEntryDiv.appendChild(endTimeInput);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.addEventListener('click', () => {
        timeBlocksDiv.removeChild(timeEntryDiv);
        // Update scheduleData
        if (scheduleData[day]) {
            scheduleData[day] = scheduleData[day].filter(block => block !== timeEntryDiv);
            if (scheduleData[day].length === 0) {
                delete scheduleData[day];
            }
        }
    });
    timeEntryDiv.appendChild(removeBtn);

    timeBlocksDiv.appendChild(timeEntryDiv);

    // Store reference in scheduleData
    if (!scheduleData[day]) {
        scheduleData[day] = [];
    }
    scheduleData[day].push(timeEntryDiv);
}

// Initialize the steps
function initSteps() {
    const stepContainer = document.getElementById('step-container');
    steps.forEach((step, index) => {
        const stepHTML = createStepHTML(step, index);
        stepContainer.appendChild(stepHTML);
    });
}

// Show the current step
function showStep(index) {
    const allSteps = document.querySelectorAll('.step');
    allSteps.forEach((step, idx) => {
        step.classList.toggle('active', idx === index);
    });

    // Update navigation buttons
    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').textContent = index === steps.length - 1 ? 'Finish' : 'Next';
}

// Handle Next button click
function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    } else {
        // Show summary
        collectSummary();
    }
}

// Handle Previous button click
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// Collect responses and display summary
function collectSummary() {
    const main = document.querySelector('main');
    main.classList.add('hidden');

    const summary = document.getElementById('summary');
    summary.classList.remove('hidden');

    // Populate summary fields
    document.getElementById('summary-why').textContent = document.getElementById('why-reasons').value;
    document.getElementById('summary-purpose').textContent = document.getElementById('why-purpose').value;

    document.getElementById('summary-when').textContent = document.getElementById('when-productive').value;

    // Retrieve scheduled time blocks
    let scheduleText = '';
    for (const day in scheduleData) {
        scheduleText += `${day}:\n`;
        scheduleData[day].forEach(block => {
            const start = block.querySelector('input[type="time"]').value;
            const end = block.querySelectorAll('input[type="time"]')[1].value;
            scheduleText += `  - ${start} to ${end}\n`;
        });
    }
    if (scheduleText === '') {
        scheduleText = 'No study blocks scheduled.';
    }
    document.getElementById('summary-schedule').textContent = scheduleText.trim();

    document.getElementById('summary-adjustments').textContent = document.getElementById('when-adjustments').value;

    document.getElementById('summary-where').textContent = document.getElementById('where-locations').value;
    document.getElementById('summary-distractions').textContent = document.getElementById('where-distractions').value;
    document.getElementById('summary-new-space').textContent = document.getElementById('where-new-space').value;

    document.getElementById('summary-how-methods').textContent = document.getElementById('how-methods').value;
    document.getElementById('summary-how-strategy').textContent = document.getElementById('how-strategy').value;

    // Add a final growth mindset phrase if not already present
    const finalPhrase = summary.querySelector('.growth-mindset');
    if (!finalPhrase) {
        const finalPhraseElement = document.createElement('p');
        finalPhraseElement.classList.add('growth-mindset');
        finalPhraseElement.textContent = "Remember, your commitment today paves the way for your achievements tomorrow!";
        summary.appendChild(finalPhraseElement);
    }
}

// Print to PDF
function printPDF() {
    window.print();
}

// Save to Google Calendar
function saveToGoogleCalendar() {
    const events = [];

    for (const day in scheduleData) {
        scheduleData[day].forEach(block => {
            const startTime = block.querySelector('input[type="time"]').value;
            const endTime = block.querySelectorAll('input[type="time"]')[1].value;

            if (startTime && endTime) {
                events.push({
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                    title: "Study Session"
                });
            }
        });
    }

    if (events.length === 0) {
        alert("No study blocks to add to Google Calendar.");
        return;
    }

    // Create multiple events based on scheduled blocks
    const calendarUrls = events.map(event => {
        const dayDate = getDateForDay(event.day);
        if (!dayDate) return null;

        const start = new Date(dayDate);
        const [startHour, startMinute] = event.startTime.split(':').map(Number);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(dayDate);
        const [endHour, endMinute] = event.endTime.split(':').map(Number);
        end.setHours(endHour, endMinute, 0);

        const pad = (num) => String(num).padStart(2, '0');

        const formatDate = (date) => {
            return date.getUTCFullYear() +
                pad(date.getUTCMonth() + 1) +
                pad(date.getUTCDate()) + 'T' +
                pad(date.getUTCHours()) +
                pad(date.getUTCMinutes()) +
                pad(date.getUTCSeconds()) + 'Z';
        };

        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent("Personalized Learning Plan Study Session");
        const location = encodeURIComponent("");
        const dates = `${formatDate(start)}/${formatDate(end)}`;

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    }).filter(url => url !== null);

    // Open all URLs in new tabs
    calendarUrls.forEach(url => {
        window.open(url, '_blank');
    });
}

// Helper function to get a date object for the next occurrence of a given day
function getDateForDay(day) {
    const daysMap = {
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6
    };

    const dayOfWeek = daysMap[day];
    if (dayOfWeek === undefined) return null;

    const date = new Date();
    const currentDay = date.getDay();
    let diff = dayOfWeek - currentDay;
    if (diff < 0) diff += 7;
    date.setDate(date.getDate() + diff);
    date.setSeconds(0, 0);
    return date;
}

// Download iCal file
function downloadiCal() {
    const events = [];

    for (const day in scheduleData) {
        scheduleData[day].forEach(block => {
            const startTime = block.querySelector('input[type="time"]').value;
            const endTime = block.querySelectorAll('input[type="time"]')[1].value;

            if (startTime && endTime) {
                events.push({
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                    title: "Study Session"
                });
            }
        });
    }

    if (events.length === 0) {
        alert("No study blocks to add to iCal.");
        return;
    }

    let icalContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Product//EN
`;

    const pad = (num) => String(num).padStart(2, '0');

    const formatDate = (date) => {
        return date.getUTCFullYear() +
            pad(date.getUTCMonth() + 1) +
            pad(date.getUTCDate()) + 'T' +
            pad(date.getUTCHours()) +
            pad(date.getUTCMinutes()) +
            pad(date.getUTCSeconds()) + 'Z';
    };

    events.forEach(event => {
        const dayDate = getDateForDay(event.day);
        if (!dayDate) return;

        const start = new Date(dayDate);
        const [startHour, startMinute] = event.startTime.split(':').map(Number);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(dayDate);
        const [endHour, endMinute] = event.endTime.split(':').map(Number);
        end.setHours(endHour, endMinute, 0);

        icalContent += 
`BEGIN:VEVENT
UID:${new Date().getTime()}@yourdomain.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:${event.title}
DESCRIPTION:Personalized Learning Plan Study Session
END:VEVENT
`;
    });

    icalContent += 
`END:VCALENDAR`;

    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-session.ics';
    a.click();
    URL.revokeObjectURL(url);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initSteps();
    showStep(currentStep);

    document.getElementById('next-btn').addEventListener('click', nextStep);
    document.getElementById('prev-btn').addEventListener('click', prevStep);
    document.getElementById('print-btn').addEventListener('click', printPDF);
    document.getElementById('save-calendar-btn').addEventListener('click', saveToGoogleCalendar);
    document.getElementById('download-ical-btn').addEventListener('click', downloadiCal);
    
    // New Event Listener for "Previous" Button on Summary Page
    document.getElementById('prev-summary-btn').addEventListener('click', function() {
        // Hide the summary section
        document.getElementById('summary').classList.add('hidden');
        
        // Show the main section
        document.querySelector('main').classList.remove('hidden');
        
        // Navigate to the last step (assuming the last step is the one before summary)
        currentStep = steps.length - 1;
        showStep(currentStep);
    });
});
