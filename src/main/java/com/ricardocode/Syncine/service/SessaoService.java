package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.model.Sessao;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.model.enums.Visibilidade;
import com.ricardocode.Syncine.repository.SessaoRepository;
import com.ricardocode.Syncine.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SessaoService {

    private final SessaoRepository sessaoRepository;
    private final UsuarioRepository userRepository;

    @Transactional
    public Sessao criarSessao(String nome, Visibilidade visibilidade, String codigoAcesso, Long donoId) {
        Usuario dono = userRepository.findById(donoId)
                .orElseThrow(() -> new IllegalArgumentException("Dono da sessão não encontrado."));

        if (visibilidade == Visibilidade.PRIVADA && (codigoAcesso == null || codigoAcesso.length() != 6)) {
            throw new IllegalArgumentException("Código de acesso inválido para sessão privada.");
        }

        Sessao sessao = new Sessao();
        sessao.setNome(nome);
        sessao.setVisibilidade(visibilidade);
        sessao.setCodigoAcesso(codigoAcesso);
        sessao.setDono(dono);

        return sessaoRepository.save(sessao);
    }

    public List<Sessao> listarSessoesPublicas() {
        return sessaoRepository.findByVisibilidade(Visibilidade.PUBLICA);
    }
}
