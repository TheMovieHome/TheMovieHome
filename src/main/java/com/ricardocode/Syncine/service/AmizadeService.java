package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.model.Amizade;
import com.ricardocode.Syncine.model.enums.StatusPedido;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.repository.AmizadeRepository;
import com.ricardocode.Syncine.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AmizadeService {

    private final AmizadeRepository amizadeRepository;
    private final UsuarioRepository usuarioRepository;

    public boolean existeRelacionamento(Long id1, Long id2) {
        return amizadeRepository.existeRelacaoEntreUsuarios(id1, id2);
    }

    @Transactional
    public Amizade enviarSolicitacao(Long idSolicitante, Long idSolicitado) {
        if (idSolicitante.equals(idSolicitado)) {
            throw new IllegalArgumentException("Não é possível enviar solicitação para si mesmo.");
        }

        if (amizadeRepository.existeRelacaoEntreUsuarios(idSolicitante, idSolicitado)) {
            throw new IllegalStateException("Já existe uma relação entre esses usuários.");
        }

        Usuario solicitante = usuarioRepository.findById(idSolicitante)
                .orElseThrow(() -> new IllegalArgumentException("Solicitante não encontrado."));
        Usuario solicitado = usuarioRepository.findById(idSolicitado)
                .orElseThrow(() -> new IllegalArgumentException("Solicitado não encontrado."));

        Amizade amizade = new Amizade();
        amizade.setSolicitante(solicitante);
        amizade.setSolicitado(solicitado);
        amizade.setStatus(StatusPedido.PENDENTE);

        return amizadeRepository.save(amizade);
    }

    @Transactional
    public Amizade responderSolicitacao(Long idAmizade, boolean aceitar) {
        Amizade amizade = amizadeRepository.findById(idAmizade)
                .orElseThrow(() -> new IllegalArgumentException("Pedido de amizade não encontrado."));

        if (amizade.getStatus() != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Solicitação já foi respondida.");
        }

        // Apenas atualiza o status. A lógica de listagem já trata a relação como amizade.
        amizade.setStatus(aceitar ? StatusPedido.ACEITO : StatusPedido.RECUSADO);

        // Se a solicitação for recusada, ela será excluída do banco de dados.
        if (!aceitar) {
            amizadeRepository.delete(amizade);
            return null; // Retorna null para indicar que foi removido
        }

        return amizadeRepository.save(amizade);
    }

    @Transactional
    public void excluirAmizade(Long idAmizade) {
        Amizade amizade = amizadeRepository.findById(idAmizade)
                .orElseThrow(() -> new IllegalArgumentException("Amizade não encontrada."));
        amizadeRepository.delete(amizade);
    }

    public List<Amizade> listarSolicitacoesPendentes(Long idUsuario) {
        return amizadeRepository.findBySolicitadoIdAndStatus(idUsuario, StatusPedido.PENDENTE);
    }

    public List<Amizade> listarAmigos(Long idUsuario) {
        return amizadeRepository.listarAmigos(idUsuario);
    }

    public Optional<Amizade> verificarAmizade(Long id1, Long id2) {
        return amizadeRepository.findAmizadeAceitaEntreUsuarios(id1, id2);
    }
}