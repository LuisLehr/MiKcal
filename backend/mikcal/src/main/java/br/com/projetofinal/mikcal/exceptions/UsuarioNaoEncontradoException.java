package br.com.projetofinal.mikcal.exceptions;

public class UsuarioNaoEncontradoException extends RuntimeException{
    public UsuarioNaoEncontradoException(Long id) {
        super("Usuário com ID " + id + " não encontrado");
    }
}
