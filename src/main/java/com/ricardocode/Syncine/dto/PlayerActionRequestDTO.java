package com.ricardocode.Syncine.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerActionRequestDTO {
    private Long sessaoId;
    private String tipoAcao;
    private double tempoAtual;
    private Long usuarioId;
}
