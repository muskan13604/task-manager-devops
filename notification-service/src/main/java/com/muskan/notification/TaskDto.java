package com.muskan.notification;

public record TaskDto(
        Long id,
        String title,
        String date,
        String time,
        String priority,
        boolean completed
) {
}
