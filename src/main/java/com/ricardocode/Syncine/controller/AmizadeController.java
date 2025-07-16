package com.ricardocode.Syncine.controller;

import com.ricardocode.Syncine.model.Amizade;
import com.ricardocode.Syncine.service.AmizadeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amizades")
@RequiredArgsConstructor
public class AmizadeController {

    private final AmizadeService amizadeService;

    // Enviar solicitaçãp
    @PostMapping("/solicitar")
    public ResponseEntity<Amizade> enviarSolicitacao(@RequestParam Long solicitanteId, @RequestParam Long solicitadoId) {
        return ResponseEntity.ok(amizadeService.enviarSolicitacao(solicitanteId, solicitadoId));
    }

    // Aceitar solicitação
    @PostMapping("/{id}/responder")
    public ResponseEntity<Amizade> responderSolicitacao(@PathVariable Long id, @RequestParam boolean aceitar) {
        return ResponseEntity.ok(amizadeService.responderSolicitacao(id, aceitar));
    }

    // Listar pedidos pendentes
    @GetMapping("/pendentes/{idUsuario}")
    public ResponseEntity<List<Amizade>> listarPendentes(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(amizadeService.listarSolicitacoesPendentes(idUsuario));
    }

    // Listar amigos
    @GetMapping("/amigos/{idUsuario}")
    public ResponseEntity<List<Amizade>> listarAmigos(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(amizadeService.listarAmigos(idUsuario));
    }

    // Deletar Amizade
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirAmizade(@PathVariable Long id) {
        amizadeService.excluirAmizade(id);
        return ResponseEntity.noContent().build();
    }

    // Verificar status de amizade
    @GetMapping("/verificar")
    public ResponseEntity<?> verificarAmizade(@RequestParam Long id1, @RequestParam Long id2) {
        return amizadeService.verificarAmizade(id1, id2)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
