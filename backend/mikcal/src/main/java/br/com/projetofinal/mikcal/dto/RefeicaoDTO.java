package br.com.projetofinal.mikcal.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RefeicaoDTO {
    private Long idUsuario;
    private String tipoRefeicao;
    private List<Item> itens;

    @Getter
    @Setter
    public static class Item{
        private Long idAlimento;
        private Double quantidade;
    }
}
