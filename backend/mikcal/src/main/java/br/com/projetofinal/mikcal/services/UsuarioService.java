package br.com.projetofinal.mikcal.services;

import br.com.projetofinal.mikcal.entities.Usuario;
import br.com.projetofinal.mikcal.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> todosUsuarios() {
        return repository.findAll();
    }

    public Optional<Usuario> buscaUsuariosById(Long id) {
        return repository.findById(id);
    }
}