package com.ricardocode.Syncine.repository;

import com.ricardocode.Syncine.model.ConviteSessao;
import com.ricardocode.Syncine.model.Sessao;
import com.ricardocode.Syncine.model.User;
import com.ricardocode.Syncine.model.enums.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConviteRepository extends JpaRepository<ConviteSessao, Long> {

    // Lista convites pendentes recebidos por um usuário
    List<ConviteSessao> findByConvidadoAndStatus(User convidado);

    // Verifica se já existe convite pendente para o mesmo usuário na mesma sessão
    boolean existsBySessaoAndConvidadoAndStatus(Sessao sessao, User convidado, StatusPedido status);

    // Lista convites enviados por um usuário 
    List<ConviteSessao> findByRemetente(User remetente);
}
