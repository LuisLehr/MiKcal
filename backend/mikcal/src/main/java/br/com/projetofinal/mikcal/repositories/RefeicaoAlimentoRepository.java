package br.com.projetofinal.mikcal.repositories;

import br.com.projetofinal.mikcal.entities.Refeicao;
import br.com.projetofinal.mikcal.entities.RefeicaoAlimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefeicaoAlimentoRepository extends JpaRepository<RefeicaoAlimento,Long> {
    @Query(value = "select r from RefeicaoAlimento r where id_refeicao = :refeicaoId")
    List<RefeicaoAlimento> findRefeicaoAlimentoById_refeicao(@Param("refeicaoId") final Refeicao refeicaoId);
}
