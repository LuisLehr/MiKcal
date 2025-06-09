package br.com.projetofinal.mikcal.exceptions;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class ManipuladorGlobalDeExcecoes {

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<Object> tratarUsuarioNaoEncontrado(UsuarioNaoEncontradoException ex) {
        return gerarRespostaErro(HttpStatus.NOT_FOUND, "Usuário não encontrado", ex.getMessage());
    }

    @ExceptionHandler(AlimentoNaoEncontradoException.class)
    public ResponseEntity<Object> tratarAlimentoNaoEncontrado(AlimentoNaoEncontradoException  ex) {
        return gerarRespostaErro(HttpStatus.NOT_FOUND, "Alimento não encontrado", ex.getMessage());
    }

    private ResponseEntity<Object> gerarRespostaErro (HttpStatus status, String erro, String mensagem) {
        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", Instant.now());
        corpo.put("status", status.value());
        corpo.put("erro", erro);
        corpo.put("mensagem", mensagem);
        return new ResponseEntity<>(corpo, status);
    }

}
