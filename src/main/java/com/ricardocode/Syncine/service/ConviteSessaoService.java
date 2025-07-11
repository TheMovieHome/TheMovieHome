package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.model.ConviteSessao;
import com.ricardocode.Syncine.model.Sessao;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.model.enums.StatusPedido;
import com.ricardocode.Syncine.repository.ConviteSessaoRepository;
import com.ricardocode.Syncine.repository.SessaoRepository;
import com.ricardocode.Syncine.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConviteSessaoService {

    private final ConviteSessaoRepository conviteRepo;
    private final SessaoRepository sessaoRepo;
    private final UsuarioRepository usuarioRepo;

    public ConviteSessao enviarConvite(Long sessaoId, Long remetenteId, Long convidadoId) {
        Sessao sessao = sessaoRepo.findById(sessaoId)
                .orElseThrow(() -> new EntityNotFoundException("Sessão não encontrada"));
        Usuario remetente = usuarioRepo.findById(remetenteId)
                .orElseThrow(() -> new EntityNotFoundException("Remetente não encontrado"));
        Usuario convidado = usuarioRepo.findById(convidadoId)
                .orElseThrow(() -> new EntityNotFoundException("Convidado não encontrado"));

        // Evitar convites duplicados
        conviteRepo.findBySessaoIdAndConvidadoIdAndStatus(sessaoId, convidadoId, StatusPedido.PENDENTE)
                .ifPresent(c -> { throw new IllegalStateException("Convite já enviado para esse usuário."); });

        ConviteSessao convite = new ConviteSessao();
        convite.setSessao(sessao);
        convite.setRemetente(remetente);
        convite.setConvidado(convidado);
        convite.setStatus(StatusPedido.PENDENTE);

        return conviteRepo.save(convite);
    }

    public List<ConviteSessao> listarPendentes(Long idConvidado) {
        return conviteRepo.findByConvidadoIdAndStatus(idConvidado, StatusPedido.PENDENTE);
    }

    public void responderConvite(Long conviteId, StatusPedido novaResposta) {
        ConviteSessao convite = conviteRepo.findById(conviteId)
                .orElseThrow(() -> new EntityNotFoundException("Convite não encontrado"));
        convite.setStatus(novaResposta);
        conviteRepo.save(convite);
    }
}
