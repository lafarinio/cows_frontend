import { serialize, deserialize, serializeAs, deserializeAs } from 'cerialize';
import { AbstractPosition } from '../../../base/models/abstract-position.model';

export enum CowShedSide {
  A = 'A',
  B = 'B'
}

export class Position implements AbstractPosition {

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
