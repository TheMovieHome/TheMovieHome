package com.ricardocode.Syncine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;


@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
public record MovieResultDTO(
        @JsonProperty("Title") String title,
        @JsonProperty("Year") String year,
        @JsonProperty("imdbID") String imdbId,
        @JsonProperty("Plot") String plot,
        @JsonProperty("Poster") String poster
) {}