package com.ricardocode.Syncine.dto;

//! o backend vai retornar para o front o que o usuario vai ver, ou seja a visão publica dele
//! É o "cartão de resumo" que o backend vai devolver para o frontend depois que uma resenha for criada
//! ou quando alguém pedir para ver as resenhas.

//? esse dto vai retornas as informação de tal review, dizendo a classificação, a review e quem a fez
public record RetornoReviewDTO(
        Long id,
        String imdbID,
        int classificacao,
        String comentario,
        String username //! retorna o objeto username pra não retornar o objeto usuario inteiro que é ruim pra segurança

) {}