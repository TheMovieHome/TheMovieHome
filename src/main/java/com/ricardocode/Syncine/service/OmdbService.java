package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.dto.RespostaProcuraOmdbDTO;
import com.ricardocode.Syncine.dto.ResultadoFilmeDTO;
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


    // esse metodo vai procurar um filme pelo nome em especifico
    public ResultadoFilmeDTO procurarFilmesPorTitulo(String titulo) {
        String url = OMDB_URL + "?apikey=" + apiKey + "&t=" + titulo;
        try {
            return restTemplate.getForObject(url, ResultadoFilmeDTO.class);
        } catch (Exception e) {
            System.err.println("Erro ao buscar filme: " + e.getMessage());
            return null;
        }
    }


    //? esse usa o parametro s de search da omdb api que é pra procura, ele vai busca o filme que foi digitado e
    //? retornar uma lista
    public RespostaProcuraOmdbDTO procurarFilmesPorTermo(String termo) {
        String url = OMDB_URL + "?apikey=" + apiKey + "&s=" + termo;

        try {
            return restTemplate.getForObject(url, RespostaProcuraOmdbDTO.class);
        }catch (Exception e) {
            System.err.println("Filme não encontrado: " + e.getMessage());
            return null;
        }
    }

}

