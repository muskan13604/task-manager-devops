package com.muskan.taskmanager;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        return repository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask
    ) {

        Task task = repository.findById(id)
                .orElseThrow();

        task.setTitle(updatedTask.getTitle());
        task.setDate(updatedTask.getDate());
        task.setTime(updatedTask.getTime());
        task.setPriority(updatedTask.getPriority());
        task.setCompleted(updatedTask.isCompleted());

        return repository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
