package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.model.MailType;

public interface EmailService {
    void sendEmail(String to, String subject, String body, MailType type);
    void sendAsyncEmail(String to, String subject, String  body, MailType type);
}
