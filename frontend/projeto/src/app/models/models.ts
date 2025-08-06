export interface Refeicao {
  id?: number;
  tipoRefeicao: string;
  dataRefeicao: Date | string;
  id_usuario?: { id: number };
  itens?: RefeicaoAlimento[];
}

export interface RefeicaoAlimento {
  id?: number;
  id_refeicao?: { id?: number };
  id_alimento: Alimento;
  quantidade: number;
}

export interface Alimento {
  id: number;
  nome: string;
  kcal: number;
  carboidratos: number;
  proteinas: number;
  unidadeMedida?: { id?: number; descricao?: string; abreviacao?: string };
}

export interface RefeicaoDTO {
  idUsuario: number;
  tipoRefeicao: string;
  itens: Item[];
}

export interface Item {
  idAlimento: number;
  quantidade: number;
}

export interface Usuario {
  id: number;
  nome: string;
  username: string;
  email: string;
  peso: number;
  altura: number;
  dataNascimento: string;
  metaCalorica: number;
}
