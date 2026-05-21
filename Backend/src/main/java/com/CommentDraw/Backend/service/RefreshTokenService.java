package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.RefreshToken;
import com.CommentDraw.Backend.entity.User;

import java.util.Optional;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    Optional<RefreshToken> findByToken(String token);
    void verifyExpiration(RefreshToken token);
    void deleteByUser(User user);
    void deleteByUserEmail(String email);
}
