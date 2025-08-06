package br.com.projetofinal.mikcal.controllers;

import br.com.projetofinal.mikcal.dto.RefeicaoDTO;
import br.com.projetofinal.mikcal.entities.Refeicao;
import br.com.projetofinal.mikcal.entities.RefeicaoAlimento;
import br.com.projetofinal.mikcal.entities.Usuario;
import br.com.projetofinal.mikcal.entities.Alimento;
import br.com.projetofinal.mikcal.exceptions.UsuarioNaoEncontradoException;
import br.com.projetofinal.mikcal.repositories.RefeicaoRepository;
import br.com.projetofinal.mikcal.repositories.RefeicaoAlimentoRepository;
import br.com.projetofinal.mikcal.repositories.UsuarioRepository;
import br.com.projetofinal.mikcal.repositories.AlimentoRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/refeicao")
public class RefeicaoController {

    private static final Logger logger = LoggerFactory.getLogger(RefeicaoController.class);

    private final RefeicaoRepository refeicaoRepo;

    private final AlimentoRepository alimentoRepo;

    private final UsuarioRepository usuarioRepo;

    private final RefeicaoAlimentoRepository refeicaoAlimentoRepo;

    public RefeicaoController(
            RefeicaoRepository refeicaoRepo,
            RefeicaoAlimentoRepository refeicaoAlimentoRepo,
            UsuarioRepository usuarioRepo,
            AlimentoRepository alimentoRepo) {
        this.refeicaoRepo = refeicaoRepo;
        this.alimentoRepo = alimentoRepo;
        this.usuarioRepo = usuarioRepo;
        this.refeicaoAlimentoRepo = refeicaoAlimentoRepo;
    }

    @GetMapping("/usuario/{id}/hoje")
    public ResponseEntity<List<Refeicao>> listarRefeicoesHoje(@PathVariable Long id) {
        logger.info("Listando refeições do dia para usuário ID: {}", id);
        try {
            if (!usuarioRepo.existsById(id)) {
                logger.warn("Usuário com ID {} não encontrado", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            LocalDate hoje = LocalDate.now();
            LocalDateTime startOfDay = hoje.atStartOfDay();
            LocalDateTime endOfDay = hoje.atTime(LocalTime.MAX);
            Date start = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
            Date end = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());

            List<Refeicao> refeicoes = refeicaoRepo.findRefeicoesDoDia(id, start, end);
            for (Refeicao refeicao : refeicoes) {
                List <RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(refeicao);
                refeicao.setItens(itens);
            }

            logger.info("Retornando {} refeições para usuário ID: {}", refeicoes.size(), id);
            return ResponseEntity.ok(refeicoes);
        } catch (Exception e) {
            logger.error("Erro ao listar refeições do usuário ID: {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Refeicao> criarRefeicao(@RequestBody RefeicaoDTO dto) {
        logger.info("Criando refeicao para usuário: {}", dto.getIdUsuario());
        try {
            if (dto.getIdUsuario() == null || dto.getTipoRefeicao() == null || dto.getTipoRefeicao().isEmpty()) {
                logger.error("Campos obrigatórios ausentes no RefeicaoDTO: idUsuario={}, tipoRefeicao={}",
                        dto.getIdUsuario(), dto.getTipoRefeicao());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            Usuario usuario =
                    usuarioRepo
                            .findById(dto.getIdUsuario())
                            .orElseThrow(() -> new UsuarioNaoEncontradoException(dto.getIdUsuario()));

            Refeicao refeicao = new Refeicao();
            refeicao.setId_usuario(usuario);
            refeicao.setDataRefeicao(new Date());
            refeicao.setTipoRefeicao(dto.getTipoRefeicao());

            Refeicao refeicaoSalva = refeicaoRepo.save(refeicao);

            if (dto.getItens() != null && !dto.getItens().isEmpty()) {
                for (RefeicaoDTO.Item item : dto.getItens()) {
                    logger.debug("Processando item: idAlimento={}, quantidade={}", item.getIdAlimento(), item.getQuantidade());
                    Alimento alimento =
                            alimentoRepo
                                    .findById(item.getIdAlimento())
                                    .orElseThrow(() -> new RuntimeException("Alimento com ID " + item.getIdAlimento() + "não encontrado"));
                    RefeicaoAlimento ra = new RefeicaoAlimento();
                    ra.setId_refeicao(refeicaoSalva);
                    ra.setId_alimento(alimento);
                    ra.setQuantidade(item.getQuantidade() != null ? item.getQuantidade() : 0.0);
                    RefeicaoAlimento raSalva = refeicaoAlimentoRepo.save(ra);
                    logger.debug("Item salvo : id={}, quantidade={}", item.getIdAlimento(), item.getQuantidade());
                }
            }

            List<RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(refeicaoSalva);
            refeicaoSalva.setItens(itens);

            return ResponseEntity.ok(refeicaoSalva);
        } catch (UsuarioNaoEncontradoException e) {
            logger.error("Usuário não encontrado: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            logger.error("Erro ao criar refeição: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRefeicao(@PathVariable Long id) {
        logger.info("Excluindo refeição ID: {}", id);
        try {
            if (!refeicaoRepo.existsById(id)) {
                logger.warn("Refeição com ID {} não encontrada", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            refeicaoRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Erro ao excluir refeição ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/usuario/{id}/data")
    public ResponseEntity<List<Refeicao>> listarRefeicoesPorData(@PathVariable Long id, @RequestParam("data") String data) {
        logger.info("Listando refeições para usuário: {} na data: {}", id, data);
        try {
            if (!usuarioRepo.existsById(id)) {
                logger.warn("Usuário com ID {} não encontrado", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            LocalDate localDate = LocalDate.parse(data);
            LocalDateTime startOfDay = localDate.atStartOfDay();
            LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);
            Date start = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
            Date end = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
            List <Refeicao> refeicoes = refeicaoRepo.findRefeicoesDoDia(id, start, end);
            for (Refeicao refeicao : refeicoes) {
                List<RefeicaoAlimento> itens = refeicaoAlimentoRepo.findRefeicaoAlimentoById_refeicao(refeicao);
                refeicao.setItens(itens);
            }
            logger.info("Retornando {} refeições para usuário ID: {}", refeicoes.size(), id);
             return ResponseEntity.ok(refeicoes);
        } catch (Exception e) {
            logger.error("Erro ao listar refeições do usuário ID: {} na data: {}: {}", id, data, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}