package br.com.projetofinal.mikcal.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetofinal.mikcal.entities.Alimento;

public interface AlimentoRepository extends JpaRepository<Alimento, Long>{
    
}
