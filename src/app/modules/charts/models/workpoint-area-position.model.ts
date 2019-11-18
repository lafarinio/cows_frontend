import { serialize, deserialize } from 'cerialize';
import { AbstractPosition } from '../../../base/models/abstract-position.model';

export class WorkpointAreaPosition implements AbstractPosition {
  @serialize
  @deserialize
  posX: number;

  @serialize
  @deserialize
  posY: number;

  @serialize
  @deserialize
  value: number;
}
