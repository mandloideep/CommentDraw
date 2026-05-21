package com.CommentDraw.Backend.exception;

public class JWTTokenNotFoundOrInvalidException extends RuntimeException {
    public JWTTokenNotFoundOrInvalidException(String message) {
        super(message);
    }
}
