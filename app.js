// Select DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoCategory = document.getElementById('todo-category'); // NEW: Category selector
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');

// Dashboard Elements
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statPending = document.getElementById('stat-pending');
const progressBar = document.getElementById('progress-bar');

// Initialize state from localStorage or empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update Dashboard Metrics
function updateDashboard() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    // Calculate percentage for progress bar
    const progressPercentage = total === 0 ? 0 : (completed / total) * 100;

    // Update DOM
    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = pending;
    progressBar.style.width = `${progressPercentage}%`;
}

// Render the List
function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        // NEW: Fallback to 'general' if older tasks don't have a category
        const cat = todo.category || 'general';
        
        li.innerHTML = `
            <div class="todo-text-wrapper" onclick="toggleComplete(${index})">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} style="cursor:pointer;">
                <span class="tag-pill tag-${cat}">${cat}</span>
                <span class="todo-text">${todo.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
        `;
        
        todoList.appendChild(li);
    });

    // Call the dashboard update every time the list re-renders
    updateDashboard();
}

// Add Item
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    const selectedCategory = todoCategory.value; // NEW: Grab the category
    
    if (!taskText) return;

    // NEW: Push the category into the storage object
    todos.push({ text: taskText, category: selectedCategory, completed: false });
    todoInput.value = '';
    
    saveToStorage();
    renderTodos();
});

// Toggle Completion
window.toggleComplete = (index) => {
    todos[index].completed = !todos[index].completed;
    saveToStorage();
    renderTodos();
};

// Remove Item
window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveToStorage();
    renderTodos();
};

// Theme Switching
const currentTheme = localStorage.getItem('theme') || 'dark'; // Defaulting to dark mode for the cosmic theme
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// Initial Paint
renderTodos();