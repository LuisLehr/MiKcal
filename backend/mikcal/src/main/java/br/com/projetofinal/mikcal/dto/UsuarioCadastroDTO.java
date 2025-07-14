package br.com.projetofinal.mikcal.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioCadastroDTO {

    private String nome;
    private String username;
    private String senha;
    private String email;
    private double peso;
    private Integer altura;
    private Integer metaCalorica;
    private String dataNascimento;  // formato: "yyyy-mm-dd"
}
