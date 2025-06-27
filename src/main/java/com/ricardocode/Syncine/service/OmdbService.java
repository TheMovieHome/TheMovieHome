package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.dto.MovieResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OmdbService {


    private final RestTemplate restTemplate;
    private final String apiKey;

    public OmdbService(RestTemplate restTemplate, @Value("${omdb.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    private final String OMDB_URL = "https://www.omdbapi.com/";


    public MovieResultDTO searchMovieByTitle(String title) {
        String url = OMDB_URL + "?apikey=" + apiKey + "&t=" + title;
        try {
            return restTemplate.getForObject(url, MovieResultDTO.class);
        } catch (Exception e) {
            System.err.println("Erro ao buscar filme: " + e.getMessage());
            return null;
        }
    }
}

