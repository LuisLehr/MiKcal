package br.com.projetofinal.mikcal.entities;

// Imports
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
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
@Table(name="refeicao")
public class Refeicao {
    
    // Declarando os atributos
    // Indicando quem será a chave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Id autoincrementavel
    @Column(name="id")
    private Long id;

    // Indicando quem será a chave estrangeira
    @ManyToOne                        // Indicando a cardinalidade da relaçao
    @JoinColumn(name="id_usuario")    // Nome da chave estrangeira
    private Usuario id_usuario;

    @Column(name="datarefeicao")
    private Date dataRefeicao;

    @Column(name="tiporefeicao")
    private String tipoRefeicao;

    @OneToMany(mappedBy = "id_refeicao", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<RefeicaoAlimento> itens;
}