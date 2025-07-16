package com.ricardocode.Syncine.dto;

//? o cliente (front) envia essa informação para o back saber qual filme ele deve colocar dentro da watchlist
public record RequisicaoListaDeDesejoDTO(
        String imdbId
) {}
