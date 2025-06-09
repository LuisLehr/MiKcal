package br.com.projetofinal.mikcal.dto;

public class LoginResponseDTO {
    private String token;
    private String username;

    public LoginResponseDTO(String token, String username) {
        this.token = token;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }
}
