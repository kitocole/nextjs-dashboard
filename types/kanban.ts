export interface CardType {
  id: string;
  content: string;
  order: number;
  columnId: string;
}

export interface ColumnType {
  id: string;
  title: string;
  order: number;
  cards: CardType[];
}

export interface BoardType {
  id: string;
  title: string;
  ownerId: string;
  columns: ColumnType[];
}
