package com.ricardocode.Syncine.model;


import java.time.LocalDateTime;

import com.ricardocode.Syncine.model.enums.StatusPedido;
import jakarta.persistence.*;

@Entity
@Table(name = "convites")
public class ConviteSessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Usuário que está sendo convidado 
    @ManyToOne(optional = false)
    @JoinColumn(name = "convidado_id")
    private Usuario convidado;

    // Quem enviou o convite (dono da sala)
    @ManyToOne(optional = false)
    @JoinColumn(name = "remetente_id")
    private Usuario remetente;

    // Sessão para a qual o convite foi enviado 
    @ManyToOne(optional = false)
    @JoinColumn(name = "sessao_id")
    private Sessao sessao;

    // Status do pedido
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.PENDENTE;

    // Hora do pedido
    @Column(nullable = false)
    private LocalDateTime enviadoEm = LocalDateTime.now();

}
