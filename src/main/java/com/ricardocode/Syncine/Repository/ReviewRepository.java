package com.ricardocode.Syncine.Repository;

import com.ricardocode.Syncine.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
