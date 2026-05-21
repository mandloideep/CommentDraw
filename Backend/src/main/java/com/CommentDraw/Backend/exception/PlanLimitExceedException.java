package com.CommentDraw.Backend.exception;

public class PlanLimitExceedException extends RuntimeException {
    public PlanLimitExceedException(String message) {
        super(message);
    }
}
