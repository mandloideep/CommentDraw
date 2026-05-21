package com.CommentDraw.Backend.exception;

public class VideosFromDifferentChannelsException extends RuntimeException {
    public VideosFromDifferentChannelsException(String message) {
        super(message);
    }
}
