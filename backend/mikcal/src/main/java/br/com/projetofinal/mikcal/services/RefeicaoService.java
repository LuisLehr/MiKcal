package br.com.projetofinal.mikcal.services;

import br.com.projetofinal.mikcal.entities.Refeicao;
import br.com.projetofinal.mikcal.entities.RefeicaoAlimento;
import br.com.projetofinal.mikcal.entities.Usuario;
import br.com.projetofinal.mikcal.repositories.RefeicaoAlimentoRepository;
import br.com.projetofinal.mikcal.repositories.RefeicaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Date;
import java.util.Calendar;

@Service
public class RefeicaoService {
    private final RefeicaoRepository repository;
    private final RefeicaoAlimentoRepository refeicaoAlimentoRepo;

    public RefeicaoService(RefeicaoRepository repository, RefeicaoAlimentoRepository refeicaoAlimentoRepo) {
        this.repository = repository;
        this.refeicaoAlimentoRepo = refeicaoAlimentoRepo;
    }

    public List<Refeicao> listarPorUsuarioHoje(Long idUsuario) {
// Define o intervalo do dia atual (de 00:00 até 23:59)
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date start = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        Date end = calendar.getTime();
        List<Refeicao> refeicoes = repository.findRefeicoesDoDia(idUsuario, start, end);
        for (Refeicao refeicao : refeicoes) {
            List<RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(this.repository.findRefeicaoById(refeicao.getId()));
            refeicao.setItens(itens);
        }
        return refeicoes;
    }

    public Refeicao salvar(Refeicao refeicao) {
        if (refeicao.getDataRefeicao() == null) {
            refeicao.setDataRefeicao(new Date()); // Define a data atual se não fornecida
        }
        Refeicao refeicaoSalva = repository.save(refeicao);
        List<RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(this.repository.findRefeicaoById(refeicaoSalva.getId()));
        refeicaoSalva.setItens(itens);
        return refeicaoSalva;
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}