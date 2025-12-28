/*****************************************************************************
 * Data object with tips for each Test Format
 ****************************************************************************/
const testFormatTipsData = {
    "Multiple Choice": `
        <h3>Multiple Choice Tests</h3>
        <p>
            These tests assess your ability to recognize and recall information, 
            as well as analyze possible answers. They often include questions 
            with several options, one of which is correct.
        </p>
        <ul>
            <li><strong>Practice Active Recall:</strong> Create flashcards or use practice quizzes to test your ability to recall information.</li>
            <li><strong>Understand the Concepts:</strong> Don’t just memorize terms; make sure you understand the underlying concepts to handle tricky options.</li>
            <li><strong>Learn How to Eliminate:</strong> Identify and eliminate obviously incorrect answers to improve your chances of choosing the correct one.</li>
        </ul>
    `,
    "Essay": `
        <h3>Essay-Based Tests</h3>
        <p>
            Essay exams require you to present coherent, well-organized responses to questions. 
            These exams test your understanding, critical thinking, and ability to articulate ideas clearly.
        </p>
        <ul>
            <li><strong>Practice Outlining Essays:</strong> Familiarize yourself with organizing thoughts quickly. Practice writing quick outlines for potential essay questions.</li>
            <li><strong>Focus on Themes and Connections:</strong> Understand major themes and their connections within your course material.</li>
            <li><strong>Develop Arguments:</strong> Make sure you can develop clear arguments with supporting evidence. Practice articulating these arguments under timed conditions.</li>
        </ul>
    `,
    "Short Answer": `
        <h3>Short Answer and Problem-Solving Tests</h3>
        <p>
            These tests involve responding to open-ended questions, solving problems, or explaining concepts 
            concisely. They require not just knowledge recall but also application and reasoning.
        </p>
        <ul>
            <li><strong>Practice Brief Explanations:</strong> Work on providing concise but thorough explanations for key concepts.</li>
            <li><strong>Solve Practice Problems:</strong> Practice solving problems of varying difficulty and show all steps.</li>
            <li><strong>Use Example-Based Learning:</strong> Look at examples from class or textbooks to see how concepts are applied in real-world scenarios.</li>
        </ul>
    `,
    "Open-Book/Take-Home": `
        <h3>Open-Book and Take-Home Tests</h3>
        <p>
            While these tests allow you to use materials, they are often more challenging, 
            requiring deeper understanding and analysis.
        </p>
        <ul>
            <li><strong>Organize Your Materials:</strong> Create an easy-to-navigate system for your notes, textbooks, and any other resources.</li>
            <li><strong>Don’t Over-Rely on Materials:</strong> Know the material well, so you're not spending excessive time searching for answers.</li>
            <li><strong>Practice Application and Analysis:</strong> Since these tests often require more than recall, practice applying concepts to new scenarios.</li>
        </ul>
    `,
    "Online/Proctored": `
        <h3>Online or Proctored Tests</h3>
        <p>
            With the rise of online learning, many tests are now taken digitally, often under time constraints 
            and with proctoring software.
        </p>
        <ul>
            <li><strong>Familiarize Yourself with the Platform:</strong> Ensure you know how to navigate the testing platform.</li>
            <li><strong>Check Technology:</strong> Make sure your internet, webcam, and any required software are working properly.</li>
            <li><strong>Simulate the Environment:</strong> Practice taking mock tests under similar conditions, including any time limits.</li>
        </ul>
    `,
    "Cumulative": `
        <h3>Cumulative Exams (Midterms/Finals)</h3>
        <p>
            Cumulative exams cover a large amount of material, often spanning multiple chapters or units. 
            These exams test your ability to connect concepts across the course.
        </p>
        <ul>
            <li><strong>Create Study Guides:</strong> Summarize each topic into comprehensive study guides or visual aids like concept maps.</li>
            <li><strong>Space Out Study Sessions:</strong> Use distributed practice to review topics over time.</li>
            <li><strong>Review Past Tests and Assignments:</strong> Identify key concepts and areas needing more review.</li>
        </ul>
    `,
    "Mixed": `
        <h3>Mixed Format</h3>
        <p>
            If your test format is a mix of multiple question types, you may need a blend of strategies:
        </p>
        <ul>
            <li>Review strategies for each question type (Multiple Choice, Essay, Short Answer, etc.).</li>
            <li>Plan your time carefully to address all sections, focusing on your weaker areas first.</li>
            <li>Practice under mixed conditions (e.g., multiple choice plus short answers).</li>
        </ul>
    `
};

/*****************************************************************************
 * Data object with explanations for each Study Technique
 ****************************************************************************/
const techniqueDescriptions = {
    "Active Recall": `
        <h3>Active Recall</h3>
        <p>
            Active Recall is a study technique that involves actively stimulating your memory during the learning process. 
            Instead of passively reading or listening, you actively try to remember information, which strengthens memory retention.
        </p>
        <ul>
            <li><strong>How to Use:</strong> Use flashcards, practice tests, or simply try to write down everything you know about a topic without looking at your notes.</li>
            <li><strong>Benefits:</strong> Enhances long-term memory, identifies knowledge gaps, and improves the ability to retrieve information under exam conditions.</li>
        </ul>
    `,
    "Annotation & Summarization": `
        <h3>Annotation & Summarization</h3>
        <p>
            This technique involves highlighting key points and making notes directly on your study materials, 
            followed by summarizing the information in your own words. It helps in understanding and retaining information.
        </p>
        <ul>
            <li><strong>How to Use:</strong> While reading, highlight important concepts and write margin notes. After reading, write a summary of the main ideas.</li>
            <li><strong>Benefits:</strong> Improves comprehension, helps in organizing information, and makes review sessions more efficient.</li>
        </ul>
    `,
    "Practice Problems & Self-Quizzing": `
        <h3>Practice Problems & Self-Quizzing</h3>
        <p>
            Engaging with practice problems and self-quizzes helps apply what you've learned and assess your understanding. 
            It prepares you for the types of questions you might encounter in the test.
        </p>
        <ul>
            <li><strong>How to Use:</strong> Solve past exam papers, use online quizzes, or create your own questions based on your study material.</li>
            <li><strong>Benefits:</strong> Reinforces learning, improves problem-solving skills, and builds confidence.</li>
        </ul>
    `,
    "Mind Mapping": `
        <h3>Mind Mapping</h3>
        <p>
            Mind Mapping is a visual technique that involves creating diagrams to represent concepts, ideas, and their relationships. 
            It aids in organizing information and seeing the bigger picture.
        </p>
        <ul>
            <li><strong>How to Use:</strong> Start with a central idea and branch out with related subtopics, using keywords and images.</li>
            <li><strong>Benefits:</strong> Enhances creativity, improves memory, and helps in understanding complex subjects.</li>
        </ul>
    `,
    "Cornell Notes": `
        <h3>Cornell Notes</h3>
        <p>
            Cornell Notes is a systematic format for condensing and organizing notes. It divides the page into sections for notes, cues, and summaries.
        </p>
        <ul>
            <li><strong>How to Use:</strong> Divide your paper into three sections: Notes, Cues, and Summary. During lectures or reading, take detailed notes in the Notes section. Afterward, write key terms or questions in the Cues section and summarize the content at the bottom.</li>
            <li><strong>Benefits:</strong> Promotes active engagement with the material, facilitates review, and improves retention.</li>
        </ul>
    `
};

/*****************************************************************************
 * Utility function to sanitize topic names
 ****************************************************************************/
function sanitizeName(name) {
    return name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

/*****************************************************************************
 * Event listener to show tips when testFormat changes
 ****************************************************************************/
document.getElementById('testFormat').addEventListener('change', displayTestFormatTips);

function displayTestFormatTips() {
    const format = document.getElementById('testFormat').value;
    const tipsContainer = document.getElementById('format-tips');

    if (format && testFormatTipsData[format]) {
        tipsContainer.innerHTML = testFormatTipsData[format];
        tipsContainer.style.display = 'block';
    } else {
        tipsContainer.innerHTML = '';
        tipsContainer.style.display = 'none';
    }
}

/*****************************************************************************
 * Navigation (Next/Prev steps)
 ****************************************************************************/
function nextStep(currentStep) {
    try {
        saveFormData();

        let currentDiv = document.getElementById(`step-${currentStep}`);
        let nextDiv = document.getElementById(`step-${currentStep + 1}`);

        if (currentStep === 2) {
            generateTechniques();
        } else if (currentStep === 3) {
            generateSchedule();
        }

        currentDiv.style.display = "none";
        nextDiv.style.display = "block";

        // Update URL hash
        location.hash = `step-${currentStep + 1}`;

        // Update progress bar
        updateProgressBar(currentStep + 1);
    } catch (error) {
        console.error('Error in nextStep:', error);
        alert('An error occurred while proceeding to the next step. Please check your input and try again.');
    }
}

function prevStep(currentStep) {
    saveFormData();

    let currentDiv = document.getElementById(`step-${currentStep}`);
    let prevDiv = document.getElementById(`step-${currentStep - 1}`);
    currentDiv.style.display = "none";
    prevDiv.style.display = "block";

    // Update URL hash
    location.hash = `step-${currentStep - 1}`;

    // Update progress bar
    updateProgressBar(currentStep - 1);
}

/*****************************************************************************
 * Show step from the URL hash
 ****************************************************************************/
function showStepFromHash() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.style.display = 'none');

    let hash = location.hash || '#step-1';
    let stepDiv = document.querySelector(hash);

    if (stepDiv) {
        stepDiv.style.display = 'block';
    } else {
        document.getElementById('step-1').style.display = 'block';
    }

    // Update progress bar
    let currentStep = parseInt(hash.replace('#step-', '')) || 1;
    updateProgressBar(currentStep);
}

// Listen for hash change to handle back/forward navigation
window.onhashchange = function() {
    saveFormData();
    showStepFromHash();
};

/*****************************************************************************
 * Save form data to Local Storage
 ****************************************************************************/
function saveFormData() {
    let form = document.getElementById('prep-form');
    let formData = new FormData(form);
    let data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    localStorage.setItem('testPrepData', JSON.stringify(data));
}

/*****************************************************************************
 * Load form data from Local Storage
 ****************************************************************************/
function loadFormData() {
    let data = localStorage.getItem('testPrepData');
    if (data) {
        data = JSON.parse(data);

        // Load data into existing form fields
        for (let key in data) {
            let elements = document.getElementsByName(key);
            if (elements.length > 0) {
                elements.forEach(element => {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        if (data[key] === element.value) {
                            element.checked = true;
                        }
                    } else {
                        element.value = data[key];
                    }
                });
            }
        }

        if (data['topics']) {
            // Generate dynamic fields before loading data into them
            generateTechniques();
            generateSchedule();

            // Then fill them in
            for (let key in data) {
                let elements = document.getElementsByName(key);
                if (elements.length > 0) {
                    elements.forEach(element => {
                        element.value = data[key];
                    });
                }
            }
        }
    }
}

/*****************************************************************************
 * Generate technique selection fields for each topic
 ****************************************************************************/
function generateTechniques() {
    let topicsField = document.querySelector('textarea[name="topics"]');
    let topics = topicsField.value.split(',');
    let container = document.getElementById('techniques-container');
    container.innerHTML = '';

    const techniques = [
        'Active Recall',
        'Annotation & Summarization',
        'Practice Problems & Self-Quizzing',
        'Mind Mapping',
        'Cornell Notes'
    ];

    topics.forEach(topic => {
        let trimmedTopic = topic.trim();
        if (trimmedTopic) {
            let sanitizedTopic = sanitizeName(trimmedTopic);
            let div = document.createElement('div');
            div.classList.add('form-group');
            div.innerHTML = `<label for="technique-${sanitizedTopic}">${trimmedTopic}:</label>`;
            let select = document.createElement('select');
            select.name = `technique-${sanitizedTopic}`;
            select.id = `technique-${sanitizedTopic}`;
            select.required = true;
            let defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.text = "Select Technique";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);
            techniques.forEach(tech => {
                let option = document.createElement('option');
                option.value = tech;
                option.text = tech;
                select.appendChild(option);
            });
            div.appendChild(select);
            container.appendChild(div);
        }
    });

    // Load data into newly created fields
    let data = localStorage.getItem('testPrepData');
    if (data) {
        data = JSON.parse(data);
        for (let key in data) {
            let elements = document.getElementsByName(key);
            if (elements.length > 0) {
                elements.forEach(element => {
                    element.value = data[key];
                });
            }
        }
    }
}

/*****************************************************************************
 * Generate schedule fields for each topic
 ****************************************************************************/
function generateSchedule() {
    let topicsField = document.querySelector('textarea[name="topics"]');
    let topics = topicsField.value.split(',');
    let container = document.getElementById('schedule-container');
    container.innerHTML = '';

    topics.forEach(topic => {
        let trimmedTopic = topic.trim();
        if (trimmedTopic) {
            let sanitizedTopic = sanitizeName(trimmedTopic);
            let div = document.createElement('div');
            div.classList.add('topic-schedule');
            div.innerHTML = `<h3>${trimmedTopic}</h3>`;
            div.innerHTML += `
                <div class="form-group">
                    <label for="date-${sanitizedTopic}">Study Date:</label>
                    <input type="date" name="date-${sanitizedTopic}" id="date-${sanitizedTopic}" required>
                </div>
                <div class="form-group">
                    <label for="time-${sanitizedTopic}">Study Time:</label>
                    <input type="time" name="time-${sanitizedTopic}" id="time-${sanitizedTopic}" required>
                </div>
                <div class="form-group">
                    <label for="goals-${sanitizedTopic}">Study Goals:</label>
                    <textarea name="goals-${sanitizedTopic}" id="goals-${sanitizedTopic}" required></textarea>
                </div>
            `;
            container.appendChild(div);
        }
    });

    // Load data into newly created fields
    let data = localStorage.getItem('testPrepData');
    if (data) {
        data = JSON.parse(data);
        for (let key in data) {
            let elements = document.getElementsByName(key);
            if (elements.length > 0) {
                elements.forEach(element => {
                    element.value = data[key];
                });
            }
        }
    }
}

/*****************************************************************************
 * Download ICS file
 ****************************************************************************/
function downloadICS(filename = 'study_schedule.ics') {
    saveFormData();
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test Prep Planner//EN
`;

    let form = document.getElementById('prep-form');
    let formData = new FormData(form);
    let topics = formData.get('topics').split(',');

    topics.forEach(topic => {
        let trimmedTopic = topic.trim();
        if (trimmedTopic) {
            let sanitizedTopic = sanitizeName(trimmedTopic);
            let date = formData.get(`date-${sanitizedTopic}`);
            let time = formData.get(`time-${sanitizedTopic}`);
            let goals = formData.get(`goals-${sanitizedTopic}`);
            let testName = formData.get('testName');

            if (date && time) {
                let dateTime = new Date(`${date}T${time}`);
                let durationMinutes = parseInt(formData.get('duration')) || 60;
                let endDateTime = new Date(dateTime.getTime() + durationMinutes * 60000);
                let dtStamp = dateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                let endDTStamp = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

                icsContent += `BEGIN:VEVENT
DTSTART:${dtStamp}
DTEND:${endDTStamp}
SUMMARY:Study ${trimmedTopic}
DESCRIPTION:${goals}\\nTest: ${testName}
LOCATION:${formData.get('location')}
END:VEVENT
`;
            }
        }
    });

    icsContent += 'END:VCALENDAR';

    let blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/*****************************************************************************
 * Add to Google Calendar
 ****************************************************************************/
function addToGoogleCalendar() {
    saveFormData();
    let form = document.getElementById('prep-form');
    let formData = new FormData(form);
    let topics = formData.get('topics').split(',');
    let baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';

    let openedTabs = 0;

    topics.forEach(topic => {
        let trimmedTopic = topic.trim();
        if (trimmedTopic) {
            let sanitizedTopic = sanitizeName(trimmedTopic);
            let date = formData.get(`date-${sanitizedTopic}`);
            let time = formData.get(`time-${sanitizedTopic}`);
            let goals = formData.get(`goals-${sanitizedTopic}`);
            let testName = formData.get('testName');

            if (date && time) {
                let dateTime = new Date(`${date}T${time}`);
                let durationMinutes = parseInt(formData.get('duration')) || 60;
                let endDateTime = new Date(dateTime.getTime() + durationMinutes * 60000);

                let details = `${goals}\\nTest: ${testName}`;
                let url = `${baseUrl}&text=Study ${encodeURIComponent(trimmedTopic)}&dates=${formatDateForCalendar(dateTime)}/${formatDateForCalendar(endDateTime)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(formData.get('location'))}`;

                window.open(url, '_blank');
                openedTabs++;
            }
        }
    });

    if (openedTabs === 0) {
        alert('No valid study sessions found to add to Google Calendar.');
    } else if (openedTabs > 5) {
        alert(`Opened ${openedTabs} tabs for adding events to Google Calendar. Please check your browser's pop-up blocker settings if some tabs didn't open.`);
    }
}

function formatDateForCalendar(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/*****************************************************************************
 * Add to Outlook Calendar
 ****************************************************************************/
function addToOutlookCalendar() {
    saveFormData();
    let form = document.getElementById('prep-form');
    let formData = new FormData(form);
    let topics = formData.get('topics').split(',');
    let baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';

    let openedTabs = 0;

    topics.forEach(topic => {
        let trimmedTopic = topic.trim();
        if (trimmedTopic) {
            let sanitizedTopic = sanitizeName(trimmedTopic);
            let date = formData.get(`date-${sanitizedTopic}`);
            let time = formData.get(`time-${sanitizedTopic}`);
            let goals = formData.get(`goals-${sanitizedTopic}`);
            let testName = formData.get('testName');

            if (date && time) {
                let dateTime = new Date(`${date}T${time}`);
                let durationMinutes = parseInt(formData.get('duration')) || 60;
                let endDateTime = new Date(dateTime.getTime() + durationMinutes * 60000);

                let details = `${goals}\\nTest: ${testName}`;
                let url = `${baseUrl}?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent('Study ' + trimmedTopic)}&body=${encodeURIComponent(details)}&startdt=${formatDateForOutlookCalendar(dateTime)}&enddt=${formatDateForOutlookCalendar(endDateTime)}&location=${encodeURIComponent(formData.get('location'))}`;

                window.open(url, '_blank');
                openedTabs++;
            }
        }
    });

    if (openedTabs === 0) {

        alert('No valid study sessions found to add to Outlook Calendar.');
    } else if (openedTabs > 5) {
        alert(`Opened ${openedTabs} tabs for adding events to Outlook Calendar. Please check your browser's pop-up blocker settings if some tabs didn't open.`);
    }
}

function formatDateForOutlookCalendar(date) {
    // Example format: 2023-08-25T09:00:00Z
    return date.toISOString();
}

/*****************************************************************************
 * On form submit, display the test plan
 ****************************************************************************/
document.getElementById('prep-form').addEventListener('submit', function(event) {
    event.preventDefault();
    saveFormData();
    displayTestPlan();
});

function displayTestPlan() {
    let form = document.getElementById('prep-form');
    let formData = new FormData(form);

    // Build the test plan HTML content
    let planContent = '<h1>Your Test Prep Plan</h1>';

    // Step 1: Test Details
    planContent += '<h2>Test Details</h2>';
    planContent += `<p><strong>Test Name:</strong> ${formData.get('testName')}</p>`;
    planContent += `<p><strong>Test Date:</strong> ${formData.get('testDate')} ${formData.get('testTime')}</p>`;
    planContent += `<p><strong>Test Format:</strong> ${formData.get('testFormat')}</p>`;
    planContent += `<p><strong>Duration:</strong> ${formData.get('duration')} minutes</p>`;
    planContent += `<p><strong>Location:</strong> ${formData.get('location')}</p>`;
    planContent += `<p><strong>Allowed Materials:</strong> ${formData.get('materials')}</p>`;
    planContent += `<p><strong>Special Instructions:</strong> ${formData.get('instructions')}</p>`;

    // Step 2 + 3 + 4 combined: Topics, Techniques, Schedule
    let topics = formData.get('topics').split(',');
    planContent += '<h2>Study Plan</h2>';

    topics.forEach(topic => {
        let trimmedTopic = topic.trim();
        if (trimmedTopic) {
            let sanitizedTopic = sanitizeName(trimmedTopic);
            planContent += `<h3>${trimmedTopic}</h3>`;
            planContent += `<p><strong>Study Technique:</strong> ${formData.get(`technique-${sanitizedTopic}`)}</p>`;
            planContent += `<p><strong>Study Date:</strong> ${formData.get(`date-${sanitizedTopic}`)} ${formData.get(`time-${sanitizedTopic}`)}</p>`;
            planContent += `<p><strong>Study Goals:</strong> ${formData.get(`goals-${sanitizedTopic}`)}</p>`;
            planContent += '<hr>';
        }
    });

    planContent += '<p>Remember to take breaks, care for yourself, and adjust your plan as needed. Good luck on your test!</p>';
    planContent += '<button onclick="printPlan()">Print Plan</button>';

    // Display the plan in the modal
    document.getElementById('test-plan-content').innerHTML = planContent;
    document.getElementById('test-plan-modal').style.display = 'block';
}

/*****************************************************************************
 * Close modals
 ****************************************************************************/
function closeModal() {
    document.getElementById('test-plan-modal').style.display = 'none';
}

function closeTechniqueModal() {
    document.getElementById('technique-modal').style.display = 'none';
}

/*****************************************************************************
 * Print Plan
 ****************************************************************************/
function printPlan() {
    let printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
        alert('Please allow pop-ups for this website to print your plan.');
        return;
    }

    const contentToPrint = document.getElementById('test-plan-content').innerHTML;

    const styles = `
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 20px;
            color: #333;
        }
        h1, h2, h3 {
            color: #2c3e50;
            margin-top: 0;
        }
        p {
            line-height: 1.6;
        }
        hr {
            margin: 30px 0;
            border: 0;
            border-top: 1px solid #bdc3c7;
        }
        button {
            display: none;
        }
    </style>
    `;

    printWindow.document.open();
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Print Test Plan</title>
            ${styles}
        </head>
        <body>
            <div id="test-plan-content">
                ${contentToPrint}
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();

    printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();

        if ('onafterprint' in printWindow) {
            printWindow.onafterprint = function() {
                printWindow.close();
            };
        } else {
            printWindow.close();
        }
    };
}

/*****************************************************************************
 * Update the progress bar
 ****************************************************************************/
function updateProgressBar(currentStep) {
    const progressBar = document.getElementById('progress');
    const totalSteps = 6;
    const percent = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${percent}%`;
}

/*****************************************************************************
 * On page load
 ****************************************************************************/
window.onload = function() {
    showStepFromHash();
    loadFormData();

    let currentStep = parseInt(location.hash.replace('#step-', '')) || 1;
    updateProgressBar(currentStep);

    // Add event listeners for technique links
    const techniqueLinks = document.querySelectorAll('.technique-link');
    techniqueLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const technique = this.getAttribute('data-technique');
            showTechniqueModal(technique);
        });
    });
};

/*****************************************************************************
 * Generate Technique Modal Content
 ****************************************************************************/
function showTechniqueModal(technique) {
    const content = techniqueDescriptions[technique] || 'No description available.';
    document.getElementById('technique-content').innerHTML = `<h3>${technique}</h3><p>${content}</p>`;
    document.getElementById('technique-modal').style.display = 'block';
}

/*****************************************************************************
 * Optional: Clear Local Storage when the user closes the test plan modal after finishing
 ****************************************************************************/
document.querySelector('.close-button').addEventListener('click', function() {
    localStorage.removeItem('testPrepData');
});
