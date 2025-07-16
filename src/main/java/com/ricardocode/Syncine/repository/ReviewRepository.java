package com.ricardocode.Syncine.repository;

import com.ricardocode.Syncine.model.Review;
import com.ricardocode.Syncine.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByImdbId(String imdbId);

    List<Review> findByUsuario(Usuario usuario);
}
