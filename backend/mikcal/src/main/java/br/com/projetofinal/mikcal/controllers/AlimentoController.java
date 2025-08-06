package br.com.projetofinal.mikcal.controllers;

// Imports
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.projetofinal.mikcal.services.AlimentoService;
import br.com.projetofinal.mikcal.entities.Alimento;
import br.com.projetofinal.mikcal.exceptions.AlimentoNaoEncontradoException;
import br.com.projetofinal.mikcal.repositories.AlimentoRepository;

@RestController
@RequestMapping(value="/alimento")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AlimentoController {

    private static final Logger logger = LoggerFactory.getLogger(AlimentoController.class);

    @Autowired
    private AlimentoRepository alimentoRepo;

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

    @GetMapping("/all")
    public ResponseEntity<List<Alimento>> listarAlimentos() {
        logger.info("Listando todos os alimentos");
        try {
            List<Alimento> alimentos = alimentoRepo.findAll();
            if (alimentos.isEmpty()) {
                logger.warn("Nenhum alimento encontrado no banco de dados");
                return ResponseEntity.ok(alimentos);
            }
            return ResponseEntity.ok(alimentos);
        }   catch (Exception e) {
            logger.error("Erro ao listar alimentos: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
