package com.ricardocode.Syncine.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;


// ? esse dto retorna todos as informaçoes do filme que o usuario digitar para buscar,
// ? cada um vai ser adicionado em uma lista


@JsonIgnoreProperties(ignoreUnknown = true)
public record ItemPesquisaFilmeDTO(
        @JsonProperty("Title") String titulo,
        @JsonProperty("Year") String ano,
        @JsonProperty("imdbID") String imdbId,
        @JsonProperty("Type") String tipo,
        @JsonProperty("Poster") String poster
) {}
