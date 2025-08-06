package br.com.projetofinal.mikcal.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.projetofinal.mikcal.entities.Refeicao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface RefeicaoRepository  extends JpaRepository<Refeicao,Long> {

    @Query("SELECT r FROM Refeicao r WHERE r.id_usuario.id = :usuarioId AND r.dataRefeicao BETWEEN :start AND :end")
    List<Refeicao> findRefeicoesDoDia(Long usuarioId, Date start, Date end);

    Refeicao findRefeicaoById(Long id);
}
