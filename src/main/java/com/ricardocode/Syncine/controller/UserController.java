package com.ricardocode.Syncine.controller;


import com.ricardocode.Syncine.dto.UserDTO;
import com.ricardocode.Syncine.model.Usuario;
import com.ricardocode.Syncine.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Identificar que essa classe é um controller
@CrossOrigin(origins = "http://localhost:5173" )
@RequestMapping("api/users") //endpoint para criar a url que vai ser o endereço para o cadastro e login
public class UserController {

    private final UsuarioService usuarioService;

    public UserController(UsuarioService userService) {
        this.usuarioService = userService;
    }

    // Vai registrar um novo usuario
    @PostMapping("/register")
    public ResponseEntity<Usuario> registerUser(@RequestBody UserDTO userDTO) {
        try {
            Usuario novoUsuario = usuarioService.registrarNovoUsuario(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    // Vai listar todos os usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsers() {
        List<Usuario> users = usuarioService.getUsers();
        return ResponseEntity.ok(users);
    }

    // vai buscar o usuario pelo id
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUserById(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try{
            Usuario user = usuarioService.BuscarUsuarioID(id);
            return ResponseEntity.ok(user);
        }catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // vai deletar o usuario pelo seu id
    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> deleteUser(@PathVariable Long id) {
        try{
            usuarioService.deletarUsuarioId(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Buscar usuário pelo nome (
    @GetMapping("/nome/{nome}")
    public ResponseEntity<Usuario> getUserByName(@PathVariable String nome) {
        try {
            Usuario user = usuarioService.buscarUsuarioNome(nome);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // Atualiza o usuario ja existente
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            Usuario updatedUser = usuarioService.AtualizarUsuario(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


