package br.com.projetofinal.mikcal.services;

import br.com.projetofinal.mikcal.dto.LoginDTO;
import br.com.projetofinal.mikcal.entities.Usuario;
import br.com.projetofinal.mikcal.repositories.UsuarioRepository;
import br.com.projetofinal.mikcal.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public AutenticacaoService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    public String autenticar(LoginDTO loginDTO) {
        System.out.println("Iniciando autenticação para: " + loginDTO.getUsername());
        Usuario usuario = usuarioRepository.findByUsername(loginDTO.getUsername())
            .orElseThrow(() -> {
                System.out.println("Usuário não encontrado: " + loginDTO.getUsername());
                return new RuntimeException("Usuário não encontrado");
            });

        System.out.println("Usuário encontrado: " + usuario.getUsername());
        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            System.out.println("Senha inválida para: " + loginDTO.getUsername());
            throw new RuntimeException("Senha inválida");
        }

        System.out.println("Gerando token para: " + usuario.getUsername());
        String token = jwtUtil.generateToken(usuario.getUsername());
        System.out.println("Token gerado com sucesso");
        return token;
    }
}
