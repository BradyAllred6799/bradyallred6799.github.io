document.addEventListener('DOMContentLoaded', function() {
    let draggedTask = null;

    // Function to add a new task to the specified quadrant
    window.addTask = function(quadrantId) {
        const list = document.getElementById(`list-${quadrantId}`);
        const newTask = document.createElement('li'); // Create a new list item
        newTask.classList.add('task-item');
        newTask.draggable = true; // Make the task draggable
        newTask.ondragstart = dragStart;
        newTask.ondragend = dragEnd;

        // Create input field for the task name
        const input = document.createElement('input');
        input.type = 'text';
        input.value = 'New Task';
        input.classList.add('task-input');
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                saveTask(newTask, input.value);
            }
        });

        // Create save button with icon and label
        const saveButton = document.createElement('button');
        saveButton.classList.add('icon-btn');
        saveButton.innerHTML = '<i class="fas fa-save"></i> <span>Save</span>';
        saveButton.onclick = function() {
            saveTask(newTask, input.value);
        };

        newTask.appendChild(input); // Add input field to the new task
        newTask.appendChild(saveButton); // Add save button

        list.appendChild(newTask); // Append the new task to the list
    };

    // Function to save a task
    function saveTask(taskItem, taskText) {
        taskItem.innerHTML = ''; // Clear the task item

        const taskContent = document.createElement('span');
        taskContent.textContent = taskText;
        taskContent.classList.add('task-text');

        // Create edit, complete, and delete buttons with smaller icons and labels
        const editButton = document.createElement('button');
        editButton.classList.add('small-icon-btn');
        editButton.innerHTML = '<i class="fas fa-edit"></i> <span class="icon-label">Edit</span>';
        editButton.onclick = function() {
            editTask(taskItem, taskText);
        };

        const completeButton = document.createElement('button');
        completeButton.classList.add('small-icon-btn');
        completeButton.innerHTML = '<i class="fas fa-check"></i> <span class="icon-label">Complete</span>';
        completeButton.onclick = function() {
            moveTaskToCompleted(taskItem);
        };

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('small-icon-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> <span class="icon-label">Delete</span>';
        deleteButton.onclick = function() {
            taskItem.remove(); // Remove the task on delete
        };

        // Create a div to stack icons vertically
        const iconStack = document.createElement('div');
        iconStack.classList.add('icon-stack');
        iconStack.appendChild(editButton);
        iconStack.appendChild(completeButton);
        iconStack.appendChild(deleteButton);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(iconStack);

        taskItem.draggable = true; // Make the task draggable again
        taskItem.ondragstart = dragStart;
        taskItem.ondragend = dragEnd;
    }

    // Function to move a task to the completed tasks section
    function moveTaskToCompleted(taskItem) {
        const completedTasksList = document.getElementById('list-completed');
        
        // Disable dragging
        taskItem.draggable = false;
        taskItem.ondragstart = null;
        taskItem.ondragend = null;

        const taskContent = taskItem.querySelector('.task-text') ? taskItem.querySelector('.task-text').textContent : taskItem.textContent;

        taskItem.innerHTML = '';
        const textNode = document.createElement('span');
        textNode.classList.add('task-text');
        textNode.textContent = taskContent;
        taskItem.appendChild(textNode);

        taskItem.classList.add('completed-task');
        completedTasksList.appendChild(taskItem);
    }

    // Function to edit a task
    function editTask(taskItem, taskText) {
        taskItem.innerHTML = ''; // Clear the task item

        const input = document.createElement('input');
        input.type = 'text';
        input.value = taskText;
        input.classList.add('task-input');
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                saveTask(taskItem, input.value);
            }
        });

        const saveButton = document.createElement('button');
        saveButton.classList.add('icon-btn');
        saveButton.innerHTML = '<i class="fas fa-save"></i> <span>Save</span>';
        saveButton.onclick = function() {
            saveTask(taskItem, input.value);
        };

        taskItem.appendChild(input);
        taskItem.appendChild(saveButton);
    }

    // Drag and drop functions
    function dragStart(event) {
        draggedTask = event.target;
        setTimeout(function() {
            draggedTask.style.display = 'none';
        }, 0);
    }

    function dragEnd(event) {
        setTimeout(function() {
            draggedTask.style.display = 'block';
            draggedTask = null;
        }, 0);
    }

    window.allowDrop = function(event) {
        event.preventDefault();
    };

    window.drop = function(event, quadrantId) {
        event.preventDefault();
        const list = document.getElementById(`list-${quadrantId}`);
        list.appendChild(draggedTask);
    };

    // Function to toggle visibility of the completed tasks
    window.toggleCompletedTasks = function() {
        const completedSection = document.getElementById('completed-tasks');
        const toggleButton = document.querySelector('.toggle-completed');

        if (completedSection.style.display === 'block') {
            completedSection.style.display = 'none';
            toggleButton.textContent = 'Show Completed Tasks';
        } else {
            completedSection.style.display = 'block';
            toggleButton.textContent = 'Hide Completed Tasks';
        }
    };

    // Function to print the Eisenhower matrix
    window.printMatrix = function() {
        window.print();
    };

    // Function to toggle full screen
    window.toggleFullscreen = function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };
});
