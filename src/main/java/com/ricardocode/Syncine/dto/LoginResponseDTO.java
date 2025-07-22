package com.ricardocode.Syncine.dto;

public record LoginResponseDTO(
        String token,
        String type,
        Long id,
        String username,
        String email
) {
    public LoginResponseDTO(String token, Long id, String username, String email) {
        this(token, "Bearer", id, username, email);
    }
}

