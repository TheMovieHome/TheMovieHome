package com.ricardocode.Syncine.controller;


import com.ricardocode.Syncine.dto.MovieResultDTO;
import com.ricardocode.Syncine.service.OmdbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final OmdbService omdbService;

    
    public MovieController(OmdbService omdbService) {
        this.omdbService = omdbService;
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<MovieResultDTO> searchMovie(@PathVariable String title) {
        MovieResultDTO movie = omdbService.searchMovieByTitle(title);

        if (movie != null && movie.imdbId() != null) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}