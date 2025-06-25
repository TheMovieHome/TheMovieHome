package com.ricardocode.Syncine.Repository;

import com.ricardocode.Syncine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
