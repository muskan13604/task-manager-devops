package com.muskan.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final RestTemplate restTemplate;
    private final String taskServiceUrl;

    public NotificationController(RestTemplate restTemplate, @Value("${task.service.url}") String taskServiceUrl) {
        this.restTemplate = restTemplate;
        this.taskServiceUrl = taskServiceUrl;
    }

    @GetMapping("/reminders")
    public Map<String, Object> reminders() {
        List<TaskDto> pendingTasks = fetchTasks().stream()
                .filter(task -> !task.completed())
                .toList();

        List<String> messages = pendingTasks.stream()
                .map(task -> {
                    String priority = task.priority() == null ? "Medium" : task.priority();
                    return "Reminder: " + task.title() + " is still pending (" + priority + " priority).";
                })
                .toList();

        return Map.of(
                "pendingCount", pendingTasks.size(),
                "messages", messages
        );
    }

    @GetMapping("/health")
    public String health() {
        return "Notification Service Running";
    }

    private List<TaskDto> fetchTasks() {
        TaskDto[] tasks = restTemplate.getForObject(taskServiceUrl, TaskDto[].class);
        return tasks == null ? List.of() : Arrays.asList(tasks);
    }
}
