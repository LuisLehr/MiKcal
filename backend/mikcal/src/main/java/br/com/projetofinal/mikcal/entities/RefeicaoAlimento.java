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
@Table(name="refeicao_alimento")
public class RefeicaoAlimento {
    
    // Declarando os atributos
    // Indicando quem será a chave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Id autoincrementavel
    @Column(name="id")
    private Long id;


    // Indicando quem será a chave estrangeira
    @ManyToOne                         // Indicando a cardinalidade da relação
    @JoinColumn(name="id_refeicao")     // Nome da chave estrangeira
    private Refeicao id_refeicao;

    // Indicando quem será a chave estrangeira
    @ManyToOne                  // Indicando a cardinalidade da relação
    @JoinColumn(name="id_alimento")    // Nome da chave estrangeira
    private Alimento id_alimento;

    @Column(name="quantidade")
    private double quantidade;
}
