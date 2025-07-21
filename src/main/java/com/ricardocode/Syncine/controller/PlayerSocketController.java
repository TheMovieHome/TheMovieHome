package com.ricardocode.Syncine.controller;

import com.ricardocode.Syncine.dto.PlayerActionRequestDTO;
import com.ricardocode.Syncine.dto.PlayerActionResponseDTO;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PlayerSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UsuarioService usuarioService;

    @MessageMapping("/player/acao") // Cliente envia para /app/player/acao
    public void receberAcao(@Payload PlayerActionRequestDTO acaoDTO) {
        Usuario usuario = usuarioService.BuscarUsuarioID(acaoDTO.getUsuarioId());

        PlayerActionResponseDTO responseDTO = new PlayerActionResponseDTO();
        responseDTO.setTipoAcao(acaoDTO.getTipoAcao());
        responseDTO.setTempoAtual(acaoDTO.getTempoAtual());
        responseDTO.setUsuarioId(acaoDTO.getUsuarioId());
        responseDTO.setUsername(usuario.getUsername());

        String destino = "/topic/sessao/" + acaoDTO.getSessaoId();
        messagingTemplate.convertAndSend(destino, responseDTO);
    }
}
