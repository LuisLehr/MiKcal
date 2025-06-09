package br.com.projetofinal.mikcal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity
public class MikcalApplication {

	public static void main(String[] args) {
		SpringApplication.run(MikcalApplication.class, args);
	}

}


