// script.js

// Variables to keep track of the current list and item being added
let currentList = null;
let currentItem = null;

// Variables to store the elements that triggered the modals
let guidingQuestionsTrigger = null;
let instructionsTrigger = null;

// Get modal elements for Guiding Questions
const guidingModal = document.getElementById("guiding-modal");
const guidingCloseButton = document.getElementById("guiding-close-button");
const guidingModalTitle = document.getElementById("guiding-modal-title");
const guidingQuestionsContainer = document.getElementById("guiding-questions-container");
const guidingQuestionsForm = document.getElementById("guiding-questions-form");

// Get modal elements for Instructions
const instructionsModal = document.getElementById("instructions-modal");
const instructionsCloseButton = document.getElementById("instructions-close-button");
const instructionsModalContent = document.querySelector(".instructions-modal .modal-content");

// Get Print Button and Instructions Button
const printButton = document.getElementById("print-button");
const instructionsButton = document.getElementById("instructions-button");

// Define guiding questions for each list
const guidingQuestions = {
    "known-list": [
        {
            id: "known-q1",
            text: "1. Why is this a topic you want to write about?"
        },
        {
            id: "known-q2",
            text: "2. Is what you know about the topic positive or negative?"
        },
        {
            id: "known-q3",
            text: "3. Is your background knowledge based on facts or hearsay?"
        }
    ],
    "want-to-know-list": [
        {
            id: "want-q1",
            text: "1. Where do I go to find out more about the subject?"
        },
        {
            id: "want-q2",
            text: "2. What are all the points of view on this subject?"
        },
        {
            id: "want-q3",
            text: "3. What do people who don’t agree with me say about this subject?"
        },
        {
            id: "want-q4",
            text: "4. What will my audience know about this subject? How much will I have to tell them? Do I know what they need to know?"
        }
    ]
};

/**
 * Function to open the modal with guiding questions
 * @param {string} listId - The ID of the list ("known-list" or "want-to-know-list")
 * @param {string} itemText - The text of the item being added
 * @param {HTMLElement} trigger - The element that triggered the modal
 */
function openGuidingModal(listId, itemText, trigger) {
    currentList = listId;
    currentItem = itemText;
    guidingQuestionsTrigger = trigger;

    // Set modal title based on the list
    guidingModalTitle.textContent = `Guiding Questions for: "${itemText}"`;

    // Clear previous questions
    guidingQuestionsContainer.innerHTML = "";

    // Get the relevant questions
    const questions = guidingQuestions[listId];

    // Dynamically create questions
    questions.forEach(q => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        const label = document.createElement("label");
        label.setAttribute("for", q.id);
        label.textContent = q.text;

        const textarea = document.createElement("textarea");
        textarea.id = q.id;
        textarea.name = q.id;
        textarea.rows = 2;
        textarea.placeholder = "Your answer here...";
        textarea.required = true; // Make answers required

        questionDiv.appendChild(label);
        questionDiv.appendChild(textarea);
        guidingQuestionsContainer.appendChild(questionDiv);
    });

    // Show the modal
    guidingModal.style.display = "block";

    // Accessibility: Set focus to the first textarea in the modal
    const firstTextarea = guidingModal.querySelector("textarea");
    if (firstTextarea) {
        firstTextarea.focus();
    }

    // Accessibility: Add event listeners for trapping focus and handling Escape key
    document.addEventListener('keydown', handleGuidingModalKeyDown);
}

/**
 * Function to close the guiding questions modal
 */
function closeGuidingModal() {
    guidingModal.style.display = "none";
    currentList = null;
    currentItem = null;

    // Accessibility: Remove event listeners when modal is closed
    document.removeEventListener('keydown', handleGuidingModalKeyDown);

    // Accessibility: Return focus to the trigger element
    if (guidingQuestionsTrigger) {
        guidingQuestionsTrigger.focus();
        guidingQuestionsTrigger = null;
    }

    // Clear the form
    guidingQuestionsForm.reset();
}

/**
 * Function to handle keydown events for guiding modal accessibility
 * @param {KeyboardEvent} e 
 */
function handleGuidingModalKeyDown(e) {
    if (e.key === 'Escape') {
        closeGuidingModal();
    } else if (e.key === 'Tab') {
        trapFocusInModal(e, guidingModal);
    }
}

/**
 * Function to open the instructions modal
 * @param {HTMLElement} trigger - The element that triggered the modal
 */
function openInstructionsModal(trigger) {
    instructionsTrigger = trigger;

    // Show the modal
    instructionsModal.style.display = "block";

    // Accessibility: Set focus to the modal content
    instructionsModalContent.setAttribute('tabindex', '-1');
    instructionsModalContent.focus();

    // Accessibility: Add event listeners for trapping focus and handling Escape key
    document.addEventListener('keydown', handleInstructionsModalKeyDown);
}

/**
 * Function to close the instructions modal
 */
function closeInstructionsModal() {
    instructionsModal.style.display = "none";

    // Accessibility: Remove event listeners when modal is closed
    document.removeEventListener('keydown', handleInstructionsModalKeyDown);

    // Accessibility: Return focus to the trigger element
    if (instructionsTrigger) {
        instructionsTrigger.focus();
        instructionsTrigger = null;
    }
}

/**
 * Function to handle keydown events for instructions modal accessibility
 * @param {KeyboardEvent} e 
 */
function handleInstructionsModalKeyDown(e) {
    if (e.key === 'Escape') {
        closeInstructionsModal();
    } else if (e.key === 'Tab') {
        trapFocusInModal(e, instructionsModal);
    }
}

/**
 * Function to trap focus within a given modal
 * @param {KeyboardEvent} e 
 * @param {HTMLElement} modalElement 
 */
function trapFocusInModal(e, modalElement) {
    const focusableElements = modalElement.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else { // Tab
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

/**
 * Function to initiate adding an item to a list
 * @param {string} listId - The ID of the list ("known-list" or "want-to-know-list")
 * @param {string} inputId - The ID of the input field
 */
function initiateAddItem(listId, inputId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();

    if (value === "") {
        alert("Please enter a valid item.");
        return;
    }

    // Check for duplicates
    const storedData = JSON.parse(localStorage.getItem(listId)) || [];
    const isDuplicate = storedData.some(item => item.text.toLowerCase() === value.toLowerCase());

    if (isDuplicate) {
        alert("This item already exists in the list.");
        return;
    }

    // Open modal to answer guiding questions, passing the trigger element for accessibility
    const addButton = document.getElementById(`add-${listId === "known-list" ? "known" : "want-to-know"}`);
    openGuidingModal(listId, value, addButton);
}

/**
 * Function to handle form submission in guiding questions modal
 */
guidingQuestionsForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!currentList || !currentItem) {
        alert("No item to save.");
        return;
    }

    // Collect answers
    const formData = new FormData(guidingQuestionsForm);
    const answers = {};
    for (let [key, value] of formData.entries()) {
        if (value.trim() === "") {
            alert("Please answer all guiding questions.");
            return;
        }
        answers[key] = value.trim();
    }

    // Generate a unique ID for the item
    const itemId = `item-${Date.now()}`;

    // Save item and answers to localStorage
    let storedData = JSON.parse(localStorage.getItem(currentList)) || [];
    storedData.push({
        id: itemId,
        text: currentItem,
        answers: answers
    });
    localStorage.setItem(currentList, JSON.stringify(storedData));

    // Add item to the DOM with answers always visible
    addItemToDOM(currentList, currentItem, answers, itemId);

    // Clear input fields
    const inputId = currentList === "known-list" ? "known-input" : "want-to-know-input";
    document.getElementById(inputId).value = "";

    // Close the modal
    closeGuidingModal();
});

/**
 * Function to add item to the DOM with answers always visible
 * @param {string} listId - The ID of the list
 * @param {string} itemText - The text of the item
 * @param {object} answers - The answers to guiding questions
 * @param {string} itemId - The unique ID of the item
 */
function addItemToDOM(listId, itemText, answers, itemId) {
    const list = document.getElementById(listId);
    const li = document.createElement("li");
    li.setAttribute("data-id", itemId);

    // Create item header
    const itemHeader = document.createElement("div");
    itemHeader.classList.add("item-header");

    const itemSpan = document.createElement("span");
    itemSpan.textContent = itemText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.setAttribute("aria-label", `Delete ${itemText}`);
    deleteBtn.onclick = function() {
        if (confirm(`Are you sure you want to delete "${itemText}"?`)) {
            list.removeChild(li);
            removeItemFromStorage(listId, itemId);
        }
    };

    // Optional: Add a toggle button to show/hide answers
    /*
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Show Answers";
    toggleBtn.classList.add("toggle-btn");
    toggleBtn.onclick = function() {
        if (answersDiv.style.display === "none" || answersDiv.style.display === "") {
            answersDiv.style.display = "block";
            toggleBtn.textContent = "Hide Answers";
        } else {
            answersDiv.style.display = "none";
            toggleBtn.textContent = "Show Answers";
        }
    };
    */

    itemHeader.appendChild(itemSpan);
    itemHeader.appendChild(deleteBtn);
    // itemHeader.appendChild(toggleBtn); // Uncomment if implementing toggle

    // Append item header to list item
    li.appendChild(itemHeader);

    // Create a div to hold the answers (always visible)
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");
    // answersDiv.style.display = "none"; // Uncomment if implementing toggle

    // Populate answers without labels
    for (let key in answers) {
        if (answers.hasOwnProperty(key)) {
            const p = document.createElement("p");
            p.textContent = answers[key]; // Removed labels
            answersDiv.appendChild(p);
        }
    }

    // Append answers div to list item
    li.appendChild(answersDiv);

    // Append the list item to the list
    list.appendChild(li);
}

/**
 * Function to remove item from localStorage
 * @param {string} listId - The ID of the list
 * @param {string} itemId - The unique ID of the item
 */
function removeItemFromStorage(listId, itemId) {
    let storedData = JSON.parse(localStorage.getItem(listId)) || [];
    storedData = storedData.filter(item => item.id !== itemId);
    localStorage.setItem(listId, JSON.stringify(storedData));
}

/**
 * Function to load items from localStorage on page load
 */
function loadItems() {
    ["known-list", "want-to-know-list"].forEach(listId => {
        const storedData = JSON.parse(localStorage.getItem(listId)) || [];
        storedData.forEach(item => {
            addItemToDOM(listId, item.text, item.answers, item.id);
        });
    });
}

/**
 * Function to handle printing of lists
 */
function handlePrint() {
    window.print();
}

/**
 * Event listeners for "Add" buttons
 */
document.getElementById("add-known").addEventListener("click", function() {
    initiateAddItem("known-list", "known-input");
});

document.getElementById("add-want-to-know").addEventListener("click", function() {
    initiateAddItem("want-to-know-list", "want-to-know-input");
});

/**
 * Event listener for "Print Lists" button
 */
printButton.addEventListener("click", handlePrint);

/**
 * Event listener for "Instructions" button
 */
instructionsButton.addEventListener("click", function() {
    openInstructionsModal(instructionsButton);
});

/**
 * Event listener for closing the guiding questions modal
 */
guidingCloseButton.addEventListener("click", closeGuidingModal);

/**
 * Event listener for closing the instructions modal
 */
instructionsCloseButton.addEventListener("click", closeInstructionsModal);

/**
 * Event listener for clicks outside the modals to close them
 */
window.addEventListener("click", function(event) {
    if (event.target === guidingModal) {
        closeGuidingModal();
    }
    if (event.target === instructionsModal) {
        closeInstructionsModal();
    }
});

/**
 * Allow pressing "Enter" key to add items
 */
document.getElementById("known-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission if inside a form
        initiateAddItem("known-list", "known-input");
    }
});

document.getElementById("want-to-know-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission if inside a form
        initiateAddItem("want-to-know-list", "want-to-know-input");
    }
});

// Initial load
window.onload = loadItems;
