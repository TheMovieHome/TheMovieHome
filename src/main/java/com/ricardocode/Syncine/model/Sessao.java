package com.ricardocode.Syncine.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.ricardocode.Syncine.model.enums.Visibilidade;

@Getter
@Setter
@Entity
@Table(name = "sessoes",
        indexes = {
                @Index(name = "idx_codigo_acesso", columnList = "codigoAcesso", unique = true)
        })
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Visibilidade visibilidade;

    @Column(length = 6, nullable = true, unique = true)
    private String codigoAcesso;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadaEm = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dono_id", nullable = false)
    private Usuario dono;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "sessao_participantes", joinColumns = @JoinColumn(name = "sessao_id"), inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<Usuario> participantes = new HashSet<>();
}
