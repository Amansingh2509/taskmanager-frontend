import { useState, useEffect } from "react";
import { taskAPI } from "../services/api";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskAPI.getTasks();
      setTasks(data || []);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const newTaskObj = await taskAPI.createTask({ title: newTask });
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleUpdateTask = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const updatedTask = await taskAPI.updateTask(id, { title: editTitle });
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      setEditingTask(null);
      setEditTitle("");
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTitle("");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Manager</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="task-form-container">
          <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="task-input"
            />
            <button type="submit" className="add-task-btn">
              Add Task
            </button>
          </form>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                {editingTask === task._id ? (
                  <div className="task-edit">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => handleUpdateTask(task._id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button onClick={cancelEditing} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="task-title">{task.title}</span>
                    <div className="task-actions">
                      <button
                        onClick={() => startEditing(task)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
