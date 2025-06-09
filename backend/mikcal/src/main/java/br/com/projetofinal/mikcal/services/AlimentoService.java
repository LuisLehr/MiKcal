package br.com.projetofinal.mikcal.services;

import br.com.projetofinal.mikcal.entities.Alimento;
import br.com.projetofinal.mikcal.repositories.AlimentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlimentoService {

    private final AlimentoRepository repository;

    public AlimentoService(AlimentoRepository repository) {
        this.repository = repository;
    }

    public List<Alimento> todosaAlimentos() {
        return repository.findAll();
    }

    public Optional<Alimento> buscaAlimentoById(Long id) {
        return repository.findById(id);
    }
}
