package br.com.projetofinal.mikcal.security;

import br.com.projetofinal.mikcal.controllers.UsuarioController;
import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.projetofinal.mikcal.entities.Usuario;
import br.com.projetofinal.mikcal.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        logger.info("Processando requisição: {}", request.getRequestURI());
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        logger.info("Authorization Header: {}", authHeader != null ? authHeader : "null");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            logger.info("Username extraído: {}", username);
            try {
            if (username != null && jwtUtil.isTokenValid(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
                Usuario usuario = usuarioRepository.findByUsername(username).orElse(null);

                if (usuario != null) {
                    logger.info("Usuário encontrado: {}", usuario.getUsername());
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, null, List.of());
                    authToken.setDetails(usuario);
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("Usuário não encontrado para o username: {}", username);
                }
            } else {
                logger.warn("Token inválido ou autenticação já existe: username {}, valid={}, auth{}",
                       username, jwtUtil.isTokenValid(token), SecurityContextHolder.getContext().getAuthentication() );
            }
        } catch (ExpiredJwtException e){
                logger.error("Token JWT expirado: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token JWT expirado. Faça Login novamente!");
            return;
        } catch(Exception e){
                logger.error("Erro ao processar token jwt: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token JWT inválido!");
            return;
        }
    } else {
            logger.warn("Cabeçalho Authorization ausente ou invalido: {}", authHeader);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/usuario/login") ||
                path.startsWith("/usuario/checar-username") ||
                path.startsWith("/auth/login") ||
                path.startsWith("/error") ||
                path.startsWith("/usuario/cadastro");
    }
}