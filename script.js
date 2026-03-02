const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const currentDateEl = document.getElementById("currentDate");

const today = new Date().toLocaleDateString("pt-BR");
currentDateEl.innerText = `Hoje: ${today}`;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let lastAccessDate = localStorage.getItem("lastAccessDate");

// 🔁 Verifica mudança de dia
if (lastAccessDate !== today) {
    tasks.forEach(task => {
        if (!task.completed) {
            task.overdue = true; // vira prioridade
        }
        task.completed = false; // reseta para novo dia
    });

    localStorage.setItem("lastAccessDate", today);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false,
        overdue: false
    });

    saveAndRender();
    taskInput.value = "";
}

function renderTasks() {
    taskList.innerHTML = "";

    // 🔥 Prioridade: overdue primeiro
    tasks.sort((a, b) => b.overdue - a.overdue);

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) li.classList.add("completed");
        if (task.overdue) li.classList.add("overdue");

        li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} 
        onclick="toggleTask(${task.id})">
      <span>${task.text}</span>
      <div class="actions">
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
            if (task.completed) task.overdue = false;
        }
        return task;
    });

    saveAndRender();
}

function editTask(id) {
    const newText = prompt("Editar tarefa:");
    if (!newText) return;

    tasks = tasks.map(task => {
        if (task.id === id) {
            task.text = newText;
        }
        return task;
    });

    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}
