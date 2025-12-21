// Obtener elementos del DOM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Array de tareas (lee localStorage o crea uno vacío)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Función para guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Función para mostrar todas las tareas
function renderTasks() {
    taskList.innerHTML = ""; // Limpiar lista antes de dibujar
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        // Si la tarea está completada, agregar clase
        if (task.completed) {
            li.classList.add("completed");
        }

        // Click en la tarea para marcar/desmarcar completada
        li.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que marque como completada
            if (confirm("¿Seguro que quieres eliminar esta tarea?")) {
                tasks.splice(index, 1); // Eliminar del array
                saveTasks();           // Guardar cambios
                renderTasks();         // Volver a dibujar
            }
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Agregar tarea nueva
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    tasks.push({ text: taskText, completed: false }); // Agregar al array
    saveTasks();   // Guardar en localStorage
    renderTasks(); // Dibujar lista actualizada
    taskInput.value = ""; // Limpiar input
});

// Cargar tareas al iniciar la página
renderTasks();
