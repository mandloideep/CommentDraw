package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.PasswordToken;
import com.CommentDraw.Backend.entity.User;

import java.util.Optional;

public interface PasswordService {
    Optional<PasswordToken> findToken(String token);

    void deletePasswordToken(String token);

    void savePasswordToken(PasswordToken passwordToken);

    void deletePasswordToken(PasswordToken passwordToken);

    Optional<PasswordToken> findTokenByUser(User user);
}


