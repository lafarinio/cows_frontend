import { serialize, deserialize, serializeAs, deserializeAs } from 'cerialize';
import { dateSerializer } from '../serializers/date-serializer';

export enum CowShedSide {
  A = 'A',
  B = 'B'
}

export class CowPosition {
  @serialize
  @deserialize
  id: string;

  @serializeAs(dateSerializer)
  @deserializeAs(dateSerializer)
  time: Date;

  @serialize
  @deserialize
  posX: number;

  @serializeAs(CowShedSide)
  @deserializeAs(CowShedSide)
  posY: CowShedSide;
}
