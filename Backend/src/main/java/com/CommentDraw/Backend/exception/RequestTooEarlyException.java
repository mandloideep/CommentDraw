package com.CommentDraw.Backend.exception;

public class RequestTooEarlyException extends RuntimeException {
  public RequestTooEarlyException(String message) {
    super(message);
  }
}
