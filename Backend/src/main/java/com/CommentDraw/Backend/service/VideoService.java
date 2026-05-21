package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.model.Comment;
import com.CommentDraw.Backend.model.SubscriptionTypes;
import com.CommentDraw.Backend.model.VideoMetadata;
import java.util.List;

public interface VideoService {
    List<Comment> fetchComments(List<String> videoIds, String keyword, SubscriptionTypes plan);
    List<Comment> parseCommentsFromJson(String json, String videoId, String keyword);
    String extractNextPageToken(String json);
    List<Comment> selectWinner(List<Comment> fetchedComments, int numberOfWinners);
    String extractVideoId(String url);
    VideoMetadata getVideoMetadata(List<String> videoIds);
}