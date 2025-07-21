package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.repository.UsuarioRepository;
import com.ricardocode.Syncine.dto.UserDTO;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;



    public UsuarioService(UsuarioRepository userRepository, PasswordEncoder passwordEncoder ) {
        this.usuarioRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrarNovoUsuario(UserDTO userDto) {
        if (usuarioRepository.findByEmail(userDto.email()).isPresent()){
            throw new IllegalStateException("E-mail já cadastrado");
        }

        Usuario newUser = new Usuario();
        newUser.setUsername(userDto.username());
        newUser.setEmail(userDto.email());


        newUser.setPassword(passwordEncoder.encode(userDto.password()));

        return usuarioRepository.save(newUser);

    }


    public List<Usuario> getUsers() {
        return usuarioRepository.findAll();
    }


    public Usuario BuscarUsuarioID(long id) {
        return usuarioRepository.findById(id).orElseThrow(() ->
                new IllegalStateException("Usuario" + id + "não encontrado"));
    }

    public Usuario buscarUsuarioNome(String nome) {
        return usuarioRepository.findByUsername(nome)
                .orElseThrow(() -> new RuntimeException("Usuário com nome '" + nome + "' não encontrado."));}

    public void deletarUsuarioId(long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalStateException("usuario não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario AtualizarUsuario(Long user, UserDTO userDto) {
        Usuario existingUser = BuscarUsuarioID(user);
        if (userDto.username() != null) {
            existingUser.setUsername(userDto.username());
        }
        if (userDto.email() != null) {
            existingUser.setEmail(userDto.email());
        }
        if (userDto.password() != null) {
            existingUser.setPassword(passwordEncoder.encode(userDto.password()));
        }
        return usuarioRepository.save(existingUser);

    }

}
