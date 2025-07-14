package br.com.projetofinal.mikcal.services;

import br.com.projetofinal.mikcal.entities.Alimento;
import br.com.projetofinal.mikcal.repositories.AlimentoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlimentoService {

    private final AlimentoRepository repository;

    public AlimentoService(AlimentoRepository repository) {
        this.repository = repository;
    }

    public Page<Alimento> listarAlimentosPaginados(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<Alimento> buscarAlimentosPorNome(String nome, Pageable pageable) {
        return repository.findByNomeContainingIgnoreCase(nome, pageable);
    }

    public Optional<Alimento> buscaAlimentoById(Long id) {
        return repository.findById(id);
    }

}
