package br.com.projetofinal.mikcal.entities;

// Imports
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
@Table(name="unidademedida")
public class UnidadeMedida {
    
    // Declarando os atributos
    // Indicando que será a chave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Id autoincrementavel
    @Column(name="id")
    private Long id;

    @Column(name="descricao")
    private String descricao;
}
