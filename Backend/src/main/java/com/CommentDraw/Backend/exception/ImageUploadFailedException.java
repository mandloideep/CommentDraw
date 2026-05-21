package com.CommentDraw.Backend.exception;

public class ImageUploadFailedException extends RuntimeException{
   public ImageUploadFailedException(String msg){
       super(msg);
   }
}
