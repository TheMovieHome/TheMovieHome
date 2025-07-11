package com.ricardocode.Syncine.model;

import java.time.LocalDateTime;
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

    // Nome da sala exibido na UI 
    @Column(nullable = false, length = 80)
    private String nome;

    // Pública ou privada 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Visibilidade visibilidade;

    // Código de 6 digitos usados para criar conta privada
    @Column(length = 6, nullable = true, unique = true)
    private String codigoAcesso;

    // Carimbo de criação 
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadaEm = LocalDateTime.now();

    // Dono da sala 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dono_id", nullable = false)
    private Usuario dono;

//    Adicionar autenticação para identificar automaticamente o dono (sem precisar passar donoId).
//
//    Permitir entrar em uma sessão privada com o código (findByCodigoAcesso).
//
//    Paginar sessões públicas com Pageable.
}
