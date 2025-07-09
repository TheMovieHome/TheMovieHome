package com.ricardocode.Syncine.model;


import java.time.LocalDateTime;

import com.ricardocode.Syncine.model.enums.StatusPedido;
import jakarta.persistence.*;

@Entity
@Table(name = "convites")
public class ConviteAmizade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // Usuário que esta mandando o convite
    @ManyToOne
    @JoinColumn(name = "Rementente_id")
    private Usuario Rementente;

    // Usuário que vai receber o convite
    @ManyToOne(optional = false)
    @JoinColumn(name = "Destinatario_id")
    private Usuario Destinatario;

    // Status do convite
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.PENDENTE;

    // Hora do convite
    @Column(nullable = false)
    private LocalDateTime enviadoEm = LocalDateTime.now();

}
