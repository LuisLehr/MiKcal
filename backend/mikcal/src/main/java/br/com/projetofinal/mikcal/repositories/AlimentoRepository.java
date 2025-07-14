package br.com.projetofinal.mikcal.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetofinal.mikcal.entities.Alimento;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AlimentoRepository extends JpaRepository<Alimento, Long>{

    @Query(value = "SELECT a.* FROM Alimento a WHERE LOWER(unaccent(a.nome)) LIKE LOWER(unaccent(CONCAT('%', :nome, '%')))", nativeQuery = true)
    Page<Alimento> findByNomeContainingIgnoreCase(@Param("nome") String nome, Pageable pageable);
}
