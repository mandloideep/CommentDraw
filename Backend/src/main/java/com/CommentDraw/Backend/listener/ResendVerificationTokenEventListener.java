package com.CommentDraw.Backend.listener;

import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.event.ResendVerificationTokenEvent;
import com.CommentDraw.Backend.exception.EmailSendingFailedException;
import com.CommentDraw.Backend.exception.UserEmailNotFoundException;
import com.CommentDraw.Backend.model.MailType;
import com.CommentDraw.Backend.repository.VerificationTokenRepository;
import com.CommentDraw.Backend.service.EmailService;
import com.CommentDraw.Backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Async
@AllArgsConstructor
public class ResendVerificationTokenEventListener implements ApplicationListener<ResendVerificationTokenEvent> {
    private final UserService userService;
    private final EmailService emailService;

    @Override
    public void onApplicationEvent(ResendVerificationTokenEvent event) {
        User user = event.getUser();
        if (user == null) {
            throw new UserEmailNotFoundException("User not found for token resend");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new UserEmailNotFoundException("User email is missing or empty");
        }

        userService.saveVerificationTokenForUser(user, event.getToken());

        String url = event.getUrl() + "?token=" + event.getToken();

        try {
            emailService.sendEmail(user.getEmail(), "CommentDraw | New Verification Link", url, MailType.RESEND_VERIFICATION);
        } catch (Exception e) {
            throw new EmailSendingFailedException("Failed to send verification email", e);
        }
    }
}
