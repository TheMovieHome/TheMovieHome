package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.model.Sessao;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.model.enums.Visibilidade;
import com.ricardocode.Syncine.repository.SessaoRepository;
import com.ricardocode.Syncine.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SessaoService {

    private final SessaoRepository sessaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Sessao criarSessao(String nome, Visibilidade visibilidade, String codigoAcesso, Long donoId) {
        Usuario dono = usuarioRepository.findById(donoId)
                .orElseThrow(() -> new IllegalArgumentException("Dono da sessão não encontrado."));

        if (visibilidade == Visibilidade.PRIVADA && (codigoAcesso == null || codigoAcesso.length() != 6)) {
            throw new IllegalArgumentException("Código de acesso inválido para sessão privada.");
        }

        Sessao sessao = new Sessao();
        sessao.setNome(nome);
        sessao.setVisibilidade(visibilidade);
        sessao.setCodigoAcesso(codigoAcesso);
        sessao.setDono(dono);
        sessao.getParticipantes().add(dono);

        return sessaoRepository.save(sessao);
    }

    public List<Sessao> listarSessoesPublicas() {
        return sessaoRepository.findByVisibilidade(Visibilidade.PUBLICA);
    }

    @Transactional
    public Sessao adicionarParticipante(Long sessaoId, Long usuarioId) {
        Sessao sessao = sessaoRepository.findById(sessaoId)
                .orElseThrow(() -> new EntityNotFoundException("Sessão não encontrada"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        sessao.getParticipantes().add(usuario);

        return sessaoRepository.save(sessao);
    }

    @Transactional
    public void removerParticipante(Long sessaoId, Long usuarioId) {
        Sessao sessao = sessaoRepository.findById(sessaoId)
                .orElseThrow(() -> new EntityNotFoundException("Sessão não encontrada"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        sessao.getParticipantes().remove(usuario);

        if (sessao.getParticipantes().isEmpty()) {
            sessaoRepository.delete(sessao);
        } else {
            sessaoRepository.save(sessao);
        }
    }
}
