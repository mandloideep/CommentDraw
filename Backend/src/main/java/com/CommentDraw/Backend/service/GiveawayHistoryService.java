package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.GiveawayHistory;
import com.CommentDraw.Backend.model.GiveawayHistoryDTO;

import java.util.List;

public interface GiveawayHistoryService {
    void saveHistory(GiveawayHistory giveawayHistory);

    GiveawayHistoryDTO[] history(long userId);

    void deleteHistory(long userId);
}
