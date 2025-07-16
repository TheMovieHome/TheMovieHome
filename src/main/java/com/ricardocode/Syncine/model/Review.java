package com.ricardocode.Syncine.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imdbId;

    private int classificacao;

    @Column(length = 5000)
    private String textoReview;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false )
    private Usuario usuario;

}
