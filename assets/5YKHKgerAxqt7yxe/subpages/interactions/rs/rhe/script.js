// Get references to elements
const whereReading = document.getElementById('whereReading');
const whenReading = document.getElementById('whenReading');
const mindState = document.getElementById('mindState');
const improvements = document.getElementById('improvements');

const whereReadingDisplay = document.getElementById('whereReadingDisplay');
const whenReadingDisplay = document.getElementById('whenReadingDisplay');
const mindStateDisplay = document.getElementById('mindStateDisplay');
const improvementsDisplay = document.getElementById('improvementsDisplay');

const saveButton = document.getElementById('saveButton');
const printButton = document.getElementById('printButton');
const displaySection = document.querySelector('.display-section');

// Load saved data from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
    whereReading.value = localStorage.getItem('whereReading') || '';
    whenReading.value = localStorage.getItem('whenReading') || '';
    mindState.value = localStorage.getItem('mindState') || '';
    improvements.value = localStorage.getItem('improvements') || '';
});

// Save data to localStorage and update display
saveButton.addEventListener('click', () => {
    localStorage.setItem('whereReading', whereReading.value.trim());
    localStorage.setItem('whenReading', whenReading.value.trim());
    localStorage.setItem('mindState', mindState.value.trim());
    localStorage.setItem('improvements', improvements.value.trim());

    whereReadingDisplay.textContent = whereReading.value.trim();
    whenReadingDisplay.textContent = whenReading.value.trim();
    mindStateDisplay.textContent = mindState.value.trim();
    improvementsDisplay.textContent = improvements.value.trim();

    // Show display section
    displaySection.style.display = 'block';
});

// Print the page
printButton.addEventListener('click', () => {
    window.print();
});

// Optional auto-resize for textareas
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Apply auto-resize on input
[whereReading, whenReading, mindState, improvements].forEach(el => {
    el.addEventListener('input', () => autoResize(el));
    // Initial resize
    autoResize(el);
});
