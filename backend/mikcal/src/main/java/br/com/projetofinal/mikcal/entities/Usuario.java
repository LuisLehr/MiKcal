package br.com.projetofinal.mikcal.entities;

// Imports
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


// Construtores
@AllArgsConstructor
@NoArgsConstructor

// Getters e Setters
@Getter
@Setter

@Entity
@Table(name="usuario")
public class Usuario {
    
    // Declarando os atributos 
    // Indicando que será a chave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Id autoincrementavel
    @Column(name="id")
    private Long id;

    @Column(name="nome")
    private String nome;

    @Column(name="username")
    private String username;

    @Column(name="senha")
    private String senha;

    @Column(name="email")
    private String email;

    @Column(name="peso")
    private double peso;

    @Column(name="altura")
    private Integer altura;
    
    @Column(name="data_nascimento")
    private LocalDate dataNascimento;

    @Column(name="metacaloria")
    private Integer metaCalorica;
}
