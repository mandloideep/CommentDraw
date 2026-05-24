package com.CommentDraw.Backend.housekeeping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// Aiven's free MySQL tier auto-shuts down on extended inactivity. A daily SELECT 1
// keeps the service warm so the next real request doesn't pay the cold-start cost.
// Cheap to run; safe to delete if/when the DB moves off the free tier.
@Component
@RequiredArgsConstructor
@Slf4j
public class AivenKeepAlive {

    private final JdbcTemplate jdbcTemplate;

    @Scheduled(cron = "0 0 9 * * *", zone = "UTC")
    public void ping() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        log.info("Aiven keep-alive ping ok: {}", result);
    }
}
