package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.entity.VerificationToken;

import java.util.Optional;


public interface VerificationTokenService {
    User validateAndGetUser(String token);

    Optional<VerificationToken> findVerificationTokenByUser(User user);

    Optional<VerificationToken> findTokenByOldToken(String oldToken);

    void saveToken(VerificationToken verificationToken);

    void deleteByUser(User user);
}


