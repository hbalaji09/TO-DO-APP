const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const prioritySelect = document.getElementById("prioritySelect");
const filterBtns = document.querySelectorAll(".filters button");
const counter = document.getElementById("counter");
const clearAllBtn = document.getElementById("clearAllBtn");

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => e.key === "Enter" && addTask());
taskList.addEventListener("click", handleTaskClick);
clearAllBtn.addEventListener("click", clearAllTasks);
filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelector(".filters button.active")?.classList.remove("active");
    btn.classList.add("active");
    filterTasks(btn.dataset.filter);
  })
);

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (text === "") return;

  const li = createTaskElement({ text, completed: false, priority });
  taskList.appendChild(li);
  saveTasks();
  taskInput.value = "";
  taskInput.focus();
  updateCounter();
}

function createTaskElement(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  const badge =
    task.priority !== "normal"
      ? `<span class="priority-badge priority-${task.priority}">${task.priority}</span>`
      : "";

  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    ${badge}
    <div class="btn-group">
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">✕</button>
    </div>
  `;
  return li;
}

function handleTaskClick(e) {
  const li = e.target.closest("li");
  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Delete this task?")) {
      li.remove();
      saveTasks();
      updateCounter();
    }
  } else if (e.target.classList.contains("edit-btn")) {
    editTask(li);
  } else if (e.target.classList.contains("task-text")) {
    li.classList.toggle("completed");
    saveTasks();
    updateCounter();
  }
}

function editTask(li) {
  const span = li.querySelector(".task-text");
  const originalText = span.innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.className = "edit-input";
  input.onkeydown = e => {
    if (e.key === "Enter") {
      span.innerText = input.value.trim();
      input.replaceWith(span);
      saveTasks();
    }
  };
  span.replaceWith(input);
  input.focus();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text")?.innerText || "",
      completed: li.classList.contains("completed"),
      priority:
        li.querySelector(".priority-badge")?.innerText.toLowerCase() || "normal"
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach(task => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
  updateCounter();
}

function filterTasks(type) {
  const items = taskList.querySelectorAll("li");
  items.forEach(li => {
    switch (type) {
      case "all":
        li.style.display = "";
        break;
      case "active":
        li.style.display = li.classList.contains("completed") ? "none" : "";
        break;
      case "completed":
        li.style.display = li.classList.contains("completed") ? "" : "none";
        break;
    }
  });
}

function updateCounter() {
  const total = taskList.children.length;
  const completed = taskList.querySelectorAll("li.completed").length;
  counter.innerText = `${completed} / ${total} completed`;
}

function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
    updateCounter();
  }
}
