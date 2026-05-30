package com.muskan.analytics;

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
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final RestTemplate restTemplate;
    private final String taskServiceUrl;

    public AnalyticsController(RestTemplate restTemplate, @Value("${task.service.url}") String taskServiceUrl) {
        this.restTemplate = restTemplate;
        this.taskServiceUrl = taskServiceUrl;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        List<TaskDto> tasks = fetchTasks();
        long completed = tasks.stream().filter(TaskDto::completed).count();
        long pending = tasks.size() - completed;
        long highPriority = tasks.stream()
                .filter(task -> "High".equalsIgnoreCase(task.priority()))
                .count();
        int progress = tasks.isEmpty() ? 0 : Math.round((completed * 100.0f) / tasks.size());

        return Map.of(
                "total", tasks.size(),
                "completed", completed,
                "pending", pending,
                "highPriority", highPriority,
                "progress", progress
        );
    }

    @GetMapping("/health")
    public String health() {
        return "Analytics Service Running";
    }

    private List<TaskDto> fetchTasks() {
        TaskDto[] tasks = restTemplate.getForObject(taskServiceUrl, TaskDto[].class);
        return tasks == null ? List.of() : Arrays.asList(tasks);
    }
}
