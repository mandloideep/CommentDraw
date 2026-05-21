package com.CommentDraw.Backend.listener;

import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.event.ForgotPasswordEvent;
import com.CommentDraw.Backend.exception.EmailSendingFailedException;
import com.CommentDraw.Backend.exception.UserEmailNotFoundException;
import com.CommentDraw.Backend.model.MailType;
import com.CommentDraw.Backend.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
@Async
public class ForgotPasswordEventListener implements ApplicationListener<ForgotPasswordEvent> {

    private final EmailService emailService;

    @Override
    public void onApplicationEvent(ForgotPasswordEvent event) {
        User user = event.getUser();
        if (user == null) {
            throw new UserEmailNotFoundException("User not found for registration email");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new UserEmailNotFoundException("User email is missing or empty");
        }

        String subject = "CommentDraw | Reset Your Password 🔐";

        try {
            emailService.sendEmail(user.getEmail(), subject, event.getUrl(), MailType.FORGOT_PASSWORD);
        } catch (Exception e) {
            throw new EmailSendingFailedException("Failed to send password reset email to " + user.getEmail(), e);
        }
    }
}