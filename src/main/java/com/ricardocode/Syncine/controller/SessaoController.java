package com.ricardocode.Syncine.controller;

import com.ricardocode.Syncine.model.Sessao;
import com.ricardocode.Syncine.model.enums.Visibilidade;
import com.ricardocode.Syncine.service.SessaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessoes")
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
}
