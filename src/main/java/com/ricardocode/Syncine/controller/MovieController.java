package com.ricardocode.Syncine.controller;


import com.ricardocode.Syncine.dto.RespostaProcuraOmdbDTO;
import com.ricardocode.Syncine.dto.ResultadoFilmeDTO;
import com.ricardocode.Syncine.service.OmdbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/movies")
public class MovieController {
    private final OmdbService omdbService;

    
    public MovieController(OmdbService omdbService) {
        this.omdbService = omdbService;
    }

    @GetMapping("/busca/{title}")
    public ResponseEntity<ResultadoFilmeDTO> searchMovie(@PathVariable String title) {
        ResultadoFilmeDTO movie = omdbService.procurarFilmesPorTitulo(title);

        if (movie != null && movie.imdbId() != null) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/busca")
    public ResponseEntity<RespostaProcuraOmdbDTO> searchMoviesByTerm(@RequestParam("termo") String searchTerm) {
        RespostaProcuraOmdbDTO response = omdbService.procurarFilmesPorTermo(searchTerm);

        if (response != null && "True".equalsIgnoreCase(response.resposta())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

