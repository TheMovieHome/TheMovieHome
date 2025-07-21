package com.ricardocode.Syncine.controller;

import com.ricardocode.Syncine.model.Sessao;
import com.ricardocode.Syncine.model.enums.Visibilidade;
import com.ricardocode.Syncine.service.SessaoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessoes")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SessaoController {

    private final SessaoService sessaoService;

    @PostMapping("/criar")
    public ResponseEntity<Sessao> criarSessao(
            @RequestParam String nome,
            @RequestParam Visibilidade visibilidade,
            @RequestParam(required = false) String codigoAcesso,
            @RequestParam Long donoId
    ) {
        Sessao sessao = sessaoService.criarSessao(nome, visibilidade, codigoAcesso, donoId);
        return ResponseEntity.ok(sessao);
    }

    @GetMapping("/publicas")
    public ResponseEntity<List<Sessao>> listarSessoesPublicas() {
        return ResponseEntity.ok(sessaoService.listarSessoesPublicas());
    }

    // Entrar na sessão (adicionar participante)
    @PostMapping("/{sessaoId}/entrar/{usuarioId}")
    public ResponseEntity<Sessao> entrarSessao(
            @PathVariable Long sessaoId,
            @PathVariable Long usuarioId
    ) {
        try {
            Sessao sessaoAtualizada = sessaoService.adicionarParticipante(sessaoId, usuarioId);
            return ResponseEntity.ok(sessaoAtualizada);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // Sair da sessão (remover participante)
    @DeleteMapping("/{sessaoId}/sair/{usuarioId}")
    public ResponseEntity<Void> sairSessao(
            @PathVariable Long sessaoId,
            @PathVariable Long usuarioId
    ) {
        try {
            sessaoService.removerParticipante(sessaoId, usuarioId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
