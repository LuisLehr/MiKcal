package br.com.projetofinal.mikcal.controllers;

// Imports

import br.com.projetofinal.mikcal.dto.ApiResponse;
import br.com.projetofinal.mikcal.dto.UsuarioCadastroDTO;
import br.com.projetofinal.mikcal.entities.Usuario;
import br.com.projetofinal.mikcal.exceptions.UsuarioNaoEncontradoException;
import br.com.projetofinal.mikcal.repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(value = "/usuario")
public class UsuarioController {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

    private final BCryptPasswordEncoder passwordEncoder;

    private final UsuarioRepository repository;

    public UsuarioController(BCryptPasswordEncoder passwordEncoder, UsuarioRepository repository) {
        this.passwordEncoder = passwordEncoder;
        this.repository = repository;
    }

    // Retorna todos os usuarios
    @GetMapping
    public List<Usuario> todosUsuarios() {
        return repository.findAll();
    }

    // Busca usuario por Id
    @GetMapping("/id/{id}")
    public Usuario buscaUsuarioById(@PathVariable Long id) {
        logger.info("Buscando usuario por id {}", id);
        return repository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<ApiResponse> cadastrar(@RequestBody UsuarioCadastroDTO dto) {

        logger.info("Recebendo requisição de cadastro: {}", dto);

        // verifica se o username ja existe
        if (repository.findByUsername(dto.getUsername()).isPresent()) {
            logger.warn("Username já existe: {}", dto.getUsername());
            return ResponseEntity.badRequest().body(new ApiResponse("Usuário já existe"));
        }

        if (!dto.getSenha().matches("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")) {
            logger.warn("Senha inválida para username: {}", dto.getUsername());
            return ResponseEntity.badRequest().body(new ApiResponse("A senha deve contar letras e números"));
        }

        // Criptografando a senha
        String senhaCriptografada = passwordEncoder.encode(dto.getSenha());

        // Converte DTO para Entity
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setUsername(dto.getUsername());
        usuario.setSenha(senhaCriptografada);
        usuario.setEmail(dto.getEmail());
        usuario.setPeso(dto.getPeso());
        usuario.setAltura(dto.getAltura());
        try {
            usuario.setDataNascimento(LocalDate.parse(dto.getDataNascimento())); // Ex: "2000-01-01"
        } catch (Exception e) {
            logger.error("Erro ao parsear dataNascimento: {}", dto.getDataNascimento(), e);
            return ResponseEntity.badRequest().body(new ApiResponse("Formato de data inválido, use yyyy-MM-dd"));
        }

        logger.info("Salvando usuário: {}", usuario);
        repository.save(usuario);
        logger.info("Usuário salvo com sucesso: {}", dto.getUsername());

        return ResponseEntity.ok(new ApiResponse("Usuário cadastrado com sucesso"));
    }

    // Checando se o username ja existe
    @GetMapping("/checar-username/{username}")
    public ResponseEntity<Boolean> checarUsername(@PathVariable String username) {
        logger.info("Verificando username: {}", username);
        boolean exists = repository.findByUsername(username).isPresent();
        return ResponseEntity.ok(exists);
    }
}