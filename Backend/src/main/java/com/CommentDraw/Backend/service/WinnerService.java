package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.model.WinnerRequest;
import com.CommentDraw.Backend.model.WinnerResponse;

public interface WinnerService {
    WinnerResponse findWinner(WinnerRequest request, String email);
}
