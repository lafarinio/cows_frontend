import { serialize, deserialize, serializeAs, deserializeAs } from 'cerialize';

export enum CowShedSide {
  A = 'A',
  B = 'B'
}

export class Position {

  @serialize
  @deserialize
  posX: number;

  @serializeAs(CowShedSide)
  @deserializeAs(CowShedSide)
  posY: CowShedSide;
}

export enum PositionNames {
  posX = 'posX',
  posY = 'posY',
  value = 'value'
}
