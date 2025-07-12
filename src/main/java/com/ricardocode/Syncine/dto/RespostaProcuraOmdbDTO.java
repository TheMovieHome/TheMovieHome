package com.ricardocode.Syncine.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

//? esse dto retorna a quantidade total de resultados e a lista de filmes a depender do que o usuario digitar
//? ex : digitou batman ele irá retornar uma lista de filmes com esse nome e o total de resultado

@JsonIgnoreProperties(ignoreUnknown = true)
public record RespostaProcuraOmdbDTO(
        @JsonProperty("Search") List<ItemPesquisaFilmeDTO> procura,
        @JsonProperty("totalResults") String totalResultado,
        @JsonProperty("Response") String resposta
){}
