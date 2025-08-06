export interface Refeicao {
  id?: number;
  tipoRefeicao: string;
  dataRefeicao: Date | string;
  id_usuario?: { id: number};
  itens?: RefeicaoAlimento[];
}

export interface RefeicaoAlimento {
  id?: number;
  id_refeicao?: { id?: number };
  id_alimento?: Alimento;
  quantidade?: number;
}

export interface Alimento {
  id: number;
  nome: string;
  kcal: number;
  carboidratos: number;
  proteinas: number;
  unidadeMedida?: {id?: number; descricao?: string; abreviacao?: string};
}
