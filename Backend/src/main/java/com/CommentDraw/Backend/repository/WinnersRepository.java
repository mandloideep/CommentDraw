package com.CommentDraw.Backend.repository;

import com.CommentDraw.Backend.entity.Winners;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WinnersRepository extends JpaRepository<Winners, Long> {
}
