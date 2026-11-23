
import { useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Design landing page",
    description: "Create a modern landing page for the website.",
    label: "Design",
    status: "todo",
  },
  {
    id: 2,
    title: "Fix login authentication",
    description: "Resolve the JWT authentication issue.",
    label: "Bug",
    status: "todo",
  },
  {
    id: 3,
    title: "Build dashboard UI",
    description: "Create dashboard components using React.",
    label: "Feature",
    status: "progress",
  },
  {
    id: 4,
    title: "Implement dark mode",
    description: "Add dark and light theme support.",
    label: "Improvement",
    status: "progress",
  },
  {
    id: 5,
    title: "Setup project repository",
    description: "Initialize Git and push the project.",
    label: "Feature",
    status: "done",
  },
];

const columns = [
  { id: "todo", title: "To Do", icon: "○" },
  { id: "progress", title: "In Progress", icon: "◷" },
  { id: "done", title: "Done", icon: "✓" },
];

const labelColors = {
  Design: "purple",
  Bug: "red",
  Feature: "blue",
  Improvement: "green",
  Urgent: "orange",
};

const emptyForm = {
  title: "",
  description: "",
  label: "Feature",
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [darkMode, setDarkMode] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const [newTask, setNewTask] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);

  // Drag and Drop
  const handleDragStart = (e, taskId) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(taskId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();

    const taskId = Number(
      e.dataTransfer.getData("text/plain")
    );

    if (!taskId) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: columnId }
          : task
      )
    );

    setDraggedTask(null);
  };

  // Add Task
  const handleAddTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      status: "todo",
    };

    setTasks((prev) => [...prev, task]);
    setNewTask(emptyForm);
  };

  // Open Edit Form
  const handleEditClick = (task) => {
    setEditingTask({
      ...task,
    });
  };

  // Save Edited Task
  const handleSaveEdit = (e) => {
    e.preventDefault();

    if (!editingTask.title.trim()) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: editingTask.title.trim(),
              description: editingTask.description.trim(),
              label: editingTask.label,
            }
          : task
      )
    );

    setEditingTask(null);
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    );

    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">▦</span>
          <h2>TaskFlow</h2>
        </div>

        <button
          className="theme-btn"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀ Light Mode" : "☾ Dark Mode"}
        </button>
      </header>

      <main className="main-content">
        <section className="board-heading">
          <div>
            <p className="eyebrow">WORKSPACE / PROJECTS</p>
            <h1>My Kanban Board</h1>
            <p className="subtitle">
              Organize your work and track your progress.
            </p>
          </div>

          <div className="task-total">
            <span>{tasks.length}</span>
            <p>Total Tasks</p>
          </div>
        </section>

        {/* Add Task Form */}
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Enter task title..."
            value={newTask.title}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                title: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                description: e.target.value,
              })
            }
          />

          <select
            value={newTask.label}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                label: e.target.value,
              })
            }
          >
            {Object.keys(labelColors).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>

          <button type="submit" className="add-btn">
            + Add Task
          </button>
        </form>

        {/* Edit Task Form */}
        {editingTask && (
          <div className="edit-overlay">
            <form
              className="edit-modal"
              onSubmit={handleSaveEdit}
            >
              <div className="edit-modal-header">
                <h2>Edit Task</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={handleCancelEdit}
                >
                  ×
                </button>
              </div>

              <label>Task Title</label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    title: e.target.value,
                  })
                }
                required
                autoFocus
              />

              <label>Description</label>
              <textarea
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
                placeholder="Enter task description..."
              />

              <label>Task Label</label>
              <select
                value={editingTask.label}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    label: e.target.value,
                  })
                }
              >
                {Object.keys(labelColors).map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="edit-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Kanban Board */}
        <section className="board">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id
            );

            return (
              <div
                className="column"
                key={column.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="column-header">
                  <div className="column-title">
                    <span className={`column-icon ${column.id}`}>
                      {column.icon}
                    </span>
                    <h3>{column.title}</h3>
                    <span className="count">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="task-list">
                  {columnTasks.map((task) => (
                    <article
                      className={`task-card ${
                        draggedTask === task.id ? "dragging" : ""
                      }`}
                      key={task.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, task.id)
                      }
                      onDragEnd={() => setDraggedTask(null)}
                    >
                      <div className="card-top">
                        <span
                          className={`task-label ${
                            labelColors[task.label]
                          }`}
                        >
                          {task.label}
                        </span>

                        <div className="card-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditClick(task)}
                            type="button"
                            title="Edit task"
                            aria-label={`Edit ${task.title}`}
                          >
                            ✎
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteTask(task.id)
                            }
                            type="button"
                            title="Delete task"
                            aria-label={`Delete ${task.title}`}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <h4>{task.title}</h4>

                      {task.description && (
                        <p className="task-description">
                          {task.description}
                        </p>
                      )}

                      <div className="card-footer">
                        <span>☰ Task #{task.id}</span>
                        <span className="drag-hint">⠿</span>
                      </div>
                    </article>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="empty-state">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default App;
