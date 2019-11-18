import { serialize, deserialize, inheritSerialization } from 'cerialize';
import { Position } from './position.model';

@inheritSerialization(Position)
export class AreaPosition extends Position {
  @serialize
  @deserialize
  value: number;
}
