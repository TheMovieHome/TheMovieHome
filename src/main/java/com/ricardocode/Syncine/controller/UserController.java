package com.ricardocode.Syncine.controller;


import com.ricardocode.Syncine.dto.UserDTO;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //identificar que essa classe é um controller
@CrossOrigin(origins = "http://localhost:5173" )
@RequestMapping("api/users") //endpoint para criar a url que vai ser o endereço para o cadastro e login
public class UserController {

    private final UsuarioService userService;

    public UserController(UsuarioService userService) {
        this.userService = userService;
    }

    //vai registrar um novo usuario
    @PostMapping("/register")
    public ResponseEntity<String> registerUser (@RequestBody UserDTO userDTO) {
        try {
            userService.registerNewUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso!");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //vai listar todos os usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsers() {
        List<Usuario> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    //vai buscar o usuario pelo id
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUserById(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try{
            Usuario user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        }catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //vai deletar o usuario pelo seu id
    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> deleteUser(@PathVariable Long id) {
        try{
            userService.deleteUserById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //atualiza o usuario ja existente
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            Usuario updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


