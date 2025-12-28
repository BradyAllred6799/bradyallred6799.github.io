// Our data store: an array of task objects
// Each task is { name: string, steps: string[] }
let tasks = [];

// Keep track of whether we're editing an existing task (by index) or adding a new one
let currentTaskIndex = null;

// Elements
const homePage = document.getElementById('homePage');
const addTaskBtn = document.getElementById('addTaskBtn');
const printBtn = document.getElementById('printBtn');
const taskList = document.getElementById('taskList');

const taskModal = document.getElementById('taskModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');

const taskNameInput = document.getElementById('taskName');
const stepsList = document.getElementById('stepsList');
const newStepInput = document.getElementById('newStepInput');
const addStepBtn = document.getElementById('addStepBtn');
const modalError = document.getElementById('modalError');
const saveTaskBtn = document.getElementById('saveTaskBtn');

// 1. RENDER TASK LIST ON HOME PAGE
function renderTaskList() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.name;

    // Click on a task to edit it
    li.addEventListener('click', () => {
      openModal(index);
    });

    taskList.appendChild(li);
  });
}

// 2. OPEN MODAL (ADD OR EDIT)
function openModal(index = null) {
  // Clear any error messages
  modalError.textContent = '';

  // If index is provided, we are editing
  if (index !== null) {
    currentTaskIndex = index;
    modalTitle.textContent = 'Edit Task';
    const existingTask = tasks[index];
    // Populate the modal with existing data
    taskNameInput.value = existingTask.name;
    populateSteps(existingTask.steps);
  } else {
    // Otherwise, we are adding a new task
    currentTaskIndex = null;
    modalTitle.textContent = 'Add New Task';
    taskNameInput.value = '';
    populateSteps([]); // No steps yet
  }

  // Show the modal
  taskModal.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
  taskNameInput.focus({ preventScroll: true });
}

// 3. CLOSE MODAL
function closeModal() {
  taskModal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
}

// 4. POPULATE STEPS
function populateSteps(stepsArr) {
  stepsList.innerHTML = '';
  stepsArr.forEach((step, idx) => {
    const li = createStepListItem(step, idx);
    stepsList.appendChild(li);
  });
}

// HELPER: Create a single <li> for a step
function createStepListItem(stepText, stepIndex) {
  const li = document.createElement('li');
  li.textContent = stepText;

  // Optional: You could add a small 'Delete' button next to each step
  // to let user remove that step from the list:
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.style.marginLeft = '10px';
  deleteBtn.addEventListener('click', () => {
    deleteStep(stepIndex);
  });

  li.appendChild(deleteBtn);

  return li;
}

// 5. ADD A STEP (in the modal)
function addStep() {
  const stepValue = newStepInput.value.trim();
  if (!stepValue) {
    modalError.textContent = 'Please enter a step.';
    newStepInput.focus();
    return;
  }
  modalError.textContent = '';

  // If editing an existing task, add step to that task's steps
  if (currentTaskIndex !== null) {
    tasks[currentTaskIndex].steps.push(stepValue);
    populateSteps(tasks[currentTaskIndex].steps);
  } else {
    // If adding a brand new task, we can keep steps in a temporary array
    const tempSteps = getModalSteps();
    tempSteps.push(stepValue);
    populateSteps(tempSteps);
  }

  newStepInput.value = '';
}

// Get the current steps displayed in the modal
function getModalSteps() {
  // Read each <li> from stepsList
  const allLis = stepsList.querySelectorAll('li');
  const stepTexts = [];
  allLis.forEach(li => {
    // li.textContent includes the 'X' from the delete button,
    // so let's look only at the nodeValue
    if (li.firstChild && li.firstChild.nodeType === Node.TEXT_NODE) {
      stepTexts.push(li.firstChild.nodeValue);
    }
  });
  return stepTexts;
}

// 6. DELETE A STEP (by index)
function deleteStep(stepIndex) {
  if (currentTaskIndex !== null) {
    // Editing existing
    tasks[currentTaskIndex].steps.splice(stepIndex, 1);
    populateSteps(tasks[currentTaskIndex].steps);
  } else {
    // Editing a brand-new, unsaved task
    const stepsSoFar = getModalSteps();
    stepsSoFar.splice(stepIndex, 1);
    populateSteps(stepsSoFar);
  }
}

// 7. SAVE (ADD OR UPDATE) THE TASK
function saveTask() {
  const nameValue = taskNameInput.value.trim();
  if (!nameValue) {
    modalError.textContent = 'Task name is required.';
    taskNameInput.focus();
    return;
  }

  const finalSteps = getModalSteps();

  if (currentTaskIndex === null) {
    // Creating a new task
    tasks.push({
      name: nameValue,
      steps: finalSteps
    });
  } else {
    // Updating existing task
    tasks[currentTaskIndex].name = nameValue;
    tasks[currentTaskIndex].steps = finalSteps;
  }

  closeModal();
  renderTaskList();
}

// 8. PRINT ALL TASKS
function printAllTasks() {
  if (tasks.length === 0) {
    alert('No tasks to print.');
    return;
  }

  let printContent = '<h2>All Task Breakdowns</h2>';

  tasks.forEach((task, index) => {
    printContent += `<h3>Task ${index + 1}: ${task.name}</h3>`;
    if (task.steps.length > 0) {
      printContent += '<ul>';
      task.steps.forEach((step, stepIndex) => {
        printContent += `<li>Step ${stepIndex + 1}: ${step}</li>`;
      });
      printContent += '</ul>';
    } else {
      printContent += '<p>No steps added.</p>';
    }
  });

  // Open a new window for printing
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Print All Task Breakdowns</title>');
  // You can add minimal styling
  printWindow.document.write(`
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      h2 { color: #1ba272; }
      h3 { color: #148a5c; }
      ul { list-style: disc; margin-left: 20px; }
    </style>
  `);
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContent);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

/* ------- EVENT LISTENERS ------- */
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderTaskList();

  // Add Task button -> open modal
  addTaskBtn.addEventListener('click', () => openModal());

  // Close modal (X button or overlay click)
  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Add Step button
  addStepBtn.addEventListener('click', addStep);

  // Save Task button
  saveTaskBtn.addEventListener('click', saveTask);

  // Print All Tasks
  printBtn.addEventListener('click', printAllTasks);
});
