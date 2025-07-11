package com.ricardocode.Syncine.controller;

import com.ricardocode.Syncine.model.ConviteSessao;
import com.ricardocode.Syncine.model.enums.StatusPedido;
import com.ricardocode.Syncine.service.ConviteSessaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/convites")
@RequiredArgsConstructor
public class ConviteSessaoController {

    private final ConviteSessaoService conviteService;

    @PostMapping("/enviar")
    public ConviteSessao enviarConvite(
            @RequestParam Long sessaoId,
            @RequestParam Long remetenteId,
            @RequestParam Long convidadoId) {
        return conviteService.enviarConvite(sessaoId, remetenteId, convidadoId);
    }

    @GetMapping("/pendentes/{convidadoId}")
    public List<ConviteSessao> listarPendentes(@PathVariable Long convidadoId) {
        return conviteService.listarPendentes(convidadoId);
    }

    @PutMapping("/{conviteId}/responder")
    public void responderConvite(
            @PathVariable Long conviteId,
            @RequestParam StatusPedido resposta) {
        conviteService.responderConvite(conviteId, resposta);
    }
}
