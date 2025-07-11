package com.ricardocode.Syncine.repository;

import com.ricardocode.Syncine.model.ConviteSessao;
import com.ricardocode.Syncine.model.enums.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConviteSessaoRepository extends JpaRepository<ConviteSessao, Long> {

    // Buscar convites pendentes para um usuário
    List<ConviteSessao> findByConvidadoIdAndStatus(Long convidadoId, StatusPedido status);

    // Verifica se já existe convite ativo para mesma sessão e convidado
    Optional<ConviteSessao> findBySessaoIdAndConvidadoIdAndStatus(Long sessaoId, Long convidadoId, StatusPedido status);
}
