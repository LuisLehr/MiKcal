package br.com.projetofinal.mikcal.services;

import br.com.projetofinal.mikcal.entities.Refeicao;
import br.com.projetofinal.mikcal.entities.RefeicaoAlimento;
import br.com.projetofinal.mikcal.entities.Usuario;
import br.com.projetofinal.mikcal.repositories.RefeicaoAlimentoRepository;
import br.com.projetofinal.mikcal.repositories.RefeicaoRepository;
import br.com.projetofinal.mikcal.repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RefeicaoService {

    private final Logger logger = LoggerFactory.getLogger(RefeicaoService.class);
    private final RefeicaoRepository repository;
    private final RefeicaoAlimentoRepository refeicaoAlimentoRepo;
    private final UsuarioRepository usuarioRepo;

    public RefeicaoService(RefeicaoRepository repository, RefeicaoAlimentoRepository refeicaoAlimentoRepo, UsuarioRepository usuarioRepo) {
        this.repository = repository;
        this.refeicaoAlimentoRepo = refeicaoAlimentoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public List<Refeicao> listarPorUsuarioHoje(Long idUsuario) {
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
            List<RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(refeicao);
            refeicao.setItens(itens);
        }
        return refeicoes;
    }

    public Refeicao salvar(Refeicao refeicao) {
        if (refeicao.getDataRefeicao() == null) {
            refeicao.setDataRefeicao(new Date());
        }
        Refeicao refeicaoSalva = repository.save(refeicao);
        List<RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(refeicaoSalva);
        refeicaoSalva.setItens(itens);
        return refeicaoSalva;
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public Map<String, Object> getCalorieDataByPeriod(Long userId, String period, Date startDate) {

        logger.info("Buscando dados de calorias para usuário ID: {}, período: {}, startDate: {}", userId, period,  startDate);

        try {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date start = calendar.getTime();

            if ("weekly".equalsIgnoreCase(period)) {
                calendar.add(Calendar.DAY_OF_MONTH, 6);
            } else if ("monthly".equalsIgnoreCase(period)) {
                calendar.add(Calendar.MONTH, 1);
                calendar.add(Calendar.DAY_OF_MONTH, -1);
            }
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
            calendar.set(Calendar.MILLISECOND, 999);
            Date end = calendar.getTime();

            List<Refeicao> refeicoes = repository.findRefeicoesDoDia(userId, start, end);
            Map<String, Double> calorieByDate = new TreeMap<>();

            // Inicializar datas com 0 calorias
            Calendar tempCal = Calendar.getInstance();
            tempCal.setTime(start);
            while (!tempCal.getTime().after(end)) {
                String dateKey = String.format("%tF", tempCal.getTime());
                calorieByDate.put(dateKey, 0.0);
                tempCal.add(Calendar.DAY_OF_MONTH, 1);
            }

            // Agregar calorias
            for (Refeicao refeicao : refeicoes) {
                List<RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(refeicao);
                double totalCalories = itens.stream()
                        .mapToDouble(item -> item.getId_alimento().getKcal() * item.getQuantidade())
                        .sum();
                String dateKey = String.format("%tF", refeicao.getDataRefeicao());
                calorieByDate.merge(dateKey, totalCalories, Double::sum);
            }


            // Busca meta calórica do usuário
            Usuario usuario = usuarioRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));


            // Preparar resposta
            List<Map<String, Object>> calorieData = calorieByDate.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("date", entry.getKey());
                        map.put("calories", entry.getValue());
                        return map;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("calorieData", calorieData);
            response.put("metaCalorica", usuario.getMetaCalorica());

            logger.info("Retornando {} registros de calorias para usuário ID: {}", calorieData.size(), userId);
            return response;
        } catch (Exception e) {
            logger.error("Erro ao processar dados de calorias para usuário ID: {}, período: {}, startdate:{}",  userId, period, startDate, e);
            throw e;
        }
    }
}