package br.com.projetofinal.mikcal.exceptions;

public class UsuarioNaoEncontradoException extends RuntimeException{
    public UsuarioNaoEncontradoException(Long id) {

        super(id == null ? "Nenhum usuário autenticado" : "Usuário com ID" + id + "Não encontrado");
    }
}
