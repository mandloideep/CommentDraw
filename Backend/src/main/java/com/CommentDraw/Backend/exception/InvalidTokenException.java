package com.CommentDraw.Backend.exception;

public class InvalidTokenException extends RuntimeException{
     public InvalidTokenException(String message){
         super(message);
     }
}
