package br.com.projetofinal.mikcal.controllers;

// Imports
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.com.projetofinal.mikcal.entities.Alimento;
import br.com.projetofinal.mikcal.exceptions.AlimentoNaoEncontradoException;
import br.com.projetofinal.mikcal.repositories.AlimentoRepository;

@RestController
@RequestMapping(value="/alimento")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AlimentoController {
    
    // Criando o atributo repository
    @Autowired
    private AlimentoRepository repository;

    // Retorna todos os alimentos
    @GetMapping
    public List <Alimento> todosAlimentos() {
        List<Alimento> result = repository.findAll();
        return result;
    }

    // Busca alimento por Id
    @GetMapping("/{id}")
        public Alimento buscaAlimentoById(@PathVariable Long id) {
            return repository.findById(id)
                .orElseThrow(() -> new AlimentoNaoEncontradoException(id));
    }
}
