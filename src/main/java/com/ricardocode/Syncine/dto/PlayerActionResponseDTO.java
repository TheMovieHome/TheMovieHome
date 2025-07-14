package com.ricardocode.Syncine.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerActionResponseDTO {
    private String tipoAcao;
    private double tempoAtual;
    private Long usuarioId;
    private String username;
}
