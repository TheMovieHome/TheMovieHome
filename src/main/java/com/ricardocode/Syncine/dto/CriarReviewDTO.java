package com.ricardocode.Syncine.dto;

//! o front vai emviar esses dados pro back dizendo o seguinte Para criar uma resenha,
//! eu preciso que você me informe o imdbId do filme, a classificacao (nota) e o comentario (texto)

// ? esse dto o front envia pra o back os dados que ele quer buscar na api para criar os comentarios
public record CriarReviewDTO(
   String imdbId,
   int classificacao,
   String comentario
) {}
