# Todo list (Ejercico para desarrollador JR)

Aplicación de gestión de tareas implementada con Node.js y Express.
El proyecto sigue una arquitectura RESTful básica con persistencia en memoria y un CRUD basico para los datos.

## Características Técnicas

* **Backend:** Node.js + Express.
* **Frontend:** HTML5, CSS3 (Grid/Modales) y JavaScript.
* **Arquitectura de Datos:** Modelo basado en array en memoria (simulación de una base de datos).
    * Implementación de un borrado controlado mediante flag `deleted_at` para evitar perdida de datos.
* **UI/UX:**
    * Interfaz basada en Cards y Grid.
    * Modales para creación y visualización de detalles por tarea (CRUD).

## Instalación y Ejecución

1. Abrir terminal de CMD.
2. Clonar el repositorio: git clone https://github.com/diegoZuniga12/Todo-list---TL.git
3. Entrar a la carpeta del proyecto: cd Todo-list---TL
4. Instalar dependencias: npm install   
5. Iniciar el servidor en modo desarrollo: node server.js
6.  Acceder a `http://localhost:3000`.

## Endpoints API

| Método | Endpoint      | Descripción |
| `GET`  | `/tasks`      | Obtiene todas las tareas activas (`deleted_at IS NULL`). |
| `POST` | `/tasks`      | Crea una nueva tarea. `{ title, description }`. |
| `PUT`  | `/tasks/:id`  | Actualiza estado o contenido de la tarea. |
| `DEL`  | `/tasks/:id`  | Realiza borrado lógico de la tarea. |

*Desarrollado por Diego Shair Zúñiga Villalobos - 2026*