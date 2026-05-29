import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const API = "http://localhost:8085/tasks";

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          completed: false,
        }),
      });

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="container">
      <div className="header">
        <div>
          <p className="tag">FULL-STACK DEVOPS PROJECT</p>

          <h1>DevOps Task Manager</h1>

          <p className="subtitle">
            Plan work, track progress, and demo CI/CD deployment flow.
          </p>
        </div>

        <div className="status">
          ● API Online
        </div>
      </div>

      <div className="stats">
        <div className="card">
          <h2>{totalTasks}</h2>
          <p>TOTAL</p>
        </div>

        <div className="card">
          <h2>{pendingTasks}</h2>
          <p>PENDING</p>
        </div>

        <div className="card">
          <h2>{completedTasks}</h2>
          <p>COMPLETED</p>
        </div>

        <div className="card progress-card">
          <div className="progress-head">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="task-form">
        <div>
          <label>TASK TITLE</label>

          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div>
          <label>DUE DATE</label>
          <input type="date" />
        </div>

        <div>
          <label>TIME</label>
          <input type="time" />
        </div>

        <div>
          <label>PRIORITY</label>

          <select>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <button onClick={addTask}>
          Add Task
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search task title"
        />

        <div className="filter-buttons">
          <button>All</button>
          <button>Pending</button>
          <button>Completed</button>
        </div>

        <select>
          <option>Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button className="clear-btn">
          Clear Done
        </button>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <div
              className="task-card"
              key={task.id}
            >
              <div>
                <h3>{task.title}</h3>
              </div>

              <button
                onClick={() =>
                  deleteTask(task.id)
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;