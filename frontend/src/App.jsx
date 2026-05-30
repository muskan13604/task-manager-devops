import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  Edit3,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

function App() {
  const apiBaseRef = useRef("");
  const apiCandidates = useMemo(() => {
    const configuredUrl = import.meta.env.VITE_API_URL;

    return [configuredUrl, "http://localhost:8084/tasks", "http://localhost:8085/tasks"].filter(Boolean);
  }, []);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const requestTasks = async (path = "", options = {}) => {
    const orderedCandidates = apiBaseRef.current
      ? [apiBaseRef.current, ...apiCandidates.filter((candidate) => candidate !== apiBaseRef.current)]
      : apiCandidates;

    for (const baseUrl of orderedCandidates) {
      try {
        const response = await fetch(`${baseUrl}${path}`, options);

        if (!response.ok) {
          throw new Error("Backend response was not ok");
        }

        apiBaseRef.current = baseUrl;
        return response;
      } catch {
        apiBaseRef.current = "";
      }
    }

    throw new Error("Backend is unavailable");
  };

  const fetchTasks = async () => {
    try {
      setError("");
      const response = await requestTasks();
      const data = await response.json();
      setTasks(data);
    } catch {
      setError("Backend se connect nahi ho pa raha. Spring Boot server run hona chahiye.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    setSaving(true);
    setError("");

    try {
      await requestTasks("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          date,
          time,
          priority,
          completed: false,
        }),
      });

      setTitle("");
      setDate("");
      setTime("");
      setPriority("Medium");
      fetchTasks();
    } catch {
      setError("Task add nahi ho paya. Backend connection check karo.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (id) => {
    await requestTasks(`/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const toggleTask = async (task) => {
    await requestTasks(`/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        completed: !task.completed,
      }),
    });

    fetchTasks();
  };

  const updateTask = async (task) => {
    if (!editTitle.trim()) return;

    await requestTasks(`/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    setEditingId(null);
    setEditTitle("");
    fetchTasks();
  };

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      })
      .filter((task) => (task.title || "").toLowerCase().includes(search.toLowerCase()));
  }, [tasks, search, filter]);

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Full Stack DevOps Project</p>
            <h1>Task Manager</h1>
            <p className="subtitle">Plan, track, and finish daily work with a clean dashboard.</p>
          </div>

          <div className={`api-status ${error ? "offline" : "online"}`}>
            <span></span>
            {error ? "API Offline" : "API Online"}
          </div>
        </header>

        {error && (
          <div className="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <section className="summary-grid" aria-label="Task summary">
          <article className="summary-card">
            <span className="summary-label">Total</span>
            <strong>{total}</strong>
            <small>{today}</small>
          </article>

          <article className="summary-card pending-card">
            <span className="summary-label">Pending</span>
            <strong>{pending}</strong>
            <small>Open work</small>
          </article>

          <article className="summary-card done-card">
            <span className="summary-label">Completed</span>
            <strong>{completed}</strong>
            <small>Finished tasks</small>
          </article>

          <article className="summary-card progress-card">
            <div>
              <span className="summary-label">Progress</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress">
              <div className="fill" style={{ width: `${progress}%` }}></div>
            </div>
          </article>
        </section>

        <section className="task-panel">
          <div className="task-form">
            <label className="field title-field">
              <span>Task</span>
              <input
                placeholder="Add a new task"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>

            <label className="field">
              <span>Time</span>
              <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
            </label>

            <label className="field">
              <span>Priority</span>
              <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>

            <button className="primary-action" onClick={addTask} disabled={saving || !title.trim()}>
              {saving ? <Loader2 className="spin" size={18} /> : <Plus size={18} />}
              <span>Add</span>
            </button>
          </div>
        </section>

        <section className="list-tools">
          <label className="search-box">
            <Search size={18} />
            <input
              placeholder="Search tasks"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="filter-tabs" aria-label="Filter tasks">
            {["all", "pending", "completed"].map((item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="task-list">
          {loading ? (
            <div className="empty state-card">
              <Loader2 className="spin" size={24} />
              <span>Loading tasks...</span>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="empty state-card">No tasks found</div>
          ) : (
            visibleTasks.map((task) => (
              <article key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
                <button
                  className="complete-toggle"
                  onClick={() => toggleTask(task)}
                  title={task.completed ? "Mark pending" : "Mark completed"}
                >
                  {task.completed ? <Check size={18} /> : <Circle size={18} />}
                </button>

                <div className="task-content">
                  {editingId === task.id ? (
                    <input
                      className="edit-input"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                    />
                  ) : (
                    <h2>{task.title}</h2>
                  )}

                  <div className="task-meta">
                    {task.date && (
                      <span>
                        <CalendarDays size={15} />
                        {task.date}
                      </span>
                    )}
                    {task.time && (
                      <span>
                        <Clock3 size={15} />
                        {task.time}
                      </span>
                    )}
                    <span className={`priority ${task.priority || "Medium"}`}>
                      {task.priority || "Medium"}
                    </span>
                  </div>
                </div>

                <div className="actions">
                  {editingId === task.id ? (
                    <>
                      <button
                        className="icon-button save"
                        onClick={() => updateTask({ ...task, title: editTitle.trim() })}
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => {
                          setEditingId(null);
                          setEditTitle("");
                        }}
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="icon-button edit"
                      onClick={() => {
                        setEditingId(task.id);
                        setEditTitle(task.title);
                      }}
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}

                  <button className="icon-button delete" onClick={() => deleteTask(task.id)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
