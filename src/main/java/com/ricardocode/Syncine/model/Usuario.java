package com.ricardocode.Syncine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.List;


@Entity // anotação para indicar que essa classe é uma entidade
@Getter
@Setter
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;


    @ElementCollection(fetch = FetchType.LAZY) // LAZY é sempre melhor para coleções
    @CollectionTable(name = "usuario_watchlist", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "imdb_id")
    private Set<String> listaDeDesejo = new HashSet<>();
}
