package com.ricardocode.Syncine.repository;

import com.ricardocode.Syncine.model.Sessao;
import com.ricardocode.Syncine.model.enums.Visibilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessaoRepository extends JpaRepository<Sessao, Long> {

    // Buscar sessões com visibilidade pública
    List<Sessao> findByVisibilidade(Visibilidade visibilidade);

}
