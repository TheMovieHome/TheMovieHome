package com.ricardocode.Syncine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;


@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
public record ResultadoFilmeDTO(
        @JsonProperty("Title") String titulo,
        @JsonProperty("Year") String ano,
        @JsonProperty("imdbID") String imdbId,
        @JsonProperty("Plot") String plot,
        @JsonProperty("Poster") String poster
) {}