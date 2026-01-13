/* jalamos las dependencias */
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

/* usamos middlewares */
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/*
 Estructura que se usara en la "base de datos": id, title, description, status, created_at, deleted_at
 */
/* Datos iniciales de ejemplo para visualizar que funcione*/
let tasks = [
    { 
        id: 1, 
        title: "Tarea de Ejemplo", 
        description: "Esta es una tarea inicial para probar el sistema.", 
        status: "pendiente", 
        created_at: new Date(), 
        deleted_at: null 
    }
];

/*se pieden las rutas de la API RESTful
GET /tasks - Obtener todas las tareas.
POST /tasks - Crear una nueva tarea.
PUT /tasks/:id - Actualizar una tarea existente.
DELETE /tasks/:id - Eliminar una tarea */

// GET: Solo jala tareas activas
app.get('/tasks', (req, res) => {
    const activeTasks = tasks.filter(task => task.deleted_at === null);
    res.json(activeTasks);
});

// POST: Crear tarea
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    
    if (!title) return res.status(400).json({ message: 'Título requerido' });

    const newTask = {
        id: Date.now(),
        title,
        description: description || "",
        status: "pendiente",
        created_at: new Date(),
        deleted_at: null
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT: Actualizar datos o estado
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const taskIndex = tasks.findIndex(t => t.id == id);

    if (taskIndex === -1 || tasks[taskIndex].deleted_at !== null) {
        return res.status(404).json({ message: 'No encontrado' });
    }

    /* Actualizamos solo los campos proporcionados */
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title !== undefined ? title : tasks[taskIndex].title,
        description: description !== undefined ? description : tasks[taskIndex].description,
        status: status !== undefined ? status : tasks[taskIndex].status
    };

    res.json(tasks[taskIndex]);
});

// DELETE: solo marca como eliminada, para evitar perdida de datos
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id == id);

    if (taskIndex === -1) return res.status(404).json({ message: 'No encontrado' });

    tasks[taskIndex].deleted_at = new Date();
    res.status(204).send();
});

/* arrancamos el servidor */
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});