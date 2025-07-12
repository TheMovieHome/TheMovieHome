package com.ricardocode.Syncine.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Review {
    @Id
    private Long id;
    private int rating;
    private String reviewText;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false )
    private Usuario user;

}
