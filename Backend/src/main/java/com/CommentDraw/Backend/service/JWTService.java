package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

public interface JWTService {
    String generateToken(User user);
    String extractUserEmail(String token);
    Claims extractAllClaims(String token);
    boolean isTokenValid(String token, UserDetails userDetails);
}
