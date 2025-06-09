package br.com.projetofinal.mikcal.exceptions;

public class AlimentoNaoEncontradoException extends RuntimeException {
    public AlimentoNaoEncontradoException(Long id){
        super("Alimento com ID " + id + " não encontrado");
    }
}
