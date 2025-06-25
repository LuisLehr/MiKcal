package br.com.projetofinal.mikcal.entities;

// Imports
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name="alimento")
public class Alimento {

    // Declarando os atributos
    // Indicando quem será a chave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Id autoincrementavel
    @Column(name="id")
    private Long id;

    @Column(name="nome")
    private String nome;

    @Column(name="kcal")
    private double kcal;

    @Column(name="carboidratos")
    private double carboidratos;

    @Column(name="proteinas")
    private double proteinas;

    // Indicando quem será a chave estrangeira
    @ManyToOne                             // Indicando a cardinalidade da relação
    @JoinColumn(name="id_unidademedida")   // Nome da chave estrangeira
    private UnidadeMedida unidadeMedida;

}