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

    @PostMapping()
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


    @PutMapping("/{id}")
    public ResponseEntity<RetornoReviewDTO> atualizarReview(
            @PathVariable Long id,
            @RequestBody CriarReviewDTO dto) {

        try {
            Long usuarioId = 1L;

            RetornoReviewDTO reviewAtualizada = reviewService.atualizarReview(id, dto , usuarioId);
            return ResponseEntity.ok(reviewAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReview(@PathVariable Long id) {

        Long usuarioId = 1L;

        try {
            reviewService.deletarReview(id, usuarioId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }
}

