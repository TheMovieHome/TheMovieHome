package com.ricardocode.Syncine.repository;

import com.ricardocode.Syncine.model.Amizade;
import com.ricardocode.Syncine.model.enums.StatusPedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AmizadeRepository extends JpaRepository<Amizade, Long> {

    // Verifica se já existe amizade (qualquer status) entre dois usuários, em qualquer direção
    @Query("""
        SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END
        FROM Amizade a
        WHERE (a.solicitante.id = :id1 AND a.solicitado.id = :id2)
           OR (a.solicitante.id = :id2 AND a.solicitado.id = :id1)
    """)
    boolean existeRelacaoEntreUsuarios(@Param("id1") Long idUsuario1, @Param("id2") Long idUsuario2);

    // Busca pedidos pendentes recebidos por um usuário
    List<Amizade> findBySolicitadoIdAndStatus(Long idSolicitado, StatusPedido status);

    // Busca amizade aceita entre dois usuários
    @Query("""
        SELECT a FROM Amizade a
        WHERE ((a.solicitante.id = :id1 AND a.solicitado.id = :id2)
            OR (a.solicitante.id = :id2 AND a.solicitado.id = :id1))
          AND a.status = 'ACEITO'
    """)
    Optional<Amizade> findAmizadeAceitaEntreUsuarios(@Param("id1") Long idUsuario1, @Param("id2") Long idUsuario2);

    // Lista todas as amizades aceitas de um usuário (independente da direção)
    @Query("""
        SELECT a FROM Amizade a
        WHERE (a.solicitante.id = :id OR a.solicitado.id = :id)
          AND a.status = 'ACEITO'
    """)
    List<Amizade> listarAmigos(@Param("id") Long idUsuario);
}