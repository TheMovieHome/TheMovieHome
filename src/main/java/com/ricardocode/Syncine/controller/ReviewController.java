package com.ricardocode.Syncine.controller;

import com.ricardocode.Syncine.dto.CriarReviewDTO;
import com.ricardocode.Syncine.dto.RetornoReviewDTO;
import com.ricardocode.Syncine.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping("/api/reviews")
@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    public ResponseEntity<RetornoReviewDTO> criarReview(@RequestBody CriarReviewDTO criarReviewDTO) {
        Long userId = 1L;
        RetornoReviewDTO createdReview = reviewService.criarReview(criarReviewDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @GetMapping("/movie/{imdbId}")
    public ResponseEntity<List<RetornoReviewDTO>> getReviewsDoFilme(@PathVariable String imdbId) {
        List<RetornoReviewDTO> reviews = reviewService.getReviewPorFilme(imdbId);
        return ResponseEntity.ok(reviews);
    }
}

