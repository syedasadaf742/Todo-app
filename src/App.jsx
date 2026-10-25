import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const handleAddTask = () => {
    if (task.trim() === "") return;
    setTodos([...todos, { text: task, completed: false }]);
    setTask("");
  };

  const toggleComplete = (index) => {
    setTodos(
      todos.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const deleteTask = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  const saveEdit = (index) => {
    setTodos(todos.map((t, i) => (i === index ? { ...t, text: editText } : t)));
    setEditIndex(null);
  };

  const filteredTodos = todos
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      className={`app ${darkMode ? "dark" : ""} ${sidebarOpen ? "" : "sidebar-closed"}`}
    >
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>My tasks</span>
        </div>

        <button
          className="add-btn-sidebar"
          onClick={() => document.getElementById("taskInput").focus()}
        >
          + New task
        </button>

        <nav>
          <p
            className={filter === "all" ? "active-link" : ""}
            onClick={() => setFilter("all")}
          >
            All tasks
          </p>
          <p
            className={filter === "active" ? "active-link" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </p>
          <p
            className={filter === "completed" ? "active-link" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </p>
        </nav>

        <div className="darkmode-toggle">
          <span>Dark mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <span className="date-pill">📅 {today}</span>
        </div>

        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="add-row">
          <input
            id="taskInput"
            type="text"
            placeholder="Enter a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        <h3>
          {filter === "all"
            ? "All"
            : filter === "active"
              ? "Active"
              : "Completed"}{" "}
          tasks ({filteredTodos.length})
        </h3>

        <div className="task-list">
          {filteredTodos.length === 0 && (
            <p className="empty">No tasks here.</p>
          )}

          {filteredTodos.map((todo, index) => (
            <div
              className={`task-row ${todo.completed ? "row-done" : "row-pending"}`}
              key={index}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(index)}
              />

              {editIndex === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(index)}
                  className="edit-input"
                />
              ) : (
                <span
                  className={
                    todo.completed ? "task-text done-text" : "task-text"
                  }
                >
                  {todo.text}
                </span>
              )}

              <span
                className={`badge ${todo.completed ? "badge-done" : "badge-pending"}`}
              >
                {todo.completed ? "Done" : "Pending"}
              </span>

              {editIndex === index ? (
                <button className="icon-btn" onClick={() => saveEdit(index)}>
                  💾
                </button>
              ) : (
                <button className="icon-btn" onClick={() => startEdit(index)}>
                  ✏️
                </button>
              )}
              <button
                className="icon-btn delete-btn"
                onClick={() => deleteTask(index)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <p className="counter">
          {todos.filter((t) => !t.completed).length} tasks left
        </p>
      </main>
    </div>
  );
}

export default App;

