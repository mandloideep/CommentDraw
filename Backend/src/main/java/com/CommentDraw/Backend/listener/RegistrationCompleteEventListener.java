package com.CommentDraw.Backend.listener;

import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.event.RegistrationCompleteEvent;
import com.CommentDraw.Backend.exception.UserEmailNotFoundException;
import com.CommentDraw.Backend.exception.EmailSendingFailedException;
import com.CommentDraw.Backend.model.MailType;
import com.CommentDraw.Backend.service.EmailService;
import com.CommentDraw.Backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


@Component
@Async
@AllArgsConstructor
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {

    private final UserService userService;
    private final EmailService emailService;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {
        User user = event.getUser();

        userService.saveVerificationTokenForUser(user, event.getToken());
        String url = event.getUrl() + "?token=" + event.getToken();

        try {
            emailService.sendEmail(user.getEmail(), "CommentDraw | Verify Your Email Address", url, MailType.VERIFICATION);
        } catch (Exception e) {
            throw new EmailSendingFailedException("Failed to send registration email", e);
        }
    }
}
