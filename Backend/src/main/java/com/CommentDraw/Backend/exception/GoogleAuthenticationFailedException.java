package com.CommentDraw.Backend.exception;

public class GoogleAuthenticationFailedException extends RuntimeException {
    public GoogleAuthenticationFailedException(String message) {
        super(message);
    }
}
