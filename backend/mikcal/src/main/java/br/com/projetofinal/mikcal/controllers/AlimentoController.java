package br.com.projetofinal.mikcal.controllers;

// Imports
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.com.projetofinal.mikcal.services.AlimentoService;
import br.com.projetofinal.mikcal.entities.Alimento;
import br.com.projetofinal.mikcal.exceptions.AlimentoNaoEncontradoException;
import br.com.projetofinal.mikcal.repositories.AlimentoRepository;

@RestController
@RequestMapping(value="/alimento")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AlimentoController {

    @Autowired
    private AlimentoService service;

    // Retorna todos os alimentos
    @GetMapping
    public Page<Alimento> todosAlimentos(Pageable pageable) {
        return service.listarAlimentosPaginados(pageable);
    }

    // Busca alimento por Id
    @GetMapping("/{id}")
        public Alimento buscaAlimentoById(@PathVariable Long id) {
            return service.buscaAlimentoById(id)
                .orElseThrow(() -> new AlimentoNaoEncontradoException(id));
    }

    @GetMapping("/search")
    public Page<Alimento>  buscaAlimentosPorNome(@RequestParam("nome") String nome, Pageable pageable) {
        return service.buscarAlimentosPorNome(nome, pageable);
    }
}
