package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.repository.UsuarioRepository;
import com.ricardocode.Syncine.dto.UserDTO;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    public UsuarioService(UsuarioRepository userRepository, PasswordEncoder passwordEncoder ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registerNewUser(UserDTO userDto) {
        if (userRepository.findByEmail(userDto.email()).isPresent()){
            throw new IllegalStateException("E-mail já cadastrado");
        }

        Usuario newUser = new Usuario();
        newUser.setUsername(userDto.username());
        newUser.setEmail(userDto.email());


        newUser.setPassword(passwordEncoder.encode(userDto.password()));

        return userRepository.save(newUser);

    }


    public List<Usuario> getUsers() {
        return userRepository.findAll();
    }


    public Usuario getUserById(long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new IllegalStateException("Usuario" + id + "não encontrado"));
    }


    public void deleteUserById(long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalStateException("usuario não encontrado");
        }
        userRepository.deleteById(id);
    }

    public Usuario updateUser(Long user, UserDTO userDto) {
        Usuario existingUser = getUserById(user);
        if (userDto.username() != null) {
            existingUser.setUsername(userDto.username());
        }
        if (userDto.email() != null) {
            existingUser.setEmail(userDto.email());
        }
        if (userDto.password() != null) {
            existingUser.setPassword(passwordEncoder.encode(userDto.password()));
        }
        return userRepository.save(existingUser);

    }

}
