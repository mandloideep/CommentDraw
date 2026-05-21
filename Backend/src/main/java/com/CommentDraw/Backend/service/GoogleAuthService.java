package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.RefreshToken;
import com.CommentDraw.Backend.model.TokenResponse;
import org.springframework.http.ResponseCookie;

import java.util.Map;

public interface GoogleAuthService {
    RefreshToken processUser(String code);

    ResponseCookie authenticateGoogleUser(String code);
}
