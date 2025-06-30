package com.ricardocode.Syncine.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(
    name = "amizades",
    // O mesmo par de usuarios nao pode ter mais de uma amizade
    uniqueConstraints = @UniqueConstraint(
        name = "uk_par_usuarios",
        columnNames = {"solicitante_id", "solicitado_id"}
    ),
    // Acelera buscas no banco, possibilitando buscas por status de pedido
    indexes = {
        @Index(name = "idx_amizade_status", columnList = "status"),
        @Index(name = "idx_amizade_users",  columnList = "solicitante_id,solicitado_id")
    })

public class Amizade {

    @Id
    @GeneratedValue
    private Long id;

    // Usuario que mandou o convite
    @ManyToOne(optional = false)
    private User solicitante;

    // Usuario que recebeu o convite
    @ManyToOne(optional = false)
    private User solicitado;

    // Status da amizade
    @Enumerated(EnumType.STRING)
    private StatusAmizade status = StatusAmizade.PENDENTE;

    private LocalDateTime dataCriacao   = LocalDateTime.now();
    private LocalDateTime dataResposta;       // preenchido em ACEITA ou RECUSADA
    private LocalDateTime dataBloqueio;       // preenchido em BLOQUEADA

    
}


