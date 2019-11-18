import { serialize, deserialize, serializeAs, deserializeAs, inheritSerialization } from 'cerialize';
import { dateSerializer } from '../../../base/serializers/date-serializer';
import { Position } from './position.model';

@inheritSerialization(Position)
export class StrictedCowPosition extends Position {
  @serialize
  @deserialize
  id: string;

  @serializeAs(dateSerializer)
  @deserializeAs(dateSerializer)
  time: Date;
}
