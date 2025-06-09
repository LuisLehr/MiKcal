package br.com.projetofinal.mikcal.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetofinal.mikcal.dto.LoginDTO;
import br.com.projetofinal.mikcal.dto.LoginResponseDTO;
import br.com.projetofinal.mikcal.security.JwtUtil;
import br.com.projetofinal.mikcal.services.AutenticacaoService;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class LoginController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AutenticacaoService autenticacaoService;

    public LoginController() {
        System.out.println("LoginController inicializado");
    }

    @PostMapping("/test-login")
    public ResponseEntity<?> testLogin(@RequestBody LoginDTO loginDTO) {
        System.out.println("Teste de login recebido: " + loginDTO.getUsername() + ", " + loginDTO.getSenha());
        return ResponseEntity.ok("Teste de login bem-sucedido: " + loginDTO.getUsername());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {

        System.out.println("Recebida requisição de login para: " + loginDTO.getUsername());
        
        try {
            String token = autenticacaoService.autenticar(loginDTO);
            return ResponseEntity.ok(new LoginResponseDTO(token, loginDTO.getUsername()));
        } catch (RuntimeException e) {
            System.out.println("Erro na autenticação: " + e.getMessage());
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Erro inesperado: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno no servidor");
        }
    }
}