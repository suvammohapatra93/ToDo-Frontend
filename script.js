// Select DOM elements
const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const themeToggleBtn = document.getElementById('theme-toggle');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-tasks');
const loginBtn = document.getElementById('login-btn');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const authForm = document.getElementById('auth-form');

// Load tasks and theme from localStorage
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

// Function to create a new task item
function createTaskItem(taskText, category, dueDate, completed = false) {
    const li = document.createElement('li');
    li.innerText = `${taskText} [${category}] ${dueDate}`;
    li.dataset.category = category;

    // Create buttons for delete and edit
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.className = 'task-btn';
    deleteBtn.onclick = () => {
        li.remove();
        saveToLocalStorage();
    };

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.className = 'task-btn edit-btn';
    editBtn.onclick = () => {
        const newText = prompt('Edit task:', li.firstChild.textContent);
        if (newText) {
            li.firstChild.textContent = newText;
            saveToLocalStorage();
        }
    };

    li.onclick = () => {
        li.classList.toggle('completed');
        saveToLocalStorage();
    };

    if (completed) li.classList.add('completed');

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    return li;
}

// Add new task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const category = document.getElementById('task-category').value;
    const dueDate = document.getElementById('due-date').value;

    if (taskText !== '' && category !== '' && dueDate !== '') {
        const newTask = createTaskItem(taskText, category, dueDate);
        taskList.appendChild(newTask);
        saveToLocalStorage();
        taskInput.value = '';
        document.getElementById('task-category').value = '';
        document.getElementById('due-date').value = '';
    }
});

// Save to localStorage
function saveToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(task => {
        tasks.push({
            text: task.firstChild.textContent,
            completed: task.classList.contains('completed'),
            category: task.dataset.category
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks and theme from localStorage
function loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => {
            const newTask = createTaskItem(task.text, task.category, '', task.completed);
            taskList.appendChild(newTask);
        });
    }

    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', theme === 'dark');
}

// Toggle theme
themeToggleBtn.addEventListener('click', () => {
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        taskList.querySelectorAll('li').forEach(task => {
            switch (filter) {
                case 'all':
                    task.style.display = '';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? '' : 'none';
                    break;
                case 'pending':
                    task.style.display = !task.classList.contains('completed') ? '' : 'none';
                    break;
            }
        });
    });
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', () => {
    taskList.querySelectorAll('li.completed').forEach(task => task.remove());
    saveToLocalStorage();
});

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
    taskList.innerHTML = '';
    saveToLocalStorage();
});

// Login/Signup Modal
loginBtn.onclick = function () {
    modal.style.display = "block";
}

closeModal.onclick = function () {
    modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Form submission (no action)
authForm.onsubmit = function (event) {
    event.preventDefault();
    alert('Form submitted! (This is a placeholder action)');
}
