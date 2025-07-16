package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class ListaDeDesejoService {

    private final UsuarioRepository usuarioRepository;

    public ListaDeDesejoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public void adicionarFilme(Long id, String imdbId){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(
                () -> new RuntimeException("usuario não encontrado"));

        usuario.getListaDeDesejo().add(imdbId);
    }

    public void removerFilme(Long usuarioId, String imdbId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.getListaDeDesejo().remove(imdbId);
    }


    public Set<String> verListaDeDesejo(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return usuario.getListaDeDesejo();
    }
}
