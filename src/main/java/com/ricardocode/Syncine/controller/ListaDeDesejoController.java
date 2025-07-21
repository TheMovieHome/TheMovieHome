package com.ricardocode.Syncine.controller;


import com.ricardocode.Syncine.dto.RequisicaoListaDeDesejoDTO;
import com.ricardocode.Syncine.service.ListaDeDesejoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/ListaDeDesejo")
public class ListaDeDesejoController {

    private final ListaDeDesejoService listaDeDesejoService;

    public ListaDeDesejoController(ListaDeDesejoService listaDeDesejoService) {
        this.listaDeDesejoService = listaDeDesejoService;
    }

    @GetMapping
    public ResponseEntity<Set<String>> getListaDeDesejo() {
        Long usuarioId = 1L;
        Set<String> ListaDeDesejo = listaDeDesejoService.verListaDeDesejo(usuarioId);
        return ResponseEntity.ok(ListaDeDesejo);
    }

    @PostMapping
    public ResponseEntity<Void> adicionarFilme(@RequestBody RequisicaoListaDeDesejoDTO requisicao) {
        Long usuarioId = 1L; // Para testes
        listaDeDesejoService.adicionarFilme(usuarioId, requisicao.imdbId());
        return ResponseEntity.ok().build();
    }


    @DeleteMapping
    public ResponseEntity<Void> removerFilme(@RequestBody RequisicaoListaDeDesejoDTO requisicao) {
        Long usuarioId = 1L;
        listaDeDesejoService.removerFilme(usuarioId, requisicao.imdbId());
        return ResponseEntity.noContent().build();
    }
}


