package com.ricardocode.Syncine.service;

import com.ricardocode.Syncine.Repository.UserRepository;
import com.ricardocode.Syncine.model.User;
import com.ricardocode.Syncine.dto.UserDTO;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerNewUser(UserDTO userDto) {
        if (userRepository.findByEmail(userDto.email()).isPresent()){
            throw new IllegalStateException("E-mail já cadastrado");
        }

        User newUser = new User();
        newUser.setUsername(userDto.username());
        newUser.setEmail(userDto.email());


        newUser.setPassword(passwordEncoder.encode(userDto.password()));

        return userRepository.save(newUser);

    }


    public List<User> getUsers() {
        return userRepository.findAll();
    }


    public User getUserById(long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new IllegalStateException("Usuario" + id + "não encontrado"));
    }


    public void deleteUserById(long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalStateException("usuario não encontrado");
        }
        userRepository.deleteById(id);
    }
}
