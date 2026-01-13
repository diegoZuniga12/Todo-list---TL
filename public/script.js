/*define variables y cache*/
const API_URL = '/tasks';
let tasksCache = []; // Cache local

/* Inicialización */
document.addEventListener('DOMContentLoaded', loadTasks);

/* CARGAMOS TODAS LAS TAREAS QUE SE TENGAN Y SE MUESTRAN EN EL GRID */
async function loadTasks() {
    try {
        const res = await fetch(API_URL);
        tasksCache = await res.json();
        renderGrid(tasksCache);
    } catch (e) {
        console.error("Error cargando:", e);
    }
}

/* GUARDAMOS UNA NUEVA TAREA */
async function saveNewTask() {
    const title = document.getElementById('createTitle').value;
    const description = document.getElementById('createDesc').value;

    if (!title.trim()) return alert("El título es obligatorio");

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        
        closeModal('modalCreate');
        document.getElementById('createTitle').value = '';
        document.getElementById('createDesc').value = '';
        loadTasks();
    } catch (e) {
        alert("Error al guardar");
    }
}

/* ACTUALIZAMOS EL CONTENIDO DE UNA TAREA */
async function updateTaskContent() {
    const id = document.getElementById('currentTaskId').value;
    const title = document.getElementById('editTitleInput').value;
    const description = document.getElementById('editDescInput').value;

    if (!title.trim()) return alert("El título no puede estar vacío");

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }) 
            // Nota: No enviamos status aquí para no cambiar el estado
        });
        
        loadTasks(); // Recargar grid con datos actualizados
        disableEditMode(); // Volver a modo lectura
        closeModal('modalView'); // Cerrar modal tras éxito
    } catch (e) {
        alert("Error al actualizar");
    }
}

/* CAMBIAMOS EL ESTADO DE LA TAREA (PENDIENTE <-> COMPLETADA) */
async function toggleTaskStatus() {
    const id = document.getElementById('currentTaskId').value;
    const task = tasksCache.find(t => t.id == id);
    const newStatus = task.status === 'pendiente' ? 'completada' : 'pendiente';

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        closeModal('modalView');
        loadTasks();
    } catch (e) { console.error(e); }
}

/* ELIMINAMOS UNA TAREA (MARCARLA COMO ELIMINADA) */
async function deleteTask() {
    const id = document.getElementById('currentTaskId').value;
    if(!confirm("¿Eliminar tarea?")) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        closeModal('modalView');
        loadTasks();
    } catch (e) { console.error(e); }
}

/* Muestra las tareas en el grid principal */
function renderGrid(tasks) {
    const grid = document.getElementById('tasksGrid');
    grid.innerHTML = '';

    if (tasks.length === 0) {
        grid.innerHTML = '<p style="color:#666; grid-column:1/-1; text-align:center">No hay tareas.</p>';
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `card ${task.status === 'completada' ? 'completed' : 'pending'}`;
        card.onclick = () => openViewModal(task);
        
        card.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || 'Sin descripción'}</p>
            <div style="margin-top:10px; font-size:0.8em; color:#888;">
                ${task.status.toUpperCase()}
            </div>
        `;
        grid.appendChild(card);
    });
}

/* Abre el modal de vista con los datos de la tarea */
function openViewModal(task) {
    // 1. Reseteamos siempre al modo lectura al abrir
    disableEditMode();

    // 2. Llenar datos de Lectura
    document.getElementById('viewTitleDisplay').innerText = task.title;
    document.getElementById('viewDescDisplay').innerText = task.description;
    document.getElementById('currentTaskId').value = task.id;

    // 3. Estilizar el estado para mayor entendimiento
    const badge = document.getElementById('viewStatusBadge');
    badge.innerText = task.status.toUpperCase();
    badge.style.background = task.status === 'completada' ? '#d1e7dd' : '#fff3cd';
    badge.style.color = task.status === 'completada' ? '#0f5132' : '#664d03';

    // 4. Mostrar
    document.getElementById('modalView').style.display = 'flex';
}

/* Habilita el modo edición en el modal */
function enableEditMode() {
    // copia valores a los inputs
    document.getElementById('editTitleInput').value = document.getElementById('viewTitleDisplay').innerText;
    document.getElementById('editDescInput').value = document.getElementById('viewDescDisplay').innerText;

    // oculta el display y muestra los inputs
    document.getElementById('viewTitleDisplay').style.display = 'none';
    document.getElementById('viewDescDisplay').style.display = 'none';
    
    document.getElementById('editTitleInput').style.display = 'block';
    document.getElementById('editDescInput').style.display = 'block';

    // cambia botones
    document.getElementById('readModeButtons').style.display = 'none';
    document.getElementById('editModeButtons').style.display = 'block';
}

/* Deshabilita el modo edición en el modal */
function disableEditMode() {
    // oculta el display y muestra los inputs
    document.getElementById('viewTitleDisplay').style.display = 'block';
    document.getElementById('viewDescDisplay').style.display = 'block';
    
    document.getElementById('editTitleInput').style.display = 'none';
    document.getElementById('editDescInput').style.display = 'none';

    // cambia botones
    document.getElementById('readModeButtons').style.display = 'block';
    document.getElementById('editModeButtons').style.display = 'none';
}

/* Abre el modal de creación de nueva tarea */
function openCreateModal() {
    document.getElementById('modalCreate').style.display = 'flex';
}

/* Cierra cualquier modal abierto */
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Cierra el modal si se hace clic fuera del contenido
window.onclick = function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
}