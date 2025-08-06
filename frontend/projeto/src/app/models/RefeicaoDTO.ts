export interface RefeicaoDTO {
  idUsuario: number;
  tipoRefeicao: string;
  itens: Item[];
}

export interface Item {
  idAlimento: number;
  quantidade: number;
}
