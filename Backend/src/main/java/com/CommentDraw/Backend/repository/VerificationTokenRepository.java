package com.CommentDraw.Backend.repository;

import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUser(User user);

    void deleteByUser(User user);
}

